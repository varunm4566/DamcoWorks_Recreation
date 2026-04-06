function HealthComponentCard({ label, score, weight, contributes, barColor }) {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-semibold text-black">{label}</span>
        <span className="text-[18px] font-bold text-black">{score}</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, score)}%`, backgroundColor: barColor }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] text-text-muted">
        <span>Weight: {weight}%</span>
        <span>Contributes: {contributes} Points</span>
      </div>
    </div>
  );
}

function getHealthLabel(score) {
  if (score == null) return { label: '-', color: '#595959' };
  if (score >= 85) return { label: 'Healthy', color: '#37B24D' };
  if (score >= 60) return { label: 'Caution', color: '#E58715' };
  return { label: 'At Risk', color: '#E32200' };
}

function getBarColor(score) {
  if (score >= 85) return '#37B24D';
  if (score >= 60) return '#E58715';
  return '#E32200';
}

export function OverallHealthTab({ project }) {
  const score = project.health_score != null ? parseInt(project.health_score, 10) : null;
  const { label: healthLabel, color: healthColor } = getHealthLabel(score);

  // Health component contributions (30% service quality, 25% margin, 35% payment timelines → weights vary)
  const sqScore = project.service_quality === 'Healthy' ? 100 : project.service_quality === 'At Risk' ? 30 : 50;
  const marginScore = project.margin_percent != null ? Math.min(100, Math.max(0, parseFloat(project.margin_percent))) : 0;
  const payScore = project.assessment_overdue ? 50 : 100;

  const sqWeight = 40;
  const marginWeight = 25;
  const payWeight = 35;

  return (
    <div className="space-y-5">
      {/* Score */}
      <section>
        <div className="flex items-center gap-1 text-[13px] text-text-muted mb-1">
          Overall Health score
          <span className="cursor-help text-[11px]">&#9432;</span>
        </div>
        <div className="text-[36px] font-bold leading-tight" style={{ color: healthColor }}>
          {score ?? '-'}
        </div>
        <div className="flex items-center gap-1 text-[13px] text-text-muted mt-0.5">
          {healthLabel}
          <span className="cursor-help text-[11px]">&#9432;</span>
        </div>
      </section>

      {/* Health Components */}
      <section>
        <h3 className="text-[14px] font-semibold text-black mb-3">Health Components</h3>
        <div className="grid grid-cols-3 gap-3">
          <HealthComponentCard
            label="Service Quality"
            score={sqScore}
            weight={sqWeight}
            contributes={Math.round(sqScore * sqWeight / 100)}
            barColor={getBarColor(sqScore)}
          />
          <HealthComponentCard
            label="Margin"
            score={Math.min(100, Math.round(marginScore))}
            weight={marginWeight}
            contributes={Math.round(Math.min(100, marginScore) * marginWeight / 100)}
            barColor={getBarColor(Math.min(100, marginScore))}
          />
          <HealthComponentCard
            label="Payment Timelines"
            score={payScore}
            weight={payWeight}
            contributes={Math.round(payScore * payWeight / 100)}
            barColor={getBarColor(payScore)}
          />
        </div>
      </section>

      {/* Calculation Formula */}
      <section className="border border-border rounded-lg p-4">
        <h3 className="text-[13px] font-semibold text-black mb-2">Calculation Formula</h3>
        <div className="text-[12px] text-text-secondary space-y-1">
          <div>Overall Health = Sum of (Component Score * Weight)</div>
          <div>({sqScore}*{sqWeight}%) + ({Math.min(100, Math.round(marginScore))}*{marginWeight}%) + ({payScore}*{payWeight}%)</div>
          <div className="font-semibold">= {score ?? '-'}</div>
          <div className="mt-2 text-text-muted">If final Score:</div>
          <div>≥ 85 → Healthy</div>
          <div>60 - 84 → Caution</div>
          <div>0 - 59 → At Risk</div>
        </div>
      </section>

      {/* Critical Attention Alert */}
      {project.is_critical_attention && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <svg className="w-4 h-4 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span className="text-[12px] font-medium text-brand-red">This project requires critical attention</span>
        </div>
      )}
    </div>
  );
}
