"use client";

import { useRef } from "react";
import { Mesh } from "three";

interface WallsProps {
  color: string;
}

const ROOM_WIDTH = 8;
const ROOM_HEIGHT = 4;
const ROOM_DEPTH = 6;
const WALL_THICKNESS = 0.1;

export default function Walls({ color }: WallsProps) {
  const backWall = useRef<Mesh>(null);
  const leftWall = useRef<Mesh>(null);
  const rightWall = useRef<Mesh>(null);

  return (
    <group>
      {/* Задняя стена */}
      <mesh
        ref={backWall}
        position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]}
        receiveShadow
      >
        <boxGeometry args={[ROOM_WIDTH, ROOM_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Левая стена */}
      <mesh
        ref={leftWall}
        position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Правая стена */}
      <mesh
        ref={rightWall}
        position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}
