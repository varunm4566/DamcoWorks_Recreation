import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';

/** Health badge pill */
function HealthBadge({ status }) {
  const map = {
    healthy:  { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Healthy' },
    caution:  { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Caution' },
    at_risk:  { bg: 'bg-red-100',    text: 'text-red-600',    label: 'At Risk' },
  };
  const s = map[status?.toLowerCase()] || map.healthy;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function ScoreRow({ component, weightage, earnedScore, weightedScore, isTotal }) {
  return (
    <tr className={isTotal ? 'font-semibold bg-gray-50' : ''}>
      <td className="py-2 px-3 text-[12px] text-text-primary">{component}</td>
      <td className="py-2 px-3 text-[12px] text-center">{weightage}</td>
      <td className="py-2 px-3 text-[12px] text-center">{earnedScore ?? '—'}</td>
      <td className="py-2 px-3 text-[12px] text-center font-medium text-green-700">{weightedScore}</td>
    </tr>
  );
}

/**
 * Overall Health / Service Quality popup modal.
 * Opens when clicking a project name or Overall Health badge.
 */
export function OverallHealthModal() {
  const project = useCustomerDetailStore((s) => s.overallHealthModal);
  const close = useCustomerDetailStore((s) => s.closeOverallHealthModal);

  if (!project) return null;

  const marginPct = project.margin_percent ? parseFloat(project.margin_percent).toFixed(0) : 0;
  const payDays = project.payment_timeliness_days || 0;

  const marginHealth = marginPct > 40 ? 'healthy' : marginPct > 10 ? 'caution' : 'at_risk';
  const payHealth = payDays <= 30 ? 'healthy' : payDays <= 60 ? 'caution' : 'at_risk';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={close}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="font-semibold text-text-primary text-[14px] truncate">{project.name}</span>
            <HealthBadge status={project.overall_health} />
          </div>
          <button
            onClick={close}
            className="ml-2 text-text-muted hover:text-text-primary flex-shrink-0"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Engagement model */}
          <p className="text-[12px] text-text-muted">
            Engagement Model: <span className="font-medium text-text-primary">{project.engagement_model || 'T&M'}</span>
          </p>

          {/* Service Quality */}
          <div>
            <h3 className="text-[13px] font-semibold text-text-primary mb-2">Service Quality</h3>

            {/* Delivery Manager thoughts */}
            <div className="bg-gray-50 rounded p-3 mb-3">
              <div className="text-[11px] text-text-muted mb-1 font-medium">Delivery Manager</div>
              <p className="text-[12px] text-text-primary leading-relaxed">
                {project.latest_thought || 'No delivery thoughts recorded yet.'}
              </p>
              {project.thought_author && (
                <p className="text-[11px] text-text-muted mt-1">
                  — {project.thought_author}
                </p>
              )}
            </div>

            {/* Margin */}
            <div className="flex items-center justify-between py-2 border-t border-border">
              <span className="text-[12px] text-text-secondary">Margin</span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-text-primary">{marginPct}%</span>
                <HealthBadge status={marginHealth} />
              </div>
            </div>

            {/* Payment Timeliness */}
            <div className="flex items-center justify-between py-2 border-t border-border">
              <div>
                <span className="text-[12px] text-text-secondary">Payment Timeliness</span>
                <p className="text-[11px] text-text-muted">(avg delay based on last five invoices)</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-text-primary">{payDays} days</span>
                <HealthBadge status={payHealth} />
              </div>
            </div>
          </div>

          {/* Health Score Breakdown accordion */}
          <details className="border border-border rounded">
            <summary className="px-3 py-2 text-[12px] font-semibold text-text-primary cursor-pointer hover:bg-gray-50 select-none">
              Health Score Breakdown
            </summary>
            <div className="border-t border-border">
              <table className="w-full">
                <thead className="bg-table-header">
                  <tr>
                    <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary">Component</th>
                    <th className="py-2 px-3 text-center text-[11px] font-medium text-text-secondary">Weightage</th>
                    <th className="py-2 px-3 text-center text-[11px] font-medium text-text-secondary">Earned Score</th>
                    <th className="py-2 px-3 text-center text-[11px] font-medium text-text-secondary">Weighted Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <ScoreRow component="Service Quality" weightage="40%" earnedScore={100} weightedScore={40} />
                  <ScoreRow component="Margin" weightage="25%" earnedScore={100} weightedScore={25} />
                  <ScoreRow component="Payment Timeliness" weightage="35%" earnedScore={100} weightedScore={35} />
                  <ScoreRow component="Total" weightage="100%" earnedScore={null} weightedScore={100} isTotal />
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
