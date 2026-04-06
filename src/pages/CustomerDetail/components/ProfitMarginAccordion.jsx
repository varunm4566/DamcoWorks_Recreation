import { useState, useEffect } from 'react';
import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';

function CurrencyToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-[11px] ${!value ? 'font-semibold text-text-primary' : 'text-text-muted'}`}>INR</span>
      <button role="switch" aria-checked={value} onClick={onChange}
        className={`relative w-8 h-4 rounded-full transition-colors ${value ? 'bg-brand-red' : 'bg-gray-300'}`}>
        <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
      <span className={`text-[11px] ${value ? 'font-semibold text-text-primary' : 'text-text-muted'}`}>USD</span>
    </div>
  );
}

/**
 * Profit Margin accordion — BYT & T&M and FP tabs.
 * Uses project data from the store (already loaded in ProjectsAccordion).
 * Displays a summarized table derived from loaded projects.
 */
export function ProfitMarginAccordion({ customerId }) {
  const isOpen           = useCustomerDetailStore((s) => s.accordions.profitMargin);
  const toggleAccordion  = useCustomerDetailStore((s) => s.toggleAccordion);
  const projects         = useCustomerDetailStore((s) => s.projects);

  const [activeTab, setActiveTab] = useState('bytTm');
  const [currency, setCurrency]   = useState('usd');
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (key) => setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));

  const INR_RATE = 83.37;
  const fmtMoney = (val) => {
    const n = parseFloat(val) || 0;
    if (currency === 'inr') return `₹${(n * INR_RATE / 100000).toFixed(2)}L`;
    return `$${(n / 1000).toFixed(2)}K`;
  };

  const downloadCsv = () => {
    const tab = activeTab === 'bytTm' ? 'BYT-TM' : 'FP';
    const headers = ['Project', 'Revenue', 'Cost', 'Profit', 'Margin %', 'Status'];
    const csvRows = displayProjects.map((proj) => {
      const rev = parseFloat(proj.total_revenue_usd) || 0;
      const cost = parseFloat(proj.total_cost_usd) || 0;
      const profit = rev - cost;
      const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : '—';
      return [proj.name, fmtMoney(rev), fmtMoney(cost), fmtMoney(profit), `${margin}%`, proj.status];
    });
    const content = [headers, ...csvRows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profit-margin-${tab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Aggregate projects by model
  const tmProjects = projects.filter((p) => p.engagement_model?.toLowerCase().includes('t&m') || p.engagement_model?.toLowerCase() === 't&m');
  const fpProjects = projects.filter((p) => p.engagement_model?.toLowerCase() === 'fp' || p.engagement_model?.toLowerCase() === 'fixed price');

  // Summary metrics
  const totalRevenue = projects.reduce((s, p) => s + (parseFloat(p.total_revenue_usd) || 0), 0);
  const totalCost    = projects.reduce((s, p) => s + (parseFloat(p.total_cost_usd) || 0), 0);
  const totalProfit  = totalRevenue - totalCost;
  const marginPct    = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(0) : 0;

  const displayProjects = activeTab === 'bytTm' ? tmProjects : fpProjects;

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-3">
      <button
        onClick={() => toggleAccordion('profitMargin')}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-[14px] font-semibold text-text-primary">Profit Margin</span>
        <svg className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-border">
          {/* Summary metrics */}
          <div className="flex items-center gap-6 px-4 py-3 bg-gray-50 border-b border-border text-[13px]">
            <div>
              <span className="text-text-muted">Margin: </span>
              <span className="font-bold text-green-700">{marginPct}%</span>
              <span className="text-text-muted"> ({fmtMoney(totalProfit)})</span>
            </div>
            <div>
              <span className="text-text-muted">Total Revenue: </span>
              <span className="font-semibold text-text-primary">{fmtMoney(totalRevenue)}</span>
            </div>
            <div>
              <span className="text-text-muted">Total Cost: </span>
              <span className="font-semibold text-text-primary">{fmtMoney(totalCost)}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between px-4 pt-2.5 pb-0">
            <div className="flex gap-1">
              {[
                { key: 'bytTm', label: 'BYT & T&M' },
                { key: 'fp',    label: 'FP' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 text-[12px] font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-brand-red text-brand-red'
                      : 'border-transparent text-text-muted hover:text-text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pb-1">
              {activeTab === 'bytTm' && (
                <span className="text-[11px] border border-border rounded-full px-2.5 py-0.5 text-text-muted">
                  Last 12 Months
                </span>
              )}
              <CurrencyToggle value={currency === 'usd'} onChange={() => setCurrency((c) => c === 'usd' ? 'inr' : 'usd')} />
              <button onClick={downloadCsv} className="p-1 rounded hover:bg-gray-100 text-text-muted" aria-label="Download CSV">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {activeTab === 'bytTm' ? (
              <table className="w-full">
                <thead className="bg-table-header">
                  <tr>
                    <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary w-8" />
                    <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary">Project</th>
                    <th className="py-2 px-3 text-right text-[11px] font-medium text-text-secondary">Revenue</th>
                    <th className="py-2 px-3 text-right text-[11px] font-medium text-text-secondary">Cost</th>
                    <th className="py-2 px-3 text-right text-[11px] font-medium text-text-secondary">Profit</th>
                    <th className="py-2 px-3 text-right text-[11px] font-medium text-text-secondary">Margin %</th>
                    <th className="py-2 px-3 text-center text-[11px] font-medium text-text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {displayProjects.length === 0 ? (
                    <tr><td colSpan={7} className="py-6 text-center text-text-muted text-[12px]">No T&M projects found.</td></tr>
                  ) : displayProjects.map((proj, idx) => {
                    const revenue = parseFloat(proj.total_revenue_usd) || 0;
                    const cost    = parseFloat(proj.total_cost_usd) || 0;
                    const profit  = revenue - cost;
                    const margin  = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '—';
                    const rowKey  = proj.id;
                    return (
                      <>
                        <tr key={rowKey} className={idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => toggleRow(rowKey)}
                              className="w-5 h-5 rounded border border-border flex items-center justify-center text-text-muted hover:bg-gray-100 text-[12px]"
                              aria-label={expandedRows[rowKey] ? 'Collapse' : 'Expand'}
                            >
                              {expandedRows[rowKey] ? '−' : '+'}
                            </button>
                          </td>
                          <td className="py-2.5 px-3 text-[12px] text-text-primary">{proj.name}</td>
                          <td className="py-2.5 px-3 text-[12px] text-right font-medium">{fmtMoney(revenue)}</td>
                          <td className="py-2.5 px-3 text-[12px] text-right text-text-secondary">{fmtMoney(cost)}</td>
                          <td className="py-2.5 px-3 text-[12px] text-right">{fmtMoney(profit)}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[12px] font-medium text-green-700">{margin}%</span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              proj.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                            }`}>
                              {proj.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                        {expandedRows[rowKey] && (
                          <tr key={`${rowKey}-exp`} className="bg-blue-50/30">
                            <td colSpan={7} className="px-8 py-2">
                              <div className="text-[11px] text-text-muted italic py-1">
                                Monthly breakdown coming soon — project-level revenue is displayed above.
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              /* FP Tab */
              <table className="w-full">
                <thead className="bg-table-header">
                  <tr>
                    <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary w-8" />
                    <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary">Project</th>
                    <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary">Start Date</th>
                    <th className="py-2 px-3 text-left text-[11px] font-medium text-text-secondary">End Date</th>
                    <th className="py-2 px-3 text-right text-[11px] font-medium text-text-secondary">Booked Value</th>
                    <th className="py-2 px-3 text-right text-[11px] font-medium text-text-secondary">Revenue</th>
                    <th className="py-2 px-3 text-right text-[11px] font-medium text-text-secondary">Margin %</th>
                    <th className="py-2 px-3 text-center text-[11px] font-medium text-text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {fpProjects.length === 0 ? (
                    <tr><td colSpan={8} className="py-6 text-center text-text-muted text-[12px]">No FP projects found.</td></tr>
                  ) : fpProjects.map((proj, idx) => {
                    const revenue = parseFloat(proj.total_revenue_usd) || 0;
                    const cost    = parseFloat(proj.total_cost_usd) || 0;
                    const profit  = revenue - cost;
                    const margin  = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '—';
                    const rowKey  = `fp-${proj.id}`;
                    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—';
                    return (
                      <tr key={rowKey} className={idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}>
                        <td className="py-2.5 px-3">
                          <button className="w-5 h-5 rounded border border-border flex items-center justify-center text-text-muted hover:bg-gray-100 text-[12px]" aria-label="Expand">
                            +
                          </button>
                        </td>
                        <td className="py-2.5 px-3 text-[12px] text-text-primary">{proj.name}</td>
                        <td className="py-2.5 px-3 text-[12px] text-text-secondary">{fmtDate(proj.contract_start_date)}</td>
                        <td className="py-2.5 px-3 text-[12px] text-text-secondary">{fmtDate(proj.contract_end_date)}</td>
                        <td className="py-2.5 px-3 text-right text-[12px]">{fmtMoney(proj.total_revenue_usd)}</td>
                        <td className="py-2.5 px-3 text-right text-[12px] font-medium">{fmtMoney(revenue)}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="text-[12px] font-medium text-green-700">{margin}%</span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            proj.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                          }`}>
                            {proj.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
