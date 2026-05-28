import { Phone, MapPin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-black/40">
      <div className="container mx-auto grid gap-12 px-6 py-20 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 64 32" className="h-8 w-12" aria-hidden>
              <defs>
                <linearGradient id="fg" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#E8CE7F" />
                  <stop offset="100%" stopColor="#9A7F37" />
                </linearGradient>
              </defs>
              <path d="M2 22 L18 6 L34 22 L29 22 L18 11 L7 22 Z" fill="url(#fg)" />
              <path d="M30 22 L46 6 L62 22 L57 22 L46 11 L35 22 Z" fill="url(#fg)" />
            </svg>
            <span className="font-serif text-2xl tracking-[0.18em]">CITROËN</span>
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Официальный представитель Citroën в Беларуси. Продажа, сервис и оригинальные запчасти —
            c вниманием к каждой детали.
          </p>
        </div>

        <div>
          <div className="eyebrow mb-5">Контакты</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3"><Phone className="h-3.5 w-3.5 text-[#C9A84C]" /> +375 (29) 123-45-67</li>
            <li className="flex items-center gap-3"><Mail className="h-3.5 w-3.5 text-[#C9A84C]" /> info@citroen.by</li>
            <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-3.5 w-3.5 text-[#C9A84C]" /> г. Минск,<br />ул. Свердлова, 23/4-1</li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-5">Часы работы</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>Пн – Пт &nbsp; 9:00 – 20:00</li>
            <li>Сб – Вс &nbsp; 10:00 – 18:00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.08]">
        <div className="container mx-auto flex flex-col gap-2 px-6 py-6 text-xs tracking-widest text-muted-foreground md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} CITROËN BELARUS</span>
          <span className="opacity-60">Авторизованный дилер · Гарантия завода-изготовителя</span>
        </div>
      </div>
    </footer>
  );
}
