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
}: RoomViewerProps) {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-950 overflow-hidden">
      {/* Контейнер фото — сохраняем пропорции */}
      <div className="relative w-full h-full">
        {/* Базовое фото комнаты */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={baseImage}
          alt="Комната"
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
          draggable={false}
        />

        {/* Слои масок — для каждой зоны (Egger-стиль) */}
        {zones.map((zone) => {
          const value = state[zone.id];
          if (!value) return null;

          const isTexture = value.startsWith("/");
          const blend = zone.blendMode as React.CSSProperties["mixBlendMode"];
          const opacity = zone.opacity;

          return (
            <div
              key={zone.id}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                WebkitMaskImage: `url(${zone.maskImage})`,
                maskImage: `url(${zone.maskImage})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                mixBlendMode: blend,
                opacity,
              }}
            >
              {isTexture ? (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${value})`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "250px 250px",
                    imageRendering: "auto",
                    filter: "contrast(1.05) brightness(1.02)",
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
      </div>
    </div>
  );
}
