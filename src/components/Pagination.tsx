import { ChevronLeft, ChevronRight } from "lucide-react";
export function Pagination({
  page,
  count,
  change,
  label,
}: {
  page: number;
  count: number;
  change: (page: number) => void;
  label: string;
}) {
  if (count <= 1) return null;
  return (
    <nav className="pagination" aria-label={`${label} pages`}>
      <button
        aria-label={`Previous ${label} page`}
        disabled={page === 0}
        onClick={() => change(page - 1)}
      >
        <ChevronLeft size={15} />
      </button>
      <span>
        {page + 1} / {count}
      </span>
      <button
        aria-label={`Next ${label} page`}
        disabled={page >= count - 1}
        onClick={() => change(page + 1)}
      >
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}
