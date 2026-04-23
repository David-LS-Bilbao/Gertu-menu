import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelectChips } from "@/components/MultiSelectChips";
import {
  Cuisine,
  DEFAULT_CONFIG,
  MenuConfig,
  generateMenu,
} from "@/lib/menuGenerator";
import { FamilyMember, sanitizeInput } from "@/lib/storage";
import { Sparkles, RefreshCcw, Settings2, Utensils } from "lucide-react";

const CUISINES: Cuisine[] = [
  "Vasca tradicional",
  "Mediterránea",
  "Internacional",
  "Asiática",
  "Latinoamericana",
];

const MEALS = ["desayuno", "comida", "cena", "snack"] as const;

interface Props {
  family: FamilyMember[];
}

export const MenuConfigurator = ({ family }: Props) => {
  const [cfg, setCfg] = useState<MenuConfig>(DEFAULT_CONFIG);
  const [excludeText, setExcludeText] = useState("");
  const [version, setVersion] = useState(0);

  const plan = useMemo(
    () => generateMenu(family, cfg),
    // include version to allow manual regenerate
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [family, cfg, version],
  );

  const familySummary = useMemo(() => {
    const allergens = new Set<string>();
    const diets = new Set<string>();
    family.forEach((m) => {
      m.allergens?.forEach((a) => allergens.add(a));
      m.diets?.forEach((d) => diets.add(d));
    });
    return {
      members: family.length,
      allergens: [...allergens],
      diets: [...diets],
    };
  }, [family]);

  const updateExclude = (raw: string) => {
    const safe = sanitizeInput(raw, 120);
    setExcludeText(safe);
    const list = safe
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setCfg({ ...cfg, excludeIngredients: list });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      {/* Configurador */}
      <aside className="space-y-5 rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-leaf text-primary-foreground">
            <Settings2 className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-serif text-lg font-semibold">
              Personaliza el menú
            </h3>
            <p className="text-xs text-muted-foreground">
              Adaptado a {familySummary.members} miembro
              {familySummary.members === 1 ? "" : "s"} ·{" "}
              {familySummary.diets.length || 0} dieta
              {familySummary.diets.length === 1 ? "" : "s"} ·{" "}
              {familySummary.allergens.length || 0} alérgeno
              {familySummary.allergens.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Días de planificación: <strong>{cfg.days}</strong></Label>
          <Slider
            value={[cfg.days]}
            min={1}
            max={7}
            step={1}
            onValueChange={(v) => setCfg({ ...cfg, days: v[0] })}
          />
        </div>

        <div className="space-y-2">
          <Label>Comidas al día</Label>
          <MultiSelectChips
            ariaLabel="Comidas al día"
            options={MEALS}
            value={cfg.mealsPerDay}
            onChange={(v) =>
              setCfg({
                ...cfg,
                mealsPerDay: v.length
                  ? (v as MenuConfig["mealsPerDay"])
                  : ["comida"],
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Cocinas</Label>
          <MultiSelectChips
            ariaLabel="Cocinas"
            options={CUISINES}
            value={cfg.cuisines}
            onChange={(v) => setCfg({ ...cfg, cuisines: v as Cuisine[] })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Presupuesto</Label>
            <Select
              value={cfg.budget}
              onValueChange={(v) =>
                setCfg({ ...cfg, budget: v as MenuConfig["budget"] })
              }
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ajustado">Ajustado</SelectItem>
                <SelectItem value="equilibrado">Equilibrado</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tiempo de cocina</Label>
            <Select
              value={cfg.cookingTime}
              onValueChange={(v) =>
                setCfg({ ...cfg, cookingTime: v as MenuConfig["cookingTime"] })
              }
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rápido">Rápido (≤25 min)</SelectItem>
                <SelectItem value="medio">Medio (≤60 min)</SelectItem>
                <SelectItem value="elaborado">Elaborado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Variedad</Label>
          <Select
            value={cfg.variety}
            onValueChange={(v) =>
              setCfg({ ...cfg, variety: v as MenuConfig["variety"] })
            }
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="monótono">Pocos platos repetidos</SelectItem>
              <SelectItem value="equilibrado">Equilibrado</SelectItem>
              <SelectItem value="muy variado">Muy variado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exclude">Excluir ingredientes (separados por coma)</Label>
          <Input
            id="exclude"
            value={excludeText}
            placeholder="Ej. champiñón, calabaza"
            maxLength={120}
            onChange={(e) => updateExclude(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="occ">Ocasión especial (opcional)</Label>
          <Input
            id="occ"
            value={cfg.occasion}
            placeholder="Ej. cena con invitados, cumpleaños"
            maxLength={60}
            onChange={(e) =>
              setCfg({ ...cfg, occasion: sanitizeInput(e.target.value, 60) })
            }
          />
        </div>

        <div className="space-y-3 rounded-2xl bg-secondary/40 p-4">
          <Toggle
            label="Solo temporada"
            value={cfg.seasonal}
            onChange={(v) => setCfg({ ...cfg, seasonal: v })}
          />
          <Toggle
            label="Reducir desperdicio (reaprovechar)"
            value={cfg.reduceWaste}
            onChange={(v) => setCfg({ ...cfg, reduceWaste: v })}
          />
          <Toggle
            label="Estricto km 0 (≤60 km)"
            value={cfg.km0Strict}
            onChange={(v) => setCfg({ ...cfg, km0Strict: v })}
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            className="flex-1 rounded-full"
            onClick={() => setVersion((v) => v + 1)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generar menú
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => {
              setCfg(DEFAULT_CONFIG);
              setExcludeText("");
            }}
            aria-label="Restablecer"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      {/* Resultado */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-lg font-semibold">
              Tu menú adaptado
            </h3>
          </div>
          {cfg.occasion && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              ✨ {cfg.occasion}
            </span>
          )}
        </div>

        {family.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-border p-6 text-sm text-muted-foreground">
            Aún no has añadido miembros. El menú se generará con valores
            estándar. Añade tu familia en el paso 1 para personalizarlo.
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {plan.map((d) => (
            <article
              key={d.day}
              className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-warm"
            >
              <header className="mb-3 flex items-center justify-between">
                <h4 className="font-serif text-base font-semibold">{d.day}</h4>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-earth">
                  Km 0 · Bizkaia
                </span>
              </header>
              <ul className="space-y-3">
                {d.slots.map((s, idx) => (
                  <li key={idx}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {s.meal}
                    </p>
                    <p className="text-sm font-medium">{s.dish.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.dish.producer} · {s.dish.km} km · {s.dish.cookMinutes}{" "}
                      min
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {s.dish.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

const Toggle = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-3">
    <Label className="text-sm font-normal">{label}</Label>
    <Switch checked={value} onCheckedChange={onChange} />
  </div>
);

export default MenuConfigurator;