"use client";

import { useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import MaterialPanel from "@/components/MaterialPanel";
import { HOTSPOTS, getDefaultState, type RoomState } from "@/lib/config";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

function WebGLCheck({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-900 text-white">
        <p className="text-xl mb-4">WebGL недоступен</p>
        <p className="text-white/60 text-sm mb-6 text-center max-w-md">
          Закройте все вкладки браузера, перезапустите браузер и откройте эту страницу заново.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          Обновить страницу
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full"
      onError={() => setError(true)}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [state, setState] = useState<RoomState>(getDefaultState);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const handleHotspotClick = useCallback((id: string) => {
    setActiveHotspot((prev) => (prev === id ? null : id));
  }, []);

  const handleSelect = useCallback((hotspotId: string, value: string) => {
    setState((prev) => ({ ...prev, [hotspotId]: value }));
  }, []);

  const handleClose = useCallback(() => {
    setActiveHotspot(null);
  }, []);

  const activeConfig = activeHotspot
    ? HOTSPOTS.find((h) => h.id === activeHotspot)
    : null;

  return (
    <main className="relative w-screen h-screen bg-gray-900">
      <WebGLCheck>
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-full h-full bg-gray-900 text-white text-lg">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                Загрузка 3D сцены...
              </div>
            </div>
          }
        >
          <Scene
            state={state}
            activeHotspot={activeHotspot}
            onHotspotClick={handleHotspotClick}
          />
        </Suspense>
      </WebGLCheck>

      {/* Панель вариантов при клике на hotspot */}
      {activeConfig && (
        <MaterialPanel
          hotspot={activeConfig}
          currentValue={state[activeConfig.id]}
          onSelect={handleSelect}
          onClose={handleClose}
        />
      )}

      {/* Подсказка */}
      {!activeHotspot && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white/60 text-sm px-4 py-2 rounded-full pointer-events-none">
          Нажмите на точку ⊙ чтобы изменить элемент
        </div>
      )}
    </main>
  );
}
