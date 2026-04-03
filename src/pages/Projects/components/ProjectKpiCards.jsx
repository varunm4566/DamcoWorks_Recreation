import { useProjectStore } from '../../../stores/projectStore.js';

/**
 * Format currency value for display
 */
function formatUsd(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

const CARDS = [
  {
    key: 'criticalAttention',
    title: 'Critical Attention',
    tooltip: 'Projects requiring immediate attention based on an algorithm',
    getValue: (kpi) => kpi.criticalAttention,
    getSub: () => 'Projects needing intervention',
    valueColor: '#E32200',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    key: 'revenueAtRisk',
    title: 'Revenue at Risk',
    tooltip: 'Total value of overdue invoices across all projects',
    getValue: (kpi) => formatUsd(kpi.revenueAtRisk),
    getSub: () => 'Payment Overdue > 90 days',
    valueColor: '#E32200',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'dpi',
    title: 'Delivery Performance Index',
    tooltip: 'Projects with SPI < 0.9',
    getValue: (kpi) => kpi.deliveryPerformanceIndex,
    getSub: () => 'Projects with SPI < 0.9',
    valueColor: '#0A0D12',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    key: 'customerConfidence',
    title: 'Customer Confidence',
    tooltip: 'Projects with CSAT score below 3.5 — click to filter',
    getValue: (kpi) => kpi.avgConfidence ? `${parseFloat(kpi.avgConfidence).toFixed(1)}/5` : 'N/A',
    getSub: (kpi) => `${kpi.customerConfidence} project(s) with CSAT < 3.5`,
    valueColor: '#0A0D12',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
  },
  {
    key: 'activeProject',
    title: 'Active Project',
    tooltip: 'Total active projects across all types',
    getValue: (kpi) => kpi.activeProjects,
    getSub: (kpi) => null,
    valueColor: '#0A0D12',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
  },
];

// Gradient for inactive cards: white top-left → light grey bottom-right
const CARD_GRADIENT = 'linear-gradient(135deg, #FFFFFF 0%, #E4E5E7 100%)';
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.06)';
const ACTIVE_SHADOW = '0 2px 8px rgba(99,102,241,0.2)';

/**
 * 5 KPI summary cards in a responsive grid.
 * Inactive: diagonal white-to-grey gradient with subtle shadow.
 * Active: indigo border + indigo-tinted bg + elevated shadow.
 * Each card is clickable to filter the project list.
 */
export function ProjectKpiCards() {
  const kpiData = useProjectStore((s) => s.kpiData);
  const activeKpiFilter = useProjectStore((s) => s.activeKpiFilter);
  const setKpiFilter = useProjectStore((s) => s.setKpiFilter);

  if (!kpiData) {
    return (
      <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg p-3 h-[90px] animate-pulse" style={{ background: CARD_GRADIENT }} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-3">
      {CARDS.map((card) => {
        const isActive = activeKpiFilter === card.key;
        return (
          <div
            key={card.key}
            onClick={() => setKpiFilter(card.key)}
            className="rounded-lg p-3 cursor-pointer transition-all hover:brightness-[0.97]"
            style={isActive ? {
              backgroundColor: '#EEF2FF',
              border: '2px solid #6366F1',
              boxShadow: ACTIVE_SHADOW,
            } : {
              background: CARD_GRADIENT,
              border: '1px solid #DEE2E6',
              boxShadow: CARD_SHADOW,
            }}
          >
            <div className="flex items-start justify-between mb-1">
              <span className="text-[13px] font-semibold text-text-muted leading-tight pr-1">{card.title}</span>
              <span
                className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-brand-red flex-shrink-0"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.10)' }}
              >
                {card.icon}
              </span>
            </div>
            <div
              className="text-[20px] font-bold leading-tight"
              style={{ color: card.valueColor }}
            >
              {card.getValue(kpiData)}
            </div>
            {card.key === 'activeProject' ? (
              <div className="flex gap-2 text-[11px] text-text-secondary mt-1 flex-wrap">
                <span
                  className="cursor-pointer hover:underline"
                  onClick={(e) => { e.stopPropagation(); setKpiFilter('bytTm'); }}
                >
                  BYT/T&M: {kpiData.bytTmCount}
                </span>
                <span
                  className="cursor-pointer hover:underline"
                  onClick={(e) => { e.stopPropagation(); setKpiFilter('fp'); }}
                >
                  FP: {kpiData.fpCount}
                </span>
                <span
                  className="cursor-pointer hover:underline"
                  onClick={(e) => { e.stopPropagation(); setKpiFilter('staffing'); }}
                >
                  Staffing: {kpiData.staffingCount}
                </span>
              </div>
            ) : (
              <div className="text-[11px] text-text-secondary mt-1">
                {card.getSub(kpiData)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
