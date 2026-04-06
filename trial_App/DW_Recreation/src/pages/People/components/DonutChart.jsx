// SVG donut chart — renders colored arc segments from a segments array.
// Each segment: { value (0-100), color }

export function DonutChart({ segments = [], size = 80, strokeWidth = 14, label }) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  // Filter out zero-value segments and the "empty" colour
  const active = segments.filter(s => s.value > 0 && s.color !== '#e5e7eb');
  const totalActive = active.reduce((sum, s) => sum + s.value, 0);
  const emptyValue = Math.max(0, 100 - totalActive);

  const all = [
    ...active,
    ...(emptyValue > 0 ? [{ value: emptyValue, color: '#e5e7eb' }] : []),
  ];

  let offset = 0;
  const arcs = all.map((seg) => {
    const dash = (seg.value / 100) * circumference;
    const gap = circumference - dash;
    const rotation = (offset / 100) * 360 - 90;
    offset += seg.value;
    return { ...seg, dash, gap, rotation };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={arc.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arc.dash} ${arc.gap}`}
          strokeDashoffset={0}
          transform={`rotate(${arc.rotation} ${cx} ${cy})`}
        />
      ))}
      {label && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.16}
          fontWeight="700"
          fill="#1a1a2e"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
