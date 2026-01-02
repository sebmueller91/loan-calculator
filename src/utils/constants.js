// Global configuration constants

/**
 * Default currency symbol
 */
export const DEFAULT_CURRENCY = '€';

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency symbol (default: €)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = DEFAULT_CURRENCY) {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  return `${currency}${formatted}`;
}
