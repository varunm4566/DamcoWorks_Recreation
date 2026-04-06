import { FilterDropdown } from './FilterDropdown';

// Generic sortable + filterable table shell.
//
// Props:
//   columns   — Array<{ key, header, sortable?, filterable?, filterOptions?, render?, width? }>
//   rows      — Array<object>  (already-sliced for current page)
//   sort      — { column, direction }
//   filters   — { [key]: value }
//   onSort    — fn(columnKey)
//   onFilter  — fn(columnKey, value)
//   onClear   — fn(columnKey)
//   loading   — bool
//   emptyMsg  — string

export function DataTable({
  columns = [],
  rows = [],
  sort = {},
  filters = {},
  onSort,
  onFilter,
  onClear,
  loading = false,
  emptyMsg = 'No data found.',
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-[12px] border-collapse min-w-max">
        <thead>
          <tr className="bg-[#f8f9fa] border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap select-none"
                style={{ width: col.width }}
              >
                <div className="flex items-center gap-0.5">
                  {/* Sort button */}
                  {col.sortable ? (
                    <button
                      aria-label={`Sort by ${col.header}`}
                      onClick={() => onSort && onSort(col.key)}
                      className="flex items-center gap-0.5 hover:text-gray-900 transition-colors"
                    >
                      {col.header}
                      <SortIcon active={sort.column === col.key} direction={sort.direction} />
                    </button>
                  ) : (
                    <span>{col.header}</span>
                  )}

                  {/* Info icon (static) */}
                  {col.info && (
                    <button aria-label="Column info" className="text-gray-400 hover:text-gray-600 ml-0.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                      </svg>
                    </button>
                  )}

                  {/* Filter button */}
                  {col.filterable && (
                    <FilterDropdown
                      options={col.filterOptions || []}
                      value={filters[col.key] || ''}
                      onApply={(val) => onFilter && onFilter(col.key, val)}
                      onClear={() => onClear && onClear(col.key)}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Loading…
                </div>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-gray-400">
                {emptyMsg}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIdx) => (
              <tr
                key={row.id ?? rowIdx}
                className="border-b border-gray-100 hover:bg-[#fafafa] transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-2 align-top">
                    {col.render ? col.render(row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon({ active, direction }) {
  return (
    <span className="flex flex-col ml-0.5" style={{ gap: 1 }}>
      <svg
        className="w-2 h-2"
        viewBox="0 0 8 5"
        fill={active && direction === 'asc' ? '#e32200' : '#d1d5db'}
      >
        <path d="M4 0L8 5H0z" />
      </svg>
      <svg
        className="w-2 h-2"
        viewBox="0 0 8 5"
        fill={active && direction === 'desc' ? '#e32200' : '#d1d5db'}
      >
        <path d="M4 5L0 0h8z" />
      </svg>
    </span>
  );
}
