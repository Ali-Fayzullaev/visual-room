"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import VdsPanel from "@/components/VdsPanel";
import type { Zone3DConfig, RoomState } from "@/lib/config";
import {
  WALL_VARIANTS,
  FLOOR_VARIANTS,
  FURNITURE_VARIANTS,
} from "@/lib/variants";

const EggerViewer = dynamic(() => import("@/components/EggerViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V15m0 0l-2.25 1.313" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">Загрузка 3D-сцены...</p>
      </div>
    </div>
  ),
});

/* ── Bedroom 1 model configuration ── */
const MODEL_PATH = "/kitchen-model/Bedroom_1.glb";

/*
  Model analysis:
  - 31 materials, 56 meshes, bounds ~25×42×8 units
  - Center ≈ [5.8, -5.2, 0.1]
  - Key surfaces: walls, floor tile, bed leather, cloth, carpet, curtains, wood
*/
const ZONES: Zone3DConfig[] = [
  {
    id: "walls",
    label: "Стены",
    icon: "wall",
    materialNames: ["White Venetian Plaster Wall"],
    textureRepeat: [3, 3],
    roughness: 0.6,
    metalness: 0,
    variants: WALL_VARIANTS,
  },
  {
    id: "floor",
    label: "Пол (плитка)",
    icon: "floor",
    materialNames: ["Dark Grey Tile"],
    textureRepeat: [4, 4],
    roughness: 0.2,
    metalness: 0,
    variants: FLOOR_VARIANTS,
  },
  {
    id: "bed-frame",
    label: "Каркас кровати",
    icon: "furniture",
    materialNames: ["Leather"],
    textureRepeat: [2, 2],
    roughness: 0.5,
    metalness: 0,
    variants: [
      { name: "Оригинал", type: "color", value: "", preview: "#6a5040" },
      { name: "Белый", type: "color", value: "#f5f5f5", preview: "#f5f5f5" },
      { name: "Бежевый", type: "color", value: "#d4c4a8", preview: "#d4c4a8" },
      { name: "Серый", type: "color", value: "#8a8a8a", preview: "#8a8a8a" },
      { name: "Тёмно-коричневый", type: "color", value: "#3a2a1a", preview: "#3a2a1a" },
      { name: "Чёрный", type: "color", value: "#1a1a1a", preview: "#1a1a1a" },
      { name: "Синий", type: "color", value: "#2a3a5a", preview: "#2a3a5a" },
      { name: "Бордо", type: "color", value: "#6a2a3a", preview: "#6a2a3a" },
    ],
  },
  {
    id: "bedding",
    label: "Постельное бельё",
    icon: "sofa",
    materialNames: ["Grey Cloth", "Grey Cloth.001"],
    textureRepeat: [2, 2],
    roughness: 0.8,
    metalness: 0,
    variants: [
      { name: "Оригинал", type: "color", value: "", preview: "#888" },
      { name: "Белый", type: "color", value: "#f5f5f5", preview: "#f5f5f5" },
      { name: "Кремовый", type: "color", value: "#f0e6d0", preview: "#f0e6d0" },
      { name: "Серый", type: "color", value: "#b0b0b0", preview: "#b0b0b0" },
      { name: "Голубой", type: "color", value: "#a8c4d8", preview: "#a8c4d8" },
      { name: "Розовый", type: "color", value: "#d8a8b4", preview: "#d8a8b4" },
      { name: "Тёмно-синий", type: "color", value: "#2a3a5a", preview: "#2a3a5a" },
      { name: "Оливковый", type: "color", value: "#6b7a5a", preview: "#6b7a5a" },
    ],
  },
  {
    id: "curtains",
    label: "Шторы",
    icon: "furniture",
    materialNames: ["Material.028"],
    textureRepeat: [2, 4],
    roughness: 0.8,
    metalness: 0,
    variants: [
      { name: "Оригинал", type: "color", value: "", preview: "#888" },
      { name: "Белый", type: "color", value: "#f5f5f5", preview: "#f5f5f5" },
      { name: "Бежевый", type: "color", value: "#e8dcc8", preview: "#e8dcc8" },
      { name: "Серый", type: "color", value: "#9a9a9a", preview: "#9a9a9a" },
      { name: "Голубой", type: "color", value: "#8aaac0", preview: "#8aaac0" },
      { name: "Оливковый", type: "color", value: "#7a8a5a", preview: "#7a8a5a" },
      { name: "Бордо", type: "color", value: "#722f37", preview: "#722f37" },
      { name: "Тёмно-серый", type: "color", value: "#4a4a4a", preview: "#4a4a4a" },
    ],
  },
  {
    id: "wood",
    label: "Дерево / Мебель",
    icon: "furniture",
    materialNames: ["Wood.002", "Furniture Wood", "Wood.001", "Dark_Walnut"],
    textureRepeat: [2, 2],
    roughness: 0.5,
    metalness: 0,
    variants: FURNITURE_VARIANTS,
  },
  {
    id: "carpet",
    label: "Ковёр",
    icon: "floor",
    materialNames: ["Material.008", "Carpet006.048"],
    textureRepeat: [2, 2],
    roughness: 0.8,
    metalness: 0,
    variants: [
      { name: "Оригинал", type: "color", value: "", preview: "#888" },
      { name: "Белый", type: "color", value: "#f0ece6", preview: "#f0ece6" },
      { name: "Бежевый", type: "color", value: "#d4c4a8", preview: "#d4c4a8" },
      { name: "Серый", type: "color", value: "#9a9a9a", preview: "#9a9a9a" },
      { name: "Тёмный", type: "color", value: "#3a3a3a", preview: "#3a3a3a" },
      { name: "Голубой", type: "color", value: "#8aaac0", preview: "#8aaac0" },
      { name: "Розовый", type: "color", value: "#c0889a", preview: "#c0889a" },
    ],
  },
];

/* Camera: looking at center, elevated slightly */
const CAMERA_POS: [number, number, number] = [18, 8, 12];
const CAMERA_TARGET: [number, number, number] = [5.8, -5, 0];

/* ═══════════════════════════════════ Page ═══════════════════════════════════ */

export default function Bedroom1Page() {
  const [state, setState] = useState<RoomState>({});
  const [activeZone, setActiveZone] = useState(ZONES[0]?.id || "");
  const [panelOpen, setPanelOpen] = useState(true);

  const handleMaterialSelect = useCallback((zoneId: string, value: string) => {
    setState((prev) => ({ ...prev, [zoneId]: value }));
  }, []);

  const handleZoneClick = useCallback((zoneId: string) => {
    setActiveZone(zoneId);
    setPanelOpen(true);
  }, []);

  const handleReset = useCallback(() => {
    setState({});
  }, []);

  const changedCount = Object.values(state).filter(Boolean).length;

  return (
    <main className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
      <header className="h-11 sm:h-12 bg-white border-b border-gray-200 flex items-center px-3 sm:px-4 gap-2 sm:gap-3 shrink-0 z-30">
        <a href="/" className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Назад к каталогу">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </a>
        <h1 className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span className="hidden sm:inline">Спальня 1 · 3D Визуализатор</span>
          <span className="sm:hidden">Спальня 1</span>
        </h1>

        <span className="text-[10px] sm:text-xs text-gray-400 hidden md:inline">
          Нажмите на поверхность для выбора зоны
        </span>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {changedCount > 0 && (
            <button onClick={handleReset} className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Сбросить ({changedCount})
            </button>
          )}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className={`p-1.5 rounded-lg border transition-colors ${panelOpen ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-gray-200 text-gray-400 hover:text-gray-600"}`}
            title={panelOpen ? "Скрыть панель" : "Показать панель"}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="flex-1 relative p-2 sm:p-4 lg:p-6 transition-all duration-300">
          <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5">
            <EggerViewer
              modelPath={MODEL_PATH}
              state={state}
              zones={ZONES}
              cameraPos={CAMERA_POS}
              cameraTarget={CAMERA_TARGET}
              activeZone={activeZone}
              onZoneClick={handleZoneClick}
            />
          </div>
        </div>

        <div className={`${panelOpen ? "translate-x-0 translate-y-0" : "translate-x-full lg:translate-x-full translate-y-full lg:translate-y-0"} fixed lg:relative right-0 bottom-0 lg:bottom-auto w-full lg:w-[340px] xl:w-[380px] h-[55vh] lg:h-full z-20 transition-transform duration-300`}>
          <VdsPanel
            zones={ZONES.map((z) => ({ id: z.id, label: z.label, icon: z.icon, variants: z.variants }))}
            activeZone={activeZone}
            state={state}
            onZoneChange={setActiveZone}
            onMaterialSelect={handleMaterialSelect}
            open={panelOpen}
            onToggle={() => setPanelOpen(!panelOpen)}
          />
        </div>
      </div>
    </main>
  );
}
