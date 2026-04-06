import * as XLSX from 'xlsx-js-style';

export function ProjectExportButton({ rows }) {
  const handleExport = () => {
    const data = rows.map(r => ({
      'Project': r.name,
      'Client': r.client,
      'Tags': r.tags.join(', '),
      'COE Count': r.coeCount,
      'People (Body Count)': r.people.bodyCount,
      'People (FTE)': r.people.fte,
      'Fully Allocated': r.fullyAllocated,
      'Partially Allocated': r.partiallyAllocated,
      'Allocation %': r.allocation,
      'Allocation Fulfillment %': r.allocationFulfillment,
      'Billing %': r.billing,
      'Fully Billed': r.fullyBilled,
      'Partially Billed': r.partiallyBilled,
      'Unbilled': r.unbilled,
      'Upcoming Release Date': r.upcomingRelease.date || '',
      'Health Score': r.healthScore ?? '',
      'Service Quality': r.serviceQuality,
      'CSAT': r.csat ?? '',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Projects');
    XLSX.writeFile(wb, `DW_Projects_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      aria-label="Export projects to Excel"
      className="flex items-center justify-center w-7 h-7 rounded border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
      title="Export to Excel"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </button>
  );
}
