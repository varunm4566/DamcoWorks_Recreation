import { useCustomerStore } from '../../../stores/customerStore.js';
import { FilterTag } from '../../../components/UI/FilterTag.jsx';

const FILTER_LABELS = {
  customer_status: 'Customer Status',
  tier: 'Tier',
  sales_owner: 'Sales Owner',
  client_partner: 'Client Partner',
  cp_ownership: 'CP Ownership',
  incentive_eligibility: 'Incentive Eligibility',
  referenceable: 'Referenceable',
  industry: 'Industry',
  client_co_partner: 'Client Co-Partner',
  dm_pdm: 'DM/PDM',
  booked_sales_usd: 'Booked Sales',
  booked_sales_inr: 'Booked Sales (INR)',
  revenue_usd: 'Revenue',
  revenue_inr: 'Revenue (INR)',
  csat_score: 'CSAT',
  name: 'Customer',
  is_new_logo: 'New Logo',
};

function formatFilterValue(value) {
  if (typeof value === 'object' && value.type) {
    if (value.type === 'range') return `${value.min} - ${value.max}`;
    if (value.type === 'gt') return `> ${value.value}`;
    if (value.type === 'lt') return `< ${value.value}`;
  }
  if (value === 'true') return 'True';
  if (value === 'false') return 'False';
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

/**
 * Filter row - "Filters:" label, chips, "Clear Filters" red button
 */
export function ActiveFiltersBar() {
  const filters = useCustomerStore((s) => s.filters);
  const removeFilter = useCustomerStore((s) => s.removeFilter);
  const clearFilters = useCustomerStore((s) => s.clearFilters);

  const filterEntries = Object.entries(filters);
  if (filterEntries.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[13px] text-text-muted flex-shrink-0">Filters:</span>
      <div className="flex items-center gap-2 flex-wrap">
        {filterEntries.map(([column, value]) => (
          <FilterTag
            key={column}
            label={FILTER_LABELS[column] || column}
            value={formatFilterValue(value)}
            onRemove={() => removeFilter(column)}
          />
        ))}
        <button
          onClick={clearFilters}
          className="flex-shrink-0 text-[13px] bg-brand-red text-white px-2 py-0.5 rounded font-normal hover:opacity-90"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
