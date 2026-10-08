export type Page = "Home" | "Projects" | "Notes" | "Themes";
export type Task = {
  id: string;
  title: string;
  done: boolean;
  project: string;
};
export type Note = { id: string; title: string; body: string };
export type Theme = {
  mode: "light" | "dark";
  accent: string;
  opacity: number;
  blur: number;
  radius: number;
  effects: boolean;
};
export type Workspace = { tasks: Task[]; notes: Note[]; theme: Theme };
export const projects = [
  {
    id: "atlas",
    name: "Atlas Journal",
    category: "Design system",
    description: "A sample project for a travel journal interface.",
    milestones: [
      "Define visual language",
      "Map the reading experience",
      "Build responsive components",
    ],
  },
  {
    id: "observatory",
    name: "Observatory",
    category: "Research",
    description: "A sample workspace for collecting astronomy references.",
    milestones: [
      "Organize references",
      "Create a reading list",
      "Sketch an observation log",
    ],
  },
];
const initial: Workspace = {
  tasks: [
    {
      id: "t1",
      title: "Review the project palette",
      done: false,
      project: "atlas",
    },
    {
      id: "t2",
      title: "Draft the reading layout",
      done: false,
      project: "atlas",
    },
    {
      id: "t3",
      title: "Organize research notes",
      done: true,
      project: "observatory",
    },
    {
      id: "t4",
      title: "Check keyboard navigation",
      done: false,
      project: "atlas",
    },
  ],
  notes: [
    {
      id: "n1",
      title: "Interface notes",
      body: "Keep important controls visible. Use a clear focus state and consistent spacing.\n\nThis is fictional showcase content, editable in this browser.",
    },
    {
      id: "n2",
      title: "Reading workspace",
      body: "Group references by topic. Keep a short summary next to each source.",
    },
    {
      id: "n3",
      title: "Project ideas",
      body: "Explore a split view for a document and its notes. Test the layout at smaller window sizes.",
    },
  ],
  theme: {
    mode: "dark",
    accent: "#77c8ff",
    opacity: 0.56,
    blur: 18,
    radius: 22,
    effects: true,
  },
};
const storageKey = "exi-frontend-showcase-v1";
export function loadWorkspace(): Workspace {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(storageKey) || "null",
    );
    if (!value || typeof value !== "object") return structuredClone(initial);
    const s = value as Workspace;
    if (
      !Array.isArray(s.tasks) ||
      s.tasks.length > 100 ||
      !s.tasks.every(
        (t) =>
          typeof t.id === "string" &&
          typeof t.title === "string" &&
          t.title.length <= 200 &&
          typeof t.done === "boolean" &&
          typeof t.project === "string",
      )
    )
      throw Error();
    if (
      !Array.isArray(s.notes) ||
      s.notes.length < 1 ||
      s.notes.length > 100 ||
      !s.notes.every(
        (n) =>
          typeof n.id === "string" &&
          typeof n.title === "string" &&
          typeof n.body === "string" &&
          n.body.length <= 20000,
      )
    )
      throw Error();
    const t = s.theme;
    if (
      !t ||
      !["light", "dark"].includes(t.mode) ||
      !/^#[0-9a-f]{6}$/i.test(t.accent) ||
      typeof t.effects !== "boolean" ||
      !Number.isFinite(t.opacity) ||
      t.opacity < 0.25 ||
      t.opacity > 0.9 ||
      !Number.isFinite(t.blur) ||
      t.blur < 0 ||
      t.blur > 40 ||
      !Number.isFinite(t.radius) ||
      t.radius < 0 ||
      t.radius > 32
    )
      throw Error();
    return s;
  } catch {
    return structuredClone(initial);
  }
}
export function saveWorkspace(state: Workspace) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}
export function resetWorkspace(): Workspace {
  localStorage.removeItem(storageKey);
  return structuredClone(initial);
}
