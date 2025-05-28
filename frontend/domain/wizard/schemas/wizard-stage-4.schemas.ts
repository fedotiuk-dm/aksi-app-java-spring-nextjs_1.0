/**
 * @fileoverview Схеми валідації для Stage 4: Підтвердження та завершення
 * @module domain/wizard/schemas
 */

import { z } from 'zod';

// === КОНСТАНТИ ===

/**
 * Константа для повідомлення про обов'язкове прийняття умов
 */
const TERMS_ACCEPTANCE_REQUIRED = 'Умови повинні бути прийняті';

// === СХЕМИ STAGE 4.1: ПЕРЕГЛЯД ЗАМОВЛЕННЯ ===

/**
 * Схема для опцій перегляду замовлення
 */
export const orderReviewSchema = z.object({
  orderId: z.string().min(1),
  includeCalculationDetails: z.boolean().default(true),
  includePaymentSummary: z.boolean().default(true),
});

// === СХЕМИ STAGE 4.2: ЮРИДИЧНІ АСПЕКТИ ===

/**
 * Схема для юридичних даних і підпису
 */
export const legalDataSchema = z.object({
  orderId: z.string().min(1),
  termsAccepted: z.boolean().refine((val) => val === true, TERMS_ACCEPTANCE_REQUIRED),
  digitalSignature: z.string().min(1, 'Потрібен цифровий підпис клієнта'),
  signatureTimestamp: z.string().optional(),
  documentsReviewed: z.boolean().default(true),
  clientConsent: z.boolean().refine((val) => val === true, 'Потрібна згода клієнта'),
});

// === СХЕМИ STAGE 4.3: ВАЛІДАЦІЯ ЗАМОВЛЕННЯ ===

/**
 * Схема для повного замовлення перед завершенням
 */
export const completeOrderSchema = z.object({
  client: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().min(10),
  }),
  items: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        finalPrice: z.number().min(0),
      })
    )
    .min(1, 'Потрібен хоча б один предмет'),
  executionDate: z.date(),
  totalAmount: z.number().min(0),
  paidAmount: z.number().min(0),
  clientSignature: z.string().min(1, 'Потрібен підпис клієнта'),
  termsAccepted: z.boolean().refine((val) => val === true, TERMS_ACCEPTANCE_REQUIRED),
});

// === СХЕМИ STAGE 4.4: ГЕНЕРАЦІЯ КВИТАНЦІЇ ===

/**
 * Схема для даних генерації PDF квитанції
 */
export const pdfGenerationDataSchema = z.object({
  orderId: z.string().min(1),
  includeSignature: z.boolean().default(true),
  format: z.enum(['PDF', 'HTML']).default('PDF'),
});

/**
 * Схема для даних відправки email квитанції
 */
export const emailReceiptDataSchema = z.object({
  orderId: z.string().min(1),
  email: z.string().email('Некоректний email'),
  includeSignature: z.boolean().default(true),
  subject: z.string().optional(),
  message: z.string().optional(),
  additionalMessage: z.string().optional(),
});

/**
 * Схема для модифікатора ціни в квитанції
 */
export const receiptModifierSchema = z.object({
  name: z.string(),
  type: z.string(),
  value: z.number(),
  amount: z.number(),
});

/**
 * Схема для предмета в квитанції
 */
export const receiptItemSchema = z.object({
  id: z.string(),
  itemName: z.string(),
  categoryName: z.string(),
  quantity: z.number().positive(),
  unit: z.string(),
  material: z.string().optional(),
  color: z.string().optional(),
  basePrice: z.number().min(0),
  modifiers: z.array(receiptModifierSchema),
  subtotal: z.number().min(0),
  discountAmount: z.number().min(0).optional(),
  finalPrice: z.number().min(0),
  defects: z.array(z.string()).optional(),
  stains: z.array(z.string()).optional(),
  risks: z.array(z.string()).optional(),
});

/**
 * Схема для структури квитанції
 */
export const receiptStructureSchema = z.object({
  header: z.object({
    companyName: z.string(),
    companyAddress: z.string(),
    branchInfo: z.string(),
    operatorName: z.string(),
  }),
  orderInfo: z.object({
    receiptNumber: z.string(),
    tagNumber: z.string().optional(),
    createdDate: z.string(),
    expectedCompletionDate: z.string().optional(),
  }),
  clientInfo: z.object({
    fullName: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    address: z.string().optional(),
  }),
  items: z.array(receiptItemSchema),
  financial: z.object({
    totalBeforeDiscounts: z.number().min(0),
    discountAmount: z.number().min(0).optional(),
    expediteSurchargeAmount: z.number().min(0).optional(),
    finalAmount: z.number().min(0),
    prepaymentAmount: z.number().min(0).optional(),
    balanceAmount: z.number().min(0),
    paymentMethod: z.string().optional(),
  }),
  legal: z.object({
    termsAccepted: z.boolean(),
    signatureTimestamp: z.string(),
    operatorSignature: z.string(),
    clientSignature: z.string(),
  }),
  footer: z.object({
    contactInfo: z.string(),
    workingHours: z.string(),
    qrCode: z.string().optional(),
  }),
});

// === СХЕМИ STAGE 4.5: ЗАВЕРШЕННЯ ПРОЦЕСУ ===

/**
 * Схема для завершення замовлення
 */
export const completionSchema = z.object({
  orderId: z.string().min(1),
  signatureData: z.string().min(1, 'Потрібен підпис клієнта'),
  termsAccepted: z.boolean().refine((val) => val === true, TERMS_ACCEPTANCE_REQUIRED),
  sendReceiptByEmail: z.boolean().optional(),
  generatePrintableReceipt: z.boolean().optional(),
  comments: z.string().optional(),
});

// === ТИПИ ЗГЕНЕРОВАНІ З ZOD СХЕМ ===

export type OrderReviewOptions = z.infer<typeof orderReviewSchema>;
export type LegalData = z.infer<typeof legalDataSchema>;
export type CompleteOrder = z.infer<typeof completeOrderSchema>;
export type PdfGenerationData = z.infer<typeof pdfGenerationDataSchema>;
export type EmailReceiptData = z.infer<typeof emailReceiptDataSchema>;
export type ReceiptModifier = z.infer<typeof receiptModifierSchema>;
export type ReceiptItem = z.infer<typeof receiptItemSchema>;
export type ReceiptStructure = z.infer<typeof receiptStructureSchema>;
export type CompletionData = z.infer<typeof completionSchema>;
