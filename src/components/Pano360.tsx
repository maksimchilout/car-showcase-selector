import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";

export function Pano360({ frames }: { frames: string[] }) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startIdx: number } | null>(null);

  useEffect(() => {
    // Preload
    frames.forEach((src) => {
      const img = new Image();
      img.onload = () => setLoaded((c) => c + 1);
      img.onerror = () => setLoaded((c) => c + 1);
      img.src = src;
    });
  }, [frames]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startIdx: index };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !ref.current) return;
    const w = ref.current.clientWidth;
    const dx = e.clientX - dragRef.current.startX;
    const step = Math.round((dx / w) * frames.length);
    const next = ((dragRef.current.startIdx - step) % frames.length + frames.length) % frames.length;
    setIndex(next);
  };
  const onPointerUp = () => { dragRef.current = null; };

  const progress = Math.round((loaded / frames.length) * 100);

  return (
    <div className="relative w-full overflow-hidden bg-black">
      <div
        ref={ref}
        className="relative aspect-[4/3] w-full cursor-grab touch-none select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {frames.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Frame ${i + 1}`}
            draggable={false}
            className="absolute inset-0 h-full w-full object-contain"
            style={{ opacity: i === index ? 1 : 0 }}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-foreground backdrop-blur-xl">
          <RotateCw className="h-3 w-3 text-[#C9A84C]" />
          Перетащите · {index + 1}/{frames.length}
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
