import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Background } from "@/components/Background";
import { CARS } from "@/lib/cars";
import { ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Citroën — Коллекция автомобилей | Минск" },
      { name: "description", content: "Официальный дилер Citroën в Минске. C3-XR, C5 Aircross и C5 X — выберите свой автомобиль." },
      { property: "og:title", content: "Citroën — Коллекция автомобилей" },
      { property: "og:description", content: "Citroën C3-XR, C5 Aircross и C5 X. Тест-драйв, бронь, лизинг." },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  return (
    <div className="relative flex min-h-screen flex-col">
      <Background />
      <Header />
      <main className="relative z-10 flex-1">
        {/* HERO */}
        <section className="container mx-auto px-6 pt-32 pb-32 md:pt-44 md:pb-40">
          <div className="mx-auto max-w-4xl text-center">
            <div className="eyebrow animate-fade-in-slow">— Коллекция CITROËN —</div>
            <h1
              className="mt-8 font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl lg:text-[5.5rem]"
              style={{ animation: "fade-up 1.4s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              Искусство движения,<br />
              <span className="italic text-[#C9A84C]">воплощённое</span> в стали
            </h1>
            <p
              className="mx-auto mt-10 max-w-xl text-sm font-light leading-relaxed text-muted-foreground md:text-base"
              style={{ animation: "fade-up 1.4s 0.3s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              Три модели. Три характера. Одно безупречное наследие французского автомобилестроения.
              Выберите свой Citroën и откройте новое измерение комфорта.
            </p>
          </div>
        </section>

        <div className="divider-thin container mx-auto" />

        {/* COLLECTION */}
        <section className="container mx-auto px-6 py-32 md:py-40">
          <div className="reveal mb-20 text-center">
            <div className="eyebrow">— Коллекция —</div>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-6xl">
              Модельный <span className="italic text-[#C9A84C]">ряд</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground">
              От компактного городского кроссовера до флагманского седана — каждая модель раскрывает свой
              характер сразу за поворотом ключа.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {CARS.map((c, i) => (
              <Link
                key={c.slug}
                to="/car/$slug"
                params={{ slug: c.slug }}
                className="reveal group glass glass-hover relative flex flex-col overflow-hidden rounded-2xl"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <img
                    src={c.thumbnail}
                    alt={c.name}
                    className="h-full w-full object-cover opacity-90 transition-all duration-[1200ms] group-hover:scale-110 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <div className="eyebrow opacity-70">{c.subtitle}</div>
                  <h3 className="mt-3 font-serif text-3xl tracking-wide">{c.name}</h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                  <div className="mt-8 flex items-end justify-between gap-4 border-t border-white/[0.06] pt-6">
                    <div>
                      <div className="text-[0.65rem] tracking-[0.25em] text-muted-foreground">ОТ</div>
                      <div className="mt-1 font-serif text-2xl text-[#C9A84C]">{c.price}</div>
                    </div>
                    <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground transition-colors group-hover:text-[#C9A84C]">
                      Открыть <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="divider-thin container mx-auto" />

        {/* PHILOSOPHY */}
        <section className="container mx-auto px-6 py-32 md:py-40">
          <div className="mx-auto max-w-3xl">
            <div className="reveal text-center">
              <div className="eyebrow">— Философия —</div>
              <h2 className="mt-6 font-serif text-4xl leading-tight tracking-tight md:text-5xl">
                Бескомпромиссный <span className="italic text-[#C9A84C]">комфорт</span>
              </h2>
            </div>
            <div className="reveal mt-10 space-y-6 text-center text-base font-light leading-relaxed text-muted-foreground">
              <p>
                Более ста лет Citroën переопределяет понятие езды. Подвеска Progressive Hydraulic Cushions®,
                кресла Advanced Comfort® и продуманная до миллиметра эргономика создают атмосферу салона,
                в котором путешествие становится продолжением дома.
              </p>
              <p>
                Каждый автомобиль из коллекции 2026 года прошёл сотни часов настройки в Velizy — чтобы
                подарить вам момент тишины посреди городского шума.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
