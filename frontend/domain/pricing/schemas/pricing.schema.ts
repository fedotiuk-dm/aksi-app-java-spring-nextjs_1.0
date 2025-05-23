/**
 * Zod схеми для валідації даних у домені Pricing
 * Забезпечують типобезпеку та валідацію на рівні доменної логіки
 */

import { z } from 'zod';

import { ModifierCategory, ModifierType, RiskLevel } from '../types/pricing.types';

// ============= КОНСТАНТИ =============

const VALIDATION_MESSAGES = {
  INVALID_UUID: 'Невалідний формат ID',
  INVALID_CATEGORY_ID: 'Невалідний формат ID категорії',
  PRICE_TOO_HIGH: 'Ціна занадто висока',
  NEGATIVE_PRICE: "Базова ціна не може бути від'ємною",
} as const;

const VALIDATION_LIMITS = {
  MAX_PRICE: 100000,
  MIN_PRICE_RATIO: 0.5,
} as const;

// ============= БАЗОВІ СХЕМИ =============

/**
 * Схема для елемента прайс-листа
 */
export const priceListItemSchema = z
  .object({
    id: z.string().uuid(VALIDATION_MESSAGES.INVALID_UUID),
    categoryId: z.string().uuid(VALIDATION_MESSAGES.INVALID_CATEGORY_ID),
    catalogNumber: z.number().int().positive().optional(),
    name: z
      .string()
      .min(1, 'Назва предмета не може бути порожньою')
      .max(255, 'Назва занадто довга'),
    unitOfMeasure: z
      .string()
      .min(1, 'Одиниця виміру не може бути порожньою')
      .max(20, 'Одиниця виміру занадто довга'),
    basePrice: z
      .number()
      .min(0, VALIDATION_MESSAGES.NEGATIVE_PRICE)
      .max(VALIDATION_LIMITS.MAX_PRICE, VALIDATION_MESSAGES.PRICE_TOO_HIGH),
    priceBlack: z
      .number()
      .min(0, "Ціна для чорних речей не може бути від'ємною")
      .max(VALIDATION_LIMITS.MAX_PRICE, VALIDATION_MESSAGES.PRICE_TOO_HIGH)
      .optional(),
    priceColor: z
      .number()
      .min(0, "Ціна для кольорових речей не може бути від'ємною")
      .max(VALIDATION_LIMITS.MAX_PRICE, VALIDATION_MESSAGES.PRICE_TOO_HIGH)
      .optional(),
    active: z.boolean(),
  })
  .refine(
    (data) => {
      // Перевіряємо, що спеціальні ціни не менше базової
      const minPrice = data.basePrice * VALIDATION_LIMITS.MIN_PRICE_RATIO;
      return (
        (data.priceBlack === undefined || data.priceBlack >= minPrice) &&
        (data.priceColor === undefined || data.priceColor >= minPrice)
      );
    },
    {
      message: 'Спеціальні ціни не можуть бути менше ніж 50% від базової ціни',
      path: ['priceBlack', 'priceColor'],
    }
  );

/**
 * Схема для категорії послуг
 */
export const serviceCategorySchema = z.object({
  id: z.string().uuid(VALIDATION_MESSAGES.INVALID_UUID),
  code: z
    .string()
    .min(1, 'Код категорії не може бути порожнім')
    .max(50, 'Код категорії занадто довгий'),
  name: z
    .string()
    .min(1, 'Назва категорії не може бути порожньою')
    .max(255, 'Назва категорії занадто довга'),
  description: z.string().max(500, 'Опис категорії занадто довгий').optional(),
  active: z.boolean(),
});

/**
 * Схема для модифікатора ціни
 */
export const priceModifierSchema = z
  .object({
    id: z.string().uuid(VALIDATION_MESSAGES.INVALID_UUID),
    code: z
      .string()
      .min(1, 'Код модифікатора не може бути порожнім')
      .max(50, 'Код модифікатора занадто довгий'),
    name: z
      .string()
      .min(1, 'Назва модифікатора не може бути порожньою')
      .max(255, 'Назва модифікатора занадто довга'),
    description: z.string().max(500, 'Опис модифікатора занадто довгий').optional(),
    category: z.nativeEnum(ModifierCategory, {
      errorMap: () => ({ message: 'Невалідна категорія модифікатора' }),
    }),
    appliesTo: z.array(z.string()).default([]),
    type: z.nativeEnum(ModifierType, {
      errorMap: () => ({ message: 'Невалідний тип модифікатора' }),
    }),
    value: z.number(),
    active: z.boolean(),
  })
  .refine(
    (data) => {
      // Валідація значення в залежності від типу
      switch (data.type) {
        case ModifierType.PERCENTAGE:
          return data.value >= -100 && data.value <= 1000; // від -100% до 1000%
        case ModifierType.FIXED_AMOUNT:
          return data.value >= -10000 && data.value <= 10000; // від -10000 до 10000 грн
        case ModifierType.RANGE:
          return data.value >= 0 && data.value <= 1000; // від 0% до 1000%
        default:
          return false;
      }
    },
    {
      message: 'Невалідне значення для даного типу модифікатора',
      path: ['value'],
    }
  );

/**
 * Схема для типу забруднення
 */
export const stainTypeSchema = z.object({
  id: z.string().uuid(VALIDATION_MESSAGES.INVALID_UUID),
  code: z
    .string()
    .min(1, 'Код забруднення не може бути порожнім')
    .max(50, 'Код забруднення занадто довгий'),
  name: z
    .string()
    .min(1, 'Назва забруднення не може бути порожньою')
    .max(255, 'Назва забруднення занадто довга'),
  description: z.string().max(500, 'Опис забруднення занадто довгий').optional(),
  riskLevel: z.nativeEnum(RiskLevel, {
    errorMap: () => ({ message: 'Невалідний рівень ризику' }),
  }),
  active: z.boolean(),
});

/**
 * Схема для типу дефекту
 */
export const defectTypeSchema = z.object({
  id: z.string().uuid(VALIDATION_MESSAGES.INVALID_UUID),
  code: z
    .string()
    .min(1, 'Код дефекту не може бути порожнім')
    .max(50, 'Код дефекту занадто довгий'),
  name: z
    .string()
    .min(1, 'Назва дефекту не може бути порожньою')
    .max(255, 'Назва дефекту занадто довга'),
  description: z.string().max(500, 'Опис дефекту занадто довгий').optional(),
  riskLevel: z.nativeEnum(RiskLevel, {
    errorMap: () => ({ message: 'Невалідний рівень ризику' }),
  }),
  active: z.boolean(),
});

// ============= СХЕМИ ДЛЯ ЗАПИТІВ ТА ВІДПОВІДЕЙ =============

/**
 * Схема для запиту розрахунку ціни
 */
export const priceCalculationRequestSchema = z
  .object({
    categoryCode: z.string().min(1, 'Код категорії не може бути порожнім'),
    itemName: z.string().min(1, 'Назва предмета не може бути порожньою'),
    quantity: z
      .number()
      .min(0.01, 'Кількість повинна бути більше 0')
      .max(1000, 'Кількість занадто велика'),
    color: z.string().max(100, 'Назва кольору занадто довга').optional(),
    selectedModifiers: z.array(z.string()).default([]),
    stains: z.array(z.string()).default([]),
    defects: z.array(z.string()).default([]),
    isUrgent: z.boolean().default(false),
    urgencyLevel: z.number().min(0).max(100).optional(),
    discountType: z.string().max(50, 'Тип знижки занадто довгий').optional(),
    discountValue: z.number().min(0).max(100).optional(),
  })
  .refine((data) => !data.isUrgent || data.urgencyLevel !== undefined, {
    message: 'Для термінового замовлення потрібно вказати рівень терміновості',
    path: ['urgencyLevel'],
  })
  .refine(
    (data) =>
      (!data.discountType || data.discountValue !== undefined) &&
      (data.discountValue === undefined || data.discountType),
    {
      message: 'Тип знижки та її значення повинні бути вказані разом',
      path: ['discountType', 'discountValue'],
    }
  );

/**
 * Схема для деталей розрахунку
 */
export const calculationDetailsSchema = z.object({
  baseCalculation: z.string(),
  appliedModifiers: z.array(z.string()),
  urgencyDetails: z.string().optional(),
  discountDetails: z.string().optional(),
  warnings: z.array(z.string()),
});

/**
 * Схема для відповіді розрахунку ціни
 */
export const priceCalculationResponseSchema = z.object({
  basePrice: z.number().min(0, "Базова ціна не може бути від'ємною"),
  modifiersAmount: z.number(),
  urgencyAmount: z.number().min(0, "Надбавка за терміновість не може бути від'ємною"),
  subtotal: z.number().min(0, "Проміжна сума не може бути від'ємною"),
  discountAmount: z.number().min(0, "Сума знижки не може бути від'ємною"),
  finalAmount: z.number().min(0, "Фінальна сума не може бути від'ємною"),
  calculationDetails: calculationDetailsSchema,
});

// ============= СХЕМИ ДЛЯ СТАНУ ДОМЕНУ =============

/**
 * Схема для стану прайс-листа
 */
export const priceListStateSchema = z.object({
  items: z.record(z.string(), z.array(priceListItemSchema)),
  categories: z.array(serviceCategorySchema),
  modifiers: z.record(z.nativeEnum(ModifierCategory), z.array(priceModifierSchema)),
  stainTypes: z.array(stainTypeSchema),
  defectTypes: z.array(defectTypeSchema),
  isLoading: z.boolean(),
  lastUpdated: z.date().optional(),
  errors: z.record(z.string(), z.string()),
});

/**
 * Схема для стану розрахунку ціни
 */
export const priceCalculationStateSchema = z.object({
  currentRequest: priceCalculationRequestSchema.optional(),
  currentResponse: priceCalculationResponseSchema.optional(),
  isCalculating: z.boolean(),
  calculationHistory: z.array(priceCalculationResponseSchema),
  errors: z.record(z.string(), z.string()),
});

// ============= СХЕМИ ДЛЯ ПОШУКУ ТА ФІЛЬТРАЦІЇ =============

/**
 * Схема для параметрів пошуку модифікаторів
 */
export const modifierSearchParamsSchema = z.object({
  query: z.string().max(255, 'Пошуковий запит занадто довгий').optional(),
  category: z.nativeEnum(ModifierCategory).optional(),
  active: z.boolean().optional(),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().max(50, 'Поле сортування занадто довге').default('name'),
  sortDirection: z.enum(['ASC', 'DESC']).default('ASC'),
});

/**
 * Схема для параметрів отримання рекомендацій
 */
export const recommendationParamsSchema = z.object({
  stains: z.array(z.string()).optional(),
  defects: z.array(z.string()).optional(),
  categoryCode: z.string().optional(),
  materialType: z.string().max(100, 'Тип матеріалу занадто довгий').optional(),
});

/**
 * Схема для результату валідації
 */
export const validationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.string()),
  warnings: z.array(z.string()),
});

// ============= ЕКСПОРТ ТИПІВ =============

export type PriceListItemInput = z.input<typeof priceListItemSchema>;
export type PriceListItemOutput = z.output<typeof priceListItemSchema>;

export type ServiceCategoryInput = z.input<typeof serviceCategorySchema>;
export type ServiceCategoryOutput = z.output<typeof serviceCategorySchema>;

export type PriceModifierInput = z.input<typeof priceModifierSchema>;
export type PriceModifierOutput = z.output<typeof priceModifierSchema>;

export type StainTypeInput = z.input<typeof stainTypeSchema>;
export type StainTypeOutput = z.output<typeof stainTypeSchema>;

export type DefectTypeInput = z.input<typeof defectTypeSchema>;
export type DefectTypeOutput = z.output<typeof defectTypeSchema>;

export type PriceCalculationRequestInput = z.input<typeof priceCalculationRequestSchema>;
export type PriceCalculationRequestOutput = z.output<typeof priceCalculationRequestSchema>;

export type PriceCalculationResponseInput = z.input<typeof priceCalculationResponseSchema>;
export type PriceCalculationResponseOutput = z.output<typeof priceCalculationResponseSchema>;

export type ModifierSearchParamsInput = z.input<typeof modifierSearchParamsSchema>;
export type ModifierSearchParamsOutput = z.output<typeof modifierSearchParamsSchema>;

export type RecommendationParamsInput = z.input<typeof recommendationParamsSchema>;
export type RecommendationParamsOutput = z.output<typeof recommendationParamsSchema>;

export type ValidationResultInput = z.input<typeof validationResultSchema>;
export type ValidationResultOutput = z.output<typeof validationResultSchema>;
