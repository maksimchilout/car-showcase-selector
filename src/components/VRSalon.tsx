import { useEffect } from "react";

type VRSalonProps = {
  panoId: string;
  src?: string;
};

const VR_SALON_SCALE = 1.16;
const PANO_ORIGIN = "https://pano.autohome.com.cn";

export function getVrSalonSrc(panoId: string, src?: string) {
  return src ?? `${PANO_ORIGIN}/car/inn/${panoId}`;
}

/** Стартует загрузку VR iframe сразу при открытии страницы (скрытый кадр). */
export function useVRSalonPreload(panoId: string, src?: string) {
  const iframeSrc = getVrSalonSrc(panoId, src);

  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.src = iframeSrc;
    iframe.title = "";
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.loading = "eager";
    iframe.style.cssText =
      "position:fixed;left:-9999px;top:0;width:4px;height:4px;border:0;opacity:0;pointer-events:none";
    document.body.appendChild(iframe);

    return () => {
      iframe.remove();
    };
  }, [iframeSrc]);
}

export function VRSalon({ panoId, src }: VRSalonProps) {
  const iframeSrc = getVrSalonSrc(panoId, src);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <iframe
        src={iframeSrc}
        title="VR салон"
        className="absolute left-1/2 top-1/2 h-full w-full border-0"
        style={{ transform: `translate(-50%, -50%) scale(${VR_SALON_SCALE})` }}
        allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
        allowFullScreen
        loading="eager"
        // @ts-expect-error fetchpriority is valid on iframes in Chromium
        fetchPriority="high"
      />
    </div>
  );
}
