import { useEffect } from 'react';
import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-text-muted">
      <svg className="w-14 h-14 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p className="text-[13px]">There are no logs to display.</p>
    </div>
  );
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Logs (Activities) section — tracks Client Partner and Client Co-Partner assignment changes.
 * Two tabs: Client Partner Logs | Client Co-Partner Logs.
 */
export function LogsSection({ customerId }) {
  const cpLogs   = useCustomerDetailStore((s) => s.clientPartnerLogs);
  const ccpLogs  = useCustomerDetailStore((s) => s.clientCoPartnerLogs);
  const loading  = useCustomerDetailStore((s) => s.partnerLogsLoading);
  const tab      = useCustomerDetailStore((s) => s.partnerLogsTab);

  const loadPartnerLogs = useCustomerDetailStore((s) => s.loadPartnerLogs);
  const setTab          = useCustomerDetailStore((s) => s.setPartnerLogsTab);

  useEffect(() => {
    loadPartnerLogs(customerId);
  }, [customerId]);

  const rows = tab === 'client_partner' ? cpLogs : ccpLogs;
  const colLabel = tab === 'client_partner' ? 'Client Partner' : 'Client Co-Partner';

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-border mb-4">
        {[
          { key: 'client_partner',     label: 'Client Partner Logs' },
          { key: 'client_co_partner',  label: 'Client Co-Partner Logs' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${
              tab === t.key
                ? 'border-brand-red text-brand-red'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-8 text-center text-text-muted text-[13px]">Loading…</div>
      ) : rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-table-header">
              <tr>
                <th className="py-2 px-4 text-left text-[11px] font-medium text-text-secondary">{colLabel}</th>
                <th className="py-2 px-4 text-left text-[11px] font-medium text-text-secondary">Added On</th>
                <th className="py-2 px-4 text-left text-[11px] font-medium text-text-secondary">Updated On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((log, idx) => (
                <tr key={log.id} className={idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}>
                  <td className="py-3 px-4 text-[13px] font-medium text-text-primary">{log.partner_name}</td>
                  <td className="py-3 px-4">
                    <div className="text-[12px] text-text-primary">{fmtDate(log.added_on)}</div>
                    {log.added_by && (
                      <div className="text-[11px] text-text-muted">by: {log.added_by}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {log.updated_on ? (
                      <>
                        <div className="text-[12px] text-text-primary">{fmtDate(log.updated_on)}</div>
                        {log.updated_by && (
                          <div className="text-[11px] text-text-muted">by: {log.updated_by}</div>
                        )}
                      </>
                    ) : (
                      <span className="text-[12px] text-text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
