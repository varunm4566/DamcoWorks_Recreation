import { useState, useRef, useEffect } from 'react';
import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';
import { Pagination } from '../../../components/UI/Pagination.jsx';
import { OverallHealthModal } from './OverallHealthModal.jsx';
import { FinancialHealthModal } from './FinancialHealthModal.jsx';
import { AiPulseModal } from './AiPulseModal.jsx';

function HealthBadge({ status }) {
  const map = {
    healthy: { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Healthy' },
    caution: { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Caution' },
    at_risk: { bg: 'bg-red-100',    text: 'text-red-600',    label: 'At Risk' },
  };
  const s = map[status?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-500', label: status || '—' };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${s.bg} ${s.text} cursor-pointer`}>
      {s.label}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
      status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
    }`}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
}

function SentimentTag({ sentiment }) {
  const colorMap = {
    'holding steady for now':      'bg-amber-50 text-amber-700',
    'progress on the right track': 'bg-green-50 text-green-700',
    'things are looking good':     'bg-green-50 text-green-700',
  };
  const cls = colorMap[(sentiment || '').toLowerCase()] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${cls}`}>
      {sentiment}
    </span>
  );
}

/** Currency toggle */
function CurrencyToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-[11px] ${!value ? 'font-semibold text-text-primary' : 'text-text-muted'}`}>INR</span>
      <button
        role="switch"
        aria-checked={value}
        onClick={onChange}
        className={`relative w-8 h-4 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-brand-red' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
      <span className={`text-[11px] ${value ? 'font-semibold text-text-primary' : 'text-text-muted'}`}>USD</span>
    </div>
  );
}

/** Sort icon */
function SortIcon({ col, activeCol, dir }) {
  if (activeCol !== col) return <span className="text-gray-300 ml-1 text-[10px]">↕</span>;
  return <span className="text-brand-red ml-1 text-[10px]">{dir === 'asc' ? '↑' : '↓'}</span>;
}

/** Simple filter dropdown for status */
function StatusFilterDropdown({ value, onApply, onClose }) {
  const [selected, setSelected] = useState(value || '');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute top-full left-0 mt-1 bg-white border border-border rounded shadow-lg z-50 min-w-[140px] p-2">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full border border-border rounded px-2 py-1 text-[12px] focus:outline-none mb-2"
      >
        <option value="">— All —</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <div className="flex gap-1">
        <button onClick={onClose} className="flex-1 px-2 py-1 text-[11px] border border-border rounded hover:bg-gray-50">Cancel</button>
        <button onClick={() => { onApply(selected); onClose(); }} className="flex-1 px-2 py-1 text-[11px] bg-brand-red text-white rounded hover:opacity-90">Apply</button>
      </div>
    </div>
  );
}

/**
 * Projects accordion for the Delivery section.
 * Contains the full sortable/filterable/paginated project list table
 * with Display columns toggle, currency switch, search, and row-level popups.
 */
export function ProjectsAccordion({ customerId }) {
  const projects        = useCustomerDetailStore((s) => s.projects);
  const loading         = useCustomerDetailStore((s) => s.projectsLoading);
  const error           = useCustomerDetailStore((s) => s.projectsError);
  const totalCount      = useCustomerDetailStore((s) => s.projectsTotalCount);
  const page            = useCustomerDetailStore((s) => s.projectsPage);
  const pageSize        = useCustomerDetailStore((s) => s.projectsPageSize);
  const sortCol         = useCustomerDetailStore((s) => s.projectsSortCol);
  const sortDir         = useCustomerDetailStore((s) => s.projectsSortDir);
  const statusFilter    = useCustomerDetailStore((s) => s.projectsStatusFilter);
  const currency        = useCustomerDetailStore((s) => s.projectsCurrency);
  const searchOpen      = useCustomerDetailStore((s) => s.projectsSearchOpen);
  const search          = useCustomerDetailStore((s) => s.projectsSearch);

  const setSort         = useCustomerDetailStore((s) => s.setProjectsSort);
  const setPage         = useCustomerDetailStore((s) => s.setProjectsPage);
  const setPageSize     = useCustomerDetailStore((s) => s.setProjectsPageSize);
  const setStatusFilter = useCustomerDetailStore((s) => s.setProjectsStatusFilter);
  const setSearch       = useCustomerDetailStore((s) => s.setProjectsSearch);
  const toggleCurrency  = useCustomerDetailStore((s) => s.toggleProjectsCurrency);
  const toggleSearch    = useCustomerDetailStore((s) => s.toggleProjectsSearchOpen);

  const openOverallHealth   = useCustomerDetailStore((s) => s.openOverallHealthModal);
  const openFinancialHealth = useCustomerDetailStore((s) => s.openFinancialHealthModal);
  const openAiPulse         = useCustomerDetailStore((s) => s.openAiPulseModal);

  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [displayOpen, setDisplayOpen] = useState(false);
  const displayRef = useRef(null);

  // ── Column visibility ─────────────────────────────────────────────
  const ALL_COLUMNS = [
    { key: 'name',              label: 'Project',           isDefault: true },
    { key: 'overall_health',    label: 'Overall Health',    isDefault: true },
    { key: 'financial_health',  label: 'Financial Health',  isDefault: true },
    { key: 'service_quality',   label: 'Service Quality',   isDefault: true },
    { key: 'ai_pulse',          label: 'AI Pulse',          isDefault: true },
    { key: 'delivery_thoughts', label: 'Delivery Thoughts', isDefault: true },
    { key: 'status',            label: 'Status',            isDefault: true },
    { key: 'revenue',           label: 'Total Revenue',     isDefault: true },
    { key: 'cost',              label: 'Total Cost',        isDefault: true },
    { key: 'margin',            label: 'Margin %',          isDefault: true },
    { key: 'division',          label: 'Division',          isDefault: false },
    { key: 'department',        label: 'Department',        isDefault: false },
    { key: 'duration',          label: 'Duration',          isDefault: false },
    { key: 'model',             label: 'Model',             isDefault: false },
    { key: 'delivery_head',     label: 'Delivery Head',     isDefault: false },
    { key: 'dm',                label: 'DM',                isDefault: false },
    { key: 'program_manager',   label: 'Program Manager',   isDefault: false },
    { key: 'project_lead',      label: 'Project Lead',      isDefault: false },
    { key: 'tech_lead',         label: 'Tech Lead',         isDefault: false },
  ];
  const DEFAULT_VISIBLE = new Set(ALL_COLUMNS.filter((c) => c.isDefault).map((c) => c.key));

  const [visibleCols, setVisibleCols] = useState(new Set(DEFAULT_VISIBLE));

  const toggleCol = (key) => {
    setVisibleCols((prev) => {
      if (prev.has(key) && prev.size === 1) return prev; // must keep at least 1
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const resetCols = () => setVisibleCols(new Set(DEFAULT_VISIBLE));

  const col = (key) => visibleCols.has(key);

  useEffect(() => {
    const handler = (e) => {
      if (displayRef.current && !displayRef.current.contains(e.target)) setDisplayOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fmtMoney = (val) => {
    const n = parseFloat(val) || 0;
    return `$${(n / 1000).toFixed(2)}K`;
  };

  const uniqueHeadcount = projects.reduce((acc, p) => acc + (parseInt(p.unique_headcount) || 0), 0);

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-3 bg-white">
      {/* Section header — always visible, not collapsible */}
      <div className="px-4 py-2.5 border-b border-border">
        <span className="text-[14px] font-semibold text-text-primary">Projects</span>
      </div>

      <div>
          {/* Sub-header */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[13px] font-semibold text-text-primary">Project List</span>
                <span className="text-[12px] text-text-muted ml-2">(Unique Headcount: {uniqueHeadcount})</span>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-2">
                <CurrencyToggle value={currency === 'usd'} onChange={toggleCurrency} />

                {/* Search */}
                {searchOpen ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(customerId, e.target.value)}
                      placeholder="Type project name..."
                      className="border border-border rounded px-2 py-1 text-[12px] w-44 focus:outline-none focus:border-brand-red"
                    />
                    <button onClick={toggleSearch} className="text-text-muted hover:text-text-primary">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button onClick={toggleSearch} className="p-1 rounded hover:bg-gray-100 text-text-muted" aria-label="Search projects">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                )}

                {/* Download */}
                <button className="p-1 rounded hover:bg-gray-100 text-text-muted" aria-label="Download projects">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>

                {/* Display columns */}
                <div className="relative" ref={displayRef}>
                  <button
                    onClick={() => setDisplayOpen((v) => !v)}
                    className="flex items-center gap-1 px-2 py-1 text-[12px] border border-border rounded hover:bg-gray-50"
                  >
                    <svg className="w-3.5 h-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Display
                  </button>
                  {displayOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded shadow-lg z-50 w-64 p-3">
                      <div className="text-[11px] font-semibold text-text-muted mb-2 uppercase tracking-wide">Default Columns</div>
                      <div className="space-y-1 mb-3">
                        {ALL_COLUMNS.filter((c) => c.isDefault).map((c) => (
                          <label key={c.key} className={`flex items-center gap-2 px-1 py-0.5 rounded cursor-pointer hover:bg-gray-50 ${visibleCols.size === 1 && visibleCols.has(c.key) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input
                              type="checkbox"
                              checked={visibleCols.has(c.key)}
                              onChange={() => toggleCol(c.key)}
                              disabled={visibleCols.size === 1 && visibleCols.has(c.key)}
                              className="accent-brand-red w-3 h-3"
                            />
                            <span className="text-[12px] text-text-secondary">{c.label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="text-[11px] font-semibold text-text-muted mb-2 uppercase tracking-wide border-t border-border pt-2">Additional Columns</div>
                      <div className="space-y-1 mb-3">
                        {ALL_COLUMNS.filter((c) => !c.isDefault).map((c) => (
                          <label key={c.key} className="flex items-center gap-2 px-1 py-0.5 rounded cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={visibleCols.has(c.key)}
                              onChange={() => toggleCol(c.key)}
                              className="accent-brand-red w-3 h-3"
                            />
                            <span className="text-[12px] text-text-secondary">{c.label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex gap-2 border-t border-border pt-2">
                        <button onClick={resetCols} className="flex-1 px-2 py-1 text-[11px] border border-border rounded hover:bg-gray-50">
                          Reset
                        </button>
                        <button onClick={() => setDisplayOpen(false)} className="flex-1 px-2 py-1 text-[11px] bg-brand-red text-white rounded hover:opacity-90">
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">
              Revenue &amp; Cost: FP – since project start; BYT/T&amp;M – last 12 months
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-table-header">
                <tr>
                  {col('name') && (
                    <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap min-w-[200px]">
                      <button onClick={() => setSort(customerId, 'name')} className="flex items-center hover:text-text-primary">
                        Project <SortIcon col="name" activeCol={sortCol} dir={sortDir} />
                      </button>
                    </th>
                  )}
                  {col('overall_health') && (
                    <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">
                      <button onClick={() => setSort(customerId, 'overall_health')} className="flex items-center hover:text-text-primary">
                        Overall Health <SortIcon col="overall_health" activeCol={sortCol} dir={sortDir} />
                      </button>
                    </th>
                  )}
                  {col('financial_health') && (
                    <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">
                      <button onClick={() => setSort(customerId, 'financial_health')} className="flex items-center hover:text-text-primary">
                        Financial Health <SortIcon col="financial_health" activeCol={sortCol} dir={sortDir} />
                      </button>
                    </th>
                  )}
                  {col('service_quality') && (
                    <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">
                      <button onClick={() => setSort(customerId, 'service_quality')} className="flex items-center hover:text-text-primary">
                        Service Quality <SortIcon col="service_quality" activeCol={sortCol} dir={sortDir} />
                      </button>
                    </th>
                  )}
                  {col('ai_pulse') && (
                    <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap min-w-[180px]">
                      ✦ Project Pulse by AI
                    </th>
                  )}
                  {col('delivery_thoughts') && (
                    <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap min-w-[200px]">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-text-muted" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        Delivery Thoughts
                      </span>
                    </th>
                  )}
                  {col('status') && (
                    <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSort(customerId, 'status')} className="hover:text-text-primary">
                          Status <SortIcon col="status" activeCol={sortCol} dir={sortDir} />
                        </button>
                        <div className="relative">
                          <button onClick={() => setStatusFilterOpen((v) => !v)} className="hover:text-brand-red" aria-label="Filter status">
                            <svg className={`w-3 h-3 ${statusFilter ? 'text-brand-red' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.553.894l-4 2A1 1 0 016 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                            </svg>
                          </button>
                          {statusFilterOpen && (
                            <StatusFilterDropdown
                              value={statusFilter}
                              onApply={(v) => setStatusFilter(customerId, v)}
                              onClose={() => setStatusFilterOpen(false)}
                            />
                          )}
                        </div>
                      </div>
                    </th>
                  )}
                  {col('revenue') && (
                    <th className="py-2 px-3 text-right text-[11px] font-medium text-text-secondary whitespace-nowrap">
                      <button onClick={() => setSort(customerId, 'total_revenue_usd')} className="flex items-center ml-auto hover:text-text-primary">
                        Total Revenue <SortIcon col="total_revenue_usd" activeCol={sortCol} dir={sortDir} />
                      </button>
                    </th>
                  )}
                  {col('cost') && (
                    <th className="py-2 px-3 text-right text-[11px] font-medium text-text-secondary whitespace-nowrap">
                      <button onClick={() => setSort(customerId, 'total_cost_usd')} className="flex items-center ml-auto hover:text-text-primary">
                        Total Cost <SortIcon col="total_cost_usd" activeCol={sortCol} dir={sortDir} />
                      </button>
                    </th>
                  )}
                  {col('margin') && (
                    <th className="py-2 px-3 text-right text-[11px] font-medium text-text-secondary whitespace-nowrap">
                      <button onClick={() => setSort(customerId, 'margin_percent')} className="flex items-center ml-auto hover:text-text-primary">
                        Margin % <SortIcon col="margin_percent" activeCol={sortCol} dir={sortDir} />
                      </button>
                    </th>
                  )}
                  {col('division') && <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">Division</th>}
                  {col('department') && <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">Department</th>}
                  {col('duration') && <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">Duration</th>}
                  {col('model') && <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">Model</th>}
                  {col('delivery_head') && <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">Delivery Head</th>}
                  {col('dm') && <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">DM</th>}
                  {col('program_manager') && <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">Program Manager</th>}
                  {col('project_lead') && <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">Project Lead</th>}
                  {col('tech_lead') && <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">Tech Lead</th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {loading && (
                  <tr>
                    <td colSpan={visibleCols.size} className="py-8 text-center text-text-muted text-[13px]">
                      Loading projects…
                    </td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={visibleCols.size} className="py-8 text-center text-red-500 text-[13px]">{error}</td>
                  </tr>
                )}
                {!loading && !error && projects.length === 0 && (
                  <tr>
                    <td colSpan={visibleCols.size} className="py-8 text-center text-text-muted text-[13px]">No projects found.</td>
                  </tr>
                )}
                {!loading && projects.map((proj, idx) => {
                  const startDate = proj.contract_start_date ? new Date(proj.contract_start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null;
                  const endDate   = proj.contract_end_date   ? new Date(proj.contract_end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null;
                  const duration  = startDate && endDate ? `${startDate} – ${endDate}` : startDate || '—';
                  return (
                    <tr key={proj.id} className={`hover:bg-gray-50 transition-colors ${idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}`}>
                      {col('name') && (
                        <td className="py-2.5 px-3">
                          <button onClick={() => openOverallHealth(proj)} className="text-[12px] text-blue-600 hover:underline text-left">
                            {proj.name}
                          </button>
                        </td>
                      )}
                      {col('overall_health') && (
                        <td className="py-2.5 px-3 cursor-pointer" onClick={() => openOverallHealth(proj)}>
                          <HealthBadge status={proj.overall_health} />
                        </td>
                      )}
                      {col('financial_health') && (
                        <td className="py-2.5 px-3 cursor-pointer" onClick={() => openFinancialHealth(proj)}>
                          <HealthBadge status={proj.financial_health} />
                        </td>
                      )}
                      {col('service_quality') && (
                        <td className="py-2.5 px-3 cursor-pointer" onClick={() => openOverallHealth(proj)}>
                          <HealthBadge status={proj.service_quality} />
                        </td>
                      )}
                      {col('ai_pulse') && (
                        <td className="py-2.5 px-3">
                          <button onClick={() => openAiPulse(customerId, proj)} className="text-left w-full">
                            {proj.ai_pulse_sentiment && (
                              <div className="mb-1"><SentimentTag sentiment={proj.ai_pulse_sentiment} /></div>
                            )}
                            <p className="text-[11px] text-text-muted line-clamp-2 leading-snug">
                              {proj.ai_pulse_summary || proj.ai_highlights || '—'}
                            </p>
                          </button>
                        </td>
                      )}
                      {col('delivery_thoughts') && (
                        <td className="py-2.5 px-3">
                          <div className="max-w-[200px]">
                            {proj.latest_thought ? (
                              <>
                                <p className="text-[11px] text-text-secondary line-clamp-2 leading-snug">{proj.latest_thought}</p>
                                <p className="text-[10px] text-text-muted mt-0.5">By: {proj.thought_author}</p>
                              </>
                            ) : (
                              <span className="text-[11px] text-text-muted">—</span>
                            )}
                          </div>
                        </td>
                      )}
                      {col('status') && (
                        <td className="py-2.5 px-3"><StatusBadge status={proj.status} /></td>
                      )}
                      {col('revenue') && (
                        <td className="py-2.5 px-3 text-right text-[12px] text-text-primary font-medium">{fmtMoney(proj.total_revenue_usd)}</td>
                      )}
                      {col('cost') && (
                        <td className="py-2.5 px-3 text-right text-[12px] text-text-secondary">{fmtMoney(proj.total_cost_usd)}</td>
                      )}
                      {col('margin') && (
                        <td className="py-2.5 px-3 text-right text-[12px] text-green-700 font-medium">
                          {proj.margin_percent ? `${parseFloat(proj.margin_percent).toFixed(1)}%` : '—'}
                        </td>
                      )}
                      {col('division') && <td className="py-2.5 px-3 text-[12px] text-text-secondary">{proj.division || '—'}</td>}
                      {col('department') && <td className="py-2.5 px-3 text-[12px] text-text-secondary">{proj.department || '—'}</td>}
                      {col('duration') && <td className="py-2.5 px-3 text-[12px] text-text-secondary whitespace-nowrap">{duration}</td>}
                      {col('model') && <td className="py-2.5 px-3 text-[12px] text-text-secondary">{proj.engagement_model || '—'}</td>}
                      {col('delivery_head') && <td className="py-2.5 px-3 text-[12px] text-text-secondary">{proj.delivery_head || '—'}</td>}
                      {col('dm') && <td className="py-2.5 px-3 text-[12px] text-text-secondary">{proj.dm || '—'}</td>}
                      {col('program_manager') && <td className="py-2.5 px-3 text-[12px] text-text-secondary">{proj.program_manager || '—'}</td>}
                      {col('project_lead') && <td className="py-2.5 px-3 text-[12px] text-text-secondary">{proj.project_lead || '—'}</td>}
                      {col('tech_lead') && <td className="py-2.5 px-3 text-[12px] text-text-secondary">{proj.tech_lead || '—'}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-3 border-t border-border">
            <Pagination
              page={page}
              pageSize={pageSize}
              totalItems={totalCount}
              onPageChange={(p) => setPage(customerId, p)}
              onPageSizeChange={(s) => setPageSize(customerId, s)}
            />
          </div>
        </div>

      {/* Modals */}
      <OverallHealthModal />
      <FinancialHealthModal />
      <AiPulseModal customerId={customerId} />
    </div>
  );
}
