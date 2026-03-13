/**
 * Format a number as Indian Rupees (INR) currency.
 */
export function formatCurrency(
  amount: number,
  options?: {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
): string {
  const {
    locale = 'en-IN',
    currency = 'INR',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options || {};

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

/**
 * Parse a currency string back to a number.
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Format a number with comma separators (Indian numbering).
 */
export function formatNumber(value: number, locale: string = 'en-IN'): string {
  return new Intl.NumberFormat(locale).format(value);
}
