import { z } from 'zod';

import { priceNumber, percentageNumber, shortText } from '@features/order-wizard/shared';

/**
 * Схема для розрахунку ціни предмета
 */
export const itemPriceSchema = z.object({
  unitPrice: priceNumber,
  quantity: z.number().int().positive('Кількість повинна бути додатним цілим числом'),
  discountPercentage: percentageNumber.optional(),
  additionalChargePercentage: percentageNumber.optional(),
  additionalChargeReason: shortText.optional(),
  totalPrice: priceNumber,
});

/**
 * Схема для запиту на створення знижки для предмета
 */
export const itemDiscountSchema = z.object({
  itemId: z.string().uuid(),
  discountPercentage: percentageNumber.default(0),
  discountReason: shortText.optional(),
});

/**
 * Схема форми для розрахунку ціни
 */
export const itemPriceFormSchema = z.object({
  unitPrice: itemPriceSchema.shape.unitPrice,
  quantity: itemPriceSchema.shape.quantity,
  discountPercentage: itemPriceSchema.shape.discountPercentage,
  additionalChargePercentage: itemPriceSchema.shape.additionalChargePercentage,
  additionalChargeReason: itemPriceSchema.shape.additionalChargeReason,
});

/**
 * Типи даних на основі схем
 */
export type ItemPrice = z.infer<typeof itemPriceSchema>;
export type ItemDiscount = z.infer<typeof itemDiscountSchema>;
export type ItemPriceForm = z.infer<typeof itemPriceFormSchema>;
