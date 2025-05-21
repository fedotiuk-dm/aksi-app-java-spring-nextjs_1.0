import dayjs from 'dayjs';
import { z } from 'zod';

import { ValidationErrors } from '../schemas/common.schema';

/**
 * Трансформатори для схем Zod
 */

/**
 * Перетворює строку дати в об'єкт Date
 */
export const dateTransformer = () => z.preprocess((val) => {
  if (typeof val === 'string') {
    return dayjs(val).toDate();
  }
  return val;
}, z.date());

/**
 * Перетворює строкове представлення числа в число
 */
export const numberTransformer = () => z.preprocess((val) => {
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? undefined : parsed;
  }
  return val;
}, z.number());

/**
 * Перетворює строкове представлення булевого значення в булеве
 */
export const booleanTransformer = () => z.preprocess((val) => {
  if (typeof val === 'string') {
    return val.toLowerCase() === 'true';
  }
  return val;
}, z.boolean());

/**
 * Утиліти для обробки даних форм
 */

/**
 * Видаляє порожні строки з об'єкта, замінюючи їх на undefined
 */
export const removeEmptyStrings = <T extends Record<string, unknown>>(data: T): T => {
  const result = { ...data };

  Object.entries(result).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() === '') {
      (result as Record<string, unknown>)[key] = undefined;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = removeEmptyStrings(value as Record<string, unknown>);
    }
  });

  return result;
};

/**
 * Перетворює дати з об'єкта dayjs в строки ISO
 */
interface DayjsLike {
  isValid: () => boolean;
  toISOString: () => string;
}

export const convertDayjsDatesToISOStrings = <T extends Record<string, unknown>>(data: T): T => {
  const result = { ...data };

  Object.entries(result).forEach(([key, value]) => {
    // Перевіряємо, чи є значення об'єктом dayjs
    if (value && typeof value === 'object' && 'isValid' in value && 
        typeof (value as DayjsLike).isValid === 'function') {
      if ((value as DayjsLike).isValid()) {
        (result as Record<string, unknown>)[key] = (value as DayjsLike).toISOString();
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = convertDayjsDatesToISOStrings(value as Record<string, unknown>);
    }
  });

  return result;
};

/**
 * Перетворює дати з ISO строк в об'єкти dayjs
 */
export const convertISOStringsToDayjsDates = <T extends Record<string, unknown>>(data: T): T => {
  const result = { ...data };

  Object.entries(result).forEach(([key, value]) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      const date = dayjs(value);
      if (date.isValid()) {
        (result as Record<string, unknown>)[key] = date;
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = convertISOStringsToDayjsDates(value as Record<string, unknown>);
    }
  });

  return result;
};

/**
 * Допоміжні функції для роботи з помилками форм
 */

/**
 * Перевіряє, чи є хоча б одна помилка в об'єкті помилок
 */
export const hasAnyError = (errors: ValidationErrors): boolean => {
  if (!errors || typeof errors !== 'object') {
    return false;
  }

  for (const key in errors) {
    const value = errors[key];
    if (typeof value === 'string') {
      return true;
    } else if (typeof value === 'object' && value !== null) {
      if (hasAnyError(value as ValidationErrors)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Збирає всі помилки з об'єкта помилок у плоский масив
 */
export const flattenErrors = (errors: ValidationErrors, prefix = ''): string[] => {
  if (!errors || typeof errors !== 'object') {
    return [];
  }

  const result: string[] = [];

  for (const key in errors) {
    const value = errors[key];
    const fieldPath = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      result.push(`${fieldPath}: ${value}`);
    } else if (typeof value === 'object' && value !== null) {
      result.push(...flattenErrors(value as ValidationErrors, fieldPath));
    }
  }

  return result;
};
