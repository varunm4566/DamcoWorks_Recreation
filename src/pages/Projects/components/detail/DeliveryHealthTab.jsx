function fmtDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function getSpiLabel(spi) {
  if (spi == null) return '';
  if (spi >= 1) return 'On Schedule';
  if (spi >= 0.9) return 'Slightly Behind';
  return 'Behind schedule';
}

function getCpiLabel(cpi) {
  if (cpi == null) return '';
  if (cpi >= 1) return 'Cost Efficient';
  if (cpi >= 0) return 'Over Budget';
  return 'Cost Efficient';
}

function getBurntLabel(ratio) {
  if (ratio == null) return '';
  if (ratio < 1.2) return 'Efficient';
  if (ratio < 1.5) return 'Concerning';
  return 'Critical';
}

function getBurntColor(ratio) {
  if (ratio == null) return '#595959';
  if (ratio < 1.2) return '#37B24D';
  if (ratio < 1.5) return '#E58715';
  return '#E32200';
}

export function DeliveryHealthTab({ project }) {
  const spi = project.spi != null ? parseFloat(project.spi) : null;
  const cpi = project.cpi != null ? parseFloat(project.cpi) : null;
  const variance = project.variance_percent != null ? parseFloat(project.variance_percent) : null;
  const burntRatio = project.burnt_hours_ratio != null ? parseFloat(project.burnt_hours_ratio) : null;

  return (
    <div className="space-y-4">

      {/* Top 3 metric cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* SPI */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-1 text-[12px] text-text-muted mb-2">
            SPI (Schedule Performance Index)
            <span className="cursor-help">&#9432;</span>
          </div>
          <div className={`text-[24px] font-bold ${spi !== null && spi < 1 ? 'text-brand-red' : 'text-[#37B24D]'}`}>
            {spi !== null ? spi.toFixed(2) : '-'}
          </div>
          {spi !== null && (
            <div className="text-[11px] text-text-muted mt-0.5">({getSpiLabel(spi)})</div>
          )}
          <div className="text-[10px] text-text-muted mt-2 italic">Formula: SPI = Earned Value/Planned Value</div>
        </div>

        {/* CPI */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-1 text-[12px] text-text-muted mb-2">
            CPI (Cost Performance Index)
            <span className="cursor-help">&#9432;</span>
          </div>
          <div className={`text-[24px] font-bold ${cpi !== null && cpi < 0 ? 'text-brand-red' : 'text-[#37B24D]'}`}>
            {cpi !== null ? cpi.toFixed(2) : '-'}
          </div>
          {cpi !== null && (
            <div className="text-[11px] text-text-muted mt-0.5">({getCpiLabel(cpi)})</div>
          )}
          <div className="text-[10px] text-text-muted mt-2 italic">Formula: CPI = Earned Value/Actual Cost</div>
        </div>

        {/* Effort Variance */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-1 text-[12px] text-text-muted mb-2">
            Effort Variance (for FP only)
            <span className="cursor-help">&#9432;</span>
          </div>
          <div className={`text-[24px] font-bold ${variance !== null && Math.abs(variance) > 10 ? 'text-[#E58715]' : 'text-[#37B24D]'}`}>
            {variance !== null ? `${variance.toFixed(0)}%` : '-'}
          </div>
          {variance !== null && (
            <div className="text-[11px] text-text-muted mt-0.5">({Math.abs(variance) > 10 ? 'Over Budget' : 'On Budget'})</div>
          )}
          <div className="text-[10px] text-text-muted mt-2 italic">Variance from planned effort</div>
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-4 gap-3">
        <div className="border border-border rounded-lg p-3">
          <div className="flex items-center gap-1 text-[11px] text-text-muted">Budgeted Hours <span className="cursor-help">&#9432;</span></div>
          <div className="text-[18px] font-bold text-black mt-1">{project.budgeted_hours ?? '-'}</div>
        </div>
        <div className="border border-border rounded-lg p-3">
          <div className="flex items-center gap-1 text-[11px] text-text-muted">Logged Hours <span className="cursor-help">&#9432;</span></div>
          <div className="text-[18px] font-bold text-black mt-1">{project.logged_hours ?? '-'}</div>
        </div>
        <div className="border border-border rounded-lg p-3">
          <div className="text-[11px] text-text-muted">Planned End Date</div>
          <div className="text-[14px] font-bold text-black mt-1">{fmtDate(project.planned_end_date || project.contract_end_date)}</div>
        </div>
        <div className="border border-border rounded-lg p-3">
          <div className="text-[11px] text-text-muted">% Complete</div>
          <div className="text-[18px] font-bold text-black mt-1">{project.completion_percent != null ? `${project.completion_percent}%` : '-'}</div>
        </div>
      </div>

      {/* Burnt Hours Ratio */}
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[13px] font-semibold text-black">
            Burnt Hours Ratio
            <span className="cursor-help text-text-muted">&#9432;</span>
          </div>
          <div className="flex items-center gap-4 text-[12px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#37B24D' }} />
              Less than 1.2: Efficient
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#E58715' }} />
              1.2-1.5: Concerning
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#E32200' }} />
              Greater than 1.5: Critical
            </span>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-[24px] font-bold" style={{ color: getBurntColor(burntRatio) }}>
            {burntRatio !== null ? burntRatio.toFixed(1) : '0'}
          </span>
          {burntRatio !== null && (
            <span className="text-[13px] text-text-muted ml-2">({getBurntLabel(burntRatio)})</span>
          )}
        </div>
      </div>

    </div>
  );
}
