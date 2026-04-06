/**
 * Format a number as abbreviated currency string
 * @param {number} value - raw numeric value
 * @param {'usd' | 'inr'} currency - currency type
 * @returns {string} formatted string like "$200.38K", "$6.68M", "INR 16.75L"
 */
export function formatCurrency(value, currency = 'usd') {
  if (value == null || isNaN(value)) return '--';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (currency === 'usd') {
    if (absValue >= 1_000_000) {
      return `${sign}$${(absValue / 1_000_000).toFixed(2)}M`;
    }
    if (absValue >= 1_000) {
      return `${sign}$${(absValue / 1_000).toFixed(2)}K`;
    }
    return `${sign}$${absValue.toFixed(2)}`;
  }

  // INR formatting: Cr (crore = 10M), L (lakh = 100K)
  if (currency === 'inr') {
    if (absValue >= 10_000_000) {
      return `${sign}INR ${(absValue / 10_000_000).toFixed(2)}Cr`;
    }
    if (absValue >= 100_000) {
      return `${sign}INR ${(absValue / 100_000).toFixed(2)}L`;
    }
    if (absValue >= 1_000) {
      return `${sign}INR ${(absValue / 1_000).toFixed(2)}K`;
    }
    return `${sign}INR ${absValue.toFixed(2)}`;
  }

  return String(value);
}
