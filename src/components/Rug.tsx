"use client";

import { useTexture } from "@react-three/drei";

/**
 * Декоративный ковёр на полу с текстурой-картиной из public/img-fon.
 */
export default function Rug() {
  const texture = useTexture("/img-fon/imgi_25_8811986059294.png");

  return (
    <group position={[0, 0.005, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Бахрома / окантовка */}
      <mesh receiveShadow>
        <planeGeometry args={[3.2, 2.2]} />
        <meshStandardMaterial color="#8b2e2e" />
      </mesh>

      {/* Ковёр с изображением */}
      <mesh position={[0, 0, 0.001]} receiveShadow>
        <planeGeometry args={[3.0, 2.0]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}
