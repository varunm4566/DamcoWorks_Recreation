import { useState, useRef, useEffect } from 'react';
import { useProjectStore } from '../../../stores/projectStore.js';
import { TagPill } from './TagPill.jsx';
import { HealthBadge } from './HealthBadge.jsx';

/**
 * Status pill for service quality / financial health
 */
function StatusPill({ status }) {
  if (!status || status === 'N/A') {
    return <span className="text-[12px] text-text-muted">N/A</span>;
  }
  const isHealthy = status === 'Healthy' || status === 'Good';
  return (
    <span
      className="inline-block rounded-full px-2 py-[2px] text-[12px]"
      style={{
        backgroundColor: isHealthy ? '#DCFFE3' : '#FFE0DD',
        color: '#000000',
      }}
    >
      {status}
    </span>
  );
}

/**
 * Overdue badge
 */
function OverdueBadge({ days }) {
  if (!days) return <span className="text-[12px] text-text-muted">-</span>;
  return (
    <span
      className="inline-block rounded-lg px-[10px] py-1 text-[12px]"
      style={{ backgroundColor: '#FEE2E2', color: '#B91C1C' }}
    >
      &#9888; Overdue by {days} day(s)
    </span>
  );
}

/**
 * SPI/CPI value with color coding
 */
function MetricValue({ label, value, redWhen }) {
  if (value === null || value === undefined) {
    return <div className="text-[12px] text-text-muted">{label}: N/A</div>;
  }
  const numVal = parseFloat(value);
  const isRed = redWhen === 'below1' ? numVal < 1.0 : numVal < 0;
  return (
    <div className="text-[12px]">
      <span className="text-text-muted">{label}: </span>
      <span className={isRed ? 'text-brand-red font-semibold' : 'text-[#37B24D] font-semibold'}>
        {numVal.toFixed(2)}
      </span>
    </div>
  );
}

/**
 * Format variance display
 */
function VarianceValue({ value }) {
  if (value === null || value === undefined) {
    return <div className="text-[12px] text-text-muted">Variance: -</div>;
  }
  const numVal = parseFloat(value);
  const isHigh = Math.abs(numVal) > 100;
  return (
    <div className="text-[12px]">
      <span className="text-text-muted">Variance: </span>
      <span className={isHigh ? 'text-brand-red font-semibold' : 'text-text-secondary'}>
        {numVal.toFixed(0)}%
      </span>
    </div>
  );
}

/**
 * Format delivery thought timestamp
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// ─── Column Filter Dropdown ─────────────────────────────────────────────────

const COLUMN_FILTER_CONFIGS = {
  project: {
    label: 'Project',
    types: [
      { key: 'name_filter',       label: 'Project Name',      input: 'text' },
      { key: 'client_name_filter',label: 'Customer',           input: 'text' },
      { key: 'project_type',      label: 'Project Type',       input: 'select', options: ['BYT/T&M', 'FP', 'Staffing'] },
      { key: 'engagement_model',  label: 'Engagement Model',   input: 'select', options: ['Fixed Price', 'Time & Material', 'Staffing', 'Managed Services'] },
    ],
  },
  people: {
    label: 'People',
    types: [
      { key: 'dm_name_filter', label: 'Delivery Manager', input: 'text' },
      { key: 'sm_name_filter', label: 'Sales Manager',    input: 'text' },
    ],
  },
  health: {
    label: 'Overall Health',
    types: [
      { key: 'service_quality', label: 'Service Quality',  input: 'select', options: ['Healthy', 'At Risk', 'N/A'] },
      { key: 'financial_health',label: 'Financial Health', input: 'select', options: ['Healthy', 'At Risk', 'N/A'] },
    ],
  },
  delivery: {
    label: 'Delivery Health',
    types: [
      { key: 'spi_below',      label: 'SPI Below',       input: 'text' },
      { key: 'cpi_below',      label: 'CPI Below',       input: 'text' },
      { key: 'variance_above', label: 'Variance Above %', input: 'text' },
    ],
  },
  financials: {
    label: 'Financials',
    types: [
      { key: 'margin_below',   label: 'Margin Below %',   input: 'text' },
      { key: 'overburn_above', label: 'Overburn Above %', input: 'text' },
    ],
  },
  csat: {
    label: 'CSAT',
    types: [
      { key: 'confidence_below', label: 'CSAT Score Below', input: 'text' },
    ],
  },
  milestone: {
    label: 'Milestone Health',
    types: [
      { key: 'milestone_status', label: 'Milestone Status', input: 'select', options: ['at-risk', 'in-progress', 'pending', 'completed'] },
    ],
  },
  timeline: {
    label: 'Timeline',
    types: [
      {
        key: 'date_range',
        label: 'Date Range',
        input: 'daterange',
        fromKey: 'contract_date_from',
        toKey: 'contract_date_to',
      },
    ],
  },
};

/**
 * Inline column filter dropdown
 */
function ColumnFilterDropdown({ column, onClose }) {
  const config = COLUMN_FILTER_CONFIGS[column];
  const addFilter = useProjectStore((s) => s.addFilter);
  const removeFilter = useProjectStore((s) => s.removeFilter);
  const filters = useProjectStore((s) => s.filters);

  const [selectedType, setSelectedType] = useState(config.types[0].key);
  const [value, setValue] = useState('');
  const [toValue, setToValue] = useState('');
  const dropdownRef = useRef(null);

  const selectedTypeDef = config.types.find((t) => t.key === selectedType);
  const isDateRange = selectedTypeDef?.input === 'daterange';

  // Pre-fill value(s) if filter is already active
  useEffect(() => {
    if (isDateRange) {
      setValue(filters[selectedTypeDef.fromKey] || '');
      setToValue(filters[selectedTypeDef.toKey] || '');
    } else {
      setValue(filters[selectedType] || '');
    }
  }, [selectedType, filters]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const handleApply = () => {
    if (isDateRange) {
      if (value) addFilter(selectedTypeDef.fromKey, value);
      if (toValue) addFilter(selectedTypeDef.toKey, toValue);
    } else if (value) {
      addFilter(selectedType, value);
    }
    onClose();
  };

  const handleClear = () => {
    if (isDateRange) {
      removeFilter(selectedTypeDef.fromKey);
      removeFilter(selectedTypeDef.toKey);
    } else {
      config.types.forEach((t) => removeFilter(t.key));
    }
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 z-50 bg-white border border-border rounded shadow-lg w-[220px] p-3 mt-1"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-[11px] font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
        Filter: {config.label}
      </div>

      {/* Filter type selector (hidden when only one type) */}
      {config.types.length > 1 && (
        <select
          value={selectedType}
          onChange={(e) => { setSelectedType(e.target.value); setValue(''); setToValue(''); }}
          className="w-full border border-border rounded px-2 py-1.5 text-[12px] mb-2 focus:outline-none"
        >
          {config.types.map((t) => (
            <option key={t.key} value={t.key}>{t.label}</option>
          ))}
        </select>
      )}

      {/* Value input */}
      {isDateRange ? (
        <div className="space-y-2 mb-2">
          <div>
            <label className="text-[11px] text-text-muted block mb-0.5">Start Date</label>
            <input
              type="date"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border border-border rounded px-2 py-1.5 text-[12px] focus:outline-none"
              autoFocus
            />
          </div>
          <div>
            <label className="text-[11px] text-text-muted block mb-0.5">End Date</label>
            <input
              type="date"
              value={toValue}
              onChange={(e) => setToValue(e.target.value)}
              className="w-full border border-border rounded px-2 py-1.5 text-[12px] focus:outline-none"
            />
          </div>
        </div>
      ) : selectedTypeDef?.input === 'text' ? (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          placeholder={`Enter ${selectedTypeDef.label}...`}
          className="w-full border border-border rounded px-2 py-1.5 text-[12px] mb-2 focus:outline-none"
          autoFocus
        />
      ) : (
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border border-border rounded px-2 py-1.5 text-[12px] mb-2 focus:outline-none"
        >
          <option value="">Select...</option>
          {selectedTypeDef?.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleClear}
          className="flex-1 py-1 text-[12px] border border-border rounded hover:bg-gray-50"
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-1 text-[12px] bg-brand-red text-white rounded hover:bg-red-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

/**
 * Sortable + filterable column header
 */
function ColHeader({ label, sortKey, column, children, className = '' }) {
  const sortBy = useProjectStore((s) => s.sortBy);
  const sortDir = useProjectStore((s) => s.sortDir);
  const setSort = useProjectStore((s) => s.setSort);
  const filters = useProjectStore((s) => s.filters);

  const [filterOpen, setFilterOpen] = useState(false);

  // Check if any filter key for this column is active
  const colConfig = column ? COLUMN_FILTER_CONFIGS[column] : null;
  const hasActiveFilter = colConfig
    ? colConfig.types.some((t) => filters[t.key])
    : false;

  return (
    <th
      className={`border border-border px-[10px] py-[10px] text-left text-[14px] font-semibold text-black sticky top-0 bg-table-header ${className}`}
    >
      <div className="flex items-center gap-1">
        {sortKey ? (
          <button onClick={() => setSort(sortKey)} className="flex items-center gap-1 cursor-pointer text-left">
            <span>{label}</span>
            <span className="flex flex-col text-[9px] leading-none text-gray-400 ml-0.5">
              <span className={sortBy === sortKey && sortDir === 'asc' ? 'text-brand-red' : ''}>&#9650;</span>
              <span className={sortBy === sortKey && sortDir === 'desc' ? 'text-brand-red' : ''}>&#9660;</span>
            </span>
          </button>
        ) : (
          <span>{label}</span>
        )}

        {column && (
          <button
            onClick={(e) => { e.stopPropagation(); setFilterOpen((p) => !p); }}
            className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 ${
              hasActiveFilter ? 'text-brand-red' : 'text-gray-400'
            }`}
            title="Filter column"
            aria-label={`Filter ${label}`}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.553.894l-4 2A1 1 0 016 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {filterOpen && column && (
        <ColumnFilterDropdown column={column} onClose={() => setFilterOpen(false)} />
      )}
      {children}
    </th>
  );
}

/**
 * Project data table — 7 columns
 * Sticky Project column, sortable headers, column-level filters, row click opens detail
 */
export function ProjectTable() {
  const projects = useProjectStore((s) => s.projects);
  const isLoading = useProjectStore((s) => s.isLoading);
  const openProjectDetail = useProjectStore((s) => s.openProjectDetail);
  const clearFilters = useProjectStore((s) => s.clearFilters);

  if (isLoading) {
    return (
      <div className="border border-border rounded overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-table-header" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`h-20 border-b border-border flex items-center px-4 gap-4 ${i % 2 === 1 ? 'bg-row-even' : 'bg-white'}`}>
              <div className="w-[200px] h-4 bg-gray-200 rounded" />
              <div className="flex-1 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded overflow-hidden flex flex-col h-full">
      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full min-w-[2100px] border-collapse">
          <thead>
            <tr className="bg-table-header">
              {/* Col 1: Project (sticky vertically + horizontally) */}
              <ColHeader
                label="Project"
                sortKey="name"
                column="project"
                className="sticky left-0 top-0 z-40 bg-table-header w-[250px]"
              />
              {/* Col 2: Tags */}
              <th className="border border-border px-[10px] py-[10px] text-left text-[14px] font-semibold text-black sticky top-0 bg-table-header w-[200px]">
                Tags
              </th>
              {/* Col 3: People (filterable) */}
              <ColHeader label="People" sortKey="headcount" column="people" className="w-[200px]" />
              {/* Col 4: Overall Health (filterable) */}
              <ColHeader label="Overall Health" sortKey="health_score" column="health" className="w-[180px]" />
              {/* Col 5: Delivery Health (filterable) */}
              <ColHeader label="Delivery Health" column="delivery" className="w-[160px]" />
              {/* Col 6: Assessment Status (sortable) */}
              <ColHeader label="Assessment Status" sortKey="overdue_days" className="w-[180px]" />
              {/* Col 7: Delivery Thoughts */}
              <th className="border border-border px-[10px] py-[10px] text-left text-[14px] font-semibold text-black sticky top-0 bg-table-header w-[225px]">
                Delivery Thoughts
              </th>
              {/* Col 8: Financials (filterable) */}
              <ColHeader label="Financials" sortKey="margin_percent" column="financials" className="w-[150px]" />
              {/* Col 9: CSAT (filterable) */}
              <ColHeader label="CSAT" sortKey="customer_confidence" column="csat" className="w-[120px]" />
              {/* Col 10: Milestone Health (filterable) */}
              <ColHeader label="Milestone Health" column="milestone" className="w-[150px]" />
              {/* Col 11: Timeline (filterable) */}
              <ColHeader label="Timeline" column="timeline" className="w-[180px]" />
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-12">
                  <div className="text-text-muted text-[14px] mb-3">No projects found.</div>
                  <button
                    onClick={clearFilters}
                    className="text-[13px] bg-brand-red text-white rounded px-4 py-1.5 hover:bg-red-700"
                  >
                    Clear Filters
                  </button>
                </td>
              </tr>
            ) : (
              projects.map((project, index) => {
                const tags = typeof project.tags === 'string' ? JSON.parse(project.tags) : (project.tags || []);
                const rowBg = index % 2 === 1 ? 'bg-row-even' : 'bg-white';
                const openTab = (tab) => (e) => { e.stopPropagation(); openProjectDetail(project.id, tab); };
                return (
                  <tr
                    key={project.id}
                    className={`${rowBg} hover:bg-[#EEF2FF] transition-colors`}
                  >
                    {/* Col 1: Project (sticky) */}
                    <td className={`sticky left-0 z-10 ${rowBg} border border-border px-[10px] py-[10px] align-top cursor-pointer`} onClick={openTab('overview')}>
                      <div>
                        <a href="#" className="text-[12px] font-bold text-text-secondary hover:underline" onClick={(e) => e.preventDefault()}>
                          {project.name}
                        </a>
                        <div className="text-[12px] text-text-muted mt-0.5">{project.client_name}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.project_type && (
                            <span className="inline-block border border-[#DDDDDD] rounded-[5px] px-[5px] py-[2px] text-[11.2px] text-black">
                              {project.project_type}
                            </span>
                          )}
                          {project.engagement_model && (
                            <span className="inline-block border border-[#DDDDDD] rounded-[5px] px-[5px] py-[2px] text-[11.2px] text-black">
                              {project.engagement_model}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Tags */}
                    <td className="border border-border px-[10px] py-[10px] align-top cursor-pointer" onClick={openTab('overview')}>
                      <div className="flex flex-wrap gap-1">
                        {tags.slice(0, 5).map((tag, idx) => (
                          <TagPill key={idx} category={tag.category} value={tag.value} />
                        ))}
                        {tags.length > 5 && (
                          <span className="text-[11px] text-text-muted">+{tags.length - 5}</span>
                        )}
                      </div>
                    </td>

                    {/* Col 3: People */}
                    <td className="border border-border px-[10px] py-[10px] align-top cursor-pointer" onClick={openTab('people')}>
                      <div className="space-y-1">
                        {project.pdm_name && (
                          <div>
                            <span className="text-[12px] text-text-muted">Product Dev Manager</span>
                            <span className="block text-[12px] font-semibold text-black">{project.pdm_name}</span>
                          </div>
                        )}
                        {project.sm_name && (
                          <div>
                            <span className="text-[12px] text-text-muted">Sales Manager</span>
                            <span className="block text-[12px] font-semibold text-black">{project.sm_name}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-100 pt-1 mt-1 flex items-center gap-3">
                          <span className="text-[12px] text-[#101213]">
                            <svg className="w-3 h-3 inline mr-0.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                            {project.headcount}
                          </span>
                          <span className="text-[12px] text-[#101213]">{parseFloat(project.fte).toFixed(1)} FTE</span>
                        </div>
                      </div>
                    </td>

                    {/* Col 4: Overall Health */}
                    <td className="border border-border px-[10px] py-[10px] align-top cursor-pointer" onClick={openTab('health')}>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-text-muted">Health Score</span>
                          <HealthBadge score={project.health_score} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-text-muted">Service Quality</span>
                          <StatusPill status={project.service_quality} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-text-muted">Financial Health</span>
                          <StatusPill status={project.financial_health} />
                        </div>
                      </div>
                    </td>

                    {/* Col 5: Delivery Health */}
                    <td className="border border-border px-[10px] py-[10px] align-top cursor-pointer" onClick={openTab('delivery')}>
                      <div className="space-y-1">
                        <MetricValue label="SPI" value={project.spi} redWhen="below1" />
                        <MetricValue label="CPI" value={project.cpi} redWhen="negative" />
                        <VarianceValue value={project.variance_percent} />
                      </div>
                    </td>

                    {/* Col 6: Assessment Status */}
                    <td className="border border-border px-[10px] py-[10px] align-top cursor-pointer" onClick={openTab('delivery')}>
                      <div className="space-y-1">
                        {project.assessment_overdue ? (
                          <OverdueBadge days={project.overdue_days} />
                        ) : (
                          <span className="text-[12px] text-text-muted">-</span>
                        )}
                        {project.severe_overburn && (
                          <span
                            className="inline-block rounded px-[6px] py-[2px] text-[12px] font-bold mt-1"
                            style={{ backgroundColor: '#FFE0DD', color: '#E32200' }}
                          >
                            Severe Overburn
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Col 7: Delivery Thoughts */}
                    <td className="border border-border px-[10px] py-[10px] align-top cursor-pointer" onClick={openTab('thoughts')}>
                      {project.latest_thought ? (
                        <div>
                          <span className="inline-block text-[10px] italic text-text-muted mb-0.5">Latest</span>
                          <p className="text-[12px] text-text-muted line-clamp-2">{project.latest_thought}</p>
                          <span className="text-[12px] text-text-muted block mt-0.5">
                            {formatDate(project.latest_thought_date)} | {project.latest_thought_author}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[12px] text-text-muted">-</span>
                      )}
                    </td>

                    {/* Col 8: Financials */}
                    <td className="border border-border px-[10px] py-[10px] align-top cursor-pointer" onClick={openTab('financials')}>
                      <div className="space-y-1">
                        {project.margin_percent !== null && project.margin_percent !== undefined ? (
                          <div className="text-[12px]">
                            <span className="text-text-muted">Margin: </span>
                            <span className={parseFloat(project.margin_percent) < 0 ? 'text-brand-red font-semibold' : 'text-[#37B24D] font-semibold'}>
                              {parseFloat(project.margin_percent).toFixed(1)}%
                            </span>
                          </div>
                        ) : (
                          <div className="text-[12px] text-text-muted">Margin: -</div>
                        )}
                        {project.overburn_percent !== null && project.overburn_percent !== undefined ? (
                          <div className="text-[12px]">
                            <span className="text-text-muted">Overburn: </span>
                            <span className={parseFloat(project.overburn_percent) > 0 ? 'text-brand-red font-semibold' : 'text-[#37B24D] font-semibold'}>
                              {parseFloat(project.overburn_percent).toFixed(1)}%
                            </span>
                          </div>
                        ) : (
                          <div className="text-[12px] text-text-muted">Overburn: -</div>
                        )}
                      </div>
                    </td>

                    {/* Col 9: CSAT */}
                    <td className="border border-border px-[10px] py-[10px] align-top cursor-pointer" onClick={openTab('csat')}>
                      {project.customer_confidence ? (
                        <div>
                          <span
                            className="text-[13px] font-bold whitespace-nowrap"
                            style={{ color: parseFloat(project.customer_confidence) < 3.5 ? '#E32200' : '#37B24D' }}
                          >
                            {parseFloat(project.customer_confidence).toFixed(1)}/5
                          </span>
                          {project.csat_trend && (
                            <div className="text-[11px] mt-0.5">
                              <span style={{ color: project.csat_trend === 'Up' ? '#37B24D' : project.csat_trend === 'Down' ? '#E32200' : '#595959' }}>
                                {project.csat_trend === 'Up' ? '▲' : project.csat_trend === 'Down' ? '▼' : '●'} {project.csat_trend}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[12px] text-text-muted">-</span>
                      )}
                    </td>

                    {/* Col 10: Milestone Health */}
                    <td className="border border-border px-[10px] py-[10px] align-top cursor-pointer" onClick={openTab('milestone')}>
                      {parseInt(project.total_milestones, 10) > 0 ? (
                        <div className="space-y-1">
                          <div className="text-[12px]">
                            <span className="text-text-muted">Total: </span>
                            <span className="font-semibold text-black">{project.total_milestones}</span>
                          </div>
                          {parseInt(project.at_risk_milestones, 10) > 0 && (
                            <span
                              className="inline-block rounded px-[6px] py-[2px] text-[11px] font-semibold"
                              style={{ backgroundColor: '#FFE0DD', color: '#E32200' }}
                            >
                              {project.at_risk_milestones} At Risk
                            </span>
                          )}
                          <div className="text-[11px] text-text-muted">
                            {project.completed_milestones}/{project.total_milestones} done
                          </div>
                        </div>
                      ) : (
                        <span className="text-[12px] text-text-muted">-</span>
                      )}
                    </td>

                    {/* Col 11: Timeline */}
                    <td className="border border-border px-[10px] py-[10px] align-top cursor-pointer" onClick={openTab('timeline')}>
                      {project.contract_start_date || project.contract_end_date ? (
                        <div className="space-y-1">
                          {project.contract_start_date && (
                            <div className="text-[12px]">
                              <span className="text-text-muted">Start: </span>
                              <span className="text-black">{new Date(project.contract_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          )}
                          {project.contract_end_date && (
                            <div className="text-[12px]">
                              <span className="text-text-muted">End: </span>
                              <span className="text-black">{new Date(project.contract_end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          )}
                          {project.contract_value && (
                            <div className="text-[12px]">
                              <span className="text-text-muted">Value: </span>
                              <span className="font-semibold text-black">
                                {parseFloat(project.contract_value) >= 1000000
                                  ? `$${(parseFloat(project.contract_value) / 1000000).toFixed(2)}M`
                                  : `$${(parseFloat(project.contract_value) / 1000).toFixed(0)}K`}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[12px] text-text-muted">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
