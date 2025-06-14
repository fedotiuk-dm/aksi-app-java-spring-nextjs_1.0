// 📋 ПІДЕТАП 2.2: Публічне API для характеристик предмета
// Композиційний підхід з експортом головного хука та допоміжних типів

// =================== ГОЛОВНИЙ ХУК ===================
export { useSubstep2ItemCharacteristics } from './use-substep2-item-characteristics.hook';
export type { UseSubstep2ItemCharacteristicsReturn } from './use-substep2-item-characteristics.hook';

// =================== КОНСТАНТИ ===================
export {
  SUBSTEP2_UI_STEPS,
  SUBSTEP2_STEP_ORDER,
  SUBSTEP2_VALIDATION_RULES,
  SUBSTEP2_LIMITS,
  calculateSubstep2Progress,
  getNextSubstep2Step,
  getPreviousSubstep2Step,
  isFirstSubstep2Step,
  isLastSubstep2Step,
  type Substep2UIStep,
} from './constants';

// =================== СТОР (якщо потрібен прямий доступ) ===================
export { useItemCharacteristicsStore, useItemCharacteristicsSelectors } from './store';

// =================== СХЕМИ ТА ТИПИ ===================
export {
  // Orval Zod схеми з унікальними назвами
  Substep2InitializeSubstepParamsSchema,
  Substep2InitializeSubstepQueryParamsSchema,
  Substep2SelectMaterialParamsSchema,
  Substep2SelectMaterialQueryParamsSchema,
  Substep2SelectColorParamsSchema,
  Substep2SelectColorQueryParamsSchema,
  Substep2InitializeSubstepResponseSchema,
  Substep2SelectMaterialResponseSchema,
  Substep2SelectColorResponseSchema,
  Substep2SelectFillerResponseSchema,
  Substep2SelectWearLevelResponseSchema,
  Substep2ValidateCharacteristicsResponseSchema,
  Substep2CompleteSubstepResponseSchema,
  Substep2GetAvailableMaterialsResponseSchema,
  Substep2GetCurrentCharacteristicsResponseSchema,

  // UI форми з унікальними назвами
  substep2MaterialSearchFormSchema,
  substep2ColorSearchFormSchema,
  substep2FillerSearchFormSchema,
  substep2DisplaySettingsFormSchema,
} from './schemas';

export type {
  // Orval TypeScript типи з унікальними назвами
  Substep2OrderItemDTO,
  Substep2AdditionalInfoDTO,
  Substep2SubstepResultDTO,

  // UI форми типи з унікальними назвами
  Substep2MaterialSearchFormData,
  Substep2ColorSearchFormData,
  Substep2FillerSearchFormData,
  Substep2DisplaySettingsFormData,
} from './schemas';
