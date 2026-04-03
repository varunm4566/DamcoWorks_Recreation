import { useCustomerStore } from '../../../stores/customerStore.js';
import { Modal } from '../../../components/UI/Modal.jsx';

/**
 * Format date as "09 Jun 2025"
 */
function formatDate(dateStr) {
  if (!dateStr) return '--';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * CSAT Survey modal showing survey responses table
 */
export function CsatModal() {
  const isOpen = useCustomerStore((s) => s.isCsatModalOpen);
  const onClose = useCustomerStore((s) => s.closeCsatModal);
  const surveys = useCustomerStore((s) => s.csatSurveys);
  const customerName = useCustomerStore((s) => s.csatCustomerName);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="CSAT Survey">
      <p className="text-sm text-gray-500 mb-4">{customerName}</p>

      {surveys.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No CSAT survey responses found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 font-semibold text-gray-600">Score</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-600">POC</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-600">Response Date</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-600">Testimonials</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey) => (
              <tr key={survey.id} className="border-b border-gray-100">
                <td className="py-2 px-3 font-medium">{parseFloat(survey.score).toFixed(2)}</td>
                <td className="py-2 px-3">{survey.poc}</td>
                <td className="py-2 px-3 whitespace-nowrap">{formatDate(survey.response_date)}</td>
                <td className="py-2 px-3 text-gray-600">{survey.testimonial || '--'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Modal>
  );
}
