import { Link } from "@tanstack/react-router";
import type { Car } from "@/lib/cars";
import { CARS } from "@/lib/cars";

export function CarSwitcher({ active }: { active: Car["slug"] }) {
  return (
    <div className="border-b bg-muted/30">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {CARS.map((c) => {
            const isActive = c.slug === active;
            return (
              <Link
                key={c.slug}
                to="/car/$slug"
                params={{ slug: c.slug }}
                className={`group relative flex flex-col items-center gap-2 rounded-lg border p-2 text-center transition-all md:p-3 ${
                  isActive ? "border-primary bg-background shadow" : "border-transparent hover:border-border hover:bg-background"
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded bg-muted">
                  <img src={c.thumbnail} alt={c.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <div>
                  <div className={`text-xs font-semibold md:text-sm ${isActive ? "text-primary" : ""}`}>{c.name}</div>
                  <div className="hidden text-xs text-muted-foreground md:block">{c.subtitle}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
