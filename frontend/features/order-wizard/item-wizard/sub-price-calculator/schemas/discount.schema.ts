import { z } from 'zod';

import { percentageNumber, priceNumber, shortText } from '@features/order-wizard/shared';

/**
 * Схема для знижки на замовлення
 */
export const orderDiscountFormSchema = z.object({
  discountType: z.enum(['NO_DISCOUNT', 'EVERCARD', 'SOCIAL_MEDIA', 'MILITARY', 'CUSTOM'], {
    required_error: 'Виберіть тип знижки',
  }),
  discountPercentage: percentageNumber.optional(),
  discountDescription: shortText.optional(),
});

/**
 * Схема для передоплати замовлення
 */
export const prepaymentFormSchema = z.object({
  prepaymentAmount: priceNumber.optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'TRANSFER']).optional(),
});

/**
 * Типи даних на основі схем
 */
export type OrderDiscount = z.infer<typeof orderDiscountFormSchema>;
export type Prepayment = z.infer<typeof prepaymentFormSchema>;
