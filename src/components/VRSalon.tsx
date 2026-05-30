type VRSalonProps = {
  panoId: string;
  src?: string;
};

const VR_SALON_SCALE = 1.16;

export function VRSalon({ panoId, src }: VRSalonProps) {
  const iframeSrc = src ?? `https://pano.autohome.com.cn/car/inn/${panoId}`;

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <iframe
        src={iframeSrc}
        title="VR салон"
        className="absolute left-1/2 top-1/2 h-full w-full border-0"
        style={{ transform: `translate(-50%, -50%) scale(${VR_SALON_SCALE})` }}
        allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
