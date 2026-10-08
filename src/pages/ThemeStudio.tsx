import { Panel } from "../components/Panel";
import type { Theme, Workspace } from "../state";
export function ThemeStudio({
  state,
  update,
}: {
  state: Workspace;
  update: (fn: (s: Workspace) => Workspace) => void;
}) {
  const set = (key: keyof Theme, value: unknown) =>
    update((s) => ({ ...s, theme: { ...s.theme, [key]: value } }));
  return (
    <div className="themes-page">
      <Panel title="Appearance">
        <div className="theme-fields">
          <label>
            Appearance
            <select
              value={state.theme.mode}
              onChange={(e) => set("mode", e.target.value)}
            >
              <option value="dark">Starlight</option>
              <option value="light">Daylight</option>
            </select>
          </label>
          <label>
            Accent color
            <input
              type="color"
              value={state.theme.accent}
              onChange={(e) => set("accent", e.target.value)}
            />
          </label>
          <label>
            Surface opacity · {Math.round(state.theme.opacity * 100)}%
            <input
              type="range"
              min="0.25"
              max="0.9"
              step="0.01"
              value={state.theme.opacity}
              onChange={(e) => set("opacity", +e.target.value)}
            />
          </label>
          <label>
            Glass blur · {state.theme.blur}px
            <input
              type="range"
              min="0"
              max="40"
              value={state.theme.blur}
              onChange={(e) => set("blur", +e.target.value)}
            />
          </label>
          <label>
            Corner radius · {state.theme.radius}px
            <input
              type="range"
              min="0"
              max="32"
              value={state.theme.radius}
              onChange={(e) => set("radius", +e.target.value)}
            />
          </label>
          <label className="toggle-field">
            <input
              type="checkbox"
              checked={state.theme.effects}
              onChange={(e) => set("effects", e.target.checked)}
            />
            LiquidGlass rendering
          </label>
        </div>
      </Panel>
      <Panel title="Backgrounds">
        <div className="wallpaper-choices">
          {(["light", "dark"] as const).map((mode) => (
            <button
              key={mode}
              className={state.theme.mode === mode ? "active" : ""}
              onClick={() => set("mode", mode)}
            >
              <img
                src={`./assets/${mode === "light" ? "daylight" : "starlight"}.svg`}
                alt=""
              />
              <strong>{mode === "light" ? "Daylight" : "Starlight"}</strong>
            </button>
          ))}
        </div>
        <p className="caption">
          Original SVG artwork included with this frontend.
        </p>
      </Panel>
    </div>
  );
}
