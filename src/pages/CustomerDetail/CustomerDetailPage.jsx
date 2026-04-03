import { useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useCustomerDetailStore } from '../../stores/customerDetailStore.js';
import { LeftSidebar } from './components/LeftSidebar.jsx';
import { CustomerHeader } from './components/CustomerHeader.jsx';
import { DeliverySection } from './components/DeliverySection.jsx';
import { StakeholdersSection } from './components/StakeholdersSection.jsx';
import { LogsSection } from './components/LogsSection.jsx';

/**
 * Customer Detail page.
 * Layout: [LeftSidebar (List of Sections)] + [main content area]
 * Section switching via ?section= query param.
 */
export function CustomerDetailPage() {
  const { customerId } = useParams();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'delivery';
  const id = parseInt(customerId, 10);

  const loadCustomer = useCustomerDetailStore((s) => s.loadCustomer);
  const customer = useCustomerDetailStore((s) => s.customer);
  const reset = useCustomerDetailStore((s) => s.reset);

  useEffect(() => {
    reset();
    loadCustomer(id);
  }, [id]);

  const sectionLabel = {
    delivery: 'Delivery',
    stakeholders: 'Stakeholders',
    'client-connects': 'Client Connects',
    logs: 'Activities',
  }[section] || 'Delivery';

  return (
    <div className="flex h-full overflow-hidden -m-[14px]">
      {/* Left sidebar: List of Sections */}
      <LeftSidebar customerId={id} activeSection={section} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page title + breadcrumb */}
        <div className="px-4 pt-3 pb-1 flex-shrink-0">
          <h1 className="text-[16px] font-semibold text-text-primary">{sectionLabel}</h1>
          <nav className="text-[12px] text-text-muted mt-0.5" aria-label="Breadcrumb">
            <Link to="/customers" className="hover:text-brand-red hover:underline">
              Customers
            </Link>
            <span className="mx-1">/</span>
            <span className="text-text-secondary">{sectionLabel}</span>
          </nav>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {/* Customer header card (shared) */}
          <div className="pt-2">
            <CustomerHeader customerId={id} />
          </div>

          {/* Section content */}
          {section === 'delivery' && <DeliverySection customerId={id} customer={customer} />}
          {section === 'stakeholders' && <StakeholdersSection customerId={id} />}
          {section === 'logs' && <LogsSection customerId={id} />}
          {section === 'client-connects' && (
            <div className="flex flex-col items-center justify-center py-16 text-text-muted">
              <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-[13px]">Client Connects coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
