import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Generic modal shell
export function Modal({ title, isOpen, onClose, children }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-[14px] font-semibold text-gray-800">{title}</h2>
          <button
            aria-label="Close modal"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

// ── PIP Modal ───────────────────────────────────────────────────
const pipSchema = Yup.object({
  reason: Yup.string().required('Reason is required'),
  targetDate: Yup.string().required('Target date is required'),
  notes: Yup.string(),
});

export function PIPModal({ isOpen, onClose, person, onSubmit }) {
  const formik = useFormik({
    initialValues: { reason: '', targetDate: '', notes: '' },
    validationSchema: pipSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await onSubmit(person.id, values);
      resetForm();
      onClose();
      setSubmitting(false);
    },
  });

  return (
    <Modal title={`PIP — ${person?.name ?? ''}`} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
        <FormField label="Reason *" error={formik.touched.reason && formik.errors.reason}>
          <textarea
            {...formik.getFieldProps('reason')}
            rows={3}
            aria-label="PIP reason"
            className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-[#e32200] resize-none"
            placeholder="Describe the performance issue…"
          />
        </FormField>

        <FormField label="Target Date *" error={formik.touched.targetDate && formik.errors.targetDate}>
          <input
            type="date"
            {...formik.getFieldProps('targetDate')}
            aria-label="PIP target date"
            className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-[#e32200]"
          />
        </FormField>

        <FormField label="Additional Notes">
          <textarea
            {...formik.getFieldProps('notes')}
            rows={2}
            aria-label="Additional notes"
            className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-[#e32200] resize-none"
            placeholder="Any supporting details…"
          />
        </FormField>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="flex-1 py-1.5 rounded text-[12px] font-semibold text-white transition-opacity"
            style={{ backgroundColor: '#e32200', opacity: formik.isSubmitting ? 0.6 : 1 }}
          >
            {formik.isSubmitting ? 'Saving…' : 'Confirm PIP'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-1.5 rounded text-[12px] border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Escalate Modal ──────────────────────────────────────────────
const escalateSchema = Yup.object({
  reason: Yup.string().required('Reason is required'),
  escalateTo: Yup.string().required('Escalate-to is required'),
  notes: Yup.string(),
});

export function EscalateModal({ isOpen, onClose, person, onSubmit }) {
  const formik = useFormik({
    initialValues: { reason: '', escalateTo: '', notes: '' },
    validationSchema: escalateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await onSubmit(person.id, values);
      resetForm();
      onClose();
      setSubmitting(false);
    },
  });

  return (
    <Modal title={`Escalate — ${person?.name ?? ''}`} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
        <FormField label="Escalate To *" error={formik.touched.escalateTo && formik.errors.escalateTo}>
          <select
            {...formik.getFieldProps('escalateTo')}
            aria-label="Escalate to"
            className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-[#e32200]"
          >
            <option value="">Select recipient</option>
            <option value="COE Manager">COE Manager</option>
            <option value="HR">HR</option>
            <option value="Delivery Head">Delivery Head</option>
            <option value="PMO">PMO</option>
          </select>
        </FormField>

        <FormField label="Reason *" error={formik.touched.reason && formik.errors.reason}>
          <textarea
            {...formik.getFieldProps('reason')}
            rows={3}
            aria-label="Escalation reason"
            className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-[#e32200] resize-none"
            placeholder="Describe the escalation reason…"
          />
        </FormField>

        <FormField label="Additional Notes">
          <textarea
            {...formik.getFieldProps('notes')}
            rows={2}
            aria-label="Additional notes"
            className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-[#e32200] resize-none"
          />
        </FormField>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="flex-1 py-1.5 rounded text-[12px] font-semibold text-white transition-opacity"
            style={{ backgroundColor: '#e32200', opacity: formik.isSubmitting ? 0.6 : 1 }}
          >
            {formik.isSubmitting ? 'Submitting…' : 'Escalate'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-1.5 rounded text-[12px] border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Shared form-field wrapper
function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-600 mb-1">{label}</label>
      {children}
      {error && <p className="text-[10px] text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
