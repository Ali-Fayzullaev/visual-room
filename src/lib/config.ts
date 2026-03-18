import {
  type Variant,
  type VariantType,
  WALL_VARIANTS,
  FLOOR_VARIANTS,
  CEILING_VARIANTS,
  FURNITURE_VARIANTS,
} from "./variants";

export type { Variant, VariantType };

// === Типы ===

export interface ZoneConfig {
  id: string;
  label: string;
  maskImage: string;
  buttonPos: { x: number; y: number };
  blendMode: string;
  opacity: number;
  variants: Variant[];
}

export interface RoomConfig {
  id: string;
  name: string;
  description: string;
  preview: string;
  baseImage: string;
  zones: ZoneConfig[];
}

export type RoomState = Record<string, string>;

// === Каталог комнат ===

export const ROOMS: RoomConfig[] = [
  {
    id: "room-1",
    name: "Гостиная",
    description: "Современная гостиная с диваном и мебелью",
    preview: "/rooms/room-1/preview.png",
    baseImage: "/rooms/room-1/all-room.png",
    zones: [
      {
        id: "wall",
        label: "Стена",
        maskImage: "/rooms/room-1/prydumano-design-vIbxvHj9m9g-unsplash.png",
        buttonPos: { x: 30, y: 30 },
        blendMode: "multiply",
        opacity: 0.55,
        variants: WALL_VARIANTS,
      },
      {
        id: "floor",
        label: "Пол",
        maskImage: "/rooms/room-1/floor.png",
        buttonPos: { x: 50, y: 85 },
        blendMode: "multiply",
        opacity: 0.6,
        variants: FLOOR_VARIANTS,
      },
      {
        id: "ceiling",
        label: "Потолок",
        maskImage: "/rooms/room-1/pathologist.png",
        buttonPos: { x: 50, y: 8 },
        blendMode: "multiply",
        opacity: 0.45,
        variants: CEILING_VARIANTS,
      },
      {
        id: "furniture",
        label: "Мебель",
        maskImage: "/rooms/room-1/furniture.png",
        buttonPos: { x: 75, y: 60 },
        blendMode: "normal",
        opacity: 0.8,
        variants: FURNITURE_VARIANTS,
      },
    ],
  },
  {
    id: "room-2",
    name: "Комната 2",
    description: "Второй вариант интерьера",
    preview: "/rooms/room-2/preview.png",
    baseImage: "/rooms/room-2/all-room_2.png",
    zones: [
      {
        id: "wall",
        label: "Стена",
        maskImage: "/rooms/room-2/wall.png",
        buttonPos: { x: 40, y: 30 },
        blendMode: "multiply",
        opacity: 0.55,
        variants: WALL_VARIANTS,
      },
      {
        id: "floor",
        label: "Пол",
        maskImage: "/rooms/room-2/floor.png",
        buttonPos: { x: 50, y: 85 },
        blendMode: "multiply",
        opacity: 0.6,
        variants: FLOOR_VARIANTS,
      },
      {
        id: "ceiling",
        label: "Потолок",
        maskImage: "/rooms/room-2/pathologist.png",
        buttonPos: { x: 50, y: 8 },
        blendMode: "multiply",
        opacity: 0.45,
        variants: CEILING_VARIANTS,
      },
      {
        id: "furniture",
        label: "Мебель",
        maskImage: "/rooms/room-2/furniture.png",
        buttonPos: { x: 70, y: 60 },
        blendMode: "normal",
        opacity: 0.8,
        variants: FURNITURE_VARIANTS,
      },
    ],
  },
  // Когда добавите room-3... — просто скопируйте блок выше
];

// === Утилиты ===

export function getRoomById(id: string): RoomConfig | undefined {
  return ROOMS.find((r) => r.id === id);
}

export function getDefaultState(zones: ZoneConfig[]): RoomState {
  const state: RoomState = {};
  for (const zone of zones) {
    state[zone.id] = zone.variants[0].value;
  }
  return state;
}
