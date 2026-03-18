"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import RoomViewer from "@/components/RoomViewer";
import MaterialPanel from "@/components/MaterialPanel";
import { getRoomById, getDefaultState, type RoomState } from "@/lib/config";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as string;
  const room = getRoomById(roomId);

  const [state, setState] = useState<RoomState>(() =>
    room ? getDefaultState(room.zones) : {}
  );
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const handleZoneClick = useCallback((id: string) => {
    setActiveZone((prev) => (prev === id ? null : id));
  }, []);

  const handleSelect = useCallback((zoneId: string, value: string) => {
    setState((prev) => ({ ...prev, [zoneId]: value }));
  }, []);

  const handleClose = useCallback(() => {
    setActiveZone(null);
  }, []);

  // Комната не найдена
  if (!room) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
        <p className="text-2xl mb-4">Комната не найдена</p>
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 underline transition-colors"
        >
          ← Вернуться к каталогу
        </Link>
      </main>
    );
  }

  const activeConfig = activeZone
    ? room.zones.find((z) => z.id === activeZone)
    : null;

  return (
    <main className="relative w-screen h-screen bg-gray-950 overflow-hidden">
      {/* Шапка */}
      <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
            <Link
              href="/"
              className="
                w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xl
                flex items-center justify-center
                hover:bg-white/20 transition-colors
              "
              title="Назад к каталогу"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-white text-xs sm:text-sm font-bold tracking-wide">{room.name}</h1>
              <p className="text-white/40 text-[10px] tracking-wider">КОНФИГУРАТОР</p>
            </div>
          </div>
        </div>
      </header>

      {/* 2D Просмотр комнаты */}
      <RoomViewer
        baseImage={room.baseImage}
        zones={room.zones}
        state={state}
        activeZone={activeZone}
        onZoneClick={handleZoneClick}
      />

      {/* Панель выбора материалов */}
      {activeConfig && (
        <MaterialPanel
          zone={activeConfig}
          currentValue={state[activeConfig.id]}
          onSelect={handleSelect}
          onClose={handleClose}
        />
      )}

      {/* Нижняя подсказка */}
      {!activeZone && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-black/50 backdrop-blur-xl text-white/60 text-[10px] sm:text-xs px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/[0.06]">
            Нажмите на точку ● чтобы изменить элемент
          </div>
        </div>
      )}
    </main>
  );
}
