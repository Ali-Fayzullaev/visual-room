"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RoomModel from "@/components/RoomModel";
import Hotspot from "@/components/Hotspot";
import { HOTSPOTS, MODEL_SCALE, MODEL_POSITION, type RoomState } from "@/lib/config";

interface SceneProps {
  state: RoomState;
  activeHotspot: string | null;
  onHotspotClick: (id: string) => void;
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/** Настройка сцены */
function SceneSetup() {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMappingExposure = 1.0;
  }, [gl]);
  return null;
}

export default function Scene({ state, activeHotspot, onHotspotClick }: SceneProps) {
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    if (!isWebGLAvailable()) setWebglOk(false);
  }, []);

  if (!webglOk) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-900 text-white">
        <p className="text-xl mb-4">WebGL недоступен</p>
        <p className="text-white/60 text-sm mb-6 text-center max-w-md">
          Закройте все вкладки браузера и перезапустите браузер, затем откройте страницу заново.
          Убедитесь, что аппаратное ускорение включено в настройках браузера.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          Обновить
        </button>
      </div>
    );
  }

  return (
    <Canvas
      shadows
      camera={{ position: [5, 3.5, 6], fov: 45 }}
      className="!absolute inset-0"
      gl={{ antialias: true, toneMapping: 3 }}
    >
      <SceneSetup />

      {/* Освещение без внешних HDR */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-3, 5, -3]} intensity={0.3} />
      <hemisphereLight intensity={0.4} color="#ffffff" groundColor="#8d7c6b" />

      <Suspense fallback={null}>
        <RoomModel state={state} />
      </Suspense>

      {/* Hotspot-кнопки — в той же системе координат, что и модель */}
      <group position={MODEL_POSITION} scale={MODEL_SCALE}>
        {HOTSPOTS.map((hs) => (
          <Hotspot
            key={hs.id}
            hotspot={hs}
            isActive={activeHotspot === hs.id}
            onClick={() => onHotspotClick(hs.id)}
          />
        ))}
      </group>

      <OrbitControls
        makeDefault
        minDistance={3}
        maxDistance={12}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={[1.5, 1.2, 0]}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
