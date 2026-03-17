"use client";

interface ChairProps {
  color: string;
}

const SEAT_HEIGHT = 0.45;
const SEAT_WIDTH = 0.44;
const SEAT_DEPTH = 0.42;
const SEAT_THICKNESS = 0.04;
const LEG_RADIUS = 0.025;
const BACK_HEIGHT = 0.45;
const BACK_THICKNESS = 0.04;

export default function Chair({ color }: ChairProps) {
  const legPositions: [number, number, number][] = [
    [SEAT_WIDTH / 2 - 0.04, SEAT_HEIGHT / 2, SEAT_DEPTH / 2 - 0.04],
    [-SEAT_WIDTH / 2 + 0.04, SEAT_HEIGHT / 2, SEAT_DEPTH / 2 - 0.04],
    [SEAT_WIDTH / 2 - 0.04, SEAT_HEIGHT / 2, -SEAT_DEPTH / 2 + 0.04],
    [-SEAT_WIDTH / 2 + 0.04, SEAT_HEIGHT / 2, -SEAT_DEPTH / 2 + 0.04],
  ];

  return (
    <group position={[0, 0, 0.2]}>
      {/* Сиденье */}
      <mesh
        position={[0, SEAT_HEIGHT + SEAT_THICKNESS / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[SEAT_WIDTH, SEAT_THICKNESS, SEAT_DEPTH]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Ножки */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[LEG_RADIUS, LEG_RADIUS, SEAT_HEIGHT, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}

      {/* Спинка */}
      <mesh
        position={[
          0,
          SEAT_HEIGHT + SEAT_THICKNESS + BACK_HEIGHT / 2,
          -SEAT_DEPTH / 2 + BACK_THICKNESS / 2,
        ]}
        castShadow
      >
        <boxGeometry args={[SEAT_WIDTH, BACK_HEIGHT, BACK_THICKNESS]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}
