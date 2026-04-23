import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Award, Sparkles, Trash2, Trophy, Undo2 } from "lucide-react";
import {
  FamilyMember,
  PointsEntry,
  REWARD_ACTIONS,
  RewardActionId,
  getLevel,
  loadFamily,
  loadPoints,
  savePoints,
} from "@/lib/storage";

const Rewards = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [entries, setEntries] = useState<PointsEntry[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>("");

  useEffect(() => {
    const fam = loadFamily();
    setMembers(fam);
    setEntries(loadPoints().entries);
    if (fam[0]) setSelectedMember(fam[0].id);
  }, []);

  useEffect(() => {
    savePoints({ entries });
  }, [entries]);

  const totalsByMember = useMemo(() => {
    const map: Record<string, number> = {};
    entries.forEach((e) => {
      map[e.memberId] = (map[e.memberId] ?? 0) + e.points;
    });
    return map;
  }, [entries]);

  const familyTotal = useMemo(
    () => entries.reduce((acc, e) => acc + e.points, 0),
    [entries],
  );

  const ranking = useMemo(() => {
    return [...members]
      .map((m) => ({ member: m, total: totalsByMember[m.id] ?? 0 }))
      .sort((a, b) => b.total - a.total);
  }, [members, totalsByMember]);

  const recordAction = (actionId: RewardActionId) => {
    if (!selectedMember) {
      toast.error("Selecciona un miembro de la familia");
      return;
    }
    const action = REWARD_ACTIONS.find((a) => a.id === actionId);
    if (!action) return;
    const newEntry: PointsEntry = {
      id: crypto.randomUUID(),
      memberId: selectedMember,
      actionId,
      points: action.points,
      date: new Date().toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
    const member = members.find((m) => m.id === selectedMember);
    toast.success(
      `+${action.points} pts para ${member?.name ?? "familia"} ${action.emoji}`,
    );
  };

  const undo = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const reset = () => {
    if (entries.length === 0) return;
    if (confirm("¿Reiniciar todos los puntos de la familia?")) {
      setEntries([]);
      toast("Puntos reiniciados");
    }
  };

  const familyLevel = getLevel(familyTotal);
  const progressPct = familyLevel.next
    ? Math.min(
        100,
        Math.round(
          ((familyTotal - familyLevel.min) /
            (familyLevel.next - familyLevel.min)) *
            100,
        ),
      )
    : 100;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container grid gap-8 py-10 lg:grid-cols-[1.1fr_1fr]">
        <section className="space-y-6">
          <header>
            <p className="text-sm font-semibold uppercase tracking-wider text-earth">
              Programa de incentivos
            </p>
            <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
              Puntos GertuMenu
            </h1>
            <p className="mt-2 text-muted-foreground">
              Cada gesto sostenible suma. Convierte la mesa en un juego en
              familia y desbloquea niveles juntos.
            </p>
          </header>

          <div className="rounded-3xl bg-gradient-warm p-6 shadow-warm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Nivel familiar
                </p>
                <p className="font-serif text-3xl font-semibold">
                  {familyLevel.emoji} {familyLevel.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {familyTotal} pts acumulados
                </p>
              </div>
              <span className="grid h-14 w-14 place-items-center rounded-full bg-card shadow-soft">
                <Trophy className="h-6 w-6 text-primary" />
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <Progress value={progressPct} />
              <p className="text-xs text-muted-foreground">
                {familyLevel.next
                  ? `${familyLevel.next - familyTotal} pts para el siguiente nivel`
                  : "¡Nivel máximo alcanzado!"}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Registrar gesto sostenible</p>
                <p className="text-xs text-muted-foreground">
                  Selecciona quién lo ha hecho y suma puntos al instante.
                </p>
              </div>
              <Select
                value={selectedMember}
                onValueChange={setSelectedMember}
              >
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue placeholder="Miembro" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {members.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Aún no hay miembros.{" "}
                <Link to="/familia" className="font-semibold text-primary">
                  Crea tu grupo familiar
                </Link>{" "}
                primero.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {REWARD_ACTIONS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => recordAction(a.id)}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{a.emoji}</span>
                      <span className="text-sm font-medium">{a.label}</span>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      +{a.points}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold">
                Ranking familiar
              </h2>
              <Award className="h-5 w-5 text-earth" />
            </div>
            {ranking.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Añade miembros para empezar el ranking.
              </p>
            ) : (
              <ol className="space-y-3">
                {ranking.map(({ member, total }, idx) => {
                  const lvl = getLevel(total);
                  return (
                    <li
                      key={member.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-background p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary font-serif text-sm font-semibold text-secondary-foreground">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">
                            {member.name}{" "}
                            <span className="text-xs text-muted-foreground">
                              · {lvl.emoji} {lvl.name}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {total} pts
                          </p>
                        </div>
                      </div>
                      {idx === 0 && total > 0 && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          Líder de la mesa
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold">
                Actividad reciente
              </h2>
              <Sparkles className="h-5 w-5 text-earth" />
            </div>
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aún no hay registros. ¡Anota el primer gesto sostenible!
              </p>
            ) : (
              <ul className="space-y-2">
                {entries.slice(0, 8).map((e) => {
                  const action = REWARD_ACTIONS.find((a) => a.id === e.actionId);
                  const member = members.find((m) => m.id === e.memberId);
                  return (
                    <li
                      key={e.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-background p-3 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{action?.emoji}</span>
                        <div>
                          <p className="font-medium">
                            {member?.name ?? "—"}{" "}
                            <span className="text-muted-foreground">
                              · {action?.label}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(e.date).toLocaleString("es-ES", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          +{e.points}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => undo(e.id)}
                          aria-label="Deshacer"
                        >
                          <Undo2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full" size="lg">
              <Link to="/menu">Ir al menú</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              onClick={reset}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Reiniciar puntos
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Rewards;
