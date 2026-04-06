import { useState, useEffect } from 'react';
import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';

/**
 * Client Partner selection modal.
 * Searchable list of eligible people with checkbox selection.
 * Saves the selection and creates an audit log entry.
 */
export function ClientPartnerModal({ customerId }) {
  const eligiblePartners   = useCustomerDetailStore((s) => s.eligiblePartners);
  const customer           = useCustomerDetailStore((s) => s.customer);
  const close              = useCustomerDetailStore((s) => s.closeClientPartnerModal);
  const saveClientPartner  = useCustomerDetailStore((s) => s.saveClientPartner);

  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState(customer?.client_partner || '');
  const [saving, setSaving]       = useState(false);

  const filtered = eligiblePartners.filter((name) =>
    !search || name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await saveClientPartner(customerId, selected, customer?.sales_owner || 'System');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={close}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-[14px] font-semibold text-text-primary">Client Partner</span>
          <button onClick={close} className="text-text-muted hover:text-text-primary" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2.5 border-b border-border">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="w-full border border-border rounded px-3 py-1.5 text-[12px] focus:outline-none focus:border-brand-red"
            autoFocus
          />
        </div>

        {/* List */}
        <div className="max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-4 text-center text-text-muted text-[12px]">No results.</p>
          ) : filtered.map((name) => (
            <label
              key={name}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selected === name ? 'bg-red-50' : ''
              }`}
            >
              <input
                type="radio"
                name="client_partner"
                value={name}
                checked={selected === name}
                onChange={() => setSelected(name)}
                className="accent-brand-red"
              />
              <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0">
                {getInitials(name)}
              </div>
              <span className="text-[12px] text-text-primary">{name}</span>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border">
          <button onClick={close} className="px-4 py-1.5 text-[12px] border border-border rounded hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !selected}
            className="px-4 py-1.5 text-[12px] bg-brand-red text-white rounded hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
