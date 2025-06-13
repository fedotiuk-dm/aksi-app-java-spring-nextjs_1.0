// 📋 ПІДЕТАП 2.2: Схеми для характеристик предмета
// Реекспорт Orval схем + локальні UI форми

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів
export type { ItemCharacteristicsDTO, SubstepResultDTO } from '@/shared/api/generated/substep2';

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

// =================== ЛОКАЛЬНІ UI ФОРМИ ===================
import { z } from 'zod';

// Форма для вибору матеріалу
export const materialSelectionFormSchema = z.object({
  materialId: z.string().min(1, 'Оберіть матеріал'),
  customMaterial: z
    .string()
    .max(100, 'Назва матеріалу не може перевищувати 100 символів')
    .optional(),
});

export type MaterialSelectionFormData = z.infer<typeof materialSelectionFormSchema>;

// Форма для вибору кольору
export const colorSelectionFormSchema = z.object({
  colorId: z.string().optional(),
  customColor: z
    .string()
    .min(1, 'Введіть колір')
    .max(50, 'Назва кольору не може перевищувати 50 символів'),
});

export type ColorSelectionFormData = z.infer<typeof colorSelectionFormSchema>;

// Форма для вибору наповнювача
export const fillerSelectionFormSchema = z.object({
  fillerId: z.string().optional(),
  customFiller: z
    .string()
    .max(100, 'Назва наповнювача не може перевищувати 100 символів')
    .optional(),
  isFillerDamaged: z.boolean(),
});

export type FillerSelectionFormData = z.infer<typeof fillerSelectionFormSchema>;

// Форма для вибору ступеня зносу
export const wearLevelSelectionFormSchema = z.object({
  wearLevelId: z.string().min(1, 'Оберіть ступінь зносу'),
  wearPercentage: z
    .number()
    .min(0, 'Відсоток зносу не може бути менше 0')
    .max(100, 'Відсоток зносу не може бути більше 100'),
});

export type WearLevelSelectionFormData = z.infer<typeof wearLevelSelectionFormSchema>;
