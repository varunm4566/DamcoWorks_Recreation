import { useEffect } from 'react';
import { useProjectStore } from '../../stores/projectStore.js';
import { Pagination } from '../../components/UI/Pagination.jsx';
import { DivisionTabBar } from './components/DivisionTabBar.jsx';
import { ProjectKpiCards } from './components/ProjectKpiCards.jsx';
import { ProjectToolbar } from './components/ProjectToolbar.jsx';
import { ProjectActiveFiltersBar } from './components/ProjectActiveFiltersBar.jsx';
import { ProjectTable } from './components/ProjectTable.jsx';
import { GlobalFilterPanel } from './components/GlobalFilterPanel.jsx';
import { ProjectDetailPanel } from './components/ProjectDetailPanel.jsx';

/**
 * MyProjects page - main page component
 * Assembles division tabs, KPI cards, toolbar, filters, data table, pagination, and fly-in panels
 */
export function ProjectListPage() {
  const loadProjects = useProjectStore((s) => s.loadProjects);
  const loadKpiSummary = useProjectStore((s) => s.loadKpiSummary);
  const loadDivisionCounts = useProjectStore((s) => s.loadDivisionCounts);
  const loadDmPdmList = useProjectStore((s) => s.loadDmPdmList);
  const page = useProjectStore((s) => s.page);
  const pageSize = useProjectStore((s) => s.pageSize);
  const totalCount = useProjectStore((s) => s.totalCount);
  const setPage = useProjectStore((s) => s.setPage);
  const setPageSize = useProjectStore((s) => s.setPageSize);
  const error = useProjectStore((s) => s.error);

  useEffect(() => {
    loadProjects();
    loadKpiSummary();
    loadDivisionCounts();
    loadDmPdmList();
  }, []);

  return (
    <div className="flex flex-col overflow-hidden h-full">
      {/* Division Tab Bar */}
      <div className="flex-shrink-0">
        <DivisionTabBar />
      </div>

      {/* KPI Cards */}
      <div className="flex-shrink-0">
        <ProjectKpiCards />
      </div>

      {/* Combined row: active filter chips (left) + toolbar controls (right) */}
      <div className="flex-shrink-0 flex items-center gap-2 bg-white border border-border rounded px-3 py-2 mb-2 min-h-[44px]">
        <ProjectActiveFiltersBar />
        <ProjectToolbar />
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex-shrink-0 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-2 flex items-center justify-between">
          <span className="text-sm">{error}</span>
          <button onClick={loadProjects} className="text-sm font-medium text-brand-red hover:underline">
            Retry
          </button>
        </div>
      )}

      {/* Data Table - takes remaining space */}
      <div className="flex-1 overflow-hidden min-h-0">
        <ProjectTable />
      </div>

      {/* Pagination */}
      <div className="flex-shrink-0">
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalCount}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Fly-in panels */}
      <GlobalFilterPanel />
      <ProjectDetailPanel />
    </div>
  );
}
