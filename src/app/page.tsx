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
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-950 text-white">
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
    <div className="w-full h-full" onError={() => setError(true)}>
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
    <main className="relative w-screen h-screen bg-gray-950 overflow-hidden">
      {/* Шапка */}
      <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">3D</span>
            </div>
            <div>
              <h1 className="text-white text-sm font-bold tracking-wide">Конфигуратор комнаты</h1>
              <p className="text-white/40 text-[10px] tracking-wider">ИНТЕРАКТИВНЫЙ ДИЗАЙН</p>
            </div>
          </div>
        </div>
      </header>

      {/* 3D Сцена */}
      <WebGLCheck>
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-full h-full bg-gray-950 text-white text-lg">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60 text-sm">Загрузка 3D сцены...</p>
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

      {/* Панель выбора материалов */}
      {activeConfig && (
        <MaterialPanel
          hotspot={activeConfig}
          currentValue={state[activeConfig.id]}
          onSelect={handleSelect}
          onClose={handleClose}
        />
      )}

      {/* Нижняя подсказка */}
      {!activeHotspot && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-black/50 backdrop-blur-xl text-white/60 text-xs px-5 py-2.5 rounded-full border border-white/[0.06]">
            Нажмите на точку ● чтобы изменить элемент
          </div>
        </div>
      )}
    </main>
  );
}
