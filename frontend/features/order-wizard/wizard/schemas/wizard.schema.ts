import { z } from 'zod';

import { orderBasicFormSchema } from '../../basic-info/schemas';
import { branchSelectionFormSchema } from '../../branch-selection/schemas';
import { clientSelectionFormSchema } from '../../client-selection/schemas';
import { finalizationFormSchema } from '../../finalization/schemas';
import { orderDiscountFormSchema, prepaymentFormSchema } from '../../pricing/schemas';
import { WizardStep } from '../store/navigation/navigation.types';

/**
 * Схема для валідації стану майстра замовлень
 */
export const wizardStateSchema = z.object({
  // Дані для клієнта, заповнюються на кроці CLIENT_SELECTION
  clientData: z.object({
    mode: z.enum(['existing', 'new']),
    clientId: z.string().uuid().optional(),
    client: z.record(z.unknown()).optional()
  }),

  // Дані для філії, заповнюються на кроці BRANCH_SELECTION
  branchData: z.object({
    branchId: z.string().uuid().optional(),
    branch: z.record(z.unknown()).optional()
  }),

  // Основні дані замовлення, заповнюються на кроці BASIC_INFO
  orderData: z.object({
    receiptNumber: z.string().optional(),
    tagNumber: z.string().optional(),
    expectedCompletionDate: z.string().optional(),
    expediteType: z.enum(['STANDARD', 'EXPRESS_48H', 'EXPRESS_24H']).optional(),
    express: z.boolean().optional(),
    customerNotes: z.string().optional(),
    internalNotes: z.string().optional(),
    termsAccepted: z.boolean().optional()
  }),

  // Предмети замовлення, заповнюються на кроках ITEM_*
  items: z.array(z.record(z.unknown())).default([]),

  // Поточний предмет, що редагується
  currentItem: z.record(z.unknown()).optional(),

  // Дані ціноутворення, заповнюються на кроці PRICING
  pricingData: z.object({
    totalAmount: z.number().optional(),
    discountAmount: z.number().optional(),
    finalAmount: z.number().optional(),
    discountType: z.enum(['NO_DISCOUNT', 'EVERCARD', 'SOCIAL_MEDIA', 'MILITARY', 'CUSTOM']).optional(),
    discountPercentage: z.number().optional(),
    discountDescription: z.string().optional(),
    prepaymentAmount: z.number().optional(),
    paymentMethod: z.enum(['CASH', 'CARD', 'TRANSFER']).optional(),
    balanceAmount: z.number().optional()
  }),

  // Дані фіналізації, заповнюються на кроці FINALIZATION
  finalizationData: z.object({
    termsAccepted: z.boolean().optional(),
    sendReceiptByEmail: z.boolean().optional(),
    generatePrintableReceipt: z.boolean().optional(),
    comments: z.string().optional(),
    signatureData: z.string().optional()
  })
});

/**
 * Мапа Zod схем для кожного кроку майстра замовлень
 */
export const WIZARD_STEP_SCHEMAS: Partial<Record<WizardStep, z.ZodType<unknown>>> = {
  [WizardStep.CLIENT_SELECTION]: clientSelectionFormSchema,
  [WizardStep.BRANCH_SELECTION]: branchSelectionFormSchema,
  [WizardStep.BASIC_INFO]: orderBasicFormSchema,
  [WizardStep.ITEM_BASIC_INFO]: z.object({}), // Ця схема буде визначена окремо для UI форми
  [WizardStep.ITEM_PROPERTIES]: z.object({}), // Ця схема буде визначена окремо для UI форми
  [WizardStep.DEFECTS_STAINS]: z.object({}), // Ця схема буде визначена окремо для UI форми
  [WizardStep.PRICE_CALCULATOR]: z.object({
    discount: orderDiscountFormSchema,
    prepayment: prepaymentFormSchema.optional()
  }),
  [WizardStep.ORDER_CONFIRMATION]: finalizationFormSchema
};

/**
 * Функція для отримання схеми валідації для конкретного кроку майстра
 */
export const getStepSchema = (step: WizardStep): z.ZodType<unknown> => {
  return WIZARD_STEP_SCHEMAS[step] || z.object({});
};

/**
 * Утиліта для валідації даних кроку
 */
export const validateStepData = (step: WizardStep, data: unknown): { success: boolean; errors?: z.ZodFormattedError<unknown> } => {
  const schema = getStepSchema(step);

  try {
    schema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.format()
      };
    }
    return { success: false, errors: { _errors: ['Невідома помилка валідації'] } };
  }
};

/**
 * Тип даних для стану майстра замовлень
 */
export type WizardState = z.infer<typeof wizardStateSchema>;
