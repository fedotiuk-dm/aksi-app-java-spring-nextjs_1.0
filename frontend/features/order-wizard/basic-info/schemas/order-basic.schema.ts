import { z } from 'zod';

import {
  nonEmptyString,
  uuidSchema,
  dateSchema,
  shortText,
  longText,
} from '../../shared/schemas/common.schema';

/**
 * Схема для статусу замовлення
 */
export const orderStatusSchema = z.enum(
  ['DRAFT', 'NEW', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELLED'],
  {
    errorMap: () => ({ message: 'Виберіть статус замовлення' }),
  }
);

/**
 * Схема для типу терміновості замовлення
 */
export const expediteTypeSchema = z.enum(['STANDARD', 'EXPRESS_48H', 'EXPRESS_24H'], {
  errorMap: () => ({ message: 'Виберіть тип терміновості' }),
});

/**
 * Базова схема для основної інформації замовлення
 */
export const orderBasicSchema = z.object({
  // Обов'язкові поля
  receiptNumber: nonEmptyString.min(3, 'Номер квитанції повинен містити мінімум 3 символи'),
  tagNumber: z.string().optional(),
  expectedCompletionDate: dateSchema,
  expediteType: expediteTypeSchema,
  express: z.boolean().default(false),

  // Необов'язкові поля
  customerNotes: longText.optional(),
  internalNotes: longText.optional(),
  termsAccepted: z.boolean().default(false),

  // Приховані системні поля (для повної сумісності з API)
  clientId: uuidSchema,
  branchLocationId: uuidSchema,
  status: orderStatusSchema.default('DRAFT'),
});

/**
 * Схема для форми основної інформації замовлення
 * Містить тільки поля, які видимі користувачу під час заповнення
 */
export const orderBasicFormSchema = z.object({
  receiptNumber: orderBasicSchema.shape.receiptNumber,
  tagNumber: orderBasicSchema.shape.tagNumber,
  expectedCompletionDate: orderBasicSchema.shape.expectedCompletionDate,
  expediteType: orderBasicSchema.shape.expediteType,
  express: orderBasicSchema.shape.express,
  customerNotes: orderBasicSchema.shape.customerNotes,
  internalNotes: orderBasicSchema.shape.internalNotes,
  termsAccepted: orderBasicSchema.shape.termsAccepted,
});

/**
 * Типи даних на основі схем
 */
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type ExpediteType = z.infer<typeof expediteTypeSchema>;
export type OrderBasic = z.infer<typeof orderBasicSchema>;
export type OrderBasicForm = z.infer<typeof orderBasicFormSchema>;
