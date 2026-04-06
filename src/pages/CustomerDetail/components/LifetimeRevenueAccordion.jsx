import { useEffect } from 'react';
import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';
import { Pagination } from '../../../components/UI/Pagination.jsx';
import { BreakdownModal } from './BreakdownModal.jsx';

function CurrencyToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-[11px] ${!value ? 'font-semibold text-text-primary' : 'text-text-muted'}`}>INR</span>
      <button role="switch" aria-checked={value} onClick={onChange}
        className={`relative w-8 h-4 rounded-full transition-colors ${value ? 'bg-brand-red' : 'bg-gray-300'}`}>
        <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
      <span className={`text-[11px] ${value ? 'font-semibold text-text-primary' : 'text-text-muted'}`}>USD</span>
    </div>
  );
}

function YoyArrow({ value }) {
  if (value == null) return <span className="text-text-muted">—</span>;
  const isPos = value >= 0;
  return (
    <span className={`flex items-center gap-1 ${isPos ? 'text-green-600' : 'text-red-500'}`}>
      <svg className={`w-3 h-3 ${isPos ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

/**
 * Lifetime Revenue accordion.
 * Shows year-over-year revenue table with project breakdown.
 */
export function LifetimeRevenueAccordion({ customerId }) {
  const isOpen            = useCustomerDetailStore((s) => s.accordions.lifetimeRevenue);
  const toggleAccordion   = useCustomerDetailStore((s) => s.toggleAccordion);

  const rows              = useCustomerDetailStore((s) => s.ltRevenue);
  const loading           = useCustomerDetailStore((s) => s.ltRevenueLoading);
  const totalCount        = useCustomerDetailStore((s) => s.ltRevenueTotalCount);
  const page              = useCustomerDetailStore((s) => s.ltRevenuePage);
  const pageSize          = useCustomerDetailStore((s) => s.ltRevenuePageSize);
  const currency          = useCustomerDetailStore((s) => s.ltRevenueCurrency);

  const loadLtRevenue     = useCustomerDetailStore((s) => s.loadLtRevenue);
  const setPage           = useCustomerDetailStore((s) => s.setLtRevenuePage);
  const setPageSize       = useCustomerDetailStore((s) => s.setLtRevenuePageSize);
  const toggleCurrency    = useCustomerDetailStore((s) => s.toggleLtRevenueCurrency);
  const openBreakdown     = useCustomerDetailStore((s) => s.openYearlyBreakdownModal);
  const breakdownModal    = useCustomerDetailStore((s) => s.breakdownModal);

  useEffect(() => {
    if (isOpen && rows.length === 0) loadLtRevenue(customerId);
  }, [isOpen]);

  const INR_RATE = 83.37;
  const fmtMoney = (val) => {
    const n = parseFloat(val) || 0;
    if (currency === 'inr') return `₹${(n * INR_RATE / 100000).toFixed(2)}L`;
    return `$${(n / 1000).toFixed(2)}K`;
  };

  const downloadCsv = () => {
    const headers = ['FY', 'Revenue', 'YOY Change %', 'Cumulative Revenue', 'Projects'];
    const csvRows = withYoy.map((row) => [
      row.fy_year,
      fmtMoney(row.revenue_usd),
      row.yoy != null ? `${row.yoy.toFixed(2)}%` : '—',
      fmtMoney(cumByFy[row.fy_year] || 0),
      row.project_count,
    ]);
    const content = [headers, ...csvRows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lifetime-revenue.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compute YOY change
  const withYoy = rows.map((row, idx) => {
    const next = rows[idx + 1];
    if (!next) return { ...row, yoy: null };
    const curr = parseFloat(row.revenue_usd) || 0;
    const prev = parseFloat(next.revenue_usd) || 0;
    return { ...row, yoy: prev > 0 ? ((curr - prev) / prev) * 100 : null };
  });

  // Cumulative from first year
  const cumulative = [...rows].reverse().reduce((acc, row) => {
    const last = acc[acc.length - 1] || 0;
    acc.push(last + (parseFloat(row.revenue_usd) || 0));
    return acc;
  }, []);
  const cumByFy = Object.fromEntries(rows.map((r, i) => [r.fy_year, cumulative[rows.length - 1 - i]]));

  // Onboarded date from first row (all rows should have same value)
  const onboardedOn = rows[0]?.onboarded_on;
  const onboardedStr = onboardedOn
    ? new Date(onboardedOn).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    : null;

  // Calculate tenure
  let tenureStr = '';
  if (onboardedOn) {
    const now = new Date();
    const ob  = new Date(onboardedOn);
    let years  = now.getFullYear() - ob.getFullYear();
    let months = now.getMonth() - ob.getMonth();
    if (months < 0) { years--; months += 12; }
    tenureStr = `${years} Years, ${months} Months`;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-3">
      <button
        onClick={() => toggleAccordion('lifetimeRevenue')}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="text-left">
          <div className="text-[14px] font-semibold text-text-primary">Lifetime Revenue</div>
          {onboardedStr && (
            <div className="text-[11px] text-text-muted mt-0.5">
              Onboarded On: {onboardedStr} ({tenureStr})
            </div>
          )}
        </div>
        <svg className={`w-4 h-4 text-text-muted transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-border">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex gap-1.5">
              {['All Projects', 'Active', 'Inactive'].map((label) => (
                <button key={label} className={`px-2.5 py-1 text-[12px] rounded border transition-colors ${
                  label === 'All Projects' ? 'border-text-muted bg-white text-text-primary font-medium' : 'border-border text-text-muted hover:bg-gray-50'
                }`}>
                  {label === 'All Projects' && <span className="mr-1 text-brand-red">✓</span>}
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <CurrencyToggle value={currency === 'usd'} onChange={toggleCurrency} />
              <button onClick={downloadCsv} className="p-1 rounded hover:bg-gray-100 text-text-muted" aria-label="Download CSV">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-table-header">
                <tr>
                  {['FY', 'Revenue', 'YOY Change', 'Cumulative Revenue', 'Projects', 'View Breakdown'].map((h) => (
                    <th key={h} className={`py-2 px-3 text-[11px] font-medium text-text-secondary whitespace-nowrap ${
                      h === 'Revenue' || h === 'Cumulative Revenue' ? 'text-right' : h === 'View Breakdown' ? 'text-center' : 'text-left'
                    }`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-text-muted text-[13px]">Loading…</td></tr>
                ) : withYoy.map((row, idx) => (
                  <tr key={row.fy_year} className={idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}>
                    <td className="py-2.5 px-3 text-[12px] text-text-primary font-medium">{row.fy_year}</td>
                    <td className="py-2.5 px-3 text-[12px] text-right font-medium">{fmtMoney(row.revenue_usd)}</td>
                    <td className="py-2.5 px-3 text-[12px]"><YoyArrow value={row.yoy} /></td>
                    <td className="py-2.5 px-3 text-[12px] text-right">{fmtMoney(cumByFy[row.fy_year] || 0)}</td>
                    <td className="py-2.5 px-3 text-[12px] text-center">{row.project_count}</td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => openBreakdown(customerId, row.fy_year)}
                        className="text-text-muted hover:text-brand-red transition-colors"
                        aria-label="View yearly breakdown"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-3 border-t border-border">
            <Pagination
              page={page}
              pageSize={pageSize}
              totalItems={totalCount}
              onPageChange={(p) => setPage(customerId, p)}
              onPageSizeChange={(s) => setPageSize(customerId, s)}
            />
          </div>
        </div>
      )}

      {breakdownModal && <BreakdownModal />}
    </div>
  );
}
