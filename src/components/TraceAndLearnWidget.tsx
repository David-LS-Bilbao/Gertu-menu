import { Leaf, MapPin, Sparkles, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TraceData {
  dishName: string;
  farmerName: string;
  farmName: string;
  location: string;
  distanceKm: number;
  co2Saved: number;
  funFact: string;
  imageUrl: string;
}

const DEFAULT_DATA: TraceData = {
  dishName: "Porrusalda con patata alavesa",
  farmerName: "Mikel y Miren",
  farmName: "Caserío Erroeta",
  location: "Mungia, Bizkaia",
  distanceKm: 18,
  co2Saved: 3.4,
  funFact:
    "¿Sabías que los puerros de esta zona crecen más lentos por nuestra brisa cantábrica, lo que concentra sus azúcares y los hace más dulces?",
  imageUrl:
    "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=150",
};

// Circular progress (0-100). Visual gamification of positive impact.
const CircularImpact = ({ value }: { value: number }) => {
  const pct = Math.max(0, Math.min(100, value));
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative grid h-20 w-20 place-items-center">
      <svg className="h-20 w-20 -rotate-90" viewBox="0 0 70 70">
        <circle
          cx="35"
          cy="35"
          r={radius}
          strokeWidth="6"
          className="fill-none stroke-secondary"
        />
        <circle
          cx="35"
          cy="35"
          r={radius}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="fill-none stroke-primary transition-all duration-700"
        />
      </svg>
      <span className="absolute text-xs font-bold text-primary">{pct}%</span>
    </div>
  );
};

interface TraceAndLearnWidgetProps {
  data?: Partial<TraceData>;
  onViewChain?: () => void;
}

export const TraceAndLearnWidget = ({
  data,
  onViewChain,
}: TraceAndLearnWidgetProps) => {
  const d: TraceData = { ...DEFAULT_DATA, ...data };
  // Map CO2 saved to a 0-100 impact score (cap at 5 kg = 100%).
  const impactScore = Math.round(Math.min(d.co2Saved / 5, 1) * 100);

  return (
    <article
      className="group relative animate-fade-in overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-warm"
      aria-label="Trazabilidad y aprendizaje del plato"
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-3 border-b border-border/60 bg-gradient-warm p-5">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-earth">
            <Sparkles className="h-3.5 w-3.5" />
            Descubre tu plato
          </p>
          <h3 className="mt-1 font-serif text-xl font-semibold leading-tight sm:text-2xl">
            {d.dishName}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-card px-3 py-1 text-[11px] font-bold text-primary shadow-soft">
          EuskoTrace ✓
        </span>
      </header>

      <div className="grid gap-5 p-5 md:grid-cols-2">
        {/* Origen */}
        <section
          className="flex items-center gap-4 rounded-2xl border border-border/40 bg-secondary/40 p-4"
          aria-label="Origen del producto"
        >
          <img
            src={d.imageUrl}
            alt={`Productor ${d.farmerName}`}
            loading="lazy"
            className="h-16 w-16 shrink-0 rounded-full border-2 border-card object-cover shadow-soft"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Productor
            </p>
            <p className="truncate font-semibold">{d.farmerName}</p>
            <p className="truncate text-sm text-muted-foreground">
              {d.farmName}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-foreground/80">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {d.location} · <strong>{d.distanceKm} km</strong>
            </p>
          </div>
        </section>

        {/* Impacto */}
        <section
          className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4"
          aria-label="Impacto sostenible"
        >
          <CircularImpact value={impactScore} />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Leaf className="h-3.5 w-3.5" />
              Impacto positivo
            </p>
            <p className="font-serif text-2xl font-bold leading-none text-primary">
              {d.co2Saved.toLocaleString("es-ES", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}{" "}
              kg
            </p>
            <p className="text-xs text-muted-foreground">
              CO₂ ahorrado vs. importación
            </p>
          </div>
        </section>
      </div>

      {/* Píldora educativa */}
      <section className="mx-5 mb-5 rounded-2xl border border-primary/15 bg-primary/5 p-4">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          ¿Sabías que…?
        </p>
        <p className="mt-1 text-sm leading-relaxed text-foreground/90">
          {d.funFact}
        </p>
      </section>

      {/* CTA */}
      <footer className="flex flex-col gap-2 border-t border-border/60 bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Datos verificados en cadena de bloques
        </p>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={onViewChain}
        >
          <Link2 className="mr-2 h-4 w-4" />
          Ver cadena de bloques · Datos EuskoTrace
        </Button>
      </footer>
    </article>
  );
};

export default TraceAndLearnWidget;