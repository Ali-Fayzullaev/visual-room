"use client";

import { useTexture } from "@react-three/drei";
import { RepeatWrapping } from "three";

interface WallsProps {
  texturePath: string;
}

const ROOM_WIDTH = 8;
const ROOM_HEIGHT = 4;
const ROOM_DEPTH = 6;
const WALL_THICKNESS = 0.1;

export default function Walls({ texturePath }: WallsProps) {
  const texture = useTexture(texturePath);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 2);

  return (
    <group>
      {/* Задняя стена */}
      <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]} receiveShadow>
        <boxGeometry args={[ROOM_WIDTH, ROOM_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Левая стена */}
      <mesh position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} receiveShadow>
        <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Правая стена */}
      <mesh position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} receiveShadow>
        <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}
