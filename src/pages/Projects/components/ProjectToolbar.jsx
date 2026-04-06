import { useState, useRef, useEffect } from 'react';
import { useProjectStore } from '../../../stores/projectStore.js';
import { exportCsv } from '../../../utils/exportCsv.js';

/**
 * Toolbar row: DM/PDM dropdown, search, download, global filter button
 */
export function ProjectToolbar() {
  const dmPdmList = useProjectStore((s) => s.dmPdmList);
  const selectedDm = useProjectStore((s) => s.selectedDm);
  const setSelectedDm = useProjectStore((s) => s.setSelectedDm);
  const searchTerm = useProjectStore((s) => s.searchTerm);
  const setSearchTerm = useProjectStore((s) => s.setSearchTerm);
  const toggleGlobalFilter = useProjectStore((s) => s.toggleGlobalFilter);
  const projects = useProjectStore((s) => s.projects);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const searchInputRef = useRef(null);
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchChange = (value) => {
    setLocalSearch(value);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setSearchTerm(value), 400);
  };

  const handleDownload = () => {
    if (!projects.length) return;
    const headers = ['Project', 'Client', 'Division', 'Type', 'Status', 'PDM', 'DM', 'Health Score', 'SPI', 'CPI'];
    const rows = projects.map((p) => [
      p.name, p.client_name, p.division, p.project_type, p.status,
      p.pdm_name, p.dm_name, p.health_score, p.spi, p.cpi,
    ]);
    exportCsv(headers, rows, 'projects-export.csv');
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* DM/PDM dropdown */}
      <div className="relative">
        <select
          value={selectedDm}
          onChange={(e) => setSelectedDm(e.target.value)}
          className="w-[180px] border border-border rounded px-3 py-1.5 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-tab appearance-none pr-8"
        >
          <option value="">Select DM/PDM</option>
          {dmPdmList.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {selectedDm && (
          <button
            onClick={() => setSelectedDm('')}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
          >
            &times;
          </button>
        )}
        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      {/* Search */}
      {isSearchOpen ? (
        <div className="flex items-center border border-border rounded overflow-hidden">
          <input
            ref={searchInputRef}
            type="text"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search projects..."
            className="px-3 py-1.5 text-[13px] w-[200px] focus:outline-none"
          />
          <button
            onClick={() => { setIsSearchOpen(false); setLocalSearch(''); setSearchTerm(''); }}
            className="px-2 py-1.5 text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-center w-[36px] h-[36px] border border-border rounded hover:bg-gray-50"
          title="Search"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
      )}

      {/* Download */}
      <button
        onClick={handleDownload}
        className="flex items-center justify-center h-[36px] px-3 border border-border rounded bg-[#F1F3F5] hover:bg-gray-200"
        title="Download"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </button>

      {/* Global Filter */}
      <button
        onClick={toggleGlobalFilter}
        className="flex items-center justify-center w-[36px] h-[36px] border border-border rounded hover:bg-gray-50"
        title="Filter"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
        </svg>
      </button>
    </div>
  );
}
