export interface ColorOption {
  name: string;
  value: string;
}

export interface RoomConfig {
  wallColor: string;
  floorColor: string;
  tableColor: string;
  chairColor: string;
}

export const WALL_COLORS: ColorOption[] = [
  { name: "Белый", value: "#ffffff" },
  { name: "Бежевый", value: "#f5e6ca" },
  { name: "Серый", value: "#b0b0b0" },
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
  wallColor: WALL_COLORS[0].value,
  floorColor: FLOOR_COLORS[0].value,
  tableColor: TABLE_COLORS[0].value,
  chairColor: CHAIR_COLORS[0].value,
};
