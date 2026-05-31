import { useEffect, useState } from "react";

type VRSalonProps = {
  panoId: string;
  src?: string;
};

const VR_SALON_SCALE = 1.18;
const VR_SALON_SCALE_NARROW = 1.2;
const VR_SALON_SCALE_MOBILE = 1.25;
const VR_SALON_SCALE_SMALL = 1.35;
const VR_SALON_SCALE_XS = 1.42;
const VR_SALON_SCALE_XXS = 1.5;
const VR_SALON_SCALE_TINY = 1.65;
const VR_SALON_NARROW_MQ = "(max-width: 1280px)";
const VR_SALON_MOBILE_MQ = "(max-width: 1120px)";
const VR_SALON_SMALL_MQ = "(max-width: 960px)";
const VR_SALON_XS_MQ = "(max-width: 680px)";
const VR_SALON_XXS_MQ = "(max-width: 600px)";
const VR_SALON_TINY_MQ = "(max-width: 550px)";
const PANO_ORIGIN = "https://pano.autohome.com.cn";

function getVrSalonScale() {
  if (window.matchMedia(VR_SALON_TINY_MQ).matches) return VR_SALON_SCALE_TINY;
  if (window.matchMedia(VR_SALON_XXS_MQ).matches) return VR_SALON_SCALE_XXS;
  if (window.matchMedia(VR_SALON_XS_MQ).matches) return VR_SALON_SCALE_XS;
  if (window.matchMedia(VR_SALON_SMALL_MQ).matches) return VR_SALON_SCALE_SMALL;
  if (window.matchMedia(VR_SALON_MOBILE_MQ).matches) return VR_SALON_SCALE_MOBILE;
  if (window.matchMedia(VR_SALON_NARROW_MQ).matches) return VR_SALON_SCALE_NARROW;
  return VR_SALON_SCALE;
}

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
  const [scale, setScale] = useState(VR_SALON_SCALE);

  useEffect(() => {
    const mqs = [
      window.matchMedia(VR_SALON_TINY_MQ),
      window.matchMedia(VR_SALON_XXS_MQ),
      window.matchMedia(VR_SALON_XS_MQ),
      window.matchMedia(VR_SALON_SMALL_MQ),
      window.matchMedia(VR_SALON_MOBILE_MQ),
      window.matchMedia(VR_SALON_NARROW_MQ),
    ];
    const apply = () => setScale(getVrSalonScale());
    apply();
    for (const mq of mqs) mq.addEventListener("change", apply);
    return () => {
      for (const mq of mqs) mq.removeEventListener("change", apply);
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <iframe
        src={iframeSrc}
        title="VR салон"
        className="absolute left-1/2 top-1/2 h-full w-full border-0"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
        allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
        allowFullScreen
        loading="eager"
        // @ts-expect-error fetchpriority is valid on iframes in Chromium
        fetchPriority="high"
      />
    </div>
  );
}
