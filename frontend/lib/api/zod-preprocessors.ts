/**
 * @fileoverview Preprocessor функції для Zod схем
 *
 * Функції для попередньої обробки даних перед валідацією Zod схемами.
 * Використовуються Orval для покращення валідації API відповідей.
 */

/**
 * Видаляє null значення з об'єкта перед валідацією
 * Корисно для API, які повертають null замість undefined
 */
export const preprocessResponse = (data: unknown): unknown => {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(preprocessResponse);
  }

  if (typeof data === 'object') {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      // Видаляємо null значення, залишаємо undefined
      if (value !== null) {
        result[key] = preprocessResponse(value);
      }
    }

    return result;
  }

  return data;
};

/**
 * Нормалізує дати з різних форматів
 */
export const preprocessDates = (data: unknown): unknown => {
  if (typeof data === 'string') {
    // ISO дата формат
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
    if (isoDatePattern.test(data)) {
      return new Date(data);
    }
  }

  if (Array.isArray(data)) {
    return data.map(preprocessDates);
  }

  if (typeof data === 'object' && data !== null) {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      result[key] = preprocessDates(value);
    }

    return result;
  }

  return data;
};

/**
 * Нормалізує числові рядки в числа
 */
export const preprocessNumbers = (data: unknown): unknown => {
  if (typeof data === 'string' && /^\d+(\.\d+)?$/.test(data)) {
    const num = Number(data);
    if (!isNaN(num)) {
      return num;
    }
  }

  if (Array.isArray(data)) {
    return data.map(preprocessNumbers);
  }

  if (typeof data === 'object' && data !== null) {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      result[key] = preprocessNumbers(value);
    }

    return result;
  }

  return data;
};
