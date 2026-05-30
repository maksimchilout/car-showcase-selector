import { createFileRoute, notFound } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Background } from "@/components/Background";
import { CarSwitcher } from "@/components/CarSwitcher";
import { Pano360 } from "@/components/Pano360";
import { useVRSalonPreload, VRSalon } from "@/components/VRSalon";
import { LeadDialog } from "@/components/LeadDialog";
import { Button } from "@/components/ui/button";
import { CarGallery } from "@/components/CarGallery";
import { CarSpecsPanel, CarSpecsRoot, CarSpecsTabs } from "@/components/CarSpecs";
import { getCarBySlug, getGalleryCategories, type Car } from "@/lib/cars";
import { Phone, Calendar, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/car/$slug")({
  loader: ({ params }): { car: NonNullable<ReturnType<typeof getCarBySlug>> } => {
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
      links: [
        { rel: "preconnect", href: "https://pano.autohome.com.cn" },
        { rel: "dns-prefetch", href: "https://pano.autohome.com.cn" },
      ],
    };
  },
  component: CarPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      Автомобиль не найден
    </div>
  ),
});

function FlatGallery({ images, carName }: { images: string[]; carName: string }) {
  const [activeImg, setActiveImg] = useState(0);
  return (
    <>
      <div className="glass overflow-hidden rounded-2xl bg-black">
        <img src={images[activeImg]} alt={carName} className="aspect-video w-full object-cover" />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
        {images.map((g, i) => (
          <button
            key={g}
            type="button"
            onClick={() => setActiveImg(i)}
            className={`aspect-[4/3] overflow-hidden rounded-md border transition-all duration-500 ${
              activeImg === i
                ? "border-[#C9A84C] opacity-100"
                : "border-white/[0.05] opacity-50 hover:opacity-90"
            }`}
          >
            <img src={g} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </>
  );
}

function CarPage() {
  const { car } = Route.useLoaderData() as { car: Car };
  const galleryCategories = getGalleryCategories(car.galleryAlbums);
  const specsSectionRef = useRef<HTMLElement>(null);
  useVRSalonPreload(car.panoId, car.vrSalonSrc);
  useReveal();

  return (
    <div className="relative flex min-h-screen flex-col">
      <Background />
      <Header />
      <CarSwitcher active={car.slug} />

      <main className="relative z-10 flex-1">
        {/* HERO */}
        <section className="container mx-auto grid gap-16 px-6 py-24 md:grid-cols-12 md:py-32">
          <div
            className="relative md:col-span-7"
            style={{ animation: "fade-up 1.3s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            <div className="glass overflow-hidden rounded-2xl bg-black">
              <img src={car.hero} alt={car.name} className="aspect-[4/3] h-full w-full object-cover" />
            </div>
          </div>

          <div className="flex flex-col justify-center md:col-span-5">
            <div className="eyebrow" style={{ animation: "fade-up 1.2s 0.1s both" }}>
              {car.subtitle}
            </div>
            <h1
              className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl"
              style={{ animation: "fade-up 1.2s 0.2s both" }}
            >
              {car.name}
            </h1>
            <p
              className="mt-6 font-serif text-xl italic text-[#C9A84C]"
              style={{ animation: "fade-up 1.2s 0.35s both" }}
            >
              {car.tagline}
            </p>
            <p
              className="mt-6 text-sm leading-relaxed text-muted-foreground"
              style={{ animation: "fade-up 1.2s 0.5s both" }}
            >
              {car.description}
            </p>
            <div
              className="mt-10 flex items-baseline gap-4 border-t border-white/[0.08] pt-6"
              style={{ animation: "fade-up 1.2s 0.65s both" }}
            >
              <div>
                <div className="text-[0.65rem] tracking-[0.25em] text-muted-foreground">ОТ</div>
                <div className="mt-1 font-serif text-3xl text-[#C9A84C]">{car.price}</div>
              </div>
              {car.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">{car.oldPrice}</span>
              )}
            </div>
            <div
              className="mt-8 flex flex-wrap gap-3"
              style={{ animation: "fade-up 1.2s 0.8s both" }}
            >
              <LeadDialog
                kind="test-drive"
                carName={car.name}
                title="Запись на тест-драйв"
                trigger={
                  <Button size="lg" className="gap-2 bg-[#C9A84C] text-black hover:bg-[#d8b965]">
                    <Calendar className="h-4 w-4" /> Тест-драйв
                  </Button>
                }
              />
              <LeadDialog
                kind="booking"
                carName={car.name}
                title="Бронирование автомобиля"
                trigger={
                  <Button size="lg" variant="outline" className="gap-2 border-white/15 bg-transparent text-foreground hover:bg-white/5">
                    <Phone className="h-4 w-4" /> Забронировать
                  </Button>
                }
              />
            </div>
          </div>
        </section>

        <div className="divider-thin container mx-auto" />

        {/* HIGHLIGHTS */}
        <section className="container mx-auto px-6 py-32">
          <div className="reveal mb-16 text-center">
            <div className="eyebrow">— Преимущества —</div>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
              Сделано <span className="italic text-[#C9A84C]">безупречно</span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {car.highlights.map((h, i) => (
              <div
                key={h.title}
                className="reveal glass glass-hover rounded-2xl p-10"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <Sparkles className="h-6 w-6 text-[#C9A84C]" />
                <h3 className="mt-6 font-serif text-2xl tracking-wide">{h.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{h.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="divider-thin container mx-auto" />

        {/* 360 */}
        <section className="container mx-auto px-6 py-32">
          <div className="reveal mb-12 text-center">
            <div className="eyebrow">— Обзор 360° —</div>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
              Обзор <span className="italic text-[#C9A84C]">360°</span>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Перетащите изображение для вращения
            </p>
          </div>
          <div className="reveal glass overflow-hidden rounded-2xl">
            <div className="aspect-video w-full">
              <Pano360 key={car.slug} frames={car.pano360} colors={car.pano360Colors} />
            </div>
          </div>
        </section>

        <div className="divider-thin container mx-auto" />

        {/* VR SALON */}
        <section className="container mx-auto px-6 py-32">
          <div className="reveal mb-12 text-center">
            <div className="eyebrow">— Салон VR —</div>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
              Салон <span className="italic text-[#C9A84C]">VR</span>
            </h2>
          </div>
          <div className="reveal glass overflow-hidden rounded-2xl">
            <div className="aspect-video w-full">
              <VRSalon key={car.slug} panoId={car.panoId} src={car.vrSalonSrc} />
            </div>
          </div>
        </section>

        <div className="divider-thin container mx-auto" />

        {/* SPECS */}
        <section
          ref={specsSectionRef}
          className="container mx-auto scroll-mt-28 px-6 py-32"
        >
          <div className="reveal mb-12 text-center">
            <div className="eyebrow">— Спецификация —</div>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
              Технические <span className="italic text-[#C9A84C]">характеристики</span>
            </h2>
            <p className="mx-auto mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {car.name} · {new Date().getFullYear()}
            </p>
          </div>
          <CarSpecsRoot specGroups={car.specGroups} sectionRef={specsSectionRef}>
            <div className="reveal mb-8">
              <CarSpecsTabs />
            </div>
            <div className="reveal glass rounded-2xl p-6 md:p-10">
              <CarSpecsPanel />
            </div>
          </CarSpecsRoot>
        </section>

        <div className="divider-thin container mx-auto" />

        {/* GALLERY */}
        <section className="container mx-auto px-6 py-32">
          <div className="reveal mb-12 text-center">
            <div className="eyebrow">— Галерея —</div>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
              {car.name} <span className="italic text-[#C9A84C]">в деталях</span>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Выберите категорию и рассмотрите автомобиль с разных ракурсов.
            </p>
          </div>
          <div className="reveal">
            {galleryCategories ? (
              <CarGallery carName={car.name} categories={galleryCategories} />
            ) : (
              <FlatGallery images={car.gallery} carName={car.name} />
            )}
          </div>
        </section>

        <div className="divider-thin container mx-auto" />

        {/* WHY CHOOSE */}
        <section className="container mx-auto px-6 py-32">
          <div className="reveal mb-16 text-center">
            <div className="eyebrow">— Почему Citroën —</div>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
              {car.name} — <span className="italic text-[#C9A84C]">ваш лучший выбор</span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {car.reasons.map((r, i) => (
              <div
                key={r.title}
                className="reveal glass glass-hover rounded-2xl p-10"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C] font-serif text-xl">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl tracking-wide">{r.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 pb-32">
          <div className="reveal glass relative overflow-hidden rounded-3xl px-8 py-20 text-center md:px-16 md:py-28">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(201,168,76,0.25), transparent 60%)",
              }}
            />
            <div className="relative">
              <div className="eyebrow">— Ваш следующий шаг —</div>
              <h2 className="mx-auto mt-6 max-w-2xl font-serif text-4xl leading-tight tracking-tight md:text-5xl">
                Готовы испытать <span className="italic text-[#C9A84C]">{car.name}</span>?
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-sm text-muted-foreground">
                Запишитесь на персональный тест-драйв или забронируйте автомобиль — мы перезвоним и
                подготовим всё для встречи в нашем салоне.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <LeadDialog
                  kind="test-drive"
                  carName={car.name}
                  title="Запись на тест-драйв"
                  trigger={
                    <Button size="lg" className="bg-[#C9A84C] text-black hover:bg-[#d8b965]">
                      Тест-драйв
                    </Button>
                  }
                />
                <LeadDialog
                  kind="booking"
                  carName={car.name}
                  title="Бронирование автомобиля"
                  trigger={
                    <Button size="lg" variant="outline" className="border-white/15 bg-transparent hover:bg-white/5">
                      Забронировать
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
