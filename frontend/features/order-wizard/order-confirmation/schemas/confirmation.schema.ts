import { z } from 'zod';

import { longText } from '@features/order-wizard/shared';

/**
 * Схема для підтвердження замовлення
 */
export const orderConfirmationSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'Необхідно погодитись з умовами обслуговування'
  }),
  signatureData: z.string().min(1, 'Підпис обов\'язковий'),
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
 * Схема форми для підтвердження замовлення
 */
export const orderConfirmationFormSchema = z.object({
  termsAccepted: orderConfirmationSchema.shape.termsAccepted,
  sendReceiptByEmail: orderConfirmationSchema.shape.sendReceiptByEmail,
  generatePrintableReceipt: orderConfirmationSchema.shape.generatePrintableReceipt,
  comments: orderConfirmationSchema.shape.comments
});

/**
 * Типи даних на основі схем
 */
export type OrderConfirmation = z.infer<typeof orderConfirmationSchema>;
export type Signature = z.infer<typeof signatureSchema>;
export type OrderConfirmationForm = z.infer<typeof orderConfirmationFormSchema>;
