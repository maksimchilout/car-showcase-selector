import { Link } from "@tanstack/react-router";
import { Phone, MapPin } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          {/* Citroën chevrons logo (SVG) */}
          <svg viewBox="0 0 64 32" className="h-8 w-12 text-primary" fill="currentColor" aria-label="Citroën">
            <path d="M2 22 L18 6 L34 22 L29 22 L18 11 L7 22 Z" />
            <path d="M30 22 L46 6 L62 22 L57 22 L46 11 L35 22 Z" />
          </svg>
          <span className="text-lg font-bold tracking-tight">CITROËN</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a className="flex items-center gap-1.5 hover:text-foreground" href="tel:+375291234567">
            <Phone className="h-4 w-4" /> +375 (29) 123-45-67
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> ул. Свердлова, 23/4-1
          </span>
        </div>
      </div>
    </header>
  );
}
