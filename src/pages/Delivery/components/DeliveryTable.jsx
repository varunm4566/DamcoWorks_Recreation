import { useState, useRef, useEffect } from 'react';
import { useDeliveryStore } from '../../../stores/deliveryStore.js';

// Tab to open when each column type is clicked
const COL_TAB = {
  customer:    'customers',
  project:     'projects',
  engineering: 'engineering',
  collab:      'engineering',
};

const ROLE_TYPES = [
  'Program Manager',
  'Product Owner',
  'Delivery Manager',
  'Onsite Delivery Manager',
  'Product Development Manager',
  'Project Lead',
  'Functional Lead',
  'Technical Lead',
];

/**
 * Sort icon — ↕ unsorted, ↑ asc, ↓ desc
 */
function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) {
    return (
      <svg className="w-3 h-3 inline ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  return sortDir === 'asc'
    ? (
      <svg className="w-3 h-3 inline ml-1 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    )
    : (
      <svg className="w-3 h-3 inline ml-1 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
}

/**
 * Render a clickable count cell.
 * Non-zero → bold black + pointer; zero → muted; 'NA' → muted (not clickable).
 */
function CountCell({ value, personId, colType }) {
  const openPersonModal = useDeliveryStore((s) => s.openPersonModal);

  if (value === 'NA') {
    return <span className="text-[12px] text-text-muted font-normal">NA</span>;
  }
  const num = parseInt(value, 10);
  if (num === 0) {
    return <span className="text-[12px] text-text-muted font-normal">0</span>;
  }

  const tab = COL_TAB[colType] || 'customers';
  return (
    <span
      className="text-[12px] text-black font-semibold cursor-pointer hover:text-[#E32200] hover:underline transition-colors"
      onClick={() => openPersonModal(personId, tab)}
      title="Click to view details"
    >
      {num}
    </span>
  );
}

/**
 * Name/Role filter dropdown — two text inputs: People (name) + Role (text)
 */
function NameRoleFilterDropdown({ onClose, onApply }) {
  const [peopleSearch, setPeopleSearch] = useState('');
  const [roleSearch,   setRoleSearch]   = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  function handleApply() {
    // Role text wins for table filtering; pass both up so caller can use either
    onApply({ roleSearch: roleSearch.trim(), peopleSearch: peopleSearch.trim() });
    onClose();
  }

  function handleClear() {
    setPeopleSearch('');
    setRoleSearch('');
  }

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1 bg-white border border-border rounded shadow-lg z-50 w-60 p-3"
    >
      {/* People search */}
      <div className="mb-3">
        <label className="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-wide">
          People
        </label>
        <input
          type="text"
          value={peopleSearch}
          onChange={(e) => setPeopleSearch(e.target.value)}
          placeholder="Search by name…"
          className="w-full border border-border rounded px-2 py-1.5 text-[12px] text-black placeholder-gray-400 outline-none focus:border-[#4338CA]"
          autoFocus
        />
      </div>

      {/* Role search */}
      <div className="mb-3">
        <label className="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-wide">
          Role
        </label>
        <input
          type="text"
          value={roleSearch}
          onChange={(e) => setRoleSearch(e.target.value)}
          placeholder="Search by role…"
          className="w-full border border-border rounded px-2 py-1.5 text-[12px] text-black placeholder-gray-400 outline-none focus:border-[#4338CA]"
          onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="flex-1 bg-brand-red text-white text-[12px] rounded px-2 py-1 hover:bg-red-700 transition-colors"
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          className="flex-1 border border-border text-[12px] rounded px-2 py-1 hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onClose}
          className="flex-1 border border-border text-[12px] rounded px-2 py-1 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/**
 * Main Delivery Data Table with 3-level multi-header, sort, and role filter.
 */
export function DeliveryTable() {
  const tableData    = useDeliveryStore((s) => s.tableData);
  const tableLoading = useDeliveryStore((s) => s.tableLoading);
  const sortCol      = useDeliveryStore((s) => s.sortCol);
  const sortDir      = useDeliveryStore((s) => s.sortDir);
  const setSort      = useDeliveryStore((s) => s.setSort);
  const applyRoleFilter = useDeliveryStore((s) => s.applyRoleFilter);
  const clearFilters = useDeliveryStore((s) => s.clearFilters);

  const [showFunnel, setShowFunnel] = useState(false);

  function handleSort(col) {
    setSort(col);
  }

  function SortTh({ col, children, width = 'auto', className = '' }) {
    return (
      <th
        scope="col"
        onClick={() => handleSort(col)}
        className={`bg-[#F1F1F1] border border-border px-[10px] py-[10px] text-[13px] font-semibold text-black text-center cursor-pointer select-none whitespace-nowrap ${className}`}
        style={{ width }}
      >
        {children}
        <SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />
      </th>
    );
  }

  if (tableLoading) {
    return (
      <div className="flex flex-col gap-2 mt-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[44px] bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!tableData.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-border rounded">
        <span className="text-[14px] text-text-muted mb-3">No delivery personnel found.</span>
        <button
          onClick={clearFilters}
          className="bg-brand-red text-white text-[13px] rounded px-4 py-1.5 hover:bg-red-700 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="border border-border rounded bg-white">
      <table className="border-collapse text-left" style={{ borderCollapse: 'separate', borderSpacing: 0, width: 'max-content', minWidth: '100%' }}>
        <thead className="sticky top-0 z-30">
          {/* ─── Row 1: Group headers ─── */}
          <tr>
            {/* Name/Role — rowspan 3 */}
            <th
              rowSpan={3}
              className="bg-[#F1F1F1] border border-border px-[10px] py-[10px] text-[13px] font-semibold text-black align-middle"
              style={{ minWidth: 200, width: 200 }}
            >
              <div className="flex items-center gap-1">
                <span
                  onClick={() => handleSort('name')}
                  className="cursor-pointer select-none"
                >
                  Name / Role
                  <SortIcon col="name" sortCol={sortCol} sortDir={sortDir} />
                </span>
                {/* Funnel filter */}
                <div className="relative ml-1">
                  <button
                    onClick={() => setShowFunnel((v) => !v)}
                    className="text-text-muted hover:text-black"
                    aria-label="Filter by role"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                  </button>
                  {showFunnel && (
                    <NameRoleFilterDropdown
                      onClose={() => setShowFunnel(false)}
                      onApply={({ roleSearch, peopleSearch }) => applyRoleFilter(roleSearch || null, peopleSearch || null)}
                    />
                  )}
                </div>
              </div>
            </th>

            {/* Customer — rowspan 3 */}
            <th
              rowSpan={3}
              onClick={() => handleSort('customer_count')}
              className="bg-[#F1F1F1] border border-border px-[10px] py-[10px] text-[13px] font-semibold text-black text-center cursor-pointer select-none align-middle"
              style={{ width: 120 }}
            >
              Customer
              <SortIcon col="customer_count" sortCol={sortCol} sortDir={sortDir} />
            </th>

            {/* Active Project — rowspan 3 */}
            <th
              rowSpan={3}
              onClick={() => handleSort('active_project_count')}
              className="bg-[#F1F1F1] border border-border px-[10px] py-[10px] text-[13px] font-semibold text-black text-center cursor-pointer select-none align-middle"
              style={{ width: 110 }}
            >
              Active Project
              <SortIcon col="active_project_count" sortCol={sortCol} sortDir={sortDir} />
            </th>

            {/* Collaborating With — colspan 9 */}
            <th
              colSpan={9}
              className="bg-[#F1F1F1] border border-border px-[10px] py-[10px] text-[13px] font-semibold text-black text-center"
            >
              Collaborating With
            </th>

            {/* Engineering Team — colspan 2 */}
            <th
              colSpan={2}
              className="bg-[#F1F1F1] border border-border px-[10px] py-[10px] text-[13px] font-semibold text-black text-center"
            >
              Engineering Team
            </th>
          </tr>

          {/* ─── Row 2: Sub-group headers under Collaborating With ─── */}
          <tr>
            {/* Execution Leads: TL, FL, PL */}
            <th
              colSpan={3}
              className="bg-[#F1F1F1] border border-border px-[10px] py-[10px] text-[13px] font-semibold text-black text-center"
            >
              Execution Leads
            </th>
            {/* Delivery & Product Leadership: DM, Onsite DM, PDM, PFM, PgM, PO */}
            <th
              colSpan={6}
              className="bg-[#F1F1F1] border border-border px-[10px] py-[10px] text-[13px] font-semibold text-black text-center"
            >
              Delivery &amp; Product Leadership
            </th>
            {/* Engineering Team — by Head Count + by Allocation span rows 2 & 3 */}
            <th
              rowSpan={2}
              onClick={() => handleSort('head_count')}
              className="bg-[#F1F1F1] border border-border px-[10px] py-[10px] text-[13px] font-semibold text-black text-center cursor-pointer select-none align-middle"
              style={{ width: 100 }}
            >
              by Head Count
              <SortIcon col="head_count" sortCol={sortCol} sortDir={sortDir} />
            </th>
            <th
              rowSpan={2}
              onClick={() => handleSort('allocation')}
              className="bg-[#F1F1F1] border border-border px-[10px] py-[10px] text-[13px] font-semibold text-black text-center cursor-pointer select-none align-middle"
              style={{ width: 100 }}
            >
              by Allocation
              <SortIcon col="allocation" sortCol={sortCol} sortDir={sortDir} />
            </th>
          </tr>

          {/* ─── Row 3: Individual columns under Execution Leads & Leadership ─── */}
          <tr>
            <SortTh col="tl"        width={60}>TL</SortTh>
            <SortTh col="fl"        width={60}>FL</SortTh>
            <SortTh col="pl"        width={60}>PL</SortTh>
            <SortTh col="dm"        width={60}>DM</SortTh>
            <SortTh col="onsite_dm" width={80}>Onsite DM</SortTh>
            <SortTh col="pdm"       width={60}>PDM</SortTh>
            <SortTh col="pfm"       width={60}>PFM</SortTh>
            <SortTh col="pgm"       width={60}>PgM</SortTh>
            <SortTh col="po"        width={60}>PO</SortTh>
          </tr>
        </thead>

        <tbody>
          {tableData.map((person, idx) => {
            const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-row-even';
            const cw = person.collaboratingWith;
            return (
              <tr key={person.id} className={`${rowBg} hover:bg-[#F5F5F5] transition-colors`}>
                {/* Name / Role */}
                <td className={`border border-border px-[12px] py-[10px] ${rowBg}`} style={{ minWidth: 200 }}>
                  <div className="text-[13px] font-semibold text-black">{person.name}</div>
                  <div className="text-[12px] text-text-muted">{person.role}</div>
                </td>
                {/* Customer */}
                <td className="border border-border px-[10px] py-[10px] text-center">
                  <CountCell value={person.customerCount} personId={person.id} colType="customer" />
                </td>
                {/* Active Project */}
                <td className="border border-border px-[10px] py-[10px] text-center">
                  <CountCell value={person.activeProjectCount} personId={person.id} colType="project" />
                </td>
                {/* Collaborating With */}
                <td className="border border-border px-[10px] py-[10px] text-center"><CountCell value={cw.tl}       personId={person.id} colType="collab" /></td>
                <td className="border border-border px-[10px] py-[10px] text-center"><CountCell value={cw.fl}       personId={person.id} colType="collab" /></td>
                <td className="border border-border px-[10px] py-[10px] text-center"><CountCell value={cw.pl}       personId={person.id} colType="collab" /></td>
                <td className="border border-border px-[10px] py-[10px] text-center"><CountCell value={cw.dm}       personId={person.id} colType="collab" /></td>
                <td className="border border-border px-[10px] py-[10px] text-center"><CountCell value={cw.onsiteDm} personId={person.id} colType="collab" /></td>
                <td className="border border-border px-[10px] py-[10px] text-center"><CountCell value={cw.pdm}      personId={person.id} colType="collab" /></td>
                <td className="border border-border px-[10px] py-[10px] text-center"><CountCell value={cw.pfm}      personId={person.id} colType="collab" /></td>
                <td className="border border-border px-[10px] py-[10px] text-center"><CountCell value={cw.pgm}      personId={person.id} colType="collab" /></td>
                <td className="border border-border px-[10px] py-[10px] text-center"><CountCell value={cw.po}       personId={person.id} colType="collab" /></td>
                {/* Engineering Team */}
                <td className="border border-border px-[10px] py-[10px] text-center">
                  <CountCell value={person.engineeringTeam.headCount} personId={person.id} colType="engineering" />
                </td>
                <td className="border border-border px-[10px] py-[10px] text-center">
                  <span
                    className="text-[12px] text-black font-normal cursor-pointer hover:text-[#E32200] hover:underline transition-colors"
                    onClick={() => useDeliveryStore.getState().openPersonModal(person.id, 'engineering')}
                    title="Click to view engineering team"
                  >
                    {person.engineeringTeam.allocation.toFixed(2)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
