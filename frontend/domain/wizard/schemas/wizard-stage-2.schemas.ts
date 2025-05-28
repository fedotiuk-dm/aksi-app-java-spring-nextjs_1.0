/**
 * @fileoverview Схеми валідації для Stage 2: Менеджер предметів (циклічний процес)
 * @module domain/wizard/schemas
 */

import { z } from 'zod';

// === КОНСТАНТИ ===

/**
 * Обмеження для валідації
 */
const LIMITS = {
  MIN_QUANTITY: 0.1,
  MAX_QUANTITY: 999,
  MIN_PRICE: 0,
  MAX_PRICE: 99999,
  MAX_PHOTOS: 5,
  MAX_PHOTO_SIZE_MB: 5,
  MIN_COLOR_LENGTH: 1,
  MAX_COLOR_LENGTH: 50,
  MAX_NOTES_LENGTH: 500,
  MAX_STAINS: 10,
  MAX_DEFECTS: 10,
} as const;

/**
 * Повідомлення про помилки
 */
const VALIDATION_MESSAGES = {
  CATEGORY_REQUIRED: 'Оберіть категорію',
  ITEM_NAME_REQUIRED: 'Оберіть найменування',
  QUANTITY_MIN: `Кількість від ${LIMITS.MIN_QUANTITY}`,
  QUANTITY_MAX: `Кількість максимум ${LIMITS.MAX_QUANTITY}`,
  UNIT_REQUIRED: 'Оберіть одиницю виміру',
  MATERIAL_REQUIRED: 'Оберіть матеріал',
  COLOR_REQUIRED: 'Введіть колір',
  COLOR_TOO_LONG: `Колір максимум ${LIMITS.MAX_COLOR_LENGTH} символів`,
  PHOTO_SIZE_LIMIT: `Розмір файлу максимум ${LIMITS.MAX_PHOTO_SIZE_MB}MB`,
  PHOTO_COUNT_LIMIT: `Максимум ${LIMITS.MAX_PHOTOS} фото`,
  PHOTO_TYPE_INVALID: 'Тільки зображення дозволені',
  NOTES_TOO_LONG: `Примітки максимум ${LIMITS.MAX_NOTES_LENGTH} символів`,
  PRICE_NEGATIVE: "Ціна не може бути від'ємною",
  ITEMS_MIN: 'Потрібен хоча б один предмет',
} as const;

// === ENUMS ===

/**
 * Одиниці виміру предметів
 */
export const unitTypeEnum = z.enum(['piece', 'kg']);

/**
 * Рівні зносу предметів
 */
export const wearLevelEnum = z.enum(['10', '30', '50', '75']);

/**
 * Типи наповнювачів
 */
export const fillerTypeEnum = z.enum(['пух', 'синтепон', 'інше']);

// === ПІДЕТАП 2.0: МЕНЕДЖЕР ПРЕДМЕТІВ ===

/**
 * Схема для мінімального предмета в списку
 */
export const itemListItemSchema = z.object({
  id: z.string().optional(),
  categoryName: z.string().min(1, VALIDATION_MESSAGES.CATEGORY_REQUIRED),
  itemName: z.string().min(1, VALIDATION_MESSAGES.ITEM_NAME_REQUIRED),
  quantity: z.number().min(LIMITS.MIN_QUANTITY, VALIDATION_MESSAGES.QUANTITY_MIN),
  finalPrice: z.number().min(LIMITS.MIN_PRICE, VALIDATION_MESSAGES.PRICE_NEGATIVE),
});

/**
 * Схема для списку предметів
 */
export const itemListSchema = z.object({
  items: z.array(itemListItemSchema).min(1, VALIDATION_MESSAGES.ITEMS_MIN),
});

/**
 * Схема для підсумку замовлення
 */
export const itemSummarySchema = z.object({
  totalItems: z.number().min(0),
  totalPrice: z.number().min(0),
  averagePrice: z.number().min(0),
  canProceed: z.boolean(),
});

// === ПІДЕТАП 2.1: ОСНОВНА ІНФОРМАЦІЯ ===

/**
 * Схема для основної інформації про предмет
 */
export const basicItemInfoSchema = z.object({
  categoryCode: z.string().min(1, VALIDATION_MESSAGES.CATEGORY_REQUIRED),
  itemName: z.string().min(1, VALIDATION_MESSAGES.ITEM_NAME_REQUIRED),
  quantity: z
    .number()
    .min(LIMITS.MIN_QUANTITY, VALIDATION_MESSAGES.QUANTITY_MIN)
    .max(LIMITS.MAX_QUANTITY, VALIDATION_MESSAGES.QUANTITY_MAX),
  unitType: unitTypeEnum.refine(() => true, { message: VALIDATION_MESSAGES.UNIT_REQUIRED }),
});

/**
 * Схема для валідації категорії
 */
export const categorySelectionSchema = z.object({
  categoryCode: z.string().min(1, VALIDATION_MESSAGES.CATEGORY_REQUIRED),
});

/**
 * Схема для валідації найменування
 */
export const itemNameSelectionSchema = z.object({
  itemName: z.string().min(1, VALIDATION_MESSAGES.ITEM_NAME_REQUIRED),
  categoryCode: z.string().min(1, VALIDATION_MESSAGES.CATEGORY_REQUIRED),
});

// === ПІДЕТАП 2.2: ХАРАКТЕРИСТИКИ ===

/**
 * Схема для характеристик предмета
 */
export const itemCharacteristicsSchema = z.object({
  material: z.string().min(1, VALIDATION_MESSAGES.MATERIAL_REQUIRED),
  color: z
    .string()
    .min(LIMITS.MIN_COLOR_LENGTH, VALIDATION_MESSAGES.COLOR_REQUIRED)
    .max(LIMITS.MAX_COLOR_LENGTH, VALIDATION_MESSAGES.COLOR_TOO_LONG),
  filling: fillerTypeEnum.optional(),
  customFilling: z.string().optional(),
  isFillingDamaged: z.boolean().optional(),
  wearLevel: wearLevelEnum.optional(),
});

/**
 * Схема для валідації матеріалу
 */
export const materialSelectionSchema = z.object({
  material: z.string().min(1, VALIDATION_MESSAGES.MATERIAL_REQUIRED),
  categoryCode: z.string().optional(),
});

/**
 * Схема для кольору
 */
export const colorInputSchema = z.object({
  color: z
    .string()
    .min(LIMITS.MIN_COLOR_LENGTH, VALIDATION_MESSAGES.COLOR_REQUIRED)
    .max(LIMITS.MAX_COLOR_LENGTH, VALIDATION_MESSAGES.COLOR_TOO_LONG),
  isCustomColor: z.boolean().optional(),
});

// === ПІДЕТАП 2.3: ДЕФЕКТИ ТА ПЛЯМИ ===

/**
 * Схема для дефектів та плям
 */
export const defectsStainsSchema = z.object({
  stains: z.array(z.string()).max(LIMITS.MAX_STAINS).optional(),
  defects: z.array(z.string()).max(LIMITS.MAX_DEFECTS).optional(),
  defectNotes: z
    .string()
    .max(LIMITS.MAX_NOTES_LENGTH, VALIDATION_MESSAGES.NOTES_TOO_LONG)
    .optional(),
  noWarranty: z.boolean().optional(),
  noWarrantyReason: z.string().optional(),
});

/**
 * Схема для валідації плям
 */
export const stainsSelectionSchema = z.object({
  stains: z.array(z.string()).max(LIMITS.MAX_STAINS),
  customStain: z.string().optional(),
});

/**
 * Схема для валідації дефектів
 */
export const defectsSelectionSchema = z.object({
  defects: z.array(z.string()).max(LIMITS.MAX_DEFECTS),
  customDefect: z.string().optional(),
});

// === ПІДЕТАП 2.4: РОЗРАХУНОК ЦІНИ ===

/**
 * Схема для запиту розрахунку ціни
 */
export const priceCalculationRequestSchema = z.object({
  categoryCode: z.string().min(1),
  itemName: z.string().min(1),
  quantity: z.number().min(LIMITS.MIN_QUANTITY),
  color: z.string().optional(),
  material: z.string().optional(),
  modifierCodes: z.array(z.string()).optional(),
  expedited: z.boolean().optional(),
  expeditePercent: z.number().min(0).max(100).optional(),
  discountPercent: z.number().min(0).max(100).optional(),
});

/**
 * Схема для деталі розрахунку
 */
export const calculationDetailSchema = z.object({
  step: z.string(),
  description: z.string(),
  baseAmount: z.number(),
  modifier: z.number().optional(),
  resultAmount: z.number(),
});

/**
 * Схема для результату розрахунку ціни
 */
export const priceCalculationResultSchema = z.object({
  basePrice: z.number().min(0),
  totalModifiers: z.number(),
  expediteCharge: z.number().min(0),
  discountAmount: z.number().min(0),
  finalPrice: z.number().min(0),
  details: z.array(calculationDetailSchema),
});

/**
 * Схема для модифікатора ціни
 */
export const priceModifierSchema = z.object({
  code: z.string(),
  name: z.string(),
  type: z.enum(['percentage', 'fixed']),
  value: z.number(),
  applicable: z.boolean(),
  description: z.string().optional(),
});

// === ПІДЕТАП 2.5: ФОТОДОКУМЕНТАЦІЯ ===

/**
 * Схема для валідації одного фото файлу
 */
export const photoFileSchema = z.object({
  file: z.instanceof(File),
  size: z
    .number()
    .max(LIMITS.MAX_PHOTO_SIZE_MB * 1024 * 1024, VALIDATION_MESSAGES.PHOTO_SIZE_LIMIT),
  type: z
    .string()
    .refine((type) => type.startsWith('image/'), VALIDATION_MESSAGES.PHOTO_TYPE_INVALID),
});

/**
 * Схема для списку фото
 */
export const photoListSchema = z
  .array(photoFileSchema)
  .max(LIMITS.MAX_PHOTOS, VALIDATION_MESSAGES.PHOTO_COUNT_LIMIT);

/**
 * Схема для завантаження фото
 */
export const photoUploadSchema = z.object({
  orderItemId: z.string().min(1),
  files: photoListSchema,
  notes: z.string().max(LIMITS.MAX_NOTES_LENGTH).optional(),
});

/**
 * Схема для результату завантаження фото
 */
export const photoUploadResultSchema = z.object({
  success: z.boolean(),
  photoId: z.string().optional(),
  url: z.string().optional(),
  error: z.string().optional(),
});

// === КОМПОЗИТНІ СХЕМИ ===

/**
 * Повна схема для предмета (всі підетапи)
 */
export const completeItemSchema = z.object({
  basicInfo: basicItemInfoSchema,
  characteristics: itemCharacteristicsSchema,
  defectsStains: defectsStainsSchema,
  priceCalculation: priceCalculationResultSchema,
  photos: z.array(z.string()).optional(), // ID фотографій
});

/**
 * Схема для завершення Stage 2
 */
export const stage2CompletionSchema = z.object({
  items: z.array(completeItemSchema).min(1, VALIDATION_MESSAGES.ITEMS_MIN),
  summary: itemSummarySchema,
});

// === ТИПИ ЗГЕНЕРОВАНІ З ZOD СХЕМ ===

// Основні типи
export type UnitType = z.infer<typeof unitTypeEnum>;
export type WearLevel = z.infer<typeof wearLevelEnum>;
export type FillerType = z.infer<typeof fillerTypeEnum>;

// Підетап 2.0
export type ItemListItem = z.infer<typeof itemListItemSchema>;
export type ItemList = z.infer<typeof itemListSchema>;
export type ItemSummary = z.infer<typeof itemSummarySchema>;

// Підетап 2.1
export type BasicItemInfo = z.infer<typeof basicItemInfoSchema>;
export type CategorySelection = z.infer<typeof categorySelectionSchema>;
export type ItemNameSelection = z.infer<typeof itemNameSelectionSchema>;

// Підетап 2.2
export type ItemCharacteristics = z.infer<typeof itemCharacteristicsSchema>;
export type MaterialSelection = z.infer<typeof materialSelectionSchema>;
export type ColorInput = z.infer<typeof colorInputSchema>;

// Підетап 2.3
export type DefectsStains = z.infer<typeof defectsStainsSchema>;
export type StainsSelection = z.infer<typeof stainsSelectionSchema>;
export type DefectsSelection = z.infer<typeof defectsSelectionSchema>;

// Підетап 2.4
export type PriceCalculationRequest = z.infer<typeof priceCalculationRequestSchema>;
export type CalculationDetail = z.infer<typeof calculationDetailSchema>;
export type PriceCalculationResult = z.infer<typeof priceCalculationResultSchema>;
export type PriceModifier = z.infer<typeof priceModifierSchema>;

// Підетап 2.5
export type PhotoFile = z.infer<typeof photoFileSchema>;
export type PhotoList = z.infer<typeof photoListSchema>;
export type PhotoUpload = z.infer<typeof photoUploadSchema>;
export type PhotoUploadResult = z.infer<typeof photoUploadResultSchema>;

// Композитні типи
export type CompleteItem = z.infer<typeof completeItemSchema>;
export type Stage2Completion = z.infer<typeof stage2CompletionSchema>;
