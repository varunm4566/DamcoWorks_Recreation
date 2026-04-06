import * as XLSX from 'xlsx-js-style';

// Export the overview COE table to an Excel file.
export function OverviewExportButton({ rows }) {
  const handleExport = () => {
    const data = rows.map(r => ({
      'COE': r.coe,
      'Managed By': r.managedBy,
      'Division': r.division,
      'People': r.people,
      'Employees': r.employees,
      'Consultants': r.consultants,
      'Interns': r.interns,
      'Allocation %': r.allocation.overall,
      'Client Project %': r.allocation.clientProject,
      'Damco IP %': r.allocation.damcoIP,
      'Unallocated %': r.allocation.unallocated,
      'Billing %': r.billing.overall,
      'Billed %': r.billing.billed,
      'Non-billed %': r.billing.nonBilled,
      'Availability %': r.availability.overall,
      'Fully Available Now': r.availability.fullyNow,
      'Partially Available Now': r.availability.partialNow,
      'COE Utilization %': r.coeUtilization.percentage,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Overview');
    XLSX.writeFile(wb, `DW_Overview_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      aria-label="Export overview to Excel"
      className="flex items-center justify-center w-7 h-7 rounded border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
      title="Export to Excel"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </button>
  );
}
