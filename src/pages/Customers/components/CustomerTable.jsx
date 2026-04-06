import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerStore } from '../../../stores/customerStore.js';
import { SortHeader } from '../../../components/UI/SortHeader.jsx';
import { Avatar } from '../../../components/UI/Avatar.jsx';
import { Badge } from '../../../components/UI/Badge.jsx';
import { HealthDots } from '../../../components/UI/HealthDots.jsx';
import { ReadOnlyCheckbox } from '../../../components/UI/ReadOnlyCheckbox.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { fetchEligiblePartners, updateClientPartner, updateClientCoPartner } from '../../../api/customerDetail.js';

const COLUMN_TOOLTIPS = {
  booked_sales: 'The total value of contracts booked within the current financial year (April to March).',
  revenue: 'Sum of all invoices generated, excluding written-off or voided invoices.',
  project_health: 'Green = Healthy, Orange = Caution, Red = At Risk',
  at_risk: 'A customer is considered "At Risk" if any of their active projects are currently marked as red or caution status.',
};

/**
 * Customer column filter dropdown - offers "Customer" (name search) and "Customer Status" (active/inactive)
 */
function CustomerFilterDropdown({ onClose, onApply }) {
  const [mode, setMode] = useState(null); // null = choose, 'name' = text input, 'status' = dropdown
  const [nameValue, setNameValue] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (mode === null) {
    return (
      <div ref={ref} className="absolute top-full left-0 mt-1 bg-white border border-border rounded shadow-lg z-50 min-w-[180px]">
        <button
          onClick={() => setMode('name')}
          className="block w-full text-left px-3 py-2 text-[13px] text-text-secondary hover:bg-gray-50"
        >
          Customer
        </button>
        <button
          onClick={() => setMode('status')}
          className="block w-full text-left px-3 py-2 text-[13px] text-text-secondary hover:bg-gray-50 border-t border-gray-100"
        >
          Customer Status
        </button>
      </div>
    );
  }

  if (mode === 'name') {
    return (
      <div ref={ref} className="absolute top-full left-0 mt-1 bg-white border border-border rounded shadow-lg z-50 min-w-[220px] p-3">
        <div className="text-[12px] text-text-muted mb-1">Search Customer</div>
        <input
          type="text"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && nameValue.trim()) { onApply('name', nameValue.trim()); onClose(); } }}
          placeholder="Type customer name..."
          className="w-full border border-border rounded px-2 py-1 text-[13px] focus:outline-none focus:border-brand-red mb-2"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-[12px] text-text-muted px-2 py-1 hover:bg-gray-50 rounded">Cancel</button>
          <button
            onClick={() => { if (nameValue.trim()) { onApply('name', nameValue.trim()); onClose(); } }}
            className="text-[12px] bg-brand-red text-white px-3 py-1 rounded hover:opacity-90"
          >
            Apply
          </button>
        </div>
      </div>
    );
  }

  // status mode
  return (
    <div ref={ref} className="absolute top-full left-0 mt-1 bg-white border border-border rounded shadow-lg z-50 min-w-[200px] p-3">
      <div className="text-[12px] text-text-muted mb-1">Customer Status</div>
      <select
        value={statusValue}
        onChange={(e) => setStatusValue(e.target.value)}
        className="w-full border border-border rounded px-2 py-1 text-[13px] focus:outline-none focus:border-brand-red mb-2"
        autoFocus
      >
        <option value="">Select...</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="text-[12px] text-text-muted px-2 py-1 hover:bg-gray-50 rounded">Cancel</button>
        <button
          onClick={() => { if (statusValue) { onApply('customer_status', statusValue); onClose(); } }}
          className="text-[12px] bg-brand-red text-white px-3 py-1 rounded hover:opacity-90"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

/**
 * Parse DM/PDM JSONB and render name + practice + overflow badge
 * If multiple DMs, clicking +N opens a modal with full list
 */
function DmPdmCell({ dmPdm, onShowAll, customerName }) {
  let dms = [];
  try {
    dms = typeof dmPdm === 'string' ? JSON.parse(dmPdm) : (dmPdm || []);
  } catch {
    return <span className="text-text-muted">--</span>;
  }
  if (dms.length === 0) return <span className="text-text-muted">--</span>;

  const first = dms[0];
  const overflow = dms.length - 1;

  return (
    <div>
      <div className="flex items-center gap-1">
        <span className="text-[13px] text-text-secondary">{first.name}</span>
        {overflow > 0 && (
          <span
            className="inline-flex items-center justify-center min-w-[20px] h-[20px] rounded-full text-[11px] font-medium px-1 cursor-pointer hover:opacity-80"
            style={{ backgroundColor: '#CDE1FF', color: '#2680FF' }}
            onClick={() => onShowAll({ dms, customerName })}
          >
            +{overflow}
          </span>
        )}
      </div>
      <div className="text-[11px] text-text-secondary italic">({first.practice})</div>
    </div>
  );
}

/**
 * Modal showing full DM/PDM list for a customer
 */
function DmPdmModal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-[400px] max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-[15px] font-semibold text-black">DM / PDM</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
        </div>
        <p className="px-4 pt-2 text-[12px] text-text-muted">{data.customerName}</p>
        <div className="px-4 py-3 overflow-y-auto max-h-[60vh]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-3 font-semibold text-gray-600">#</th>
                <th className="text-left py-2 pr-3 font-semibold text-gray-600">Name</th>
                <th className="text-left py-2 font-semibold text-gray-600">Practice</th>
              </tr>
            </thead>
            <tbody>
              {data.dms.map((dm, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 pr-3 text-text-muted">{idx + 1}</td>
                  <td className="py-2 pr-3 text-text-secondary">{dm.name}</td>
                  <td className="py-2 text-text-secondary italic">{dm.practice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline modal for updating the Client Partner or Client Co-Partner from the Customer List.
 * type: 'client_partner' | 'client_co_partner'
 */
function PartnerUpdateModal({ customerId, currentPartner, type, onClose, onSaved }) {
  const title = type === 'client_co_partner' ? 'Update Client Co-Partner' : 'Update Client Partner';
  const fieldKey = type === 'client_co_partner' ? 'client_co_partner' : 'client_partner';

  const [partners, setPartners] = useState([]);
  const [selected, setSelected] = useState(currentPartner || '');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEligiblePartners()
      .then((data) => { setPartners(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = (Array.isArray(partners) ? partners : []).filter((p) => {
    const name = typeof p === 'string' ? p : p?.name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      if (type === 'client_co_partner') {
        await updateClientCoPartner(customerId, selected, 'Admin');
      } else {
        await updateClientPartner(customerId, selected, 'Admin');
      }
      onSaved(customerId, { [fieldKey]: selected });
      onClose();
    } catch {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-[380px] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-[15px] font-semibold text-text-primary">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none" aria-label="Close">&times;</button>
        </div>
        <div className="px-4 py-2 border-b border-border">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search partners..."
            className="w-full border border-border rounded px-2 py-1.5 text-[13px] focus:outline-none focus:border-brand-red"
          />
        </div>
        <div className="overflow-y-auto flex-1 px-2 py-1">
          {loading ? (
            <p className="text-center text-text-muted text-[12px] py-4">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-text-muted text-[12px] py-4">No partners found.</p>
          ) : filtered.map((p) => {
            const name = typeof p === 'string' ? p : p?.name;
            return (
              <label key={name} className="flex items-center gap-2.5 px-2 py-2 rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="partner"
                  value={name}
                  checked={selected === name}
                  onChange={() => setSelected(name)}
                  className="accent-brand-red"
                />
                <span className="text-[13px] text-text-primary">{name}</span>
              </label>
            );
          })}
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-border">
          <button onClick={onClose} className="px-3 py-1.5 text-[13px] text-text-muted hover:bg-gray-50 rounded border border-border">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selected || saving}
            className="px-3 py-1.5 text-[13px] bg-brand-red text-white rounded hover:opacity-90 disabled:opacity-50"
            aria-label="Save"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Main 15-column data grid
 * - Alternating row colors: white / #F5F5F5
 * - Sticky Customer column (wider)
 * - Sticky header, scrollable body
 * - Cell padding: 4px 16px
 */
export function CustomerTable() {
  const customers = useCustomerStore((s) => s.customers);
  const sortBy = useCustomerStore((s) => s.sortBy);
  const sortDir = useCustomerStore((s) => s.sortDir);
  const setSort = useCustomerStore((s) => s.setSort);
  const addFilter = useCustomerStore((s) => s.addFilter);
  const filters = useCustomerStore((s) => s.filters);
  const currency = useCustomerStore((s) => s.currency);
  const isLoading = useCustomerStore((s) => s.isLoading);
  const openCsatModal = useCustomerStore((s) => s.openCsatModal);
  const toggleCustomerField = useCustomerStore((s) => s.toggleCustomerField);

  const [showCustomerFilter, setShowCustomerFilter] = useState(false);
  const [dmModalData, setDmModalData] = useState(null);
  const [partnerModal, setPartnerModal] = useState(null); // { customerId, currentPartner, type }

  const salesKey = currency === 'usd' ? 'booked_sales_usd' : 'booked_sales_inr';
  const revenueKey = currency === 'usd' ? 'revenue_usd' : 'revenue_inr';
  const salesSortKey = currency === 'usd' ? 'booked_sales_usd' : 'booked_sales_inr';
  const revenueSortKey = currency === 'usd' ? 'revenue_usd' : 'revenue_inr';

  const handleCustomerFilterApply = (type, value) => {
    addFilter(type, value);
  };

  const hasCustomerFilter = filters.name || filters.customer_status;

  if (isLoading) {
    return (
      <div className="border border-border rounded overflow-hidden">
        <div className="animate-pulse">
          <div className="h-10 bg-table-header" />
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`h-12 border-b border-border flex items-center px-4 gap-4 ${i % 2 === 1 ? 'bg-row-even' : 'bg-white'}`}>
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1 h-3 bg-gray-200 rounded" />
              <div className="w-16 h-3 bg-gray-200 rounded" />
              <div className="w-16 h-3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border overflow-auto h-full custom-scrollbar">
      <table className="w-full min-w-[1700px] border-collapse">
        <thead className="sticky top-0 z-30">
          <tr>
              {/* Customer - sticky, wider */}
              <th className="px-4 py-1 text-left text-[14px] font-semibold text-black bg-table-header whitespace-nowrap border-b border-border sticky left-0 z-40 min-w-[280px] w-[280px]">
                <div className="flex items-center gap-1 relative">
                  <button onClick={() => setSort('name')} className="flex items-center gap-1 cursor-pointer">
                    <span>Customer</span>
                    <span className="flex flex-col text-[9px] leading-none text-gray-400 ml-0.5">
                      <span className={sortBy === 'name' && sortDir === 'asc' ? 'text-brand-red' : ''}>&#9650;</span>
                      <span className={sortBy === 'name' && sortDir === 'desc' ? 'text-brand-red' : ''}>&#9660;</span>
                    </span>
                  </button>
                  <button
                    onClick={() => setShowCustomerFilter(!showCustomerFilter)}
                    className={`ml-1 p-0.5 rounded hover:bg-gray-200 ${hasCustomerFilter ? 'text-brand-red' : 'text-gray-400'}`}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {showCustomerFilter && (
                    <CustomerFilterDropdown
                      onClose={() => setShowCustomerFilter(false)}
                      onApply={handleCustomerFilterApply}
                    />
                  )}
                </div>
              </th>
              <SortHeader label="Booked Sales" subLabel="CFY (Apr-Mar)" sortKey={salesSortKey} currentSort={sortBy} currentDir={sortDir} onSort={setSort} filterable filterType="numeric" onFilter={addFilter} activeFilter={filters[salesSortKey]} tooltip={COLUMN_TOOLTIPS.booked_sales} />
              <SortHeader label="Revenue" subLabel="CFY (Apr-Mar)" sortKey={revenueSortKey} currentSort={sortBy} currentDir={sortDir} onSort={setSort} filterable filterType="numeric" onFilter={addFilter} activeFilter={filters[revenueSortKey]} tooltip={COLUMN_TOOLTIPS.revenue} />
              <th className="px-4 py-1 text-left text-[14px] font-semibold text-black bg-table-header whitespace-nowrap border-b border-border">
                <span className="flex items-center gap-1">
                  Project Health
                  <span className="text-text-muted cursor-help text-[12px]" title={COLUMN_TOOLTIPS.project_health}>&#9432;</span>
                </span>
              </th>
              <SortHeader label="At Risk" sortKey="at_risk" currentSort={sortBy} currentDir={sortDir} onSort={setSort} tooltip={COLUMN_TOOLTIPS.at_risk} />
              <SortHeader label="Tier" sortKey="tier" currentSort={sortBy} currentDir={sortDir} onSort={setSort} filterable filterType="text" onFilter={addFilter} activeFilter={filters.tier} />
              <SortHeader label="CSAT" sortKey="csat_score" currentSort={sortBy} currentDir={sortDir} onSort={setSort} filterable filterType="numeric" onFilter={addFilter} activeFilter={filters.csat_score} />
              <SortHeader label="Sales Owner" sortKey="sales_owner" currentSort={sortBy} currentDir={sortDir} onSort={setSort} filterable filterType="text" onFilter={addFilter} activeFilter={filters.sales_owner} />
              <SortHeader label="Client Partner" sortKey="client_partner" currentSort={sortBy} currentDir={sortDir} onSort={setSort} filterable filterType="text" onFilter={addFilter} activeFilter={filters.client_partner} />
              <SortHeader label="CP Ownership" sortKey="cp_ownership" currentSort={sortBy} currentDir={sortDir} onSort={setSort} filterable filterType="boolean" onFilter={addFilter} activeFilter={filters.cp_ownership} />
              <SortHeader label="Incentive Eligibility" sortKey="incentive_eligibility" currentSort={sortBy} currentDir={sortDir} onSort={setSort} filterable filterType="boolean" onFilter={addFilter} activeFilter={filters.incentive_eligibility} />
              <SortHeader label="Client Co-Partner" sortKey="client_co_partner" currentSort={sortBy} currentDir={sortDir} onSort={setSort} filterable filterType="text" onFilter={addFilter} activeFilter={filters.client_co_partner} />
              <SortHeader label="DM/PDM" sortKey="dm_pdm" currentSort={sortBy} currentDir={sortDir} onSort={setSort} filterable filterType="text" onFilter={addFilter} activeFilter={filters.dm_pdm} />
              <SortHeader label="Industry" sortKey="industry" currentSort={sortBy} currentDir={sortDir} onSort={setSort} filterable filterType="text" onFilter={addFilter} activeFilter={filters.industry} />
              <SortHeader label="Referenceable" sortKey="referenceable" currentSort={sortBy} currentDir={sortDir} onSort={setSort} filterable filterType="boolean" onFilter={addFilter} activeFilter={filters.referenceable} />
            </tr>
          </thead>
          <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={15} className="px-4 py-12 text-center text-text-muted">
                    No customers found matching your filters.
                  </td>
                </tr>
              ) : (
                customers.map((customer, rowIndex) => {
                  const rowBg = rowIndex % 2 === 0 ? 'bg-white' : 'bg-row-even';
                  const statusColor = customer.status === 'active' ? '#008000' : '#999';
                  return (
                    <tr key={customer.id} className={`${rowBg} border-b border-border`}>
                      {/* Customer - sticky, wider */}
                      <td className={`px-4 py-1 sticky left-0 z-10 ${rowBg} border-b border-border min-w-[280px] w-[280px]`}>
                        <div className="flex items-center gap-2">
                          <Avatar name={customer.name} />
                          <div>
                            <Link
                              to={`/customers/${customer.id}?section=delivery`}
                              className="text-[13px] text-text-secondary hover:underline hover:text-brand-red"
                            >
                              {customer.name}
                            </Link>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px]" style={{ color: statusColor }}>({customer.status})</span>
                              {customer.is_new_logo && (
                                <span className="text-[10px] text-text-secondary block">(New)</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Booked Sales */}
                      <td className="px-4 py-1 text-[13px] text-text-secondary whitespace-nowrap align-middle">
                        {formatCurrency(customer[salesKey], currency)}
                      </td>

                      {/* Revenue */}
                      <td className="px-4 py-1 text-[13px] text-text-secondary whitespace-nowrap align-middle">
                        {formatCurrency(customer[revenueKey], currency)}
                      </td>

                      {/* Project Health */}
                      <td className="px-4 py-1 align-middle">
                        <HealthDots
                          green={customer.project_health_green}
                          orange={customer.project_health_orange}
                          red={customer.project_health_red}
                        />
                      </td>

                      {/* At Risk */}
                      <td className="px-4 py-1 align-middle">
                        {customer.at_risk && (
                          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#FA0000' }} title="At Risk" />
                        )}
                      </td>

                      {/* Tier */}
                      <td className="px-4 py-1 align-middle">
                        {customer.tier ? (
                          <Badge tier={customer.tier}>{customer.tier}</Badge>
                        ) : (
                          <span className="text-text-muted text-[13px]">--</span>
                        )}
                      </td>

                      {/* CSAT */}
                      <td className="px-4 py-1 align-middle">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] text-text-secondary">
                            {customer.csat_score ? `${Math.round(customer.csat_score)}/5` : '--'}
                          </span>
                          {customer.csat_score && (
                            <button
                              onClick={() => openCsatModal(customer.id, customer.name)}
                              className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full text-[15px] font-medium"
                              style={{ backgroundColor: '#CDE1FF', color: '#2680FF' }}
                              aria-label={`View CSAT for ${customer.name}`}
                            >
                              =
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Sales Owner */}
                      <td className="px-4 py-1 text-[13px] text-text-secondary align-middle">
                        {customer.sales_owner || '--'}
                      </td>

                      {/* Client Partner */}
                      <td className="px-4 py-1 text-[13px] align-middle">
                        <button
                          onClick={() => setPartnerModal({ customerId: customer.id, currentPartner: customer.client_partner, type: 'client_partner' })}
                          className="text-text-secondary hover:text-brand-red hover:underline text-left"
                          aria-label={`Update client partner for ${customer.name}`}
                        >
                          {customer.client_partner || '--'}
                        </button>
                      </td>

                      {/* CP Ownership */}
                      <td className="px-4 py-1 align-middle">
                        <ReadOnlyCheckbox checked={customer.cp_ownership} onClick={() => toggleCustomerField(customer.id, 'cp_ownership')} />
                      </td>

                      {/* Incentive Eligibility */}
                      <td className="px-4 py-1 align-middle">
                        <ReadOnlyCheckbox checked={customer.incentive_eligibility} onClick={() => toggleCustomerField(customer.id, 'incentive_eligibility')} />
                      </td>

                      {/* Client Co-Partner */}
                      <td className="px-4 py-1 text-[13px] align-middle">
                        <button
                          onClick={() => setPartnerModal({ customerId: customer.id, currentPartner: customer.client_co_partner, type: 'client_co_partner' })}
                          className="text-text-secondary hover:text-brand-red hover:underline text-left"
                          aria-label={`Update client co-partner for ${customer.name}`}
                        >
                          {customer.client_co_partner || '--'}
                        </button>
                      </td>

                      {/* DM/PDM */}
                      <td className="px-4 py-1 align-middle">
                        <DmPdmCell dmPdm={customer.dm_pdm} customerName={customer.name} onShowAll={setDmModalData} />
                      </td>

                      {/* Industry */}
                      <td className="px-4 py-1 text-[13px] text-text-secondary align-middle">
                        {customer.industry || '--'}
                      </td>

                      {/* Referenceable */}
                      <td className="px-4 py-1 align-middle">
                        <ReadOnlyCheckbox checked={customer.referenceable} onClick={() => toggleCustomerField(customer.id, 'referenceable')} />
                      </td>
                    </tr>
                  );
                })
              )}
          </tbody>
        </table>
        <DmPdmModal data={dmModalData} onClose={() => setDmModalData(null)} />
        {partnerModal && (
          <PartnerUpdateModal
            customerId={partnerModal.customerId}
            currentPartner={partnerModal.currentPartner}
            type={partnerModal.type}
            onClose={() => setPartnerModal(null)}
            onSaved={(id, fields) => {
              useCustomerStore.getState().patchCustomer(id, fields);
            }}
          />
        )}
      </div>
  );
}
