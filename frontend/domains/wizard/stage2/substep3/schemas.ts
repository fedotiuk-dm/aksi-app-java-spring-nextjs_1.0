// 📋 ПІДЕТАП 2.3: Схеми для забруднень та дефектів
// Реекспорт Orval схем + локальні UI форми

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів
export type {
  StainTypeDTO,
  DefectTypeDTO,
  StainsDefectsDTO,
  SubstepResultDTO,
  OrderItemAddRequest,
} from '@/shared/api/generated/substep3';

// Реекспорт Zod схем для валідації
export {
  // Body схеми
  substep3InitializeSubstepBody as InitializeSubstepBodySchema,

  // Params схеми
  substep3InitializeSubstepParams as InitializeSubstepParamsSchema,
  substep3ProcessStainSelectionParams as ProcessStainSelectionParamsSchema,
  substep3ProcessStainSelectionQueryParams as ProcessStainSelectionQueryParamsSchema,
  substep3ProcessDefectSelectionParams as ProcessDefectSelectionParamsSchema,
  substep3ProcessDefectSelectionQueryParams as ProcessDefectSelectionQueryParamsSchema,
  substep3ProcessDefectNotesParams as ProcessDefectNotesParamsSchema,
  substep3ProcessDefectNotesQueryParams as ProcessDefectNotesQueryParamsSchema,
  substep3CompleteSubstepParams as CompleteSubstepParamsSchema,
  substep3GoBackParams as GoBackParamsSchema,
  substep3GoBackQueryParams as GoBackQueryParamsSchema,
  substep3GetContextParams as GetContextParamsSchema,

  // Response схеми
  substep3InitializeSubstep200Response as InitializeSubstepResponseSchema,
  substep3ProcessStainSelection200Response as ProcessStainSelectionResponseSchema,
  substep3ProcessDefectSelection200Response as ProcessDefectSelectionResponseSchema,
  substep3ProcessDefectNotes200Response as ProcessDefectNotesResponseSchema,
  substep3CompleteSubstep200Response as CompleteSubstepResponseSchema,
  substep3GoBack200Response as GoBackResponseSchema,
  substep3GetAvailableStainTypes200Response as GetAvailableStainTypesResponseSchema,
  substep3GetAvailableDefectTypes200Response as GetAvailableDefectTypesResponseSchema,
  substep3GetContext200Response as GetContextResponseSchema,
} from '@/shared/api/generated/substep3';
