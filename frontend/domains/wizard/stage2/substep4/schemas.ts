// 📋 ПІДЕТАП 2.4: Схеми для калькулятора ціни
// Реекспорт Orval схем + локальні UI форми

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів з унікальними назвами
export type {
  PriceCalculationRequestDTO as Substep4PriceCalculationRequestDTO,
  PriceCalculationResponseDTO as Substep4PriceCalculationResponseDTO,
  PriceDiscountDTO as Substep4PriceDiscountDTO,
  PriceModifierDTO as Substep4PriceModifierDTO,
  AddModifierRequest as Substep4AddModifierRequest,
  InitializeSubstepRequest as Substep4InitializeSubstepRequest,
  SubstepResultDTO as Substep4SubstepResultDTO,
  ModifierRecommendationDTO as Substep4ModifierRecommendationDTO,
  CalculationDetailsDTO as Substep4CalculationDetailsDTO,
  RangeModifierValueDTO as Substep4RangeModifierValueDTO,
  FixedModifierQuantityDTO as Substep4FixedModifierQuantityDTO,
} from '@api/substep4';

// Реекспорт Zod схем для валідації
export {
  // Body схеми
  substep4InitializeSubstepBody as Substep4InitializeSubstepBodySchema,
  substep4CalculatePriceBody as Substep4CalculatePriceBodySchema,
  substep4AddModifierBody as Substep4AddModifierBodySchema,

  // Params схеми
  substep4InitializeSubstepParams as Substep4InitializeSubstepParamsSchema,
  substep4AddModifierParams as Substep4AddModifierParamsSchema,
  substep4ResetCalculationParams as Substep4ResetCalculationParamsSchema,
  substep4ConfirmCalculationParams as Substep4ConfirmCalculationParamsSchema,
  substep4CalculateFinalPriceParams as Substep4CalculateFinalPriceParamsSchema,
  substep4CalculateBasePriceParams as Substep4CalculateBasePriceParamsSchema,
  substep4ValidateCurrentStateParams as Substep4ValidateCurrentStateParamsSchema,
  substep4ValidateDetailedParams as Substep4ValidateDetailedParamsSchema,
  substep4GetCurrentStateParams as Substep4GetCurrentStateParamsSchema,
  substep4SessionExistsParams as Substep4SessionExistsParamsSchema,
  substep4GetCurrentDataParams as Substep4GetCurrentDataParamsSchema,
  substep4RemoveSessionParams as Substep4RemoveSessionParamsSchema,
  substep4RemoveModifierParams as Substep4RemoveModifierParamsSchema,
  substep4GetAvailableEventsParams as Substep4GetAvailableEventsParamsSchema,

  // QueryParams схеми
  substep4GetAvailableModifiersQueryParams as Substep4GetAvailableModifiersQueryParamsSchema,
  substep4GetRecommendedModifiersQueryParams as Substep4GetRecommendedModifiersQueryParamsSchema,

  // Response схеми
  substep4InitializeSubstep200Response as Substep4InitializeSubstepResponseSchema,
  substep4CalculatePrice200Response as Substep4CalculatePriceResponseSchema,
  substep4CalculateFinalPrice200Response as Substep4CalculateFinalPriceResponseSchema,
  substep4CalculateBasePrice200Response as Substep4CalculateBasePriceResponseSchema,
  substep4AddModifier200Response as Substep4AddModifierResponseSchema,
  substep4GetCurrentData200Response as Substep4GetCurrentDataResponseSchema,
  substep4GetAvailableModifiers200Response as Substep4GetAvailableModifiersResponseSchema,
  substep4GetRecommendedModifiers200Response as Substep4GetRecommendedModifiersResponseSchema,
} from '@api/substep4';

// =================== UI ФОРМИ ===================
// Мінімальні Zod схеми для UI форм (НЕ дублюємо API)

// Форма для вибору модифікаторів
export const substep4ModifierSelectionFormSchema = z.object({
  selectedModifierIds: z.array(z.string()),
  rangeValues: z.record(z.string(), z.number().min(0).max(200)),
  fixedQuantities: z.record(z.string(), z.number().min(1).max(100)),
  notes: z.string().max(1000).optional(),
});

// Форма для розрахунку ціни
export const substep4PriceCalculationFormSchema = z.object({
  categoryCode: z.string().min(1),
  itemName: z.string().min(1).max(255),
  color: z.string().max(100).optional(),
  quantity: z.number().min(1).max(1000),
  expedited: z.boolean(),
  expeditePercent: z.number().min(0).max(200).optional(),
  discountPercent: z.number().min(0).max(50).optional(),
});

// Форма для підтвердження розрахунку
export const substep4CalculationConfirmationFormSchema = z.object({
  finalPriceAccepted: z.boolean(),
  calculationNotes: z.string().max(1000).optional(),
  proceedToNext: z.boolean(),
});

// Форма для навігації
export const substep4PriceCalculationNavigationFormSchema = z.object({
  currentStep: z.string(),
  targetStep: z.string().optional(),
  saveProgress: z.boolean(),
});

// =================== ТИПИ UI ФОРМ ===================

export type Substep4ModifierSelectionFormData = z.infer<typeof substep4ModifierSelectionFormSchema>;
export type Substep4PriceCalculationFormData = z.infer<typeof substep4PriceCalculationFormSchema>;
export type Substep4CalculationConfirmationFormData = z.infer<
  typeof substep4CalculationConfirmationFormSchema
>;
export type Substep4PriceCalculationNavigationFormData = z.infer<
  typeof substep4PriceCalculationNavigationFormSchema
>;
