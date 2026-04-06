import { useProjectStore } from '../../../stores/projectStore.js';

// label : value — matches spec chip format exactly
const KPI_CHIP_MAP = {
  criticalAttention: { label: 'Critical Attention', value: 'Total' },
  revenueAtRisk:     { label: 'Revenue at Risk',    value: 'Yes' },
  dpi:               { label: 'SPI',                value: '< 0.9' },
  customerConfidence:{ label: 'CSAT',               value: '< 3.5' },
  activeProject:     { label: 'Status',             value: 'Active' },
  bytTm:             { label: 'Project Type',       value: 'BYT/T&M' },
  fp:                { label: 'Project Type',       value: 'Fixed Price' },
  staffing:          { label: 'Project Type',       value: 'Staffing' },
};

/**
 * Active filter chips bar with Clear All button
 */
export function ProjectActiveFiltersBar() {
  const activeDivision = useProjectStore((s) => s.activeDivision);
  const activeKpiFilter = useProjectStore((s) => s.activeKpiFilter);
  const selectedDm = useProjectStore((s) => s.selectedDm);
  const searchTerm = useProjectStore((s) => s.searchTerm);
  const filters = useProjectStore((s) => s.filters);
  const setDivision = useProjectStore((s) => s.setDivision);
  const setKpiFilter = useProjectStore((s) => s.setKpiFilter);
  const setSelectedDm = useProjectStore((s) => s.setSelectedDm);
  const setSearchTerm = useProjectStore((s) => s.setSearchTerm);
  const removeFilter = useProjectStore((s) => s.removeFilter);
  const clearFilters = useProjectStore((s) => s.clearFilters);

  const chips = [];

  // Division chip
  chips.push({
    key: 'division',
    label: 'Division',
    value: activeDivision,
    onRemove: () => setDivision('All'),
    permanent: true,
  });

  // KPI filter chip
  if (activeKpiFilter) {
    const kpiChip = KPI_CHIP_MAP[activeKpiFilter] || { label: activeKpiFilter, value: '' };
    chips.push({
      key: 'kpi',
      label: kpiChip.label,
      value: kpiChip.value,
      onRemove: () => setKpiFilter(activeKpiFilter),
    });
  }

  // DM/PDM chip
  if (selectedDm) {
    chips.push({
      key: 'dm',
      label: 'DM/PDM',
      value: selectedDm,
      onRemove: () => setSelectedDm(''),
    });
  }

  // Search chip
  if (searchTerm) {
    chips.push({
      key: 'search',
      label: 'Search',
      value: searchTerm,
      onRemove: () => setSearchTerm(''),
    });
  }

  // Column filter chips + tag filter chips
  const COLUMN_FILTER_LABELS = {
    name_filter: 'Project',
    client_name_filter: 'Customer',
    project_type: 'Project Type',
    engagement_model: 'Engagement Model',
    dm_name_filter: 'Delivery Manager',
    sm_name_filter: 'Sales Manager',
    service_quality: 'Service Quality',
    financial_health: 'Financial Health',
    spi_below: 'SPI Below',
    cpi_below: 'CPI Below',
    variance_above: 'Variance Above %',
    margin_below: 'Margin Below %',
    overburn_above: 'Overburn Above %',
    confidence_below: 'CSAT Below',
    milestone_status: 'Milestone Status',
    contract_date_from: 'Start Date ≥',
    contract_date_to: 'End Date ≤',
  };

  for (const [key, value] of Object.entries(filters)) {
    if (key.startsWith('tag_')) {
      const category = key.replace('tag_', '');
      const values = Array.isArray(value) ? value : [value];
      for (const val of values) {
        chips.push({
          key: `${key}-${val}`,
          label: category.charAt(0).toUpperCase() + category.slice(1),
          value: val,
          onRemove: () => removeFilter(key),
        });
      }
    } else if (COLUMN_FILTER_LABELS[key]) {
      chips.push({
        key,
        label: COLUMN_FILTER_LABELS[key],
        value: String(value),
        onRemove: () => removeFilter(key),
      });
    }
  }

  const hasRemovableChips = chips.some((c) => !c.permanent) || activeDivision !== 'All';

  return (
    <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center border border-[#D9D9D9] rounded px-[5px] py-[3px] text-[12px]"
        >
          <span className="font-semibold text-[#101213]">{chip.label}</span>
          <span className="text-text-muted ml-1">: {chip.value}</span>
          {!chip.permanent && (
            <button
              onClick={chip.onRemove}
              className="ml-1.5 text-gray-400 hover:text-gray-600 text-sm leading-none"
            >
              &times;
            </button>
          )}
        </span>
      ))}

      {hasRemovableChips && (
        <button
          onClick={clearFilters}
          className="bg-brand-red text-white text-[12px] font-medium rounded px-2 py-[3px] h-[25px] hover:bg-red-700 transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
