import { Link } from "@tanstack/react-router";
import type { Car } from "@/lib/cars";
import { CARS } from "@/lib/cars";

export function CarSwitcher({ active }: { active: Car["slug"] }) {
  return (
    <div className="border-y border-border bg-muted/40">
      <div className="container mx-auto px-6 py-5">
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {CARS.map((c, i) => {
            const isActive = c.slug === active;
            return (
              <Link
                key={c.slug}
                to="/car/$slug"
                params={{ slug: c.slug }}
                className={`group relative flex items-center gap-4 rounded-lg border px-3 py-3 transition-all duration-500 ${
                  isActive
                    ? "border-primary/50 bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30 hover:bg-accent/50"
                }`}
              >
                <div className="hidden h-14 w-20 shrink-0 overflow-hidden rounded bg-black/50 sm:block">
                  <img src={c.thumbnail} alt={c.name} className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100" />
                </div>
                <div className="min-w-0">
                  <div className={`mt-1 font-serif text-base tracking-wide md:text-lg ${isActive ? "text-gold" : "text-foreground"}`}>
                    {c.name}
                  </div>
                  <div className="hidden text-sm text-muted-foreground md:block">{c.subtitle}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
