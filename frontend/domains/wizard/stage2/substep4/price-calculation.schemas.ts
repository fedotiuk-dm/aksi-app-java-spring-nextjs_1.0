// Експорт готових Orval схем для Substep4 Price Calculation
export {
  substep4InitializeSubstepParams as InitializeSubstepParamsSchema,
  substep4InitializeSubstep200Response as InitializeSubstepResponseSchema,
  substep4CalculateBasePriceParams as CalculateBasePriceParamsSchema,
  substep4CalculateBasePrice200Response as CalculateBasePriceResponseSchema,
  substep4CalculatePriceParams as CalculatePriceParamsSchema,
  substep4CalculatePrice200Response as CalculatePriceResponseSchema,
  substep4CalculateFinalPriceParams as CalculateFinalPriceParamsSchema,
  substep4CalculateFinalPrice200Response as CalculateFinalPriceResponseSchema,
  substep4AddModifierParams as AddModifierParamsSchema,
  substep4AddModifier200Response as AddModifierResponseSchema,
  substep4RemoveModifierParams as RemoveModifierParamsSchema,
  substep4RemoveModifier200Response as RemoveModifierResponseSchema,
  substep4ConfirmCalculationParams as ConfirmCalculationParamsSchema,
  substep4ConfirmCalculation200Response as ConfirmCalculationResponseSchema,
  substep4ResetCalculationParams as ResetCalculationParamsSchema,
  substep4ResetCalculation200Response as ResetCalculationResponseSchema,
  substep4GetCurrentData200Response as GetCurrentDataResponseSchema,
  substep4GetCurrentState200Response as GetCurrentStateResponseSchema,
  substep4GetAvailableModifiers200Response as GetAvailableModifiersResponseSchema,
  substep4GetRecommendedModifiers200Response as GetRecommendedModifiersResponseSchema,
  substep4GetAvailableEvents200Response as GetAvailableEventsResponseSchema,
  substep4ValidateCurrentState200Response as ValidateCurrentStateResponseSchema,
  substep4ValidateDetailed200Response as ValidateDetailedResponseSchema,
} from '@/shared/api/generated/wizard/zod/aksiApi';

import { z } from 'zod';

// UI форми для Price Calculation
export const basePriceCalculationSchema = z.object({
  basePrice: z.number().min(0, "Базова ціна не може бути від'ємною"),
  quantity: z.number().min(1, 'Кількість повинна бути більше 0'),
  unitOfMeasure: z.string().min(1, 'Оберіть одиницю виміру'),
});

export const modifierSelectionSchema = z.object({
  selectedModifiers: z.array(z.string()).default([]),
  customModifier: z
    .object({
      name: z.string().max(100, 'Назва модифікатора не може перевищувати 100 символів').optional(),
      percentage: z
        .number()
        .min(-100, 'Відсоток не може бути менше -100%')
        .max(1000, 'Відсоток не може перевищувати 1000%')
        .optional(),
      fixedAmount: z.number().min(0, "Фіксована сума не може бути від'ємною").optional(),
    })
    .optional(),
});

export const priceCalculationFormSchema = z.object({
  basePrice: z.number().min(0, "Базова ціна не може бути від'ємною"),
  quantity: z.number().min(1, 'Кількість повинна бути більше 0'),
  selectedModifiers: z.array(z.string()).default([]),
  customModifierName: z
    .string()
    .max(100, 'Назва модифікатора не може перевищувати 100 символів')
    .optional(),
  customModifierPercentage: z
    .number()
    .min(-100, 'Відсоток не може бути менше -100%')
    .max(1000, 'Відсоток не може перевищувати 1000%')
    .optional(),
  customModifierFixedAmount: z.number().min(0, "Фіксована сума не може бути від'ємною").optional(),
  notes: z.string().max(500, 'Примітки не можуть перевищувати 500 символів').optional(),
});

export const discountApplicationSchema = z.object({
  discountType: z.enum(['percentage', 'fixed', 'none'], {
    errorMap: () => ({ message: 'Оберіть тип знижки' }),
  }),
  discountValue: z.number().min(0, "Знижка не може бути від'ємною"),
  discountReason: z
    .string()
    .max(200, 'Причина знижки не може перевищувати 200 символів')
    .optional(),
});

export const urgencyModifierSchema = z.object({
  isUrgent: z.boolean().default(false),
  urgencyLevel: z
    .enum(['normal', 'urgent_48h', 'urgent_24h'], {
      errorMap: () => ({ message: 'Оберіть рівень терміновості' }),
    })
    .default('normal'),
  urgencyMultiplier: z
    .number()
    .min(1, 'Множник терміновості не може бути менше 1')
    .max(3, 'Множник терміновості не може перевищувати 3'),
});

export const priceBreakdownSchema = z.object({
  basePrice: z.number().min(0),
  modifiersTotal: z.number(),
  discountAmount: z.number().min(0),
  urgencyAmount: z.number().min(0),
  subtotal: z.number().min(0),
  finalPrice: z.number().min(0),
  breakdown: z.array(
    z.object({
      name: z.string(),
      type: z.enum(['base', 'modifier', 'discount', 'urgency']),
      value: z.number(),
      percentage: z.number().optional(),
    })
  ),
});

// Додаткові схеми для UI
export const quickModifierSelectionSchema = z.object({
  commonModifiers: z.array(z.string()).min(1, 'Оберіть принаймні один модифікатор'),
});

export const priceValidationSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.string()),
  warnings: z.array(z.string()),
  recommendations: z.array(z.string()),
});

// Типи для UI форм
export type BasePriceCalculationData = z.infer<typeof basePriceCalculationSchema>;
export type ModifierSelectionData = z.infer<typeof modifierSelectionSchema>;
export type PriceCalculationFormData = z.infer<typeof priceCalculationFormSchema>;
export type DiscountApplicationData = z.infer<typeof discountApplicationSchema>;
export type UrgencyModifierData = z.infer<typeof urgencyModifierSchema>;
export type PriceBreakdownData = z.infer<typeof priceBreakdownSchema>;
export type QuickModifierSelectionData = z.infer<typeof quickModifierSelectionSchema>;
export type PriceValidationData = z.infer<typeof priceValidationSchema>;
