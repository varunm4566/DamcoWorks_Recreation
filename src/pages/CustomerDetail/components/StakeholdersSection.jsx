import { useEffect } from 'react';
import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';
import { ManageStakeholdersModal } from './ManageStakeholdersModal.jsx';

/**
 * Stakeholders section — pageless table of customer stakeholders
 * with a "Manage Stakeholders" button that opens a two-panel modal.
 */
export function StakeholdersSection({ customerId }) {
  const stakeholders        = useCustomerDetailStore((s) => s.stakeholders);
  const loading             = useCustomerDetailStore((s) => s.stakeholdersLoading);
  const manageOpen          = useCustomerDetailStore((s) => s.manageStakeholdersOpen);
  const loadStakeholders    = useCustomerDetailStore((s) => s.loadStakeholders);
  const openManage          = useCustomerDetailStore((s) => s.openManageStakeholders);

  useEffect(() => {
    loadStakeholders(customerId);
  }, [customerId]);

  return (
    <div>
      {/* Tab bar + action button */}
      <div className="flex items-center justify-between mb-3">
        <div className="border-b border-border">
          <button className="px-4 py-2 text-[13px] font-medium border-b-2 border-brand-red text-brand-red">
            Stakeholders
          </button>
        </div>
        <button
          onClick={() => openManage()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] bg-brand-red text-white rounded hover:opacity-90 transition-opacity"
          aria-label="Manage Stakeholders"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Manage Stakeholders
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-table-header">
              <tr>
                {[
                  'Name', 'Designation', 'Relationship Type', 'Stakeholder Role',
                  'Email', 'Contact Number', 'Last Contact Date', 'Reporting Manager',
                ].map((h) => (
                  <th key={h} className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-text-muted text-[13px]">Loading stakeholders…</td>
                </tr>
              ) : stakeholders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-text-muted text-[13px]">
                    No stakeholders found. Click "Manage Stakeholders" to add one.
                  </td>
                </tr>
              ) : stakeholders.map((s, idx) => {
                const fullName = `${s.salutation ? s.salutation + ' ' : ''}${s.first_name} ${s.last_name || ''}`.trim();
                const initials = `${(s.first_name || '')[0] || ''}${(s.last_name || '')[0] || ''}`.toUpperCase();
                const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—';

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}`}
                    onClick={() => openManage(s)}
                  >
                    {/* Name with avatar */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0">
                          {initials}
                        </div>
                        <span className="text-[12px] text-text-primary font-medium">{fullName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[12px] text-text-secondary">{s.designation || '—'}</td>
                    <td className="py-2.5 px-3 text-[12px] text-text-secondary">{s.relationship_type || '—'}</td>
                    <td className="py-2.5 px-3 text-[12px] text-text-secondary">{s.stakeholder_role || '—'}</td>
                    <td className="py-2.5 px-3 text-[12px] text-text-secondary">{s.email || '—'}</td>
                    <td className="py-2.5 px-3 text-[12px] text-text-secondary">{s.contact_number || '—'}</td>
                    <td className="py-2.5 px-3 text-[12px] text-text-muted">{fmtDate(s.last_contact_date)}</td>
                    <td className="py-2.5 px-3 text-[12px] text-text-muted">{s.reports_to || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {manageOpen && <ManageStakeholdersModal customerId={customerId} />}
    </div>
  );
}
