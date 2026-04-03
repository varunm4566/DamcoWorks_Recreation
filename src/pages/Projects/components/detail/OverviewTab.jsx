import { HealthBadge } from '../HealthBadge.jsx';
import { TagPill } from '../TagPill.jsx';

function fmt(v) {
  if (v === null || v === undefined) return '-';
  const n = parseFloat(v);
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function MiniCard({ label, children }) {
  return (
    <div className="border border-border rounded-lg p-3 bg-white">
      <div className="flex items-center gap-1 text-[12px] text-text-muted mb-1">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function OverviewTab({ project, tags }) {
  const spi = project.spi != null ? parseFloat(project.spi) : null;
  const cpi = project.cpi != null ? parseFloat(project.cpi) : null;
  const margin = project.margin_percent != null ? parseFloat(project.margin_percent) : null;
  const csat = project.customer_confidence != null ? parseFloat(project.customer_confidence) : null;

  const timelineStr = (project.contract_start_date && project.contract_end_date)
    ? `${fmtDate(project.contract_start_date)} - ${fmtDate(project.contract_end_date)}`
    : (project.contract_start_date ? fmtDate(project.contract_start_date) : '-');

  const hasAi = project.ai_summary || project.ai_highlights || project.ai_concerns || project.ai_next_steps;

  return (
    <div className="space-y-5">

      {/* AI Delivery Thoughts & Insights */}
      {hasAi && (
        <section className="border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
            <div className="flex items-center gap-2">
              <span className="text-brand-red">✦</span>
              <h3 className="text-[14px] font-semibold text-black">Delivery Thoughts &amp; Insights</h3>
            </div>
            <button className="text-[12px] border border-[#EB332D] text-[#EB332D] rounded px-3 py-1 hover:bg-red-50">
              Re-evaluate
            </button>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border">
            {project.ai_highlights && (
              <div className="p-4">
                <div className="text-[12px] font-semibold text-[#37B24D] mb-2">Highlights</div>
                <p className="text-[12px] text-text-secondary leading-relaxed">{project.ai_highlights}</p>
              </div>
            )}
            {project.ai_concerns && (
              <div className="p-4">
                <div className="text-[12px] font-semibold text-brand-red mb-2">Concerns</div>
                <ul className="space-y-1">
                  {project.ai_concerns.split('\n').filter(Boolean).map((line, i) => (
                    <li key={i} className="text-[12px] text-text-secondary">• {line.replace(/^•\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.ai_next_steps && (
              <div className="p-4">
                <div className="text-[12px] font-semibold text-[#1971C2] mb-2">Next Steps</div>
                <ul className="space-y-1">
                  {project.ai_next_steps.split('\n').filter(Boolean).map((line, i) => (
                    <li key={i} className="text-[12px] text-text-secondary">• {line.replace(/^•\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Project metadata grid */}
      <section className="grid grid-cols-3 gap-x-8 gap-y-4">
        <div>
          <div className="text-[11px] text-text-muted">Project Type</div>
          <div className="text-[13px] font-semibold text-black mt-0.5">{project.project_type || '-'}</div>
        </div>
        <div>
          <div className="text-[11px] text-text-muted">Engagement Model</div>
          <div className="text-[13px] font-semibold text-black mt-0.5">{project.engagement_model || '-'}</div>
        </div>
        <div>
          <div className="text-[11px] text-text-muted">Timeline</div>
          <div className="text-[13px] font-semibold text-black mt-0.5">{timelineStr}</div>
        </div>
        <div>
          <div className="text-[11px] text-text-muted">Client Partner</div>
          <div className="text-[13px] font-semibold text-black mt-0.5">{project.client_partner || '-'}</div>
        </div>
        <div>
          <div className="text-[11px] text-text-muted">Sales Manager</div>
          <div className="text-[13px] font-semibold text-black mt-0.5">{project.sm_name || '-'}</div>
        </div>
        <div>
          <div className="text-[11px] text-text-muted">Delivery Manager</div>
          <div className="text-[13px] font-semibold text-black mt-0.5">{project.dm_name || project.pdm_name || '-'}</div>
        </div>
      </section>

      {/* Project Overview */}
      {project.project_overview && (
        <section>
          <div className="text-[11px] text-text-muted mb-1">Project Overview</div>
          <p className="text-[13px] text-text-secondary leading-relaxed">{project.project_overview}</p>
        </section>
      )}

      {/* KPI mini-cards row 1 */}
      <section className="grid grid-cols-4 gap-3">
        <MiniCard label="Overall Health">
          <HealthBadge score={project.health_score} />
        </MiniCard>
        <MiniCard label="Margin">
          <span className={`text-[18px] font-bold ${margin !== null && margin < 0 ? 'text-brand-red' : 'text-[#37B24D]'}`}>
            {margin !== null ? `${margin.toFixed(0)}%` : '-'}
          </span>
        </MiniCard>
        <MiniCard label="Milestone Health">
          <span className={`text-[18px] font-bold ${project.milestone_health_percent != null && parseFloat(project.milestone_health_percent) < 50 ? 'text-brand-red' : 'text-[#37B24D]'}`}>
            {project.milestone_health_percent != null ? `${parseFloat(project.milestone_health_percent).toFixed(0)}%` : '-'}
          </span>
        </MiniCard>
        <MiniCard label="CSAT">
          <span className={`text-[18px] font-bold ${csat !== null && csat < 3.5 ? 'text-brand-red' : 'text-[#37B24D]'}`}>
            {csat !== null ? `${csat.toFixed(1)}/5` : '-'}
          </span>
        </MiniCard>
      </section>

      {/* KPI mini-cards row 2 */}
      <section className="grid grid-cols-3 gap-3">
        <MiniCard label="Total Outstanding">
          <span className={`text-[18px] font-bold ${parseFloat(project.amount_outstanding) > 0 ? 'text-[#E58715]' : 'text-black'}`}>
            {fmt(project.amount_outstanding)}
          </span>
        </MiniCard>
        <MiniCard label="Schedule Performance Index">
          <span className={`text-[18px] font-bold ${spi !== null && spi < 1 ? 'text-brand-red' : 'text-[#37B24D]'}`}>
            {spi !== null ? spi.toFixed(2) : '-'}
          </span>
        </MiniCard>
        <MiniCard label="Cost Performance Index">
          <span className={`text-[18px] font-bold ${cpi !== null && cpi < 0 ? 'text-brand-red' : 'text-[#37B24D]'}`}>
            {cpi !== null ? cpi.toFixed(2) : '-'}
          </span>
        </MiniCard>
      </section>

      {/* Tags */}
      {tags.length > 0 && (
        <section>
          <div className="text-[11px] text-text-muted mb-2">Tags</div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, idx) => <TagPill key={idx} category={tag.category} value={tag.value} />)}
          </div>
        </section>
      )}

    </div>
  );
}
