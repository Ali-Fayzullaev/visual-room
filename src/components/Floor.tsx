"use client";

import { Mesh } from "three";
import { useRef } from "react";

interface FloorProps {
  color: string;
}

const ROOM_WIDTH = 8;
const ROOM_DEPTH = 6;

export default function Floor({ color }: FloorProps) {
  const floorRef = useRef<Mesh>(null);

  return (
    <group>
      {/* Пол */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Потолок */}
      <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#f8f8f8" />
      </mesh>
    </group>
  );
}
