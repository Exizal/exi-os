import { useState } from "react";
import { ArrowRight, Plus, Check, BookOpen } from "lucide-react";
import { Panel } from "../components/Panel";
import { Pagination } from "../components/Pagination";
import { projects, type Page, type Workspace } from "../state";
export function Home({
  state,
  update,
  navigate,
}: {
  state: Workspace;
  update: (fn: (s: Workspace) => Workspace) => void;
  navigate: (page: Page) => void;
}) {
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [taskPage, setTaskPage] = useState(0);
  const taskPages = Math.ceil(state.tasks.length / 3);
  const visiblePage = Math.min(taskPage, Math.max(0, taskPages - 1));
  const active = state.tasks.filter((t) => !t.done).length;
  function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    update((s) => ({
      ...s,
      tasks: [
        ...s.tasks,
        {
          id: crypto.randomUUID(),
          title: title.trim().slice(0, 200),
          done: false,
          project: "atlas",
        },
      ],
    }));
    setTitle("");
    setAdding(false);
    setTaskPage(Math.floor(state.tasks.length / 3));
  }
  return (
    <div className="home-grid">
      <section className="feature glass">
        <div className="eyebrow">
          <BookOpen size={16} />
          Sample workspace
        </div>
        <h2>A space for your projects.</h2>
        <p>Tasks, notes and references, together in one compact view.</p>
        <button className="primary" onClick={() => navigate("Projects")}>
          Explore projects <ArrowRight size={17} />
        </button>
        <div className="feature-summary">
          <span>
            <strong>{projects.length}</strong>Projects
          </span>
          <span>
            <strong>{active}</strong>Open tasks
          </span>
          <span>
            <strong>{state.notes.length}</strong>Notes
          </span>
        </div>
      </section>
      <Panel
        title="Tasks"
        action={
          <button
            className="icon-button"
            aria-label="Add task"
            disabled={state.tasks.length >= 100}
            onClick={() => setAdding(!adding)}
          >
            <Plus size={18} />
          </button>
        }
      >
        {adding && (
          <form className="inline-form" onSubmit={addTask}>
            <input
              autoFocus
              aria-label="Task title"
              placeholder="Task title"
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        )}
        <div className="task-list">
          {state.tasks.slice(visiblePage * 3, visiblePage * 3 + 3).map((t) => (
            <label key={t.id} className={`task ${t.done ? "done" : ""}`}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() =>
                  update((s) => ({
                    ...s,
                    tasks: s.tasks.map((item) =>
                      item.id === t.id ? { ...item, done: !item.done } : item,
                    ),
                  }))
                }
              />
              <span className="checkmark">{t.done && <Check size={13} />}</span>
              <span>{t.title}</span>
            </label>
          ))}
        </div>
        <Pagination
          page={visiblePage}
          count={taskPages}
          change={setTaskPage}
          label="tasks"
        />
      </Panel>
      <Panel
        title="Recent notes"
        action={
          <button onClick={() => navigate("Notes")}>
            View all <ArrowRight size={14} />
          </button>
        }
      >
        <div className="note-list">
          {state.notes.slice(0, 2).map((n) => (
            <button key={n.id} onClick={() => navigate("Notes")}>
              <span>
                <strong>{n.title}</strong>
                <small>{n.body.split("\n")[0]}</small>
              </span>
              <ArrowRight size={15} />
            </button>
          ))}
        </div>
      </Panel>
      <Panel title="Projects">
        <div className="project-shortcuts">
          {projects.map((p) => (
            <button key={p.id} onClick={() => navigate("Projects")}>
              <span className="project-mark">{p.name[0]}</span>
              <span>
                <strong>{p.name}</strong>
                <small>{p.category}</small>
              </span>
              <ArrowRight size={16} />
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
