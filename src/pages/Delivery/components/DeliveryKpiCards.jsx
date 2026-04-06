import { useDeliveryStore } from '../../../stores/deliveryStore.js';

/**
 * Single sub-card item inside a KPI group.
 * Clickable — filters the delivery table to that role.
 */
function SubCard({ title, count, actingLabel, roleType }) {
  const setKpiFilter      = useDeliveryStore((s) => s.setKpiFilter);
  const activeKpiFilter   = useDeliveryStore((s) => s.activeKpiFilter);
  const isActive          = activeKpiFilter?.roleType === roleType;

  function handleClick() {
    if (roleType) setKpiFilter(title, roleType);
  }

  return (
    <div
      onClick={handleClick}
      className={`
        flex flex-col px-3 py-1 transition-colors flex-shrink-0
        ${roleType ? 'cursor-pointer hover:bg-gray-50' : ''}
        ${isActive ? 'bg-[rgba(99,102,241,0.07)] rounded' : ''}
      `}
    >
      <span className="text-[12px] font-normal text-black whitespace-nowrap">{title}</span>
      <span
        className={`text-[18px] font-bold mt-0.5 ${isActive ? 'text-[#4338CA]' : 'text-[#0A0D12]'}`}
      >
        {count}
      </span>
      {actingLabel && (
        <span className="text-[11px] text-text-muted mt-0.5 whitespace-nowrap">{actingLabel}</span>
      )}
    </div>
  );
}

/**
 * Vertical divider between sub-card items
 */
function Divider() {
  return <div className="w-px self-stretch bg-[#E0E0E0] mx-1 flex-shrink-0" />;
}

/**
 * KPI group card wrapper.
 * accentBorder — left red 3px border for Groups 1 & 2
 */
function KpiGroupCard({ title, children, accentBorder }) {
  return (
    <div
      className="bg-white border border-border rounded-lg px-3 pt-3 pb-3 flex flex-col flex-shrink-0"
      style={accentBorder ? { borderLeft: '3px solid #E32200' } : {}}
    >
      <span className="text-[13px] font-semibold text-text-muted mb-3 whitespace-nowrap">{title}</span>
      <div className="flex items-stretch">
        {children}
      </div>
    </div>
  );
}

/** Skeleton while loading */
function KpiSkeleton() {
  return (
    <div className="flex gap-3 mb-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex-1 h-[110px] bg-gray-100 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

/**
 * Delivery KPI Summary — 3 group cards side by side.
 * All sub-cards are clickable to filter the table below.
 */
export function DeliveryKpiCards() {
  const kpiData   = useDeliveryStore((s) => s.kpiData);
  const isLoading = useDeliveryStore((s) => s.kpiLoading);

  if (isLoading || !kpiData) return <KpiSkeleton />;

  const { deliveryLeadership: dl, executionLeads: el, portfolio: pt } = kpiData;

  return (
    <div className="flex gap-3 mb-4 overflow-x-auto custom-scrollbar flex-nowrap">

      {/* ── Group 1: Delivery & Product Leadership ── */}
      <KpiGroupCard title="Delivery & Product Leadership" accentBorder>
        <SubCard
          title="Program Managers"
          count={dl.programManagers.count}
          actingLabel={`Acting PgM(s) : ${dl.programManagers.acting}`}
          roleType="Program Manager"
        />
        <Divider />
        <SubCard
          title="Product Owners"
          count={dl.productOwners.count}
          actingLabel={`Acting PO(s) : ${dl.productOwners.acting}`}
          roleType="Product Owner"
        />
        <Divider />
        <SubCard
          title="Delivery Managers"
          count={dl.deliveryManagers.count}
          actingLabel={`Acting DM(s) : ${dl.deliveryManagers.acting}`}
          roleType="Delivery Manager"
        />
        <Divider />
        <SubCard
          title="Onsite Delivery Managers"
          count={dl.onsiteDeliveryManagers.count}
          actingLabel={`Acting Onsite DM(s) : ${dl.onsiteDeliveryManagers.acting}`}
          roleType="Onsite Delivery Manager"
        />
        <Divider />
        <SubCard
          title="Product Development Managers"
          count={dl.productDevelopmentManagers.count}
          actingLabel={`Acting PDM(s) : ${dl.productDevelopmentManagers.acting}`}
          roleType="Product Development Manager"
        />
        <Divider />
        <SubCard
          title="Product Functional Managers"
          count={dl.productFunctionalManagers.count}
          actingLabel={`Acting PFM(s) : ${dl.productFunctionalManagers.acting}`}
          roleType="Product Functional Manager"
        />
      </KpiGroupCard>

      {/* ── Group 2: Execution Leads ── */}
      <KpiGroupCard title="Execution Leads" accentBorder>
        <SubCard
          title="Project Leads"
          count={el.projectLeads.count}
          actingLabel={`Acting PL(s) : ${el.projectLeads.acting}`}
          roleType="Project Lead"
        />
        <Divider />
        <SubCard
          title="Functional Leads"
          count={el.functionalLeads.count}
          actingLabel={`Acting FL(s) : ${el.functionalLeads.acting}`}
          roleType="Functional Lead"
        />
        <Divider />
        <SubCard
          title="Technical Leads"
          count={el.technicalLeads.count}
          actingLabel={`Acting TL(s) : ${el.technicalLeads.acting}`}
          roleType="Technical Lead"
        />
      </KpiGroupCard>

      {/* ── Group 3: Portfolio ── */}
      <KpiGroupCard title="Portfolio">
        <SubCard
          title="Active Customers"
          count={pt.activeCustomers}
          roleType={null}
        />
        <Divider />
        <SubCard
          title="Active Projects"
          count={pt.activeProjects}
          roleType={null}
        />
      </KpiGroupCard>

    </div>
  );
}
