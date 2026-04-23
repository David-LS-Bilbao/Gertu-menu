import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MultiSelectChipsProps<T extends string> {
  options: readonly T[];
  value: T[];
  onChange: (next: T[]) => void;
  ariaLabel?: string;
}

export function MultiSelectChips<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: MultiSelectChipsProps<T>) {
  const toggle = (opt: T) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-2"
    >
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            aria-pressed={active}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-soft"
                : "border-border bg-card text-foreground hover:bg-secondary",
            )}
          >
            {opt}
          </button>
        );
      })}
      {value.length > 0 && (
        <Badge variant="secondary" className="rounded-full">
          {value.length} seleccionado{value.length > 1 ? "s" : ""}
        </Badge>
      )}
    </div>
  );
}