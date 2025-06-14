// 📋 ПІДЕТАП 2.4: Схеми для калькулятора ціни
// Реекспорт Orval схем + локальні UI форми

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів
export type {
  PriceCalculationRequestDTO,
  PriceCalculationResponseDTO,
  PriceDiscountDTO,
  PriceModifierDTO,
  AddModifierRequest,
  InitializeSubstepRequest,
  SubstepResultDTO,
  ModifierRecommendationDTO,
  CalculationDetailsDTO,
  RangeModifierValueDTO,
  FixedModifierQuantityDTO,
} from '@/shared/api/generated/substep4';

// Реекспорт Zod схем для валідації
export {
  // Body схеми
  substep4InitializeSubstepBody as InitializeSubstepBodySchema,
  substep4CalculatePriceBody as CalculatePriceBodySchema,
  substep4AddModifierBody as AddModifierBodySchema,

  // Params схеми
  substep4InitializeSubstepParams as InitializeSubstepParamsSchema,
  substep4AddModifierParams as AddModifierParamsSchema,
  substep4ResetCalculationParams as ResetCalculationParamsSchema,
  substep4ConfirmCalculationParams as ConfirmCalculationParamsSchema,
  substep4CalculateFinalPriceParams as CalculateFinalPriceParamsSchema,
  substep4CalculateBasePriceParams as CalculateBasePriceParamsSchema,
  substep4ValidateCurrentStateParams as ValidateCurrentStateParamsSchema,
  substep4ValidateDetailedParams as ValidateDetailedParamsSchema,
  substep4GetCurrentStateParams as GetCurrentStateParamsSchema,
  substep4SessionExistsParams as SessionExistsParamsSchema,
  substep4GetCurrentDataParams as GetCurrentDataParamsSchema,
  substep4RemoveSessionParams as RemoveSessionParamsSchema,
  substep4RemoveModifierParams as RemoveModifierParamsSchema,
  substep4GetAvailableEventsParams as GetAvailableEventsParamsSchema,

  // QueryParams схеми
  substep4GetAvailableModifiersQueryParams as GetAvailableModifiersQueryParamsSchema,
  substep4GetRecommendedModifiersQueryParams as GetRecommendedModifiersQueryParamsSchema,

  // Response схеми
  substep4InitializeSubstep200Response as InitializeSubstepResponseSchema,
  substep4CalculatePrice200Response as CalculatePriceResponseSchema,
  substep4CalculateFinalPrice200Response as CalculateFinalPriceResponseSchema,
  substep4CalculateBasePrice200Response as CalculateBasePriceResponseSchema,
  substep4AddModifier200Response as AddModifierResponseSchema,
  substep4GetCurrentData200Response as GetCurrentDataResponseSchema,
  substep4GetAvailableModifiers200Response as GetAvailableModifiersResponseSchema,
  substep4GetRecommendedModifiers200Response as GetRecommendedModifiersResponseSchema,
} from '@/shared/api/generated/substep4';

// =================== UI ФОРМИ ===================
// Мінімальні Zod схеми для UI форм (НЕ дублюємо API)

// Форма для вибору модифікаторів
export const modifierSelectionFormSchema = z.object({
  selectedModifierIds: z.array(z.string()),
  rangeValues: z.record(z.string(), z.number().min(0).max(200)),
  fixedQuantities: z.record(z.string(), z.number().min(1).max(100)),
  notes: z.string().max(1000).optional(),
});

// Форма для розрахунку ціни
export const priceCalculationFormSchema = z.object({
  categoryCode: z.string().min(1),
  itemName: z.string().min(1).max(255),
  color: z.string().max(100).optional(),
  quantity: z.number().min(1).max(1000),
  expedited: z.boolean(),
  expeditePercent: z.number().min(0).max(200).optional(),
  discountPercent: z.number().min(0).max(50).optional(),
});

// Форма для підтвердження розрахунку
export const calculationConfirmationFormSchema = z.object({
  finalPriceAccepted: z.boolean(),
  calculationNotes: z.string().max(1000).optional(),
  proceedToNext: z.boolean(),
});

// Форма для навігації
export const priceCalculationNavigationFormSchema = z.object({
  currentStep: z.string(),
  targetStep: z.string().optional(),
  saveProgress: z.boolean(),
});

// =================== ТИПИ UI ФОРМ ===================

export type ModifierSelectionFormData = z.infer<typeof modifierSelectionFormSchema>;
export type PriceCalculationFormData = z.infer<typeof priceCalculationFormSchema>;
export type CalculationConfirmationFormData = z.infer<typeof calculationConfirmationFormSchema>;
export type PriceCalculationNavigationFormData = z.infer<
  typeof priceCalculationNavigationFormSchema
>;
