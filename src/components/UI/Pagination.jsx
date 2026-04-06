/**
 * Generate page numbers with ellipsis
 */
function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = [1];
  if (currentPage > 3) pages.push('...');
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (currentPage < totalPages - 2) pages.push('...');
  pages.push(totalPages);
  return pages;
}

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 100];

/**
 * Pagination bar matching spec: red active page, 13px text, #595959 text
 */
export function Pagination({ page, pageSize, totalItems, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-between py-1.5 text-[12px] text-text-muted mt-1">
      {/* Items per page */}
      <div className="flex items-center gap-2">
        <span>Items per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
          className="border border-border-light rounded px-1.5 py-0.5 text-[12px] bg-white focus:outline-none"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      {/* Record counter */}
      <span>{startItem} to {endItem} of {totalItems} items</span>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-1.5 py-0.5 rounded border border-border-light bg-white text-text-muted hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          &#8249;
        </button>

        {pageNumbers.map((num, idx) =>
          num === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 py-1 text-text-muted">...</span>
          ) : (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`px-2 py-0.5 rounded text-[12px] border ${
                num === page
                  ? 'bg-brand-red text-white border-brand-red'
                  : 'bg-white text-text-muted border-border-light hover:bg-gray-50'
              }`}
            >
              {num}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-1.5 py-0.5 rounded border border-border-light bg-white text-text-muted hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}
