"use client";

import { useRef, useEffect, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import { type RoomState, HOTSPOTS, MODEL_SCALE, MODEL_POSITION } from "@/lib/config";
import * as THREE from "three";

interface RoomModelProps {
  state: RoomState;
}

const MODEL_PATH = "/cozy_modern_living_room/scene.gltf";

// Кеш загруженных текстур
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

// Сохраняем оригинальные данные материала (map + emissiveMap + emissive)
interface OriginalMaterialData {
  map: THREE.Texture | null;
  emissiveMap: THREE.Texture | null;
  emissive: THREE.Color;
}

export default function RoomModel({ state }: RoomModelProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const sceneRef = useRef(scene);
  const clonedRef = useRef(false);

  // Оригинальные данные материалов
  const originalsRef = useRef<Map<string, OriginalMaterialData>>(new Map());

  // Клонируем материалы при первом рендере, чтобы изменения применялись корректно
  useEffect(() => {
    if (clonedRef.current) return;
    clonedRef.current = true;

    // Список имён материалов, которые мы будем менять
    const targetNames = new Set<string>();
    for (const hs of HOTSPOTS) {
      for (const name of hs.materialNames) {
        targetNames.add(name);
      }
    }

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.material) return;
      const mat = child.material as THREE.MeshStandardMaterial;
      if (!mat.name || !targetNames.has(mat.name)) return;

      // Сохраняем оригинальные данные (map, emissiveMap, emissive)
      if (!originalsRef.current.has(mat.name)) {
        originalsRef.current.set(mat.name, {
          map: mat.map ? mat.map.clone() : null,
          emissiveMap: mat.emissiveMap ? mat.emissiveMap.clone() : null,
          emissive: mat.emissive.clone(),
        });
      }

      // Клонируем материал, чтобы каждый меш имел свою копию
      const cloned = mat.clone();
      cloned.name = mat.name;
      child.material = cloned;
    });

    // Логируем имена для отладки
    console.log("[RoomModel] Материалы модели:");
    const names = new Set<string>();
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const m = child.material as THREE.MeshStandardMaterial;
        if (m.name && !names.has(m.name)) {
          names.add(m.name);
          console.log(`  - "${m.name}" emissive:`, m.emissive, "emissiveMap:", !!m.emissiveMap);
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
          if (orig) {
            mat.map = orig.map;
            mat.emissiveMap = orig.emissiveMap;
            mat.emissive.copy(orig.emissive);
          }
          mat.color.set("#ffffff");
          mat.needsUpdate = true;
          return;
        }

        if (variantType === "texture") {
          const tex = loadTexture(value);
          mat.map = tex;
          mat.emissiveMap = tex;
          mat.color.set("#ffffff");
          mat.emissive.set("#ffffff");
          mat.needsUpdate = true;
        } else {
          // Цвет — убираем текстуры и ставим цвет
          mat.map = null;
          mat.emissiveMap = null;
          mat.color.set(value);
          mat.emissive.set(value);
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
      scale={MODEL_SCALE}
      position={MODEL_POSITION}
      castShadow
      receiveShadow
    />
  );
}

useGLTF.preload(MODEL_PATH);
