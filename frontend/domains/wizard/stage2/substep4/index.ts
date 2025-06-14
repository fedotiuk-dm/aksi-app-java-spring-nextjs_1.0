// 📋 ПІДЕТАП 2.4: Публічне API для калькулятора ціни
// Розрахунок ціни з модифікаторами

// =================== КОНСТАНТИ ===================
export {
  SUBSTEP4_UI_STEPS,
  SUBSTEP4_VALIDATION_RULES,
  SUBSTEP4_UI_LIMITS,
  calculateSubstep4Progress,
  getNextSubstep4Step,
  getPreviousSubstep4Step,
  isFirstSubstep4Step,
  isLastSubstep4Step,
  type Substep4UIStep,
  type Substep4UnitOfMeasure,
  type Substep4ModifierType,
  type Substep4ModifierPriority,
  type Substep4ApiEvent,
} from './constants';

// =================== СХЕМИ ===================
export type {
  // Orval типи
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

  // UI форми типи
  ModifierSelectionFormData,
  PriceCalculationFormData,
  CalculationConfirmationFormData,
  PriceCalculationNavigationFormData,
} from './schemas';

// Експорт UI форм схем
export {
  modifierSelectionFormSchema,
  priceCalculationFormSchema,
  calculationConfirmationFormSchema,
  priceCalculationNavigationFormSchema,
} from './schemas';

// =================== СТОР ===================
export { usePriceCalculationStore, usePriceCalculationSelectors } from './store';

// =================== ГОЛОВНИЙ ХУК ===================
export {
  useSubstep4PriceCalculation,
  type UseSubstep4PriceCalculationReturn,
} from './use-substep4-price-calculation.hook';
