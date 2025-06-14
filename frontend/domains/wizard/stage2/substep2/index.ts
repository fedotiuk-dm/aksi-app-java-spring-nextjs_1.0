// 📋 ПІДЕТАП 2.2: Публічне API для характеристик предмета
// Експортуємо головний хук, константи та схеми

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

// =================== ORVAL СХЕМИ (якщо потрібні в UI) ===================
export {
  // TypeScript типи
  type OrderItemDTO,
  type AdditionalInfoDTO,
  type SubstepResultDTO,
  type SelectMaterialParams,
  type SelectColorParams,
  type SelectFillerParams,
  type SelectWearLevelParams,
  type ItemCharacteristicsResponse,
  type AdditionalInfoResponse,
  type SubstepResultResponse,

  // Zod схеми
  InitializeSubstepParamsSchema,
  InitializeSubstepQueryParamsSchema,
  SelectMaterialParamsSchema,
  SelectMaterialQueryParamsSchema,
  SelectColorParamsSchema,
  SelectColorQueryParamsSchema,
  SelectFillerParamsSchema,
  SelectFillerQueryParamsSchema,
  SelectWearLevelParamsSchema,
  SelectWearLevelQueryParamsSchema,
  ValidateCharacteristicsParamsSchema,
  CompleteSubstepParamsSchema,
  GetAvailableMaterialsParamsSchema,
  GetCurrentCharacteristicsParamsSchema,
  InitializeSubstepResponseSchema,
  SelectMaterialResponseSchema,
  SelectColorResponseSchema,
  SelectFillerResponseSchema,
  SelectWearLevelResponseSchema,
  ValidateCharacteristicsResponseSchema,
  CompleteSubstepResponseSchema,
  GetAvailableMaterialsResponseSchema,
  GetCurrentCharacteristicsResponseSchema,
} from './schemas';

// =================== UI ФОРМИ (якщо потрібні в UI) ===================
export {
  materialSearchFormSchema,
  colorSearchFormSchema,
  fillerSearchFormSchema,
  displaySettingsFormSchema,
  type MaterialSearchFormData,
  type ColorSearchFormData,
  type FillerSearchFormData,
  type DisplaySettingsFormData,
} from './schemas';
