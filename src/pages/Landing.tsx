import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { Leaf, MapPin, Sprout, Trophy, Users } from "lucide-react";
import heroImg from "@/assets/hero-family.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="container relative grid gap-10 py-12 md:grid-cols-2 md:items-center md:py-20">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
              <Sprout className="h-3.5 w-3.5" /> Km 0 · Bizkaia
            </span>
            <h1 className="text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">
              Menús familiares sostenibles,
              <span className="text-earth"> pensados desde casa</span>
            </h1>
            <p className="max-w-xl font-serif text-2xl italic text-earth/90">
              Calidad local, salud familiar.
              <span className="block text-base not-italic text-muted-foreground">
                Porque la sostenibilidad empieza en tu mesa.
              </span>
            </p>
            <p className="max-w-xl text-lg text-muted-foreground">
              Crea menús adaptados a las necesidades de tu familia usando
              productos locales, de temporada y con menos desperdicio.
              Comer bien, cuidando lo que tenemos cerca.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="rounded-full shadow-warm">
                <Link to="/familia">Crear grupo familiar</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-2"
              >
                <Link to="/menu">Ver opciones de configuración</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="rounded-full"
              >
                <Link to="/puntos">
                  <Trophy className="mr-2 h-4 w-4" /> Puntos en familia
                </Link>
              </Button>
            </div>
            <dl className="grid grid-cols-3 gap-4 pt-6">
              {[
                { icon: MapPin, k: "Km 0", v: "Productores Bizkaia" },
                { icon: Leaf, k: "Temporada", v: "Menos desperdicio" },
                { icon: Users, k: "Familia", v: "Perfiles a medida" },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="rounded-2xl bg-card/60 p-3 shadow-soft">
                  <Icon className="mb-1 h-5 w-5 text-primary" />
                  <dt className="text-sm font-semibold">{k}</dt>
                  <dd className="text-xs text-muted-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-warm blur-2xl opacity-70" />
            <img
              src={heroImg}
              alt="Mesa familiar con productos locales de temporada de Bizkaia"
              width={1536}
              height={1024}
              className="relative aspect-[4/3] w-full rounded-[2.5rem] object-cover shadow-warm"
            />
            <div className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent">
                <Leaf className="h-5 w-5 text-accent-foreground" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Hoy en temporada</p>
                <p className="text-sm font-semibold">Pimiento de Gernika</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                t: "1. Tu familia",
                d: "Añade quién come en casa: edades, raciones y necesidades alimentarias.",
              },
              {
                t: "2. Tu menú",
                d: "Elige cómo quieres planificar la semana: a tu medida, con compra incluida o desde una receta.",
              },
              {
                t: "3. Producto local",
                d: "Compra los ingredientes directamente en BBK Azoka, mercado km 0 de Bizkaia.",
              },
            ].map((s) => (
              <article
                key={s.t}
                className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft"
              >
                <h2 className="mb-2 font-serif text-xl font-semibold">{s.t}</h2>
                <p className="text-muted-foreground">{s.d}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        GertuMenu · MVP Hackathon Fundación BBK · Programa IKERBAT
      </footer>
    </div>
  );
};

export default Landing;