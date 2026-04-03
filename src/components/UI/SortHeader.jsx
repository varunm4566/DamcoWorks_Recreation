import { useState } from 'react';
import { Tooltip } from './Tooltip.jsx';
import { FilterPopup } from './FilterPopup.jsx';

/**
 * Table column header - 14px, #000, font-weight 600
 * Sort arrows, filter funnel, optional info icon and sub-label
 */
export function SortHeader({
  label,
  subLabel,
  sortKey,
  currentSort,
  currentDir,
  onSort,
  filterable = false,
  filterType = 'text',
  onFilter,
  activeFilter,
  tooltip,
}) {
  const [showFilter, setShowFilter] = useState(false);

  const isSorted = sortKey && currentSort === sortKey;
  const sortable = !!sortKey && !!onSort;

  const handleSort = () => {
    if (sortable) onSort(sortKey);
  };

  const handleFilterApply = (value) => {
    if (onFilter) onFilter(sortKey, value);
    setShowFilter(false);
  };

  return (
    <th className="px-4 py-1 text-left text-[14px] font-semibold text-black bg-table-header whitespace-nowrap border-b border-border relative">
      <div className="flex items-center gap-1">
        <button
          onClick={handleSort}
          disabled={!sortable}
          className={`flex items-center gap-1 ${sortable ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <div>
            <span>{label}</span>
            {subLabel && <div className="text-[11px] font-normal text-text-muted">{subLabel}</div>}
          </div>
          {sortable && (
            <span className="flex flex-col text-[9px] leading-none text-gray-400 ml-0.5">
              <span className={isSorted && currentDir === 'asc' ? 'text-brand-red' : ''}>&#9650;</span>
              <span className={isSorted && currentDir === 'desc' ? 'text-brand-red' : ''}>&#9660;</span>
            </span>
          )}
        </button>

        {tooltip && (
          <Tooltip text={tooltip}>
            <span className="text-text-muted cursor-help text-[12px] ml-0.5">&#9432;</span>
          </Tooltip>
        )}

        {filterable && (
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`ml-1 p-0.5 rounded hover:bg-gray-200 ${activeFilter ? 'text-brand-red' : 'text-gray-400'}`}
            aria-label={`Filter ${label}`}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {showFilter && (
        <FilterPopup type={filterType} columnName={label} onApply={handleFilterApply} onCancel={() => setShowFilter(false)} />
      )}
    </th>
  );
}
