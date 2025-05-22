import { z } from 'zod';

import {
  nonEmptyString,
  uuidSchema,
  positiveNumber,
  priceNumber,
  shortText,
  longText,
} from '../../shared/schemas/common.schema';

/**
 * Схема для базових характеристик предмета замовлення
 */
export const orderItemBaseSchema = z.object({
  name: nonEmptyString.min(2, 'Назва предмета повинна містити мінімум 2 символи'),
  description: longText.optional(),
  quantity: positiveNumber.int('Кількість повинна бути цілим числом'),
  unitPrice: priceNumber,
  category: shortText.optional(),
  color: shortText.optional(),
  material: shortText.optional(),
  unitOfMeasure: z.string().optional(),
});

/**
 * Схема для дефектів та специфічних інструкцій предмета замовлення
 */
export const orderItemDefectsSchema = z.object({
  defects: longText.optional(),
  specialInstructions: longText.optional(),
  stains: longText.optional(),
  otherStains: longText.optional(),
  defectsAndRisks: longText.optional(),
  noGuaranteeReason: longText.optional(),
  defectsNotes: longText.optional(),
});

/**
 * Схема для характеристик наповнювача
 */
export const orderItemFillerSchema = z.object({
  fillerType: shortText.optional(),
  fillerCompressed: z.boolean().default(false),
  wearDegree: shortText.optional(),
});

/**
 * Повна схема для предмета замовлення
 */
export const orderItemSchema = orderItemBaseSchema
  .merge(orderItemDefectsSchema)
  .merge(orderItemFillerSchema)
  .extend({
    id: uuidSchema.optional(),
    orderId: uuidSchema.optional(),
    totalPrice: priceNumber.optional(),
  });

/**
 * Схема форми для кроку основної інформації предмета
 */
export const orderItemBasicFormSchema = orderItemBaseSchema;

/**
 * Схема форми для кроку дефектів та ризиків предмета
 */
export const orderItemDefectsFormSchema = orderItemDefectsSchema;

/**
 * Схема форми для кроку наповнювача предмета
 */
export const orderItemFillerFormSchema = orderItemFillerSchema;

/**
 * Схема для списку предметів замовлення
 */
export const orderItemsListSchema = z.array(orderItemSchema);

/**
 * Типи даних на основі схем
 */
export type OrderItemBase = z.infer<typeof orderItemBaseSchema>;
export type OrderItemDefects = z.infer<typeof orderItemDefectsSchema>;
export type OrderItemFiller = z.infer<typeof orderItemFillerSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type OrderItemBasicForm = z.infer<typeof orderItemBasicFormSchema>;
export type OrderItemDefectsForm = z.infer<typeof orderItemDefectsFormSchema>;
export type OrderItemFillerForm = z.infer<typeof orderItemFillerFormSchema>;
export type OrderItemsList = z.infer<typeof orderItemsListSchema>;
