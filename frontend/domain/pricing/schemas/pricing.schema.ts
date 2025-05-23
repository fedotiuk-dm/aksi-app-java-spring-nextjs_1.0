/**
 * Zod схеми для валідації Pricing домену
 */

import { z } from 'zod';

import {
  ServiceCategory,
  UnitOfMeasure,
  PriceModifierType,
  ModifierApplicationRule,
} from '../types';

// === ОСНОВНІ СХЕМИ ===

/**
 * Схема для елемента прайс-листа
 */
export const priceListItemSchema = z
  .object({
    id: z.string().optional(),
    itemNumber: z
      .string()
      .min(1, "Номер елемента обов'язковий")
      .max(20, 'Номер елемента занадто довгий'),
    name: z
      .string()
      .min(2, 'Назва повинна містити мінімум 2 символи')
      .max(200, 'Назва занадто довга'),
    description: z.string().max(1000, 'Опис занадто довгий').optional(),
    category: z.nativeEnum(ServiceCategory),
    categoryId: z.string().min(1, "ID категорії обов'язковий"),
    basePrice: z.number().min(0, "Базова ціна не може бути від'ємною"),
    blackColorPrice: z
      .number()
      .min(0, "Ціна для чорного кольору не може бути від'ємною")
      .optional(),
    lightColorPrice: z
      .number()
      .min(0, "Ціна для світлого кольору не може бути від'ємною")
      .optional(),
    specialPrice: z.number().min(0, "Спеціальна ціна не може бути від'ємною").optional(),
    unitOfMeasure: z.nativeEnum(UnitOfMeasure),
    minQuantity: z.number().min(0, "Мінімальна кількість не може бути від'ємною").optional(),
    maxQuantity: z.number().min(0, "Максимальна кількість не може бути від'ємною").optional(),
    isActive: z.boolean().default(true),
    tags: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.minQuantity !== undefined && data.maxQuantity !== undefined) {
        return data.minQuantity <= data.maxQuantity;
      }
      return true;
    },
    {
      message: 'Мінімальна кількість не може бути більше максимальної',
      path: ['minQuantity'],
    }
  );

export type PriceListItemInput = z.infer<typeof priceListItemSchema>;

/**
 * Схема для модифікатора ціни
 */
export const priceModifierSchema = z
  .object({
    id: z.string().optional(),
    code: z.string().min(1, "Код модифікатора обов'язковий").max(50, 'Код занадто довгий'),
    name: z
      .string()
      .min(2, 'Назва повинна містити мінімум 2 символи')
      .max(200, 'Назва занадто довга'),
    description: z.string().max(1000, 'Опис занадто довгий').optional(),
    type: z.nativeEnum(PriceModifierType),
    value: z.number(),
    priority: z
      .number()
      .min(0, "Пріоритет не може бути від'ємним")
      .max(1000, 'Пріоритет занадто великий'),
    applicationRule: z
      .nativeEnum(ModifierApplicationRule)
      .default(ModifierApplicationRule.ADDITIVE),
    applicableCategories: z
      .array(z.nativeEnum(ServiceCategory))
      .min(1, 'Потрібно вибрати хоча б одну категорію'),
    materialTypes: z.array(z.string()).optional(),
    colorTypes: z.array(z.string()).optional(),
    isActive: z.boolean().default(true),
    validFrom: z.date().optional(),
    validUntil: z.date().optional(),
    minOrderAmount: z
      .number()
      .min(0, "Мінімальна сума замовлення не може бути від'ємною")
      .optional(),
    maxApplications: z
      .number()
      .min(1, 'Максимальна кількість застосувань повинна бути більше 0')
      .optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .refine(
    (data) => {
      // Валідація значення залежно від типу
      switch (data.type) {
        case PriceModifierType.PERCENTAGE:
          return data.value >= -100 && data.value <= 1000;
        case PriceModifierType.FIXED_AMOUNT:
          return data.value >= -10000;
        case PriceModifierType.MULTIPLIER:
          return data.value >= 0;
        default:
          return true;
      }
    },
    {
      message: 'Некоректне значення для вибраного типу модифікатора',
      path: ['value'],
    }
  )
  .refine(
    (data) => {
      if (data.validFrom && data.validUntil) {
        return data.validFrom <= data.validUntil;
      }
      return true;
    },
    {
      message: 'Дата початку дії не може бути пізніше дати закінчення',
      path: ['validFrom'],
    }
  );

export type PriceModifierInput = z.infer<typeof priceModifierSchema>;

/**
 * Схема для параметрів розрахунку ціни
 */
export const priceCalculationParamsSchema = z.object({
  priceListItem: priceListItemSchema,
  quantity: z
    .number()
    .min(0.001, 'Кількість повинна бути більше 0')
    .max(1000, 'Занадто велика кількість'),
  materialType: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  condition: z.string().optional(),
  discountPercentage: z
    .number()
    .min(0, "Знижка не може бути від'ємною")
    .max(100, 'Знижка не може бути більше 100%')
    .optional(),
  urgencyLevel: z.enum(['standard', '48h', '24h']).optional(),
  notes: z.string().max(500, 'Примітки занадто довгі').optional(),
});

export type PriceCalculationParamsInput = z.infer<typeof priceCalculationParamsSchema>;

/**
 * Схема для параметрів пошуку
 */
export const priceSearchParamsSchema = z
  .object({
    keyword: z.string().max(100, 'Ключове слово занадто довге').optional(),
    category: z.nativeEnum(ServiceCategory).optional(),
    categories: z.array(z.nativeEnum(ServiceCategory)).optional(),
    unitOfMeasure: z.nativeEnum(UnitOfMeasure).optional(),
    minPrice: z.number().min(0, "Мінімальна ціна не може бути від'ємною").optional(),
    maxPrice: z.number().min(0, "Максимальна ціна не може бути від'ємною").optional(),
    isActive: z.boolean().optional(),
    itemNumbers: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    {
      message: 'Мінімальна ціна не може бути більше максимальної',
      path: ['minPrice'],
    }
  );

export type PriceSearchParamsInput = z.infer<typeof priceSearchParamsSchema>;

// === СХЕМИ ДЛЯ ФОРМ ===

/**
 * Базова схема для елемента прайс-листа без refine
 */
const basePriceListItemSchema = z.object({
  id: z.string().optional(),
  itemNumber: z
    .string()
    .min(1, "Номер елемента обов'язковий")
    .max(20, 'Номер елемента занадто довгий'),
  name: z
    .string()
    .min(2, 'Назва повинна містити мінімум 2 символи')
    .max(200, 'Назва занадто довга'),
  description: z.string().max(1000, 'Опис занадто довгий').optional(),
  category: z.nativeEnum(ServiceCategory),
  categoryId: z.string().min(1, "ID категорії обов'язковий"),
  basePrice: z.number().min(0, "Базова ціна не може бути від'ємною"),
  blackColorPrice: z.number().min(0, "Ціна для чорного кольору не може бути від'ємною").optional(),
  lightColorPrice: z.number().min(0, "Ціна для світлого кольору не може бути від'ємною").optional(),
  specialPrice: z.number().min(0, "Спеціальна ціна не може бути від'ємною").optional(),
  unitOfMeasure: z.nativeEnum(UnitOfMeasure),
  minQuantity: z.number().min(0, "Мінімальна кількість не може бути від'ємною").optional(),
  maxQuantity: z.number().min(0, "Максимальна кількість не може бути від'ємною").optional(),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

/**
 * Базова схема для модифікатора без refine
 */
const basePriceModifierSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, "Код модифікатора обов'язковий").max(50, 'Код занадто довгий'),
  name: z
    .string()
    .min(2, 'Назва повинна містити мінімум 2 символи')
    .max(200, 'Назва занадто довга'),
  description: z.string().max(1000, 'Опис занадто довгий').optional(),
  type: z.nativeEnum(PriceModifierType),
  value: z.number(),
  priority: z
    .number()
    .min(0, "Пріоритет не може бути від'ємним")
    .max(1000, 'Пріоритет занадто великий'),
  applicationRule: z.nativeEnum(ModifierApplicationRule).default(ModifierApplicationRule.ADDITIVE),
  applicableCategories: z
    .array(z.nativeEnum(ServiceCategory))
    .min(1, 'Потрібно вибрати хоча б одну категорію'),
  materialTypes: z.array(z.string()).optional(),
  colorTypes: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  validFrom: z.date().optional(),
  validUntil: z.date().optional(),
  minOrderAmount: z.number().min(0, "Мінімальна сума замовлення не може бути від'ємною").optional(),
  maxApplications: z
    .number()
    .min(1, 'Максимальна кількість застосувань повинна бути більше 0')
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

/**
 * Схема для форми створення/редагування елемента прайс-листа
 */
export const priceListItemFormSchema = basePriceListItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PriceListItemFormInput = z.infer<typeof priceListItemFormSchema>;

/**
 * Схема для форми створення/редагування модифікатора
 */
export const priceModifierFormSchema = basePriceModifierSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PriceModifierFormInput = z.infer<typeof priceModifierFormSchema>;

/**
 * Схема для форми розрахунку ціни
 */
export const priceCalculationFormSchema = z.object({
  itemNumber: z.string().min(1, 'Виберіть послугу'),
  quantity: z.number().min(0.001, 'Кількість повинна бути більше 0'),
  materialType: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  condition: z.string().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  urgencyLevel: z.enum(['standard', '48h', '24h']).default('standard'),
  selectedModifiers: z.array(z.string()).default([]),
  notes: z.string().max(500).optional(),
});

export type PriceCalculationFormInput = z.infer<typeof priceCalculationFormSchema>;

// === СХЕМИ ДЛЯ ІМПОРТУ/ЕКСПОРТУ ===

/**
 * Схема для імпорту прайс-листа з CSV
 */
export const csvImportSchema = z.object({
  itemNumber: z.string().min(1, "Номер елемента обов'язковий"),
  name: z.string().min(1, "Назва обов'язкова"),
  category: z.string().min(1, "Категорія обов'язкова"),
  basePrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Некоректна базова ціна',
  }),
  unitOfMeasure: z.string().min(1, "Одиниця виміру обов'язкова"),
  isActive: z.string().optional().default('true'),
  description: z.string().optional(),
});

export type CsvImportInput = z.infer<typeof csvImportSchema>;

// === ДОПОМІЖНІ СХЕМИ ===

/**
 * Схема для валідації номера елемента прайс-листа
 */
export const itemNumberSchema = z
  .string()
  .min(3, 'Номер елемента повинен містити мінімум 3 символи')
  .max(20, 'Номер елемента не може містити більше 20 символів')
  .regex(
    /^[A-Za-z0-9\-\.]+$/,
    'Номер елемента може містити тільки літери, цифри, дефіси та крапки'
  );

/**
 * Схема для валідації коду модифікатора
 */
export const modifierCodeSchema = z
  .string()
  .min(2, 'Код модифікатора повинен містити мінімум 2 символи')
  .max(50, 'Код модифікатора не може містити більше 50 символів')
  .regex(
    /^[A-Za-z0-9_\-]+$/,
    'Код модифікатора може містити тільки літери, цифри, підкреслення та дефіси'
  );

/**
 * Схема для валідації ціни
 */
export const priceSchema = z
  .number()
  .min(0, "Ціна не може бути від'ємною")
  .max(999999.99, 'Ціна занадто велика')
  .refine((val) => Number.isFinite(val), {
    message: 'Ціна повинна бути числом',
  });

/**
 * Схема для валідації відсотка
 */
export const percentageSchema = z
  .number()
  .min(0, "Відсоток не може бути від'ємним")
  .max(100, 'Відсоток не може бути більше 100')
  .refine((val) => Number.isFinite(val), {
    message: 'Відсоток повинен бути числом',
  });

// === СХЕМИ ДЛЯ НАЛАШТУВАНЬ ===

/**
 * Схема для налаштувань ціноутворення
 */
export const pricingSettingsSchema = z.object({
  currency: z.string().default('UAH'),
  roundingPrecision: z.number().min(0).max(4).default(2),
  roundingRule: z.enum(['up', 'down', 'nearest']).default('nearest'),
  enableAutoCalculation: z.boolean().default(true),
  enableValidation: z.boolean().default(true),
  enableHistory: z.boolean().default(true),
  maxHistoryItems: z.number().min(10).max(1000).default(50),
  defaultUrgencyLevel: z.enum(['standard', '48h', '24h']).default('standard'),
  defaultDiscountType: z.string().optional(),
  enableNotifications: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type PricingSettingsInput = z.infer<typeof pricingSettingsSchema>;
