
/**
 * Format a number as INR currency
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatINR = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Format a number as a specific currency
 * @param amount - The amount to format
 * @param currencyCode - The currency code (INR, USD, etc.)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode: string = 'INR'): string => {
  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const symbol = symbols[currencyCode] || currencyCode;
  const formatted = currencyCode === 'INR' 
    ? amount.toLocaleString('en-IN')
    : amount.toLocaleString('en-US');

  return `${symbol}${formatted}`;
};
