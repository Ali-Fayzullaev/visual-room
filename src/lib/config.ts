import {
  type Variant,
  type VariantType,
  WALL_VARIANTS,
  FLOOR_VARIANTS,
  CEILING_VARIANTS,
  FURNITURE_VARIANTS,
} from "./variants";

export type { Variant, VariantType };

// ╔══════════════════════════════════════════════╗
// ║  2D Room types (legacy)                     ║
// ╚══════════════════════════════════════════════╝

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

// ╔══════════════════════════════════════════════╗
// ║  3D Room types                              ║
// ╚══════════════════════════════════════════════╝

export interface Zone3DConfig {
  id: string;
  label: string;
  icon: string;
  materialNames: string[];
  textureRepeat: [number, number];
  roughness: number;
  metalness: number;
  variants: Variant[];
}

export interface Room3DConfig {
  id: string;
  name: string;
  description: string;
  preview: string;
  modelPath: string;
  zones: Zone3DConfig[];
}

// ╔══════════════════════════════════════════════╗
// ║  Common                                     ║
// ╚══════════════════════════════════════════════╝

export type RoomState = Record<string, string>;

// ╔══════════════════════════════════════════════╗
// ║  3D Room catalog                            ║
// ╚══════════════════════════════════════════════╝

export const ROOMS_3D: Room3DConfig[] = [
  {
    id: "living-room-3d",
    name: "Современная гостиная",
    description: "Реалистичная 3D-визуализация с настройкой материалов в реальном времени",
    preview: "/cozy_modern_living_room/textures/Backdrop_baseColor.png",
    modelPath: "/cozy_modern_living_room/scene.gltf",
    zones: [
      {
        id: "floor",
        label: "Пол",
        icon: "floor",
        materialNames: ["Carpet"],
        textureRepeat: [8, 8],
        roughness: 0.7,
        metalness: 0,
        variants: FLOOR_VARIANTS,
      },
      {
        id: "wall",
        label: "Стены",
        icon: "wall",
        materialNames: ["Backdrop"],
        textureRepeat: [4, 4],
        roughness: 0.9,
        metalness: 0,
        variants: WALL_VARIANTS,
      },
      {
        id: "sofa",
        label: "Диван",
        icon: "sofa",
        materialNames: ["Sofa"],
        textureRepeat: [4, 4],
        roughness: 0.85,
        metalness: 0,
        variants: FURNITURE_VARIANTS,
      },
      {
        id: "furniture",
        label: "Мебель",
        icon: "furniture",
        materialNames: ["Shelf", "CoffeeTable", "EndTable"],
        textureRepeat: [3, 3],
        roughness: 0.5,
        metalness: 0.05,
        variants: FURNITURE_VARIANTS,
      },
    ],
  },
];

// ╔══════════════════════════════════════════════╗
// ║  2D Room catalog (legacy)                   ║
// ╚══════════════════════════════════════════════╝

export const ROOMS: RoomConfig[] = [
  {
    id: "room-1",
    name: "Гостиная 2D",
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
    name: "Комната 2D",
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
];

// ╔══════════════════════════════════════════════╗
// ║  Utilities                                  ║
// ╚══════════════════════════════════════════════╝

export function getRoomById(id: string): RoomConfig | undefined {
  return ROOMS.find((r) => r.id === id);
}

export function getRoom3DById(id: string): Room3DConfig | undefined {
  return ROOMS_3D.find((r) => r.id === id);
}

export function getDefaultState(zones: { id: string; variants: Variant[] }[]): RoomState {
  const state: RoomState = {};
  for (const zone of zones) {
    state[zone.id] = zone.variants[0]?.value ?? "";
  }
  return state;
}

export function getDefaultState3D(zones: Zone3DConfig[]): RoomState {
  const state: RoomState = {};
  for (const zone of zones) {
    state[zone.id] = ""; // empty = original model texture
  }
  return state;
}

/** Get all rooms as a unified list for the catalog */
export function getAllRooms(): Array<{
  id: string;
  name: string;
  description: string;
  preview: string;
  type: "2d" | "3d";
  zoneCount: number;
}> {
  const rooms3d = ROOMS_3D.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    preview: r.preview,
    type: "3d" as const,
    zoneCount: r.zones.length,
  }));

  const rooms2d = ROOMS.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    preview: r.preview,
    type: "2d" as const,
    zoneCount: r.zones.length,
  }));

  return rooms2d;
}
