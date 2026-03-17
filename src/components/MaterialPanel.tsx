"use client";

import { useEffect, useRef } from "react";
import type { HotspotConfig, Variant } from "@/lib/config";

interface MaterialPanelProps {
  hotspot: HotspotConfig;
  currentValue: string;
  onSelect: (hotspotId: string, value: string) => void;
  onClose: () => void;
}

function VariantButton({
  variant,
  isSelected,
  onClick,
}: {
  variant: Variant;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isTexture = variant.type === "texture";

  return (
    <button
      onClick={onClick}
      title={variant.name}
      className={`
        group/btn relative flex flex-col items-center gap-1
      `}
    >
      <div
        className={`
          relative w-16 h-16 rounded-xl overflow-hidden
          border-2 transition-all duration-200
          hover:scale-105 active:scale-95
          ${
            isSelected
              ? "border-blue-400 shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/50"
              : "border-white/10 hover:border-white/30"
          }
        `}
      >
        {isTexture ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={variant.preview}
            alt={variant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: variant.preview }}
          />
        )}
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
            <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      <span className={`text-[10px] leading-tight max-w-[64px] truncate ${isSelected ? "text-blue-300 font-semibold" : "text-white/50 group-hover/btn:text-white/80"}`}>
        {variant.name}
      </span>
    </button>
  );
}

export default function MaterialPanel({
  hotspot,
  currentValue,
  onSelect,
  onClose,
}: MaterialPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Закрытие по Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const colors = hotspot.variants.filter((v) => v.type === "color");
  const textures = hotspot.variants.filter((v) => v.type === "texture");

  return (
    <div
      ref={panelRef}
      className="
        fixed z-20
        right-4 top-1/2 -translate-y-1/2
        bg-gradient-to-b from-gray-900/95 to-gray-950/95
        backdrop-blur-2xl rounded-2xl
        p-5 w-[280px]
        shadow-2xl shadow-black/50
        border border-white/[0.08]
        animate-in slide-in-from-right duration-300
      "
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
          </div>
          <h3 className="text-white font-bold text-sm tracking-wide">{hotspot.label}</h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Разделитель */}
      <div className="h-px bg-white/[0.06] mb-4" />

      {/* Цвета */}
      {colors.length > 0 && (
        <div className="mb-4">
          <p className="text-white/40 text-[10px] mb-2.5 uppercase tracking-widest font-medium">Цвета</p>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((v) => (
              <VariantButton
                key={v.value || "original"}
                variant={v}
                isSelected={currentValue === v.value}
                onClick={() => onSelect(hotspot.id, v.value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Текстуры */}
      {textures.length > 0 && (
        <div>
          <p className="text-white/40 text-[10px] mb-2.5 uppercase tracking-widest font-medium">Текстуры</p>
          <div className="flex flex-wrap gap-2.5">
            {textures.map((v) => (
              <VariantButton
                key={v.value}
                variant={v}
                isSelected={currentValue === v.value}
                onClick={() => onSelect(hotspot.id, v.value)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
