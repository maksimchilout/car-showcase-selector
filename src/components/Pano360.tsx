import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import type { Pano360Color } from "@/lib/cars";

const PANO360_BG = "/background360/ext-bg-default1.webp";

type Pano360Props = {
  frames: string[];
  colors?: Pano360Color[];
};

export function Pano360({ frames, colors }: Pano360Props) {
  const colorOptions = useMemo(
    () => (colors && colors.length > 0 ? colors : [{ id: "default", name: "", hex: "", frames }]),
    [colors, frames],
  );
  const [colorId, setColorId] = useState(colorOptions[0]?.id ?? "default");
  const activeColor = colorOptions.find((c) => c.id === colorId) ?? colorOptions[0];
  const activeFrames = activeColor?.frames ?? frames;

  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startIdx: number } | null>(null);

  useEffect(() => {
    setIndex(0);
    setLoaded(0);
  }, [colorId]);

  useEffect(() => {
    let cancelled = false;
    activeFrames.forEach((src) => {
      const img = new Image();
      const done = () => {
        if (!cancelled) setLoaded((c) => c + 1);
      };
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });
    return () => {
      cancelled = true;
    };
  }, [activeFrames]);

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

  const progress = activeFrames.length ? Math.round((loaded / activeFrames.length) * 100) : 0;
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
            key={`${colorId}-${index}-${currentFrame}`}
            src={currentFrame}
            alt={`Frame ${index + 1}`}
            draggable={false}
            className="absolute inset-0 z-10 h-full w-full origin-center object-contain scale-[1.15]"
            loading="eager"
          />
        )}

        {showColorPicker && (
          <div className="pointer-events-auto absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/70 px-4 py-2.5 backdrop-blur-xl">
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
                  className={`relative h-8 w-8 shrink-0 rounded-full transition-all ${
                    isActive
                      ? "ring-2 ring-[#C9A84C] ring-offset-2 ring-offset-black/80"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="absolute inset-0 rounded-full border border-black/20" />
                </button>
              );
            })}
          </div>
        )}

        <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-foreground backdrop-blur-xl">
          <RotateCw className="h-3 w-3 text-[#C9A84C]" />
          Перетащите · {index + 1}/{activeFrames.length}
        </div>

        {progress < 100 && (
          <div className="absolute inset-x-0 top-0 h-px bg-white/10">
            <div className="h-full bg-[#C9A84C] transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}
