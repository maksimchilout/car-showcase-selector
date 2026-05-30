import { Link } from "@tanstack/react-router";
import { MapPin, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CARS } from "@/lib/cars";
import { CitroenLogo } from "@/components/CitroenLogo";
import { PhoneLinks } from "@/components/PhoneLinks";
import { ELECTRO_CAR_URL, YANDEX_ROUTE_URL } from "@/lib/contact";

function AddressBlock({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <span className="flex items-center gap-2 tracking-wider text-muted-foreground">
        <MapPin className={`shrink-0 text-[#C9A84C] ${compact ? "h-4 w-4" : "h-3.5 w-3.5"}`} />
        ул. Свердлова, 23/4-1
      </span>
      <a
        href={YANDEX_ROUTE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-[#C9A84C] ${
          compact ? "text-xs" : "pl-5 text-[0.65rem]"
        }`}
      >
        Построить маршрут
      </a>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-white/[0.07]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <CitroenLogo />
            <span className="font-serif text-2xl tracking-[0.18em] text-foreground">
              CITROËN
            </span>
          </Link>
          <a
            href={ELECTRO_CAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 opacity-90 transition-opacity hover:opacity-100"
            aria-label="Electro-car.by"
          >
            <img
              src="/logo.png"
              alt="Electro-car.by"
              className="h-8 w-auto object-contain sm:h-9"
            />
          </a>
        </div>

        <nav className="hidden items-center gap-10 lg:flex">
          {CARS.map((c) => (
            <Link
              key={c.slug}
              to="/car/$slug"
              params={{ slug: c.slug }}
              className="eyebrow text-muted-foreground transition-colors hover:text-[#C9A84C]"
              activeProps={{ className: "eyebrow text-[#C9A84C]" }}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 text-xs text-muted-foreground md:flex">
          <PhoneLinks />
          <AddressBlock className="hidden xl:flex" />
        </div>

        <button
          aria-label="Меню"
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="glass border-t border-white/[0.07] lg:hidden">
          <div className="container mx-auto flex flex-col gap-4 px-6 py-6">
            {CARS.map((c) => (
              <Link
                key={c.slug}
                to="/car/$slug"
                params={{ slug: c.slug }}
                onClick={() => setOpen(false)}
                className="font-serif text-2xl tracking-wide hover:text-[#C9A84C]"
              >
                {c.name}
              </Link>
            ))}
            <PhoneLinks compact className="mt-2" iconClassName="h-4 w-4 shrink-0 text-[#C9A84C]" />
            <AddressBlock compact />
          </div>
        </div>
      )}
    </header>
  );
}
