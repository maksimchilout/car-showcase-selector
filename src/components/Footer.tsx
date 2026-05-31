import { MapPin, Mail } from "lucide-react";
import { CitroenLogo } from "@/components/CitroenLogo";
import { PhoneLinks } from "@/components/PhoneLinks";
import { CONTACT_EMAIL, ELECTRO_CAR_URL, SOCIAL_LINKS, YANDEX_ROUTE_URL } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-black/40">
      <div className="container mx-auto grid gap-12 px-6 py-20 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <CitroenLogo className="h-9 w-8" />
              <span className="font-serif text-2xl tracking-[0.18em]">CITROËN</span>
            </div>
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
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            ООО ЯАР Групп поставщик CITROËN в Беларуси. Продажа, сервис, запчасти.
          </p>
        </div>

        <div>
          <div className="eyebrow mb-5">Контакты</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <PhoneLinks linkClassName="hover:text-[#C9A84C]" />
            </li>
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-3 transition-colors hover:text-[#C9A84C]"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-[#C9A84C]" />
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={YANDEX_ROUTE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition-colors hover:text-[#C9A84C]"
              >
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C9A84C]" />
                <span>
                  г. Минск,
                  <br />
                  ул. Свердлова, 23/4-1
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-5">Соцсети</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#C9A84C]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.08]">
        <div className="container mx-auto flex flex-col gap-2 px-6 py-6 text-xs tracking-widest text-muted-foreground md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} CITROËN BELARUS</span>
          <span className="opacity-60">Гарантия от сервисного центра Peugeot</span>
        </div>
      </div>
    </footer>
  );
}
