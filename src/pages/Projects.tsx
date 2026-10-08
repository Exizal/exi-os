import { useState } from "react";
import { FolderKanban, ArrowRight } from "lucide-react";
import { Panel } from "../components/Panel";
import { projects, type Workspace } from "../state";
export function Projects({ state }: { state: Workspace }) {
  const [selected, setSelected] = useState(projects[0].id);
  const project = projects.find((p) => p.id === selected)!;
  return (
    <div className="projects-page">
      <div className="project-tabs">
        {projects.map((p) => (
          <button
            className={selected === p.id ? "active" : ""}
            key={p.id}
            onClick={() => setSelected(p.id)}
          >
            <FolderKanban size={17} />
            {p.name}
          </button>
        ))}
      </div>
      <section className="project-hero glass">
        <div className="eyebrow">{project.category} · Sample project</div>
        <h2>{project.name}</h2>
        <p>{project.description}</p>
      </section>
      <div className="project-columns">
        <Panel title="Milestones">
          <ol className="milestones">
            {project.milestones.map((m, i) => (
              <li key={m}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{m}</strong>
                <ArrowRight size={16} />
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="Related tasks">
          <div className="related-tasks">
            {state.tasks
              .filter((t) => t.project === selected)
              .map((t) => (
                <div key={t.id}>
                  <span className={t.done ? "status-dot done" : "status-dot"} />
                  {t.title}
                  <small>{t.done ? "Done" : "Open"}</small>
                </div>
              ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
