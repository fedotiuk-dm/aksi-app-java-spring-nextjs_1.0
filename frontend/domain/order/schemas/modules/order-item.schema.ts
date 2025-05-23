/**
 * Zod схеми для модуля OrderItem
 */

import { z } from 'zod';

// === КОНСТАНТИ ===
const ERROR_MESSAGES = {
  DESCRIPTION_MAX_LENGTH: 'Опис не може перевищувати 500 символів',
} as const;

/**
 * Схема для матеріалів
 */
export const materialSchema = z.nativeEnum({
  COTTON: 'COTTON',
  WOOL: 'WOOL',
  SILK: 'SILK',
  SYNTHETIC: 'SYNTHETIC',
  LEATHER: 'LEATHER',
  NUBUCK: 'NUBUCK',
  SUEDE: 'SUEDE',
  SPLIT_LEATHER: 'SPLIT_LEATHER',
} as const);

/**
 * Схема для типів наповнювача
 */
export const fillerTypeSchema = z.nativeEnum({
  DOWN: 'DOWN',
  SYNTHETIC: 'SYNTHETIC',
  OTHER: 'OTHER',
} as const);

/**
 * Схема для ступеня зносу
 */
export const wearDegreeSchema = z.nativeEnum({
  PERCENT_10: '10%',
  PERCENT_30: '30%',
  PERCENT_50: '50%',
  PERCENT_75: '75%',
} as const);

/**
 * Схема для створення предмета замовлення
 */
export const createOrderItemSchema = z
  .object({
    orderId: z.string().optional(),
    name: z.string().min(1, "Назва предмета обов'язкова"),
    description: z.string().max(500, ERROR_MESSAGES.DESCRIPTION_MAX_LENGTH).optional(),
    quantity: z.number().min(1, 'Кількість повинна бути більше 0'),
    unitPrice: z.number().min(0, "Ціна не може бути від'ємною"),
    category: z.string().optional(),
    color: z.string().max(100, 'Колір не може перевищувати 100 символів').optional(),
    material: materialSchema.optional(),
    unitOfMeasure: z.string().max(50, 'Одиниця виміру не може перевищувати 50 символів').optional(),
    defects: z.string().max(1000, 'Опис дефектів не може перевищувати 1000 символів').optional(),
    specialInstructions: z
      .string()
      .max(1000, 'Спеціальні інструкції не можуть перевищувати 1000 символів')
      .optional(),
    fillerType: fillerTypeSchema.optional(),
    fillerCompressed: z.boolean().optional(),
    wearDegree: wearDegreeSchema.optional(),
    stains: z.string().max(1000, 'Опис плям не може перевищувати 1000 символів').optional(),
    otherStains: z.string().max(500, 'Інші плями не можуть перевищувати 500 символів').optional(),
    defectsAndRisks: z
      .string()
      .max(1000, 'Дефекти та ризики не можуть перевищувати 1000 символів')
      .optional(),
    noGuaranteeReason: z
      .string()
      .max(500, "Причина 'без гарантій' не може перевищувати 500 символів")
      .optional(),
    defectsNotes: z
      .string()
      .max(1000, 'Примітки до дефектів не можуть перевищувати 1000 символів')
      .optional(),
  })
  .refine((data) => data.noGuaranteeReason === undefined || data.noGuaranteeReason.trim() !== '', {
    message: "Якщо обрано 'без гарантій', причина обов'язкова",
    path: ['noGuaranteeReason'],
  })
  .refine((data) => data.unitPrice <= 100000, {
    message: 'Ціна здається занадто високою',
    path: ['unitPrice'],
  })
  .refine((data) => data.quantity <= 1000, {
    message: 'Кількість здається занадто великою',
    path: ['quantity'],
  });

/**
 * Схема для оновлення предмета замовлення
 */
export const updateOrderItemSchema = z.object({
  id: z.string().min(1, "ID предмета обов'язковий"),
  orderId: z.string().optional(),
  name: z.string().min(1, "Назва предмета обов'язкова"),
  description: z.string().max(500, ERROR_MESSAGES.DESCRIPTION_MAX_LENGTH).optional(),
  quantity: z.number().min(1, 'Кількість повинна бути більше 0'),
  unitPrice: z.number().min(0, "Ціна не може бути від'ємною"),
  totalPrice: z.number().min(0).optional(),
  calculatedPrice: z.number().min(0).optional(),
  discountApplied: z.number().min(0).optional(),
  isComplete: z.boolean().optional(),
  category: z.string().optional(),
  color: z.string().max(100, 'Колір не може перевищувати 100 символів').optional(),
  material: materialSchema.optional(),
  unitOfMeasure: z.string().max(50, 'Одиниця виміру не може перевищувати 50 символів').optional(),
  defects: z.string().max(1000, 'Опис дефектів не може перевищувати 1000 символів').optional(),
  specialInstructions: z
    .string()
    .max(1000, 'Спеціальні інструкції не можуть перевищувати 1000 символів')
    .optional(),
  fillerType: fillerTypeSchema.optional(),
  fillerCompressed: z.boolean().optional(),
  wearDegree: wearDegreeSchema.optional(),
  stains: z.string().max(1000, 'Опис плям не може перевищувати 1000 символів').optional(),
  otherStains: z.string().max(500, 'Інші плями не можуть перевищувати 500 символів').optional(),
  defectsAndRisks: z
    .string()
    .max(1000, 'Дефекти та ризики не можуть перевищувати 1000 символів')
    .optional(),
  noGuaranteeReason: z
    .string()
    .max(500, "Причина 'без гарантій' не може перевищувати 500 символів")
    .optional(),
  defectsNotes: z
    .string()
    .max(1000, 'Примітки до дефектів не можуть перевищувати 1000 символів')
    .optional(),
});

/**
 * Схема для модифікатора ціни
 */
export const orderItemModifierSchema = z
  .object({
    id: z.string().optional(),
    orderItemId: z.string().optional(),
    name: z.string().min(1, "Назва модифікатора обов'язкова"),
    type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT'], {
      errorMap: () => ({ message: 'Тип повинен бути PERCENTAGE або FIXED_AMOUNT' }),
    }),
    value: z.number().min(0, "Значення не може бути від'ємним"),
    description: z.string().max(500, ERROR_MESSAGES.DESCRIPTION_MAX_LENGTH).optional(),
    applied: z.boolean(),
  })
  .refine((data) => data.type !== 'PERCENTAGE' || data.value <= 1000, {
    message: 'Відсотковий модифікатор не може перевищувати 1000%',
    path: ['value'],
  })
  .refine((data) => data.type !== 'FIXED_AMOUNT' || data.value <= 50000, {
    message: 'Фіксована сума здається занадто великою',
    path: ['value'],
  });

/**
 * Схема для характеристик предмета
 */
export const orderItemCharacteristicsSchema = z.object({
  material: materialSchema.optional(),
  color: z.string().optional(),
  fillerType: fillerTypeSchema.optional(),
  fillerCompressed: z.boolean().optional(),
  wearDegree: wearDegreeSchema.optional(),
  childSized: z.boolean().optional(),
  manualCleaning: z.boolean().optional(),
  heavilySoiled: z.boolean().optional(),
  heavilySoiledPercentage: z.number().min(0).max(100).optional(),
  noWarranty: z.boolean().optional(),
  noWarrantyReason: z.string().optional(),
});

/**
 * Схема для пошуку предметів
 */
export const orderItemSearchSchema = z
  .object({
    orderId: z.string().optional(),
    category: z.string().optional(),
    material: materialSchema.optional(),
    hasDefects: z.boolean().optional(),
    hasStains: z.boolean().optional(),
    priceRange: z.tuple([z.number().min(0), z.number().min(0)]).optional(),
    keyword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.priceRange) {
        const [min, max] = data.priceRange;
        return min <= max;
      }
      return true;
    },
    {
      message: 'Мінімальна ціна не може бути більшою за максимальну',
      path: ['priceRange'],
    }
  );

// === ЕКСПОРТ ТИПІВ ===
export type CreateOrderItemFormData = z.infer<typeof createOrderItemSchema>;
export type UpdateOrderItemFormData = z.infer<typeof updateOrderItemSchema>;
export type OrderItemModifierFormData = z.infer<typeof orderItemModifierSchema>;
export type OrderItemCharacteristicsFormData = z.infer<typeof orderItemCharacteristicsSchema>;
export type OrderItemSearchParams = z.infer<typeof orderItemSearchSchema>;
