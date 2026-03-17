"use client";

import type { ColorOption, WallpaperOption, RoomConfig } from "@/lib/config";
import {
  WALL_TEXTURES,
  FLOOR_COLORS,
  TABLE_COLORS,
  CHAIR_COLORS,
} from "@/lib/config";

interface ControlPanelProps {
  config: RoomConfig;
  onChange: (key: keyof RoomConfig, value: string) => void;
}

function ColorPicker({
  label,
  options,
  current,
  onSelect,
}: {
  label: string;
  options: ColorOption[];
  current: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-white/90 mb-2">{label}</h3>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            title={opt.name}
            onClick={() => onSelect(opt.value)}
            className={`w-9 h-9 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
              current === opt.value
                ? "border-white shadow-lg shadow-white/25 scale-110"
                : "border-white/30"
            }`}
            style={{ backgroundColor: opt.value }}
          />
        ))}
      </div>
    </div>
  );
}

function WallpaperPicker({
  label,
  options,
  current,
  onSelect,
}: {
  label: string;
  options: WallpaperOption[];
  current: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-white/90 mb-2">{label}</h3>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            title={opt.name}
            onClick={() => onSelect(opt.value)}
            className={`w-11 h-11 rounded-lg border-2 transition-all duration-200 hover:scale-110 overflow-hidden ${
              current === opt.value
                ? "border-white shadow-lg shadow-white/25 scale-110"
                : "border-white/30"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={opt.preview}
              alt={opt.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ControlPanel({ config, onChange }: ControlPanelProps) {
  return (
    <div
      className="
        fixed z-10
        right-4 top-4 bottom-4 w-64
        md:right-4 md:top-4 md:bottom-4 md:w-64
        max-md:right-0 max-md:bottom-0 max-md:left-0 max-md:top-auto max-md:w-full max-md:h-auto
        bg-black/50 backdrop-blur-md rounded-2xl p-5
        overflow-y-auto
        flex flex-col
      "
    >
      <h2 className="text-lg font-bold text-white mb-4">
        🏠 Конфигуратор
      </h2>

      <WallpaperPicker
        label="Обои"
        options={WALL_TEXTURES}
        current={config.wallTexture}
        onSelect={(v) => onChange("wallTexture", v)}
      />

      <ColorPicker
        label="Пол"
        options={FLOOR_COLORS}
        current={config.floorColor}
        onSelect={(v) => onChange("floorColor", v)}
      />

      <ColorPicker
        label="Стол"
        options={TABLE_COLORS}
        current={config.tableColor}
        onSelect={(v) => onChange("tableColor", v)}
      />

      <ColorPicker
        label="Стул"
        options={CHAIR_COLORS}
        current={config.chairColor}
        onSelect={(v) => onChange("chairColor", v)}
      />

      <p className="text-white/40 text-xs mt-auto pt-4">
        Вращайте камеру мышью • Колёсико для зума
      </p>
    </div>
  );
}
