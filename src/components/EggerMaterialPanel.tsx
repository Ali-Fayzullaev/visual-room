"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Variant } from "@/lib/variants";

/* ───────────── Types ───────────── */

interface ZoneInfo {
  id: string;
  label: string;
  icon: string;
  variants: Variant[];
}

interface EggerMaterialPanelProps {
  zones: ZoneInfo[];
  activeZone: string;
  state: Record<string, string>;
  onZoneChange: (zoneId: string) => void;
  onMaterialSelect: (zoneId: string, value: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

/* ───────────── Zone icons (SVG) ───────────── */

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
  };

  return icons[type] || icons.floor;
};

/* ───────────── Material thumbnail ───────────── */

function MaterialThumb({
  variant,
  isSelected,
  onClick,
}: {
  variant: Variant;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isTexture = variant.type === "texture";
  const isOriginal = !variant.value;

  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 group relative flex flex-col items-center gap-1.5 transition-transform duration-200 hover:-translate-y-0.5"
    >
      {/* Thumbnail */}
      <div
        className={`
          relative w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-xl overflow-hidden
          border-2 transition-all duration-200 shadow-sm
          group-hover:shadow-md group-active:scale-95
          ${isSelected
            ? "border-blue-500 shadow-blue-500/20 shadow-lg ring-2 ring-blue-500/15"
            : "border-gray-200/80 group-hover:border-gray-300"
          }
        `}
      >
        {isOriginal ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </div>
        ) : isTexture ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={variant.preview}
            alt={variant.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: variant.preview }}
          />
        )}

        {/* Selected checkmark */}
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-500/15">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Name */}
      <span
        className={`
          text-[10px] sm:text-[11px] leading-tight max-w-[72px] sm:max-w-[80px] truncate text-center
          ${isSelected ? "text-blue-600 font-semibold" : "text-gray-500 group-hover:text-gray-700"}
        `}
      >
        {variant.name}
      </span>
    </button>
  );
}

/* ───────────── Main panel ───────────── */

export default function EggerMaterialPanel({
  zones,
  activeZone,
  state,
  onZoneChange,
  onMaterialSelect,
  collapsed = false,
  onToggleCollapse,
}: EggerMaterialPanelProps) {
  const [search, setSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentZone = zones.find((z) => z.id === activeZone);

  // Reset search when zone changes
  useEffect(() => {
    setSearch("");
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [activeZone]);

  // Filter variants
  const filteredVariants = currentZone?.variants.filter(
    (v) => !search || v.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const totalVariants = currentZone?.variants.length || 0;

  if (!currentZone) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 flex">
      {/* ── Left: Zone sidebar ── */}
      <div className="flex flex-col justify-end pb-3 pl-3 sm:pl-4 pr-1 gap-1.5 z-10">
        {zones.map((zone) => {
          const isActive = activeZone === zone.id;
          const hasCustom = !!state[zone.id]; // has custom material applied

          return (
            <button
              key={zone.id}
              onClick={() => onZoneChange(zone.id)}
              className={`
                relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center
                transition-all duration-200 group
                ${isActive
                  ? "bg-white text-gray-900 shadow-lg shadow-black/15 scale-105"
                  : "bg-black/30 backdrop-blur-md text-white/70 hover:bg-black/50 hover:text-white"
                }
              `}
              title={zone.label}
            >
              <ZoneIcon type={zone.id} className="w-5 h-5 sm:w-5.5 sm:h-5.5" />

              {/* Active indicator dot */}
              {hasCustom && !isActive && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-gray-900" />
              )}

              {/* Tooltip */}
              <span className="
                absolute left-full ml-2 top-1/2 -translate-y-1/2
                bg-gray-900 text-white text-[10px] px-2.5 py-1 rounded-lg
                whitespace-nowrap opacity-0 group-hover:opacity-100
                transition-opacity pointer-events-none shadow-lg
                hidden sm:block
              ">
                {zone.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Bottom: Material panel ── */}
      <div
        className={`
          flex-1 transition-transform duration-300 ease-out
          ${collapsed ? "translate-y-full" : "translate-y-0"}
        `}
      >
        <div className="bg-white/[0.97] backdrop-blur-2xl rounded-tl-2xl shadow-2xl shadow-black/20 border-t border-l border-white/40 overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-gray-100/80">
            <div className="flex items-center gap-3">
              {/* Zone name & count */}
              <div>
                <h3 className="text-gray-900 font-semibold text-[13px] sm:text-sm leading-tight">
                  {currentZone.label}
                </h3>
                <p className="text-gray-400 text-[10px] sm:text-[11px]">
                  {filteredVariants.length === totalVariants
                    ? `${totalVariants} вариантов`
                    : `${filteredVariants.length} из ${totalVariants}`
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск..."
                  className="
                    bg-gray-50 text-gray-700 text-[11px] sm:text-xs
                    pl-8 pr-3 py-1.5 rounded-lg
                    border border-gray-200 w-28 sm:w-40
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300
                    transition-all placeholder:text-gray-300
                  "
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Collapse toggle */}
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                  title={collapsed ? "Развернуть" : "Свернуть"}
                >
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Materials scrollable strip */}
          <div
            ref={scrollRef}
            className="
              flex gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4
              overflow-x-auto
              scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent
            "
            style={{
              scrollbarWidth: "thin",
              msOverflowStyle: "none",
            }}
          >
            {filteredVariants.length > 0 ? (
              filteredVariants.map((variant, idx) => (
                <MaterialThumb
                  key={variant.value || `original-${idx}`}
                  variant={variant}
                  isSelected={state[currentZone.id] === variant.value}
                  onClick={() => onMaterialSelect(currentZone.id, variant.value)}
                />
              ))
            ) : (
              <div className="flex items-center justify-center w-full py-4 text-gray-400 text-sm">
                Ничего не найдено
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
