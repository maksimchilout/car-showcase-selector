import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CARS } from "@/lib/cars";

function CitroenLogo({ className = "h-7 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" className={className} aria-label="Citroën">
      <defs>
        <linearGradient id="cg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#E8CE7F" />
          <stop offset="100%" stopColor="#9A7F37" />
        </linearGradient>
      </defs>
      <path d="M2 22 L18 6 L34 22 L29 22 L18 11 L7 22 Z" fill="url(#cg)" />
      <path d="M30 22 L46 6 L62 22 L57 22 L46 11 L35 22 Z" fill="url(#cg)" />
    </svg>
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
        <Link to="/" className="flex items-center gap-3">
          <CitroenLogo />
          <span className="font-serif text-2xl tracking-[0.18em] text-foreground">
            CITROËN
          </span>
        </Link>

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
          <a className="flex items-center gap-2 tracking-wider transition-colors hover:text-[#C9A84C]" href="tel:+375291234567">
            <Phone className="h-3.5 w-3.5" /> +375 (29) 123-45-67
          </a>
          <span className="hidden items-center gap-2 tracking-wider xl:flex">
            <MapPin className="h-3.5 w-3.5" /> ул. Свердлова, 23/4-1
          </span>
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
            <a href="tel:+375291234567" className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" /> +375 (29) 123-45-67
            </a>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> ул. Свердлова, 23/4-1
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
