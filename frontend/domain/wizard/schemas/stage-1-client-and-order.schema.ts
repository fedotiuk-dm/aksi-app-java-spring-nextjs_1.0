/**
 * @fileoverview Zod схеми для валідації етапу 1: Клієнт та базова інформація замовлення
 *
 * Використовуємо Orval згенеровані Zod схеми як основу та розширюємо їх
 * для специфічних потреб Order Wizard
 */

import { z } from 'zod';

// Імпорт Orval згенерованих Zod схем
import {
  createClientRequestSchema,
  updateClientRequestSchema,
  clientSearchRequestSchema,
} from '@/shared/api/generated/client/zod/aksiApi';

// =====================================
// Схеми для клієнтів
// =====================================

/**
 * Схема для створення нового клієнта в Order Wizard
 * Розширює базову схему додатковими валідаціями
 */
export const orderWizardCreateClientSchema = createClientRequestSchema
  .extend({
    // Додаткові поля специфічні для Order Wizard
    confirmPhone: z
      .string()
      .min(10, 'Підтвердження телефону повинно містити мінімум 10 символів')
      .optional(),
  })
  .refine(
    // Перевірка що телефон та підтвердження співпадають
    (data) => !data.confirmPhone || data.phone === data.confirmPhone,
    {
      message: 'Підтвердження телефону не співпадає',
      path: ['confirmPhone'],
    }
  );

/**
 * Схема для оновлення клієнта в Order Wizard
 */
export const orderWizardUpdateClientSchema = updateClientRequestSchema
  .extend({
    confirmPhone: z.string().optional(),
  })
  .refine((data) => !data.confirmPhone || data.phone === data.confirmPhone, {
    message: 'Підтвердження телефону не співпадає',
    path: ['confirmPhone'],
  });

/**
 * Схема для пошуку клієнтів
 */
export const clientSearchSchema = z.object({
  searchTerm: z
    .string()
    .min(2, 'Пошуковий термін повинен містити мінімум 2 символи')
    .max(100, 'Пошуковий термін не повинен перевищувати 100 символів'),
});

/**
 * Схема для швидкого створення клієнта (мінімальні дані)
 */
export const quickCreateClientSchema = z.object({
  firstName: z
    .string()
    .min(2, "Ім'я повинно містити мінімум 2 символи")
    .max(50, "Ім'я не повинно перевищувати 50 символів"),

  lastName: z
    .string()
    .min(2, 'Прізвище повинно містити мінімум 2 символи')
    .max(50, 'Прізвище не повинно перевищувати 50 символів'),

  phone: z
    .string()
    .min(10, 'Телефон повинен містити мінімум 10 символів')
    .max(20, 'Телефон не повинен перевищувати 20 символів')
    .regex(/^[\+\d\s\-\(\)]+$/, 'Неправильний формат телефону'),

  email: z.string().email('Неправильний формат email').optional().or(z.literal('')),

  address: z
    .string()
    .max(200, 'Адреса не повинна перевищувати 200 символів')
    .optional()
    .or(z.literal('')),
});

// =====================================
// Схеми для базової інформації замовлення
// =====================================

/**
 * Схема для унікальної мітки замовлення
 */
export const uniqueTagSchema = z
  .string()
  .min(3, 'Унікальна мітка повинна містити мінімум 3 символи')
  .max(50, 'Унікальна мітка не повинна перевищувати 50 символів')
  .regex(
    /^[a-zA-Z0-9а-яА-ЯіІїЇєЄ\-_\s]+$/,
    'Унікальна мітка може містити тільки букви, цифри, дефіс та підкреслення'
  );

/**
 * Схема для номера квитанції
 */
export const receiptNumberSchema = z
  .string()
  .regex(/^\d{8}-\d{6}-\d{3}$/, 'Неправильний формат номера квитанції (YYYYMMDD-HHMMSS-XXX)')
  .optional();

/**
 * Схема для базової інформації замовлення
 */
export const orderBasicInfoSchema = z.object({
  receiptNumber: receiptNumberSchema,

  uniqueTag: uniqueTagSchema,

  branchLocationId: z.string().min(1, 'Оберіть філію прийому'),

  createdAt: z
    .date()
    .optional()
    .default(() => new Date()),
});

// =====================================
// Композитні схеми для етапу 1
// =====================================

/**
 * Схема для повних даних етапу 1
 */
export const stage1DataSchema = z.object({
  // Клієнт (обов'язковий)
  selectedClient: z
    .object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string(),
      email: z.string().optional(),
      address: z.string().optional(),
    })
    .nullable(),

  // Базова інформація замовлення
  basicInfo: orderBasicInfoSchema,

  // Флаг чи клієнт новий
  isNewClient: z.boolean().default(false),
});

/**
 * Схема для валідації готовності переходу до етапу 2
 */
export const stage1CompletionSchema = stage1DataSchema
  .refine((data) => data.selectedClient !== null, {
    message: 'Клієнт повинен бути обраний або створений',
    path: ['selectedClient'],
  })
  .refine((data) => data.basicInfo.uniqueTag.trim() !== '', {
    message: "Унікальна мітка обов'язкова",
    path: ['basicInfo', 'uniqueTag'],
  })
  .refine((data) => data.basicInfo.branchLocationId.trim() !== '', {
    message: "Філія прийому обов'язкова",
    path: ['basicInfo', 'branchLocationId'],
  });

// =====================================
// Експорт типів згенерованих з схем
// =====================================

export type OrderWizardCreateClientData = z.infer<typeof orderWizardCreateClientSchema>;
export type OrderWizardUpdateClientData = z.infer<typeof orderWizardUpdateClientSchema>;
export type ClientSearchData = z.infer<typeof clientSearchSchema>;
export type QuickCreateClientData = z.infer<typeof quickCreateClientSchema>;
export type OrderBasicInfoData = z.infer<typeof orderBasicInfoSchema>;
export type Stage1Data = z.infer<typeof stage1DataSchema>;
export type Stage1CompletionData = z.infer<typeof stage1CompletionSchema>;

// =====================================
// Допоміжні функції валідації
// =====================================

/**
 * Валідація телефонного номера України
 */
export function validateUkrainianPhone(phone: string): boolean {
  // Видаляємо всі символи крім цифр та плюса
  const cleaned = phone.replace(/[^\d\+]/g, '');

  // Українські номери: +380XXXXXXXXX або 0XXXXXXXXX
  const ukrainianPattern = /^(\+380|380|0)[0-9]{9}$/;

  return ukrainianPattern.test(cleaned);
}

/**
 * Форматування телефонного номера
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[^\d\+]/g, '');

  if (cleaned.startsWith('+380')) {
    // +380 XX XXX XX XX
    const number = cleaned.slice(4);
    return `+380 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5, 7)} ${number.slice(7, 9)}`;
  } else if (cleaned.startsWith('380')) {
    // +380 XX XXX XX XX
    const number = cleaned.slice(3);
    return `+380 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5, 7)} ${number.slice(7, 9)}`;
  } else if (cleaned.startsWith('0')) {
    // 0XX XXX XX XX
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
  }

  return phone;
}

/**
 * Нормалізація пошукового терміна
 */
export function normalizeSearchTerm(term: string): string {
  return term.trim().toLowerCase().replace(/\s+/g, ' '); // Заміна множинних пробілів одним
}
