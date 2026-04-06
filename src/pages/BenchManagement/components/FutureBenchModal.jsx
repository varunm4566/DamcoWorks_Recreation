import { useState, useMemo, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx-js-style';

// ─── Column definitions ───────────────────────────────────────────────────────
const COLUMNS = [
  { key: 'nameCode',        label: 'People Name & Code' },
  { key: 'skill',           label: 'Skill' },
  { key: 'designation',     label: 'Designation' },
  { key: 'currentProject',  label: 'Current Project' },
  { key: 'deliveryManager', label: 'Delivery Manager' },
  { key: 'engagementModel', label: 'Engagement Model' },
  { key: 'projectRole',     label: 'Project Role' },
  { key: 'billed',          label: 'Billed' },
  { key: 'rollOffDate',     label: 'Roll-off Date' },
];

// ─── Sort icon ────────────────────────────────────────────────────────────────
function SortIcon({ col, sortCol, sortDir }) {
  const active = sortCol === col;
  return (
    <span className="inline-flex flex-col ml-1 align-middle" style={{ lineHeight: 0 }}>
      <svg
        className="w-2.5 h-2.5"
        viewBox="0 0 10 10"
        fill={active && sortDir === 'asc' ? '#4338ca' : '#aaa'}
      >
        <polygon points="5,1 9,7 1,7" />
      </svg>
      <svg
        className="w-2.5 h-2.5 mt-0.5"
        viewBox="0 0 10 10"
        fill={active && sortDir === 'desc' ? '#4338ca' : '#aaa'}
      >
        <polygon points="5,9 1,3 9,3" />
      </svg>
    </span>
  );
}

// ─── Inline column filter panel (type-aware) ─────────────────────────────────
function ColFilterPanel({ colKey, value, onApply, onClose, allData }) {
  const ref = useRef(null);

  // For people filter: decode stored value
  const decodedSub  = value?.startsWith('empCode|') ? 'empCode' : 'people';
  const decodedText = value ? value.replace(/^(people|empCode)\|/, '') : '';

  const [subType,   setSubType]   = useState(decodedSub);
  const [textVal,   setTextVal]   = useState(decodedText);
  const [skillSearch, setSkillSearch] = useState('');

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // ── People filter ──────────────────────────────────────────────────────────
  if (colKey === 'nameCode') {
    return (
      <div ref={ref} className="absolute top-full left-0 z-50 bg-white border shadow flex flex-col"
        style={{ borderColor: '#dee2e6', minWidth: 180, borderRadius: 4 }}>
        <select
          value={subType}
          onChange={(e) => setSubType(e.target.value)}
          className="border-b px-3 py-2 text-[13px] bg-white cursor-pointer"
          style={{ borderColor: '#dee2e6' }}
        >
          <option value="people">People</option>
          <option value="empCode">Emp Code</option>
        </select>
        <input
          autoFocus
          type="text"
          value={textVal}
          onChange={(e) => setTextVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onApply(colKey, textVal ? `${subType}|${textVal}` : ''); if (e.key === 'Escape') onClose(); }}
          className="border-b px-3 py-2 text-[12px]"
          style={{ borderColor: '#dee2e6' }}
          placeholder={subType === 'empCode' ? 'Enter emp code...' : 'Enter name...'}
        />
        <div className="flex gap-1.5 justify-end p-2">
          <button onClick={onClose} className="px-3 py-1 text-[12px] bg-white border" style={{ borderColor: '#dee2e6', borderRadius: 4 }}>Cancel</button>
          <button onClick={() => onApply(colKey, textVal ? `${subType}|${textVal}` : '')} className="px-3 py-1 text-[12px] text-white" style={{ backgroundColor: '#e32200', borderRadius: 4 }}>Apply</button>
        </div>
      </div>
    );
  }

  // ── Billed filter ──────────────────────────────────────────────────────────
  if (colKey === 'billed') {
    return (
      <div ref={ref} className="absolute top-full left-0 z-50 bg-white border shadow flex flex-col"
        style={{ borderColor: '#dee2e6', minWidth: 120, borderRadius: 4 }}>
        {['Yes', 'No'].map((opt) => (
          <button
            key={opt}
            onClick={() => { onApply(colKey, opt); }}
            className="px-3 py-2 text-[13px] text-left hover:bg-gray-50"
            style={{ color: value === opt ? '#e32200' : '#111', fontWeight: value === opt ? 600 : 400 }}
          >{opt}</button>
        ))}
        {value && (
          <button onClick={() => onApply(colKey, '')} className="px-3 py-1.5 text-[11px] border-t text-left hover:bg-gray-50" style={{ color: '#888', borderColor: '#dee2e6' }}>Clear</button>
        )}
      </div>
    );
  }

  // ── Engagement Model filter ────────────────────────────────────────────────
  if (colKey === 'engagementModel') {
    return (
      <div ref={ref} className="absolute top-full left-0 z-50 bg-white border shadow flex flex-col"
        style={{ borderColor: '#dee2e6', minWidth: 100, borderRadius: 4 }}>
        {['FP', 'T&M', 'BYT'].map((opt) => (
          <button
            key={opt}
            onClick={() => onApply(colKey, opt)}
            className="px-3 py-2 text-[13px] text-left hover:bg-gray-50"
            style={{ color: value === opt ? '#e32200' : '#111', fontWeight: value === opt ? 600 : 400 }}
          >{opt}</button>
        ))}
        {value && (
          <button onClick={() => onApply(colKey, '')} className="px-3 py-1.5 text-[11px] border-t text-left hover:bg-gray-50" style={{ color: '#888', borderColor: '#dee2e6' }}>Clear</button>
        )}
      </div>
    );
  }

  // ── Skill filter (searchable select dropdown) ─────────────────────────────
  if (colKey === 'skill') {
    const uniqueSkills = [...new Set((allData || []).map((r) => r.skill).filter(Boolean))].sort();
    return (
      <div ref={ref} className="absolute top-full left-0 z-50 bg-white p-2 flex flex-col gap-1.5"
        style={{ minWidth: 220, borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid #e0e0e0' }}>
        <select
          autoFocus
          size={1}
          value={value || ''}
          onChange={(e) => onApply(colKey, e.target.value)}
          className="w-full border px-2 py-1.5 text-[13px] bg-white cursor-pointer"
          style={{ borderColor: '#dee2e6', borderRadius: 4 }}
        >
          <option value="">-- Select Skill --</option>
          {uniqueSkills.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {value && (
          <button onClick={() => onApply(colKey, '')} className="text-[11px] text-left hover:underline" style={{ color: '#888' }}>Clear</button>
        )}
      </div>
    );
  }

  // ── Default: text input ────────────────────────────────────────────────────
  const [local, setLocal] = useState(value || '');
  return (
    <div ref={ref} className="absolute top-full left-0 z-50 bg-white border shadow p-2 flex flex-col gap-1.5"
      style={{ borderColor: '#dee2e6', minWidth: 160, borderRadius: 4 }}>
      <input
        autoFocus type="text" value={local}
        onChange={(e) => setLocal(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') onApply(colKey, local); if (e.key === 'Escape') onClose(); }}
        className="border px-2 py-1 text-[12px]" style={{ borderColor: '#dee2e6' }}
        placeholder="Filter..."
      />
      <div className="flex gap-1.5 justify-end">
        <button onClick={onClose} className="px-2 py-1 text-[12px] bg-white border" style={{ borderColor: '#dee2e6', borderRadius: 4 }}>Cancel</button>
        <button onClick={() => onApply(colKey, local)} className="px-2 py-1 text-[12px] text-white" style={{ backgroundColor: '#e32200', borderRadius: 4 }}>Apply</button>
      </div>
    </div>
  );
}

// ─── Table header cell with sort + filter ────────────────────────────────────
function ColHeader({ col, sortCol, sortDir, filters, onSort, onFilter, allData }) {
  const [showFilter, setShowFilter] = useState(false);
  const hasFilter = Boolean(filters[col.key]);

  const handleApply = (key, val) => {
    onFilter(key, val);
    setShowFilter(false);
  };

  return (
    <th
      className="px-3 py-2 text-left text-[13px] font-semibold text-black whitespace-nowrap relative"
      style={{ borderBottom: '1px solid #dee2e6', backgroundColor: '#f1f1f1', borderRight: '1px solid #dee2e6' }}
    >
      <div className="flex items-center gap-1">
        <button className="flex items-center hover:opacity-70" onClick={() => onSort(col.key)}>
          {col.label}
          <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />
        </button>
        <button
          onClick={() => setShowFilter((v) => !v)}
          className="ml-1 hover:opacity-70"
          style={{ color: hasFilter ? '#4338ca' : '#999' }}
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>
      {showFilter && (
        <ColFilterPanel
          colKey={col.key}
          value={filters[col.key] || ''}
          onApply={handleApply}
          onClose={() => setShowFilter(false)}
          allData={allData}
        />
      )}
    </th>
  );
}

// ─── FutureBenchModal ─────────────────────────────────────────────────────────
// Opens when "Future Bench 285" or "Next 30 Days" is clicked in the Forecast card.
// Shows resources rolling off in the next 30 days with full sort, filter, pagination.
function handleExportExcel(data) {
  const rows = data.map((r) => ({
    'People Name':         r.nameCode ? r.nameCode.replace(/\s*\d+$/, '').trim() : '',
    'Employee Code':       r.empCode ?? '',
    'Skill':               r.skill ?? '',
    'Designation':         r.designation ?? '',
    'Current Project':     r.currentProject ?? '',
    'Delivery Manager':    r.deliveryManager ?? '',
    'Engagement Model':    r.engagementModel ?? '',
    'Project Role':        r.projectRole ?? '',
    'Billed':              r.billed ? 'Yes' : 'No',
    'Roll-off Date':       r.rollOffDate ? String(r.rollOffDate).slice(0, 10) : '',
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Future Bench');
  XLSX.writeFile(wb, 'Future_Bench.xlsx');
}

export function FutureBenchModal({ isOpen, onClose, data: rawData = [] }) {
  const [sortCol, setSortCol]   = useState('rollOffDate');
  const [sortDir, setSortDir]   = useState('asc');
  const [filters, setFilters]   = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleSort = (colKey) => {
    if (sortCol === colKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(colKey);
      setSortDir('asc');
    }
    setCurrentPage(1);
  };

  const handleFilter = (colKey, value) => {
    setFilters((prev) => ({ ...prev, [colKey]: value }));
    setCurrentPage(1);
  };

  const clearFilter = (colKey) => {
    setFilters((prev) => { const next = { ...prev }; delete next[colKey]; return next; });
  };

  // ── Derived: filtered + sorted data
  const processedData = useMemo(() => {
    let data = [...rawData];

    // Apply column filters
    Object.entries(filters).forEach(([key, val]) => {
      if (!val) return;
      // People filter: "people|<name>" or "empCode|<code>"
      if (key === 'nameCode') {
        const [subType, ...rest] = val.split('|');
        const q = rest.join('|').toLowerCase();
        if (!q) return;
        data = data.filter((row) => {
          const nc = String(row.nameCode ?? '');
          if (subType === 'empCode') {
            // emp code is the last whitespace-separated token
            const code = nc.trim().split(/\s+/).pop() ?? '';
            return code.toLowerCase().includes(q);
          }
          // name = everything except the last token
          const parts = nc.trim().split(/\s+/);
          const name = parts.slice(0, -1).join(' ');
          return name.toLowerCase().includes(q);
        });
        return;
      }
      // Billed filter: "Yes" / "No"
      if (key === 'billed') {
        const want = val === 'Yes';
        data = data.filter((row) => row.billed === want);
        return;
      }
      const q = val.toLowerCase();
      data = data.filter((row) => String(row[key] ?? '').toLowerCase().includes(q));
    });

    // Sort
    data.sort((a, b) => {
      const va = a[sortCol] ?? '';
      const vb = b[sortCol] ?? '';
      const cmp = String(va).localeCompare(String(vb));
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return data;
  }, [filters, sortCol, sortDir]);

  const totalItems = processedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  const pageData = processedData.slice(start, start + itemsPerPage);

  // Active filter chips
  const activeFilters = Object.entries(filters).filter(([, v]) => v);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal box */}
      <div
        className="bg-white flex flex-col"
        style={{
          width: '95vw',
          maxWidth: 1400,
          maxHeight: '85vh',
          borderRadius: 8,
          boxShadow: 'rgba(0,0,0,0.1) 0px 8px 10px 0px',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: '#dee2e6' }}>
          <h2 className="text-[15px] font-semibold text-black">
            Future Bench (Rolling off in next 30 days)
          </h2>
          <div className="flex items-center gap-3">
            {/* Excel download */}
            <button
              onClick={() => handleExportExcel(processedData)}
              title="Download Excel"
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-white rounded transition-colors hover:opacity-90"
              style={{ backgroundColor: '#1d6f42' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export Excel
            </button>
            {/* Close */}
            <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Active filter chips — show when any column filter is applied */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 px-5 py-2 border-b" style={{ borderColor: '#dee2e6' }}>
            {activeFilters.map(([key, val]) => {
              const col = COLUMNS.find((c) => c.key === key);
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded"
                  style={{ backgroundColor: '#eef4ff', border: '1px solid #4c8bf5', color: '#1a79cb' }}
                >
                  {col?.label}: {val}
                  <button onClick={() => clearFilter(key)} className="ml-1 hover:opacity-70 font-semibold">×</button>
                </span>
              );
            })}
            <button
              onClick={() => setFilters({})}
              className="text-[11px] hover:underline"
              style={{ color: '#e32200' }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full border-collapse text-left">
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                {COLUMNS.map((col) => (
                  <ColHeader
                    key={col.key}
                    col={col}
                    sortCol={sortCol}
                    sortDir={sortDir}
                    filters={filters}
                    onSort={handleSort}
                    onFilter={handleFilter}
                    allData={rawData}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-[13px]" style={{ color: '#595959' }}>
                    No records found.
                  </td>
                </tr>
              ) : (
                pageData.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#dee2e6' }}
                  >
                    <td className="px-3 py-2.5 text-[13px] text-black font-medium">{row.nameCode}</td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: '#595959' }}>{row.skill}</td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: '#595959' }}>{row.designation}</td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: '#595959' }}>{row.currentProject}</td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: '#595959' }}>{row.deliveryManager}</td>
                    <td className="px-3 py-2.5 text-[12px] text-center">
                      <span
                        className="px-1.5 py-0.5 text-[11px]"
                        style={{ backgroundColor: '#dee2e6', color: '#595959', borderRadius: 4 }}
                      >
                        {row.engagementModel}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: '#595959' }}>{row.projectRole}</td>
                    <td className="px-3 py-2.5 text-[12px] text-center font-semibold" style={{ color: row.billed ? '#02942e' : '#595959' }}>
                      {row.billed ? 'Yes' : 'No'}
                    </td>
                    <td className="px-3 py-2.5 text-[12px]" style={{ color: '#595959' }}>
                      {row.rollOffDate ? String(row.rollOffDate).slice(0, 10) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: items-per-page + pagination counter + page buttons */}
        <div
          className="flex items-center justify-between px-5 py-2.5 border-t"
          style={{ borderColor: '#dee2e6' }}
        >
          {/* Items per page */}
          <div className="flex items-center gap-2 text-[12px]" style={{ color: '#595959' }}>
            <span>Items per page</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="border px-1 py-0.5 text-[12px] bg-white"
              style={{ borderColor: '#dee2e6', borderRadius: 4 }}
            >
              {[5, 10, 15, 20, 25].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span style={{ color: '#6a7178' }}>
              {start + 1} to {Math.min(start + itemsPerPage, totalItems)} of {totalItems} items
            </span>
          </div>

          {/* Page buttons */}
          <div className="flex items-center gap-1">
            {/* Prev */}
            <PageBtn label="‹" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} />
            {pageNumbers(currentPage, totalPages).map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-[12px]" style={{ color: '#595959' }}>…</span>
              ) : (
                <PageBtn key={p} label={p} active={p === currentPage} onClick={() => setCurrentPage(p)} />
              )
            )}
            {/* Next */}
            <PageBtn label="›" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pagination helpers ───────────────────────────────────────────────────────
function PageBtn({ label, onClick, active, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 flex items-center justify-center text-[12px] transition-colors"
      style={{
        borderRadius: 8,
        backgroundColor: active ? '#373f50' : 'white',
        color: active ? 'white' : '#595959',
        border: '1px solid #dee2e6',
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {label}
    </button>
  );
}

function pageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}
