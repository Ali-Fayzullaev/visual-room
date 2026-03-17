"use client";

interface TableProps {
  color: string;
}

const LEG_RADIUS = 0.04;
const LEG_HEIGHT = 0.72;
const TOP_WIDTH = 1.2;
const TOP_DEPTH = 0.7;
const TOP_THICKNESS = 0.04;

export default function Table({ color }: TableProps) {
  const legPositions: [number, number, number][] = [
    [TOP_WIDTH / 2 - 0.06, LEG_HEIGHT / 2, TOP_DEPTH / 2 - 0.06],
    [-TOP_WIDTH / 2 + 0.06, LEG_HEIGHT / 2, TOP_DEPTH / 2 - 0.06],
    [TOP_WIDTH / 2 - 0.06, LEG_HEIGHT / 2, -TOP_DEPTH / 2 + 0.06],
    [-TOP_WIDTH / 2 + 0.06, LEG_HEIGHT / 2, -TOP_DEPTH / 2 + 0.06],
  ];

  return (
    <group position={[0, 0, -1]}>
      {/* Столешница */}
      <mesh
        position={[0, LEG_HEIGHT + TOP_THICKNESS / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[TOP_WIDTH, TOP_THICKNESS, TOP_DEPTH]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Ножки */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[LEG_RADIUS, LEG_RADIUS, LEG_HEIGHT, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}
