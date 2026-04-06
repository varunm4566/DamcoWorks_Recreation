import { useEffect, useState, useMemo, useCallback } from 'react';
import { getProjectList } from '../../../api/people';
import { useProjectStore } from '../../../store/usePeopleStore';
import { KpiCarousel } from '../components/KpiCarousel';
import { KpiCard } from '../components/KpiCard';
import { DataTable } from '../components/DataTable';
import { Pagination } from '../components/Pagination';
import { Toggle } from '../components/Toggle';
import { SearchBar } from '../components/SearchBar';
import { ProjectExportButton } from './ProjectExportButton';

// ── Health badge ────────────────────────────────────────────────
function HealthBadge({ score }) {
  if (score === null || score === undefined) return <span className="text-gray-400">—</span>;
  let color = '#22c55e'; // green
  let label = 'Healthy';
  if (score < 70) { color = '#e32200'; label = 'At Risk'; }
  else if (score < 85) { color = '#e89800'; label = 'Warning'; }

  return (
    <span
      className="px-2 py-0.5 rounded text-[10px] font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

// ── COE Distribution mini list ──────────────────────────────────
function COEDistribution({ coes }) {
  if (!coes || coes.length === 0) return <span className="text-gray-400 text-[11px]">—</span>;
  return (
    <div className="flex flex-col gap-0.5 min-w-[160px]">
      {coes.map((c, i) => (
        <div key={i} className="flex items-center justify-between text-[11px]">
          <span className="text-gray-600 truncate max-w-[120px]" title={c.name}>{c.name}</span>
          <span className="text-gray-500 ml-2 flex-shrink-0">
            <svg className="w-3 h-3 inline mr-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {c.bodyCount} | {c.fte}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Column definitions ──────────────────────────────────────────
const COLUMNS = [
  {
    key: 'name',
    header: 'Project',
    sortable: true,
    filterable: true,
    filterOptions: ['Client Project', 'Damco IP', 'Damco Accelerator'],
    render: (row) => (
      <div className="min-w-[200px]">
        <div className="font-semibold text-[12px] text-[#1a1a2e] hover:text-[#e32200] cursor-pointer hover:underline">
          {row.name}
        </div>
        <div className="text-[10px] text-gray-400 mt-0.5">{row.client}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {row.tags.map(tag => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded text-[9px] font-medium"
              style={{
                backgroundColor: tag === 'Client Project' ? '#eff6ff' : tag === 'Damco Accelerator' ? '#f5f3ff' : '#f0fdf4',
                color: tag === 'Client Project' ? '#3b82f6' : tag === 'Damco Accelerator' ? '#7c3aed' : '#16a34a',
                border: `1px solid ${tag === 'Client Project' ? '#bfdbfe' : tag === 'Damco Accelerator' ? '#ddd6fe' : '#bbf7d0'}`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: 'coeDistribution',
    header: 'COE Distribution',
    sortable: true,
    filterable: false,
    render: (row) => (
      <div>
        <div className="text-[11px] text-gray-500 mb-1">{row.coeCount} COEs</div>
        <COEDistribution coes={row.coeDistribution} />
      </div>
    ),
  },
  {
    key: 'people',
    header: 'People',
    sortable: true,
    info: true,
    filterable: false,
    render: (row) => (
      <div className="text-[12px]">
        <div className="font-semibold">
          <svg className="w-3 h-3 inline mr-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {row.people.bodyCount} | {row.people.fte}
        </div>
        <div className="text-[11px] text-gray-500 mt-0.5">
          Fully: <svg className="w-2.5 h-2.5 inline text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> {row.fullyAllocated}
        </div>
        <div className="text-[11px] text-gray-500">
          Partial: <svg className="w-2.5 h-2.5 inline text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> {row.partiallyAllocated} | {row.people.fte}
        </div>
      </div>
    ),
  },
  {
    key: 'allocation',
    header: 'Allocation | Allocation Fulfillment',
    sortable: true,
    info: true,
    filterable: true,
    filterOptions: ['0%', '< 50%', '50–80%', '> 80%'],
    render: (row) => (
      <div className="text-[12px]">
        <div>
          <span className="font-semibold text-[#e89800]">{row.allocation}%</span>
          <span className="text-gray-400 mx-1">|</span>
          <span
            className="font-semibold"
            style={{ color: row.allocationFulfillment > 0 ? '#22c55e' : '#e32200' }}
          >
            {row.allocationFulfillment}%
          </span>
        </div>
        <div className="text-[11px] text-gray-500 mt-0.5">
          Fully billed: {row.fullyBilled}
        </div>
        <div className="text-[11px] text-gray-500">
          Partially billed: {row.partiallyBilled}
        </div>
        <div className="text-[11px] text-gray-500">
          Unbilled: {row.unbilled}
        </div>
      </div>
    ),
  },
  {
    key: 'billing',
    header: 'Billing',
    sortable: true,
    info: true,
    filterable: true,
    filterOptions: ['0%', '< 50%', '> 50%'],
    render: (row) => (
      <div className="text-[12px]">
        <div className="font-semibold">{row.billing}%</div>
        <div className="text-[11px] text-gray-500 mt-0.5">Fully billed: {row.fullyBilled}</div>
        <div className="text-[11px] text-gray-500">Partially billed: {row.partiallyBilled}</div>
        <div className="text-[11px] text-gray-500">Unbilled: {row.unbilled}</div>
      </div>
    ),
  },
  {
    key: 'upcomingRelease',
    header: 'Upcoming Release',
    sortable: true,
    info: true,
    render: (row) => (
      <div className="text-[11px] min-w-[120px]">
        {row.upcomingRelease.date ? (
          <>
            <div className="font-medium text-gray-700">{row.upcomingRelease.date}</div>
            {row.upcomingRelease.coeReleases.map((c, i) => (
              <div key={i} className="text-gray-500 mt-0.5">
                {c.coe}: <span className="font-medium">{c.count}</span>
              </div>
            ))}
          </>
        ) : (
          <span className="text-gray-400">No upcoming release</span>
        )}
      </div>
    ),
  },
  {
    key: 'healthScore',
    header: 'Overall Health',
    sortable: true,
    filterable: true,
    filterOptions: ['Healthy', 'Warning', 'At Risk'],
    render: (row) => (
      <div className="text-[12px]">
        <div className="text-gray-500 text-[11px] mb-1">Health score</div>
        <div className="flex items-center gap-1 mb-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: row.healthScore === null ? '#9ca3af' : row.healthScore >= 85 ? '#22c55e' : row.healthScore >= 70 ? '#e89800' : '#e32200',
            }}
          />
          <span className="font-semibold">{row.healthScore ?? 0}</span>
        </div>
        <div className="text-gray-500 text-[11px] mb-1">Service quality</div>
        <HealthBadge score={row.healthScore} />
      </div>
    ),
  },
  {
    key: 'csat',
    header: 'CSAT',
    sortable: true,
    render: (row) => (
      <div className="text-[12px]">
        {row.csat != null ? (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill={i < row.csat ? '#f59e0b' : '#e5e7eb'}
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
            <span className="ml-1 text-[11px] text-gray-500">{row.csat}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-[11px]">—</span>
        )}
      </div>
    ),
  },
  {
    key: 'aiPulse',
    header: 'AI Pulse',
    render: () => <span className="text-gray-400 text-[11px]">—</span>,
  },
  {
    key: 'delivery',
    header: 'Delivery',
    render: () => <span className="text-gray-400 text-[11px]">—</span>,
  },
  {
    key: 'audit',
    header: 'Audit',
    render: () => <span className="text-gray-400 text-[11px]">—</span>,
  },
];

// ── Helper: apply sort + filters ────────────────────────────────
function applyTableOps(rows, sort, filters) {
  let result = [...rows];

  Object.entries(filters).forEach(([key, value]) => {
    if (!value) return;
    if (key === 'name') {
      result = result.filter(r => r.tags.includes(value));
    } else if (key === 'allocation') {
      result = result.filter(r => {
        const v = r.allocation;
        if (value === '0%') return v === 0;
        if (value === '< 50%') return v > 0 && v < 50;
        if (value === '50–80%') return v >= 50 && v <= 80;
        if (value === '> 80%') return v > 80;
        return true;
      });
    } else if (key === 'billing') {
      result = result.filter(r => {
        const v = r.billing;
        if (value === '0%') return v === 0;
        if (value === '< 50%') return v > 0 && v < 50;
        if (value === '> 50%') return v > 50;
        return true;
      });
    } else if (key === 'healthScore') {
      result = result.filter(r => {
        const s = r.healthScore;
        if (value === 'Healthy') return s != null && s >= 85;
        if (value === 'Warning') return s != null && s >= 70 && s < 85;
        if (value === 'At Risk') return s != null && s < 70;
        return true;
      });
    }
  });

  if (sort.column) {
    result.sort((a, b) => {
      let aVal, bVal;
      if (sort.column === 'name') { aVal = a.name; bVal = b.name; }
      else if (sort.column === 'coeDistribution') { aVal = a.coeCount; bVal = b.coeCount; }
      else if (sort.column === 'people') { aVal = a.people.bodyCount; bVal = b.people.bodyCount; }
      else if (sort.column === 'allocation') { aVal = a.allocation; bVal = b.allocation; }
      else if (sort.column === 'billing') { aVal = a.billing; bVal = b.billing; }
      else if (sort.column === 'healthScore') { aVal = a.healthScore ?? -1; bVal = b.healthScore ?? -1; }
      else if (sort.column === 'csat') { aVal = a.csat ?? -1; bVal = b.csat ?? -1; }
      else if (sort.column === 'upcomingRelease') { aVal = a.upcomingRelease.date || ''; bVal = b.upcomingRelease.date || ''; }
      else return 0;

      if (typeof aVal === 'string') return sort.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }

  return result;
}

// ── Project KPI card for active projects ───────────────────────
function ActiveProjectsCard({ data }) {
  return (
    <div className="bg-white rounded border border-[#dee2e6] p-4 min-w-[260px] flex-shrink-0">
      <div className="flex items-center gap-1 mb-2">
        <span className="text-[12px] font-semibold text-gray-700">Active Projects</span>
      </div>
      <div className="text-[28px] font-bold text-gray-800 mb-2">{data.total}</div>
      <div className="flex flex-col gap-1">
        {data.segments.map(seg => (
          <div key={seg.label} className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-gray-600">{seg.label}:</span>
            <span className="font-semibold">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PeopleAllocatedCard({ data }) {
  return (
    <div className="bg-white rounded border border-[#dee2e6] p-4 min-w-[220px] flex-shrink-0">
      <div className="text-[12px] font-semibold text-gray-700 mb-2">People Allocated</div>
      <div className="text-[10px] text-gray-400 mb-2">(Body Count | FTE by Allocation)</div>
      <div className="text-[24px] font-bold text-gray-800">{data.bodyCount} | <span className="text-[18px]">{data.fte}</span></div>
      <div className="flex flex-col gap-1 mt-2">
        <div className="flex items-center gap-2 text-[11px]">
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-gray-600">Fully: <strong>{data.fully.bodyCount}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-gray-600">Partially: <strong>{data.partially.bodyCount}</strong> | {data.partially.fte}</span>
        </div>
      </div>
    </div>
  );
}

function GovernanceCard({ data }) {
  return (
    <div className="bg-white rounded border border-[#dee2e6] p-4 min-w-[220px] flex-shrink-0">
      <div className="text-[12px] font-semibold text-gray-700 mb-2">Governance</div>
      <div className="text-[10px] text-gray-400 mb-2">(Body Count | FTE by Allocation)</div>
      <div className="flex flex-col gap-1">
        {[
          { label: 'BYT', ...data.byt },
          { label: 'T&M', ...data.tm },
          { label: 'Fixed Price', ...data.fixedPrice },
          { label: 'Client Project', ...data.clientProject },
          { label: 'Damco IP', ...data.damcoIP },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between text-[11px]">
            <span className="text-gray-600">{item.label}:</span>
            <span className="font-semibold">{item.bodyCount} | {item.fte}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page component ──────────────────────────────────────────────
export function ProjectPage() {
  const {
    myCOE, setMyCOE,
    search, setSearch,
    sort, setSort,
    filters, setFilter, clearFilter,
    page, setPage,
    pageSize, setPageSize,
    hideDetails, toggleHideDetails,
  } = useProjectStore();

  const [kpis, setKpis] = useState(null);
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await getProjectList({ myCOE, search });
    if (res.success) {
      setKpis(res.data.kpis);
      setAllRows(res.data.rows);
    }
    setLoading(false);
  }, [myCOE, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const processed = useMemo(() => applyTableOps(allRows, sort, filters), [allRows, sort, filters]);
  const pageRows = useMemo(() => processed.slice((page - 1) * pageSize, page * pageSize), [processed, page, pageSize]);

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#dee2e6] bg-white">
        <h1 className="text-[16px] font-semibold text-gray-800">Project</h1>
        <button
          onClick={toggleHideDetails}
          className="flex items-center gap-1 text-[12px] text-gray-500 hover:text-gray-700"
          aria-label="Toggle KPI details"
        >
          {hideDetails ? 'Show details' : 'Hide details'}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={hideDetails ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'} />
          </svg>
        </button>
      </div>

      {/* KPI carousel */}
      {!hideDetails && kpis && (
        <div className="px-5 py-4 border-b border-[#dee2e6] bg-[#f8f9fa]">
          <KpiCarousel>
            <ActiveProjectsCard data={kpis.activeProjects} />
            <PeopleAllocatedCard data={kpis.peopleAllocated} />
            <GovernanceCard data={kpis.governance} />
          </KpiCarousel>
        </div>
      )}

      {/* Table section */}
      <div className="flex flex-col flex-1 bg-white mx-5 my-4 rounded border border-[#dee2e6]">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 flex-wrap gap-2">
          <span className="text-[13px] font-semibold text-gray-800">
            Project ({processed.length})
          </span>
          <div className="flex items-center gap-3">
            <Toggle
              leftLabel="My COE"
              rightLabel="All COE"
              checked={!myCOE}
              onChange={(v) => setMyCOE(!v)}
            />
            <SearchBar placeholder="Search project…" onSearch={setSearch} />
            <ProjectExportButton rows={processed} />
          </div>
        </div>

        <DataTable
          columns={COLUMNS}
          rows={pageRows}
          sort={sort}
          filters={filters}
          onSort={setSort}
          onFilter={setFilter}
          onClear={clearFilter}
          loading={loading}
          emptyMsg="No projects match your current filters."
        />

        <Pagination
          page={page}
          pageSize={pageSize}
          total={processed.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
