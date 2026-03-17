export interface ColorOption {
  name: string;
  value: string;
}

export interface WallpaperOption {
  name: string;
  value: string;
  preview: string;
}

export interface RoomConfig {
  wallTexture: string;
  floorColor: string;
  tableColor: string;
  chairColor: string;
}

export const WALL_TEXTURES: WallpaperOption[] = [
  { name: "Обои 1", value: "/img-fon/imgi_11_8802492776478.png", preview: "/img-fon/imgi_11_8802492776478.png" },
  { name: "Обои 2", value: "/img-fon/imgi_12_8811984814110.png", preview: "/img-fon/imgi_12_8811984814110.png" },
  { name: "Обои 3", value: "/img-fon/imgi_19_8812778782750.png", preview: "/img-fon/imgi_19_8812778782750.png" },
  { name: "Обои 4", value: "/img-fon/imgi_25_8811986059294.png", preview: "/img-fon/imgi_25_8811986059294.png" },
];

export const FLOOR_COLORS: ColorOption[] = [
  { name: "Дуб", value: "#c4a265" },
  { name: "Вишня", value: "#8b4513" },
  { name: "Серый ламинат", value: "#9e9e9e" },
];

export const TABLE_COLORS: ColorOption[] = [
  { name: "Белый", value: "#f0f0f0" },
  { name: "Чёрный", value: "#2a2a2a" },
  { name: "Дерево", value: "#a0724a" },
];

export const CHAIR_COLORS: ColorOption[] = [
  { name: "Белый", value: "#f0f0f0" },
  { name: "Чёрный", value: "#2a2a2a" },
  { name: "Серый", value: "#808080" },
];

export const DEFAULT_CONFIG: RoomConfig = {
  wallTexture: WALL_TEXTURES[0].value,
  floorColor: FLOOR_COLORS[0].value,
  tableColor: TABLE_COLORS[0].value,
  chairColor: CHAIR_COLORS[0].value,
};
