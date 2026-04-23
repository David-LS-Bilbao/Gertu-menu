import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { CalendarDays, ExternalLink, ShoppingBasket, UtensilsCrossed } from "lucide-react";
import { loadOption, saveOption } from "@/lib/storage";
import { TraceAndLearnWidget } from "@/components/TraceAndLearnWidget";
import { toast } from "sonner";

const BBK_AZOKA = "https://eup.bbk.eus/es-ES/azoka/comprar";

const OPTIONS = [
  {
    id: 1,
    icon: CalendarDays,
    title: "Menú personalizado",
    tag: "Diario o semanal",
    desc:
      "Indícanos los ingredientes que tienes y te confeccionamos el menú adaptado a tu familia.",
    cta: "Generar menú de prueba",
  },
  {
    id: 2,
    icon: ShoppingBasket,
    title: "Menú + lista de compra",
    tag: "Km 0 Bizkaia",
    desc:
      "Planificamos tu menú semanal y preparamos la cesta con productos locales y sostenibles de BBK Azoka.",
    cta: "Ir a comprar en BBK Azoka",
  },
  {
    id: 3,
    icon: UtensilsCrossed,
    title: "Desde tu receta",
    tag: "Ingredientes locales",
    desc:
      "Pásanos una receta y te devolvemos los ingredientes equivalentes de origen local km 0.",
    cta: "Adaptar mi receta",
  },
];

const SAMPLE_MENU = [
  { day: "Lunes", lunch: "Crema de calabaza de Markina con aceite de Bizkaia", dinner: "Tortilla de pimiento de Gernika" },
  { day: "Martes", lunch: "Alubias rojas de Tolosa con verduras de temporada", dinner: "Merluza al horno con patata de Álava" },
  { day: "Miércoles", lunch: "Ensalada de tomate de huerta y queso Idiazabal", dinner: "Revuelto de perretxikos" },
  { day: "Jueves", lunch: "Garbanzos guisados con acelgas locales", dinner: "Bonito del Cantábrico a la plancha" },
  { day: "Viernes", lunch: "Marmitako tradicional", dinner: "Pisto de verduras de la huerta vasca" },
];

const MenuConfig = () => {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(loadOption());
  }, []);

  const choose = (id: number) => {
    setSelected(id);
    saveOption(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-10">
        <header className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-earth">
            Paso 2
          </p>
          <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
            Configura tu menú sostenible
          </h1>
          <p className="mt-2 text-muted-foreground">
            Elige cómo quieres planificar la alimentación de tu familia.
            Todos los ingredientes son de origen local km 0.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => choose(opt.id)}
                className={`group flex h-full flex-col items-start rounded-3xl border bg-card p-6 text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-warm ${
                  active
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border/60"
                }`}
              >
                <span
                  className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl ${
                    active ? "bg-gradient-leaf text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-earth">
                  Opción {opt.id} · {opt.tag}
                </span>
                <h2 className="mt-1 font-serif text-xl font-semibold">
                  {opt.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {opt.desc}
                </p>
                <span className="mt-4 text-sm font-semibold text-primary">
                  {active ? "Seleccionado ✓" : "Elegir esta opción →"}
                </span>
              </button>
            );
          })}
        </div>

        {selected && (
          <section className="mt-10 rounded-3xl border border-border/60 bg-card p-6 shadow-soft md:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-2xl font-semibold">
                {OPTIONS.find((o) => o.id === selected)?.title}
              </h2>
              {selected === 2 ? (
                <Button asChild className="rounded-full" size="lg">
                  <a href={BBK_AZOKA} target="_blank" rel="noopener noreferrer">
                    Comprar en BBK Azoka
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <span className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground">
                  Ruta preparada para programarse
                </span>
              )}
            </div>

            {selected === 1 && (
              <div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Menú semanal de prueba con productos km 0 de Bizkaia
                  (próximamente generado por IA).
                </p>
                <div className="overflow-hidden rounded-2xl border border-border/60">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary text-secondary-foreground">
                      <tr>
                        <th className="p-3 text-left">Día</th>
                        <th className="p-3 text-left">Comida</th>
                        <th className="hidden p-3 text-left sm:table-cell">Cena</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SAMPLE_MENU.map((row) => (
                        <tr key={row.day} className="border-t border-border/60">
                          <td className="p-3 font-semibold">{row.day}</td>
                          <td className="p-3">{row.lunch}</td>
                          <td className="hidden p-3 text-muted-foreground sm:table-cell">
                            {row.dinner}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-earth">
                    En la mesa · Hoy coméis
                  </p>
                  <TraceAndLearnWidget
                    onViewChain={() =>
                      toast("Próximamente: trazabilidad on-chain con EuskoTrace")
                    }
                  />
                </div>
              </div>
            )}

            {selected === 2 && (
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Te llevamos directamente al mercado online de productos
                  locales de Bizkaia para completar la compra de tu menú.
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {["Verduras de huerta", "Legumbre vasca", "Pescado del Cantábrico", "Quesos de pastor"].map((p) => (
                    <li key={p} className="rounded-xl bg-secondary/60 px-4 py-2 text-secondary-foreground">
                      🌱 {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selected === 3 && (
              <p className="text-muted-foreground">
                Pega tu receta favorita y la convertimos en una versión con
                ingredientes equivalentes de productores locales de Bizkaia.
                Esta funcionalidad está preparada para conectarse al motor de
                trazabilidad EuskoTrace.
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default MenuConfig;