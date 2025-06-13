// 📋 ПІДЕТАП 2.4: Схеми для калькулятора ціни
// Реекспорт Orval схем + локальні UI форми

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
