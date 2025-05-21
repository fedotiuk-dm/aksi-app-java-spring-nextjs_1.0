import { z } from 'zod';

import { uuidSchema, longText } from '../../shared/schemas/common.schema';

/**
 * Схема для запиту на фіналізацію замовлення
 */
export const orderFinalizationSchema = z.object({
  orderId: uuidSchema,
  signatureData: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'Необхідно погодитись з умовами обслуговування'
  }),
  sendReceiptByEmail: z.boolean().default(false),
  generatePrintableReceipt: z.boolean().default(true),
  comments: longText.optional()
});

/**
 * Схема для форми фіналізації замовлення
 */
export const finalizationFormSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'Необхідно погодитись з умовами обслуговування'
  }),
  sendReceiptByEmail: z.boolean().default(false),
  generatePrintableReceipt: z.boolean().default(true),
  comments: longText.optional()
});

/**
 * Схема для цифрового підпису
 */
export const signatureSchema = z.object({
  signatureData: z.string().min(1, 'Підпис обов\'язковий')
});

/**
 * Типи даних на основі схем
 */
export type OrderFinalization = z.infer<typeof orderFinalizationSchema>;
export type FinalizationForm = z.infer<typeof finalizationFormSchema>;
export type Signature = z.infer<typeof signatureSchema>;
