import { Link } from "@tanstack/react-router";
import { MapPin, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CARS } from "@/lib/cars";
import { CitroenLogo } from "@/components/CitroenLogo";
import { PhoneLinks } from "@/components/PhoneLinks";
import { ELECTRO_CAR_URL, WARRANTY_PDF_URL, YANDEX_ROUTE_URL } from "@/lib/contact";
import { ElectroCarLogo } from "@/components/ElectroCarLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

function ElectroCarLogoLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={ELECTRO_CAR_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`shrink-0 opacity-90 transition-opacity hover:opacity-100 ${className}`}
      aria-label="Electro-car.by"
    >
      <ElectroCarLogo />
    </a>
  );
}

function AddressBlock({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <span className="flex items-center gap-2 tracking-wider text-muted-foreground">
        <MapPin className={`shrink-0 text-gold ${compact ? "h-4 w-4" : "h-3.5 w-3.5"}`} />
        ул. Свердлова, 23/4-1
      </span>
      <a
        href={YANDEX_ROUTE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-gold ${
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
          ? "glass border-b border-border"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center gap-6 px-6">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <CitroenLogo />
            <span className="font-serif text-2xl tracking-[0.18em] text-foreground">
              CITROËN
            </span>
          </Link>
          <ElectroCarLogoLink className="max-[1280px]:hidden" />
        </div>

        <nav className="hidden shrink-0 items-center justify-center gap-8 xl:gap-10 lg:flex">
          {CARS.map((c) => (
            <Link
              key={c.slug}
              to="/car/$slug"
              params={{ slug: c.slug }}
              className="eyebrow whitespace-nowrap text-muted-foreground transition-colors hover:text-gold"
              activeProps={{ className: "eyebrow whitespace-nowrap text-gold" }}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          <div className="hidden items-center gap-6 text-xs text-muted-foreground min-[1540px]:flex">
            <PhoneLinks />
            <AddressBlock />
          </div>
          <ThemeToggle />
          <button
            aria-label="Меню"
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground min-[1540px]:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="glass border-t border-border min-[1540px]:hidden">
          <div className="container mx-auto flex flex-col gap-4 px-6 py-6">
            <div className="flex flex-col gap-4 lg:hidden">
              {CARS.map((c) => (
                <Link
                  key={c.slug}
                  to="/car/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setOpen(false)}
                  className="font-serif text-2xl tracking-wide hover:text-gold"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <ElectroCarLogoLink className="min-[1281px]:hidden w-fit" />
            <a
              href={WARRANTY_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-gold"
            >
              Положение о гарантии
            </a>
            <PhoneLinks compact className="lg:mt-0 mt-2" iconClassName="h-4 w-4 shrink-0 text-gold" />
            <AddressBlock compact />
          </div>
        </div>
      )}
    </header>
  );
}
