"use client";

import { Canvas } from "@react-three/fiber";
import Room from "@/components/Room";
import type { RoomConfig } from "@/lib/config";

interface SceneProps {
  config: RoomConfig;
}

export default function Scene({ config }: SceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [6, 5, 6], fov: 50 }}
      className="!absolute inset-0"
    >
      <Room config={config} />
    </Canvas>
  );
}
