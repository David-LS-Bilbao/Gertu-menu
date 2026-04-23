import { FamilyMember } from "@/lib/storage";

export type Cuisine =
  | "Vasca tradicional"
  | "Mediterránea"
  | "Internacional"
  | "Asiática"
  | "Latinoamericana";

export type Budget = "ajustado" | "equilibrado" | "premium";
export type CookingTime = "rápido" | "medio" | "elaborado";
export type Variety = "monótono" | "equilibrado" | "muy variado";

export interface MenuConfig {
  days: number; // 1-7
  mealsPerDay: ("desayuno" | "comida" | "cena" | "snack")[];
  cuisines: Cuisine[];
  budget: Budget;
  cookingTime: CookingTime;
  variety: Variety;
  seasonal: boolean;
  reduceWaste: boolean;
  km0Strict: boolean;
  excludeIngredients: string[]; // free text, sanitized
  occasion: string; // e.g. "cumpleaños niño", "cena con invitados"
}

export const DEFAULT_CONFIG: MenuConfig = {
  days: 5,
  mealsPerDay: ["comida", "cena"],
  cuisines: ["Vasca tradicional", "Mediterránea"],
  budget: "equilibrado",
  cookingTime: "medio",
  variety: "equilibrado",
  seasonal: true,
  reduceWaste: true,
  km0Strict: true,
  excludeIngredients: [],
  occasion: "",
};

export interface DishSuggestion {
  name: string;
  tags: string[]; // e.g. "vegano", "sin gluten", "rápido"
  cuisine: Cuisine;
  km: number; // distance origin
  producer: string;
  cookMinutes: number;
}

const POOL: DishSuggestion[] = [
  { name: "Porrusalda con patata alavesa", tags: ["vegetariana", "sin gluten", "tradicional"], cuisine: "Vasca tradicional", km: 18, producer: "Caserío Erroeta · Mungia", cookMinutes: 35 },
  { name: "Marmitako de bonito del Cantábrico", tags: ["pescado", "tradicional"], cuisine: "Vasca tradicional", km: 22, producer: "Cofradía Bermeo", cookMinutes: 50 },
  { name: "Alubias rojas de Tolosa con verduras", tags: ["vegetariana", "legumbre", "sin gluten"], cuisine: "Vasca tradicional", km: 75, producer: "Baserri Tolosa", cookMinutes: 90 },
  { name: "Crema de calabaza de Markina con AOVE", tags: ["vegana", "sin gluten", "rápido"], cuisine: "Mediterránea", km: 30, producer: "Huerta Markina", cookMinutes: 25 },
  { name: "Pisto de verduras de huerta vasca", tags: ["vegana", "sin gluten"], cuisine: "Mediterránea", km: 15, producer: "Huerta Mungia", cookMinutes: 30 },
  { name: "Tortilla de pimiento de Gernika", tags: ["vegetariana", "sin gluten", "rápido"], cuisine: "Vasca tradicional", km: 25, producer: "Gernika Baserri", cookMinutes: 20 },
  { name: "Merluza al horno con patata de Álava", tags: ["pescado", "sin gluten"], cuisine: "Vasca tradicional", km: 35, producer: "Lonja Ondarroa", cookMinutes: 40 },
  { name: "Ensalada de tomate y queso Idiazabal", tags: ["vegetariana", "sin gluten", "rápido"], cuisine: "Mediterránea", km: 40, producer: "Pastor Urkiola", cookMinutes: 10 },
  { name: "Garbanzos guisados con acelgas locales", tags: ["vegana", "legumbre", "sin gluten"], cuisine: "Mediterránea", km: 50, producer: "Huerta Bizkaia", cookMinutes: 80 },
  { name: "Revuelto de perretxikos", tags: ["vegetariana", "rápido", "sin gluten"], cuisine: "Vasca tradicional", km: 28, producer: "Setas Orozko", cookMinutes: 15 },
  { name: "Risotto de calabaza y queso curado", tags: ["vegetariana"], cuisine: "Mediterránea", km: 30, producer: "Huerta Markina", cookMinutes: 35 },
  { name: "Curry de verduras y leche de coco", tags: ["vegana", "sin gluten"], cuisine: "Asiática", km: 60, producer: "Huerta Bizkaia + import", cookMinutes: 30 },
  { name: "Tacos de calabacín y maíz", tags: ["vegana"], cuisine: "Latinoamericana", km: 45, producer: "Huerta Mungia", cookMinutes: 25 },
  { name: "Bowl de quinoa, tomate y aguacate", tags: ["vegana", "sin gluten", "rápido"], cuisine: "Internacional", km: 55, producer: "Huerta Bizkaia", cookMinutes: 15 },
  { name: "Tallarines salteados con verduras", tags: ["vegetariana"], cuisine: "Asiática", km: 40, producer: "Huerta Bizkaia", cookMinutes: 20 },
  { name: "Bonito a la plancha con pimientos", tags: ["pescado", "sin gluten"], cuisine: "Vasca tradicional", km: 22, producer: "Cofradía Bermeo", cookMinutes: 20 },
  { name: "Sopa de pescado del Cantábrico", tags: ["pescado"], cuisine: "Vasca tradicional", km: 22, producer: "Cofradía Bermeo", cookMinutes: 60 },
  { name: "Lentejas de la huerta con verduras", tags: ["vegana", "legumbre", "sin gluten"], cuisine: "Mediterránea", km: 55, producer: "Baserri Karrantza", cookMinutes: 70 },
];

/** Generate a menu plan based on family + config. Pure deterministic-ish heuristic. */
export function generateMenu(
  family: FamilyMember[],
  config: MenuConfig,
): { day: string; slots: { meal: string; dish: DishSuggestion }[] }[] {
  const dayNames = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  // Aggregate family constraints
  const allergens = new Set<string>();
  const intolerances = new Set<string>();
  const diets = new Set<string>();
  family.forEach((m) => {
    m.allergens?.forEach((a) => allergens.add(a.toLowerCase()));
    m.intolerances?.forEach((i) => intolerances.add(i.toLowerCase()));
    m.diets?.forEach((d) => diets.add(d.toLowerCase()));
  });

  const wantsVegan = diets.has("vegana");
  const wantsVegetarian = wantsVegan || diets.has("vegetariana");
  const noGluten = allergens.has("gluten") || intolerances.has("celiaquía");
  const noLactose = allergens.has("lactosa") || intolerances.has("lactosa");
  const noSeafood = allergens.has("marisco") || allergens.has("pescado");
  const excludeText = config.excludeIngredients.map((s) => s.toLowerCase());

  const maxCook =
    config.cookingTime === "rápido"
      ? 25
      : config.cookingTime === "medio"
        ? 60
        : 999;
  const maxKm = config.km0Strict ? 60 : 200;

  const filtered = POOL.filter((d) => {
    if (config.cuisines.length && !config.cuisines.includes(d.cuisine))
      return false;
    if (d.cookMinutes > maxCook) return false;
    if (d.km > maxKm) return false;
    if (wantsVegan && !d.tags.includes("vegana")) return false;
    if (
      wantsVegetarian &&
      !d.tags.includes("vegana") &&
      !d.tags.includes("vegetariana")
    )
      return false;
    if (noGluten && !d.tags.includes("sin gluten")) return false;
    if (noLactose && /queso|leche|crema|risotto/i.test(d.name)) return false;
    if (noSeafood && d.tags.includes("pescado")) return false;
    if (excludeText.some((ex) => ex && d.name.toLowerCase().includes(ex)))
      return false;
    return true;
  });

  const pool = filtered.length ? filtered : POOL; // graceful fallback

  // Variety = how many unique dishes we try to keep
  const days = Math.min(Math.max(config.days, 1), 7);
  const plan: { day: string; slots: { meal: string; dish: DishSuggestion }[] }[] =
    [];

  let cursor = 0;
  for (let i = 0; i < days; i++) {
    const slots = config.mealsPerDay.map((meal) => {
      const dish = pool[cursor % pool.length];
      cursor +=
        config.variety === "monótono"
          ? 0
          : config.variety === "equilibrado"
            ? 1
            : 2;
      return { meal, dish };
    });
    plan.push({ day: dayNames[i], slots });
  }
  return plan;
}