// Pagination bar: page-size selector + prev/next + page numbers

const PAGE_SIZES = [5, 10, 15, 25, 100];

export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pages = buildPageList(page, totalPages);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-white text-[12px]">
      {/* Left: rows per page */}
      <div className="flex items-center gap-2 text-gray-500">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          aria-label="Rows per page"
          className="border border-gray-200 rounded px-1 py-0.5 text-[12px] text-gray-700 focus:outline-none"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Centre: showing x-y of z */}
      <span className="text-gray-500">{from}–{to} of {total}</span>

      {/* Right: page nav */}
      <div className="flex items-center gap-1">
        <NavBtn
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </NavBtn>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-gray-400">…</span>
          ) : (
            <NavBtn
              key={p}
              onClick={() => onPageChange(p)}
              active={p === page}
              aria-label={`Page ${p}`}
            >
              {p}
            </NavBtn>
          )
        )}

        <NavBtn
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </NavBtn>
      </div>
    </div>
  );
}

function NavBtn({ onClick, disabled, active, children, 'aria-label': ariaLabel }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex items-center justify-center w-6 h-6 rounded text-[11px] font-medium transition-colors"
      style={{
        backgroundColor: active ? '#e32200' : 'transparent',
        color: active ? 'white' : disabled ? '#d1d5db' : '#374151',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}
