import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Background } from "@/components/Background";
import { CarHeroFacts } from "@/components/CarHeroFacts";
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
        {/* COLLECTION */}
        <section className="container mx-auto px-6 pt-20 pb-32 md:pt-28 md:pb-40">
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
                  <CarHeroFacts facts={c.heroFacts} compact className="mt-4 flex-1" />
                  <div className="mt-8 flex items-end justify-between gap-4 border-t border-border pt-6">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[0.65rem] tracking-[0.25em] text-muted-foreground">Цена:</span>
                      <span className="font-serif text-lg leading-snug text-gold">{c.price}</span>
                    </div>
                    <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground transition-colors group-hover:text-gold">
                      Открыть <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
