import { useEffect } from 'react';
import { useFormik } from 'formik';
import { hrDecisionOptions } from '../../../data/benchData';

// ─── Decision categories ──────────────────────────────────────────────────────
// Needs: Expected Alignment Date + Project Name + Remarks (all mandatory)
const NEEDS_DATE_AND_PROJECT = [
  'Project Identified/Yet to be started',
  'Extension Expected',
  'Internal Redeployment/Additional Support',
];
// Needs: date only + Remarks
const NEEDS_DATE_ONLY = ['Long Leave/Sabbatical', 'Resigned', 'Partial Allocation', 'Project Ramp-down/Closure', 'Performance Concern & PIP', 'Bench Resource'];

function dateLabel(decision) {
  if (decision === 'Long Leave/Sabbatical') return 'Expected Return Date';
  if (decision === 'Resigned')              return 'Last Working Day';
  return 'Expected Alignment Date';
}

function remainingDays(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  const diff = Math.round((d - new Date()) / 86400000);
  return diff;
}

function TimelineBadge({ decision, timeline }) {
  if (!decision || !timeline) return null;
  const days = remainingDays(timeline);
  if (days === null) return null;

  const label = dateLabel(decision);
  const dateFormatted = new Date(timeline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const daysText = days > 0 ? `${days} days remaining` : days === 0 ? 'Today' : `${Math.abs(days)} days overdue`;
  const color = days < 0 ? '#dc2626' : days <= 7 ? '#d97706' : '#059669';

  return (
    <div style={{ padding: '8px 12px', borderRadius: 6, backgroundColor: '#f8f9fa', border: '1px solid #e5e7eb', fontSize: 12 }}>
      <span style={{ color: '#555' }}>{label}: </span>
      <span style={{ fontWeight: 600, color: '#111' }}>{dateFormatted}</span>
      <span style={{ marginLeft: 8, fontWeight: 600, color }}>{daysText}</span>
    </div>
  );
}

// ─── Field component helpers ──────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[13px] font-medium text-black">
        {label} <span style={{ color: '#e32200' }}>*</span>
      </label>
      {children}
      {error && <p style={{ fontSize: 11, color: '#e32200', marginTop: 2 }}>{error}</p>}
    </div>
  );
}

// ─── UpdateActionPlanModal ─────────────────────────────────────────────────────
export function UpdateActionPlanModal({ isOpen, onClose, row, onSave }) {
  const formik = useFormik({
    initialValues: {
      hrDecision:     '',
      remarks:        '',
      timeline:       '',
      plannedProject: '',
    },
    validate: (values) => {
      const errors = {};
      const dec = values.hrDecision;
      if (!dec) {
        errors.hrDecision = 'HR Decision is required';
      }
      if (!values.remarks?.trim()) {
        errors.remarks = 'Context / Remarks is required';
      }
      if (NEEDS_DATE_AND_PROJECT.includes(dec)) {
        if (!values.timeline) errors.timeline = 'Expected Alignment Date is required';
        if (!values.plannedProject?.trim()) errors.plannedProject = 'Project Name is required';
      }
      return errors;
    },
    onSubmit: (values) => {
      const decision = values.hrDecision;
      const needsDate = NEEDS_DATE_AND_PROJECT.includes(decision) || NEEDS_DATE_ONLY.includes(decision);
      onSave(row.id, {
        hrDecision:     values.hrDecision     || null,
        remarks:        values.remarks,
        timeline:       needsDate ? (values.timeline || null) : null,
        plannedProject: NEEDS_DATE_AND_PROJECT.includes(decision) ? (values.plannedProject || null) : null,
      });
      onClose();
    },
  });

  useEffect(() => {
    if (row) {
      formik.resetForm({
        values: {
          hrDecision:     row.hrDecision     || '',
          remarks:        row.remarks        || '',
          timeline:       row.timeline ? String(row.timeline).slice(0, 10) : '',
          plannedProject: row.plannedProject || '',
        },
      });
    }
  }, [row]);

  if (!isOpen || !row) return null;

  const decision = formik.values.hrDecision;
  const needsDateAndProject = NEEDS_DATE_AND_PROJECT.includes(decision);
  const needsDateOnly       = NEEDS_DATE_ONLY.includes(decision);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white w-full max-w-lg rounded-lg p-6 flex flex-col gap-5"
        style={{ borderRadius: 8, boxShadow: 'rgba(0,0,0,0.1) 0px 8px 10px 0px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-black">Update Action Plan</h2>
            <p className="text-[12px] mt-0.5" style={{ color: '#595959' }}>
              {row.name} — {row.empCode}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {/* HR Decision */}
          <Field label="HR Decision" error={formik.touched.hrDecision && formik.errors.hrDecision}>
            <select
              name="hrDecision"
              value={formik.values.hrDecision}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded px-3 py-2 text-[13px] bg-white cursor-pointer"
              style={{ borderColor: formik.touched.hrDecision && formik.errors.hrDecision ? '#e32200' : '#bfbfbf', borderRadius: 4 }}
            >
              <option value="">Select HR Decision</option>
              {hrDecisionOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </Field>

          {/* Conditional: Expected date */}
          {(needsDateAndProject || needsDateOnly) && (
            <Field label={dateLabel(decision)} error={formik.touched.timeline && formik.errors.timeline}>
              <input
                name="timeline"
                type="date"
                value={formik.values.timeline}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border px-3 py-2 text-[13px]"
                style={{ borderColor: formik.touched.timeline && formik.errors.timeline ? '#e32200' : '#bfbfbf', borderRadius: 4, color: '#4d5156' }}
              />
            </Field>
          )}

          {/* Conditional: Planned project name */}
          {needsDateAndProject && (
            <Field label="Project Name" error={formik.touched.plannedProject && formik.errors.plannedProject}>
              <input
                name="plannedProject"
                type="text"
                value={formik.values.plannedProject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter project name..."
                className="border px-3 py-2 text-[13px]"
                style={{ borderColor: formik.touched.plannedProject && formik.errors.plannedProject ? '#e32200' : '#bfbfbf', borderRadius: 4, color: '#4d5156' }}
              />
            </Field>
          )}

          {/* Context / Remarks */}
          <Field label="Context / Remarks" error={formik.touched.remarks && formik.errors.remarks}>
            <textarea
              name="remarks"
              value={formik.values.remarks}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={3}
              placeholder="Add context or remarks..."
              className="border px-3 py-2 text-[13px] resize-none"
              style={{ borderColor: formik.touched.remarks && formik.errors.remarks ? '#e32200' : '#bfbfbf', borderRadius: 8, color: '#4d5156' }}
            />
          </Field>

          {/* Timeline badge — computed remaining days */}
          <TimelineBadge decision={formik.values.hrDecision} timeline={formik.values.timeline} />

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-[13px] bg-white border rounded"
              style={{ borderColor: '#dee2e6', color: '#000000', borderRadius: 4 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-[13px] text-white rounded"
              style={{ backgroundColor: '#e32200', borderRadius: 4 }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
