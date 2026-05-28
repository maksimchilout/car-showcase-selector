import { Link } from "@tanstack/react-router";
import type { Car } from "@/lib/cars";
import { CARS } from "@/lib/cars";

export function CarSwitcher({ active }: { active: Car["slug"] }) {
  return (
    <div className="border-y border-white/[0.06] bg-black/30">
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
                    ? "border-[#C9A84C]/50 bg-white/[0.04]"
                    : "border-white/[0.05] hover:border-[#C9A84C]/30 hover:bg-white/[0.03]"
                }`}
              >
                <div className="hidden h-14 w-20 shrink-0 overflow-hidden rounded bg-black/50 sm:block">
                  <img src={c.thumbnail} alt={c.name} className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100" />
                </div>
                <div className="min-w-0">
                  <div className="eyebrow opacity-70">0{i + 1}</div>
                  <div className={`mt-1 font-serif text-base tracking-wide md:text-lg ${isActive ? "text-[#C9A84C]" : "text-foreground"}`}>
                    {c.name}
                  </div>
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
