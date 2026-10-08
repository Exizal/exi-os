import { useEffect, useRef } from "react";
import { createGlassScene, type GlassAppearance } from "./glass-scene";

export function GlassBackdrop({
  wallpaper,
  dark,
  enabled,
  radius,
  blur,
  revision,
  fit,
  position,
  highlights,
  shadows,
}: GlassAppearance & { enabled: boolean; revision: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const appearance = useRef<GlassAppearance>({
    wallpaper,
    dark,
    radius,
    blur,
    fit,
    position,
    highlights,
    shadows,
  });
  const refresh = useRef<(() => void) | undefined>(undefined);
  useEffect(() => {
    appearance.current = {
      wallpaper,
      dark,
      radius,
      blur,
      fit,
      position,
      highlights,
      shadows,
    };
    refresh.current?.();
  }, [
    wallpaper,
    dark,
    radius,
    blur,
    fit,
    position,
    highlights,
    shadows,
    revision,
  ]);
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const scene = createGlassScene(ref.current, () => appearance.current);
    refresh.current = scene.refresh;
    return () => {
      refresh.current = undefined;
      scene.destroy();
    };
  }, [enabled]);
  return (
    <div className="liquid-backdrop" ref={ref} aria-hidden="true">
      <img
        src={wallpaper}
        alt=""
        draggable={false}
        style={{ objectFit: fit, objectPosition: `${position}% center` }}
      />
    </div>
  );
}
