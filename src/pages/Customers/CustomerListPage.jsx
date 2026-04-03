import { useEffect } from 'react';
import { useCustomerStore } from '../../stores/customerStore.js';
import { Pagination } from '../../components/UI/Pagination.jsx';
import { KpiCarousel } from './components/KpiCarousel.jsx';
import { Toolbar } from './components/Toolbar.jsx';
import { ActiveFiltersBar } from './components/ActiveFiltersBar.jsx';
import { CustomerTable } from './components/CustomerTable.jsx';
import { CsatModal } from './components/CsatModal.jsx';

/**
 * Customer List page - main page component
 * Assembles KPI carousel, toolbar, filters, data grid, pagination, and CSAT modal
 */
export function CustomerListPage() {
  const loadCustomers = useCustomerStore((s) => s.loadCustomers);
  const loadKpiSummary = useCustomerStore((s) => s.loadKpiSummary);
  const page = useCustomerStore((s) => s.page);
  const pageSize = useCustomerStore((s) => s.pageSize);
  const totalCount = useCustomerStore((s) => s.totalCount);
  const setPage = useCustomerStore((s) => s.setPage);
  const setPageSize = useCustomerStore((s) => s.setPageSize);
  const isFullscreen = useCustomerStore((s) => s.isFullscreen);
  const error = useCustomerStore((s) => s.error);

  useEffect(() => {
    loadCustomers();
    loadKpiSummary();
  }, []);

  return (
    <div className={`flex flex-col overflow-hidden ${isFullscreen ? 'fixed inset-0 z-40 bg-gray-50 p-4' : 'h-full'}`}>
      {/* KPI Carousel - hidden in fullscreen */}
      {!isFullscreen && (
        <div className="flex-shrink-0">
          <KpiCarousel />
        </div>
      )}

      {/* Toolbar */}
      <div className="flex-shrink-0">
        <Toolbar />
      </div>

      {/* Active Filters */}
      <div className="flex-shrink-0">
        <ActiveFiltersBar />
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex-shrink-0 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-3 flex items-center justify-between">
          <span className="text-sm">{error}</span>
          <button
            onClick={loadCustomers}
            className="text-sm font-medium text-crimson hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Data Grid - takes remaining space, scrolls internally */}
      <div className="flex-1 overflow-hidden min-h-0">
        <CustomerTable />
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

      {/* CSAT Modal */}
      <CsatModal />
    </div>
  );
}
