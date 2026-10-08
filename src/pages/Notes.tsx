import { useState } from "react";
import { Plus } from "lucide-react";
import { Panel } from "../components/Panel";
import { Pagination } from "../components/Pagination";
import type { Workspace } from "../state";
export function Notes({
  state,
  update,
}: {
  state: Workspace;
  update: (fn: (s: Workspace) => Workspace) => void;
}) {
  const [selected, setSelected] = useState(state.notes[0]?.id || "");
  const [page, setPage] = useState(0);
  const count = Math.ceil(state.notes.length / 6);
  const visiblePage = Math.min(page, count - 1);
  const note = state.notes.find((n) => n.id === selected) || state.notes[0];
  function add() {
    const id = crypto.randomUUID();
    update((s) => ({
      ...s,
      notes: [...s.notes, { id, title: "Untitled note", body: "" }],
    }));
    setSelected(id);
    setPage(Math.floor(state.notes.length / 6));
  }
  return (
    <div className="notes-page">
      <Panel
        title="Notes"
        action={
          <button
            className="icon-button"
            aria-label="New note"
            onClick={add}
            disabled={state.notes.length >= 100}
          >
            <Plus size={18} />
          </button>
        }
      >
        <div className="note-picker">
          {state.notes.slice(visiblePage * 6, visiblePage * 6 + 6).map((n) => (
            <button
              key={n.id}
              className={note?.id === n.id ? "active" : ""}
              onClick={() => setSelected(n.id)}
            >
              {n.title || "Untitled note"}
            </button>
          ))}
        </div>
        <Pagination
          page={visiblePage}
          count={count}
          change={setPage}
          label="notes"
        />
      </Panel>
      <Panel title="Editor">
        <div className="note-editor">
          <input
            aria-label="Note title"
            value={note.title}
            maxLength={100}
            onChange={(e) =>
              update((s) => ({
                ...s,
                notes: s.notes.map((n) =>
                  n.id === note.id ? { ...n, title: e.target.value } : n,
                ),
              }))
            }
          />
          <textarea
            aria-label="Note body"
            value={note.body}
            maxLength={20000}
            onChange={(e) =>
              update((s) => ({
                ...s,
                notes: s.notes.map((n) =>
                  n.id === note.id ? { ...n, body: e.target.value } : n,
                ),
              }))
            }
          />
          <span className="editor-caption">Changes stay in this browser.</span>
        </div>
      </Panel>
    </div>
  );
}
