"use client";

export default function Bookshelf() {
  const shelfColor = "#6b4226";
  const bookColors = ["#c0392b", "#2980b9", "#27ae60", "#8e44ad", "#e67e22", "#2c3e50", "#d4ac0d"];

  return (
    <group position={[3.8, 0, -1.5]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Боковые панели */}
      <mesh position={[-0.45, 1.0, 0]} castShadow>
        <boxGeometry args={[0.03, 2.0, 0.3]} />
        <meshStandardMaterial color={shelfColor} />
      </mesh>
      <mesh position={[0.45, 1.0, 0]} castShadow>
        <boxGeometry args={[0.03, 2.0, 0.3]} />
        <meshStandardMaterial color={shelfColor} />
      </mesh>

      {/* Полки (4 штуки) */}
      {[0.02, 0.5, 1.0, 1.5, 2.0].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.03, 0.3]} />
          <meshStandardMaterial color={shelfColor} />
        </mesh>
      ))}

      {/* Книги на полках */}
      {[0.12, 0.62, 1.12, 1.62].map((shelfY, si) => (
        <group key={si}>
          {bookColors.slice(0, 4 + (si % 2)).map((bColor, bi) => (
            <mesh
              key={bi}
              position={[-0.3 + bi * 0.13, shelfY + 0.15, 0]}
              castShadow
            >
              <boxGeometry args={[0.06, 0.26, 0.2]} />
              <meshStandardMaterial color={bColor} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
