import { Home, FolderKanban, StickyNote, Palette, Music2 } from "lucide-react";
import type { Page } from "../state";
const items = [
  ["Home", Home],
  ["Projects", FolderKanban],
  ["Notes", StickyNote],
  ["Themes", Palette],
] as const;
export function Sidebar({
  page,
  navigate,
}: {
  page: Page;
  navigate: (page: Page) => void;
}) {
  return (
    <aside className="sidebar glass">
      <div className="brand">
        <img src="./assets/exi.svg" alt="" />
        <strong>EXI OS</strong>
      </div>
      <nav aria-label="Main navigation">
        {items.map(([name, Icon]) => (
          <button
            key={name}
            className={page === name ? "active" : ""}
            aria-current={page === name ? "page" : undefined}
            onClick={() => navigate(name)}
          >
            <Icon size={21} />
            <span>{name}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="desktop-feature">
          <Music2 size={22} />
          <strong>Spotify sidebar</strong>
          <p>
            The genuine website player belongs to the Windows app. This showcase
            does not simulate playback.
          </p>
        </div>
        <div className="profile">
          <span className="avatar">G</span>
          <div>
            <strong>Guest workspace</strong>
            <small>Fictional sample content</small>
          </div>
        </div>
      </div>
    </aside>
  );
}
