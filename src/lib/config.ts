// === Типы ===

export type VariantType = "color" | "texture";

export interface Variant {
  name: string;
  type: VariantType;
  /** Для type="color" — hex-цвет, для type="texture" — путь к изображению */
  value: string;
  preview: string;
}

export interface HotspotConfig {
  id: string;
  label: string;
  /** Позиция кнопки в локальных координатах модели [x, y, z] */
  position: [number, number, number];
  /** Имена материалов в GLTF-модели, которые меняются */
  materialNames: string[];
  variants: Variant[];
}

// === Варианты для каждого элемента ===

/** Комната (Structure_Windows) — стены + пол + потолок + окна — один материал */
const ROOM_VARIANTS: Variant[] = [
  { name: "Оригинал", type: "color", value: "", preview: "#e8e0d4" },
  { name: "Белый", type: "color", value: "#f5f5f5", preview: "#f5f5f5" },
  { name: "Бежевый", type: "color", value: "#f0e6d3", preview: "#f0e6d3" },
  { name: "Серый", type: "color", value: "#c0c0c0", preview: "#c0c0c0" },
  { name: "Голубой", type: "color", value: "#ccdde8", preview: "#ccdde8" },
  { name: "Мятный", type: "color", value: "#d4e8d0", preview: "#d4e8d0" },
  { name: "Обои 1", type: "texture", value: "/textures/walls/imgi_12_8811984814110.png", preview: "/textures/walls/imgi_12_8811984814110.png" },
  { name: "Обои 2", type: "texture", value: "/textures/walls/imgi_32_8802495791134.png", preview: "/textures/walls/imgi_32_8802495791134.png" },
  { name: "Обои 3", type: "texture", value: "/textures/walls/imgi_35_8812769542174.png", preview: "/textures/walls/imgi_35_8812769542174.png" },
  { name: "Обои 4", type: "texture", value: "/textures/walls/imgi_37_8811985338398.png", preview: "/textures/walls/imgi_37_8811985338398.png" },
  { name: "Обои 5", type: "texture", value: "/textures/walls/imgi_39_8812008341534.png", preview: "/textures/walls/imgi_39_8812008341534.png" },
  { name: "Обои 6", type: "texture", value: "/textures/walls/imgi_43_8802538258462.png", preview: "/textures/walls/imgi_43_8802538258462.png" },
];

/** Фоновая стена (Backdrop) — декоративная стена за ТВ */
const BACKDROP_VARIANTS: Variant[] = [
  { name: "Оригинал", type: "color", value: "", preview: "#9b8b7a" },
  { name: "Тёмный", type: "color", value: "#3a3a3a", preview: "#3a3a3a" },
  { name: "Белый", type: "color", value: "#f0f0f0", preview: "#f0f0f0" },
  { name: "Бежевый", type: "color", value: "#d4bc96", preview: "#d4bc96" },
  { name: "Серый", type: "color", value: "#8a8a8a", preview: "#8a8a8a" },
  { name: "Синий", type: "color", value: "#4a6580", preview: "#4a6580" },
  { name: "Зелёный", type: "color", value: "#5a7a5a", preview: "#5a7a5a" },
];

const SOFA_VARIANTS: Variant[] = [
  { name: "Вариант 1", type: "texture", value: "/textures/furniture/imgi_10_8811986518046.png", preview: "/textures/furniture/imgi_10_8811986518046.png" },
  { name: "Вариант 2", type: "texture", value: "/textures/furniture/imgi_14_8812768460830.png", preview: "/textures/furniture/imgi_14_8812768460830.png" },
  { name: "Вариант 3", type: "texture", value: "/textures/furniture/imgi_16_8812777209886.png", preview: "/textures/furniture/imgi_16_8812777209886.png" },
  { name: "Вариант 4", type: "texture", value: "/textures/furniture/imgi_9_8812767674398.png", preview: "/textures/furniture/imgi_9_8812767674398.png" },
  { name: "Серый", type: "color", value: "#7a7a7a", preview: "#7a7a7a" },
  { name: "Бежевый", type: "color", value: "#c4a882", preview: "#c4a882" },
];

const CARPET_VARIANTS: Variant[] = [
  { name: "Оригинал", type: "color", value: "", preview: "#8b7355" },
  { name: "Серый", type: "color", value: "#999999", preview: "#999999" },
  { name: "Бежевый", type: "color", value: "#d4bc96", preview: "#d4bc96" },
  { name: "Тёмный", type: "color", value: "#4a4a4a", preview: "#4a4a4a" },
];

// === Трансформация модели (используется и для модели, и для hotspot-ов) ===
export const MODEL_SCALE = 1.5;
export const MODEL_POSITION: [number, number, number] = [1.5, 0, 0];

// === Hotspot-ы (позиции в ЛОКАЛЬНЫХ координатах модели) ===
//
// Карта материалов GLTF:
//   Structure_Windows  → стены + пол + потолок + окна (один меш)
//   Backdrop           → декоративная стена за ТВ
//   Sofa               → диван
//   Carpet             → ковёр (28 суб-мешей)
//   Structure          → молдинги / отделка
//   material_14        → ТВ-экран
//   CoffeeTable        → журнальный столик
//   Shelf              → полка
//   Painting           → картина

export const HOTSPOTS: HotspotConfig[] = [
  {
    id: "room",
    label: "Комната",
    position: [0.3, 1.8, -1.2],
    materialNames: ["Structure_Windows"],
    variants: ROOM_VARIANTS,
  },
  {
    id: "backdrop",
    label: "Фон стена",
    position: [-0.2, 1.2, -1.4],
    materialNames: ["Backdrop"],
    variants: BACKDROP_VARIANTS,
  },
  {
    id: "sofa",
    label: "Диван",
    position: [-0.6, 0.6, 0.8],
    materialNames: ["Sofa"],
    variants: SOFA_VARIANTS,
  },
  {
    id: "carpet",
    label: "Ковёр",
    position: [0.5, 0.05, 0.9],
    materialNames: ["Carpet"],
    variants: CARPET_VARIANTS,
  },
];

// === Начальное состояние ===

export type RoomState = Record<string, string>;

export function getDefaultState(): RoomState {
  const state: RoomState = {};
  for (const hs of HOTSPOTS) {
    state[hs.id] = hs.variants[0].value;
  }
  return state;
}
