"use client";

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
        relative w-14 h-14 rounded-xl overflow-hidden
        border-2 transition-all duration-200
        hover:scale-105 active:scale-95
        ${
          isSelected
            ? "border-white shadow-lg shadow-white/30 ring-2 ring-white/50"
            : "border-white/20 hover:border-white/50"
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <svg className="w-5 h-5 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

export default function MaterialPanel({
  hotspot,
  currentValue,
  onSelect,
  onClose,
}: MaterialPanelProps) {
  // Разделяем на цвета и текстуры
  const colors = hotspot.variants.filter((v) => v.type === "color");
  const textures = hotspot.variants.filter((v) => v.type === "texture");

  return (
    <div
      className="
        fixed z-20
        bottom-4 left-1/2 -translate-x-1/2
        md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-4 md:left-auto md:translate-x-0
        bg-black/60 backdrop-blur-xl rounded-2xl
        p-4 max-w-[90vw] md:w-72
        shadow-2xl border border-white/10
      "
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-base">{hotspot.label}</h3>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Цвета */}
      {colors.length > 0 && (
        <div className="mb-3">
          <p className="text-white/60 text-xs mb-2 uppercase tracking-wider">Цвета</p>
          <div className="flex flex-wrap gap-2">
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

      {/* Текстуры / Картины */}
      {textures.length > 0 && (
        <div>
          <p className="text-white/60 text-xs mb-2 uppercase tracking-wider">Картины / Текстуры</p>
          <div className="flex flex-wrap gap-2">
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
