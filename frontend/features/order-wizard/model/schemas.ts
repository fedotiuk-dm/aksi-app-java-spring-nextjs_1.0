import { z } from 'zod';
import { CommunicationChannel, ClientSource } from './types';

// Схема для адреси клієнта
export const clientAddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  additionalInfo: z.string().optional(),
});

// Схема для джерела інформації клієнта
export const clientSourceInfoSchema = z.object({
  source: z.enum(['INSTAGRAM', 'GOOGLE', 'RECOMMENDATION', 'OTHER'] as const),
  details: z.string().optional().nullable(),
}).refine(data => {
  // Якщо джерело "OTHER", деталі обов'язкові
  return data.source !== 'OTHER' || (data.details && data.details.trim().length > 0);
}, {
  message: "Якщо джерело 'Інше', потрібно вказати деталі",
  path: ["details"],
});

// Схема для клієнта - використовується для валідації форми створення/редагування клієнта
export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(1, "Ім'я обов'язкове"),
  lastName: z.string().min(1, "Прізвище обов'язкове"),
  phone: z.string().min(10, "Введіть коректний номер телефону"),
  email: z.string().email("Введіть коректний email").optional().nullable(),
  address: clientAddressSchema.optional().nullable(),
  communicationChannels: z.array(
    z.enum(['PHONE', 'SMS', 'VIBER'] as const)
  ).default([]),
  source: clientSourceInfoSchema.optional().nullable(),
});

// Схема для пошуку клієнта
export const clientSearchSchema = z.object({
  query: z.string().min(3, "Введіть мінімум 3 символи для пошуку"),
});

// Схема для предмета замовлення
export const orderItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Назва предмета обов'язкова"),
  description: z.string().optional(),
  quantity: z.number().int().min(1, "Кількість повинна бути більше 0"),
  unitPrice: z.number().min(0, "Ціна не може бути від'ємною"),
  totalPrice: z.number().min(0, "Загальна ціна не може бути від'ємною"),
  category: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  defects: z.string().optional(),
  specialInstructions: z.string().optional(),
});

// Схема для базової інформації про замовлення
export const basicOrderInfoSchema = z.object({
  tagNumber: z.string().optional(),
  branchLocation: z.string().min(1, "Філія обов'язкова"),
  expectedCompletionDate: z.date().optional().nullable(),
  express: z.boolean().default(false),
});

// Схема для деталей замовлення
export const orderDetailsSchema = z.object({
  customerNotes: z.string().max(1000, "Примітки не можуть перевищувати 1000 символів").optional(),
  internalNotes: z.string().max(1000, "Внутрішні примітки не можуть перевищувати 1000 символів").optional(),
});

// Схема для біллінгу
export const billingSchema = z.object({
  discountAmount: z.number().min(0, "Знижка не може бути від'ємною").default(0),
  prepaymentAmount: z.number().min(0, "Передоплата не може бути від'ємною").default(0),
});

// Об'єднана схема для повного замовлення
export const completeOrderSchema = z.object({
  clientId: z.string().uuid("Виберіть клієнта"),
  items: z.array(orderItemSchema).min(1, "Додайте хоча б один предмет"),
}).merge(basicOrderInfoSchema)
  .merge(orderDetailsSchema)
  .merge(billingSchema);
