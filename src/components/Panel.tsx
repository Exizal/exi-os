import type { ReactNode } from "react";
export function Panel({
  title,
  children,
  className = "",
  action,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={`panel glass ${className}`}>
      <header className="panel-heading">
        <h2>{title}</h2>
        {action}
      </header>
      <div className="panel-body">{children}</div>
    </section>
  );
}
