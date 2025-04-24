/**
 * Zod схеми для валідації форм замовлення
 */
import { z } from 'zod';
import dayjs from 'dayjs';
import { OrderCreateRequest } from '@/lib/api';

/**
 * Схема для базової інформації замовлення (етап 1.2)
 */
export const basicOrderInfoSchema = z.object({
  // Унікальна мітка може бути опціональною, але якщо вона є, має бути не пустою
  uniqueTag: z.string().min(1, { message: 'Унікальна мітка не може бути пустою' }).optional(),
  
  // Пункт прийому замовлення (обов'язковий)
  receptionPointId: z.string().min(1, { message: 'Необхідно вибрати пункт прийому' }),
  
  // Номер квитанції (зазвичай генерується автоматично)
  receiptNumber: z.string().optional(),
  
  // Дата створення (автоматично генерується)
  createdAt: z.date().optional().default(() => new Date()),
});

/**
 * Схема для повного замовлення з усіма необхідними полями
 */
export const fullOrderSchema = z.object({
  // Базові поля
  uniqueTag: z.string().optional(),
  receptionPointId: z.string().min(1, { message: 'Необхідно вибрати пункт прийому' }),
  receiptNumber: z.string().optional(),
  
  // ID клієнта (обов'язковий)
  clientId: z.string().min(1, { message: 'Необхідно вибрати клієнта' }),
  
  // Поля для розрахунків
  amountPaid: z.number().min(0, { message: 'Сума оплати не може бути від\'ємною' }),
  
  // Дати
  expectedCompletionDate: z.string().refine(val => {
    return dayjs(val).isValid() && dayjs(val).isAfter(dayjs());
  }, { message: 'Дата завершення повинна бути в майбутньому' }),
  
  // Додаткові поля
  clientRequirements: z.string().optional(),
  notes: z.string().optional(),
  
  // Типи та налаштування
  discountType: z.nativeEnum(OrderCreateRequest.discountType).default(OrderCreateRequest.discountType.NONE),
  customDiscountPercentage: z.number().min(0).max(100).optional(),
  paymentMethod: z.nativeEnum(OrderCreateRequest.paymentMethod),
  urgencyType: z.nativeEnum(OrderCreateRequest.urgencyType),
});

// Типи, виведені зі схем
export type BasicOrderInfoFormValues = z.infer<typeof basicOrderInfoSchema>;
export type FullOrderFormValues = z.infer<typeof fullOrderSchema>;
