"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import RoomModel from "@/components/RoomModel";
import Hotspot from "@/components/Hotspot";
import { HOTSPOTS, type RoomState } from "@/lib/config";

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
      camera={{ position: [5, 4, 6], fov: 50 }}
      className="!absolute inset-0"
      gl={{ antialias: true, toneMapping: 3 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 4, 0]} intensity={0.8} color="#fff5e6" />
      <hemisphereLight intensity={0.4} color="#ffffff" groundColor="#444444" />

      <Environment preset="apartment" />

      <Suspense fallback={null}>
        <RoomModel state={state} />
      </Suspense>

      {/* Hotspot-кнопки */}
      {HOTSPOTS.map((hs) => (
        <Hotspot
          key={hs.id}
          hotspot={hs}
          isActive={activeHotspot === hs.id}
          onClick={() => onHotspotClick(hs.id)}
        />
      ))}

      <OrbitControls
        makeDefault
        minDistance={3}
        maxDistance={14}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={[0, 1, 0]}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
