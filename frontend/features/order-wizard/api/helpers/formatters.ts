/**
 * Форматування даних для відображення
 */

/**
 * Форматує ціну в гривнях
 * @param price - числове значення ціни
 * @returns форматована ціна у вигляді "123,45 ₴"
 */
export const formatCurrency = (price: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 2,
  }).format(price);
};

/**
 * Форматує відсоткове значення
 * @param value - числове значення відсотка
 * @returns рядок з відсотком, наприклад "25%"
 */
export const formatPercent = (value: number): string => {
  return `${value}%`;
};

/**
 * Переклад одиниць виміру для відображення в UI
 * @param unit - код одиниці виміру (PIECES, KILOGRAMS, тощо)
 * @returns перекладена одиниця виміру (шт., кг, тощо)
 */
export const translateUnitOfMeasure = (unit?: string): string => {
  if (!unit) return '';

  const translations: Record<string, string> = {
    PIECES: 'шт.',
    KILOGRAMS: 'кг',
    METERS: 'м',
    SQUARE_METERS: 'м²',
    CUBIC_METERS: 'м³',
  };

  return translations[unit] || unit;
};

/**
 * Розраховує загальну суму надбавок до ціни
 * @param modifiers - масив застосованих модифікаторів з їхнім впливом на ціну
 * @returns сума всіх позитивних модифікаторів (надбавок)
 */
export const calculateTotalAdditions = (
  modifiers: Array<{
    modifierId: string;
    name: string;
    value: number;
    impact: number;
  }>
): number => {
  return modifiers
    .filter((mod) => mod.impact > 0)
    .reduce((sum, mod) => sum + mod.impact, 0);
};

/**
 * Розраховує загальну суму знижок до ціни
 * @param modifiers - масив застосованих модифікаторів з їхнім впливом на ціну
 * @returns абсолютне значення суми всіх негативних модифікаторів (знижок)
 */
export const calculateTotalDiscounts = (
  modifiers: Array<{
    modifierId: string;
    name: string;
    value: number;
    impact: number;
  }>
): number => {
  return modifiers
    .filter((mod) => mod.impact < 0)
    .reduce((sum, mod) => sum + mod.impact, 0);
};
