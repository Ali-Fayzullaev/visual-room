"use client";

import { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import Room from "@/components/Room";
import ControlPanel from "@/components/ControlPanel";
import { DEFAULT_CONFIG, type RoomConfig } from "@/lib/config";

export default function Home() {
  const [config, setConfig] = useState<RoomConfig>(DEFAULT_CONFIG);

  const handleChange = useCallback(
    (key: keyof RoomConfig, value: string) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return (
    <main className="relative w-screen h-screen">
      <Canvas
        shadows
        camera={{ position: [6, 5, 6], fov: 50 }}
        className="!absolute inset-0"
      >
        <Room config={config} />
      </Canvas>

      <ControlPanel config={config} onChange={handleChange} />
    </main>
  );
}
