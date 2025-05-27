/**
 * @fileoverview Zod схеми для полів предметів в Order Wizard
 * @module domain/wizard/schemas/wizard-item-fields
 */

import { z } from 'zod';

// ================================
// Базові схеми для полів предметів
// ================================

/**
 * Схема для ID предмета
 */
export const wizardItemIdSchema = z.string().min(1, 'ID предмета не може бути порожнім');

/**
 * Схема для категорії послуги
 */
export const wizardItemCategorySchema = z
  .string()
  .min(1, "Категорія послуги обов'язкова")
  .max(100, 'Категорія послуги не може перевищувати 100 символів');

/**
 * Схема для найменування предмета
 */
export const wizardItemNameSchema = z
  .string()
  .min(1, "Найменування предмета обов'язкове")
  .max(200, 'Найменування предмета не може перевищувати 200 символів');

/**
 * Схема для кількості предметів
 */
export const wizardItemQuantitySchema = z
  .number()
  .positive('Кількість повинна бути додатним числом')
  .max(999, 'Кількість не може перевищувати 999');

/**
 * Схема для одиниці виміру
 */
export const wizardItemUnitSchema = z.enum(['шт', 'кг'], {
  errorMap: () => ({ message: "Одиниця виміру може бути тільки 'шт' або 'кг'" }),
});

/**
 * Схема для матеріалу
 */
export const wizardItemMaterialSchema = z.enum(
  ['Бавовна', 'Шерсть', 'Шовк', 'Синтетика', 'Гладка шкіра', 'Нубук', 'Спілок', 'Замша'],
  {
    errorMap: () => ({ message: 'Невірний тип матеріалу' }),
  }
);

/**
 * Схема для кольору
 */
export const wizardItemColorSchema = z
  .string()
  .min(1, "Колір обов'язковий")
  .max(50, 'Колір не може перевищувати 50 символів');

/**
 * Схема для наповнювача
 */
export const wizardItemFillerTypeSchema = z
  .enum(['Пух', 'Синтепон', 'Інше'], {
    errorMap: () => ({ message: 'Невірний тип наповнювача' }),
  })
  .optional();

/**
 * Схема для стану наповнювача (збитий чи ні)
 */
export const wizardItemFillerCompressedSchema = z.boolean().optional();

/**
 * Схема для ступеня зносу
 */
export const wizardItemWearDegreeSchema = z.enum(['10%', '30%', '50%', '75%'], {
  errorMap: () => ({ message: 'Ступінь зносу може бути тільки 10%, 30%, 50% або 75%' }),
});

/**
 * Схема для плям
 */
export const wizardItemStainsSchema = z
  .array(z.enum(['Жир', 'Кров', 'Білок', 'Вино', 'Кава', 'Трава', 'Чорнило', 'Косметика', 'Інше']))
  .optional();

/**
 * Схема для дефектів
 */
export const wizardItemDefectsSchema = z
  .array(z.enum(['Потертості', 'Порване', 'Відсутність фурнітури', 'Пошкодження фурнітури']))
  .optional();

/**
 * Схема для ризиків
 */
export const wizardItemRisksSchema = z
  .array(z.enum(['Ризики зміни кольору', 'Ризики деформації', 'Без гарантій']))
  .optional();

/**
 * Схема для базової ціни
 */
export const wizardItemBasePriceSchema = z
  .number()
  .min(0, "Базова ціна не може бути від'ємною")
  .max(999999.99, 'Базова ціна не може перевищувати 999999.99');

/**
 * Схема для фінальної ціни
 */
export const wizardItemFinalPriceSchema = z
  .number()
  .min(0, "Фінальна ціна не може бути від'ємною")
  .max(999999.99, 'Фінальна ціна не може перевищувати 999999.99');

/**
 * Схема для приміток
 */
export const wizardItemNotesSchema = z
  .string()
  .max(500, 'Примітки не можуть перевищувати 500 символів')
  .optional();

/**
 * Схема для фотографій предмета
 */
export const wizardItemPhotosSchema = z
  .array(z.string().url('Невірний URL фотографії'))
  .max(5, 'Максимум 5 фотографій на предмет')
  .optional();

// ================================
// Комплексні схеми для предметів
// ================================

/**
 * Базова схема предмета замовлення
 */
export const wizardOrderItemSchema = z.object({
  id: wizardItemIdSchema.optional(),
  categoryName: wizardItemCategorySchema,
  itemName: wizardItemNameSchema,
  quantity: wizardItemQuantitySchema,
  unit: wizardItemUnitSchema,
  basePrice: wizardItemBasePriceSchema,
  finalPrice: wizardItemFinalPriceSchema,
  material: wizardItemMaterialSchema.optional(),
  color: wizardItemColorSchema.optional(),
  notes: wizardItemNotesSchema,
});

/**
 * Схема для створення нового предмета
 */
export const wizardOrderItemCreateSchema = wizardOrderItemSchema.omit({
  id: true,
  basePrice: true,
  finalPrice: true,
});

/**
 * Схема для оновлення предмета
 */
export const wizardOrderItemUpdateSchema = wizardOrderItemSchema.partial();

/**
 * Детальна схема предмета з усіма характеристиками
 */
export const wizardOrderItemDetailedSchema = wizardOrderItemSchema.extend({
  fillerType: wizardItemFillerTypeSchema,
  fillerCompressed: wizardItemFillerCompressedSchema,
  wearDegree: wizardItemWearDegreeSchema.optional(),
  stains: wizardItemStainsSchema,
  defects: wizardItemDefectsSchema,
  risks: wizardItemRisksSchema,
  photos: wizardItemPhotosSchema,
});

/**
 * Схема для фільтрації предметів
 */
export const wizardOrderItemFiltersSchema = z.object({
  categoryName: z.string().optional(),
  material: wizardItemMaterialSchema.optional(),
  color: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  searchTerm: z.string().optional(),
});

// ================================
// Типи на основі схем
// ================================

export type WizardOrderItem = z.infer<typeof wizardOrderItemSchema>;
export type WizardOrderItemCreate = z.infer<typeof wizardOrderItemCreateSchema>;
export type WizardOrderItemUpdate = z.infer<typeof wizardOrderItemUpdateSchema>;
export type WizardOrderItemDetailed = z.infer<typeof wizardOrderItemDetailedSchema>;
export type WizardOrderItemFilters = z.infer<typeof wizardOrderItemFiltersSchema>;

// Експорт окремих полів для повторного використання
export type WizardItemCategory = z.infer<typeof wizardItemCategorySchema>;
export type WizardItemMaterial = z.infer<typeof wizardItemMaterialSchema>;
export type WizardItemUnit = z.infer<typeof wizardItemUnitSchema>;
export type WizardItemFillerType = z.infer<typeof wizardItemFillerTypeSchema>;
export type WizardItemWearDegree = z.infer<typeof wizardItemWearDegreeSchema>;
