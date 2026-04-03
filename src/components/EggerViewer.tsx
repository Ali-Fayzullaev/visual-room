"use client";

import { Suspense, useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useThree, useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import * as THREE from "three";
import type { Zone3DConfig } from "@/lib/config";

/* ═══════════════════════════════════════════════════════════
  3D Viewer
  ─ Stable lighting (no external presets)
  ─ Click-on-surface zone selection
  ═══════════════════════════════════════════════════════════ */

/* ───── Elegant loading spinner ───── */
function Loader() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 1.5;
      ref.current.rotation.x += dt * 0.5;
    }
  });
  return (
    <group>
      <mesh ref={ref} position={[0, 0.5, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Floor reflection hint */}
      <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color="#000000" opacity={0.1} transparent />
      </mesh>
    </group>
  );
}

/* ───── Material zone map builder ───── */
function buildMaterialZoneMap(
  zones: Zone3DConfig[]
): Record<string, { zoneId: string; settings: Zone3DConfig }> {
  const map: Record<string, { zoneId: string; settings: Zone3DConfig }> = {};
  for (const zone of zones) {
    for (const matName of zone.materialNames) {
      map[matName] = { zoneId: zone.id, settings: zone };
    }
  }
  return map;
}

/* ───── 3D Room Model with interactive click ───── */
interface RoomModelProps {
  modelPath: string;
  state: Record<string, string>;
  zones: Zone3DConfig[];
  onZoneClick?: (zoneId: string) => void;
  hoveredZone: string | null;
  onHoverZone: (zoneId: string | null) => void;
}

function RoomModel({ modelPath, state, zones, onZoneClick, hoveredZone, onHoverZone }: RoomModelProps) {
  const gltf = useLoader(GLTFLoader, modelPath);
  const scene = gltf.scene;
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const textureCache = useRef<Record<string, THREE.Texture>>({});
  const originalMats = useRef<
    Map<string, {
      map: THREE.Texture | null;
      color: THREE.Color;
      roughness: number;
      metalness: number;
      emissiveIntensity: number;
    }>
  >(new Map());

  const matZoneMap = useMemo(() => buildMaterialZoneMap(zones), [zones]);

  // Clone scene on mount
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else {
          mesh.material = mesh.material.clone();
        }
        // Enable shadows
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  // Save original materials
  useEffect(() => {
    if (originalMats.current.size > 0) return;
    clonedScene.traverse((child: THREE.Object3D) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (!mat || originalMats.current.has(mat.uuid)) return;
      originalMats.current.set(mat.uuid, {
        map: mat.map,
        color: mat.color.clone(),
        roughness: mat.roughness,
        metalness: mat.metalness,
        emissiveIntensity: mat.emissiveIntensity,
      });
    });
  }, [clonedScene]);

  // Apply materials
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat) return;

      const matName = mat.name ?? "";
      const mapping = matZoneMap[matName];
      if (!mapping) return;

      const { zoneId, settings } = mapping;
      const value = state[zoneId];
      const original = originalMats.current.get(mat.uuid);

      // Restore original if no override
      if (!value && original) {
        mat.map = original.map;
        mat.color.copy(original.color);
        mat.roughness = original.roughness;
        mat.metalness = original.metalness;
        mat.emissiveIntensity = original.emissiveIntensity;
        mat.emissive.set(0x000000);
        mat.needsUpdate = true;
        return;
      }
      if (!value) return;

      const isTexture = value.startsWith("/");
      const [rx, ry] = settings.textureRepeat;

      if (isTexture) {
        const cacheKey = `${value}_${rx}_${ry}`;
        if (!textureCache.current[cacheKey]) {
          const tex = textureLoader.load(value);
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(rx, ry);
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.colorSpace = THREE.SRGBColorSpace;
          textureCache.current[cacheKey] = tex;
        }
        const tex = textureCache.current[cacheKey];
        mat.map = tex;
        mat.color.set(0xffffff);
        mat.emissive.set(0x000000);
        mat.emissiveIntensity = 0;
        mat.roughness = settings.roughness;
        mat.metalness = settings.metalness;
      } else {
        mat.map = null;
        mat.color.set(value);
        mat.emissive.set(0x000000);
        mat.emissiveIntensity = 0;
        mat.roughness = settings.roughness;
        mat.metalness = settings.metalness;
      }
      mat.needsUpdate = true;
    });
  }, [clonedScene, state, matZoneMap, textureLoader]);

  // Hover highlight effect
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (!mat) return;
      const matName = mat.name ?? "";
      const mapping = matZoneMap[matName];
      if (!mapping) return;

      if (hoveredZone === mapping.zoneId) {
        mat.emissive.set(0xef4444);
        mat.emissiveIntensity = 0.08;
      } else {
        // Reset emissive unless using original material
        const value = state[mapping.zoneId];
        if (value) {
          mat.emissive.set(0x000000);
          mat.emissiveIntensity = 0;
        }
      }
      mat.needsUpdate = true;
    });
  }, [hoveredZone, clonedScene, matZoneMap, state]);

  // Pointer handlers for click-on-surface zone selection
  const handlePointerMove = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      e.stopPropagation?.();
      const mesh = e.object as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const mapping = mat ? matZoneMap[mat.name ?? ""] : undefined;
      onHoverZone(mapping?.zoneId ?? null);
      document.body.style.cursor = mapping ? "pointer" : "default";
    },
    [matZoneMap, onHoverZone]
  );

  const handlePointerOut = useCallback(() => {
    onHoverZone(null);
    document.body.style.cursor = "default";
  }, [onHoverZone]);

  const handleClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      e.stopPropagation?.();
      const mesh = e.object as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const mapping = mat ? matZoneMap[mat.name ?? ""] : undefined;
      if (mapping && onZoneClick) onZoneClick(mapping.zoneId);
    },
    [matZoneMap, onZoneClick]
  );

  return (
    <primitive
      object={clonedScene}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
}

/* ───── Auto-fit camera to loaded model ───── */
function AutoCamera({ modelPath, cameraPos, cameraTarget }: {
  modelPath: string;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
}) {
  const { camera } = useThree();
  const gltf = useLoader(GLTFLoader, modelPath);
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current) return;
    fitted.current = true;

    // Compute bounding box of entire scene
    const box = new THREE.Box3().setFromObject(gltf.scene);
    if (!box.isEmpty()) {
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = (camera as THREE.PerspectiveCamera).fov ?? 50;
      const fovRad = (fov * Math.PI) / 180;
      // Distance to fit the whole model
      const dist = (maxDim / 2) / Math.tan(fovRad / 2) * 1.5;

      // Position camera slightly above and in front of the model
      camera.position.set(
        center.x + dist * 0.4,
        center.y + dist * 0.25,
        center.z + dist * 0.85
      );
      camera.lookAt(center);
      (camera as THREE.PerspectiveCamera).near = dist * 0.001;
      (camera as THREE.PerspectiveCamera).far = dist * 20;
      camera.updateProjectionMatrix();
    } else {
      // Fallback to provided values
      camera.position.set(...cameraPos);
      camera.lookAt(new THREE.Vector3(...cameraTarget));
      camera.updateProjectionMatrix();
    }
  }, [gltf.scene, camera, cameraPos, cameraTarget]);

  return null;
}

/* ───── Scene lighting ───── */
function Scene({
  modelPath,
  state,
  zones,
  cameraPos,
  cameraTarget,
  onZoneClick,
  hoveredZone,
  onHoverZone,
}: {
  modelPath: string;
  state: Record<string, string>;
  zones: Zone3DConfig[];
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  onZoneClick?: (zoneId: string) => void;
  hoveredZone: string | null;
  onHoverZone: (zoneId: string | null) => void;
}) {
  const { gl } = useThree();

  /* Auto-detect scale from camera distance */
  const scale = useMemo(() => {
    const dist = Math.hypot(...cameraPos);
    return dist > 30 ? dist / 6 : 1;
  }, [cameraPos]);

  const [tx, ty, tz] = cameraTarget;

  // Tone mapping only (camera handled by AutoCamera)

  // Tone mapping
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.2;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  return (
    <>
      {/* Local studio lights only (no remote HDR fetch) */}

      {/* ── Key light — warm, strong directional ── */}
      <directionalLight
        position={[tx + 4 * scale, ty + 10 * scale, tz + 6 * scale]}
        intensity={2.0}
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5 * scale}
        shadow-camera-far={40 * scale}
        shadow-camera-left={-10 * scale}
        shadow-camera-right={10 * scale}
        shadow-camera-top={10 * scale}
        shadow-camera-bottom={-10 * scale}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02 * scale}
      />

      {/* ── Fill light — cool side fill ── */}
      <directionalLight
        position={[tx - 5 * scale, ty + 6 * scale, tz - 3 * scale]}
        intensity={0.6}
        color="#d0e0ff"
      />

      {/* ── Back/rim light for depth & drama ── */}
      <directionalLight
        position={[tx - 2 * scale, ty + 4 * scale, tz - 8 * scale]}
        intensity={0.5}
        color="#ffeedd"
      />

      {/* ── Hemisphere for natural sky/ground ambience ── */}
      <hemisphereLight color="#f0f4ff" groundColor="#c0a888" intensity={0.5} />

      {/* ── Subtle ambient fill ── */}
      <ambientLight intensity={scale > 1 ? 0.35 : 0.12} />

      {/* ── Accent point lights for sparkle on metals ── */}
      <pointLight
        position={[tx + 3 * scale, ty + 2 * scale, tz + 3 * scale]}
        intensity={0.4}
        color="#ffffff"
        distance={15 * scale}
        decay={2}
      />
      <pointLight
        position={[tx - 4 * scale, ty + 1 * scale, tz + 5 * scale]}
        intensity={0.2}
        color="#ffd6aa"
        distance={12 * scale}
        decay={2}
      />

      {/* ── Model ── */}
      <RoomModel
        modelPath={modelPath}
        state={state}
        zones={zones}
        onZoneClick={onZoneClick}
        hoveredZone={hoveredZone}
        onHoverZone={onHoverZone}
      />

    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   Exported Component
   ═══════════════════════════════════════════════════════════ */

interface EggerViewerProps {
  modelPath: string;
  state: Record<string, string>;
  zones: Zone3DConfig[];
  cameraPos?: [number, number, number];
  cameraTarget?: [number, number, number];
  fov?: number;
  activeZone: string | null;
  onZoneClick?: (zoneId: string) => void;
}

export default function EggerViewer({
  modelPath,
  state,
  zones,
  cameraPos = [0, 1.0, 3.2],
  cameraTarget = [0, 0.7, 0],
  fov = 38,
  activeZone,
  onZoneClick,
}: EggerViewerProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
          preserveDrawingBuffer: true,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{
          fov,
          near: Math.max(0.1, Math.hypot(...cameraPos) * 0.001),
          far: Math.max(100, Math.hypot(...cameraPos) * 20),
          position: cameraPos,
        }}
        style={{ background: "linear-gradient(180deg, #f8f6f3 0%, #eee9e3 100%)" }}
      >
        <Suspense fallback={<Loader />}>
          <Scene
            modelPath={modelPath}
            state={state}
            zones={zones}
            cameraPos={cameraPos}
            cameraTarget={cameraTarget}
            onZoneClick={onZoneClick}
            hoveredZone={hoveredZone}
            onHoverZone={setHoveredZone}
          />
        </Suspense>
      </Canvas>

      {/* Zone hint overlay */}
      {hoveredZone && (
        <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-black/70 backdrop-blur-md text-white text-sm font-medium pointer-events-none transition-all shadow-lg">
          {zones.find((z) => z.id === hoveredZone)?.label || hoveredZone}
          <span className="text-red-400 ml-2 text-xs">нажмите для выбора</span>
        </div>
      )}
    </div>
  );
}
