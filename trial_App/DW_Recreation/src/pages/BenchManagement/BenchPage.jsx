import { useState, useMemo, useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx-js-style';
import { AppLayout } from '../../components/Layout/AppLayout';
import { DepartmentTabs } from './components/DepartmentTabs';
import { SummaryCards, PARKED_DECISIONS } from './components/SummaryCards';
import { SkillsRow } from './components/SkillsRow';
import { BenchTable } from './components/BenchTable';
import { Pagination } from './components/Pagination';
import { UpdateActionPlanModal } from './components/UpdateActionPlanModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { FutureBenchModal } from './components/FutureBenchModal';
import {
  fetchBenchResources,
  fetchDepartments,
  fetchFutureBench,
  saveActionPlan,
} from '../../api/bench';

// ─── Export toast ─────────────────────────────────────────────────────────────
function ExportToast({ show }) {
  if (!show) return null;
  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 text-white text-[13px] rounded shadow"
      style={{ backgroundColor: '#1d4ed8' }}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Please wait while your sheet is being prepared.
    </div>
  );
}

// ─── Applied filter chip — compact tag matching OutSystems filter bar ────────
function FilterChip({ label, onClear }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        fontSize: 12,
        borderRadius: 4,
        backgroundColor: 'rgba(26,86,219,0.08)',
        border: '1px solid #1a56db',
        color: '#1a56db',
      }}
    >
      {label}
      <button
        onClick={onClear}
        style={{ fontSize: 14, lineHeight: 1, fontWeight: 700, color: '#1a56db', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        ×
      </button>
    </span>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="mt-auto flex items-center justify-between px-6 py-3 text-white text-[12px]"
      style={{ backgroundColor: '#494949' }}
    >
      <span>© Damcoworks. All Rights Reserved</span>
      <div className="flex gap-4">
        <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>Privacy Statement</a>
        <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>Copyright</a>
        <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>Terms &amp; Conditions</a>
      </div>
    </footer>
  );
}

// ─── BenchPage ────────────────────────────────────────────────────────────────
export function BenchPage() {
  // ─── Remote data ────────────────────────────────────────────────────────────
  const [tableData,    setTableData]    = useState([]);
  const [deptTabs,     setDeptTabs]     = useState([]);
  const [futureBench,  setFutureBench]  = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([
      fetchBenchResources(),
      fetchDepartments(),
      fetchFutureBench(),
    ]).then(([resources, depts, future]) => {
      setTableData(resources);
      // Build tab shape: [{ label, count }, ...] with 'All' last
      const tabs = depts
        .filter((d) => d.division !== 'All')
        .map((d) => ({ label: d.division, count: d.count }));
      const allRow = depts.find((d) => d.division === 'All');
      setDeptTabs([...tabs, { label: 'All', count: allRow?.count ?? 0 }]);
      setFutureBench(future);
    }).catch((err) => {
      console.error('Failed to load bench data:', err);
    }).finally(() => setLoading(false));
  }, []);

  // Filter state
  const [activeTab, setActiveTab]       = useState('All');
  const [activeSkill, setActiveSkill]   = useState(null);
  const [sortOrder, setSortOrder]       = useState('desc');        // 'desc' bench days | 'asc' name
  const [filterType, setFilterType]     = useState('People');
  const [filterValue, setFilterValue]   = useState('');

  // Card-driven filter — set by clicking numbers in summary cards
  // Shape: { type: string, value: any, label: string } | null
  const [cardFilter, setCardFilter]     = useState(null);

  // Pagination
  const [currentPage, setCurrentPage]   = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Modal / drawer state
  const [modalOpen, setModalOpen]       = useState(false);
  const [modalRow, setModalRow]         = useState(null);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [drawerRow, setDrawerRow]       = useState(null);
  const [futureBenchOpen, setFutureBenchOpen] = useState(false);

  // Export toast
  const [showToast, setShowToast]       = useState(false);

  // ─── Derived: tab-filtered data (for summary cards) ──────────────────────
  // Cards always reflect the active division, but NOT card/skill/search filters
  const tabFilteredData = useMemo(() => {
    if (activeTab === 'All') return tableData;
    return tableData.filter((r) => r.division === activeTab);
  }, [tableData, activeTab]);

  // ─── Derived: filtered + sorted data ─────────────────────────────────────
  const filteredData = useMemo(() => {
    let data = [...tableData];

    // 1. Department tab
    if (activeTab !== 'All') {
      data = data.filter((r) => r.division === activeTab);
    }

    // 2. Skill chip
    if (activeSkill) {
      data = data.filter((r) => r.primarySkill === activeSkill);
    }

    // 3. People / Emp Code column filter
    if (filterValue.trim()) {
      const q = filterValue.trim().toLowerCase();
      if (filterType === 'People') {
        data = data.filter((r) => r.name.toLowerCase().includes(q));
      } else {
        data = data.filter((r) => r.empCode.toLowerCase().includes(q));
      }
    }

    // 4. Card filter — set by clicking a summary card metric
    if (cardFilter) {
      const { type, value } = cardFilter;
      if (type === 'employeeType') {
        data = data.filter((r) => r.employeeType === value);
      } else if (type === 'parked') {
        data = data.filter((r) => PARKED_DECISIONS.includes(r.hrDecision));
      } else if (type === 'hrDecision') {
        data = data.filter((r) => r.hrDecision === value);
      } else if (type === 'remarks') {
        // Non-actionable category matched via remarks text (e.g. "Maternity")
        data = data.filter((r) => r.remarks?.toLowerCase().includes(value.toLowerCase()));
      } else if (type === 'actionable') {
        // Actionable = not parked, not Cons(T&M), not Long Leave, not Maternity
        const nonActionableDecisions = ['Long Leave/Sabbatical', 'Resigned'];
        data = data.filter(
          (r) =>
            r.employeeType !== 'Cons(T&M)' &&
            !nonActionableDecisions.includes(r.hrDecision) &&
            !r.remarks?.toLowerCase().includes('maternity') &&
            !r.remarks?.toLowerCase().includes('parked')
        );
      } else if (type === 'aging') {
        if (value === '0-30')  data = data.filter((r) => r.benchDays <= 30);
        if (value === '31-60') data = data.filter((r) => r.benchDays >= 31 && r.benchDays <= 60);
        if (value === '61-90') data = data.filter((r) => r.benchDays >= 61 && r.benchDays <= 90);
        if (value === '>90')   data = data.filter((r) => r.benchDays > 90);
      }
    }

    // 5. Sort
    if (sortOrder === 'desc') {
      data.sort((a, b) => b.benchDays - a.benchDays);
    } else {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    return data;
  }, [tableData, activeTab, activeSkill, filterType, filterValue, cardFilter, sortOrder]);

  // ─── Derived: dynamic skills from currently filtered listing ─────────────
  const dynamicSkills = useMemo(() => {
    const map = {};
    filteredData.forEach((r) => {
      if (r.primarySkill) map[r.primarySkill] = (map[r.primarySkill] || 0) + 1;
    });
    return Object.entries(map)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count || a.skill.localeCompare(b.skill));
  }, [filteredData]);

  // ─── Derived: paginated slice ─────────────────────────────────────────────
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // ─── Active filter chips — derived from all active filter states ──────────
  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (activeTab !== 'All')   chips.push({ key: 'tab',    label: `Department: ${activeTab}` });
    if (activeSkill)            chips.push({ key: 'skill',  label: `Skill: ${activeSkill}` });
    if (filterValue.trim())     chips.push({ key: 'people', label: `${filterType}: ${filterValue.trim()}` });
    if (cardFilter)             chips.push({ key: 'card',   label: cardFilter.label });
    return chips;
  }, [activeTab, activeSkill, filterType, filterValue, cardFilter]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const handleSkillChange = useCallback((skill) => {
    setActiveSkill(skill);
    setCurrentPage(1);
  }, []);

  const handleSortToggle = useCallback(() => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  }, []);

  const handleFilterChange = useCallback((type, value) => {
    setFilterType(type);
    setFilterValue(value);
    setCurrentPage(1);
  }, []);

  // Called by SummaryCards when a metric number is clicked
  const handleCardFilter = useCallback((filterObj) => {
    setCardFilter(filterObj);   // null clears the card filter
    setCurrentPage(1);
  }, []);

  // Clear a specific chip
  const handleClearChip = useCallback((key) => {
    if (key === 'tab')    { setActiveTab('All');          setCurrentPage(1); }
    if (key === 'skill')  { setActiveSkill(null);         setCurrentPage(1); }
    if (key === 'people') { setFilterValue('');           setCurrentPage(1); }
    if (key === 'card')   { setCardFilter(null);          setCurrentPage(1); }
  }, []);

  const handleClearAll = useCallback(() => {
    setActiveTab('All');
    setActiveSkill(null);
    setFilterValue('');
    setCardFilter(null);
    setCurrentPage(1);
  }, []);

  const handleOpenModal = useCallback((row) => {
    setModalRow(row);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setModalRow(null);
  }, []);

  const handleSave = useCallback(async (rowId, updates) => {
    try {
      const updated = await saveActionPlan(rowId, updates);
      setTableData((prev) =>
        prev.map((row) => (row.id === rowId ? { ...row, ...updated } : row))
      );
    } catch (err) {
      console.error('Failed to save action plan:', err);
      // Optimistic fallback — update locally so the UI still reflects the change
      setTableData((prev) =>
        prev.map((row) => (row.id === rowId ? { ...row, ...updates } : row))
      );
    }
  }, []);

  const handleNameClick = useCallback((row) => {
    setDrawerRow(row);
    setDrawerOpen(true);
  }, []);

  const handleExport = useCallback(() => {
    // ── Column structure (mirrors screenshot) ─────────────────────────────────
    // Row 1: merged super-headers
    // Row 2: sub-headers
    // Row 3+: data

    const wb = XLSX.utils.book_new();
    const ws = {};

    // ── Style helpers ─────────────────────────────────────────────────────────
    const hdrStyle = (bgColor) => ({
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
      fill: { fgColor: { rgb: bgColor } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
    });
    const subHdrStyle = (bgColor) => ({
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 9 },
      fill: { fgColor: { rgb: bgColor } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
    });
    const cellStyle = {
      font: { sz: 9 },
      alignment: { vertical: 'top', wrapText: true },
      border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
    };

    const setCell = (col, row, value, style) => {
      const addr = XLSX.utils.encode_cell({ c: col, r: row });
      ws[addr] = { v: value ?? '', t: 's', s: style };
    };

    // ── Row 0: Title ──────────────────────────────────────────────────────────
    setCell(0, 0, 'BENCH RESOURCE TRACKER', {
      font: { bold: true, sz: 13, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1F3864' } },
      alignment: { horizontal: 'center', vertical: 'center' },
    });

    // ── Row 1: Super-headers — colors from screenshot ─────────────────────────
    setCell(0,  1, 'Resource Information', hdrStyle('F5F5DC'  )); // cream/yellow, dark text override below
    setCell(5,  1, 'BENCH',                hdrStyle('1E5631'  )); // dark green
    setCell(8,  1, 'PREVIOUS ENGAGEMENT',  hdrStyle('1F3864'  )); // dark navy
    setCell(14, 1, 'FINANCIALS',           hdrStyle('C55A11'  )); // orange
    setCell(17, 1, 'PERFORMANCE',          hdrStyle('7030A0'  )); // purple
    setCell(19, 1, 'ACTION & STATUS',      hdrStyle('C00000'  )); // red
    setCell(22, 1, 'SUGGESTED ADDITIONS',  hdrStyle('375623'  )); // dark teal/green

    // Resource Information has a light background — override font color to dark
    const riAddr = XLSX.utils.encode_cell({ c: 0, r: 1 });
    ws[riAddr].s.font = { bold: true, color: { rgb: '1F3864' }, sz: 10 };

    // ── Row 2: Sub-headers ────────────────────────────────────────────────────
    const subHeaders = [
      // Resource Info (0-4)
      'Relationship Type', 'Employment Type', 'Employee Name', 'Employee Code', 'Date of Joining',
      // Bench (5-7)
      'Skill / Tech Stack', 'Designation', 'Division',
      // Bench health (8)  — keeping under BENCH visually but Previous Engagement starts at 8
      // Previous Engagement (8-13)
      'Bench Health (Age)', 'On Bench Since', 'Days on Bench',
      'Last Project', 'Engagement Model', 'Role in Project',
      // Wait — aligning to screenshot columns
    ];

    // Flatten sub-headers in column order
    const cols = [
      // 0-4 Resource Info
      { label: 'Relationship Type' },
      { label: 'Employment Type' },
      { label: 'Employee Name' },
      { label: 'Employee Code' },
      { label: 'Date of Joining' },
      // 5-7 Bench
      { label: 'Skill / Tech Stack' },
      { label: 'Designation' },
      { label: 'Division' },
      // 8-13 Previous Engagement
      { label: 'Bench Health (Age)' },
      { label: 'On Bench Since' },
      { label: 'Days on Bench' },
      { label: 'Last Project' },
      { label: 'Engagement Model' },
      { label: 'Role in Project' },
      // 14-16 Financials
      { label: 'Allocation %' },
      { label: 'Feedback from last DM' },
      { label: 'Billed (Y/N)' },
      // 17-18 Performance (using Financials bg since it's close)
      { label: 'CTC (INR/Month)' },
      { label: 'Resource Margin %' },
      // 19-21 Action & Status
      { label: 'Last Appraisal Rating' },
      { label: 'Delivery Manager' },
      { label: 'HR Decision Status' },
      { label: 'HR Remarks' },
      // 22-23 Suggested Additions
      { label: 'Target Deployment Date' },
      { label: 'Last Updated By' },
    ];

    // Sub-header colors match their section super-header
    const subHdrColors = [
      'BDD7EE','BDD7EE','BDD7EE','BDD7EE','BDD7EE',   // Resource Info — light blue
      'C6EFCE','C6EFCE','C6EFCE',                       // Bench — light green
      'D9E1F2','D9E1F2','D9E1F2','D9E1F2','D9E1F2','D9E1F2', // Prev Engagement — light navy
      'FCE4D6','FCE4D6','FCE4D6',                       // Financials — light orange
      'E8D5F5','E8D5F5',                                // Performance — light purple
      'FFCCCC','FFCCCC','FFCCCC','FFCCCC',              // Action & Status — light red
      'D9EAD3','D9EAD3',                                // Suggested — light green
    ];
    cols.forEach((col, i) => setCell(i, 2, col.label, subHdrStyle(subHdrColors[i] || 'F2F2F2')));
    // Sub-header text color dark for light backgrounds
    cols.forEach((_, i) => {
      const addr = XLSX.utils.encode_cell({ c: i, r: 2 });
      if (ws[addr]) ws[addr].s.font = { bold: true, color: { rgb: '111111' }, sz: 9 };
    });

    // ── Merges ────────────────────────────────────────────────────────────────
    ws['!merges'] = [
      // Title row
      { s: { r: 0, c: 0 }, e: { r: 0, c: cols.length - 1 } },
      // Super-header groups
      { s: { r: 1, c: 0  }, e: { r: 1, c: 4  } }, // Resource Information
      { s: { r: 1, c: 5  }, e: { r: 1, c: 7  } }, // BENCH
      { s: { r: 1, c: 8  }, e: { r: 1, c: 13 } }, // Previous Engagement
      { s: { r: 1, c: 14 }, e: { r: 1, c: 16 } }, // Financials
      { s: { r: 1, c: 17 }, e: { r: 1, c: 18 } }, // Performance
      { s: { r: 1, c: 19 }, e: { r: 1, c: 21 } }, // Action & Status
      { s: { r: 1, c: 22 }, e: { r: 1, c: 23 } }, // Suggested Additions
    ];

    // ── Data rows ─────────────────────────────────────────────────────────────
    filteredData.forEach((r, idx) => {
      const row = idx + 3;
      const d = [
        '',                                                        // Relationship Type
        r.employeeType ?? '',
        r.name ?? '',
        r.empCode ?? '',
        r.benchSince ? String(r.benchSince).slice(0, 10) : '',    // Date of Joining (using bench since as proxy)
        r.primarySkill ?? '',
        '',                                                        // Designation
        r.division ?? '',
        r.attentionStatus ?? '',                                   // Bench Health
        r.benchSince ? String(r.benchSince).slice(0, 10) : '',
        String(r.benchDays ?? ''),
        r.lastProject ?? '',
        r.engagementType ?? '',
        r.role ?? '',
        r.allocation != null ? `${r.allocation}%` : '',
        '',                                                        // Feedback from last DM
        r.billing === 'Billed' ? 'Y' : 'N',
        r.monthlyCTC != null ? `₹${r.monthlyCTC}` : '',
        r.resourceMargin != null ? `${r.resourceMargin}%` : '',
        '',                                                        // Last Appraisal Rating
        r.dm ?? '',
        r.hrDecision ?? '',
        r.remarks ?? '',
        r.timeline ? String(r.timeline).slice(0, 10) : '',        // Target Deployment Date
        '',                                                        // Last Updated By
      ];
      d.forEach((val, c) => setCell(c, row, val, cellStyle));
    });

    // ── Column widths ─────────────────────────────────────────────────────────
    ws['!cols'] = [
      { wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 12 }, { wch: 13 },
      { wch: 22 }, { wch: 18 }, { wch: 16 },
      { wch: 14 }, { wch: 13 }, { wch: 10 }, { wch: 28 }, { wch: 14 }, { wch: 20 },
      { wch: 10 }, { wch: 18 }, { wch: 9  },
      { wch: 14 }, { wch: 14 },
      { wch: 16 }, { wch: 18 }, { wch: 28 }, { wch: 30 },
      { wch: 18 }, { wch: 16 },
    ];

    // ── Row heights ───────────────────────────────────────────────────────────
    ws['!rows'] = [
      { hpt: 22 },  // title
      { hpt: 30 },  // super-headers
      { hpt: 36 },  // sub-headers
      ...filteredData.map(() => ({ hpt: 50 })),
    ];

    ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: filteredData.length + 2, c: cols.length - 1 } });

    XLSX.utils.book_append_sheet(wb, ws, 'Bench Resources');
    XLSX.writeFile(wb, 'Bench_Resource_Tracker.xlsx');
  }, [filteredData]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          Loading bench data…
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ExportToast show={showToast} />

      {/* Department tabs */}
      <DepartmentTabs activeTab={activeTab} onTabChange={handleTabChange} tabs={deptTabs} />

      {/* Summary cards — driven by tab-filtered data */}
      <SummaryCards
        data={tabFilteredData}
        futureBenchCount={futureBench.length}
        cardFilter={cardFilter}
        onCardFilter={handleCardFilter}
        onOpenFutureBench={() => setFutureBenchOpen(true)}
      />

      {/* Skills row — dynamic from currently filtered listing */}
      <SkillsRow
        skills={dynamicSkills}
        activeSkill={activeSkill}
        onSkillChange={handleSkillChange}
        onExport={handleExport}
      />

      {/* ─── Active filter bar ── */}
      {activeFilterChips.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-2 px-3 py-1.5"
          style={{ borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}
        >
          <span style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>Filter:</span>
          {activeFilterChips.map((chip) => (
            <FilterChip
              key={chip.key}
              label={chip.label}
              onClear={() => handleClearChip(chip.key)}
            />
          ))}
          <button
            onClick={handleClearAll}
            style={{ fontSize: 12, color: '#1a56db', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            className="hover:underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Main table */}
      <div className="flex-1 pb-2 min-w-0">
        <BenchTable
          data={paginatedData}
          sortOrder={sortOrder}
          onSortToggle={handleSortToggle}
          filterType={filterType}
          filterValue={filterValue}
          onFilterChange={handleFilterChange}
          onOpenModal={handleOpenModal}
          onNameClick={handleNameClick}
        />

        <Pagination
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1);
          }}
        />
      </div>

      <Footer />

      {/* Update Action Plan modal */}
      <UpdateActionPlanModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        row={modalRow}
        onSave={handleSave}
      />

      {/* Profile drawer */}
      <ProfileDrawer
        isOpen={drawerOpen}
        onClose={() => { setDrawerOpen(false); setDrawerRow(null); }}
        row={drawerRow}
      />

      {/* Future Bench modal */}
      <FutureBenchModal
        isOpen={futureBenchOpen}
        onClose={() => setFutureBenchOpen(false)}
        data={futureBench}
      />
    </AppLayout>
  );
}
