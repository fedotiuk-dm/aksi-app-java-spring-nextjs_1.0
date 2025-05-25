/**
 * Утиліти форматування даних - відповідальність за представлення даних у зручному форматі
 */

/**
 * Форматує дату для відображення у українському форматі
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Форматує дату та час для відображення у українському форматі
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Форматує ціну у форматі української гривні
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Форматує номер телефону у українському форматі
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('38')) {
    const national = cleaned.slice(2);
    return `+38 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6, 8)}-${national.slice(8, 10)}`;
  }
  return phone;
};

/**
 * Форматує процентне значення
 */
export const formatPercentage = (value: number, decimalPlaces = 1): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};

/**
 * Форматує кількість товарів
 */
export const formatQuantity = (quantity: number, unit: 'pieces' | 'kg' = 'pieces'): string => {
  if (unit === 'kg') {
    return `${quantity.toFixed(2)} кг`;
  }
  return `${quantity} шт.`;
};
