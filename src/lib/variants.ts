// === Общие варианты материалов (используются во всех комнатах) ===

export type VariantType = "color" | "texture";

export interface Variant {
  name: string;
  type: VariantType;
  value: string;
  preview: string;
}

export const WALL_VARIANTS: Variant[] = [
  { name: "Оригинал", type: "color", value: "", preview: "#e8e0d4" },
  { name: "Белый", type: "color", value: "#f5f5f5", preview: "#f5f5f5" },
  { name: "Бежевый", type: "color", value: "#f0e6d3", preview: "#f0e6d3" },
  { name: "Серый", type: "color", value: "#c0c0c0", preview: "#c0c0c0" },
  { name: "Голубой", type: "color", value: "#ccdde8", preview: "#ccdde8" },
  { name: "Мятный", type: "color", value: "#d4e8d0", preview: "#d4e8d0" },
  { name: "Розовый", type: "color", value: "#e8d0d4", preview: "#e8d0d4" },
  { name: "Обои 1", type: "texture", value: "/textures/walls/imgi_12_8811984814110.png", preview: "/textures/walls/imgi_12_8811984814110.png" },
  { name: "Обои 2", type: "texture", value: "/textures/walls/imgi_32_8802495791134.png", preview: "/textures/walls/imgi_32_8802495791134.png" },
  { name: "Обои 3", type: "texture", value: "/textures/walls/imgi_35_8812769542174.png", preview: "/textures/walls/imgi_35_8812769542174.png" },
  { name: "Обои 4", type: "texture", value: "/textures/walls/imgi_37_8811985338398.png", preview: "/textures/walls/imgi_37_8811985338398.png" },
  { name: "Обои 5", type: "texture", value: "/textures/walls/imgi_39_8812008341534.png", preview: "/textures/walls/imgi_39_8812008341534.png" },
  { name: "Обои 6", type: "texture", value: "/textures/walls/imgi_43_8802538258462.png", preview: "/textures/walls/imgi_43_8802538258462.png" },
];

export const FLOOR_VARIANTS: Variant[] = [
  { name: "Оригинал", type: "color", value: "", preview: "#8b7355" },
  { name: "Паркет 1", type: "texture", value: "/textures/floor/imgi_13_8812331991070.png", preview: "/textures/floor/imgi_13_8812331991070.png" },
  { name: "Паркет 2", type: "texture", value: "/textures/floor/imgi_15_8804478484510.png", preview: "/textures/floor/imgi_15_8804478484510.png" },
  { name: "Плитка", type: "texture", value: "/textures/floor/imgi_17_8804477567006.png", preview: "/textures/floor/imgi_17_8804477567006.png" },
  { name: "Ламинат 1", type: "texture", value: "/textures/floor/imgi_6_8804494802974.png", preview: "/textures/floor/imgi_6_8804494802974.png" },
  { name: "Ламинат 2", type: "texture", value: "/textures/floor/imgi_9_8804476518430.png", preview: "/textures/floor/imgi_9_8804476518430.png" },
  { name: "Серый", type: "color", value: "#999999", preview: "#999999" },
  { name: "Тёмный", type: "color", value: "#4a3a2a", preview: "#4a3a2a" },
];

export const CEILING_VARIANTS: Variant[] = [
  { name: "Оригинал", type: "color", value: "", preview: "#f0ebe4" },
  { name: "Белый", type: "color", value: "#ffffff", preview: "#ffffff" },
  { name: "Кремовый", type: "color", value: "#f5f0e0", preview: "#f5f0e0" },
  { name: "Серый", type: "color", value: "#d0d0d0", preview: "#d0d0d0" },
  { name: "Темный", type: "color", value: "#1c2024", preview: "#1c2024" },
];

export const FURNITURE_VARIANTS: Variant[] = [
  { name: "Оригинал", type: "color", value: "", preview: "#9b8b7a" },
  { name: "Вариант 1", type: "texture", value: "/textures/furniture/imgi_10_8811986518046.png", preview: "/textures/furniture/imgi_10_8811986518046.png" },
  { name: "Вариант 2", type: "texture", value: "/textures/furniture/imgi_14_8812768460830.png", preview: "/textures/furniture/imgi_14_8812768460830.png" },
  { name: "Вариант 3", type: "texture", value: "/textures/furniture/imgi_16_8812777209886.png", preview: "/textures/furniture/imgi_16_8812777209886.png" },
  { name: "Вариант 4", type: "texture", value: "/textures/furniture/imgi_9_8812767674398.png", preview: "/textures/furniture/imgi_9_8812767674398.png" },
  { name: "Серый", type: "color", value: "#7a7a7a", preview: "#7a7a7a" },
  { name: "Бежевый", type: "color", value: "#c4a882", preview: "#c4a882" },
  { name: "Тёмный", type: "color", value: "#3a3a3a", preview: "#3a3a3a" },
];

export const COUNTERTOP_VARIANTS: Variant[] = [
  { name: "Оригинал", type: "color", value: "", preview: "#888888" },
  { name: "Белый мрамор", type: "color", value: "#f0ece6", preview: "#f0ece6" },
  { name: "Серый камень", type: "color", value: "#8c8c8c", preview: "#8c8c8c" },
  { name: "Бежевый", type: "color", value: "#d4c4a8", preview: "#d4c4a8" },
  { name: "Тёмный гранит", type: "color", value: "#2d2d2d", preview: "#2d2d2d" },
  { name: "Дуб", type: "texture", value: "/textures/furniture/imgi_10_8811986518046.png", preview: "/textures/furniture/imgi_10_8811986518046.png" },
  { name: "Орех", type: "texture", value: "/textures/furniture/imgi_9_8812767674398.png", preview: "/textures/furniture/imgi_9_8812767674398.png" },
];

export const CABINET_VARIANTS: Variant[] = [
  { name: "Оригинал", type: "color", value: "", preview: "#252220" },
  { name: "Белый", type: "color", value: "#f5f5f5", preview: "#f5f5f5" },
  { name: "Бежевый", type: "color", value: "#e8dcc8", preview: "#e8dcc8" },
  { name: "Серый", type: "color", value: "#8a8a8a", preview: "#8a8a8a" },
  { name: "Тёмно-серый", type: "color", value: "#4a4a4a", preview: "#4a4a4a" },
  { name: "Чёрный", type: "color", value: "#1a1a1a", preview: "#1a1a1a" },
  { name: "Оливковый", type: "color", value: "#6b7a5a", preview: "#6b7a5a" },
  { name: "Синий", type: "color", value: "#3a4a6a", preview: "#3a4a6a" },
  { name: "Бордо", type: "color", value: "#6a2a3a", preview: "#6a2a3a" },
  { name: "Дерево 1", type: "texture", value: "/textures/furniture/imgi_10_8811986518046.png", preview: "/textures/furniture/imgi_10_8811986518046.png" },
  { name: "Дерево 2", type: "texture", value: "/textures/furniture/imgi_14_8812768460830.png", preview: "/textures/furniture/imgi_14_8812768460830.png" },
  { name: "Дерево 3", type: "texture", value: "/textures/furniture/imgi_16_8812777209886.png", preview: "/textures/furniture/imgi_16_8812777209886.png" },
  { name: "Дерево 4", type: "texture", value: "/textures/furniture/imgi_9_8812767674398.png", preview: "/textures/furniture/imgi_9_8812767674398.png" },
];
