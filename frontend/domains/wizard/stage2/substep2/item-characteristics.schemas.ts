// Експорт готових Orval схем для Substep2 Item Characteristics
export {
  substep2InitializeSubstepParams as InitializeSubstepParamsSchema,
  substep2InitializeSubstep200Response as InitializeSubstepResponseSchema,
  substep2SelectMaterialParams as SelectMaterialParamsSchema,
  substep2SelectMaterial200Response as SelectMaterialResponseSchema,
  substep2SelectColorParams as SelectColorParamsSchema,
  substep2SelectColor200Response as SelectColorResponseSchema,
  substep2SelectFillerParams as SelectFillerParamsSchema,
  substep2SelectFiller200Response as SelectFillerResponseSchema,
  substep2SelectWearLevelParams as SelectWearLevelParamsSchema,
  substep2SelectWearLevel200Response as SelectWearLevelResponseSchema,
  substep2CompleteSubstep200Response as CompleteSubstepResponseSchema,
  substep2GetCurrentCharacteristics200Response as GetCurrentStateResponseSchema,
} from '@/shared/api/generated/wizard/zod/aksiApi';

import { z } from 'zod';

// UI форми для Item Characteristics
export const materialSelectionSchema = z.object({
  materialId: z.string().min(1, 'Оберіть матеріал'),
});

export const colorSelectionSchema = z.object({
  color: z.string().min(1, 'Введіть або оберіть колір'),
  isCustomColor: z.boolean().default(false),
});

export const fillerSelectionSchema = z.object({
  fillerType: z.string().optional(),
  isFillerDamaged: z.boolean().default(false),
  hasNoFiller: z.boolean().default(false),
});

export const wearLevelSelectionSchema = z.object({
  wearPercentage: z
    .number()
    .min(0, 'Ступінь зносу не може бути менше 0%')
    .max(100, 'Ступінь зносу не може бути більше 100%'),
});

export const itemCharacteristicsFormSchema = z.object({
  materialId: z.string().min(1, 'Оберіть матеріал'),
  color: z.string().min(1, 'Введіть або оберіть колір'),
  isCustomColor: z.boolean().default(false),
  fillerType: z.string().optional(),
  isFillerDamaged: z.boolean().default(false),
  hasNoFiller: z.boolean().default(false),
  wearPercentage: z.number().min(0).max(100),
  notes: z.string().max(500, 'Примітки не можуть перевищувати 500 символів').optional(),
});

// Додаткові схеми для UI
export const quickColorSelectionSchema = z.object({
  selectedColors: z.array(z.string()).min(1, 'Оберіть принаймні один колір'),
});

export const materialFilterSchema = z.object({
  categoryId: z.string().optional(),
  searchTerm: z.string().optional(),
  showOnlyAvailable: z.boolean().default(true),
});

// Типи для UI форм
export type MaterialSelectionData = z.infer<typeof materialSelectionSchema>;
export type ColorSelectionData = z.infer<typeof colorSelectionSchema>;
export type FillerSelectionData = z.infer<typeof fillerSelectionSchema>;
export type WearLevelSelectionData = z.infer<typeof wearLevelSelectionSchema>;
export type ItemCharacteristicsFormData = z.infer<typeof itemCharacteristicsFormSchema>;
export type QuickColorSelectionData = z.infer<typeof quickColorSelectionSchema>;
export type MaterialFilterData = z.infer<typeof materialFilterSchema>;
