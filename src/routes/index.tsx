import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CARS } from "@/lib/cars";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Citroën — Выбор автомобиля | Минск" },
      { name: "description", content: "Официальный дилер Citroën в Минске. Citroën C3-XR, C5 и C5 X — выбирайте автомобиль и узнайте больше." },
      { property: "og:title", content: "Citroën — Выбор автомобиля" },
      { property: "og:description", content: "Citroën C3-XR, C5 и C5 X в наличии. Тест-драйв, бронь, лизинг." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-10 md:py-16">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Выберите свой Citroën</h1>
            <p className="mt-3 text-muted-foreground md:text-lg">
              Три модели, три характера. Узнайте все подробности, рассмотрите автомобиль в 360° и забронируйте тест-драйв.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {CARS.map((c) => (
              <Link
                key={c.slug}
                to="/car/$slug"
                params={{ slug: c.slug }}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={c.thumbnail} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="text-sm uppercase tracking-wide text-muted-foreground">{c.subtitle}</div>
                  <h2 className="mt-1 text-2xl font-bold">{c.name}</h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.description}</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">от {c.price}</span>
                    {c.oldPrice && <span className="text-sm text-muted-foreground line-through">{c.oldPrice}</span>}
                  </div>
                  <Button className="mt-5 w-full" size="lg">
                    Подробнее <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
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
