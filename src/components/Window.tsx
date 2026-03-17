"use client";

export default function Window() {
  return (
    <group position={[-3.93, 2.2, -0.5]}>
      {/* Рама окна */}
      <mesh castShadow>
        <boxGeometry args={[0.08, 1.6, 1.2]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Стекло */}
      <mesh position={[0.01, 0, 0]}>
        <boxGeometry args={[0.02, 1.4, 1.0]} />
        <meshStandardMaterial
          color="#a8d8ea"
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Горизонтальная перекладина */}
      <mesh position={[0.04, 0, 0]}>
        <boxGeometry args={[0.03, 0.04, 1.2]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Вертикальная перекладина */}
      <mesh position={[0.04, 0, 0]}>
        <boxGeometry args={[0.03, 1.6, 0.04]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
    </group>
  );
}
