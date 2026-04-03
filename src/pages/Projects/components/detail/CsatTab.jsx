import { useState, useEffect } from 'react';
import { fetchProjectCsatSurveys } from '../../../../api/projects.js';
import { DetailPagination } from './shared/DetailPagination.jsx';

function fmtDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function ScoreStar({ score, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          className="w-4 h-4"
          fill={i < Math.round(score) ? '#F59E0B' : '#E5E7EB'}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function getCsatColor(score) {
  if (score == null) return '#595959';
  if (score >= 4) return '#37B24D';
  if (score >= 3.5) return '#E58715';
  return '#E32200';
}

function getCsatLabel(score) {
  if (score == null) return '';
  if (score >= 4.5) return 'Excellent';
  if (score >= 4) return 'Good';
  if (score >= 3.5) return 'Satisfactory';
  if (score >= 3) return 'Below Average';
  return 'Poor';
}

export function CsatTab({ project }) {
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchProjectCsatSurveys(project.id, { page, pageSize })
      .then((data) => { if (!cancelled) { setRows(data.rows); setTotalCount(data.totalCount); } })
      .catch(console.error)
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [project.id, page]);

  const csat = project.customer_confidence != null ? parseFloat(project.customer_confidence) : null;
  const csatColor = getCsatColor(csat);

  return (
    <div className="space-y-5">

      {/* Current CSAT score */}
      <section className="border border-border rounded-lg p-5">
        <div className="text-[12px] text-text-muted mb-1">Current CSAT Score</div>
        <div className="flex items-end gap-3">
          <div className="text-[40px] font-bold leading-tight" style={{ color: csatColor }}>
            {csat !== null ? csat.toFixed(1) : '-'}
          </div>
          <div className="mb-2">
            <div className="text-[16px] font-semibold text-text-secondary">/5</div>
          </div>
          {csat !== null && (
            <div className="mb-2 flex flex-col gap-0.5">
              <ScoreStar score={csat} />
              <span className="text-[12px] font-medium" style={{ color: csatColor }}>{getCsatLabel(csat)}</span>
            </div>
          )}
        </div>

        {csat !== null && (
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-text-muted mb-1">
              <span>0</span>
              <span className="text-[#E32200]">3.5 threshold</span>
              <span>5</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden relative">
              {/* Threshold marker */}
              <div className="absolute top-0 bottom-0 w-px bg-[#E32200] opacity-50" style={{ left: '70%' }} />
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (csat / 5) * 100)}%`,
                  backgroundColor: csatColor,
                }}
              />
            </div>
            <div className="text-[11px] mt-1" style={{ color: csatColor }}>
              {csat >= 3.5 ? 'Above threshold (3.5)' : 'Below threshold (3.5)'}
            </div>
          </div>
        )}

        {project.last_csat_date && (
          <div className="mt-2 text-[11px] text-text-muted">
            Last survey: {fmtDate(project.last_csat_date)}
          </div>
        )}
      </section>

      {/* Survey History */}
      <section>
        <h3 className="text-[14px] font-semibold text-black mb-3">Survey History</h3>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded border border-border">
              <table className="w-full text-[12px]">
                <thead className="bg-table-header">
                  <tr>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Triggered On</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Triggered By</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Client POC</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Response Received</th>
                    <th className="text-center px-3 py-2.5 text-[12px] font-semibold text-text-muted">Score</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Testimonial</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-[12px] text-text-muted">No survey records found.</td>
                    </tr>
                  ) : (
                    rows.map((survey, idx) => (
                      <tr key={survey.id} className={idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}>
                        <td className="px-3 py-2.5 text-text-secondary whitespace-nowrap">{fmtDate(survey.triggered_on)}</td>
                        <td className="px-3 py-2.5 text-text-secondary">{survey.triggered_by || '-'}</td>
                        <td className="px-3 py-2.5 text-text-secondary">{survey.client_poc || '-'}</td>
                        <td className="px-3 py-2.5 text-text-secondary whitespace-nowrap">{fmtDate(survey.response_received)}</td>
                        <td className="px-3 py-2.5 text-center">
                          {survey.score != null ? (
                            <span
                              className="inline-block font-bold text-[13px]"
                              style={{ color: getCsatColor(survey.score) }}
                            >
                              {survey.score}/5
                            </span>
                          ) : '-'}
                        </td>
                        <td className="px-3 py-2.5 text-text-secondary max-w-[200px] truncate" title={survey.testimonial || ''}>
                          {survey.testimonial || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalCount > 0 && (
              <DetailPagination page={page} pageSize={pageSize} totalCount={totalCount} onPageChange={setPage} />
            )}
          </>
        )}
      </section>

    </div>
  );
}
