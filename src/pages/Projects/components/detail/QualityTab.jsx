function SeverityCard({ label, count, color, bg }) {
  return (
    <div className="border border-border rounded-lg p-4 text-center">
      <div className="text-[28px] font-bold" style={{ color }}>{count ?? '-'}</div>
      <div
        className="inline-block rounded-full px-2.5 py-[2px] text-[11px] font-medium mt-1"
        style={{ backgroundColor: bg, color }}
      >
        {label}
      </div>
    </div>
  );
}

function IntegrationSourceBadge({ source }) {
  if (!source || source === 'Not Integrated') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium bg-gray-100 text-gray-500">
        <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
        Not Integrated
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium bg-[#EEF2FF] text-indigo-700">
      <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
      {source}
    </span>
  );
}

export function QualityTab({ project }) {
  const source = project.quality_integration_source || 'Not Integrated';
  const isIntegrated = source !== 'Not Integrated';

  return (
    <div className="space-y-5">

      {/* Integration source */}
      <section className="border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] font-semibold text-black mb-1">Quality Integration Source</div>
            <div className="text-[12px] text-text-muted">Bug tracking and quality metrics via</div>
          </div>
          <IntegrationSourceBadge source={source} />
        </div>
      </section>

      {isIntegrated ? (
        <>
          {/* Bug severity cards */}
          <section>
            <h3 className="text-[14px] font-semibold text-black mb-3">Open Bugs by Severity</h3>
            <div className="grid grid-cols-4 gap-3">
              <SeverityCard
                label="Critical"
                count={project.bugs_critical}
                color="#C0392B"
                bg="#FFE0DD"
              />
              <SeverityCard
                label="High"
                count={project.bugs_high}
                color="#9A5800"
                bg="#FFF6EA"
              />
              <SeverityCard
                label="Medium"
                count={project.bugs_medium}
                color="#3730A3"
                bg="#EEF2FF"
              />
              <SeverityCard
                label="Low"
                count={project.bugs_low}
                color="#1D6A36"
                bg="#DCFFE3"
              />
            </div>
          </section>

          {/* Cycle performance */}
          <section className="border border-border rounded-lg p-4">
            <h3 className="text-[13px] font-semibold text-black mb-3">Cycle Performance</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-[22px] font-bold text-black">
                  {project.avg_cycle_time != null ? `${project.avg_cycle_time}d` : '-'}
                </div>
                <div className="text-[11px] text-text-muted mt-0.5">Avg Cycle Time</div>
              </div>
              <div>
                <div className="text-[22px] font-bold text-black">
                  {project.defect_density != null ? project.defect_density : '-'}
                </div>
                <div className="text-[11px] text-text-muted mt-0.5">Defect Density</div>
              </div>
              <div>
                <div className="text-[22px] font-bold text-black">
                  {project.test_coverage != null ? `${project.test_coverage}%` : '-'}
                </div>
                <div className="text-[11px] text-text-muted mt-0.5">Test Coverage</div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <p className="text-[14px] font-medium text-text-muted">No quality tool integrated</p>
          <p className="text-[12px] text-text-muted mt-1">
            Integrate with Jira, Azure DevOps, or another bug tracker to see quality metrics here.
          </p>
        </div>
      )}

    </div>
  );
}
