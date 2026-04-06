import * as XLSX from 'xlsx-js-style';

export function PeopleExportButton({ rows }) {
  const handleExport = () => {
    const data = rows.map(r => ({
      'Name': r.name,
      'Emp ID': r.empId,
      'Designation': r.designation,
      'COE': r.coe,
      'Skills': r.skills.join(', '),
      'Projects': r.projects,
      'Client Projects': r.clientProjects,
      'Damco IP Projects': r.damcoIP,
      'Governance BYT': r.governance.byt,
      'Governance T&M': r.governance.tm,
      'Governance FP': r.governance.fp,
      'Allocation %': r.allocation.notApplicable ? 'N/A' : r.allocation.overall,
      'Client Project %': r.allocation.notApplicable ? 'N/A' : r.allocation.clientProject,
      'Unallocated %': r.allocation.notApplicable ? 'N/A' : r.allocation.unallocated,
      'Billing %': r.billing.notApplicable ? 'N/A' : r.billing.overall,
      'Availability': r.availability,
      'Release %': r.upcomingRelease.percent,
      'Release From': r.upcomingRelease.from,
      'Rolloff Date': r.upcomingRelease.rolloffDate,
      'Upcoming Leaves': r.upcomingLeaves,
      'PIP': r.isPIP ? 'Yes' : 'No',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'People');
    XLSX.writeFile(wb, `DW_People_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      aria-label="Export people list to Excel"
      className="flex items-center justify-center w-7 h-7 rounded border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
      title="Export to Excel"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </button>
  );
}
