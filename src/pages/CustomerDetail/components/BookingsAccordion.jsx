import { useEffect } from 'react';
import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';
import { Pagination } from '../../../components/UI/Pagination.jsx';

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

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

const INR_RATE = 83.37;

function fmtMoney(val, inr = false) {
  const n = parseFloat(val) || 0;
  if (inr) return `₹${(n * INR_RATE / 100000).toFixed(2)}L`;
  return `$${(n / 1000).toFixed(2)}K`;
}

function fmtMonthYear(my) {
  if (!my) return '—';
  const [year, month] = my.split('-');
  return new Date(year, parseInt(month, 10) - 1).toLocaleString('en-US', { month: 'short', year: '2-digit' });
}

/**
 * Bookings accordion — CFY bookings with month-wise breakdown per project.
 */
export function BookingsAccordion({ customerId }) {
  const isOpen           = useCustomerDetailStore((s) => s.accordions.bookings);
  const toggleAccordion  = useCustomerDetailStore((s) => s.toggleAccordion);

  const bookings         = useCustomerDetailStore((s) => s.bookings);
  const loading          = useCustomerDetailStore((s) => s.bookingsLoading);
  const totalCount       = useCustomerDetailStore((s) => s.bookingsTotalCount);
  const page             = useCustomerDetailStore((s) => s.bookingsPage);
  const pageSize         = useCustomerDetailStore((s) => s.bookingsPageSize);
  const currency         = useCustomerDetailStore((s) => s.bookingsCurrency);
  const expandedRows     = useCustomerDetailStore((s) => s.bookingsExpandedRows);
  const expandedLoading  = useCustomerDetailStore((s) => s.bookingsExpandedLoading);

  const loadBookings    = useCustomerDetailStore((s) => s.loadBookings);
  const setPage         = useCustomerDetailStore((s) => s.setBookingsPage);
  const setPageSize     = useCustomerDetailStore((s) => s.setBookingsPageSize);
  const toggleCurrency  = useCustomerDetailStore((s) => s.toggleBookingsCurrency);
  const toggleRow       = useCustomerDetailStore((s) => s.toggleBookingRow);

  useEffect(() => {
    if (isOpen && bookings.length === 0) loadBookings(customerId);
  }, [isOpen]);

  const isInr = currency === 'inr';
  const fmt = (val) => fmtMoney(val, isInr);

  const totalBooked = bookings.reduce((s, b) => s + (parseFloat(b.total_booked_usd) || 0), 0);

  const downloadCsv = () => {
    const headers = ['Project', 'Model', 'Sales Owner', 'Program Manager', 'Total Booked', 'Contract Ends', 'Total Invoiced'];
    const csvRows = bookings.map((bk) => [
      bk.project_name,
      bk.engagement_model || '—',
      bk.sales_owner || '—',
      bk.program_manager || '—',
      fmt(bk.total_booked_usd),
      fmtDate(bk.contract_ending_on),
      fmt(bk.total_invoiced_usd),
    ]);
    const content = [headers, ...csvRows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-3">
      <button
        onClick={() => toggleAccordion('bookings')}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="text-left">
          <div className="text-[14px] font-semibold text-text-primary">Bookings</div>
          <div className="text-[11px] text-text-muted mt-0.5">CFY (Apr-Mar)</div>
        </div>
        <svg className={`w-4 h-4 text-text-muted transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-border">
          {/* Summary + toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border flex-wrap gap-2">
            <div className="text-[12px] text-text-secondary">
              <span className="font-medium text-text-primary">Total Booked Sales: {fmt(totalBooked)}</span>
              <span className="mx-2 text-border">|</span>
              <span>New Business: {isInr ? '₹0.00L' : '$0.00K'}</span>
              <span className="mx-2 text-border">|</span>
              <span>Existing Business: {fmt(totalBooked)}</span>
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
            <table className="w-full min-w-[700px]">
              <thead className="bg-table-header">
                <tr>
                  <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary w-8" />
                  <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary">Project</th>
                  <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary">Model</th>
                  <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary">Sales Owner</th>
                  <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary">Program Manager</th>
                  <th className="py-2 px-3 text-right text-[11px] font-medium text-text-secondary">Total Booked</th>
                  <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary">Contract Ends</th>
                  <th className="py-2 px-3 text-right text-[11px] font-medium text-text-secondary">Total Invoiced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={8} className="py-8 text-center text-text-muted text-[13px]">Loading…</td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={8} className="py-6 text-center text-text-muted text-[12px]">No bookings found.</td></tr>
                ) : bookings.map((bk, idx) => {
                  const months = expandedRows[bk.id];
                  const isExpanded = months !== undefined;
                  const isLoadingRow = expandedLoading[bk.id];
                  return (
                    <>
                      <tr key={bk.id} className={idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}>
                        <td className="py-2.5 px-3">
                          <button
                            onClick={() => toggleRow(customerId, bk.id)}
                            className="w-5 h-5 rounded border border-border flex items-center justify-center text-text-muted hover:bg-gray-100 text-[12px]"
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                          >
                            {isLoadingRow ? '…' : isExpanded ? '−' : '+'}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 text-[12px] text-text-primary">{bk.project_name}</td>
                        <td className="py-2.5 px-3 text-[12px] text-text-secondary">{bk.engagement_model || '—'}</td>
                        <td className="py-2.5 px-3 text-[12px] text-text-secondary">{bk.sales_owner || '—'}</td>
                        <td className="py-2.5 px-3 text-[12px] text-text-secondary">{bk.program_manager || '—'}</td>
                        <td className="py-2.5 px-3 text-right text-[12px] font-medium text-text-primary">{fmt(bk.total_booked_usd)}</td>
                        <td className="py-2.5 px-3 text-[12px] text-text-secondary">{fmtDate(bk.contract_ending_on)}</td>
                        <td className="py-2.5 px-3 text-right text-[12px] text-text-secondary">{fmt(bk.total_invoiced_usd)}</td>
                      </tr>

                      {isExpanded && (
                        <tr key={`${bk.id}-months`} className="bg-blue-50/30">
                          <td colSpan={8} className="px-8 py-2">
                            {!months || months.length === 0 ? (
                              <p className="text-[11px] text-text-muted italic py-1">No monthly data available.</p>
                            ) : (
                              <table className="w-full max-w-lg">
                                <thead>
                                  <tr>
                                    {['Month', 'Booked (NN)', 'Booked (EN)', 'Booked (EE)'].map((h) => (
                                      <th key={h} className="py-1 px-2 text-left text-[10px] font-medium text-text-muted">{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {months.map((m) => (
                                    <tr key={m.month_year}>
                                      <td className="py-1 px-2 text-[11px] text-text-secondary">{fmtMonthYear(m.month_year)}</td>
                                      <td className="py-1 px-2 text-[11px] text-text-primary">{fmt(m.booked_nn)}</td>
                                      <td className="py-1 px-2 text-[11px] text-text-primary">{fmt(m.booked_en)}</td>
                                      <td className="py-1 px-2 text-[11px] text-text-primary">{fmt(m.booked_ee)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
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
    </div>
  );
}
