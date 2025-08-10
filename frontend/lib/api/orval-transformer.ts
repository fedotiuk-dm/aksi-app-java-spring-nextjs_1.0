/**
 * @fileoverview Orval Transformer для преобробки даних API
 *
 * Функції для трансформації даних до/після API викликів:
 * - Автоматичне перетворення дат з ISO strings в Date об'єкти
 * - Нормалізація null/undefined значень
 * - Преобробка вкладених об'єктів
 * - Валідація та очищення даних
 */

import dayjs from 'dayjs';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// 🔧 Типи для transformer'а
interface TransformContext {
  isRequest: boolean;
  isResponse: boolean;
  endpoint: string;
  method: string;
}

interface TransformOptions {
  transformDates?: boolean;
  normalizeNulls?: boolean;
  trimStrings?: boolean;
  validateRequired?: boolean;
}

// 📅 Паттерни для розпізнавання дат
const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO datetime
  /^\d{4}-\d{2}-\d{2}$/, // ISO date
  /createdAt|updatedAt|date|time/i, // поля з датами
];

/**
 * Перевіряє чи строка є датою
 */
function isDateString(value: string, key?: string): boolean {


  // Перевіряємо за назвою поля
  if (
    key &&
    DATE_PATTERNS.some((pattern) =>
      typeof pattern === 'object' ? pattern.test(key) : pattern === key
    )
  ) {
    return true;
  }

  // Перевіряємо за форматом
  return DATE_PATTERNS.some((pattern) =>
    typeof pattern === 'object' ? pattern.test(value) : false
  );
}

/**
 * Рекурсивно трансформує об'єкт
 */
function transformObject(
  obj: any,
  options: TransformOptions = {},
  context: Partial<TransformContext> = {}
): any {
  if (obj === null || obj === undefined) {
    return options.normalizeNulls ? null : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformObject(item, options, context));
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const transformed: any = {};

    for (const [key, value] of Object.entries(obj)) {
      transformed[key] = transformValue(value, key, options, context);
    }

    return transformed;
  }

  return obj;
}

/**
 * Трансформує конкретне значення
 */
function transformValue(
  value: any,
  key: string,
  options: TransformOptions,
  context: Partial<TransformContext>
): any {
  // Обробка дат
  if (options.transformDates && typeof value === 'string' && isDateString(value, key)) {
    if (context.isRequest) {
      // При відправці: Date -> ISO string
      return dayjs(value).isValid() ? dayjs(value).toISOString() : value;
    } else {
      // При отриманні: ISO string -> Date
      return dayjs(value).isValid() ? dayjs(value).toDate() : value;
    }
  }

  // Обробка строк
  if (options.trimStrings && typeof value === 'string') {
    return value.trim();
  }

  // Нормалізація null/undefined
  if (options.normalizeNulls) {
    if (value === '' || value === 'null' || value === 'undefined') {
      return null;
    }
  }

  // Рекурсивна обробка об'єктів
  if (typeof value === 'object') {
    return transformObject(value, options, context);
  }

  return value;
}

/**
 * 🚀 Основний transformer для request data
 */
export function transformRequestData(data: any, config: AxiosRequestConfig): any {
  const options: TransformOptions = {
    transformDates: true,
    normalizeNulls: true,
    trimStrings: true,
    validateRequired: true,
  };

  const context: TransformContext = {
    isRequest: true,
    isResponse: false,
    endpoint: config.url || '',
    method: (config.method || 'GET').toUpperCase(),
  };

  // Логування в development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔄 Transform Request [${context.method} ${context.endpoint}]:`, {
      original: data,
      transformed: transformObject(data, options, context),
    });
  }

  return transformObject(data, options, context);
}

/**
 * 🎯 Основний transformer для response data
 */
export function transformResponseData(data: any, response: AxiosResponse): any {
  const options: TransformOptions = {
    transformDates: true,
    normalizeNulls: true,
    trimStrings: false, // Не обрізаємо строки у відповідях
    validateRequired: false,
  };

  const context: TransformContext = {
    isRequest: false,
    isResponse: true,
    endpoint: response.config.url || '',
    method: (response.config.method || 'GET').toUpperCase(),
  };

  // Логування в development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎯 Transform Response [${context.method} ${context.endpoint}]:`, {
      status: response.status,
      original: data,
      transformed: transformObject(data, options, context),
    });
  }

  return transformObject(data, options, context);
}

/**
 * 🔧 Кастомний transformer для специфічних endpoint'ів
 */
export function createCustomTransformer(customOptions: Partial<TransformOptions>) {
  return {
    request: (data: any, config: AxiosRequestConfig) => {
      const options = {
        transformDates: true,
        normalizeNulls: true,
        trimStrings: true,
        validateRequired: true,
        ...customOptions,
      };

      return transformObject(data, options, {
        isRequest: true,
        isResponse: false,
        endpoint: config.url || '',
        method: (config.method || 'GET').toUpperCase(),
      });
    },

    response: (data: any, response: AxiosResponse) => {
      const options = {
        transformDates: true,
        normalizeNulls: true,
        trimStrings: false,
        validateRequired: false,
        ...customOptions,
      };

      return transformObject(data, options, {
        isRequest: false,
        isResponse: true,
        endpoint: response.config.url || '',
        method: (response.config.method || 'GET').toUpperCase(),
      });
    },
  };
}

/**
 * 🎯 Transformer для конкретних доменів
 */
export const domainTransformers = {
  // Клієнти: преобробка контактних даних
  client: createCustomTransformer({
    transformDates: true,
    normalizeNulls: true,
    trimStrings: true,
  }),

  // Замовлення: робота з датами та статусами
  order: createCustomTransformer({
    transformDates: true,
    normalizeNulls: false, // Зберігаємо null для опціональних полів
    trimStrings: true,
  }),

  // Ціноутворення: числові розрахунки
  pricing: createCustomTransformer({
    transformDates: false, // Мінімум трансформацій для точності
    normalizeNulls: false,
    trimStrings: false,
  }),
};

// Default export для Orval
export default transformResponseData;
