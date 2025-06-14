// 📋 ПІДЕТАП 2.3: Публічне API домену - забруднення та дефекти
// Експорт тільки необхідних елементів для використання в UI компонентах

// ✅ Головний хук - єдина точка входу
export { useSubstep3StainsDefects } from './use-substep3-stains-defects.hook';
export type { UseSubstep3StainsDefectsReturn } from './use-substep3-stains-defects.hook';

// =================== КОНСТАНТИ (якщо потрібні в UI) ===================
export {
  SUBSTEP3_UI_STEPS,
  SUBSTEP3_STEP_LABELS,
  SUBSTEP3_LIMITS,
  type Substep3UIStep,
} from './constants';

// =================== ORVAL СХЕМИ (якщо потрібні в UI) ===================
export {
  // TypeScript типи
  type StainTypeDTO,
  type DefectTypeDTO,
  type SubstepResultDTO,
  type StainsDefectsDTO,
  type StainsDefectsContext,

  // Zod схеми
  InitializeSubstepBodySchema,
  ProcessStainSelectionParamsSchema,
  ProcessDefectSelectionParamsSchema,
  ProcessDefectNotesParamsSchema,
  GoBackParamsSchema,
  GetAvailableStainTypesResponseSchema,
  GetAvailableDefectTypesResponseSchema,
  GetContextParamsSchema,
  InitializeSubstepResponseSchema,
  ProcessStainSelectionResponseSchema,
  ProcessDefectSelectionResponseSchema,
  ProcessDefectNotesResponseSchema,
  GoBackResponseSchema,
  GetContextResponseSchema,
} from './schemas';

// =================== UI ФОРМИ (якщо потрібні в UI) ===================
export {
  stainSelectionFormSchema,
  defectSelectionFormSchema,
  defectNotesFormSchema,
  displaySettingsFormSchema,
  type StainSelectionFormData,
  type DefectSelectionFormData,
  type DefectNotesFormData,
  type DisplaySettingsFormData,
} from './schemas';
