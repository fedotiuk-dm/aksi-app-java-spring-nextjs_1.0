/**
 * @fileoverview Утиліти для валідації в Order Wizard
 *
 * Централізовані правила валідації для всіх етапів візарда
 */

import { z } from 'zod';

// ==================== БАЗОВІ СХЕМИ ====================

export const phoneSchema = z
  .string()
  .min(10, 'Телефон повинен містити мінімум 10 символів')
  .regex(/^\+?[0-9]{10,15}$/, 'Неправильний формат телефону');

export const emailSchema = z
  .string()
  .email('Неправильний формат email')
  .optional()
  .or(z.literal(''));

export const nameSchema = z
  .string()
  .min(2, "Ім'я повинно містити мінімум 2 символи")
  .max(50, "Ім'я не може містити більше 50 символів")
  .regex(/^[\p{L}\s\-']+$/u, "Ім'я може містити тільки літери, пробіли, дефіси та апострофи");

// ==================== ЕТАП 1: ВАЛІДАЦІЯ ====================

export const clientSearchSchema = z.object({
  query: z.string().min(1, 'Введіть критерій пошуку'),
});

export const newClientSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  address: z.string().optional(),
  communicationChannels: z
    .array(z.enum(['PHONE', 'SMS', 'VIBER']))
    .min(1, "Оберіть хоча б один спосіб зв'язку"),
  source: z.enum(['INSTAGRAM', 'GOOGLE', 'RECOMMENDATION', 'OTHER']),
  sourceDetails: z.string().optional(),
});

export const basicOrderInfoSchema = z.object({
  clientId: z.string().uuid('Оберіть клієнта'),
  branchLocationId: z.string().uuid('Оберіть філію'),
  tagNumber: z.string().optional(),
  receiptNumber: z.string().min(1, "Номер квитанції обов'язковий"),
});

export const stage1Schema = z.object({
  client: newClientSchema.or(z.object({ id: z.string().uuid() })),
  basicInfo: basicOrderInfoSchema,
});

// ==================== ЕТАП 2: ВАЛІДАЦІЯ ====================

export const orderItemSchema = z.object({
  name: z.string().min(1, "Назва предмета обов'язкова"),
  categoryId: z.string().min(1, 'Оберіть категорію'),
  quantity: z.number().min(1, 'Кількість повинна бути більше 0'),
  unitPrice: z.number().min(0, "Ціна не може бути від'ємною"),
  color: z.string().optional(),
  material: z.string().optional(),
  stains: z.array(z.string()).optional(),
  defects: z.array(z.string()).optional(),
  specialInstructions: z
    .string()
    .max(500, 'Інструкції не можуть перевищувати 500 символів')
    .optional(),
});

export const stage2Schema = z.object({
  items: z.array(orderItemSchema).min(1, 'Додайте хоча б один предмет'),
});

// ==================== ЕТАП 3: ВАЛІДАЦІЯ ====================

export const orderParametersSchema = z.object({
  expectedCompletionDate: z.date().min(new Date(), 'Дата виконання не може бути в минулому'),
  expediteType: z.enum(['NORMAL', 'EXPEDITE_50', 'EXPEDITE_100']),
  discountType: z.enum(['NONE', 'EVERCARD', 'SOCIAL_MEDIA', 'MILITARY', 'OTHER']).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  paymentMethod: z.enum(['TERMINAL', 'CASH', 'ACCOUNT']),
  prepaymentAmount: z.number().min(0, "Передоплата не може бути від'ємною").optional(),
  customerNotes: z.string().max(1000, 'Примітки не можуть перевищувати 1000 символів').optional(),
});

export const stage3Schema = z.object({
  parameters: orderParametersSchema,
});

// ==================== ЕТАП 4: ВАЛІДАЦІЯ ====================

export const orderFinalizationSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, 'Необхідно погодитися з умовами'),
  signatureData: z.string().min(1, "Підпис обов'язковий"),
  sendReceiptByEmail: z.boolean().optional(),
  generatePrintableReceipt: z.boolean().optional(),
});

export const stage4Schema = z.object({
  finalization: orderFinalizationSchema,
});

// ==================== ПОВНА ВАЛІДАЦІЯ ЗАМОВЛЕННЯ ====================

export const completeOrderSchema = z.object({
  stage1: stage1Schema,
  stage2: stage2Schema,
  stage3: stage3Schema,
  stage4: stage4Schema,
});

// ==================== ТИПИ ====================

export type ClientSearchData = z.infer<typeof clientSearchSchema>;
export type NewClientData = z.infer<typeof newClientSchema>;
export type BasicOrderInfoData = z.infer<typeof basicOrderInfoSchema>;
export type Stage1Data = z.infer<typeof stage1Schema>;

export type OrderItemData = z.infer<typeof orderItemSchema>;
export type Stage2Data = z.infer<typeof stage2Schema>;

export type OrderParametersData = z.infer<typeof orderParametersSchema>;
export type Stage3Data = z.infer<typeof stage3Schema>;

export type OrderFinalizationData = z.infer<typeof orderFinalizationSchema>;
export type Stage4Data = z.infer<typeof stage4Schema>;

export type CompleteOrderData = z.infer<typeof completeOrderSchema>;

// ==================== ВАЛІДАЦІЙНІ УТИЛІТИ ====================

export interface ValidationResult<T = unknown> {
  isValid: boolean;
  data?: T;
  errors: string[];
  fieldErrors: Record<string, string[]>;
}

export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      isValid: true,
      data: result.data,
      errors: [],
      fieldErrors: {},
    };
  }

  const fieldErrors: Record<string, string[]> = {};
  const errors: string[] = [];

  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    const message = issue.message;

    if (path) {
      if (!fieldErrors[path]) {
        fieldErrors[path] = [];
      }
      fieldErrors[path].push(message);
    }

    errors.push(path ? `${path}: ${message}` : message);
  }

  return {
    isValid: false,
    errors,
    fieldErrors,
  };
}

export function getFieldError(
  validationResult: ValidationResult,
  fieldPath: string
): string | undefined {
  return validationResult.fieldErrors[fieldPath]?.[0];
}

export function hasFieldError(validationResult: ValidationResult, fieldPath: string): boolean {
  return !!validationResult.fieldErrors[fieldPath]?.length;
}
