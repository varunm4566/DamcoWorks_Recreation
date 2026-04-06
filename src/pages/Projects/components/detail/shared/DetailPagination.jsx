/**
 * Compact pagination for the project detail panel sub-tables
 */
export function DetailPagination({ page, pageSize, totalCount, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex items-center justify-between mt-3 text-[12px] text-text-muted">
      <span>
        Items per page: <strong>{pageSize}</strong> &nbsp;|&nbsp; {from} to {to} of {totalCount} items
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="w-6 h-6 flex items-center justify-center rounded border border-border bg-white disabled:opacity-30 hover:bg-gray-50 text-[11px]"
        >
          &#171;
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-6 h-6 flex items-center justify-center rounded border border-border bg-white disabled:opacity-30 hover:bg-gray-50 text-[11px]"
        >
          &#8249;
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-6 h-6 flex items-center justify-center rounded border text-[11px] ${
                p === page
                  ? 'bg-indigo-tab text-white border-indigo-tab font-bold'
                  : 'border-border bg-white hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          );
        })}
        {totalPages > 5 && (
          <>
            <span className="text-[11px]">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className={`w-6 h-6 flex items-center justify-center rounded border text-[11px] ${
                page === totalPages
                  ? 'bg-indigo-tab text-white border-indigo-tab font-bold'
                  : 'border-border bg-white hover:bg-gray-50'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-6 h-6 flex items-center justify-center rounded border border-border bg-white disabled:opacity-30 hover:bg-gray-50 text-[11px]"
        >
          &#8250;
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className="w-6 h-6 flex items-center justify-center rounded border border-border bg-white disabled:opacity-30 hover:bg-gray-50 text-[11px]"
        >
          &#187;
        </button>
      </div>
    </div>
  );
}
