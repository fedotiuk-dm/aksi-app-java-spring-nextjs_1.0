// 📋 ПІДЕТАП 2.2: Схеми для характеристик предмета
// Реекспорт Orval схем + локальні UI форми

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів
export type {
  OrderItemDTO,
  AdditionalInfoDTO,
  SubstepResultDTO,
} from '@/shared/api/generated/substep2';

// Реекспорт Zod схем для валідації
export {
  // Params схеми
  substep2InitializeSubstepParams as InitializeSubstepParamsSchema,
  substep2InitializeSubstepQueryParams as InitializeSubstepQueryParamsSchema,
  substep2SelectMaterialParams as SelectMaterialParamsSchema,
  substep2SelectMaterialQueryParams as SelectMaterialQueryParamsSchema,
  substep2SelectColorParams as SelectColorParamsSchema,
  substep2SelectColorQueryParams as SelectColorQueryParamsSchema,
  substep2SelectFillerParams as SelectFillerParamsSchema,
  substep2SelectFillerQueryParams as SelectFillerQueryParamsSchema,
  substep2SelectWearLevelParams as SelectWearLevelParamsSchema,
  substep2SelectWearLevelQueryParams as SelectWearLevelQueryParamsSchema,
  substep2ValidateCharacteristicsParams as ValidateCharacteristicsParamsSchema,
  substep2CompleteSubstepParams as CompleteSubstepParamsSchema,
  substep2CancelSubstepParams as CancelSubstepParamsSchema,
  substep2GetAvailableMaterialsParams as GetAvailableMaterialsParamsSchema,
  substep2GetCurrentCharacteristicsParams as GetCurrentCharacteristicsParamsSchema,

  // Response схеми
  substep2InitializeSubstep200Response as InitializeSubstepResponseSchema,
  substep2SelectMaterial200Response as SelectMaterialResponseSchema,
  substep2SelectColor200Response as SelectColorResponseSchema,
  substep2SelectFiller200Response as SelectFillerResponseSchema,
  substep2SelectWearLevel200Response as SelectWearLevelResponseSchema,
  substep2ValidateCharacteristics200Response as ValidateCharacteristicsResponseSchema,
  substep2CompleteSubstep200Response as CompleteSubstepResponseSchema,
  substep2GetAvailableMaterials200Response as GetAvailableMaterialsResponseSchema,
  substep2GetCurrentCharacteristics200Response as GetCurrentCharacteristicsResponseSchema,
} from '@/shared/api/generated/substep2';

// =================== ТИПИ ===================
// Реекспорт типів з читабельними назвами
export type {
  Substep2SelectMaterialParams as SelectMaterialParams,
  Substep2SelectColorParams as SelectColorParams,
  Substep2SelectFillerParams as SelectFillerParams,
  Substep2SelectWearLevelParams as SelectWearLevelParams,
} from '@/shared/api/generated/substep2';

// Response типи
export type {
  OrderItemDTO as ItemCharacteristicsResponse,
  AdditionalInfoDTO as AdditionalInfoResponse,
  SubstepResultDTO as SubstepResultResponse,
} from '@/shared/api/generated/substep2';

// =================== МІНІМАЛЬНІ UI ФОРМИ ===================

const SEARCH_VALIDATION_MESSAGE = 'Мінімум 2 символи для пошуку';

// Форма пошуку матеріалу
export const materialSearchFormSchema = z.object({
  searchTerm: z.string().min(2, SEARCH_VALIDATION_MESSAGE),
});

export type MaterialSearchFormData = z.infer<typeof materialSearchFormSchema>;

// Форма пошуку кольору
export const colorSearchFormSchema = z.object({
  searchTerm: z.string().min(2, SEARCH_VALIDATION_MESSAGE),
});

export type ColorSearchFormData = z.infer<typeof colorSearchFormSchema>;

// Форма пошуку наповнювача
export const fillerSearchFormSchema = z.object({
  searchTerm: z.string().min(2, SEARCH_VALIDATION_MESSAGE),
});

export type FillerSearchFormData = z.infer<typeof fillerSearchFormSchema>;

// Форма налаштувань відображення
export const displaySettingsFormSchema = z.object({
  showMaterialDetails: z.boolean().default(false),
  showColorDetails: z.boolean().default(false),
  showFillerDetails: z.boolean().default(false),
  showWearLevelDetails: z.boolean().default(false),
});

export type DisplaySettingsFormData = z.infer<typeof displaySettingsFormSchema>;
