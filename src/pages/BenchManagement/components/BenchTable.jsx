import { useState, useRef, useEffect } from 'react';

// ─── Red flag icon ────────────────────────────────────────────────────────────
function FlagIcon({ tooltip }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-block ml-1 cursor-pointer"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" className="w-3 h-3 inline">
        <path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.317.842 9.75 9.75 0 006.316.843l1.973-.493a.75.75 0 01.972.722v13.5a.75.75 0 01-.572.73l-2.401.6a9.75 9.75 0 01-6.316-.843 9.75 9.75 0 00-6.317-.842l-1.838.46V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z" clipRule="evenodd" />
      </svg>
      {show && tooltip && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-white text-[11px] whitespace-nowrap z-50 pointer-events-none"
          style={{ backgroundColor: '#272b30', borderRadius: 4 }}
        >
          {tooltip}
        </span>
      )}
    </span>
  );
}

function valueColor(val, threshold = 15) {
  if (val === 'NA') return '#595959';
  return Number(val) >= threshold ? '#02942e' : '#ef4444';
}

// Shared cell border style — every cell gets right border to separate columns
const cellBorder = { borderRight: '1px solid #e5e7eb' };

// ─── Cell: People ─────────────────────────────────────────────────────────────
function PeopleCell({ row, onNameClick }) {
  return (
    <td className="px-3 align-top" style={{ ...cellBorder, minWidth: 185, padding: '10px 12px' }}>
      <button
        onClick={() => onNameClick(row)}
        className="text-left font-semibold text-black hover:underline cursor-pointer block"
        style={{ fontSize: 13, lineHeight: 1.4 }}
      >
        {row.name}
      </button>
      <p style={{ fontSize: 11, color: '#595959', lineHeight: 1.4, marginTop: 2 }}>
        {row.empCode} | {row.division}
      </p>
      <p style={{ fontSize: 11, color: '#595959', lineHeight: 1.4 }}>
        {row.employeeType}
      </p>
      <span
        style={{
          display: 'inline-block',
          fontSize: 11,
          backgroundColor: '#dee2e6',
          color: '#595959',
          borderRadius: 4,
          padding: '1px 6px',
          marginTop: 4,
          lineHeight: 1.5,
        }}
      >
        {row.primarySkill}
      </span>
    </td>
  );
}

// ─── Derive display state from row data ───────────────────────────────────────
const PARKED_DECISIONS_TABLE = [
  'Project Identified/Yet to be started',
  'Extension Expected',
  'Internal Redeployment/Additional Support',
];

function getDisplayState(row) {
  if (row.remarks?.toLowerCase().includes('maternity')) return 'MATERNITY';
  if (row.hrDecision === 'Resigned')                    return 'NOTICE';
  if (PARKED_DECISIONS_TABLE.includes(row.hrDecision))  return 'PARKED';
  return row.attentionStatus; // URGENT / CRITICAL / MODERATE
}

// ─── Cell: Attention Status ───────────────────────────────────────────────────
const statusConfig = {
  URGENT:    { bg: '#dc2626', sub: '> 90d' },
  CRITICAL:  { bg: '#ef4444', sub: '61-90d' },
  MODERATE:  { bg: '#fbbf24', sub: '31-60d' },
  MATERNITY: { bg: '#7c3aed', sub: 'On Leave' },
  NOTICE:    { bg: '#db2777', sub: 'Resigned' },
  PARKED:    { bg: '#6b7280', sub: 'Non-Actionable' },
};

function AttentionCell({ row }) {
  const state  = getDisplayState(row);
  const config = statusConfig[state] || { bg: '#fbbf24', sub: '' };

  return (
    <td className="align-top text-center" style={{ ...cellBorder, padding: '10px 12px' }}>
      {/* Badge */}
      <div style={{
        display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', backgroundColor: config.bg,
        borderRadius: 8, padding: '3px 6px', minWidth: 82, color: '#fff',
      }}>
        <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3 }}>{state}</span>
        <span style={{ fontSize: 10, lineHeight: 1.2, opacity: 0.9 }}>{config.sub}</span>
      </div>

      {/* Days count */}
      <p style={{ marginTop: 6, lineHeight: 1.2 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#111111' }}>{row.benchDays}</span>
        {' '}
        <span style={{ fontSize: 12, color: '#595959' }}>days</span>
      </p>

      {/* Since date */}
      <p style={{ fontSize: 11, color: '#595959', lineHeight: 1.3, marginTop: 1 }}>
        Since {row.benchSince ? String(row.benchSince).slice(0, 10) : '—'}
      </p>
    </td>
  );
}

// ─── Cell: Last Project ───────────────────────────────────────────────────────
function LastProjectCell({ row }) {
  const hasProject = Boolean(row.lastProject);
  return (
    <td className="align-top" style={{ ...cellBorder, minWidth: 235, padding: '10px 12px' }}>
      {/* Project name — blue */}
      <p
        className="hover:underline cursor-pointer"
        style={{ fontSize: 12, fontWeight: 600, color: hasProject ? '#1a79cb' : '#595959', lineHeight: 1.4 }}
      >
        {hasProject ? row.lastProject : '—'}
      </p>

      {hasProject && row.role && (
        <p style={{ fontSize: 11, color: '#1d4ed8', lineHeight: 1.4, marginTop: 1 }}>{row.role}</p>
      )}

      {/* Engagement type + billing inline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
        {hasProject && row.engagementType && (
          <span style={{ fontSize: 11, backgroundColor: '#dee2e6', color: '#595959', borderRadius: 4, padding: '1px 6px' }}>
            {row.engagementType}
          </span>
        )}
        {row.billing === 'Billed' && (
          <span style={{ fontSize: 11, fontWeight: 600, color: '#488f31' }}>Billed</span>
        )}
        {row.billing === 'Not Billed' && (
          <span style={{ fontSize: 11, color: '#595959' }}>Not Billed</span>
        )}
      </div>

      {/* Resource Margin / Allocation box */}
      <div style={{ display: 'flex', border: '1px solid #bfbfbf', borderRadius: 4, marginTop: 6, fontSize: 11 }}>
        <div style={{ flex: 1, padding: '3px 8px', borderRight: '1px solid #bfbfbf' }}>
          <p style={{ color: '#595959' }}>Resource Margin:</p>
          <p style={{ fontWeight: 600, color: valueColor(row.resourceMargin, 15) }}>
            {row.resourceMargin === 'NA' ? 'NA' : `${row.resourceMargin}%`}
          </p>
        </div>
        <div style={{ flex: 1, padding: '3px 8px' }}>
          <p style={{ color: '#595959' }}>Allocation:</p>
          <p style={{ fontWeight: 600, color: valueColor(row.allocation, 50) }}>
            {row.allocation === 'NA' ? 'NA' : `${row.allocation}%`}
          </p>
        </div>
      </div>

      {/* DM */}
      <p style={{ fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>
        <span style={{ color: '#595959' }}>DM: </span>
        <span style={{ fontWeight: 600, color: '#111111' }}>{row.dm || '—'}</span>
      </p>

      {/* Date range + duration */}
      {row.projectStart && (
        <p style={{ fontSize: 11, color: '#595959', lineHeight: 1.4 }}>
          {row.projectStart ? String(row.projectStart).slice(0, 10) : '—'} – {row.projectEnd ? String(row.projectEnd).slice(0, 10) : '—'}
        </p>
      )}
      <p style={{ fontSize: 11, color: '#595959', lineHeight: 1.4 }}>({row.projectDuration})</p>
    </td>
  );
}

// ─── Cell: Performance Rating ─────────────────────────────────────────────────
function PerformanceCell({ row }) {
  return (
    <td className="align-top" style={{ ...cellBorder, minWidth: 148, padding: '10px 12px' }}>
      <p style={{ fontSize: 12, color: '#595959' }}>Monthly CTC</p>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#111111', marginTop: 1 }}>
        ₹ {row.monthlyCTC.toLocaleString('en-IN')}
        {row.monthlyCTC === 0 && <FlagIcon tooltip="Data Not Available (Missing CTC)" />}
      </p>
      <p style={{ fontSize: 12, color: '#595959', marginTop: 8 }}>Performance</p>
      <p style={{ fontSize: 12, color: '#111111', marginTop: 1 }}>
        {row.performance}
        {row.performance === 'NA' && <FlagIcon tooltip="Data Not Available (Missing Rating)" />}
      </p>
    </td>
  );
}

// ─── Cell: HR Decision ────────────────────────────────────────────────────────
function HRDecisionCell({ row, onOpenModal }) {
  return (
    <td className="align-top" style={{ ...cellBorder, minWidth: 185, padding: '10px 12px' }}>
      <button
        onClick={() => onOpenModal(row)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 182,
          height: 28,
          padding: '0 8px',
          border: '1px solid #bfbfbf',
          borderRadius: 0,
          backgroundColor: 'transparent',
          fontSize: 12,
          color: row.hrDecision ? '#111111' : '#595959',
          cursor: 'pointer',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {row.hrDecision || 'Select HR Decision'}
        </span>
        <svg style={{ width: 12, height: 12, flexShrink: 0, marginLeft: 4 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </td>
  );
}

// ─── Cell: Context / Remarks ──────────────────────────────────────────────────
function RemarksCell({ row, onOpenModal }) {
  return (
    <td className="align-top" style={{ ...cellBorder, padding: '10px 12px', overflow: 'hidden' }}>
      <button
        onClick={() => onOpenModal(row)}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          width: '100%',
          minHeight: 52,
          padding: '6px 8px',
          backgroundColor: '#f3f4f6',
          fontSize: 12,
          color: row.remarks ? '#4d5156' : 'transparent',
          textAlign: 'left',
          cursor: 'pointer',
          border: 'none',
        }}
      >
        {row.remarks || '\u00A0'}
      </button>
    </td>
  );
}

// ─── Timeline card helper ─────────────────────────────────────────────────────
function TimelineCard({ bg, border, labelColor, label, date, sub, onClick }) {
  return (
    <td className="align-top" style={{ padding: '10px 12px' }}>
      <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', padding: 0 }}>
        <div style={{ backgroundColor: bg, border: `1px solid ${border}`, borderRadius: 4, padding: '6px 10px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: labelColor, marginBottom: 3 }}>{label}</p>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#111', marginBottom: 2 }}>{date}</p>
          {sub && <p style={{ fontSize: 11, color: '#555' }}>{sub}</p>}
        </div>
      </button>
    </td>
  );
}

// ─── Cell: Timeline ───────────────────────────────────────────────────────────
function TimelineCell({ row, onOpenModal }) {
  const state = getDisplayState(row);
  const open  = () => onOpenModal(row);

  const fmtDate = (str) => {
    if (!str) return null;
    return new Date(str).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  const diffDays = (str) => str ? Math.round((new Date(str) - new Date()) / 86400000) : null;

  // ── MATERNITY / Long Leave ──────────────────────────────────────────────────
  if (state === 'MATERNITY' || row.hrDecision === 'Long Leave/Sabbatical') {
    const fallback = new Date(); fallback.setDate(fallback.getDate() + 90);
    const dateStr = row.timeline ? String(row.timeline).slice(0, 10) : fallback.toISOString().slice(0, 10);
    const diff    = diffDays(dateStr);
    const sub     = diff > 0 ? `(${diff} days remaining)` : '(Returned)';
    return <TimelineCard bg="#f5f3ff" border="#ddd6fe" labelColor="#7c3aed" label="Expected Return" date={fmtDate(dateStr)} sub={sub} onClick={open} />;
  }

  // ── NOTICE (Resigned) ───────────────────────────────────────────────────────
  if (state === 'NOTICE') {
    const fallback = new Date(); fallback.setDate(fallback.getDate() + 30);
    const dateStr = row.timeline ? String(row.timeline).slice(0, 10) : fallback.toISOString().slice(0, 10);
    const diff    = diffDays(dateStr);
    const sub     = diff > 0 ? `(${diff} days remaining)` : diff === 0 ? '(Today)' : '(Completed)';
    return <TimelineCard bg="#fff1f2" border="#fecdd3" labelColor="#e11d48" label="LWD" date={fmtDate(dateStr)} sub={sub} onClick={open} />;
  }

  // ── PARKED (alignment decisions) ────────────────────────────────────────────
  if (state === 'PARKED') {
    const fallback = new Date(); fallback.setDate(fallback.getDate() + 30);
    const dateStr = row.timeline ? String(row.timeline).slice(0, 10) : fallback.toISOString().slice(0, 10);
    return (
      <td className="align-top" style={{ padding: '10px 12px' }}>
        <button onClick={open} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', padding: 0 }}>
          <div style={{ backgroundColor: '#f3f4f6', border: '1px solid #e0e0e0', borderRadius: 6, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#555', margin: 0 }}>Expected Alignment</p>
            <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: 4, padding: '4px 8px' }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#111' }}>{fmtDate(dateStr)}</span>
            </div>
            <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: 4, padding: '4px 8px' }}>
              <span style={{ fontSize: 11, color: '#b45309' }}>{row.plannedProject || '—'}</span>
            </div>
          </div>
        </button>
      </td>
    );
  }

  // ── Default ─────────────────────────────────────────────────────────────────
  return (
    <td className="align-top text-right" style={{ padding: '10px 12px' }}>
      <button onClick={open} style={{ fontSize: 12, fontStyle: 'italic', color: row.timeline ? '#4d5156' : '#858686', cursor: 'pointer', background: 'none', border: 'none' }} className="hover:underline">
        {row.timeline ? String(row.timeline).slice(0, 10) : 'TBD'}
      </button>
    </td>
  );
}

// ─── People column filter panel ───────────────────────────────────────────────
function FilterPanel({ filterType, filterValue, onApply, onCancel }) {
  const [localType, setLocalType]   = useState(filterType);
  const [localValue, setLocalValue] = useState(filterValue);
  return (
    <div
      className="absolute top-full left-0 z-30 bg-white border shadow p-2 flex flex-col gap-2"
      style={{ borderColor: '#dee2e6', minWidth: 200, borderRadius: 4 }}
    >
      <select
        value={localType}
        onChange={(e) => setLocalType(e.target.value)}
        className="border px-2 py-1 bg-white"
        style={{ borderColor: '#dee2e6', fontSize: 12 }}
      >
        <option value="People">People</option>
        <option value="Emp Code">Emp Code</option>
      </select>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="border px-2 py-1"
        style={{ borderColor: '#dee2e6', fontSize: 12 }}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter')  onApply(localType, localValue);
          if (e.key === 'Escape') onCancel();
        }}
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1 bg-white border text-black"
          style={{ borderColor: '#dee2e6', borderRadius: 4, fontSize: 12 }}
        >
          Cancel
        </button>
        <button
          onClick={() => onApply(localType, localValue)}
          className="px-3 py-1 text-white"
          style={{ backgroundColor: '#e32200', borderRadius: 4, fontSize: 12 }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

// ─── BenchTable ───────────────────────────────────────────────────────────────
export function BenchTable({
  data,
  sortOrder,
  onSortToggle,
  filterType,
  filterValue,
  onFilterChange,
  onOpenModal,
  onNameClick,
}) {
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false);
    };
    if (showFilter) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showFilter]);

  // Shared header cell style
  const thBase = {
    padding: '8px 12px',
    fontSize: 13,
    fontWeight: 600,
    color: '#111111',
    backgroundColor: '#f1f1f1',
    borderBottom: '2px solid #d1d5db',
    borderRight: '1px solid #e5e7eb',
    textAlign: 'left',
  };

  return (
    <div
      className="mx-2 mt-2"
      style={{ border: '1px solid #e5e7eb', borderRadius: 4 }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '14%' }} /> {/* People */}
          <col style={{ width: '10%' }} /> {/* Attention Status */}
          <col style={{ width: '18%' }} /> {/* Last Project */}
          <col style={{ width: '11%' }} /> {/* Performance Rating */}
          <col style={{ width: '13%' }} /> {/* HR Decision */}
          <col style={{ width: '22%' }} /> {/* Context / Remarks */}
          <col style={{ width: '12%' }} /> {/* Timeline */}
        </colgroup>
        {/* ─── Header ─── */}
        <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
          {/* Row 1 */}
          <tr>
            {/* People — sort + filter */}
            <th
              rowSpan={2}
              style={{ ...thBase, position: 'relative', verticalAlign: 'middle' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  onClick={onSortToggle}
                  style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#111' }}
                >
                  People
                  <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowFilter((v) => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: filterValue ? '#4338ca' : '#666' }}
                >
                  <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              </div>
              {showFilter && (
                <div ref={filterRef}>
                  <FilterPanel
                    filterType={filterType}
                    filterValue={filterValue}
                    onApply={(t, v) => { onFilterChange(t, v); setShowFilter(false); }}
                    onCancel={() => setShowFilter(false)}
                  />
                </div>
              )}
            </th>

            <th rowSpan={2} style={{ ...thBase, verticalAlign: 'middle' }}>Attention Status</th>
            <th rowSpan={2} style={{ ...thBase, verticalAlign: 'middle' }}>Last Project</th>
            <th rowSpan={2} style={{ ...thBase, verticalAlign: 'middle' }}>Performance Rating</th>

            {/* Super-header: Action Plan & Remarks */}
            <th
              colSpan={3}
              style={{
                ...thBase,
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#595959',
                textAlign: 'center',
                borderRight: 'none',
              }}
            >
              Action Plan &amp; Remarks
            </th>
          </tr>

          {/* Row 2 — sub-headers */}
          <tr>
            <th style={{ ...thBase }}>HR Decision</th>
            <th style={{ ...thBase }}>Context / Remarks</th>
            <th style={{ ...thBase, borderRight: 'none' }}>Timeline</th>
          </tr>
        </thead>

        {/* ─── Body ─── */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: '40px 12px', textAlign: 'center', fontSize: 13, color: '#595959' }}>
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                style={{ borderBottom: '1px solid #e5e7eb' }}
                className="hover:bg-[#fafafa] transition-colors"
              >
                <PeopleCell      row={row} onNameClick={onNameClick} />
                <AttentionCell   row={row} />
                <LastProjectCell row={row} />
                <PerformanceCell row={row} />
                <HRDecisionCell  row={row} onOpenModal={onOpenModal} />
                <RemarksCell     row={row} onOpenModal={onOpenModal} />
                <TimelineCell    row={row} onOpenModal={onOpenModal} />
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
