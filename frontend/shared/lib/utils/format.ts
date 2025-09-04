export const formatPrice = (kopiykas: number, currency: 'UAH' | 'USD' = 'UAH'): string => {
  const amount = kopiykas / 100;
  const locale = currency === 'USD' ? 'en-US' : 'uk-UA';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPriceUAH = (kopiykas: number): string => {
  return formatPrice(kopiykas, 'UAH');
};

export const formatPriceUSD = (kopiykas: number): string => {
  return formatPrice(kopiykas, 'USD');
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('uk-UA').format(value);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Additional pricing utilities
 */
export const formatPriceRange = (min: number, max: number): string => {
  if (min === max) return formatPrice(min);
  return `${formatPrice(min)} - ${formatPrice(max)}`;
};

export const formatPercentage = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value}%`;
};

export const formatModifierValue = (value: string): string => {
  if (value.includes('%')) return value;
  if (value === 'фікс.' || value === 'fixed') return 'фікс.';
  return value;
};
