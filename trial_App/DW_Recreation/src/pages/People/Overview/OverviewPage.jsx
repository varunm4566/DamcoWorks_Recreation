import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOverviewSummary } from '../../../api/people';
import { useOverviewStore } from '../../../store/usePeopleStore';
import { KpiCarousel } from '../components/KpiCarousel';
import { KpiCard } from '../components/KpiCard';
import { DataTable } from '../components/DataTable';
import { Pagination } from '../components/Pagination';
import { Toggle } from '../components/Toggle';
import { OverviewExportButton } from './OverviewExportButton';

// ── Column definitions ──────────────────────────────────────────
const COLUMNS = [
  {
    key: 'coe',
    header: 'COE',
    sortable: true,
    filterable: true,
    filterOptions: [
      'Business Analysis (Insurance)',
      'Delivery Management',
      'Microsoft Dev (Insurance)',
      'Product Management (Insurance)',
      'Java Dev (Insurance)',
    ],
    render: (row) => (
      <div>
        <div className="font-semibold text-[#1a1a2e] text-[12px]">{row.coe}</div>
        <div className="text-[11px] text-gray-400 mt-0.5">
          Managed by: <span className="text-gray-600">{row.managedBy}</span>
        </div>
        <div className="text-[11px] text-gray-400">
          Division: <span className="text-gray-600">{row.division}</span>
        </div>
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
        <div className="font-semibold">{row.people}</div>
        <div className="text-[11px] text-gray-500 mt-0.5">
          Employees: {row.employees}
        </div>
        <div className="text-[11px] text-gray-500">
          Consultant: {row.consultants}
        </div>
        <div className="text-[11px] text-gray-500">
          Interns: {row.interns}
        </div>
      </div>
    ),
  },
  {
    key: 'bandDistribution',
    header: 'Band Distribution',
    info: true,
    render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.bandDistribution.map((b) => (
          <span
            key={b.band}
            className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
            style={{ backgroundColor: '#5c3d8f' }}
          >
            {b.band}: {b.count}
          </span>
        ))}
      </div>
    ),
  },
  {
    key: 'allocation',
    header: 'Allocation',
    sortable: true,
    info: true,
    filterable: true,
    filterOptions: ['< 50%', '50–70%', '> 70%'],
    render: (row) => (
      <div className="text-[12px]">
        <div className="font-semibold text-[#e89800]">{row.allocation.overall}%</div>
        <div className="text-[11px] text-gray-500 mt-0.5">
          Client Project: {row.allocation.clientProject}%
        </div>
        <div className="text-[11px] text-gray-500">
          Damco IP: {row.allocation.damcoIP}%
        </div>
        <div className="text-[11px] text-gray-500">
          Unallocated: {row.allocation.unallocated}%
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
    filterOptions: ['< 30%', '30–60%', '> 60%'],
    render: (row) => (
      <div className="text-[12px]">
        <div className="font-semibold">{row.billing.overall}%</div>
        <div className="text-[11px] text-gray-500 mt-0.5">
          Billed: {row.billing.billed}%
        </div>
        <div className="text-[11px] text-gray-500">
          Non-billed: {row.billing.nonBilled}%
        </div>
      </div>
    ),
  },
  {
    key: 'availability',
    header: 'Availability',
    sortable: true,
    info: true,
    filterable: true,
    filterOptions: ['< 20%', '20–40%', '> 40%'],
    render: (row) => (
      <div className="text-[12px]">
        <div className="font-semibold text-[#e32200]">{row.availability.overall}%</div>
        <div className="text-[11px] text-gray-500 mt-0.5">Fully Available:</div>
        <div className="text-[11px] text-gray-500">
          Now: {row.availability.fullyNow} | 7d: {row.availability.fully7Days} | 30d: {row.availability.fully30Days}
        </div>
        <div className="text-[11px] text-gray-500 mt-0.5">Partially Available:</div>
        <div className="text-[11px] text-gray-500">
          Now: {row.availability.partialNow} | 7d: {row.availability.partial7Days} | 30d: {row.availability.partial30Days}
        </div>
      </div>
    ),
  },
  {
    key: 'coeUtilization',
    header: 'COE Utilization',
    sortable: true,
    render: (row) => (
      <div className="text-[12px]">
        <span
          className="font-semibold"
          style={{ color: row.coeUtilization.percentage > 0 ? '#22c55e' : '#e32200' }}
        >
          {row.coeUtilization.percentage.toFixed(2)}%
        </span>
      </div>
    ),
  },
];

// ── Helper: apply sort + filters client-side ────────────────────
function applyTableOps(rows, sort, filters) {
  let result = [...rows];

  // Filters
  Object.entries(filters).forEach(([key, value]) => {
    if (!value) return;
    if (key === 'coe') {
      result = result.filter(r => r.coe === value);
    } else if (key === 'allocation') {
      result = result.filter(r => {
        const v = r.allocation.overall;
        if (value === '< 50%') return v < 50;
        if (value === '50–70%') return v >= 50 && v <= 70;
        if (value === '> 70%') return v > 70;
        return true;
      });
    } else if (key === 'billing') {
      result = result.filter(r => {
        const v = r.billing.overall;
        if (value === '< 30%') return v < 30;
        if (value === '30–60%') return v >= 30 && v <= 60;
        if (value === '> 60%') return v > 60;
        return true;
      });
    } else if (key === 'availability') {
      result = result.filter(r => {
        const v = r.availability.overall;
        if (value === '< 20%') return v < 20;
        if (value === '20–40%') return v >= 20 && v <= 40;
        if (value === '> 40%') return v > 40;
        return true;
      });
    }
  });

  // Sort
  if (sort.column) {
    result.sort((a, b) => {
      let aVal, bVal;
      if (sort.column === 'coe') { aVal = a.coe; bVal = b.coe; }
      else if (sort.column === 'people') { aVal = a.people; bVal = b.people; }
      else if (sort.column === 'allocation') { aVal = a.allocation.overall; bVal = b.allocation.overall; }
      else if (sort.column === 'billing') { aVal = a.billing.overall; bVal = b.billing.overall; }
      else if (sort.column === 'availability') { aVal = a.availability.overall; bVal = b.availability.overall; }
      else if (sort.column === 'coeUtilization') { aVal = a.coeUtilization.percentage; bVal = b.coeUtilization.percentage; }
      else return 0;

      if (typeof aVal === 'string') return sort.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }

  return result;
}

// ── Page component ──────────────────────────────────────────────
export function OverviewPage() {
  const navigate = useNavigate();
  const {
    myCOE, setMyCOE,
    sort, setSort,
    filters, setFilter, clearFilter,
    page, setPage,
    pageSize, setPageSize,
    hideDetails, toggleHideDetails,
  } = useOverviewStore();

  const [kpis, setKpis] = useState(null);
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await getOverviewSummary({ myCOE });
    if (res.success) {
      setKpis(res.data.kpis);
      setAllRows(res.data.rows);
    }
    setLoading(false);
  }, [myCOE]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const processed = useMemo(() => applyTableOps(allRows, sort, filters), [allRows, sort, filters]);
  const pageRows = useMemo(() => processed.slice((page - 1) * pageSize, page * pageSize), [processed, page, pageSize]);

  // COE drilldown → People page filtered by COE
  const handleCOEClick = (row) => {
    navigate(`/people/people?COEId=${row.id}&COEName=${encodeURIComponent(row.coe)}`);
  };

  // Build columns with drilldown injected on COE cell
  const columns = useMemo(() => COLUMNS.map(col =>
    col.key === 'coe'
      ? {
          ...col,
          render: (row) => (
            <div>
              <button
                onClick={() => handleCOEClick(row)}
                className="font-semibold text-[#1a1a2e] text-[12px] hover:text-[#e32200] hover:underline text-left"
                aria-label={`Drill down to ${row.coe}`}
              >
                {row.coe}
              </button>
              <div className="text-[11px] text-gray-400 mt-0.5">
                Managed by: <span className="text-gray-600">{row.managedBy}</span>
              </div>
              <div className="text-[11px] text-gray-400">
                Division: <span className="text-gray-600">{row.division}</span>
              </div>
            </div>
          ),
        }
      : col
  ), []);

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#dee2e6] bg-white">
        <h1 className="text-[16px] font-semibold text-gray-800">Overview</h1>
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
            <KpiCard title="Allocation" type="donut" data={kpis.allocation} />
            <KpiCard title="Billing" type="donut" data={kpis.billing} />
            <KpiCard title="Availability" type="availability" data={kpis.availability} />
          </KpiCarousel>
        </div>
      )}

      {/* Table section */}
      <div className="flex flex-col flex-1 bg-white mx-5 my-4 rounded border border-[#dee2e6]">
        {/* Table toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-gray-800">
              Center of Excellence ({processed.length})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Toggle
              leftLabel="My COE"
              rightLabel="All COE"
              checked={!myCOE}
              onChange={(v) => setMyCOE(!v)}
            />
            <OverviewExportButton rows={processed} />
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          rows={pageRows}
          sort={sort}
          filters={filters}
          onSort={setSort}
          onFilter={setFilter}
          onClear={clearFilter}
          loading={loading}
          emptyMsg="No COEs match your current filters."
        />

        {/* Pagination */}
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
