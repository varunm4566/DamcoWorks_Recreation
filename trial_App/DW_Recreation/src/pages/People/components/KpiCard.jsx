import { DonutChart } from './DonutChart';

// Generic KPI card. Accepts a `type` prop to switch rendering strategy:
// 'donut'        — donut chart + segment legend
// 'availability' — availability numbers grid

export function KpiCard({ title, data, type = 'donut' }) {
  return (
    <div className="bg-white rounded border border-[#dee2e6] p-4 min-w-[260px] flex-shrink-0 select-none">
      <div className="flex items-center gap-1 mb-3">
        <span className="text-[12px] font-semibold text-gray-700">{title}</span>
        <button aria-label="Info" className="text-gray-400 hover:text-gray-600">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
        </button>
      </div>

      {type === 'donut' && <DonutKpiBody data={data} />}
      {type === 'availability' && <AvailabilityKpiBody data={data} />}
    </div>
  );
}

function DonutKpiBody({ data }) {
  const { percentage, segments } = data;
  return (
    <div className="flex items-center gap-4">
      <DonutChart
        segments={segments}
        size={80}
        strokeWidth={14}
        label={`${percentage}%`}
      />
      <div className="flex flex-col gap-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5 text-[11px] text-gray-600">
            <span
              className="inline-block w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="font-medium">{seg.label}:</span>
            <span>{seg.value}%</span>
            {seg.count != null && <span className="text-gray-400">({seg.count})</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function AvailabilityKpiBody({ data }) {
  const { totalAvailable, totalPercent, fullyAvailable, partiallyAvailable } = data;
  return (
    <div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-[28px] font-bold text-gray-800 leading-none">{totalAvailable}</span>
        <span className="text-[11px] text-gray-500">({totalPercent}%) available now</span>
      </div>

      <div className="mb-1">
        <div className="flex items-center gap-1 text-[11px] font-medium text-gray-600 mb-1">
          <span>Fully Available</span>
          <button aria-label="Info" className="text-gray-400">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <AvailBadge label="Now" count={fullyAvailable.now} highlight />
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">In 7 days: <strong>{fullyAvailable.in7Days}</strong></span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">In 30 days: <strong>{fullyAvailable.in30Days}</strong></span>
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-center gap-1 text-[11px] font-medium text-gray-600 mb-1">
          <span>Partially Available</span>
          <button aria-label="Info" className="text-gray-400">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-[#e89800] font-semibold">Now: {partiallyAvailable.now}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">In 7 days: <strong>{partiallyAvailable.in7Days}</strong></span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">In 30 days: <strong>{partiallyAvailable.in30Days}</strong></span>
        </div>
      </div>
    </div>
  );
}

function AvailBadge({ label, count, highlight }) {
  return (
    <span
      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold"
      style={{
        backgroundColor: highlight ? '#fee2e2' : 'transparent',
        color: highlight ? '#e32200' : '#374151',
        border: highlight ? '1px solid #fca5a5' : 'none',
      }}
    >
      {highlight && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )}
      {label}: {count}
    </span>
  );
}
