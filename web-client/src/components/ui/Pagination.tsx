interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({
  page,
  pageSize,
  total,
  onChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];

    pages.push(1);

    if (page > 3) {
      pages.push("…");
    }

    for (let p = page - 1; p <= page + 1; p++) {
      if (p > 1 && p < totalPages) {
        pages.push(p);
      }
    }

    if (page < totalPages - 2) {
      pages.push("…");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-center gap-3 mt-10 text-sm">
      {/* Précédent */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="
            px-4 py-2 rounded-full border border-border 
            disabled:opacity-40 hover:bg-muted transition
          "
      >
        ◀︎
      </button>

      {/* Numéros */}
      {pages.map((p, index) =>
        p === "…" ? (
          <span key={index} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onChange(p as number)}
            className={`
                w-9 h-9 flex items-center justify-center rounded-full transition font-medium
                ${
                  p === page
                    ? "bg-green-600 text-primary-foreground shadow-md"
                    : "border border-border hover:bg-muted text-foreground"
                }
              `}
          >
            {p}
          </button>
        ),
      )}

      {/* Suivant */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="
            px-4 py-2 rounded-full border border-border 
            disabled:opacity-40 hover:bg-muted transition
          "
      >
        ▶︎
      </button>
    </div>
  );
}
