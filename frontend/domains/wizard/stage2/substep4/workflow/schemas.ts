// Substep4 Workflow Schemas - ТІЛЬКИ Orval схеми + мінімальні UI форми
// Використовуємо готові схеми з @/shared/api/generated/substep4

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================
// Реекспорт готових схем з читабельними назвами
export type {
  substep4InitializeSubstepParams as InitializeSubstepParamsSchema,
  substep4CalculateBasePriceParams as CalculatePriceParamsSchema,
  substep4AddModifierParams as AddModifierParamsSchema,
  substep4RemoveModifierParams as RemoveModifierParamsSchema,
  substep4ConfirmCalculationParams as ConfirmCalculationParamsSchema,
  substep4ResetCalculationParams as ResetCalculationParamsSchema,
} from '@/shared/api/generated/substep4';

// Response схеми (основні DTO)
export type {
  PriceDiscountDTO as PriceDiscountSchema,
  PriceCalculationRequestDTO as PriceCalculationRequestSchema,
  PriceCalculationResponseDTO as PriceCalculationResponseSchema,
  PriceModifierDTO as PriceModifierSchema,
  RangeModifierValueDTO as RangeModifierValueSchema,
  FixedModifierQuantityDTO as FixedModifierQuantitySchema,
  CalculationDetailsDTO as CalculationDetailsSchema,
  AddModifierRequest as AddModifierRequestSchema,
  SubstepResultDTO as SubstepResultSchema,
  ErrorResponse as ErrorResponseSchema,
  // Параметри для запитів
  Substep4GetAvailableModifiersParams,
  Substep4GetRecommendedModifiersParams,
} from '@/shared/api/generated/substep4';

// =================== UI ФОРМИ ===================
// Мінімальні Zod схеми для workflow UI форм

// Форма ініціалізації workflow
export const workflowInitializationFormSchema = z.object({
  sessionId: z.string().min(1),
  orderId: z.string().min(1),
  itemId: z.string().min(1),
  startFromStep: z.string().optional(),
});

// Форма навігації workflow
export const workflowNavigationFormSchema = z.object({
  currentStep: z.string(),
  targetStep: z.string(),
  saveProgress: z.boolean(),
  skipValidation: z.boolean().optional(),
});

// Форма завершення workflow
export const workflowCompletionFormSchema = z.object({
  finalPrice: z.number().min(0),
  calculationConfirmed: z.boolean(),
  proceedToNext: z.boolean(),
  notes: z.string().max(1000).optional(),
});

// =================== ТИПИ UI ФОРМ ===================

export type WorkflowInitializationFormData = z.infer<typeof workflowInitializationFormSchema>;
export type WorkflowNavigationFormData = z.infer<typeof workflowNavigationFormSchema>;
export type WorkflowCompletionFormData = z.infer<typeof workflowCompletionFormSchema>;

// =================== ТИПИ RESPONSE ===================
// Реекспорт типів з читабельними назвами
export type {
  PriceDiscountDTO as PriceDiscountResponse,
  PriceCalculationRequestDTO as PriceCalculationRequestResponse,
  PriceCalculationResponseDTO as PriceCalculationResponseResponse,
  PriceModifierDTO as PriceModifierResponse,
  RangeModifierValueDTO as RangeModifierValueResponse,
  FixedModifierQuantityDTO as FixedModifierQuantityResponse,
  CalculationDetailsDTO as CalculationDetailsResponse,
  AddModifierRequest as AddModifierRequestResponse,
  SubstepResultDTO as SubstepResultResponse,
  ErrorResponse as ErrorResponse,
} from '@/shared/api/generated/substep4';
