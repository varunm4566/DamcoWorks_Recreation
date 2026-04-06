import { useState, useEffect } from 'react';
import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';

const EMPTY_FORM = {
  salutation: '',
  first_name: '',
  last_name: '',
  designation: '',
  email: '',
  contact_number: '',
  relationship_type: '',
  stakeholder_role: '',
  status: 'active',
  linkedin_url: '',
  reports_to: '',
  reports_to_designation: '',
};

const RELATIONSHIP_TYPES = ['Delivery SPOC', 'Sales SPOC', 'Accounting SPOC', 'Technical SPOC', 'Executive SPOC'];
const STAKEHOLDER_ROLES  = ['Decision Maker', 'Influencer', 'Champion', 'End User', 'Gatekeeper'];
const SALUTATIONS        = ['Mr.', 'Ms.', 'Dr.', 'Mrs.', 'Prof.'];

/**
 * Manage Stakeholders modal — two-panel layout.
 * Left: current stakeholder list + search + add button.
 * Right: add/edit form.
 */
export function ManageStakeholdersModal({ customerId }) {
  const stakeholders = useCustomerDetailStore((s) => s.stakeholders);
  const selected     = useCustomerDetailStore((s) => s.selectedStakeholder);
  const close        = useCustomerDetailStore((s) => s.closeManageStakeholders);
  const selectForEdit   = useCustomerDetailStore((s) => s.selectStakeholderForEdit);
  const saveStakeholder = useCustomerDetailStore((s) => s.saveStakeholder);

  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);
  const [saving, setSaving]  = useState(false);
  const [error, setError]    = useState('');

  // When a stakeholder is selected for edit, populate form
  useEffect(() => {
    if (selected) {
      setForm({
        salutation:             selected.salutation || '',
        first_name:             selected.first_name || '',
        last_name:              selected.last_name || '',
        designation:            selected.designation || '',
        email:                  selected.email || '',
        contact_number:         selected.contact_number || '',
        relationship_type:      selected.relationship_type || '',
        stakeholder_role:       selected.stakeholder_role || '',
        status:                 selected.status || 'active',
        linkedin_url:           selected.linkedin_url || '',
        reports_to:             selected.reports_to || '',
        reports_to_designation: selected.reports_to_designation || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [selected]);

  const filtered = stakeholders.filter((s) =>
    !search || `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    if (!form.first_name.trim()) { setError('First name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      await saveStakeholder(customerId, form);
      setForm(EMPTY_FORM);
      selectForEdit(null);
    } catch (err) {
      setError(err.message || 'Failed to save stakeholder.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (s) => `${(s.first_name || '')[0] || ''}${(s.last_name || '')[0] || ''}`.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-10">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-4 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <span className="text-[15px] font-semibold text-text-primary">Manage Stakeholders</span>
          <button onClick={close} className="text-text-muted hover:text-text-primary" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body: two panels */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel */}
          <div className="w-56 border-r border-border flex flex-col flex-shrink-0">
            <div className="px-3 py-3 border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-semibold text-text-primary">
                  Current Stakeholders{' '}
                  <span className="ml-1 bg-gray-100 text-text-muted px-1.5 py-0.5 rounded text-[10px]">
                    {stakeholders.length}
                  </span>
                </span>
              </div>
              <button
                onClick={() => selectForEdit(null)}
                className="w-full py-1.5 text-[12px] border border-brand-red text-brand-red rounded hover:bg-red-50 transition-colors"
              >
                + Add Stakeholder
              </button>
            </div>

            {/* Search */}
            <div className="px-3 py-2 border-b border-border flex-shrink-0">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stakeholders…"
                className="w-full border border-border rounded px-2 py-1 text-[12px] focus:outline-none focus:border-brand-red"
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => selectForEdit(s)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selected?.id === s.id ? 'bg-red-50 border-l-2 border-l-brand-red' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0">
                    {getInitials(s)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-medium text-text-primary truncate">
                      {s.first_name} {s.last_name}
                    </div>
                    <div className="text-[10px] text-text-muted truncate">{s.designation}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right panel: form */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex-shrink-0">
              <span className="text-[13px] font-semibold text-text-primary">
                {selected ? 'Edit Stakeholder' : 'Add Stakeholder'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded px-3 py-2 text-[12px] mb-3">
                  {error}
                </div>
              )}

              {/* Image placeholder */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-[20px] font-semibold text-gray-400">
                    {form.first_name ? (form.first_name[0] || '').toUpperCase() : '?'}
                  </div>
                  <button className="absolute bottom-0 right-0 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center" aria-label="Upload photo">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Salutation */}
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">Salutation</label>
                  <select value={form.salutation} onChange={(e) => handleChange('salutation', e.target.value)}
                    className="w-full border border-border rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-red">
                    <option value="">— Select —</option>
                    {SALUTATIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">Status *</label>
                  <select value={form.status} onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full border border-border rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-red">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">First Name *</label>
                  <input type="text" value={form.first_name} onChange={(e) => handleChange('first_name', e.target.value)}
                    placeholder="First name"
                    className="w-full border border-border rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-red" />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">Last Name *</label>
                  <input type="text" value={form.last_name} onChange={(e) => handleChange('last_name', e.target.value)}
                    placeholder="Last name"
                    className="w-full border border-border rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-red" />
                </div>

                {/* Designation */}
                <div className="col-span-2">
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">Designation *</label>
                  <input type="text" value={form.designation} onChange={(e) => handleChange('designation', e.target.value)}
                    placeholder="Job title / designation"
                    className="w-full border border-border rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-red" />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@company.com"
                    className="w-full border border-border rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-red" />
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">Contact Number</label>
                  <input type="text" value={form.contact_number} onChange={(e) => handleChange('contact_number', e.target.value)}
                    placeholder="+1 234 567 890"
                    className="w-full border border-border rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-red" />
                </div>

                {/* Relationship Type */}
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">Relationship Type *</label>
                  <select value={form.relationship_type} onChange={(e) => handleChange('relationship_type', e.target.value)}
                    className="w-full border border-border rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-red">
                    <option value="">— Select —</option>
                    {RELATIONSHIP_TYPES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>

                {/* Stakeholder Role */}
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">Stakeholder Role</label>
                  <select value={form.stakeholder_role} onChange={(e) => handleChange('stakeholder_role', e.target.value)}
                    className="w-full border border-border rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-red">
                    <option value="">— Select —</option>
                    {STAKEHOLDER_ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>

                {/* LinkedIn */}
                <div className="col-span-2">
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">LinkedIn Profile</label>
                  <input type="url" value={form.linkedin_url} onChange={(e) => handleChange('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full border border-border rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-red" />
                </div>

                {/* Reports To */}
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">Reports To</label>
                  <input type="text" value={form.reports_to} onChange={(e) => handleChange('reports_to', e.target.value)}
                    placeholder="Manager name"
                    className="w-full border border-border rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-red" />
                </div>

                {/* Reports To Designation */}
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">Reporting Manager Designation</label>
                  <input type="text" value={form.reports_to_designation} onChange={(e) => handleChange('reports_to_designation', e.target.value)}
                    placeholder="Designation"
                    className="w-full border border-border rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-red" />
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border flex-shrink-0">
              <button onClick={close} className="px-4 py-1.5 text-[12px] border border-border rounded hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-1.5 text-[12px] bg-brand-red text-white rounded hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {saving ? 'Saving…' : selected ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
