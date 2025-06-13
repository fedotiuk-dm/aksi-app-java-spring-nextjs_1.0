// Публічне API для Substep4 домену
// Експортуємо тільки головний хук та Orval схеми

// =================== ГОЛОВНИЙ ХУК ===================
export { useSubstep4PriceCalculation } from './use-substep4-price-calculation.hook';
export type { UseSubstep4PriceCalculationReturn } from './use-substep4-price-calculation.hook';

// =================== ORVAL СХЕМИ (якщо потрібні в UI) ===================
export {
  // TypeScript типи
  type PriceCalculationRequestDTO,
  type PriceCalculationResponseDTO,
  type PriceDiscountDTO,
  type PriceModifierDTO,
  type AddModifierRequest,
  type InitializeSubstepRequest,
  type SubstepResultDTO,
  type ModifierRecommendationDTO,

  // Zod схеми
  InitializeSubstepBodySchema,
  CalculatePriceBodySchema,
  AddModifierBodySchema,
  InitializeSubstepParamsSchema,
  AddModifierParamsSchema,
  ResetCalculationParamsSchema,
  ConfirmCalculationParamsSchema,
  CalculateFinalPriceParamsSchema,
  CalculateBasePriceParamsSchema,
  ValidateCurrentStateParamsSchema,
  ValidateDetailedParamsSchema,
  GetCurrentStateParamsSchema,
  SessionExistsParamsSchema,
  GetCurrentDataParamsSchema,
  RemoveSessionParamsSchema,
  RemoveModifierParamsSchema,
  GetAvailableEventsParamsSchema,
  GetAvailableModifiersQueryParamsSchema,
  GetRecommendedModifiersQueryParamsSchema,
  InitializeSubstepResponseSchema,
  CalculatePriceResponseSchema,
  CalculateFinalPriceResponseSchema,
  CalculateBasePriceResponseSchema,
  AddModifierResponseSchema,
  GetCurrentDataResponseSchema,
  GetAvailableModifiersResponseSchema,
  GetRecommendedModifiersResponseSchema,
} from './schemas';
