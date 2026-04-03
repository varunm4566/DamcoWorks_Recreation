import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';

function HealthBadge({ status }) {
  const map = {
    healthy: { bg: 'bg-green-100', text: 'text-green-700', label: 'Healthy' },
    caution: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Caution' },
    at_risk: { bg: 'bg-red-100',   text: 'text-red-600',   label: 'At Risk' },
  };
  const s = map[status?.toLowerCase()] || map.healthy;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function MetricCard({ label, primary, secondary, badge }) {
  return (
    <div className="flex-1 border border-border rounded-lg p-3">
      <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2">{label}</div>
      <div className="text-[22px] font-bold text-text-primary">{primary}</div>
      {secondary && <div className="text-[12px] text-text-secondary mt-0.5">{secondary}</div>}
      {badge && <div className="mt-2">{badge}</div>}
    </div>
  );
}

/**
 * Financial Health popup modal.
 * Opens when clicking the Financial Health badge on a project row.
 */
export function FinancialHealthModal() {
  const project = useCustomerDetailStore((s) => s.financialHealthModal);
  const close   = useCustomerDetailStore((s) => s.closeFinancialHealthModal);

  if (!project) return null;

  const marginPct = project.margin_percent ? parseFloat(project.margin_percent).toFixed(0) : 0;
  const payDays   = project.payment_timeliness_days || 0;
  const paytermDays = project.payterm_days || 60;

  const marginHealth = marginPct > 40 ? 'healthy' : marginPct > 10 ? 'caution' : 'at_risk';
  const payHealth    = payDays <= 30 ? 'healthy' : payDays <= 60 ? 'caution' : 'at_risk';

  // Mock last 5 invoice rows for display
  const mockInvoices = [
    { no: 'CUB/1904/0001', sentDate: 'Jan 15, 2026', dueDate: 'Mar 16, 2026', receivedDate: '—', remark: 'Not overdue', dot: 'green' },
    { no: 'CUB/1904/0002', sentDate: 'Dec 12, 2025', dueDate: 'Feb 10, 2026', receivedDate: '—', remark: 'Not overdue', dot: 'green' },
    { no: 'CUB/1904/0003', sentDate: 'Nov 10, 2025', dueDate: 'Jan 09, 2026', receivedDate: 'Jan 07, 2026', remark: 'Paid on time', dot: 'green' },
    { no: 'CUB/1904/0004', sentDate: 'Oct 08, 2025', dueDate: 'Dec 07, 2025', receivedDate: 'Dec 05, 2025', remark: 'Paid on time', dot: 'green' },
    { no: 'CUB/1904/0005', sentDate: 'Sep 10, 2025', dueDate: 'Nov 09, 2025', receivedDate: 'Nov 08, 2025', remark: 'Paid on time', dot: 'green' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={close}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <div className="font-semibold text-[14px] text-text-primary">{project.name}</div>
            <div className="text-[12px] text-text-muted mt-0.5">
              Engagement Model: {project.engagement_model || 'T&M'}
            </div>
          </div>
          <button onClick={close} className="text-text-muted hover:text-text-primary" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Financial Health + badge */}
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-text-primary">Financial Health</span>
            <HealthBadge status={project.financial_health || 'healthy'} />
          </div>

          {/* Metric cards */}
          <div className="flex gap-3">
            <MetricCard
              label="Margin"
              primary={`${marginPct}%`}
              secondary={`Target: 40% | Gap: ${Math.max(0, 40 - marginPct)}%`}
              badge={<HealthBadge status={marginHealth} />}
            />
            <MetricCard
              label="Payment Timeliness"
              primary={`${payDays} days avg delay`}
              secondary="0 violations"
              badge={<HealthBadge status={payHealth} />}
            />
          </div>

          {/* Payterm violations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-text-primary">
                Payterm Violations (Last 5 Invoices)
              </span>
              <span className="text-[11px] text-text-muted">* Payterm days: {paytermDays}</span>
            </div>
            <div className="overflow-x-auto rounded border border-border">
              <table className="w-full min-w-[560px]">
                <thead className="bg-table-header">
                  <tr>
                    {['Invoice#', 'Invoice Sent Date', 'Invoice Due Date', 'Payment Receive Date', 'Remarks'].map((h) => (
                      <th key={h} className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockInvoices.map((inv, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}>
                      <td className="py-2 px-3 text-[12px]">{inv.no}</td>
                      <td className="py-2 px-3 text-[12px]">{inv.sentDate}</td>
                      <td className="py-2 px-3 text-[12px]">{inv.dueDate}</td>
                      <td className="py-2 px-3 text-[12px]">{inv.receivedDate}</td>
                      <td className="py-2 px-3 text-[12px]">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${inv.dot === 'green' ? 'bg-health-green' : 'bg-health-orange'}`} />
                          {inv.remark}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Benchmark accordion */}
          <details className="border border-border rounded">
            <summary className="px-3 py-2 text-[12px] font-semibold text-text-primary cursor-pointer hover:bg-gray-50 select-none">
              Benchmark
            </summary>
            <div className="px-3 py-3 border-t border-border space-y-3 text-[12px]">
              <div>
                <div className="font-medium text-text-primary mb-1">Margin Benchmark</div>
                <div className="flex gap-3">
                  <span className="text-green-700">● Green: &gt;40%</span>
                  <span className="text-amber-600">● Amber: 11–40%</span>
                  <span className="text-red-600">● Red: ≤10%</span>
                </div>
              </div>
              <div>
                <div className="font-medium text-text-primary mb-1">Payment Benchmark</div>
                <div className="flex gap-3">
                  <span className="text-green-700">● Green: Avg delay ≤30 days</span>
                  <span className="text-amber-600">● Amber: 31–60 days</span>
                  <span className="text-red-600">● Red: &gt;60 days</span>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
