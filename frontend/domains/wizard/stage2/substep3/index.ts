// 📋 ПІДЕТАП 2.3: Публічне API для забруднень та дефектів
// Композиційний підхід з експортом головного хука та допоміжних типів

// =================== ГОЛОВНИЙ ХУК ===================
export { useSubstep3StainsDefects } from './use-substep3-stains-defects.hook';
export type { UseSubstep3StainsDefectsReturn } from './use-substep3-stains-defects.hook';

// =================== КОНСТАНТИ ===================
export {
  SUBSTEP3_UI_STEPS,
  SUBSTEP3_VALIDATION_RULES,
  SUBSTEP3_LIMITS,
  SUBSTEP3_STEP_LABELS,
  SUBSTEP3_API_STATE_LABELS,
  calculateSubstep3Progress,
  getNextSubstep3Step,
  getPreviousSubstep3Step,
  type Substep3UIStep,
} from './constants';

// =================== СТОР (якщо потрібен прямий доступ) ===================
export { useStainsDefectsStore, useStainsDefectsSelectors } from './store';

// =================== СХЕМИ ТА ТИПИ ===================
export {
  // Orval Zod схеми з унікальними назвами
  Substep3InitializeSubstepBodySchema,
  Substep3ProcessStainSelectionParamsSchema,
  Substep3ProcessStainSelectionQueryParamsSchema,
  Substep3ProcessDefectSelectionParamsSchema,
  Substep3ProcessDefectSelectionQueryParamsSchema,
  Substep3ProcessDefectNotesParamsSchema,
  Substep3ProcessDefectNotesQueryParamsSchema,
  Substep3CompleteSubstepParamsSchema,
  Substep3GoBackParamsSchema,
  Substep3InitializeSubstepResponseSchema,
  Substep3ProcessStainSelectionResponseSchema,
  Substep3ProcessDefectSelectionResponseSchema,
  Substep3ProcessDefectNotesResponseSchema,
  Substep3CompleteSubstepResponseSchema,
  Substep3GoBackResponseSchema,
  Substep3GetAvailableStainTypesResponseSchema,
  Substep3GetAvailableDefectTypesResponseSchema,
  Substep3GetContextResponseSchema,

  // UI форми з унікальними назвами
  substep3StainSelectionFormSchema,
  substep3DefectSelectionFormSchema,
  substep3DefectNotesFormSchema,
  substep3DisplaySettingsFormSchema,
} from './schemas';

export type {
  // Orval TypeScript типи з унікальними назвами
  Substep3StainTypeDTO,
  Substep3DefectTypeDTO,
  Substep3StainsDefectsDTO,
  Substep3SubstepResultDTO,
  Substep3OrderItemAddRequest,
  Substep3StainsDefectsContext,
  Substep3StainsDefectsContextCurrentState,

  // UI форми типи з унікальними назвами
  Substep3StainSelectionFormData,
  Substep3DefectSelectionFormData,
  Substep3DefectNotesFormData,
  Substep3DisplaySettingsFormData,
} from './schemas';
