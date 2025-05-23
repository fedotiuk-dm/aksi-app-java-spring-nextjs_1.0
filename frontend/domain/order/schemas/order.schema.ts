/**
 * Zod схеми для валідації Order домену
 */

import { z } from 'zod';

import {
  OrderStatus,
  ExpediteType,
  DiscountType,
  PaymentMethod,
  MaterialType,
  WearDegree,
  FillerType,
} from '../types';

/**
 * Схема для OrderItem
 */
export const orderItemSchema = z.object({
  id: z.string().optional(),
  orderId: z.string().optional(),
  name: z.string().min(1, "Назва предмета обов'язкова"),
  description: z.string().optional(),
  quantity: z.number().min(1, 'Кількість повинна бути більше 0'),
  unitPrice: z.number().min(0, "Ціна не може бути від'ємною"),
  totalPrice: z.number().min(0, "Загальна ціна не може бути від'ємною"),
  calculatedPrice: z.number().optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  material: z.nativeEnum(MaterialType).optional(),
  unitOfMeasure: z.string().optional(),
  defects: z.string().optional(),
  specialInstructions: z.string().optional(),
  fillerType: z.nativeEnum(FillerType).optional(),
  fillerCompressed: z.boolean().optional(),
  wearDegree: z.nativeEnum(WearDegree).optional(),
  stains: z.string().optional(),
  otherStains: z.string().optional(),
  defectsAndRisks: z.string().optional(),
  noGuaranteeReason: z.string().optional(),
  defectsNotes: z.string().optional(),
  discountApplied: z.number().default(0),
  modifiersApplied: z.array(z.string()).default([]),
  hasPhotos: z.boolean().default(false),
  photoCount: z.number().min(0).default(0),
  isComplete: z.boolean().default(false),
  hasIssues: z.boolean().default(false),
});

/**
 * Схема для базової інформації клієнта
 */
export const clientSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, "Ім'я обов'язкове"),
  lastName: z.string().min(1, "Прізвище обов'язкове"),
  phone: z.string().min(10, 'Телефон повинен містити мінімум 10 символів'),
  email: z.string().email('Некоректний email').optional().nullable(),
});

/**
 * Схема для філії
 */
export const branchLocationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Назва філії обов'язкова"),
  address: z.string().optional(),
});

/**
 * Схема для замовлення
 */
export const orderSchema = z.object({
  id: z.string().optional(),
  receiptNumber: z.string().min(1, "Номер квитанції обов'язковий"),
  tagNumber: z.string().optional(),

  // Клієнт
  client: clientSchema,
  clientId: z.string().optional(),

  // Предмети
  items: z.array(orderItemSchema).optional(),
  itemsCount: z.number().min(0).optional(),

  // Фінанси
  totalAmount: z.number().min(0).optional(),
  discountAmount: z.number().min(0).optional(),
  finalAmount: z.number().min(0).optional(),
  prepaymentAmount: z.number().min(0).optional(),
  balanceAmount: z.number().optional(),

  // Філія
  branchLocation: branchLocationSchema,
  branchLocationId: z.string().optional(),

  // Статус та дати
  status: z.nativeEnum(OrderStatus),
  createdDate: z.date().optional(),
  updatedDate: z.date().optional(),
  expectedCompletionDate: z.date().optional(),
  completedDate: z.date().optional(),

  // Примітки
  customerNotes: z.string().optional(),
  internalNotes: z.string().optional(),
  completionComments: z.string().optional(),

  // Параметри
  expediteType: z.nativeEnum(ExpediteType).optional(),
  termsAccepted: z.boolean().optional(),
  finalizedAt: z.date().optional(),

  // Прапорці
  express: z.boolean().optional(),
  draft: z.boolean().optional(),
  printed: z.boolean().optional(),
  emailed: z.boolean().optional(),

  // Доменні властивості
  isEditable: z.boolean().optional(),
  canBeCancelled: z.boolean().optional(),
  canBeCompleted: z.boolean().optional(),
  displayStatus: z.string().optional(),
  progressPercentage: z.number().min(0).max(100).optional(),
});

/**
 * Схема для створення нового замовлення
 */
export const createOrderSchema = orderSchema
  .pick({
    receiptNumber: true,
    tagNumber: true,
    client: true,
    branchLocation: true,
    customerNotes: true,
    expediteType: true,
  })
  .extend({
    clientId: z.string().min(1, "ID клієнта обов'язковий"),
    branchLocationId: z.string().min(1, "ID філії обов'язковий"),
  });

/**
 * Схема для оновлення замовлення
 */
export const updateOrderSchema = orderSchema.partial().extend({
  id: z.string().min(1, "ID замовлення обов'язковий для оновлення"),
});

/**
 * Схема для пошуку замовлень
 */
export const orderSearchParamsSchema = z.object({
  keyword: z.string().optional(),
  status: z.array(z.nativeEnum(OrderStatus)).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  branchId: z.string().optional(),
  clientId: z.string().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  hasItems: z.boolean().optional(),
  expediteType: z.nativeEnum(ExpediteType).optional(),
});

/**
 * Схема для застосування знижки
 */
export const applyDiscountSchema = z.object({
  orderId: z.string().min(1, "ID замовлення обов'язковий"),
  discountType: z.nativeEnum(DiscountType),
  discountPercentage: z.number().min(0).max(100, 'Знижка не може бути більше 100%'),
});

/**
 * Схема для зміни статусу замовлення
 */
export const changeOrderStatusSchema = z.object({
  orderId: z.string().min(1, "ID замовлення обов'язковий"),
  newStatus: z.nativeEnum(OrderStatus),
  comment: z.string().optional(),
});

/**
 * Схема для фінансової інформації
 */
export const orderFinancialsSchema = z.object({
  basePrice: z.number().min(0),
  modifiersAmount: z.number(),
  subtotal: z.number().min(0),
  discountType: z.nativeEnum(DiscountType),
  discountPercentage: z.number().min(0).max(100),
  discountAmount: z.number().min(0),
  expediteAmount: z.number().min(0),
  totalAmount: z.number().min(0),
  prepaymentAmount: z.number().min(0),
  balanceAmount: z.number(),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

/**
 * Типи згенеровані з схем
 */
export type OrderItemFormData = z.infer<typeof orderItemSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
export type OrderSearchFormData = z.infer<typeof orderSearchParamsSchema>;
export type ApplyDiscountFormData = z.infer<typeof applyDiscountSchema>;
export type ChangeOrderStatusFormData = z.infer<typeof changeOrderStatusSchema>;
export type OrderFinancialsFormData = z.infer<typeof orderFinancialsSchema>;
