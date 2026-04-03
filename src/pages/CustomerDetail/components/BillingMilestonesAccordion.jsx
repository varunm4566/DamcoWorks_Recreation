import { useState } from 'react';
import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';

/**
 * Billing Milestones & Invoices accordion.
 * Shows a summary strip and project-level nested accordions with invoice tables.
 * Invoice data is derived from the loaded projects and their mock structure.
 */
export function BillingMilestonesAccordion({ customerId }) {
  const isOpen          = useCustomerDetailStore((s) => s.accordions.billing);
  const toggleAccordion = useCustomerDetailStore((s) => s.toggleAccordion);
  const projects        = useCustomerDetailStore((s) => s.projects);

  // Compute aggregates from project data
  const totalRevenue  = projects.reduce((s, p) => s + (parseFloat(p.total_revenue_usd) || 0), 0);
  const totalCost     = projects.reduce((s, p) => s + (parseFloat(p.total_cost_usd) || 0), 0);
  const outstanding   = totalRevenue * 0.05;  // ~5% outstanding (demo approximation)
  const overdue       = outstanding * 0.5;
  const received      = totalRevenue - outstanding;
  const toBeInvoiced  = totalCost * -3;        // demo negative to match screenshot

  const fmtMoney = (val) => `$${((Math.abs(parseFloat(val) || 0)) / 1000).toFixed(2)}K`;

  const summaryItems = [
    { label: 'Invoiced',        value: fmtMoney(totalRevenue),  color: 'text-green-700' },
    { label: 'Received',        value: fmtMoney(received),      color: 'text-green-700' },
    { label: 'Outstanding',     value: fmtMoney(outstanding),   color: 'text-amber-600' },
    { label: 'Overdue',         value: fmtMoney(overdue),       color: 'text-red-600' },
    { label: 'To be Invoiced',  value: `-${fmtMoney(toBeInvoiced)}`, color: 'text-amber-600' },
  ];

  // Mock invoice rows per project
  const mockInvoices = [
    { invoice_no: 'CUB/1904/0001', sent_date: '2026-01-15', due_date: '2026-03-16', received_date: null, amount: 6000, status: 'Not Overdue' },
    { invoice_no: 'CUB/1904/0002', sent_date: '2025-12-12', due_date: '2026-02-10', received_date: null, amount: 6000, status: 'Not Overdue' },
    { invoice_no: 'CUB/1904/0003', sent_date: '2025-11-10', due_date: '2026-01-09', received_date: '2026-01-07', amount: 5500, status: 'Payment Received' },
  ];

  const fmtDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-3">
      <button
        onClick={() => toggleAccordion('billing')}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-[14px] font-semibold text-text-primary">Billing Milestones and Invoices</span>
        <svg className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-border">
          {/* Total Account Receivables + color strip */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-[11px] text-text-muted">Total Account Receivables</div>
                <div className="text-[22px] font-bold text-text-primary">{fmtMoney(outstanding)}</div>
              </div>
              <button className="p-1 rounded hover:bg-gray-100 text-text-muted" aria-label="Download">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
            {/* Color metric strip */}
            <div className="flex gap-4 flex-wrap">
              {summaryItems.map((item) => (
                <div key={item.label}>
                  <span className="text-[11px] text-text-muted">{item.label}: </span>
                  <span className={`text-[12px] font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Project-level nested accordions */}
          <div className="divide-y divide-border">
            {projects.slice(0, 5).map((proj) => (
              <ProjectBillingAccordion key={proj.id} project={proj} invoices={mockInvoices} fmtDate={fmtDate} fmtMoney={fmtMoney} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Inner project-level accordion for billing */
function ProjectBillingAccordion({ project, invoices, fmtDate, fmtMoney }) {
  const [open, setOpen] = useState(false);

  const totalInvoiced  = invoices.reduce((s, inv) => s + (inv.amount || 0), 0);
  const totalReceived  = invoices.filter((i) => i.received_date).reduce((s, i) => s + (i.amount || 0), 0);
  const totalOutstanding = totalInvoiced - totalReceived;

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 text-[12px] text-text-secondary flex-wrap">
          <span className="font-medium text-text-primary">Project: {project.name}</span>
          <span>Invoiced: {fmtMoney(totalInvoiced)}</span>
          <span>Received: {fmtMoney(totalReceived)}</span>
          <span>Outstanding: {fmtMoney(totalOutstanding)}</span>
          <span className="text-text-muted">Payterm days: {project.payterm_days || 60}</span>
        </div>
        <svg className={`w-4 h-4 text-text-muted transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-border overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-table-header">
              <tr>
                {['Milestone', 'Invoice#', 'Invoice Dt', 'Payment Due Dt', 'Payment Received On', 'Invoice Amount', 'Days Overdue', 'Status'].map((h) => (
                  <th key={h} className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((inv, idx) => (
                <tr key={idx} className={idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}>
                  <td className="py-2 px-3 text-[12px] text-text-secondary">Milestone {idx + 1}</td>
                  <td className="py-2 px-3 text-[12px] text-text-primary">{inv.invoice_no}</td>
                  <td className="py-2 px-3 text-[12px] text-text-secondary">{fmtDate(inv.sent_date)}</td>
                  <td className="py-2 px-3 text-[12px] text-text-secondary">{fmtDate(inv.due_date)}</td>
                  <td className="py-2 px-3 text-[12px] text-text-secondary">{fmtDate(inv.received_date)}</td>
                  <td className="py-2 px-3 text-[12px] font-medium text-text-primary">{fmtMoney(inv.amount)}</td>
                  <td className="py-2 px-3 text-[12px] text-text-muted">—</td>
                  <td className="py-2 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      inv.status === 'Payment Received'
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {inv.status}
                    </span>
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
