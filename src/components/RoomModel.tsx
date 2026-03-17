"use client";

import { useRef, useEffect, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import { type RoomState, HOTSPOTS } from "@/lib/config";
import * as THREE from "three";

interface RoomModelProps {
  state: RoomState;
}

const MODEL_PATH = "/cozy_modern_living_room/scene.gltf";

// Кеш загруженных текстур, чтобы не грузить одно и то же
const textureCache = new Map<string, THREE.Texture>();
const loader = new THREE.TextureLoader();

function loadTexture(path: string): THREE.Texture {
  if (textureCache.has(path)) return textureCache.get(path)!;
  const tex = loader.load(path);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  textureCache.set(path, tex);
  return tex;
}

export default function RoomModel({ state }: RoomModelProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const sceneRef = useRef(scene);

  // Сохраняем оригинальные карты материалов
  const originalsRef = useRef<Map<string, THREE.Texture | null>>(new Map());

  // Собираем оригинальные текстуры при первом рендере
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.name && !originalsRef.current.has(mat.name)) {
          originalsRef.current.set(mat.name, mat.map ? mat.map.clone() : null);
        }
      }
    });
  }, [scene]);

  const applyMaterial = useCallback(
    (materialNames: string[], value: string, variantType: "color" | "texture" | undefined) => {
      scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const mat = child.material as THREE.MeshStandardMaterial;
        if (!materialNames.includes(mat.name)) return;

        if (!value || value === "") {
          // Вернуть оригинал
          const orig = originalsRef.current.get(mat.name);
          mat.map = orig ?? null;
          mat.color.set("#ffffff");
          mat.needsUpdate = true;
          return;
        }

        if (variantType === "texture") {
          const tex = loadTexture(value);
          mat.map = tex;
          mat.color.set("#ffffff");
          mat.needsUpdate = true;
        } else {
          mat.map = null;
          mat.color.set(value);
          mat.needsUpdate = true;
        }
      });
    },
    [scene]
  );

  // Применяем состояние при изменении
  useEffect(() => {
    for (const hotspot of HOTSPOTS) {
      const value = state[hotspot.id];
      const variant = hotspot.variants.find((v) => v.value === value);
      applyMaterial(hotspot.materialNames, value, variant?.type);
    }
  }, [state, applyMaterial]);

  return (
    <primitive
      ref={sceneRef}
      object={scene}
      scale={1.5}
      position={[1.5, 0, 0]}
      castShadow
      receiveShadow
    />
  );
}

useGLTF.preload(MODEL_PATH);
