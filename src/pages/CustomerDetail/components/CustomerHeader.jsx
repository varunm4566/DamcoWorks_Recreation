import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';
import { ClientPartnerModal } from './ClientPartnerModal.jsx';

/** Info tooltip icon with hover popover */
function InfoTooltip({ text }) {
  return (
    <span className="relative group inline-flex ml-1">
      <svg className="w-3.5 h-3.5 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block z-50 w-56 bg-gray-800 text-white text-[11px] leading-snug rounded p-2 shadow-lg pointer-events-none">
        {text}
      </span>
    </span>
  );
}

/** KPI card used for Booked Sales and Revenue */
function KpiCard({ title, tooltip, sublabel, value, icon }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-border rounded-lg px-4 py-3 min-w-[180px]">
      <div className="flex-1">
        <div className="flex items-center text-[12px] text-text-muted font-medium">
          {title}
          <InfoTooltip text={tooltip} />
        </div>
        <div className="text-[11px] text-text-muted mt-0.5">{sublabel}</div>
        <div className="text-[18px] font-bold text-text-primary mt-1">{value}</div>
      </div>
      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
    </div>
  );
}

/**
 * Customer header card shared across all sections of the Customer Detail page.
 * Shows company info, sales owner, client partner, and CFY KPIs.
 */
export function CustomerHeader({ customerId }) {
  const customer = useCustomerDetailStore((s) => s.customer);
  const customerLoading = useCustomerDetailStore((s) => s.customerLoading);
  const customerError = useCustomerDetailStore((s) => s.customerError);
  const openClientPartnerModal = useCustomerDetailStore((s) => s.openClientPartnerModal);
  const clientPartnerModalOpen = useCustomerDetailStore((s) => s.clientPartnerModalOpen);

  if (customerLoading) {
    return (
      <div className="bg-white border border-border rounded-lg p-4 mb-3 flex items-center gap-4 animate-pulse">
        <div className="w-14 h-14 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (customerError || !customer) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-3 text-sm">
        {customerError || 'Customer not found'}
      </div>
    );
  }

  const bookedSales = customer.booked_sales_usd
    ? `$${(parseFloat(customer.booked_sales_usd) / 1000).toFixed(2)}K`
    : '$0.00K';

  const revenue = customer.revenue_usd
    ? `$${(parseFloat(customer.revenue_usd) / 1000).toFixed(2)}K`
    : '$0.00K';

  // Avatar initials
  const initials = customer.name
    ? customer.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?';

  return (
    <>
      <div className="bg-white border border-border rounded-lg p-4 mb-3 flex items-center gap-4">
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-white text-lg font-semibold"
          style={{ backgroundColor: customer.avatar_color || '#9CA3AF' }}
          aria-label="Customer avatar"
        >
          {initials}
        </div>

        {/* Company info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-[16px] font-bold text-text-primary leading-tight truncate">
            {customer.name}
          </h2>
          <div className="text-[12px] text-text-secondary mt-0.5">
            Industry:{' '}
            <span className="font-semibold text-text-primary">{customer.industry || '—'}</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {/* Sales Owner pill */}
            {customer.sales_owner && (
              <span className="text-[12px]">
                <span className="text-text-muted">Sales Owner</span>{' '}
                <span className="inline-flex items-center bg-gray-100 text-text-primary text-[12px] px-2 py-0.5 rounded-full font-medium hover:bg-gray-200 cursor-default">
                  {customer.sales_owner}
                </span>
              </span>
            )}

            {/* Client Partner pill with edit */}
            <span className="text-[12px]">
              <span className="text-text-muted">Client Partner</span>{' '}
              <button
                onClick={openClientPartnerModal}
                className="inline-flex items-center gap-1 bg-gray-100 text-text-primary text-[12px] px-2 py-0.5 rounded-full font-medium hover:bg-gray-200 transition-colors"
                aria-label="Edit client partner"
              >
                {customer.client_partner || 'Unassigned'}
                <svg className="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="flex gap-3 flex-shrink-0">
          <KpiCard
            title="Booked Sales"
            tooltip="The total value of contracts booked within the current financial year, which spans from April to March."
            sublabel="CFY (Apr-Mar)"
            value={bookedSales}
            icon={
              <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            }
          />
          <KpiCard
            title="Revenue"
            tooltip="Sum of all invoices generated, excluding written-off or voided invoices, regardless of payment status."
            sublabel="CFY (Apr-Mar)"
            value={revenue}
            icon={
              <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Client Partner Modal */}
      {clientPartnerModalOpen && (
        <ClientPartnerModal customerId={customerId} />
      )}
    </>
  );
}
