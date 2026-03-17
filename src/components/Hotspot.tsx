"use client";

import { Html } from "@react-three/drei";
import type { HotspotConfig } from "@/lib/config";

interface HotspotProps {
  hotspot: HotspotConfig;
  isActive: boolean;
  onClick: () => void;
}

export default function Hotspot({ hotspot, isActive, onClick }: HotspotProps) {
  return (
    <group position={hotspot.position}>
      <Html center distanceFactor={8} zIndexRange={[50, 0]}>
        <div className="flex flex-col items-center gap-1 select-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className={`
              relative flex items-center justify-center
              w-11 h-11 rounded-full
              transition-all duration-300 cursor-pointer
              ${
                isActive
                  ? "bg-white scale-110 shadow-[0_0_24px_rgba(255,255,255,0.5)]"
                  : "bg-black/50 backdrop-blur-sm hover:bg-black/70 hover:scale-110"
              }
            `}
            title={hotspot.label}
          >
            {/* Пульсация когда неактивен */}
            {!isActive && (
              <span className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
            )}
            {/* Кольцо */}
            <span
              className={`
                absolute inset-0 rounded-full border-2 transition-colors duration-300
                ${isActive ? "border-white" : "border-white/50"}
              `}
            />
            {/* Точка */}
            <span
              className={`
                w-3 h-3 rounded-full transition-colors duration-300
                ${isActive ? "bg-gray-900" : "bg-white"}
              `}
            />
          </button>
          {/* Подпись — всегда видна */}
          <span
            className={`
              whitespace-nowrap text-[11px] font-semibold tracking-wide
              px-2.5 py-1 rounded-md transition-all duration-300 pointer-events-none
              ${
                isActive
                  ? "bg-white text-gray-900 shadow-lg"
                  : "bg-black/60 backdrop-blur-sm text-white/90"
              }
            `}
          >
            {hotspot.label}
          </span>
        </div>
      </Html>
    </group>
  );
}
