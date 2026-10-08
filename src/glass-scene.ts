import { LiquidGlass } from "@ybouane/liquidglass";

export type GlassAppearance = {
  wallpaper: string;
  dark: boolean;
  radius: number;
  blur: number;
  fit: "cover" | "contain";
  position: number;
  highlights?: number;
  shadows?: number;
};
type Slot = {
  proxy: HTMLDivElement;
  source?: HTMLElement;
  geometry: string;
  config: string;
};
const selector = ".glass:not(dialog):not(.toast), .wiki-feature";
const maxPanels = 20;

export function createGlassScene(
  root: HTMLDivElement,
  appearance: () => GlassAppearance,
) {
  const app = root.parentElement!;
  const image = root.querySelector("img")!;
  let instance: LiquidGlass | undefined;
  let disposed = false;
  let frame = 0;
  let paintedWallpaper = "";
  const observed = new Set<HTMLElement>();

  // The library registers panels at initialization. Reuse a bounded pool so
  // navigation and live content never replace its canvases or WebGL context.
  const slots: Slot[] = Array.from({ length: maxPanels }, () => {
    const proxy = document.createElement("div");
    proxy.className = "glass-proxy";
    Object.assign(proxy.style, {
      visibility: "hidden",
      left: "-10000px",
      top: "-10000px",
      width: "1px",
      height: "1px",
    });
    root.append(proxy);
    return { proxy, geometry: "", config: "" };
  });

  const schedule = () => {
    if (!disposed && !frame) frame = requestAnimationFrame(sync);
  };
  const resize = new ResizeObserver(schedule);
  resize.observe(app);

  function sync() {
    frame = 0;
    if (disposed) return;
    const settings = appearance();
    const rootRect = root.getBoundingClientRect();
    const elements = [...app.querySelectorAll<HTMLElement>(selector)]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return (
          !root.contains(element) &&
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > rootRect.top + 30 &&
          rect.top < rootRect.bottom
        );
      })
      .slice(0, maxPanels);
    const wanted = new Set(elements);

    for (const element of observed) {
      if (!wanted.has(element)) {
        resize.unobserve(element);
        observed.delete(element);
      }
    }
    for (const element of elements) {
      if (!observed.has(element)) {
        resize.observe(element);
        observed.add(element);
      }
    }
    for (const slot of slots) {
      if (slot.source && !wanted.has(slot.source)) {
        slot.source = undefined;
        slot.proxy.style.visibility = "hidden";
        slot.proxy.removeAttribute("data-glass-active");
        // Unused slots cannot refract another panel's background. Retain the
        // canvas and reuse it on the next page.
        Object.assign(slot.proxy.style, {
          left: "-10000px",
          top: "-10000px",
          width: "1px",
          height: "1px",
        });
        slot.geometry = "";
        instance?.markChanged(slot.proxy);
      }
    }
    for (const element of elements) {
      const slot =
        slots.find((s) => s.source === element) ??
        slots.find((s) => !s.source)!;
      slot.source = element;
      const rect = element.getBoundingClientRect();
      const corner =
        parseFloat(getComputedStyle(element).borderRadius) || settings.radius;
      const x = rect.left - rootRect.left,
        y = rect.top - rootRect.top;
      const geometry = `${x}:${y}:${rect.width}:${rect.height}:${corner}`;
      const config = JSON.stringify({
        cornerRadius: corner,
        zRadius: Math.min(20, corner),
        blurAmount: settings.blur / 100,
        refraction: 0.82,
        chromAberration: 0.025,
        edgeHighlight: (settings.highlights ?? 0.6) * 0.3,
        specular: (settings.highlights ?? 0.6) * 0.25,
        fresnel: 0.75,
        brightness: settings.dark ? -0.18 : 0.02,
        saturation: 0.12,
        shadowOpacity: (settings.shadows ?? 0.5) * 0.4,
        shadowSpread: 14,
      });
      if (slot.geometry !== geometry) {
        Object.assign(slot.proxy.style, {
          left: `${x}px`,
          top: `${y}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          borderRadius: `${corner}px`,
        });
        slot.geometry = geometry;
        instance?.markChanged(slot.proxy);
      }
      if (slot.config !== config) {
        slot.proxy.dataset.config = config;
        slot.config = config;
      }
      slot.proxy.style.visibility = "visible";
      slot.proxy.dataset.glassActive = "true";
    }
    const wallpaperState = `${settings.wallpaper}:${settings.fit}:${settings.position}`;
    if (
      image.complete &&
      image.naturalWidth &&
      paintedWallpaper !== wallpaperState
    ) {
      paintedWallpaper = wallpaperState;
      instance?.markChanged(image);
    }
  }

  const mutation = new MutationObserver((records) => {
    // Text and form edits may affect layout, but need only a geometry check.
    // They must never reset the shader renderer.
    if (records.some((record) => !root.contains(record.target))) schedule();
  });
  mutation.observe(app, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });
  document.addEventListener("scroll", schedule, true);
  image.addEventListener("load", schedule);

  const contextLost = () => root.removeAttribute("data-ready");
  const contextRestored = () => {
    requestAnimationFrame(() => {
      if (!disposed) root.dataset.ready = "true";
    });
  };
  const start = async () => {
    try {
      await image.decode();
      if (disposed) return;
      sync();
      const initialized = await LiquidGlass.init({
        root,
        glassElements: slots.map((s) => s.proxy),
      });
      if (disposed) {
        initialized.destroy();
        return;
      }
      instance = initialized;
      instance.renderer.canvas.addEventListener(
        "webglcontextlost",
        contextLost,
      );
      instance.renderer.canvas.addEventListener(
        "webglcontextrestored",
        contextRestored,
      );
      // Keep the CSS fallback until the first shader frame is painted.
      requestAnimationFrame(() => {
        if (!disposed) root.dataset.ready = "true";
      });
      schedule();
    } catch {
      if (!disposed) root.removeAttribute("data-ready");
    }
  };
  void start();
  return {
    refresh: schedule,
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutation.disconnect();
      document.removeEventListener("scroll", schedule, true);
      image.removeEventListener("load", schedule);
      instance?.renderer.canvas.removeEventListener(
        "webglcontextlost",
        contextLost,
      );
      instance?.renderer.canvas.removeEventListener(
        "webglcontextrestored",
        contextRestored,
      );
      instance?.destroy();
      slots.forEach((slot) => slot.proxy.remove());
      root.removeAttribute("data-ready");
    },
  };
}
