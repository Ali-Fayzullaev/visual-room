"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import RoomViewer from "@/components/RoomViewer";
import EggerMaterialPanel from "@/components/EggerMaterialPanel";
import {
  getRoomById,
  getDefaultState,
  type RoomState,
} from "@/lib/config";

/* ───────────── Единственная страница: 2D конфигуратор в стиле Egger ───────────── */

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as string;
  const room = getRoomById(roomId);

  const [state, setState] = useState<RoomState>(() =>
    room ? getDefaultState(room.zones) : {}
  );
  const [activeZone, setActiveZone] = useState<string>(room?.zones[0]?.id || "");
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleMaterialSelect = useCallback((zoneId: string, value: string) => {
    setState((prev) => ({ ...prev, [zoneId]: value }));
  }, []);

  const handleReset = useCallback(() => {
    if (!room) return;
    setState(getDefaultState(room.zones));
  }, [room]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (!room) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
        <p className="text-2xl mb-4">Комната не найдена</p>
        <Link href="/" className="text-blue-400 hover:text-blue-300 underline transition-colors">
          ← Вернуться к каталогу
        </Link>
      </main>
    );
  }

  return (
    <main className="relative w-screen h-screen bg-gray-950 overflow-hidden select-none">
      {/* ── Верхний тулбар ── */}
      <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="flex items-center justify-between px-3 sm:px-5 py-3">
          <div className="flex items-center gap-2.5 pointer-events-auto">
            <Link
              href="/"
              className="
                w-10 h-10 rounded-xl bg-black/40 backdrop-blur-xl
                flex items-center justify-center
                hover:bg-black/60 transition-all duration-200
                border border-white/[0.08]
              "
              title="Назад к каталогу"
            >
              <svg className="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-white text-sm font-semibold tracking-wide leading-tight">{room.name}</h1>
              <p className="text-white/35 text-[10px] uppercase tracking-[0.15em] font-medium">
                Конфигуратор покрытий
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleReset}
              className="
                h-9 px-3.5 rounded-xl bg-black/40 backdrop-blur-xl
                text-white/70 text-xs font-medium
                hover:bg-black/60 hover:text-white
                transition-all duration-200
                flex items-center gap-1.5
                border border-white/[0.08]
              "
              title="Сбросить все к оригиналу"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              <span className="hidden sm:inline">Сброс</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="
                w-9 h-9 rounded-xl bg-black/40 backdrop-blur-xl
                text-white/70 hover:bg-black/60 hover:text-white
                transition-all duration-200
                flex items-center justify-center
                border border-white/[0.08]
              "
              title={isFullscreen ? "Выйти из полного экрана" : "Полный экран"}
            >
              {isFullscreen ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Фото комнаты с масками ── */}
      <RoomViewer
        baseImage={room.baseImage}
        zones={room.zones}
        state={state}
        activeZone={activeZone}
        onZoneClick={setActiveZone}
      />

      {/* ── Егер-панель: зоны слева + материалы снизу ── */}
      <EggerMaterialPanel
        zones={room.zones.map((z) => ({
          id: z.id,
          label: z.label,
          icon: z.id,
          variants: z.variants,
        }))}
        activeZone={activeZone}
        state={state}
        onZoneChange={setActiveZone}
        onMaterialSelect={handleMaterialSelect}
        collapsed={panelCollapsed}
        onToggleCollapse={() => setPanelCollapsed((p) => !p)}
      />
    </main>
  );
}
