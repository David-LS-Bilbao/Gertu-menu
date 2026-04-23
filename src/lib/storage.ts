export type Role = "Adulto/a" | "Niño/a" | "Adolescente" | "Mayor" | "Otro";
export type Ration = "pequeña" | "media" | "grande";

export type Allergen =
  | "Gluten"
  | "Lactosa"
  | "Frutos secos"
  | "Cacahuete"
  | "Marisco"
  | "Pescado"
  | "Huevo"
  | "Soja"
  | "Sésamo"
  | "Mostaza"
  | "Apio"
  | "Sulfitos";

export type Intolerance =
  | "Lactosa"
  | "Fructosa"
  | "Histamina"
  | "Sorbitol"
  | "FODMAP"
  | "Cafeína";

export type Condition =
  | "Diabetes"
  | "Hipertensión"
  | "Colesterol alto"
  | "Celiaquía"
  | "Enfermedad de Crohn"
  | "Síndrome intestino irritable"
  | "Reflujo"
  | "Anemia";

export type Diet =
  | "Omnívora"
  | "Vegetariana"
  | "Vegana"
  | "Pescetariana"
  | "Flexitariana"
  | "Mediterránea"
  | "Keto"
  | "Baja en sodio"
  | "Baja en azúcar"
  | "Halal"
  | "Kosher";

export interface FamilyMember {
  id: string;
  name: string;
  role: Role;
  ration: Ration;
  preferences: string;
  age?: number;
  allergens: Allergen[];
  intolerances: Intolerance[];
  conditions: Condition[];
  diets: Diet[];
}

const FAMILY_KEY = "est_family_members_v1";
const OPTION_KEY = "est_menu_option_v1";
const POINTS_KEY = "est_family_points_v1";

export type RewardActionId =
  | "eat_seasonal"
  | "zero_waste"
  | "try_new_veg"
  | "help_cook"
  | "km0_shopping"
  | "compost"
  | "water_glass"
  | "leftovers";

export interface RewardAction {
  id: RewardActionId;
  label: string;
  points: number;
  emoji: string;
}

export const REWARD_ACTIONS: RewardAction[] = [
  { id: "eat_seasonal", label: "Comer un producto de temporada", points: 10, emoji: "🥬" },
  { id: "try_new_veg", label: "Probar una verdura nueva", points: 25, emoji: "🥦" },
  { id: "zero_waste", label: "Plato sin desperdicio", points: 15, emoji: "♻️" },
  { id: "leftovers", label: "Reaprovechar sobras", points: 20, emoji: "🍲" },
  { id: "help_cook", label: "Ayudar a cocinar en casa", points: 15, emoji: "👩‍🍳" },
  { id: "km0_shopping", label: "Compra en BBK Azoka (km 0)", points: 30, emoji: "🛒" },
  { id: "compost", label: "Llevar restos al compost", points: 10, emoji: "🌱" },
  { id: "water_glass", label: "Agua en vez de refresco", points: 5, emoji: "💧" },
];

export interface PointsEntry {
  id: string;
  memberId: string;
  actionId: RewardActionId;
  points: number;
  date: string; // ISO
}

export interface PointsState {
  entries: PointsEntry[];
}

export const loadPoints = (): PointsState => {
  try {
    const raw = localStorage.getItem(POINTS_KEY);
    return raw ? (JSON.parse(raw) as PointsState) : { entries: [] };
  } catch {
    return { entries: [] };
  }
};

export const savePoints = (state: PointsState) => {
  localStorage.setItem(POINTS_KEY, JSON.stringify(state));
};

export interface RewardLevel {
  name: string;
  min: number;
  next: number | null;
  emoji: string;
}

export const getLevel = (total: number): RewardLevel => {
  if (total < 50) return { name: "Brote", min: 0, next: 50, emoji: "🌱" };
  if (total < 150) return { name: "Hortelano/a", min: 50, next: 150, emoji: "🥕" };
  if (total < 350) return { name: "Baserritarra", min: 150, next: 350, emoji: "🧑‍🌾" };
  if (total < 700) return { name: "Guardián km 0", min: 350, next: 700, emoji: "🌍" };
  return { name: "Embajador GertuMenu", min: 700, next: null, emoji: "🏆" };
};

export const loadFamily = (): FamilyMember[] => {
  try {
    const raw = localStorage.getItem(FAMILY_KEY);
    return raw ? (JSON.parse(raw) as FamilyMember[]) : [];
  } catch {
    return [];
  }
};

export const saveFamily = (members: FamilyMember[]) => {
  localStorage.setItem(FAMILY_KEY, JSON.stringify(members));
};

export const loadOption = (): number | null => {
  const raw = localStorage.getItem(OPTION_KEY);
  return raw ? Number(raw) : null;
};

export const saveOption = (option: number) => {
  localStorage.setItem(OPTION_KEY, String(option));
};

/** Strip forbidden characters from text inputs as a defense-in-depth measure. */
export const sanitizeInput = (value: string, maxLength = 60): string => {
  return value
    .replace(/[<>/\\*|;:@¿?¡!]/g, "")
    .slice(0, maxLength);
};