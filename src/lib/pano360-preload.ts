import type { Pano360Color } from "@/lib/cars";

export const PANO360_BG = "/background360/ext-bg-default1.webp";

const loadedUrls = new Set<string>();
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

export function collectPano360Urls(frames: string[], colors?: Pano360Color[]): string[] {
  const urls = new Set<string>([PANO360_BG]);
  if (colors && colors.length > 0) {
    for (const color of colors) {
      for (const frame of color.frames) urls.add(frame);
    }
  } else {
    for (const frame of frames) urls.add(frame);
  }
  return [...urls];
}

function markLoaded(src: string) {
  if (loadedUrls.has(src)) return;
  loadedUrls.add(src);
  notify();
}

function preloadImage(src: string) {
  if (loadedUrls.has(src)) return;

  const img = new Image();
  const done = () => markLoaded(src);
  img.onload = () => {
    void img.decode?.().then(done).catch(done);
  };
  img.onerror = done;
  img.src = src;

  if (img.complete) {
    void img.decode?.().then(done).catch(done);
  }
}

export function preloadPano360(frames: string[], colors?: Pano360Color[]) {
  for (const url of collectPano360Urls(frames, colors)) {
    preloadImage(url);
  }
}

export function getPano360Progress(urls: string[]) {
  if (!urls.length) return 100;
  const loaded = urls.filter((url) => loadedUrls.has(url)).length;
  return Math.round((loaded / urls.length) * 100);
}

export function subscribePano360Preload(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
