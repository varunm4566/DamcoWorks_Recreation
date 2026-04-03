import { useDeliveryStore } from '../../../stores/deliveryStore.js';

/**
 * A single filter chip.
 * If onRemove is provided, shows ×; otherwise no × (used for permanent chips).
 */
function FilterChip({ label, value, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 border border-[#D9D9D9] rounded px-[8px] py-[3px] text-[12px]">
      <span className="font-semibold text-[#101213]">{label}</span>
      <span className="text-text-muted ml-0.5">{value}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600 ml-1 leading-none"
          aria-label={`Remove ${label} filter`}
        >
          &times;
        </button>
      )}
    </span>
  );
}

/**
 * Active filters bar for the Delivery page.
 *
 * - Division chip: always shown with × (clicking × resets to Both + clears all filters)
 * - KPI/Role chip: shown when a KPI card or funnel filter is active, removable
 * - Clear Filters button: shown when any non-default filter is active
 */
export function DeliveryActiveFiltersBar() {
  const activeDivision    = useDeliveryStore((s) => s.activeDivision);
  const activeKpiFilter   = useDeliveryStore((s) => s.activeKpiFilter);
  const filters           = useDeliveryStore((s) => s.filters);
  const clearFilters      = useDeliveryStore((s) => s.clearFilters);
  const removeFilter      = useDeliveryStore((s) => s.removeFilter);

  const divisionLabel = activeDivision === 'both' ? 'Both' : activeDivision;

  // Show role chip when a KPI card or funnel sets a role filter
  const roleChipLabel = activeKpiFilter?.label || filters.roleType || null;

  // Show Clear Filters when something besides the default is active
  const hasActiveFilter = !!filters.roleType;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[13px] text-text-muted flex-shrink-0">Filters:</span>

      {/* Division chip — × resets everything back to Both */}
      <FilterChip
        label="Division"
        value={divisionLabel}
        onRemove={clearFilters}
      />

      {/* KPI / Role chip */}
      {roleChipLabel && (
        <FilterChip
          label="Role"
          value={roleChipLabel}
          onRemove={() => removeFilter('roleType')}
        />
      )}

      {/* Clear Filters — only when an extra filter is active */}
      {hasActiveFilter && (
        <button
          onClick={clearFilters}
          className="bg-brand-red text-white text-[12px] rounded px-3 py-[3px] h-[25px] leading-none hover:bg-red-700 transition-colors"
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
