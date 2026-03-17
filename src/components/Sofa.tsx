"use client";

export default function Sofa() {
  const color = "#5a4a3a";

  return (
    <group position={[-2.5, 0, 0.5]} rotation={[0, Math.PI / 2, 0]}>
      {/* Основание сиденья */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.3, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Спинка */}
      <mesh position={[0, 0.55, -0.25]} castShadow>
        <boxGeometry args={[1.4, 0.5, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Левый подлокотник */}
      <mesh position={[-0.65, 0.4, 0]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Правый подлокотник */}
      <mesh position={[0.65, 0.4, 0]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Подушки сиденья */}
      <mesh position={[-0.35, 0.43, 0.02]} castShadow>
        <boxGeometry args={[0.6, 0.08, 0.5]} />
        <meshStandardMaterial color="#6b5b4a" />
      </mesh>
      <mesh position={[0.35, 0.43, 0.02]} castShadow>
        <boxGeometry args={[0.6, 0.08, 0.5]} />
        <meshStandardMaterial color="#6b5b4a" />
      </mesh>

      {/* Ножки */}
      {[
        [-0.6, 0.05, 0.25],
        [0.6, 0.05, 0.25],
        [-0.6, 0.05, -0.25],
        [0.6, 0.05, -0.25],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ))}
    </group>
  );
}
