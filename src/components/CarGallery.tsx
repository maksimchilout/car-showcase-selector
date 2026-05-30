import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryCategory } from "@/lib/cars";

const PAGE_SIZE = 12;

function getThumbsPerRow(width: number) {
  if (width >= 1024) return 12;
  if (width >= 640) return 6;
  return 4;
}

type CarGalleryProps = {
  carName: string;
  categories: GalleryCategory[];
};

export function CarGallery({ carName, categories }: CarGalleryProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.label ?? "");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [thumbPageSize, setThumbPageSize] = useState(() =>
    typeof window === "undefined" ? 12 : getThumbsPerRow(window.innerWidth),
  );
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [isMobileGallery, setIsMobileGallery] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [thumbWindowStart, setThumbWindowStart] = useState(0);
  const mainPhotoDragRef = useRef<{ startX: number; moved: boolean } | null>(null);
  const mainPhotoSwipeJustHandledRef = useRef(false);
  const mobileSwipeRef = useRef<{ startX: number; moved: boolean } | null>(null);

  const activeCat = categories.find((c) => c.label === activeCategory) ?? categories[0];
  const images = activeCat?.images ?? [];

  const visible = images.slice(0, visibleCount);
  const hasMore = images.length > visibleCount;
  const maxThumbStart = Math.max(0, images.length - thumbPageSize);
  const safeThumbStart = Math.min(thumbWindowStart, maxThumbStart);
  const thumbPageItems = images.slice(safeThumbStart, safeThumbStart + thumbPageSize);
  const canThumbPrev = safeThumbStart > 0;
  const canThumbNext = safeThumbStart < maxThumbStart;

  const handleCategoryChange = (label: string) => {
    setActiveCategory(label);
    setVisibleCount(PAGE_SIZE);
    setMobileIndex(0);
    setThumbWindowStart(0);
    setLightbox(null);
  };

  useLayoutEffect(() => {
    setThumbWindowStart((s) => Math.min(s, maxThumbStart));
  }, [maxThumbStart]);

  useLayoutEffect(() => {
    if (lightbox === null) return;
    setThumbWindowStart((start) => {
      let next = start;
      if (lightbox < next) next = lightbox;
      else if (lightbox >= next + thumbPageSize) next = lightbox - thumbPageSize + 1;
      return Math.max(0, Math.min(maxThumbStart, next));
    });
  }, [lightbox, maxThumbStart, thumbPageSize]);

  useEffect(() => {
    const onResize = () => setThumbPageSize(getThumbsPerRow(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setIsMobileGallery(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (images.length === 0) {
      setMobileIndex(0);
      return;
    }
    setMobileIndex((i) => Math.max(0, Math.min(images.length - 1, i)));
  }, [images.length]);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const apply = () => setIsCoarsePointer(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const goLightbox = useCallback(
    (delta: number) => {
      setLightbox((lb) => (lb === null ? lb : (lb + delta + images.length) % images.length));
    },
    [images.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      overflow: style.overflow,
      width: style.width,
    };
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    style.overflow = "hidden";
    return () => {
      style.position = prev.position;
      style.top = prev.top;
      style.left = prev.left;
      style.right = prev.right;
      style.overflow = prev.overflow;
      style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [lightbox]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") goLightbox(-1);
      if (e.key === "ArrowRight") goLightbox(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, goLightbox]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryChange(cat.label)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              activeCategory === cat.label
                ? "bg-[#C9A84C] text-black"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isMobileGallery ? (
        <div className="mx-auto max-w-3xl">
          {images.length > 0 && (
            <button
              type="button"
              onClick={() => setLightbox(mobileIndex)}
              className="glass aspect-[4/3] w-full touch-pan-y overflow-hidden rounded-2xl"
              onTouchStart={(e) => {
                mobileSwipeRef.current = { startX: e.touches[0].clientX, moved: false };
              }}
              onTouchMove={(e) => {
                const d = mobileSwipeRef.current;
                if (!d) return;
                if (Math.abs(e.touches[0].clientX - d.startX) > 10) d.moved = true;
              }}
              onTouchEnd={(e) => {
                const d = mobileSwipeRef.current;
                mobileSwipeRef.current = null;
                if (!d?.moved || images.length < 2) return;
                const dx = (e.changedTouches[0]?.clientX ?? 0) - d.startX;
                if (Math.abs(dx) < 50) return;
                if (dx > 0) setMobileIndex((i) => (i - 1 + images.length) % images.length);
                else setMobileIndex((i) => (i + 1) % images.length);
              }}
            >
              <img
                src={images[mobileIndex]}
                alt={`${carName} — ${activeCategory}, фото ${mobileIndex + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
                draggable={false}
              />
            </button>
          )}
          {images.length > 1 && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {mobileIndex + 1} / {images.length}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setLightbox(i)}
              className="glass group aspect-[4/3] overflow-hidden rounded-xl"
            >
              <img
                src={src}
                alt={`${carName} — ${activeCategory}, фото ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {!isMobileGallery && hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="glass rounded-full px-8 py-3 text-sm text-foreground transition-colors hover:text-[#C9A84C]"
          >
            Показать ещё
          </button>
        </div>
      )}

      {lightbox !== null &&
        images[lightbox] &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex h-[100dvh] max-h-[100dvh] w-full touch-none flex-col overflow-hidden overscroll-none bg-black/95"
            role="dialog"
            aria-modal="true"
            aria-label="Просмотр фото"
          >
            <div className="flex h-14 shrink-0 items-center justify-end px-4">
              <button
                type="button"
                className="text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setLightbox(null)}
                aria-label="Закрыть"
              >
                <X className="h-8 w-8" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 touch-none">
              {!isCoarsePointer && images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-4xl text-muted-foreground transition-colors hover:text-[#C9A84C] sm:left-4"
                    onClick={() => goLightbox(-1)}
                    aria-label="Предыдущее фото"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-4xl text-muted-foreground transition-colors hover:text-[#C9A84C] sm:right-4"
                    onClick={() => goLightbox(1)}
                    aria-label="Следующее фото"
                  >
                    ›
                  </button>
                </>
              )}

              <div
                className="flex h-full w-full cursor-default items-center justify-center px-10 sm:px-14"
                onClick={(e) => {
                  if (mainPhotoSwipeJustHandledRef.current) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const third = rect.width / 3;
                  if (x < third) goLightbox(-1);
                  else if (x > third * 2) goLightbox(1);
                }}
                onTouchStart={(e) => {
                  mainPhotoDragRef.current = { startX: e.touches[0].clientX, moved: false };
                }}
                onTouchMove={(e) => {
                  if (
                    mainPhotoDragRef.current &&
                    Math.abs(e.touches[0].clientX - mainPhotoDragRef.current.startX) > 10
                  ) {
                    mainPhotoDragRef.current.moved = true;
                  }
                }}
                onTouchEnd={(e) => {
                  const d = mainPhotoDragRef.current;
                  mainPhotoDragRef.current = null;
                  if (!d?.moved) return;
                  const dx = (e.changedTouches[0]?.clientX ?? 0) - d.startX;
                  if (Math.abs(dx) < 50) return;
                  mainPhotoSwipeJustHandledRef.current = true;
                  window.setTimeout(() => {
                    mainPhotoSwipeJustHandledRef.current = false;
                  }, 100);
                  if (dx > 50) goLightbox(-1);
                  else if (dx < -50) goLightbox(1);
                }}
              >
                <img
                  src={images[lightbox]}
                  alt={`${carName} — ${activeCategory}, фото ${lightbox + 1}`}
                  className="max-h-full max-w-full select-none object-contain"
                  draggable={false}
                />
              </div>
            </div>

            <div className="shrink-0 px-2 pb-4 pt-2 sm:px-4">
              <div className="mx-auto flex w-full max-w-4xl items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  aria-label="Предыдущие миниатюры"
                  disabled={!canThumbPrev}
                  onClick={() => setThumbWindowStart((s) => Math.max(0, s - 1))}
                  className="glass flex-shrink-0 rounded-full p-1.5 text-foreground transition-colors hover:text-[#C9A84C] disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                <div className="grid min-w-0 flex-1 grid-cols-4 gap-1.5 sm:grid-cols-6 sm:gap-2 lg:grid-cols-12">
                  {thumbPageItems.map((src, slot) => {
                    const i = safeThumbStart + slot;
                    return (
                      <button
                        key={`${i}-${src}`}
                        type="button"
                        onClick={() => setLightbox(i)}
                        className={`aspect-[4/3] w-full overflow-hidden rounded-md border-2 transition-all ${
                          i === lightbox
                            ? "border-[#C9A84C] opacity-100 ring-1 ring-[#C9A84C]/40"
                            : "border-transparent opacity-60 hover:opacity-90"
                        }`}
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  aria-label="Следующие миниатюры"
                  disabled={!canThumbNext}
                  onClick={() => setThumbWindowStart((s) => Math.min(maxThumbStart, s + 1))}
                  className="glass flex-shrink-0 rounded-full p-1.5 text-foreground transition-colors hover:text-[#C9A84C] disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
