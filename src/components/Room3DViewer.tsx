"use client";

import { Suspense, useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useThree, useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader, OrbitControls } from "three-stdlib";
import * as THREE from "three";
import type { Zone3DConfig } from "@/lib/config";

/* ───────────── Zone → GLTF material mapping ───────────── */

function buildMaterialZoneMap(zones: Zone3DConfig[]): Record<string, { zoneId: string; settings: Zone3DConfig }> {
  const map: Record<string, { zoneId: string; settings: Zone3DConfig }> = {};
  for (const zone of zones) {
    for (const matName of zone.materialNames) {
      map[matName] = { zoneId: zone.id, settings: zone };
    }
  }
  return map;
}

/* ───────────── Loading indicator ───────────── */

function Loader() {
  return (
    <mesh position={[0, 0.3, 0]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.7} />
    </mesh>
  );
}

/* ───────────── Room 3D Model ───────────── */

interface RoomModelProps {
  modelPath: string;
  state: Record<string, string>;
  zones: Zone3DConfig[];
  onMeshPointerOver?: (zone: string | null) => void;
}

function RoomModel({ modelPath, state, zones, onMeshPointerOver }: RoomModelProps) {
  const gltf = useLoader(GLTFLoader, modelPath);
  const scene = gltf.scene;
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const textureCache = useRef<Record<string, THREE.Texture>>({});
  const originalMats = useRef<
    Map<string, {
      map: THREE.Texture | null;
      emissiveMap: THREE.Texture | null;
      color: THREE.Color;
      emissive: THREE.Color;
      emissiveIntensity: number;
      roughness: number;
      metalness: number;
    }>
  >(new Map());

  const matZoneMap = useMemo(() => buildMaterialZoneMap(zones), [zones]);

  // Clone scene & materials on mount so we can mutate freely
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
      }
    });
    return clone;
  }, [scene]);

  // Save original material state
  useEffect(() => {
    if (originalMats.current.size > 0) return;
    clonedScene.traverse((child: THREE.Object3D) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat?.name || originalMats.current.has(mat.uuid)) return;
      originalMats.current.set(mat.uuid, {
        map: mat.map,
        emissiveMap: mat.emissiveMap,
        color: mat.color.clone(),
        emissive: mat.emissive.clone(),
        emissiveIntensity: mat.emissiveIntensity,
        roughness: mat.roughness,
        metalness: mat.metalness,
      });
    });
  }, [clonedScene]);

  // Apply material overrides based on state
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

      // Empty value → restore original
      if (!value && original) {
        mat.map = original.map;
        mat.emissiveMap = original.emissiveMap;
        mat.color.copy(original.color);
        mat.emissive.copy(original.emissive);
        mat.emissiveIntensity = original.emissiveIntensity;
        mat.roughness = original.roughness;
        mat.metalness = original.metalness;
        mat.needsUpdate = true;
        return;
      }

      if (!value) return;

      const isTexture = value.startsWith("/");
      const [rx, ry] = settings.textureRepeat;

      if (isTexture) {
        // Load / cache texture
        const cacheKey = `${value}_${rx}_${ry}`;
        if (!textureCache.current[cacheKey]) {
          const tex = textureLoader.load(value);
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(rx, ry);
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          textureCache.current[cacheKey] = tex;
        }
        const tex = textureCache.current[cacheKey];
        mat.map = tex;
        mat.emissiveMap = tex;
        mat.emissiveIntensity = 0.35;
        mat.color.set(0xffffff);
        mat.emissive.set(0xffffff);
        mat.roughness = settings.roughness;
        mat.metalness = settings.metalness;
        mat.needsUpdate = true;
      } else {
        // Color
        mat.map = null;
        mat.emissiveMap = null;
        mat.color.set(value);
        mat.emissive.set(value);
        mat.emissiveIntensity = 0.25;
        mat.roughness = settings.roughness;
        mat.metalness = settings.metalness;
        mat.needsUpdate = true;
      }
    });
  }, [clonedScene, state, matZoneMap, textureLoader]);

  return <primitive object={clonedScene} />;
}

/* ───────────── Scene (lighting + controls + model + effects) ───────────── */

function CameraControls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    controlsRef.current = new OrbitControls(camera, gl.domElement);
    controlsRef.current.enablePan = true;
    controlsRef.current.enableZoom = true;
    controlsRef.current.enableRotate = true;
    controlsRef.current.minDistance = 0.6;
    controlsRef.current.maxDistance = 6;
    controlsRef.current.minPolarAngle = 0.1;
    controlsRef.current.maxPolarAngle = Math.PI / 2 + 0.2;
    controlsRef.current.dampingFactor = 0.06;
    controlsRef.current.enableDamping = true;
    controlsRef.current.panSpeed = 0.5;
    controlsRef.current.rotateSpeed = 0.5;

    return () => {
      controlsRef.current?.dispose();
    };
  }, [camera, gl]);

  useFrame(() => {
    controlsRef.current?.update();
  });

  return null;
}

function Scene({
  modelPath,
  state,
  zones,
  viewPreset,
}: {
  modelPath: string;
  state: Record<string, string>;
  zones: Zone3DConfig[];
  viewPreset: "default" | "wall" | "sofa" | "floor" | "ceiling";
}) {
  const { gl, camera } = useThree();

  useEffect(() => {
    const presets: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
      default: { pos: [0, 0.8, 2.8], target: [0, 0.8, 0] },
      wall: { pos: [0, 1.3, 1.25], target: [0, 1, 0] },
      sofa: { pos: [2.4, 1.1, 0.8], target: [0.2, 0.8, 0] },
      floor: { pos: [0.6, 3.5, 0.7], target: [0, 0.8, 0] },
      ceiling: { pos: [0, 2.2, 1.5], target: [0, 1.1, 0] },
    };

    const preset = presets[viewPreset] || presets.default;
    camera.position.set(...preset.pos);
    camera.lookAt(...preset.target);
  }, [viewPreset, camera]);

  // Improve quality
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.1;
  }, [gl]);

  // Improve quality
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.1;
  }, [gl]);

  return (
    <>
      <CameraControls />

      {/*настройка освещения для реалистичной пастирующей комнаты*/}
      <hemisphereLight color="#d8e8ff" groundColor="#3a3a3a" intensity={0.8} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-bias={-0.0001}
      />
      <ambientLight intensity={0.18} />
      <pointLight position={[0, 4, -4]} intensity={0.5} color="#ffeedd" />

      {/* 3D Room Model */}
      <RoomModel modelPath={modelPath} state={state} zones={zones} />

      {/* визуальный контакт с полом для реализма */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#111a24" roughness={0.9} metalness={0.1} />
      </mesh>
    </>
  );
}

/* ───────────── Main exported component ───────────── */

interface Room3DViewerProps {
  modelPath: string;
  state: Record<string, string>;
  zones: Zone3DConfig[];
  viewPreset: "default" | "wall" | "sofa" | "floor" | "ceiling";
}

export default function Room3DViewer({ modelPath, state, zones, viewPreset }: Room3DViewerProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [0, 0.8, 2.8],
        }}
        className="touch-none"
        style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        <color attach="background" args={["#111827"]} />
        <fog attach="fog" args={["#111827", 8, 20]} />
        <Suspense fallback={<Loader />}>
          <Scene modelPath={modelPath} state={state} zones={zones} viewPreset={viewPreset} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload model
useLoader.preload(GLTFLoader, "/cozy_modern_living_room/scene.gltf");
