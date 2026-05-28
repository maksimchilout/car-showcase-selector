export function VRSalon({ panoId }: { panoId: string }) {
  // AutoHome interior VR panorama
  const src = `https://pano.autohome.com.cn/car/inn/${panoId}`;
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted shadow">
      <iframe
        src={src}
        title="VR салон"
        className="h-full w-full"
        allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
