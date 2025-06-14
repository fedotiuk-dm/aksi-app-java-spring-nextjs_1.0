// 📋 ПІДЕТАП 2.2: Схеми для характеристик предмета
// Реекспорт Orval схем + локальні UI форми

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів з унікальними назвами
export type {
  OrderItemDTO as Substep2OrderItemDTO,
  AdditionalInfoDTO as Substep2AdditionalInfoDTO,
  SubstepResultDTO as Substep2SubstepResultDTO,
} from '@api/substep2';

// Реекспорт Zod схем для валідації
export {
  // Params схеми
  substep2InitializeSubstepParams as Substep2InitializeSubstepParamsSchema,
  substep2InitializeSubstepQueryParams as Substep2InitializeSubstepQueryParamsSchema,
  substep2SelectMaterialParams as Substep2SelectMaterialParamsSchema,
  substep2SelectMaterialQueryParams as Substep2SelectMaterialQueryParamsSchema,
  substep2SelectColorParams as Substep2SelectColorParamsSchema,
  substep2SelectColorQueryParams as Substep2SelectColorQueryParamsSchema,
  substep2SelectFillerParams as Substep2SelectFillerParamsSchema,
  substep2SelectFillerQueryParams as Substep2SelectFillerQueryParamsSchema,
  substep2SelectWearLevelParams as Substep2SelectWearLevelParamsSchema,
  substep2SelectWearLevelQueryParams as Substep2SelectWearLevelQueryParamsSchema,
  substep2ValidateCharacteristicsParams as Substep2ValidateCharacteristicsParamsSchema,
  substep2CompleteSubstepParams as Substep2CompleteSubstepParamsSchema,
  substep2CancelSubstepParams as Substep2CancelSubstepParamsSchema,
  substep2GetAvailableMaterialsParams as Substep2GetAvailableMaterialsParamsSchema,
  substep2GetCurrentCharacteristicsParams as Substep2GetCurrentCharacteristicsParamsSchema,

  // Response схеми
  substep2InitializeSubstep200Response as Substep2InitializeSubstepResponseSchema,
  substep2SelectMaterial200Response as Substep2SelectMaterialResponseSchema,
  substep2SelectColor200Response as Substep2SelectColorResponseSchema,
  substep2SelectFiller200Response as Substep2SelectFillerResponseSchema,
  substep2SelectWearLevel200Response as Substep2SelectWearLevelResponseSchema,
  substep2ValidateCharacteristics200Response as Substep2ValidateCharacteristicsResponseSchema,
  substep2CompleteSubstep200Response as Substep2CompleteSubstepResponseSchema,
  substep2GetAvailableMaterials200Response as Substep2GetAvailableMaterialsResponseSchema,
  substep2GetCurrentCharacteristics200Response as Substep2GetCurrentCharacteristicsResponseSchema,
} from '@api/substep2';

// =================== ТИПИ ===================
// Реекспорт типів з читабельними назвами
export type {
  Substep2SelectMaterialParams,
  Substep2SelectColorParams,
  Substep2SelectFillerParams,
  Substep2SelectWearLevelParams,
} from '@api/substep2';

// Response типи
export type {
  OrderItemDTO as Substep2ItemCharacteristicsResponse,
  AdditionalInfoDTO as Substep2AdditionalInfoResponse,
  SubstepResultDTO as Substep2SubstepResultResponse,
} from '@api/substep2';

// =================== МІНІМАЛЬНІ UI ФОРМИ ===================

const SEARCH_VALIDATION_MESSAGE = 'Мінімум 2 символи для пошуку';

// Форма пошуку матеріалу
export const substep2MaterialSearchFormSchema = z.object({
  searchTerm: z.string().min(2, SEARCH_VALIDATION_MESSAGE),
});

export type Substep2MaterialSearchFormData = z.infer<typeof substep2MaterialSearchFormSchema>;

// Форма пошуку кольору
export const substep2ColorSearchFormSchema = z.object({
  searchTerm: z.string().min(2, SEARCH_VALIDATION_MESSAGE),
});

export type Substep2ColorSearchFormData = z.infer<typeof substep2ColorSearchFormSchema>;

// Форма пошуку наповнювача
export const substep2FillerSearchFormSchema = z.object({
  searchTerm: z.string().min(2, SEARCH_VALIDATION_MESSAGE),
});

export type Substep2FillerSearchFormData = z.infer<typeof substep2FillerSearchFormSchema>;

// Форма налаштувань відображення
export const substep2DisplaySettingsFormSchema = z.object({
  showMaterialDetails: z.boolean(),
  showColorDetails: z.boolean(),
  showFillerDetails: z.boolean(),
  showWearLevelDetails: z.boolean(),
});

export type Substep2DisplaySettingsFormData = z.infer<typeof substep2DisplaySettingsFormSchema>;
