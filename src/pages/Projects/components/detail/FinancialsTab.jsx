import { useState, useEffect } from 'react';
import { fetchProjectInvoices } from '../../../../api/projects.js';
import { DetailPagination } from './shared/DetailPagination.jsx';

function fmt(v) {
  if (v === null || v === undefined) return '-';
  const n = parseFloat(v);
  if (isNaN(n)) return '-';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function KpiCard({ label, value, valueColor, sub }) {
  return (
    <div className="border border-border rounded-lg p-3">
      <div className="text-[11px] text-text-muted mb-1">{label}</div>
      <div className="text-[18px] font-bold" style={{ color: valueColor || '#000' }}>{value}</div>
      {sub && <div className="text-[11px] text-text-muted mt-0.5">{sub}</div>}
    </div>
  );
}

function InvoiceStatusPill({ status }) {
  if (!status) return <span className="text-text-muted">-</span>;
  const map = {
    Paid:     { bg: '#DCFFE3', color: '#1D6A36' },
    Pending:  { bg: '#FFF6EA', color: '#9A5800' },
    Overdue:  { bg: '#FFE0DD', color: '#C0392B' },
    Raised:   { bg: '#EEF2FF', color: '#3730A3' },
  };
  const s = map[status] || { bg: '#F1F3F5', color: '#333' };
  return (
    <span
      className="inline-block rounded-full px-2 py-[2px] text-[11px] font-medium"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}

export function FinancialsTab({ project }) {
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchProjectInvoices(project.id, { page, pageSize })
      .then((data) => { if (!cancelled) { setRows(data.rows); setTotalCount(data.totalCount); } })
      .catch(console.error)
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [project.id, page]);

  const margin = project.margin_percent != null ? parseFloat(project.margin_percent) : null;
  const outstanding = project.amount_outstanding != null ? parseFloat(project.amount_outstanding) : null;
  const overdue = project.amount_overdue != null ? parseFloat(project.amount_overdue) : null;

  return (
    <div className="space-y-5">

      {/* KPI cards — row 1 */}
      <div className="grid grid-cols-4 gap-3">
        <KpiCard
          label="Total Booked"
          value={fmt(project.total_booked)}
          valueColor="#000"
        />
        <KpiCard
          label="Total Invoiced"
          value={fmt(project.total_invoiced)}
          valueColor="#000"
        />
        <KpiCard
          label="Amount Received"
          value={fmt(project.amount_received)}
          valueColor="#37B24D"
        />
        <KpiCard
          label="Amount Outstanding"
          value={fmt(project.amount_outstanding)}
          valueColor={outstanding !== null && outstanding > 0 ? '#E58715' : '#000'}
        />
      </div>

      {/* KPI cards — row 2 */}
      <div className="grid grid-cols-4 gap-3">
        <KpiCard
          label="Amount Overdue"
          value={fmt(project.amount_overdue)}
          valueColor={overdue !== null && overdue > 0 ? '#E32200' : '#000'}
        />
        <KpiCard
          label="Margin %"
          value={margin !== null ? `${margin.toFixed(1)}%` : '-'}
          valueColor={margin !== null && margin < 0 ? '#E32200' : '#37B24D'}
        />
        <KpiCard
          label="Avg Ageing Days"
          value={project.avg_ageing_days != null ? `${project.avg_ageing_days}d` : '-'}
          valueColor={project.avg_ageing_days != null && project.avg_ageing_days > 60 ? '#E58715' : '#000'}
        />
        <KpiCard
          label="Revenue at Risk"
          value={fmt(project.revenue_at_risk)}
          valueColor={parseFloat(project.revenue_at_risk) > 0 ? '#E32200' : '#000'}
        />
      </div>

      {/* Recent Invoices */}
      <section>
        <h3 className="text-[14px] font-semibold text-black mb-3">Recent Invoices</h3>

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
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Created On</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Milestone / Period</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Invoice No</th>
                    <th className="text-right px-3 py-2.5 text-[12px] font-semibold text-text-muted">Value</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Due Date</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-[12px] text-text-muted">No invoices found.</td>
                    </tr>
                  ) : (
                    rows.map((inv, idx) => (
                      <tr key={inv.id} className={idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}>
                        <td className="px-3 py-2.5 text-text-secondary whitespace-nowrap">{fmtDate(inv.created_on)}</td>
                        <td className="px-3 py-2.5 text-text-secondary">{inv.milestone_period || '-'}</td>
                        <td className="px-3 py-2.5 font-medium text-black">{inv.invoice_no || '-'}</td>
                        <td className="px-3 py-2.5 text-right font-semibold text-black">{fmt(inv.value)}</td>
                        <td className="px-3 py-2.5 text-text-secondary whitespace-nowrap">{fmtDate(inv.invoiced_due_date)}</td>
                        <td className="px-3 py-2.5"><InvoiceStatusPill status={inv.status} /></td>
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
