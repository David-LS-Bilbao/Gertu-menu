import { Link, useLocation } from "react-router-dom";
import { Leaf } from "lucide-react";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/familia", label: "Mi familia" },
  { to: "/menu", label: "Configurar menú" },
  { to: "/puntos", label: "Puntos" },
];

export const SiteHeader = () => {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-leaf text-primary-foreground shadow-soft">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight">
            GertuMenu
          </span>
        </Link>
        <nav className="hidden gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                pathname === l.to
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};