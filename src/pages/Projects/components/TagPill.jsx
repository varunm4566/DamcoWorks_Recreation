const TAG_COLORS = {
  Offering: { bg: '#DEF9FF', text: '#0A0D12' },
  Domain: { bg: '#F6DAFF', text: '#0A0D12' },
  Geography: { bg: '#E5EBFE', text: '#0A0D12' },
  Currency: { bg: '#FFF6EA', text: '#0A0D12' },
  Status: { bg: '#DCFFE3', text: '#0A0D12' },
  Custom: { bg: '#FFE0DD', text: '#0A0D12' },
};

/**
 * Color-coded tag pill for project tags
 * @param {{ category: string, value: string }} props
 */
export function TagPill({ category, value }) {
  const colors = TAG_COLORS[category] || TAG_COLORS.Custom;
  return (
    <span
      className="inline-block rounded-full px-2 py-[2px] text-[12px] whitespace-nowrap"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {value}
    </span>
  );
}
