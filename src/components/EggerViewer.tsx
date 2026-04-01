"use client";

import { Suspense, useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useThree, useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import * as THREE from "three";
import type { Zone3DConfig } from "@/lib/config";

/* ═══════════════════════════════════════════════════════════
   Egger-style 3D Viewer
   ─ Fixed camera (no orbit/rotate/pan)
   ─ Studio-quality lighting
   ─ Click-on-surface zone selection
   ═══════════════════════════════════════════════════════════ */

/* ───── Loading spinner ───── */
function Loader() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 2; });
  return (
    <mesh ref={ref} position={[0, 0.5, 0]}>
      <boxGeometry args={[0.15, 0.15, 0.15]} />
      <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
    </mesh>
  );
}

/* ───── Material zone map builder ───── */
function buildMaterialZoneMap(zones: Zone3DConfig[]): Record<string, { zoneId: string; settings: Zone3DConfig }> {
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
      if (!mat?.name || originalMats.current.has(mat.uuid)) return;
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
      if (!mat?.name) return;

      const mapping = matZoneMap[mat.name];
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
      if (!mat?.name) return;
      const mapping = matZoneMap[mat.name];
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
      const mapping = mat?.name ? matZoneMap[mat.name] : undefined;
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
      const mapping = mat?.name ? matZoneMap[mat.name] : undefined;
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

/* ───── Fixed Camera Scene (Egger-style — no orbit controls) ───── */
function FixedScene({
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
  const { camera, gl } = useThree();

  // Set camera once and lock it
  useEffect(() => {
    camera.position.set(...cameraPos);
    camera.lookAt(new THREE.Vector3(...cameraTarget));
    camera.updateProjectionMatrix();
  }, [camera, cameraPos, cameraTarget]);

  // Professional tone mapping
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.15;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);

  return (
    <>
      {/* ── Studio quality lighting ── */}

      {/* Key light — warm directional (sun-like) */}
      <directionalLight
        position={[4, 8, 6]}
        intensity={1.4}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0002}
        shadow-normalBias={0.05}
      />

      {/* Fill light — cool, soft */}
      <directionalLight
        position={[-3, 5, -2]}
        intensity={0.4}
        color="#d6e8ff"
      />

      {/* Environment — hemisphere for ambient color */}
      <hemisphereLight
        color="#e8edf5"
        groundColor="#b8a898"
        intensity={0.7}
      />

      {/* Ambient — very subtle global fill */}
      <ambientLight intensity={0.15} />

      {/* Rim/accent light from behind for depth */}
      <pointLight position={[-2, 3, -4]} intensity={0.3} color="#ffd6aa" />

      {/* Model */}
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
  activeZone: string | null;
  onZoneClick?: (zoneId: string) => void;
}

export default function EggerViewer({
  modelPath,
  state,
  zones,
  cameraPos = [0, 1.0, 3.2],
  cameraTarget = [0, 0.7, 0],
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
        }}
        camera={{
          fov: 40,
          near: 0.1,
          far: 100,
          position: cameraPos,
        }}
        style={{ background: "#f5f5f0" }}
        /* No touch-action needed — camera is fixed, surfaces are clickable */
      >
        <Suspense fallback={<Loader />}>
          <FixedScene
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

      {/* Zone hint overlay (shows when hovering a surface) */}
      {hoveredZone && (
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-sm font-medium pointer-events-none transition-opacity">
          {zones.find((z) => z.id === hoveredZone)?.label || hoveredZone}
          <span className="text-emerald-400 ml-2 text-xs">нажмите для выбора</span>
        </div>
      )}
    </div>
  );
}
