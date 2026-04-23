import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, UserPlus, Users } from "lucide-react";
import {
  Allergen,
  Condition,
  Diet,
  FamilyMember,
  Intolerance,
  Ration,
  Role,
  loadFamily,
  sanitizeInput,
  saveFamily,
} from "@/lib/storage";
import { MultiSelectChips } from "@/components/MultiSelectChips";

const ROLES: Role[] = ["Adulto/a", "Niño/a", "Adolescente", "Mayor", "Otro"];
const RATIONS: Ration[] = ["pequeña", "media", "grande"];

const ALLERGENS: Allergen[] = [
  "Gluten",
  "Lactosa",
  "Frutos secos",
  "Cacahuete",
  "Marisco",
  "Pescado",
  "Huevo",
  "Soja",
  "Sésamo",
  "Mostaza",
  "Apio",
  "Sulfitos",
];

const INTOLERANCES: Intolerance[] = [
  "Lactosa",
  "Fructosa",
  "Histamina",
  "Sorbitol",
  "FODMAP",
  "Cafeína",
];

const CONDITIONS: Condition[] = [
  "Diabetes",
  "Hipertensión",
  "Colesterol alto",
  "Celiaquía",
  "Enfermedad de Crohn",
  "Síndrome intestino irritable",
  "Reflujo",
  "Anemia",
];

const DIETS: Diet[] = [
  "Omnívora",
  "Vegetariana",
  "Vegana",
  "Pescetariana",
  "Flexitariana",
  "Mediterránea",
  "Keto",
  "Baja en sodio",
  "Baja en azúcar",
  "Halal",
  "Kosher",
];

const emptyForm = {
  name: "",
  role: "Adulto/a" as Role,
  ration: "media" as Ration,
  preferences: "",
  age: "" as string,
  allergens: [] as Allergen[],
  intolerances: [] as Intolerance[],
  conditions: [] as Condition[],
  diets: ["Mediterránea"] as Diet[],
};

const Family = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setMembers(loadFamily());
  }, []);

  useEffect(() => {
    saveFamily(members);
  }, [members]);

  const summary = useMemo(() => {
    const counts: Record<Ration, number> = { pequeña: 0, media: 0, grande: 0 };
    members.forEach((m) => counts[m.ration]++);
    return counts;
  }, [members]);

  const addMember = (e: React.FormEvent) => {
    e.preventDefault();
    const name = sanitizeInput(form.name, 40).trim();
    if (!name) {
      toast.error("Indica un nombre válido");
      return;
    }
    let age: number | undefined;
    if (form.age.trim() !== "") {
      const parsed = Number(form.age);
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 120) {
        toast.error("Edad inválida (0-120)");
        return;
      }
      age = Math.floor(parsed);
    }
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      name,
      role: form.role,
      ration: form.ration,
      preferences: sanitizeInput(form.preferences, 140),
      age,
      allergens: form.allergens,
      intolerances: form.intolerances,
      conditions: form.conditions,
      diets: form.diets,
    };
    setMembers((prev) => [...prev, newMember]);
    setForm(emptyForm);
    toast.success(`${name} añadido a la familia`);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const clearAll = () => {
    if (members.length === 0) return;
    if (confirm("¿Vaciar todo el grupo familiar?")) {
      setMembers([]);
      toast("Grupo familiar vacío");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container grid gap-8 py-10 lg:grid-cols-[1fr_1.1fr]">
        <section>
          <header className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-earth">
              Paso 1
            </p>
            <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
              Crea tu grupo familiar
            </h1>
            <p className="mt-2 text-muted-foreground">
              Cuéntanos quién come en casa para adaptar las raciones y
              necesidades.
            </p>
          </header>

          <form
            onSubmit={addMember}
            className="space-y-4 rounded-3xl border border-border/60 bg-card p-6 shadow-soft"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={form.name}
                maxLength={40}
                placeholder="Ej. Maialen"
                onChange={(e) =>
                  setForm({ ...form, name: sanitizeInput(e.target.value, 40) })
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm({ ...form, role: v as Role })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Perfil de ración</Label>
                <Select
                  value={form.ration}
                  onValueChange={(v) =>
                    setForm({ ...form, ration: v as Ration })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RATIONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Edad</Label>
              <Input
                id="age"
                type="number"
                inputMode="numeric"
                min={0}
                max={120}
                value={form.age}
                placeholder="Ej. 42"
                onChange={(e) =>
                  setForm({
                    ...form,
                    age: e.target.value.replace(/[^0-9]/g, "").slice(0, 3),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Dieta especial</Label>
              <MultiSelectChips
                ariaLabel="Dietas"
                options={DIETS}
                value={form.diets}
                onChange={(v) => setForm({ ...form, diets: v })}
              />
            </div>

            <div className="space-y-2">
              <Label>Alérgenos</Label>
              <MultiSelectChips
                ariaLabel="Alérgenos"
                options={ALLERGENS}
                value={form.allergens}
                onChange={(v) => setForm({ ...form, allergens: v })}
              />
            </div>

            <div className="space-y-2">
              <Label>Intolerancias</Label>
              <MultiSelectChips
                ariaLabel="Intolerancias"
                options={INTOLERANCES}
                value={form.intolerances}
                onChange={(v) => setForm({ ...form, intolerances: v })}
              />
            </div>

            <div className="space-y-2">
              <Label>Condiciones médicas</Label>
              <MultiSelectChips
                ariaLabel="Condiciones"
                options={CONDITIONS}
                value={form.conditions}
                onChange={(v) => setForm({ ...form, conditions: v })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prefs">Preferencias o necesidades</Label>
              <Textarea
                id="prefs"
                value={form.preferences}
                maxLength={140}
                rows={3}
                placeholder="Vegetariano, sin lactosa, alergia al marisco, come fuera los lunes..."
                onChange={(e) =>
                  setForm({
                    ...form,
                    preferences: sanitizeInput(e.target.value, 140),
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Máx. 140 caracteres. Sin símbolos especiales.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full shadow-warm"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Añadir miembro
            </Button>
          </form>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl bg-gradient-warm p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Miembros en la familia
                </p>
                <p className="font-serif text-4xl font-semibold">
                  {members.length}
                </p>
              </div>
              <span className="grid h-14 w-14 place-items-center rounded-full bg-card shadow-soft">
                <Users className="h-6 w-6 text-primary" />
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              {RATIONS.map((r) => (
                <div key={r} className="rounded-xl bg-card/70 p-2">
                  <p className="text-xs capitalize text-muted-foreground">{r}</p>
                  <p className="font-semibold">{summary[r]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {members.length === 0 && (
              <div className="rounded-3xl border-2 border-dashed border-border p-10 text-center text-muted-foreground">
                Aún no hay miembros. Empieza añadiendo a tu familia.
              </div>
            )}
            {members.map((m) => (
              <article
                key={m.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-soft"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary font-serif text-lg font-semibold text-secondary-foreground">
                    {m.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.role}
                      {typeof m.age === "number" ? ` · ${m.age} años` : ""}
                      {` · ración ${m.ration}`}
                    </p>
                    {(m.diets?.length ||
                      m.allergens?.length ||
                      m.intolerances?.length ||
                      m.conditions?.length) ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.diets?.map((d) => (
                          <span
                            key={`d-${d}`}
                            className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                          >
                            {d}
                          </span>
                        ))}
                        {m.allergens?.map((a) => (
                          <span
                            key={`a-${a}`}
                            className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive"
                          >
                            Alergia: {a}
                          </span>
                        ))}
                        {m.intolerances?.map((i) => (
                          <span
                            key={`i-${i}`}
                            className="rounded-full bg-accent/40 px-2 py-0.5 text-[11px] font-medium text-foreground"
                          >
                            Intol.: {i}
                          </span>
                        ))}
                        {m.conditions?.map((c) => (
                          <span
                            key={`c-${c}`}
                            className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {m.preferences && (
                      <p className="mt-1 text-sm text-foreground/80">
                        {m.preferences}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMember(m.id)}
                  aria-label={`Eliminar ${m.name}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </article>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="rounded-full" size="lg">
              <Link to="/menu">Continuar al menú</Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              size="lg"
              onClick={clearAll}
            >
              Limpiar grupo
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Family;