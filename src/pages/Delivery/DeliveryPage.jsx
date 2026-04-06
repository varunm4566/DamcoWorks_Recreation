import { useEffect } from 'react';
import { useDeliveryStore } from '../../stores/deliveryStore.js';
import { DeliveryDivisionTabBar } from './components/DeliveryDivisionTabBar.jsx';
import { DeliveryKpiCards } from './components/DeliveryKpiCards.jsx';
import { DeliveryActiveFiltersBar } from './components/DeliveryActiveFiltersBar.jsx';
import { DeliveryTable } from './components/DeliveryTable.jsx';
import { DeliveryPersonModal } from './components/DeliveryPersonModal.jsx';
import { getDeliveryExportUrl } from '../../api/delivery.js';

/**
 * Delivery page — main entry component
 */
export function DeliveryPage() {
  const loadDivisions    = useDeliveryStore((s) => s.loadDivisions);
  const loadKpi          = useDeliveryStore((s) => s.loadKpi);
  const loadTable        = useDeliveryStore((s) => s.loadTable);
  const isFullscreen     = useDeliveryStore((s) => s.isFullscreen);
  const toggleFullscreen = useDeliveryStore((s) => s.toggleFullscreen);
  const activeDivision   = useDeliveryStore((s) => s.activeDivision);
  const filters          = useDeliveryStore((s) => s.filters);
  const error            = useDeliveryStore((s) => s.error);

  const exportUrl = getDeliveryExportUrl(activeDivision, filters.roleType || '');

  useEffect(() => {
    loadDivisions();
    loadKpi();
    loadTable();
  }, []);

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 bg-page p-[14px]' : ''
      }`}
    >
      {/* Division Tab Bar */}
      <div className="flex-shrink-0">
        <DeliveryDivisionTabBar />
      </div>

      {/* KPI Cards */}
      <div className="flex-shrink-0">
        <DeliveryKpiCards />
      </div>

      {/* ── Separator after KPI cards ── */}
      <hr className="flex-shrink-0 border-t border-border mb-3" />

      {/* Toolbar row: "Delivery" title | filters bar (flex-1) | download + fullscreen */}
      <div className="flex-shrink-0 flex items-center gap-3 mb-2">
        {/* Centre: active filter chips — grows to fill space */}
        <div className="flex-1 min-w-0">
          <DeliveryActiveFiltersBar />
        </div>

        {/* Right: Download + Fullscreen */}
        <div className="flex gap-2 flex-shrink-0">
          <a
            href={exportUrl}
            download
            className="flex items-center justify-center bg-white border border-border rounded px-3 h-[32px] hover:bg-[#F1F3F5] transition-colors"
            aria-label="Download delivery data"
            title="Download CSV"
          >
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center bg-white border rounded px-3 h-[32px] hover:bg-[#F1F3F5] transition-colors"
            style={{ borderColor: isFullscreen ? '#E32200' : '#DEE2E6', borderWidth: isFullscreen ? 2 : 1 }}
            aria-label="Toggle fullscreen"
            title="Expand"
          >
            {isFullscreen ? (
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0h5m-5 0v5M15 9l5-5m0 0h-5m5 0v5M9 15l-5 5m0 0h5m-5 0v-5M15 15l5 5m0 0h-5m5 0v-5" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Separator before table ── */}
      <hr className="flex-shrink-0 border-t border-border mb-3" />

      {/* Error banner */}
      {error && (
        <div className="flex-shrink-0 bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 mb-2 flex items-center justify-between">
          <span className="text-[13px]">{error}</span>
          <button onClick={loadTable} className="text-[13px] font-medium text-brand-red hover:underline">
            Retry
          </button>
        </div>
      )}

      {/* Delivery Table */}
      <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
        <DeliveryTable />
      </div>

      {/* Person Detail Modal */}
      <DeliveryPersonModal />
    </div>
  );
}
