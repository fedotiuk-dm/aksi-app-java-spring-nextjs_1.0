import { z } from 'zod';

import { dateSchema, longText, priceNumber } from '@features/order-wizard/shared';

/**
 * Схема для параметрів замовлення
 */
export const orderParametersSchema = z.object({
  expectedCompletionDate: dateSchema,
  customerNotes: longText.optional(),
  internalNotes: longText.optional(),
  totalAmount: priceNumber.optional(),
  discountAmount: priceNumber.optional(),
  finalAmount: priceNumber.optional(),
  prepaymentAmount: priceNumber.optional(),
  balanceAmount: priceNumber.optional(),
  express: z.boolean().default(false),
  expediteType: z.enum(['STANDARD', 'EXPRESS_48H', 'EXPRESS_24H'], {
    errorMap: () => ({ message: 'Виберіть тип терміновості' })
  })
});

/**
 * Схема форми для параметрів замовлення
 */
export const orderParametersFormSchema = z.object({
  expectedCompletionDate: orderParametersSchema.shape.expectedCompletionDate,
  customerNotes: orderParametersSchema.shape.customerNotes,
  internalNotes: orderParametersSchema.shape.internalNotes,
  express: orderParametersSchema.shape.express,
  expediteType: orderParametersSchema.shape.expediteType
});

/**
 * Типи даних на основі схем
 */
export type OrderParameters = z.infer<typeof orderParametersSchema>;
export type OrderParametersForm = z.infer<typeof orderParametersFormSchema>;
