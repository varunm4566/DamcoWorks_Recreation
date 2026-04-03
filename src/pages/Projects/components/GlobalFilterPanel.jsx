import { useState, useEffect } from 'react';
import { useProjectStore } from '../../../stores/projectStore.js';

const FILTER_SECTIONS = [
  {
    key: 'offering',
    label: 'Offerings',
    options: [
      'ADI Low Codes', 'AI and Agents', 'Application Development and Integrations',
      'Cloud', 'Data and Visualisation', 'Enterprise Platforms', 'Healthcare',
      'Infra and Security', 'Insurance', 'Managed Services', 'Manufacturing and Logistics',
      'Marketing', 'Microsoft', 'Outsystems', 'Salesforce', 'Staffing', 'Testing', 'UX',
    ],
  },
  {
    key: 'geography',
    label: 'Geography',
    options: ['Africa', 'APAC', 'Canada', 'Caribbean', 'GCC', 'India', 'Mainland Europe', 'South America', 'UK', 'USA'],
  },
  {
    key: 'domain',
    label: 'Domain',
    options: [
      'Automotive', 'Digital Media and Advertising', 'Education', 'Energy and Utilities',
      'Financial Services', 'Health and Social Care', 'Hi-Tech', 'Human Resources and Recruitment',
      'Insurance', 'Manufacturing', 'Publishing and Media', 'Real Estate and Building Management',
      'Retail and Consumer Products', 'Telecom', 'Transportation and logistics', 'Travel and Hospitality',
    ],
  },
  {
    key: 'currency',
    label: 'Currency',
    options: ['AED', 'AUD', 'CAD', 'Euro', 'GBP', 'INR', 'USD', 'ZAR'],
  },
  {
    key: 'status',
    label: 'Status',
    options: ['Active', 'Inactive'],
  },
];

/**
 * Global filter modal — centered dialog with accordion sub-sections.
 * Replaces the previous full-height slide-out panel.
 */
export function GlobalFilterPanel() {
  const isOpen = useProjectStore((s) => s.isGlobalFilterOpen);
  const toggleGlobalFilter = useProjectStore((s) => s.toggleGlobalFilter);
  const applyGlobalFilters = useProjectStore((s) => s.applyGlobalFilters);
  const filters = useProjectStore((s) => s.filters);

  const [selections, setSelections] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (isOpen) {
      const initial = {};
      for (const section of FILTER_SECTIONS) {
        const filterKey = `tag_${section.key}`;
        initial[section.key] = filters[filterKey]
          ? (Array.isArray(filters[filterKey]) ? [...filters[filterKey]] : [filters[filterKey]])
          : [];
      }
      setSelections(initial);
      // All sections collapsed by default in modal (saves space)
      const collapsed = {};
      for (const section of FILTER_SECTIONS) collapsed[section.key] = false;
      setExpandedSections(collapsed);
    }
  }, [isOpen]);

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleOption = (sectionKey, option) => {
    setSelections((prev) => {
      const current = prev[sectionKey] || [];
      const isSelected = current.includes(option);
      return {
        ...prev,
        [sectionKey]: isSelected ? current.filter((v) => v !== option) : [...current, option],
      };
    });
  };

  const handleReset = () => {
    const empty = {};
    for (const section of FILTER_SECTIONS) empty[section.key] = [];
    setSelections(empty);
  };

  const handleApply = () => {
    applyGlobalFilters(selections);
  };

  const totalSelected = Object.values(selections).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={toggleGlobalFilter} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[560px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-black">Filter By</h2>
            {totalSelected > 0 && (
              <span className="text-[11px] bg-brand-red text-white rounded-full px-2 py-0.5 font-medium">
                {totalSelected} selected
              </span>
            )}
          </div>
          <button
            onClick={toggleGlobalFilter}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close filter panel"
          >
            &times;
          </button>
        </div>

        {/* Accordion sections */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {FILTER_SECTIONS.map((section) => {
            const sectionCount = selections[section.key]?.length || 0;
            const isExpanded = expandedSections[section.key];
            return (
              <div key={section.key} className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 text-left"
                >
                  <span className="flex items-center gap-2 text-[13px] font-medium text-black">
                    {section.label}
                    {sectionCount > 0 && (
                      <span className="text-[11px] bg-brand-red text-white rounded-full px-1.5 py-0.5">
                        {sectionCount}
                      </span>
                    )}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 max-h-[180px] overflow-y-auto custom-scrollbar">
                      {section.options.map((option) => {
                        const isChecked = (selections[section.key] || []).includes(option);
                        return (
                          <label key={option} className="flex items-center gap-2 cursor-pointer py-0.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleOption(section.key, option)}
                              className="w-3.5 h-3.5 rounded border-gray-300 text-brand-red focus:ring-brand-red flex-shrink-0"
                            />
                            <span className="text-[12px] text-text-secondary truncate">{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-border flex-shrink-0">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-[13px] border border-border rounded-lg hover:bg-gray-50 text-text-secondary"
          >
            Reset
          </button>
          <div className="flex-1" />
          <button
            onClick={toggleGlobalFilter}
            className="px-4 py-2 text-[13px] border border-border rounded-lg hover:bg-gray-50 text-text-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 text-[13px] bg-brand-red text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
