import { createFileRoute, notFound } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CarSwitcher } from "@/components/CarSwitcher";
import { Pano360 } from "@/components/Pano360";
import { VRSalon } from "@/components/VRSalon";
import { LeadDialog } from "@/components/LeadDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { getCarBySlug } from "@/lib/cars";
import { CheckCircle2, Phone, Calendar } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/car/$slug")({
  loader: ({ params }) => {
    const car = getCarBySlug(params.slug);
    if (!car) throw notFound();
    return { car };
  },
  head: ({ loaderData }) => {
    const car = loaderData?.car;
    return {
      meta: [
        { title: car ? `${car.name} — Citroën | Минск` : "Citroën" },
        { name: "description", content: car?.description ?? "" },
        { property: "og:title", content: car?.name ?? "Citroën" },
        { property: "og:description", content: car?.description ?? "" },
        { property: "og:image", content: car?.hero ?? "" },
      ],
    };
  },
  component: CarPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">Автомобиль не найден</div>
  ),
});

function CarPage() {
  const { car } = Route.useLoaderData();
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CarSwitcher active={car.slug} />
      <main className="flex-1">
        {/* HERO */}
        <section className="container mx-auto grid gap-10 px-4 py-10 md:grid-cols-2 md:py-16">
          <div className="overflow-hidden rounded-2xl bg-muted">
            <img src={car.hero} alt={car.name} className="aspect-[4/3] h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-sm uppercase tracking-wider text-muted-foreground">{car.subtitle}</div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">{car.name}</h1>
            <p className="mt-3 text-lg text-primary/80">{car.tagline}</p>
            <p className="mt-4 text-muted-foreground">{car.description}</p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">от {car.price}</span>
              {car.oldPrice && <span className="text-base text-muted-foreground line-through">{car.oldPrice}</span>}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <LeadDialog
                kind="test-drive"
                carName={car.name}
                title="Запись на тест-драйв"
                trigger={
                  <Button size="lg" className="gap-2">
                    <Calendar className="h-4 w-4" /> Записаться на тест-драйв
                  </Button>
                }
              />
              <LeadDialog
                kind="booking"
                carName={car.name}
                title="Бронирование автомобиля"
                trigger={
                  <Button size="lg" variant="outline" className="gap-2">
                    <Phone className="h-4 w-4" /> Забронировать
                  </Button>
                }
              />
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-3">
              {car.highlights.map((h) => (
                <Card key={h.title} className="p-6">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                  <h3 className="mt-3 text-lg font-semibold">{h.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{h.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 360 + VR */}
        <section className="container mx-auto px-4 py-12">
          <Tabs defaultValue="ext" className="w-full">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">Рассмотрите автомобиль</h2>
                <p className="mt-1 text-muted-foreground">360° снаружи и виртуальный тур по салону.</p>
              </div>
              <TabsList>
                <TabsTrigger value="ext">Обзор 360°</TabsTrigger>
                <TabsTrigger value="int">VR-салон</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="ext">
              <Pano360 frames={car.pano360} />
            </TabsContent>
            <TabsContent value="int">
              <VRSalon panoId={car.panoId} />
            </TabsContent>
          </Tabs>
        </section>

        {/* SPECS */}
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-2xl font-bold md:text-3xl">Технические характеристики</h2>
            <div className="grid gap-x-8 gap-y-3 rounded-xl bg-background p-6 shadow-sm sm:grid-cols-2 md:grid-cols-3">
              {car.specs.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-4 border-b border-dashed py-2 last:border-0">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className="text-sm font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">Галерея</h2>
          <div className="overflow-hidden rounded-2xl bg-muted">
            <img src={car.gallery[activeImg]} alt={car.name} className="aspect-video w-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {car.gallery.map((g, i) => (
              <button
                key={g}
                onClick={() => setActiveImg(i)}
                className={`aspect-[4/3] overflow-hidden rounded-md ring-offset-2 transition ${
                  activeImg === i ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                }`}
              >
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-14 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Готовы испытать {car.name}?</h2>
            <p className="mx-auto mt-2 max-w-xl opacity-90">
              Запишитесь на тест-драйв или забронируйте автомобиль — мы перезвоним и подготовим всё для встречи.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <LeadDialog
                kind="test-drive"
                carName={car.name}
                title="Запись на тест-драйв"
                trigger={<Button size="lg" variant="secondary">Тест-драйв</Button>}
              />
              <LeadDialog
                kind="booking"
                carName={car.name}
                title="Бронирование автомобиля"
                trigger={<Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">Забронировать</Button>}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
