"use client";

export default function Lamp() {
  return (
    <group position={[2.5, 0, 1.5]}>
      {/* Основание */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.04, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Стойка */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.36, 8]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Абажур */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, 0.3, 16, 1, true]} />
        <meshStandardMaterial
          color="#f5e6ca"
          side={2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Лампочка (свет) */}
      <pointLight
        position={[0, 1.45, 0]}
        intensity={0.4}
        color="#ffe4b5"
        distance={4}
        decay={2}
      />
    </group>
  );
}
