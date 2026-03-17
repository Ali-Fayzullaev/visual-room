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
      <Html center distanceFactor={6} zIndexRange={[50, 0]}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={`
            group relative flex items-center justify-center
            w-10 h-10 rounded-full
            border-2 transition-all duration-300 cursor-pointer
            ${
              isActive
                ? "bg-white border-white scale-125 shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                : "bg-white/20 border-white/60 hover:bg-white/40 hover:scale-110"
            }
          `}
          title={hotspot.label}
        >
          {/* Кольцо-пульсация */}
          <span
            className={`
              absolute inset-0 rounded-full border-2 border-white/40
              ${isActive ? "" : "animate-ping"}
            `}
          />
          {/* Внутренняя точка */}
          <span
            className={`
              w-3 h-3 rounded-full
              ${isActive ? "bg-blue-500" : "bg-white/80"}
            `}
          />
        </button>
        {/* Подпись */}
        <div
          className={`
            absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap
            text-xs font-medium px-2 py-0.5 rounded
            transition-opacity duration-200
            ${isActive ? "bg-white text-gray-900 opacity-100" : "bg-black/50 text-white/80 opacity-0 group-hover:opacity-100"}
          `}
          style={{ pointerEvents: "none" }}
        >
          {hotspot.label}
        </div>
      </Html>
    </group>
  );
}
