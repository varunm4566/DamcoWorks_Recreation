/**
 * Project health dot indicators - specific colors from spec
 * Green #0C8B14, Orange #E58715, Red #FA0000, dots ~12px
 * @param {{ green: number, orange: number, red: number }} props
 */
export function HealthDots({ green = 0, orange = 0, red = 0 }) {
  if (green === 0 && orange === 0 && red === 0) {
    return <span className="text-text-muted text-[13px]">--</span>;
  }

  return (
    <div className="flex items-center gap-1.5 text-[13px] text-text-secondary">
      {green > 0 && (
        <span className="flex items-center gap-0.5">
          {green}
          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#0C8B14' }} />
        </span>
      )}
      {orange > 0 && (
        <span className="flex items-center gap-0.5">
          {orange}
          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#E58715' }} />
        </span>
      )}
      {red > 0 && (
        <span className="flex items-center gap-0.5">
          {red}
          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#FA0000' }} />
        </span>
      )}
    </div>
  );
}
