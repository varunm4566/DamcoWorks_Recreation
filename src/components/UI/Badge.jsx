const TIER_STYLES = {
  'Red Carpet': 'bg-tier-rc-bg text-tier-rc-text',
  'Gold': 'bg-tier-gold-bg text-tier-gold-text',
  'Strategic': 'bg-tier-strat-bg text-tier-strat-text',
};

/**
 * Colored pill badge for tiers and statuses
 * @param {{ variant?: string, tier?: string, children: React.ReactNode }} props
 */
export function Badge({ variant, tier, children }) {
  // Tier badge
  if (tier && TIER_STYLES[tier]) {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] whitespace-nowrap ${TIER_STYLES[tier]}`}>
        <span>&#9733;</span>
        {children}
      </span>
    );
  }

  // Active status chip
  if (variant === 'status-active') {
    return (
      <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-[12px] bg-chip-active-bg text-black whitespace-nowrap">
        {children}
      </span>
    );
  }

  // New badge
  if (variant === 'new') {
    return (
      <span className="text-[10px] text-text-secondary block">
        {children}
      </span>
    );
  }

  // Default
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] bg-gray-100 text-text-secondary whitespace-nowrap">
      {children}
    </span>
  );
}
