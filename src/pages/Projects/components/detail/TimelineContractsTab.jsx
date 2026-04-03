import { useState, useEffect } from 'react';
import { fetchProjectContracts } from '../../../../api/projects.js';
import { DetailPagination } from './shared/DetailPagination.jsx';

function fmtDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function fmt(v) {
  if (v === null || v === undefined) return '-';
  const n = parseFloat(v);
  if (isNaN(n)) return '-';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function ContractTypeBadge({ type }) {
  if (!type) return <span className="text-text-muted">-</span>;
  const map = {
    'SOW':        { bg: '#EEF2FF', color: '#3730A3' },
    'MSA':        { bg: '#DCFFE3', color: '#1D6A36' },
    'NDA':        { bg: '#FFF6EA', color: '#9A5800' },
    'Amendment':  { bg: '#F3F0FF', color: '#5B21B6' },
    'PO':         { bg: '#F0F9FF', color: '#075985' },
  };
  const s = map[type] || { bg: '#F1F3F5', color: '#333' };
  return (
    <span
      className="inline-block rounded-full px-2 py-[2px] text-[11px] font-medium"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {type}
    </span>
  );
}

export function TimelineContractsTab({ project }) {
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchProjectContracts(project.id, { page, pageSize })
      .then((data) => { if (!cancelled) { setRows(data.rows); setTotalCount(data.totalCount); } })
      .catch(console.error)
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [project.id, page]);

  const start = project.contract_start_date;
  const end = project.contract_end_date;
  const now = new Date();

  let progressPercent = 0;
  let durationDays = null;
  let elapsedDays = null;
  let remainingDays = null;

  if (start && end) {
    const startMs = new Date(start).getTime();
    const endMs = new Date(end).getTime();
    const nowMs = now.getTime();
    durationDays = Math.round((endMs - startMs) / 86400000);
    elapsedDays = Math.max(0, Math.round((nowMs - startMs) / 86400000));
    remainingDays = Math.max(0, Math.round((endMs - nowMs) / 86400000));
    progressPercent = Math.min(100, Math.max(0, ((nowMs - startMs) / (endMs - startMs)) * 100));
  }

  const isOverdue = end && new Date(end) < now;

  return (
    <div className="space-y-5">

      {/* Timeline section */}
      <section className="border border-border rounded-lg p-4">
        <h3 className="text-[14px] font-semibold text-black mb-4">Project Timeline</h3>

        <div className="grid grid-cols-4 gap-3 mb-4">
          <div>
            <div className="text-[11px] text-text-muted">Contract Start</div>
            <div className="text-[13px] font-semibold text-black mt-0.5">{fmtDate(start)}</div>
          </div>
          <div>
            <div className="text-[11px] text-text-muted">Contract End</div>
            <div className={`text-[13px] font-semibold mt-0.5 ${isOverdue ? 'text-brand-red' : 'text-black'}`}>
              {fmtDate(end)}
              {isOverdue && <span className="ml-1 text-[10px] font-normal">(Overdue)</span>}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-text-muted">Total Duration</div>
            <div className="text-[13px] font-semibold text-black mt-0.5">
              {durationDays != null ? `${durationDays} days` : '-'}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-text-muted">Contract Value</div>
            <div className="text-[13px] font-semibold text-black mt-0.5">{fmt(project.contract_value)}</div>
          </div>
        </div>

        {start && end && (
          <>
            <div className="flex justify-between text-[10px] text-text-muted mb-1">
              <span>{fmtDate(start)}</span>
              <span>Today</span>
              <span>{fmtDate(end)}</span>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: isOverdue ? '#E32200' : progressPercent > 80 ? '#E58715' : '#4C6EF5',
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1.5">
              <span className="text-text-muted">{elapsedDays} days elapsed</span>
              <span className="font-medium" style={{ color: isOverdue ? '#E32200' : '#595959' }}>
                {Math.round(progressPercent)}% through
              </span>
              <span className="text-text-muted">{remainingDays} days remaining</span>
            </div>
          </>
        )}
      </section>

      {/* Contracts table */}
      <section>
        <h3 className="text-[14px] font-semibold text-black mb-3">Contracts</h3>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded border border-border">
              <table className="w-full text-[12px]">
                <thead className="bg-table-header">
                  <tr>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Booking Ref</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Booking Type</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Contract Type</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Updated On</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Updated By</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-[12px] text-text-muted">No contracts found.</td>
                    </tr>
                  ) : (
                    rows.map((contract, idx) => (
                      <tr key={contract.id} className={idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}>
                        <td className="px-3 py-2.5 font-medium text-black">{contract.booking_ref || '-'}</td>
                        <td className="px-3 py-2.5 text-text-secondary">{contract.booking_type || '-'}</td>
                        <td className="px-3 py-2.5"><ContractTypeBadge type={contract.contract_type} /></td>
                        <td className="px-3 py-2.5 text-text-secondary whitespace-nowrap">{fmtDate(contract.updated_on)}</td>
                        <td className="px-3 py-2.5 text-text-secondary">{contract.updated_by || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalCount > 0 && (
              <DetailPagination page={page} pageSize={pageSize} totalCount={totalCount} onPageChange={setPage} />
            )}
          </>
        )}
      </section>

    </div>
  );
}
