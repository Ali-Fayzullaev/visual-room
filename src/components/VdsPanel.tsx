"use client";

import { useState, useRef, useEffect } from "react";
import type { Variant } from "@/lib/variants";

/* ═══════════════════════════════════════════════════════
   Egger VDS-style right panel: zones + decor grid
   ═══════════════════════════════════════════════════════ */

interface ZoneInfo {
  id: string;
  label: string;
  icon: string;
  variants: Variant[];
}

interface VdsPanelProps {
  zones: ZoneInfo[];
  activeZone: string;
  state: Record<string, string>;
  onZoneChange: (zoneId: string) => void;
  onMaterialSelect: (zoneId: string, value: string) => void;
  open: boolean;
  onToggle: () => void;
}

/* ── Filter types ── */
type FilterType = "all" | "texture" | "color";

/* ── Zone icon SVGs ── */
const ZoneIcon = ({ type, className = "" }: { type: string; className?: string }) => {
  const icons: Record<string, JSX.Element> = {
    floor: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    wall: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    sofa: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    furniture: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-1.007.661-1.859 1.572-2.144" />
      </svg>
    ),
    ceiling: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    countertop: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5M3.75 12a1.5 1.5 0 01-1.5-1.5v-1.5a1.5 1.5 0 011.5-1.5h16.5a1.5 1.5 0 011.5 1.5v1.5a1.5 1.5 0 01-1.5 1.5M3.75 12v6a1.5 1.5 0 001.5 1.5h1.5M20.25 12v6a1.5 1.5 0 01-1.5 1.5h-1.5M6.75 19.5v-3m10.5 3v-3" />
      </svg>
    ),
    appliance: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 3.75h13.5a1.5 1.5 0 011.5 1.5v13.5a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V5.25a1.5 1.5 0 011.5-1.5zM8.25 8.25h7.5M8.25 12h3.75m-3.75 3.75h7.5" />
      </svg>
    ),
  };
  return icons[type] || icons.furniture;
};

/* ═══════════════════ Main Component ═══════════════════ */

export default function VdsPanel({
  zones,
  activeZone,
  state,
  onZoneChange,
  onMaterialSelect,
  open,
  onToggle,
}: VdsPanelProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const currentZone = zones.find((z) => z.id === activeZone);

  // Reset search/filter on zone change
  useEffect(() => {
    setSearch("");
    setFilter("all");
    if (gridRef.current) gridRef.current.scrollTop = 0;
  }, [activeZone]);

  const variants = currentZone?.variants || [];
  const filtered = variants.filter((v) => {
    if (filter === "texture" && v.type !== "texture") return false;
    if (filter === "color" && v.type !== "color") return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const textureCount = variants.filter((v) => v.type === "texture").length;
  const colorCount = variants.filter((v) => v.type === "color").length;

  return (
    <>
      {/* ── Toggle button (visible when panel is closed) ── */}
      {!open && (
        <button
          onClick={onToggle}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-white shadow-xl rounded-l-xl px-2 py-6 hover:px-3 transition-all duration-200 group"
          title="Открыть панель декоров"
        >
          <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {/* ── Panel ── */}
      <div
        className={`
          h-full z-30
          bg-white shadow-2xl
          flex flex-col
          w-full
          ${open ? "" : "hidden"}
        `}
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 tracking-tight">Выбор декора</h2>
              <p className="text-[11px] text-gray-400">Virtual Design Studio</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            title="Закрыть панель"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* ─── Zone selector tabs ─── */}
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Элемент комнаты</p>
          <div className="flex flex-wrap gap-1.5">
            {zones.map((zone) => {
              const isActive = activeZone === zone.id;
              const hasCustom = !!state[zone.id];
              return (
                <button
                  key={zone.id}
                  onClick={() => onZoneChange(zone.id)}
                  className={`
                    relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium
                    transition-all duration-150
                    ${isActive
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }
                  `}
                >
                  <ZoneIcon type={zone.icon} className="w-3.5 h-3.5" />
                  {zone.label}
                  {hasCustom && !isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Search ─── */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск декора..."
              className="w-full bg-gray-50 text-gray-800 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all placeholder:text-gray-300"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex gap-1.5 mt-2.5">
            {[
              { key: "all" as FilterType, label: "Все", count: variants.length },
              { key: "texture" as FilterType, label: "Текстуры", count: textureCount },
              { key: "color" as FilterType, label: "Цвета", count: colorCount },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`
                  text-[11px] px-2.5 py-1 rounded-md font-medium transition-all
                  ${filter === f.key
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent"
                  }
                `}
              >
                {f.label}
                <span className="ml-1 opacity-60">{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Decor grid ─── */}
        <div
          ref={gridRef}
          className="flex-1 overflow-y-auto px-4 py-3"
          style={{ scrollbarWidth: "thin" }}
        >
          {filtered.length > 0 ? (
            <div className="grid grid-cols-3 gap-2.5">
              {filtered.map((variant, idx) => {
                const isSelected = state[activeZone] === variant.value;
                const isOriginal = !variant.value;
                const isTexture = variant.type === "texture";

                return (
                  <button
                    key={variant.value || `original-${idx}`}
                    onClick={() => onMaterialSelect(activeZone, variant.value)}
                    className={`
                      group relative flex flex-col rounded-xl overflow-hidden
                      transition-all duration-150
                      ${isSelected
                        ? "ring-2 ring-red-500 ring-offset-1 shadow-md"
                        : "hover:shadow-md border border-gray-100 hover:border-gray-200"
                      }
                    `}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-square w-full overflow-hidden bg-gray-50">
                      {isOriginal ? (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                          <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                          </svg>
                        </div>
                      ) : isTexture ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={variant.preview}
                          alt={variant.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: variant.preview }}
                        />
                      )}

                      {/* Selected check */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <div className="px-1.5 py-1.5">
                      <p className={`text-[10px] leading-tight truncate ${isSelected ? "text-red-700 font-semibold" : "text-gray-600"}`}>
                        {variant.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-300">
              <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-sm">Ничего не найдено</p>
            </div>
          )}
        </div>

        {/* ─── Footer: zone summary ─── */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400">
              {currentZone?.label} · {filtered.length} декоров
            </span>
            <span className="text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              AI-сегментация
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
