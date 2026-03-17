"use client";

import { OrbitControls, Environment } from "@react-three/drei";
import Walls from "./Walls";
import Floor from "./Floor";
import Table from "./Table";
import Chair from "./Chair";
import Window from "./Window";
import Bookshelf from "./Bookshelf";
import Lamp from "./Lamp";
import Sofa from "./Sofa";
import Painting from "./Painting";
import Rug from "./Rug";
import type { RoomConfig } from "@/lib/config";

interface RoomProps {
  config: RoomConfig;
}

export default function Room({ config }: RoomProps) {
  return (
    <>
      {/* Освещение */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <pointLight position={[0, 3.5, 0]} intensity={0.6} />

      <Environment preset="apartment" />

      {/* Комната */}
      <Walls texturePath={config.wallTexture} />
      <Floor color={config.floorColor} />

      {/* Мебель */}
      <Table color={config.tableColor} />
      <Chair color={config.chairColor} />
      <Window />
      <Bookshelf />
      <Lamp />
      <Sofa />

      {/* Декор */}
      <Painting />
      <Rug />

      {/* Управление камерой */}
      <OrbitControls
        makeDefault
        minDistance={3}
        maxDistance={12}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.1}
        target={[0, 1.5, 0]}
      />
    </>
  );
}
