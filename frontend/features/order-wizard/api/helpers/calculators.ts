/**
 * Обчислення та розрахунки для функцій бізнес-логіки
 */

/**
 * Генерує масив значень для діапазонного модифікатора
 * @param minValue - мінімальне значення діапазону
 * @param maxValue - максимальне значення діапазону
 * @returns масив значень, рівномірно розподілених в діапазоні
 */
export const generateRangeValues = (
  minValue: number | undefined,
  maxValue: number | undefined
): number[] => {
  if (minValue === undefined || maxValue === undefined) {
    return [];
  }

  const min = minValue;
  const max = maxValue;
  const step = Math.ceil((max - min) / 3); // Розділяємо діапазон на 4 значення

  // Генеруємо 4 кнопки рівномірно розподілені по діапазону
  const values = [min, min + step, min + 2 * step, max];

  // Видаляємо дублікати і сортуємо
  return [...new Set(values)].sort((a, b) => a - b);
};

/**
 * Обчислює загальну суму впливу надбавок
 * @param modifiers - масив модифікаторів з їх впливом на ціну
 * @returns сума всіх позитивних впливів
 */
export const calculateTotalAdditions = (
  modifiers: { impact: number }[]
): number => {
  return modifiers
    .filter((mod) => mod.impact > 0)
    .reduce((sum, mod) => sum + mod.impact, 0);
};

/**
 * Обчислює загальну суму впливу знижок
 * @param modifiers - масив модифікаторів з їх впливом на ціну
 * @returns сума всіх негативних впливів
 */
export const calculateTotalDiscounts = (
  modifiers: { impact: number }[]
): number => {
  return modifiers
    .filter((mod) => mod.impact < 0)
    .reduce((sum, mod) => sum + mod.impact, 0);
};
