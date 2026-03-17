"use client";

import { useTexture } from "@react-three/drei";

/**
 * Картины на стенах с изображениями из public/img-fon.
 */

function PaintingFrame({
  position,
  rotation = [0, 0, 0],
  size = [1.2, 0.85] as [number, number],
  imagePath,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  imagePath: string;
}) {
  const texture = useTexture(imagePath);
  const frameDepth = 0.06;
  const border = 0.06;

  return (
    <group position={position} rotation={rotation}>
      {/* Рама */}
      <mesh castShadow>
        <boxGeometry
          args={[size[0] + border * 2, size[1] + border * 2, frameDepth]}
        />
        <meshStandardMaterial color="#3e2c1a" />
      </mesh>

      {/* Картина с текстурой */}
      <mesh position={[0, 0, frameDepth / 2 + 0.001]}>
        <planeGeometry args={size} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}

export default function Painting() {
  return (
    <group>
      {/* Картина на задней стене (по центру) */}
      <PaintingFrame
        position={[0, 2.4, -2.93]}
        imagePath="/img-fon/imgi_11_8802492776478.png"
        size={[1.3, 0.9]}
      />

      {/* Картина на задней стене (справа) */}
      <PaintingFrame
        position={[2.2, 2.2, -2.93]}
        imagePath="/img-fon/imgi_12_8811984814110.png"
        size={[0.8, 0.6]}
      />

      {/* Картина на левой стене */}
      <PaintingFrame
        position={[-3.93, 2.4, -1.8]}
        rotation={[0, Math.PI / 2, 0]}
        imagePath="/img-fon/imgi_19_8812778782750.png"
        size={[1.0, 0.7]}
      />
    </group>
  );
}
