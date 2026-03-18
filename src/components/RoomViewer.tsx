"use client";

import { type ZoneConfig, type RoomState } from "@/lib/config";

interface RoomViewerProps {
  baseImage: string;
  zones: ZoneConfig[];
  state: RoomState;
  activeZone: string | null;
  onZoneClick: (id: string) => void;
}

export default function RoomViewer({
  baseImage,
  zones,
  state,
  activeZone,
  onZoneClick,
}: RoomViewerProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-950">
      {/* Контейнер фото — сохраняем пропорции */}
      <div className="relative w-full h-full">
        {/* Базовое фото комнаты */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={baseImage}
          alt="Комната"
          className="absolute inset-0 w-full h-full object-contain select-none"
          draggable={false}
        />

        {/* Слои масок — для каждой зоны */}
        {zones.map((zone) => {
          const value = state[zone.id];
          // Если пусто — "Оригинал", не показываем overlay
          if (!value) return null;

          const isTexture = value.startsWith("/");

          return (
            <div
              key={zone.id}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                // CSS mask — маска ограничивает видимость overlay
                // только непрозрачные пиксели маски пропускают цвет/текстуру
                WebkitMaskImage: `url(${zone.maskImage})`,
                maskImage: `url(${zone.maskImage})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                mixBlendMode: zone.blendMode as React.CSSProperties["mixBlendMode"],
                opacity: zone.opacity,
              }}
            >
              {isTexture ? (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${value})`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "300px 300px",
                    imageRendering: "auto",
                  }}
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: value }}
                />
              )}
            </div>
          );
        })}

        {/* Кнопки-хотспоты */}
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => onZoneClick(zone.id)}
            className="absolute z-10 group -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{
              left: `${zone.buttonPos.x}%`,
              top: `${zone.buttonPos.y}%`,
            }}
            title={zone.label}
          >
            {/* Круг */}
            <span
              className={`
                block w-8 h-8 sm:w-10 sm:h-10 rounded-full
                border-2 border-white/80
                flex items-center justify-center
                shadow-lg shadow-black/40
                transition-all duration-200
                group-hover:scale-110
                ${activeZone === zone.id
                  ? "bg-blue-500 border-blue-300 scale-110"
                  : "bg-black/50 backdrop-blur-sm hover:bg-black/70"
                }
              `}
            >
              <span className="text-white text-[10px] sm:text-xs font-bold">
                {zone.label.charAt(0)}
              </span>
            </span>

            {/* Пульсация */}
            {activeZone !== zone.id && (
              <span className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
            )}

            {/* Подпись */}
            <span className="
              absolute left-1/2 -translate-x-1/2 top-full mt-1
              bg-black/80 text-white text-[10px] px-2 py-0.5 rounded
              whitespace-nowrap opacity-0 group-hover:opacity-100
              transition-opacity pointer-events-none
            ">
              {zone.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
