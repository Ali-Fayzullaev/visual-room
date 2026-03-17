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
  /** Позиция кнопки в 3D-сцене [x, y, z] */
  position: [number, number, number];
  /** Имена материалов в GLTF-модели, которые меняются */
  materialNames: string[];
  variants: Variant[];
}

// === Варианты для каждого элемента ===

const WALL_VARIANTS: Variant[] = [
  { name: "Белый", type: "color", value: "#f5f5f5", preview: "#f5f5f5" },
  { name: "Бежевый", type: "color", value: "#f0e6d3", preview: "#f0e6d3" },
  { name: "Серый", type: "color", value: "#c0c0c0", preview: "#c0c0c0" },
  { name: "Обои 1", type: "texture", value: "/textures/walls/imgi_12_8811984814110.png", preview: "/textures/walls/imgi_12_8811984814110.png" },
  { name: "Обои 2", type: "texture", value: "/textures/walls/imgi_32_8802495791134.png", preview: "/textures/walls/imgi_32_8802495791134.png" },
  { name: "Обои 3", type: "texture", value: "/textures/walls/imgi_35_8812769542174.png", preview: "/textures/walls/imgi_35_8812769542174.png" },
  { name: "Обои 4", type: "texture", value: "/textures/walls/imgi_37_8811985338398.png", preview: "/textures/walls/imgi_37_8811985338398.png" },
  { name: "Обои 5", type: "texture", value: "/textures/walls/imgi_39_8812008341534.png", preview: "/textures/walls/imgi_39_8812008341534.png" },
  { name: "Обои 6", type: "texture", value: "/textures/walls/imgi_43_8802538258462.png", preview: "/textures/walls/imgi_43_8802538258462.png" },
];

const CEILING_VARIANTS: Variant[] = [
  { name: "Белый", type: "color", value: "#ffffff", preview: "#ffffff" },
  { name: "Светло-серый", type: "color", value: "#e8e8e8", preview: "#e8e8e8" },
  { name: "Кремовый", type: "color", value: "#fdf5e6", preview: "#fdf5e6" },
  { name: "Потолок 1", type: "texture", value: "/textures/ceiling/imgi_12_8811984814110.png", preview: "/textures/ceiling/imgi_12_8811984814110.png" },
  { name: "Потолок 2", type: "texture", value: "/textures/ceiling/imgi_32_8802495791134.png", preview: "/textures/ceiling/imgi_32_8802495791134.png" },
  { name: "Потолок 3", type: "texture", value: "/textures/ceiling/imgi_35_8812769542174.png", preview: "/textures/ceiling/imgi_35_8812769542174.png" },
  { name: "Потолок 4", type: "texture", value: "/textures/ceiling/imgi_37_8811985338398.png", preview: "/textures/ceiling/imgi_37_8811985338398.png" },
  { name: "Потолок 5", type: "texture", value: "/textures/ceiling/imgi_39_8812008341534.png", preview: "/textures/ceiling/imgi_39_8812008341534.png" },
  { name: "Потолок 6", type: "texture", value: "/textures/ceiling/imgi_43_8802538258462.png", preview: "/textures/ceiling/imgi_43_8802538258462.png" },
];

const FLOOR_VARIANTS: Variant[] = [
  { name: "Паркет 1", type: "texture", value: "/textures/floor/imgi_13_8812331991070.png", preview: "/textures/floor/imgi_13_8812331991070.png" },
  { name: "Паркет 2", type: "texture", value: "/textures/floor/imgi_15_8804478484510.png", preview: "/textures/floor/imgi_15_8804478484510.png" },
  { name: "Плитка", type: "texture", value: "/textures/floor/imgi_17_8804477567006.png", preview: "/textures/floor/imgi_17_8804477567006.png" },
  { name: "Ламинат 1", type: "texture", value: "/textures/floor/imgi_6_8804494802974.png", preview: "/textures/floor/imgi_6_8804494802974.png" },
  { name: "Ламинат 2", type: "texture", value: "/textures/floor/imgi_9_8804476518430.png", preview: "/textures/floor/imgi_9_8804476518430.png" },
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

// === Hotspot-ы ===

export const HOTSPOTS: HotspotConfig[] = [
  {
    id: "walls",
    label: "Стены",
    position: [0, 2.5, -1.5],
    materialNames: ["Backdrop"],
    variants: WALL_VARIANTS,
  },
  {
    id: "ceiling",
    label: "Потолок",
    position: [0, 3.8, 0],
    materialNames: ["Structure"],
    variants: CEILING_VARIANTS,
  },
  {
    id: "floor",
    label: "Пол",
    position: [0, 0.1, 1.0],
    materialNames: ["material_14"],
    variants: FLOOR_VARIANTS,
  },
  {
    id: "sofa",
    label: "Диван",
    position: [-1.0, 1.0, 1.5],
    materialNames: ["Sofa"],
    variants: SOFA_VARIANTS,
  },
  {
    id: "carpet",
    label: "Ковёр",
    position: [1.0, 0.1, 1.5],
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
