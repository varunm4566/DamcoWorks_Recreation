import { useState } from 'react';
import { useCustomerStore } from '../../../stores/customerStore.js';
import { Tooltip } from '../../../components/UI/Tooltip.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';

const TOOLTIPS = {
  newLogos: 'Customers who have been onboarded during the current financial year.',
  bookedSales: 'The total value of contracts booked within the current financial year (April to March).',
  revenue: 'Sum of all invoices generated, excluding written-off or voided invoices.',
  activeCustomers: 'Customers who currently have at least one active engagement or project.',
};

/**
 * KPI Carousel - 5 responsive cards, gray bg #E1E2E4
 * Clickable cards filter the data table
 */
export function KpiCarousel() {
  const kpiData = useCustomerStore((s) => s.kpiData);
  const currency = useCustomerStore((s) => s.currency);
  const addFilter = useCustomerStore((s) => s.addFilter);
  const clearFilters = useCustomerStore((s) => s.clearFilters);
  const loadCustomers = useCustomerStore((s) => s.loadCustomers);

  if (!kpiData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-[126px] bg-card rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const handleCardClick = (cardType) => {
    if (cardType === 'newLogos') {
      clearFilters();
      setTimeout(() => addFilter('is_new_logo', 'true'), 0);
    } else if (cardType === 'activeCustomers') {
      clearFilters();
      setTimeout(() => addFilter('customer_status', 'active'), 0);
    }
  };

  const cards = [
    {
      key: 'activeProjects',
      title: 'Active Projects',
      subtitle: 'Excluded 13 DamcoIP Project(s)',
      value: kpiData.activeProjects,
      icon: (
        <svg className="w-5 h-5 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
        </svg>
      ),
      breakdown: (
        <div className="flex items-center gap-2 text-[13px] text-text-secondary mt-0.5">
          <span className="flex items-center gap-0.5"><strong>{kpiData.healthBreakdown.green}</strong><span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#0C8B14' }} /></span>
          <span className="flex items-center gap-0.5"><strong>{kpiData.healthBreakdown.orange}</strong><span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#E58715' }} /></span>
          <span className="flex items-center gap-0.5"><strong>{kpiData.healthBreakdown.red}</strong><span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#FA0000' }} /></span>
        </div>
      ),
      footer: '2 added & 0 closed this month',
    },
    {
      key: 'newLogos',
      title: 'New Logos',
      tooltip: TOOLTIPS.newLogos,
      subtitle: 'CFY (Apr-Mar)',
      value: kpiData.newLogos,
      clickable: true,
      icon: (
        <svg className="w-5 h-5 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
        </svg>
      ),
      footer: '(1) acquired this month',
    },
    {
      key: 'bookedSales',
      title: 'Booked Sales',
      tooltip: TOOLTIPS.bookedSales,
      subtitle: 'CFY (Apr-Mar)',
      value: formatCurrency(currency === 'usd' ? kpiData.bookedSales.usd : kpiData.bookedSales.inr, currency),
      isFormatted: true,
      icon: (
        <svg className="w-5 h-5 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      key: 'revenue',
      title: 'Revenue',
      tooltip: TOOLTIPS.revenue,
      subtitle: 'CFY (Apr-Mar)',
      value: formatCurrency(currency === 'usd' ? kpiData.revenue.usd : kpiData.revenue.inr, currency),
      isFormatted: true,
      icon: (
        <svg className="w-5 h-5 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      key: 'activeCustomers',
      title: 'Active Customers',
      tooltip: TOOLTIPS.activeCustomers,
      value: kpiData.activeCustomers,
      clickable: true,
      icon: (
        <svg className="w-5 h-5 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mb-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {cards.map((card) => (
          <div
            key={card.key}
            onClick={() => card.clickable && handleCardClick(card.key)}
            className={`rounded-lg p-3 flex flex-col justify-between min-h-[110px] ${
              card.clickable ? 'cursor-pointer hover:brightness-[0.97] transition-all' : ''
            }`}
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E4E5E7 100%)',
              border: '1px solid #DEE2E6',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-semibold text-text-secondary">{card.title}</span>
                  {card.tooltip && (
                    <Tooltip text={card.tooltip}>
                      <span className="text-text-muted cursor-help text-[11px]">&#9432;</span>
                    </Tooltip>
                  )}
                </div>
                {card.subtitle && (
                  <div className="text-[10px] text-text-secondary mt-0.5">{card.subtitle}</div>
                )}
              </div>
              <div
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.10)' }}
              >
                {card.icon}
              </div>
            </div>
            <div>
              <div className="text-[18px] font-bold text-black leading-tight">{card.value}</div>
              {card.breakdown}
              {card.footer && (
                <div className="text-[10px] text-text-secondary">{card.footer}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
