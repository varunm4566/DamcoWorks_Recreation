/**
 * Health score badge with color coding
 * 75-100: green, 50-74: amber, 0-49: red, null: gray
 */
export function HealthBadge({ score }) {
  if (score === null || score === undefined) {
    return <span className="text-[12px] text-text-muted">N/A</span>;
  }

  let color;
  if (score >= 75) color = 'rgb(55,178,77)';
  else if (score >= 50) color = 'rgb(247,103,7)';
  else color = '#E32200';

  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[12px] font-semibold" style={{ color }}>{score}</span>
    </span>
  );
}
