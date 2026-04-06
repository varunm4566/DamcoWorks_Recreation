import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPeopleList, updatePIP, escalatePerson } from '../../../api/people';
import { usePeopleListStore } from '../../../store/usePeopleStore';
import { KpiCarousel } from '../components/KpiCarousel';
import { KpiCard } from '../components/KpiCard';
import { DataTable } from '../components/DataTable';
import { Pagination } from '../components/Pagination';
import { Toggle } from '../components/Toggle';
import { SearchBar } from '../components/SearchBar';
import { PeopleTabs } from '../components/PeopleTabs';
import { PIPModal, EscalateModal } from '../components/Modal';
import { PeopleExportButton } from './PeopleExportButton';
import { peopleRows, benchRows } from '../../../data/people/peopleData';

// ── Column definitions ──────────────────────────────────────────
function buildColumns({ onPIP, onEscalate, pipRowIds }) {
  return [
    {
      key: 'name',
      header: 'People',
      sortable: true,
      info: true,
      filterable: true,
      filterOptions: ['Software Engineer II (T0/SD0)', 'Lead Business Analyst (T1-1/T1-1-B)', 'Software Engineer Trainee (T0/SD0)'],
      render: (row) => (
        <div className="min-w-[160px]">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[12px] text-[#1a1a2e]">{row.name}</span>
            {(row.isPIP || pipRowIds.has(row.id)) && (
              <span
                className="px-1 py-0.5 text-[9px] font-bold rounded text-white"
                style={{ backgroundColor: '#e32200' }}
              >
                PIP
              </span>
            )}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">{row.empId}</div>
          <div className="text-[10px] text-gray-500">{row.designation}</div>
        </div>
      ),
    },
    {
      key: 'coe',
      header: 'COE & Skills',
      sortable: true,
      filterable: true,
      filterOptions: ['Javascript', 'PHP', 'Business Analysis (Insurance)', 'Microsoft Dev (Insurance)', 'Java Dev (Insurance)', 'Data Visualization'],
      render: (row) => (
        <div className="min-w-[140px]">
          <div className="text-[11px] font-medium text-gray-700 mb-1">{row.coe}</div>
          <div className="flex flex-wrap gap-1">
            {row.skills.map(skill => (
              <span
                key={skill}
                className="px-1.5 py-0.5 rounded text-[9px] font-medium"
                style={{ backgroundColor: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'projects',
      header: 'Projects',
      sortable: true,
      render: (row) => (
        <div className="text-[12px]">
          <div className="font-semibold">{row.projects}</div>
          <div className="text-[11px] text-gray-500">Client Project: {row.clientProjects}</div>
          <div className="text-[11px] text-gray-500">Damco IP: {row.damcoIP}</div>
        </div>
      ),
    },
    {
      key: 'governance',
      header: 'Governance',
      info: true,
      render: (row) => (
        <div className="text-[12px]">
          <div className="text-[11px] text-gray-500">BYT: <span className="font-medium text-gray-700">{row.governance.byt}</span></div>
          <div className="text-[11px] text-gray-500">T&M: <span className="font-medium text-gray-700">{row.governance.tm}</span></div>
          <div className="text-[11px] text-gray-500">FP: <span className="font-medium text-gray-700">{row.governance.fp}</span></div>
          <div className="text-[11px] text-gray-500">(Client | Damco IP): <span className="font-medium text-gray-700">{row.governance.clientDamco}</span></div>
        </div>
      ),
    },
    {
      key: 'allocation',
      header: 'Allocation',
      sortable: true,
      info: true,
      filterable: true,
      filterOptions: ['0%', '< 50%', '50–99%', '100%'],
      render: (row) => {
        if (row.allocation.notApplicable) {
          return <span className="text-[11px] font-medium text-[#e89800]">Not Applicable</span>;
        }
        return (
          <div className="text-[12px]">
            <div className="font-semibold" style={{ color: row.allocation.overall === 100 ? '#22c55e' : row.allocation.overall === 0 ? '#9ca3af' : '#e89800' }}>
              {row.allocation.overall}%
            </div>
            <div className="text-[11px] text-gray-500">Client Project: {row.allocation.clientProject}%</div>
            <div className="text-[11px] text-gray-500">Damco IP: {row.allocation.damcoIP}%</div>
            <div className="text-[11px] text-gray-500">Unallocated: {row.allocation.unallocated}%</div>
          </div>
        );
      },
    },
    {
      key: 'billing',
      header: 'Billing',
      sortable: true,
      info: true,
      filterable: true,
      filterOptions: ['0%', '< 50%', '100%'],
      render: (row) => {
        if (row.billing.notApplicable) {
          return <span className="text-[11px] font-medium text-[#e89800]">Not Applicable</span>;
        }
        return (
          <div className="text-[12px]">
            <div className="font-semibold">{row.billing.overall}%</div>
            <div className="text-[11px] text-gray-500">Billed: {row.billing.billed}%</div>
            <div className="text-[11px] text-gray-500">Non-billed: {row.billing.nonBilled}%</div>
          </div>
        );
      },
    },
    {
      key: 'availability',
      header: 'Availability',
      sortable: true,
      info: true,
      filterable: true,
      filterOptions: ['Unavailable', 'On Bench', 'Partially Available', 'Not Applicable'],
      render: (row) => {
        const statusColors = {
          'Unavailable': '#6b7280',
          'On Bench': '#e32200',
          'Partially Available': '#e89800',
          'Not Applicable': '#9ca3af',
        };
        const color = statusColors[row.availability] || '#374151';
        const isBench = row.availability === 'On Bench';
        return (
          <div className="text-[12px]">
            {isBench ? (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-white"
                style={{ backgroundColor: '#e32200' }}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                On Bench
              </span>
            ) : (
              <span style={{ color }} className="font-medium">{row.availability}</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'upcomingRelease',
      header: 'Upcoming Release',
      sortable: true,
      render: (row) => (
        <div className="text-[11px] min-w-[140px]">
          {row.upcomingRelease.percent > 0 ? (
            <>
              <div className="font-medium text-[#e89800]">{row.upcomingRelease.percent}% From</div>
              <div className="text-[#2563eb] hover:underline cursor-pointer" title={row.upcomingRelease.from}>
                {row.upcomingRelease.from}
              </div>
              <div className="text-gray-500 mt-0.5">Rolloff-date: {row.upcomingRelease.rolloffDate}</div>
            </>
          ) : (
            <div className="text-gray-400">0% From</div>
          )}
          {row.upcomingRelease.rolloffDate && row.upcomingRelease.percent === 0 && (
            <div className="text-gray-500">Rolloff-date: {row.upcomingRelease.rolloffDate}</div>
          )}
        </div>
      ),
    },
    {
      key: 'upcomingLeaves',
      header: 'Upcoming Leaves',
      render: (row) => (
        <div className="text-[11px] text-gray-500">{row.upcomingLeaves}</div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onPIP(row)}
            aria-label={`Mark ${row.name} as PIP`}
            className="px-2 py-0.5 text-[10px] font-medium rounded border transition-colors"
            style={
              row.isPIP || pipRowIds.has(row.id)
                ? { borderColor: '#e32200', color: '#e32200', backgroundColor: '#fee2e2' }
                : { borderColor: '#d1d5db', color: '#374151', backgroundColor: 'white' }
            }
          >
            PIP
          </button>
          <button
            onClick={() => onEscalate(row)}
            aria-label={`Escalate ${row.name}`}
            className="px-2 py-0.5 text-[10px] font-medium rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Escalate
          </button>
        </div>
      ),
    },
  ];
}

// ── Helper: apply sort + filters ────────────────────────────────
function applyTableOps(rows, sort, filters) {
  let result = [...rows];

  Object.entries(filters).forEach(([key, value]) => {
    if (!value) return;
    if (key === 'name') result = result.filter(r => r.designation === value);
    else if (key === 'coe') result = result.filter(r => r.coe === value);
    else if (key === 'availability') result = result.filter(r => r.availability === value);
    else if (key === 'allocation') {
      result = result.filter(r => {
        if (r.allocation.notApplicable) return false;
        const v = r.allocation.overall;
        if (value === '0%') return v === 0;
        if (value === '< 50%') return v > 0 && v < 50;
        if (value === '50–99%') return v >= 50 && v < 100;
        if (value === '100%') return v === 100;
        return true;
      });
    } else if (key === 'billing') {
      result = result.filter(r => {
        if (r.billing.notApplicable) return false;
        const v = r.billing.overall;
        if (value === '0%') return v === 0;
        if (value === '< 50%') return v > 0 && v < 50;
        if (value === '100%') return v === 100;
        return true;
      });
    }
  });

  if (sort.column) {
    result.sort((a, b) => {
      let aVal, bVal;
      if (sort.column === 'name') { aVal = a.name; bVal = b.name; }
      else if (sort.column === 'coe') { aVal = a.coe; bVal = b.coe; }
      else if (sort.column === 'projects') { aVal = a.projects; bVal = b.projects; }
      else if (sort.column === 'allocation') { aVal = a.allocation.overall ?? -1; bVal = b.allocation.overall ?? -1; }
      else if (sort.column === 'billing') { aVal = a.billing.overall ?? -1; bVal = b.billing.overall ?? -1; }
      else if (sort.column === 'availability') { aVal = a.availability; bVal = b.availability; }
      else if (sort.column === 'upcomingRelease') { aVal = a.upcomingRelease.percent; bVal = b.upcomingRelease.percent; }
      else return 0;

      if (typeof aVal === 'string') return sort.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }

  return result;
}

// ── Page component ──────────────────────────────────────────────
export function PeopleListPage() {
  const [searchParams] = useSearchParams();

  const {
    myPeople, setMyPeople,
    activeTab, setActiveTab,
    search, setSearch,
    sort, setSort,
    filters, setFilter, clearFilter,
    page, setPage,
    pageSize, setPageSize,
    hideDetails, toggleHideDetails,
  } = usePeopleListStore();

  const [kpis, setKpis] = useState(null);
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pipModal, setPipModal] = useState({ open: false, person: null });
  const [escalateModal, setEscalateModal] = useState({ open: false, person: null });
  const [pipRowIds, setPipRowIds] = useState(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    const coeId = searchParams.get('COEId');
    const res = await getPeopleList({ myPeople, bench: activeTab === 'bench', search });
    if (res.success) {
      let rows = res.data.rows;
      if (coeId && coeId !== '0') {
        rows = rows.filter(r => String(r.coeId) === coeId);
      }
      setKpis(res.data.kpis);
      setAllRows(rows);
    }
    setLoading(false);
  }, [myPeople, activeTab, search, searchParams]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const processed = useMemo(() => applyTableOps(allRows, sort, filters), [allRows, sort, filters]);
  const pageRows = useMemo(() => processed.slice((page - 1) * pageSize, page * pageSize), [processed, page, pageSize]);

  const handlePIPSubmit = useCallback(async (id, values) => {
    const res = await updatePIP(id, values);
    if (res.success) setPipRowIds(prev => new Set([...prev, id]));
  }, []);

  const handleEscalateSubmit = useCallback(async (id, values) => {
    await escalatePerson(id, values);
  }, []);

  const columns = useMemo(() => buildColumns({
    onPIP: (row) => setPipModal({ open: true, person: row }),
    onEscalate: (row) => setEscalateModal({ open: true, person: row }),
    pipRowIds,
  }), [pipRowIds]);

  const allCount = peopleRows.length;
  const benchCount = benchRows.length;

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#dee2e6] bg-white">
        <h1 className="text-[16px] font-semibold text-gray-800">People</h1>
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
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <PeopleTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              allCount={allCount}
              benchCount={benchCount}
            />
          </div>

          <div className="flex items-center gap-3">
            <Toggle
              leftLabel="My People"
              rightLabel="All People"
              checked={!myPeople}
              onChange={(v) => setMyPeople(!v)}
            />
            {/* List / Calendar view icons */}
            <div className="flex border border-gray-200 rounded overflow-hidden">
              <button
                aria-label="List view"
                className="px-2 py-1 transition-colors"
                style={{ backgroundColor: 'white' }}
              >
                <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                aria-label="Calendar view"
                className="px-2 py-1 border-l border-gray-200 transition-colors"
                style={{ backgroundColor: '#f9fafb' }}
              >
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <SearchBar placeholder="Search name…" onSearch={setSearch} />
            <PeopleExportButton rows={processed} />
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={pageRows}
          sort={sort}
          filters={filters}
          onSort={setSort}
          onFilter={setFilter}
          onClear={clearFilter}
          loading={loading}
          emptyMsg="No people match your current filters."
        />

        <Pagination
          page={page}
          pageSize={pageSize}
          total={processed.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Modals */}
      <PIPModal
        isOpen={pipModal.open}
        onClose={() => setPipModal({ open: false, person: null })}
        person={pipModal.person}
        onSubmit={handlePIPSubmit}
      />
      <EscalateModal
        isOpen={escalateModal.open}
        onClose={() => setEscalateModal({ open: false, person: null })}
        person={escalateModal.person}
        onSubmit={handleEscalateSubmit}
      />
    </div>
  );
}
