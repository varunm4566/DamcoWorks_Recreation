import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';

/**
 * Project-wise revenue breakdown modal.
 * Used by both monthly (Current FY) and yearly (Lifetime) revenue tables.
 */
export function BreakdownModal() {
  const modal   = useCustomerDetailStore((s) => s.breakdownModal);
  const loading = useCustomerDetailStore((s) => s.breakdownLoading);
  const close   = useCustomerDetailStore((s) => s.closeBreakdownModal);

  if (!modal) return null;

  const rows = modal.rows || [];

  const formatTitle = (key) => {
    // 'YYYY-MM' → 'Jan - 26', 'YYYY-YY' → pass through
    if (/^\d{4}-\d{2}$/.test(key)) {
      const [year, month] = key.split('-');
      const shortMonth = new Date(year, parseInt(month, 10) - 1).toLocaleString('en-US', { month: 'short' });
      return `${shortMonth} - ${year.slice(2)}`;
    }
    return key;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={close}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <div className="font-semibold text-[14px] text-text-primary">Project Wise Breakdown</div>
            <div className="text-[12px] text-text-muted mt-0.5">
              {rows.length} Projects | {formatTitle(modal.title)}
            </div>
          </div>
          <button onClick={close} className="text-text-muted hover:text-text-primary" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="h-3 bg-gray-200 rounded flex-1" />
                  <div className="h-3 bg-gray-200 rounded w-20" />
                  <div className="h-3 bg-gray-200 rounded w-12" />
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="py-10 text-center text-text-muted text-[13px]">No data available.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-table-header">
                <tr>
                  <th className="py-2 px-4 text-left text-[11px] font-medium text-text-secondary">Project Name</th>
                  <th className="py-2 px-4 text-right text-[11px] font-medium text-text-secondary">Revenue</th>
                  <th className="py-2 px-4 text-right text-[11px] font-medium text-text-secondary">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}>
                    <td className="py-2.5 px-4 text-[12px] text-text-primary">{row.project_name}</td>
                    <td className="py-2.5 px-4 text-right text-[12px] text-text-primary">
                      ${(parseFloat(row.revenue_usd) / 1000).toFixed(2)}K
                    </td>
                    <td className="py-2.5 px-4 text-right text-[12px] text-text-primary">{row.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
