import { z } from 'zod';

/**
 * Базові типи даних для використання в різних модулях
 */

// Загальні типи
export const stringSchema = z.string();
export const numberSchema = z.number();
export const booleanSchema = z.boolean();
export const dateSchema = z.string().refine((value) => !isNaN(Date.parse(value)), {
  message: 'Невірний формат дати'
});
export const uuidSchema = z.string().uuid({
  message: 'Невірний формат UUID'
});

// Валідаційні правила для тексту
export const nonEmptyString = z.string().min(1, 'Поле не може бути порожнім');
export const shortText = z.string().min(1, 'Поле не може бути більшим 100 символів').max(100, 'Текст занадто довгий');
export const longText = z.string().min(1, 'Поле не може бути більшим 1000 символів').max(1000, 'Текст занадто довгий');

// Валідаційні правила для контактів
export const emailSchema = z.string().email('Невірний формат email').or(z.string().length(0).optional());
export const phoneSchema = z.string().regex(/^\+?[0-9]{10,15}$/, 'Невірний формат телефону');

// Валідаційні правила для чисел
export const positiveNumber = z.number().positive('Число повинно бути більше нуля');
export const nonNegativeNumber = z.number().min(0, 'Число не може бути від\'ємним');
export const percentageNumber = z.number().min(0, 'Відсоток не може бути від\'ємним').max(100, 'Відсоток не може бути більше 100');
export const priceNumber = z.number().min(0, 'Ціна не може бути від\'ємною').max(1000000, 'Ціна занадто велика');

// Валідаційні правила для дат
export const pastDate = z.date().refine((date) => date < new Date(), {
  message: 'Дата повинна бути в минулому'
});
export const futureDate = z.date().refine((date) => date > new Date(), {
  message: 'Дата повинна бути в майбутньому'
});
export const todayOrFutureDate = z.date().refine((date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}, {
  message: 'Дата повинна бути сьогодні або в майбутньому'
});

/**
 * Утиліти для роботи з помилками валідації
 */

export type ValidationError = {
  path: string[];
  message: string;
};

export type ValidationErrors = {
  [key: string]: string | ValidationErrors;
};

// Функція для форматування помилок Zod у зручний для користувача формат
export const formatZodErrors = (errors: z.ZodIssue[]): ValidationErrors => {
  const formattedErrors: ValidationErrors = {};

  errors.forEach((error) => {
    let currentLevel = formattedErrors;
    const path = error.path;

    // Для всіх елементів шляху, крім останнього, створюємо вкладені об'єкти помилок
    for (let i = 0; i < path.length - 1; i++) {
      const key = String(path[i]);
      if (!currentLevel[key]) {
        currentLevel[key] = {};
      }
      currentLevel = currentLevel[key] as ValidationErrors;
    }

    // Для останнього елемента шляху додаємо повідомлення про помилку
    if (path.length > 0) {
      const lastKey = String(path[path.length - 1]);
      currentLevel[lastKey] = error.message;
    }
  });

  return formattedErrors;
};

// Функція для перевірки наявності помилок у конкретному полі
export const hasFieldError = (errors: ValidationErrors, fieldPath: string): boolean => {
  const pathParts = fieldPath.split('.');
  let current = errors;

  for (const part of pathParts) {
    if (typeof current !== 'object' || current === null) {
      return false;
    }
    if (!(part in current)) {
      return false;
    }
    current = current[part] as ValidationErrors;
  }

  return typeof current === 'string';
};

// Функція для отримання помилки конкретного поля
export const getFieldError = (errors: ValidationErrors, fieldPath: string): string | null => {
  const pathParts = fieldPath.split('.');
  let current = errors;

  for (const part of pathParts) {
    if (typeof current !== 'object' || current === null) {
      return null;
    }
    if (!(part in current)) {
      return null;
    }
    current = current[part] as ValidationErrors;
  }

  return typeof current === 'string' ? current : null;
};
