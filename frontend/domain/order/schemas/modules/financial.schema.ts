/**
 * Zod схеми для фінансового модуля
 */

import { z } from 'zod';

/**
 * Схема для способів оплати
 */
export const paymentMethodSchema = z.nativeEnum({
  TERMINAL: 'TERMINAL',
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
} as const);

/**
 * Схема для типів знижок
 */
export const discountTypeSchema = z.nativeEnum({
  NONE: 'NONE',
  EVERCARD: 'EVERCARD',
  SOCIAL_MEDIA: 'SOCIAL_MEDIA',
  MILITARY: 'MILITARY',
  CUSTOM: 'CUSTOM',
} as const);

/**
 * Схема для статусу оплати
 */
export const paymentStatusSchema = z.nativeEnum({
  PENDING: 'PENDING',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
} as const);

/**
 * Схема для фінансової інформації замовлення
 */
export const orderFinancialsSchema = z
  .object({
    basePrice: z.number().min(0, "Базова ціна не може бути від'ємною"),
    modifiersAmount: z.number().min(0, "Сума модифікаторів не може бути від'ємною"),
    subtotal: z.number().min(0, "Проміжна сума не може бути від'ємною"),
    discountType: discountTypeSchema,
    discountPercentage: z.number().min(0).max(100, 'Відсоток знижки повинен бути від 0 до 100'),
    discountAmount: z.number().min(0, "Сума знижки не може бути від'ємною"),
    expediteAmount: z.number().min(0, "Надбавка за терміновість не може бути від'ємною"),
    totalAmount: z.number().min(0, "Загальна сума не може бути від'ємною"),
    prepaymentAmount: z.number().min(0, "Передоплата не може бути від'ємною"),
    balanceAmount: z.number().min(0, "Залишок не може бути від'ємним"),
    paymentMethod: paymentMethodSchema,
  })
  .refine(
    (data) => {
      // Передоплата не може перевищувати загальну суму
      return data.prepaymentAmount <= data.totalAmount;
    },
    {
      message: 'Передоплата не може перевищувати загальну суму',
      path: ['prepaymentAmount'],
    }
  )
  .refine(
    (data) => {
      // Проміжна сума повинна дорівнювати базовій ціні + модифікатори
      return Math.abs(data.subtotal - (data.basePrice + data.modifiersAmount)) < 0.01;
    },
    {
      message: 'Проміжна сума не відповідає базовій ціні та модифікаторам',
      path: ['subtotal'],
    }
  )
  .refine(
    (data) => {
      // Залишок повинен дорівнювати загальна сума - передоплата
      return Math.abs(data.balanceAmount - (data.totalAmount - data.prepaymentAmount)) < 0.01;
    },
    {
      message: 'Залишок не відповідає розрахунку',
      path: ['balanceAmount'],
    }
  );

/**
 * Схема для застосування знижки
 */
export const applyDiscountSchema = z
  .object({
    orderId: z.string().min(1, "ID замовлення обов'язковий"),
    discountType: discountTypeSchema,
    discountPercentage: z
      .number()
      .min(0)
      .max(100, 'Відсоток знижки повинен бути від 0 до 100')
      .optional(),
    discountDescription: z
      .string()
      .max(500, 'Опис знижки не може перевищувати 500 символів')
      .optional(),
  })
  .refine(
    (data) =>
      data.discountType !== 'CUSTOM' ||
      (data.discountPercentage !== undefined && data.discountPercentage > 0),
    {
      message: 'Для індивідуальної знижки вкажіть відсоток',
      path: ['discountPercentage'],
    }
  );

/**
 * Схема для додавання передоплати
 */
export const addPrepaymentSchema = z
  .object({
    orderId: z.string().min(1, "ID замовлення обов'язковий"),
    amount: z.number().min(0.01, 'Сума передоплати повинна бути більше 0'),
    paymentMethod: paymentMethodSchema,
    notes: z.string().max(500, 'Примітки не можуть перевищувати 500 символів').optional(),
  })
  .refine(
    (data) => {
      // Розумне обмеження суми
      return data.amount <= 1000000;
    },
    {
      message: 'Сума передоплати здається занадто великою',
      path: ['amount'],
    }
  );

/**
 * Схема для модифікатора розрахунку
 */
export const modifierBreakdownSchema = z.object({
  name: z.string().min(1, "Назва модифікатора обов'язкова"),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT'], {
    errorMap: () => ({ message: 'Тип повинен бути PERCENTAGE або FIXED_AMOUNT' }),
  }),
  value: z.number().min(0, "Значення не може бути від'ємним"),
  amount: z.number(),
  description: z.string().max(500, 'Опис не може перевищувати 500 символів').optional(),
});

/**
 * Схема для підсумків розрахунку
 */
export const financialTotalsSchema = z.object({
  itemsSubtotal: z.number().min(0, "Підсумок предметів не може бути від'ємним"),
  modifiersSubtotal: z.number().min(0, "Підсумок модифікаторів не може бути від'ємним"),
  beforeDiscounts: z.number().min(0, "Сума до знижок не може бути від'ємною"),
  totalDiscounts: z.number().min(0, "Загальна знижка не може бути від'ємною"),
  afterDiscounts: z.number().min(0, "Сума після знижок не може бути від'ємною"),
  expediteAmount: z.number().min(0, "Надбавка за терміновість не може бути від'ємною"),
  finalAmount: z.number().min(0, "Фінальна сума не може бути від'ємною"),
});

/**
 * Схема для деталізації знижки
 */
export const discountBreakdownSchema = z.object({
  type: discountTypeSchema,
  name: z.string().min(1, "Назва знижки обов'язкова"),
  percentage: z.number().min(0).max(100, 'Відсоток повинен бути від 0 до 100'),
  appliedToAmount: z.number().min(0, "Сума застосування не може бути від'ємною"),
  discountAmount: z.number().min(0, "Сума знижки не може бути від'ємною"),
  excludedItems: z.array(z.string()).default([]),
});

/**
 * Схема для деталізації терміновості
 */
export const expediteBreakdownSchema = z.object({
  type: z.enum(['EXPRESS_48H', 'EXPRESS_24H'], {
    errorMap: () => ({ message: 'Тип терміновості повинен бути EXPRESS_48H або EXPRESS_24H' }),
  }),
  name: z.string().min(1, "Назва терміновості обов'язкова"),
  percentage: z.number().min(0).max(200, 'Відсоток терміновості не може перевищувати 200%'),
  appliedToAmount: z.number().min(0, "Сума застосування не може бути від'ємною"),
  expediteAmount: z.number().min(0, "Сума терміновості не може бути від'ємною"),
});

/**
 * Схема для деталізації оплати
 */
export const paymentBreakdownSchema = z
  .object({
    method: paymentMethodSchema,
    totalAmount: z.number().min(0, "Загальна сума не може бути від'ємною"),
    prepaidAmount: z.number().min(0, "Передоплачена сума не може бути від'ємною"),
    remainingAmount: z.number().min(0, "Залишок не може бути від'ємним"),
    paymentStatus: paymentStatusSchema,
  })
  .refine(
    (data) => {
      // Залишок повинен дорівнювати загальна сума - передоплата
      return Math.abs(data.remainingAmount - (data.totalAmount - data.prepaidAmount)) < 0.01;
    },
    {
      message: 'Залишок не відповідає розрахунку',
      path: ['remainingAmount'],
    }
  );

/**
 * Схема для повного фінансового розкладу
 */
export const financialBreakdownSchema = z.object({
  items: z.array(
    z.object({
      itemId: z.string(),
      itemName: z.string(),
      quantity: z.number().min(1),
      basePrice: z.number().min(0),
      modifiers: z.array(modifierBreakdownSchema),
      itemSubtotal: z.number().min(0),
      discountApplied: z.number().min(0),
      itemTotal: z.number().min(0),
    })
  ),
  totals: financialTotalsSchema,
  discounts: z.array(discountBreakdownSchema),
  expedite: expediteBreakdownSchema.nullable(),
  payment: paymentBreakdownSchema,
});

// === ЕКСПОРТ ТИПІВ ===
export type OrderFinancialsFormData = z.infer<typeof orderFinancialsSchema>;
export type ApplyDiscountFormData = z.infer<typeof applyDiscountSchema>;
export type AddPrepaymentFormData = z.infer<typeof addPrepaymentSchema>;
export type ModifierBreakdownFormData = z.infer<typeof modifierBreakdownSchema>;
export type FinancialTotalsFormData = z.infer<typeof financialTotalsSchema>;
export type DiscountBreakdownFormData = z.infer<typeof discountBreakdownSchema>;
export type ExpediteBreakdownFormData = z.infer<typeof expediteBreakdownSchema>;
export type PaymentBreakdownFormData = z.infer<typeof paymentBreakdownSchema>;
export type FinancialBreakdownFormData = z.infer<typeof financialBreakdownSchema>;
