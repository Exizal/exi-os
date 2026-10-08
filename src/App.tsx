import { useEffect, useState, type CSSProperties } from "react";
import { Sun, Moon, RotateCcw, Github } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { GlassBackdrop } from "./GlassBackdrop";
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { Notes } from "./pages/Notes";
import { ThemeStudio } from "./pages/ThemeStudio";
import {
  loadWorkspace,
  resetWorkspace,
  saveWorkspace,
  type Page,
  type Workspace,
} from "./state";
export function App() {
  const [state, setState] = useState(loadWorkspace);
  const [page, setPage] = useState<Page>("Home");
  const [storageError, setStorageError] = useState("");
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    try {
      saveWorkspace(state);
      setStorageError("");
    } catch {
      setStorageError(
        "Browser storage is unavailable. Changes last for this session only.",
      );
    }
  }, [state]);
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  const update = (fn: (s: Workspace) => Workspace) => setState(fn);
  const dark = state.theme.mode === "dark";
  const wallpaper = `./assets/${dark ? "starlight" : "daylight"}.svg`;
  const properties = {
    "--accent": state.theme.accent,
    "--opacity": state.theme.opacity,
    "--radius": `${state.theme.radius}px`,
    "--blur": `${state.theme.blur}px`,
    backgroundImage: `url("${wallpaper}")`,
  } as CSSProperties;
  return (
    <div className={`app ${dark ? "dark" : "light"}`} style={properties}>
      <GlassBackdrop
        wallpaper={wallpaper}
        fit="cover"
        position={50}
        dark={dark}
        enabled={state.theme.effects}
        radius={state.theme.radius}
        blur={state.theme.blur}
        highlights={0.6}
        shadows={0.5}
        revision={page}
      />
      <Sidebar page={page} navigate={setPage} />
      <main className="main">
        <header className="page-header">
          <div>
            <div className="eyebrow">Frontend showcase</div>
            <h1>{page === "Themes" ? "Theme Studio" : page}</h1>
          </div>
          <div className="clock">
            <span>
              {now.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <strong>
              {now.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>
          </div>
        </header>
        <div className="toolbar">
          <div className="section-links">
            {(["Home", "Projects", "Notes", "Themes"] as Page[]).map((p) => (
              <button
                key={p}
                className={p === page ? "active" : ""}
                onClick={() => setPage(p)}
              >
                {p === "Home" ? "Overview" : p}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              update((s) => ({
                ...s,
                theme: { ...s.theme, mode: dark ? "light" : "dark" },
              }))
            }
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}{" "}
            {dark ? "Daylight" : "Starlight"}
          </button>
          <button
            aria-label="Reset showcase data"
            title="Reset showcase data"
            onClick={() => setState(resetWorkspace())}
          >
            <RotateCcw size={16} />
          </button>
        </div>
        <div className="page-content" key={page}>
          {page === "Home" ? (
            <Home state={state} update={update} navigate={setPage} />
          ) : page === "Projects" ? (
            <Projects state={state} />
          ) : page === "Notes" ? (
            <Notes state={state} update={update} />
          ) : (
            <ThemeStudio state={state} update={update} />
          )}
        </div>
        <footer>
          <span>
            {storageError || "Sample content · Changes stay in this browser"}
          </span>
          <a
            href="https://github.com/Exizal/exi-os"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={15} />
            View source
          </a>
        </footer>
      </main>
    </div>
  );
}
