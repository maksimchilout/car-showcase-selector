import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { RotateCw } from "lucide-react";
import type { Pano360Color } from "@/lib/cars";
import {
  PANO360_BG,
  collectPano360Urls,
  getPano360Progress,
  preloadPano360,
  subscribePano360Preload,
} from "@/lib/pano360-preload";

type Pano360Props = {
  frames: string[];
  colors?: Pano360Color[];
};

/** Предзагружает все кадры всех цветов сразу при открытии страницы. */
export function usePano360Preload(frames: string[], colors?: Pano360Color[]) {
  useEffect(() => {
    preloadPano360(frames, colors);
  }, [frames, colors]);
}

export function Pano360({ frames, colors }: Pano360Props) {
  const colorOptions = useMemo(
    () => (colors && colors.length > 0 ? colors : [{ id: "default", name: "", hex: "", frames }]),
    [colors, frames],
  );
  const allUrls = useMemo(() => collectPano360Urls(frames, colors), [frames, colors]);

  const [colorId, setColorId] = useState(colorOptions[0]?.id ?? "default");
  const activeColor = colorOptions.find((c) => c.id === colorId) ?? colorOptions[0];
  const activeFrames = activeColor?.frames ?? frames;

  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startIdx: number } | null>(null);

  useEffect(() => {
    preloadPano360(frames, colors);
  }, [frames, colors]);

  useEffect(() => {
    setIndex(0);
  }, [colorId]);

  const progress = useSyncExternalStore(
    subscribePano360Preload,
    () => getPano360Progress(allUrls),
    () => 0,
  );

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startIdx: index };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !ref.current) return;
    const w = ref.current.clientWidth;
    const dx = e.clientX - dragRef.current.startX;
    const step = Math.round((dx / w) * activeFrames.length * 2);
    const next =
      ((dragRef.current.startIdx + step) % activeFrames.length + activeFrames.length) %
      activeFrames.length;
    setIndex(next);
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const showColorPicker = colors && colors.length > 1;
  const currentFrame = activeFrames[index];

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[#e8e8e8]"
      style={{
        backgroundImage: `url(${PANO360_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        ref={ref}
        className="relative isolate h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          src={PANO360_BG}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          draggable={false}
        />
        {currentFrame && (
          <img
            src={currentFrame}
            alt={`Frame ${index + 1}`}
            draggable={false}
            className="absolute inset-0 z-10 h-full w-full origin-center object-contain scale-[1.15]"
            loading="eager"
            decoding="sync"
          />
        )}

        {showColorPicker && (
          <div className="pointer-events-auto absolute right-12 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-2.5">
            {colorOptions.map((color) => {
              const isActive = color.id === colorId;
              return (
                <button
                  key={color.id}
                  type="button"
                  title={color.name}
                  aria-label={color.name}
                  aria-pressed={isActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    setColorId(color.id);
                  }}
                  className="group relative h-[1.8rem] w-[1.8rem] shrink-0 cursor-pointer rounded-full p-0"
                  style={{ backgroundColor: color.hex }}
                >
                  <span
                    className={`pointer-events-none absolute -inset-0.5 rounded-full border-2 border-primary transition-opacity duration-500 ease-in-out ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                  <span className="pointer-events-none absolute inset-0 rounded-full border border-black/25 shadow-sm" />
                </button>
              );
            })}
          </div>
        )}

        <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full glass px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-foreground">
          <RotateCw className="h-3 w-3 text-gold" />
          Перетащите · {index + 1}/{activeFrames.length}
        </div>

        {progress < 100 && (
          <div className="absolute inset-x-0 top-0 h-px bg-white/10">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}
