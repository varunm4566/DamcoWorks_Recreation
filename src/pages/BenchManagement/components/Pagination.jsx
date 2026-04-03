// Pagination row — items-per-page select + page buttons.
// Spec: options 5/10/15/20/25(default)/100, pagination counter "1 to 25 of 210",
// active page button bg #373f50, border-radius 8px on all buttons.

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 100];

export function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange, onItemsPerPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Build visible page numbers: show up to 7 buttons with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  return (
    <div
      className="flex items-center justify-between px-4 py-3 bg-white border-t"
      style={{ borderColor: '#dee2e6' }}
    >
      {/* Items per page */}
      <div className="flex items-center gap-2">
        <span className="text-[13px]" style={{ color: '#595959' }}>Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            onItemsPerPageChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="text-[13px] border rounded px-2 py-1 bg-white cursor-pointer"
          style={{ borderColor: '#dee2e6', color: '#595959' }}
        >
          {PAGE_SIZE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Counter */}
      <span className="text-[13px]" style={{ color: '#6a7178' }}>
        {startItem} to {endItem} of {totalItems}
      </span>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 text-[13px] rounded-lg border bg-white disabled:opacity-40"
          style={{ borderColor: '#dee2e6', color: '#595959', borderRadius: 8 }}
        >
          &lt;
        </button>

        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-[13px]" style={{ color: '#595959' }}>…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className="w-8 h-8 text-[13px] rounded-lg border"
              style={{
                backgroundColor: currentPage === page ? '#373f50' : '#ffffff',
                color: currentPage === page ? '#ffffff' : '#595959',
                borderColor: '#dee2e6',
                borderRadius: 8,
              }}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-2 py-1 text-[13px] rounded-lg border bg-white disabled:opacity-40"
          style={{ borderColor: '#dee2e6', color: '#595959', borderRadius: 8 }}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
