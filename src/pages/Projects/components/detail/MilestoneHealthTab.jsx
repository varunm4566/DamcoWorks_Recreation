import { useState } from 'react';
import { DetailPagination } from './shared/DetailPagination.jsx';

function fmtDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function MilestoneStatusBadge({ status }) {
  const map = {
    completed:     { bg: '#DCFFE3', color: '#1D6A36', label: 'Completed' },
    'in-progress': { bg: '#EEF2FF', color: '#3730A3', label: 'In Progress' },
    pending:       { bg: '#F1F3F5', color: '#555',    label: 'Pending' },
    'at-risk':     { bg: '#FFE0DD', color: '#C0392B', label: 'At Risk' },
    delayed:       { bg: '#FFF6EA', color: '#9A5800', label: 'Delayed' },
  };
  const config = map[(status || '').toLowerCase()] || { bg: '#F1F3F5', color: '#333', label: status || '-' };
  return (
    <span
      className="inline-block rounded-full px-2 py-[2px] text-[11px] font-medium whitespace-nowrap"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

function SummaryCard({ label, value, valueColor, sub }) {
  return (
    <div className="border border-border rounded-lg p-3 text-center">
      <div className="text-[22px] font-bold" style={{ color: valueColor || '#000' }}>{value}</div>
      <div className="text-[11px] text-text-muted mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-text-muted mt-0.5">{sub}</div>}
    </div>
  );
}

const PAGE_SIZE = 5;

export function MilestoneHealthTab({ project }) {
  const [page, setPage] = useState(1);

  const milestones = project.milestones || [];
  const totalMilestones = milestones.length;
  const completed = milestones.filter((m) => m.status === 'completed').length;
  const inProgress = milestones.filter((m) => m.status === 'in-progress').length;
  const pending = milestones.filter((m) => m.status === 'pending').length;
  const atRisk = milestones.filter((m) => m.status === 'at-risk').length;
  const delayed = milestones.filter((m) => m.status === 'delayed').length;

  const overallPercent = project.milestone_health_percent != null
    ? parseFloat(project.milestone_health_percent)
    : totalMilestones > 0
      ? Math.round((completed / totalMilestones) * 100)
      : null;

  const percentColor = overallPercent == null ? '#595959'
    : overallPercent >= 75 ? '#37B24D'
    : overallPercent >= 50 ? '#E58715'
    : '#E32200';

  // Client-side pagination
  const totalPages = Math.max(1, Math.ceil(totalMilestones / PAGE_SIZE));
  const pagedRows = milestones.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">

      {/* Summary cards */}
      <div className="grid grid-cols-6 gap-3">
        <SummaryCard label="Total" value={totalMilestones} />
        <SummaryCard label="Completed" value={completed} valueColor="#37B24D" />
        <SummaryCard label="In Progress" value={inProgress} valueColor="#3730A3" />
        <SummaryCard label="Pending" value={pending} valueColor="#595959" />
        <SummaryCard label="At Risk" value={atRisk} valueColor="#E32200" />
        <SummaryCard
          label="Overall %"
          value={overallPercent != null ? `${overallPercent}%` : '-'}
          valueColor={percentColor}
        />
      </div>

      {/* Progress bar */}
      {overallPercent != null && (
        <div>
          <div className="flex items-center justify-between text-[11px] text-text-muted mb-1">
            <span>Milestone Completion</span>
            <span style={{ color: percentColor }}>{overallPercent}%</span>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${overallPercent}%`, backgroundColor: percentColor }}
            />
          </div>
        </div>
      )}

      {/* Milestone Details table */}
      <section>
        <h3 className="text-[14px] font-semibold text-black mb-3">Milestone Details</h3>

        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full text-[12px]">
            <thead className="bg-table-header">
              <tr>
                <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Milestone</th>
                <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Due Date</th>
                <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Completion Date</th>
                <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-[12px] text-text-muted">No milestones defined.</td>
                </tr>
              ) : (
                pagedRows.map((m, idx) => (
                  <tr key={m.id} className={idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}>
                    <td className="px-3 py-2.5 font-medium text-black">{m.name || '-'}</td>
                    <td className="px-3 py-2.5 text-text-secondary whitespace-nowrap">{fmtDate(m.due_date)}</td>
                    <td className="px-3 py-2.5 text-text-secondary whitespace-nowrap">{fmtDate(m.completion_date)}</td>
                    <td className="px-3 py-2.5"><MilestoneStatusBadge status={m.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalMilestones > PAGE_SIZE && (
          <DetailPagination page={page} pageSize={PAGE_SIZE} totalCount={totalMilestones} onPageChange={setPage} />
        )}
      </section>

    </div>
  );
}
