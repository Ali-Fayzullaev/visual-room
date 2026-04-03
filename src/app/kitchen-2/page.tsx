"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import VdsPanel from "@/components/VdsPanel";
import type { Zone3DConfig, RoomState } from "@/lib/config";
import { CABINET_VARIANTS } from "@/lib/variants";

/* Lazy-load 3D viewer (heavy, client-only) */
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

/* ── Kitchen 2 — test model ──
  Model: test.glb — 24.0 MB, 1 mesh, no named materials
  Bounds: ~1.9×1.1×1.9 units
  Center ≈ [0, 0, 0]
*/
const MODEL_PATH = "/test.glb";

const ZONES: Zone3DConfig[] = [
  {
    id: "model",
    label: "Модель",
    icon: "furniture",
    // Empty name matches unnamed/default materials in test.glb
    materialNames: [""],
    textureRepeat: [2, 2],
    roughness: 0.45,
    metalness: 0.05,
    variants: CABINET_VARIANTS,
  },
];

/* Camera: compact model scale */
const CAMERA_POS: [number, number, number] = [1.0, 0.8, 2.4];
const CAMERA_TARGET: [number, number, number] = [0, 0, 0];

/* ═══════════════════════════════════ Page ═══════════════════════════════════ */

export default function Kitchen2Page() {
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
      {/* ── Top bar ── */}
      <header className="h-11 sm:h-12 bg-white border-b border-gray-200 flex items-center px-3 sm:px-4 gap-2 sm:gap-3 shrink-0 z-30">
        <a href="/" className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Назад к каталогу">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </a>
        <h1 className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V15m0 0l-2.25 1.313" />
          </svg>
          <span className="hidden sm:inline">3D Визуализатор кухни 2</span>
          <span className="sm:hidden">Кухня 2</span>
        </h1>

        <span className="text-[10px] sm:text-xs text-gray-400 hidden md:inline">
          Нажмите на поверхность для выбора зоны
        </span>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {changedCount > 0 && (
            <button
              onClick={handleReset}
              className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Сбросить ({changedCount})
            </button>
          )}

          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className={`
              p-1.5 rounded-lg border transition-colors
              ${panelOpen
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-gray-200 text-gray-400 hover:text-gray-600"
              }
            `}
            title={panelOpen ? "Скрыть панель" : "Показать панель"}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* 3D Viewer */}
        <div
          className="flex-1 relative p-2 sm:p-4 lg:p-6 transition-all duration-300"
          style={{
            marginRight: panelOpen ? undefined : 0,
          }}
        >
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

        {/* Egger VDS panel */}
        <div
          className={`
            ${panelOpen ? "translate-x-0 translate-y-0" : "translate-x-full lg:translate-x-full translate-y-full lg:translate-y-0"}
            fixed lg:relative right-0 bottom-0 lg:bottom-auto
            w-full lg:w-[340px] xl:w-[380px]
            h-[55vh] lg:h-full
            z-20 transition-transform duration-300
          `}
        >
          <VdsPanel
            zones={ZONES.map((z) => ({
              id: z.id,
              label: z.label,
              icon: z.icon,
              variants: z.variants,
            }))}
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
