// 📋 ПІДЕТАП 2.3: Схеми для забруднень та дефектів
// Реекспорт Orval схем + локальні UI форми

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів з унікальними назвами
export type {
  StainTypeDTO as Substep3StainTypeDTO,
  DefectTypeDTO as Substep3DefectTypeDTO,
  StainsDefectsDTO as Substep3StainsDefectsDTO,
  SubstepResultDTO as Substep3SubstepResultDTO,
  OrderItemAddRequest as Substep3OrderItemAddRequest,
  StainsDefectsContext as Substep3StainsDefectsContext,
  StainsDefectsContextCurrentState as Substep3StainsDefectsContextCurrentState,
} from '@api/substep3';

// Реекспорт Zod схем для валідації
export {
  // Body схеми
  substep3InitializeSubstepBody as Substep3InitializeSubstepBodySchema,

  // Params схеми
  substep3InitializeSubstepParams as Substep3InitializeSubstepParamsSchema,
  substep3ProcessStainSelectionParams as Substep3ProcessStainSelectionParamsSchema,
  substep3ProcessStainSelectionQueryParams as Substep3ProcessStainSelectionQueryParamsSchema,
  substep3ProcessDefectSelectionParams as Substep3ProcessDefectSelectionParamsSchema,
  substep3ProcessDefectSelectionQueryParams as Substep3ProcessDefectSelectionQueryParamsSchema,
  substep3ProcessDefectNotesParams as Substep3ProcessDefectNotesParamsSchema,
  substep3ProcessDefectNotesQueryParams as Substep3ProcessDefectNotesQueryParamsSchema,
  substep3CompleteSubstepParams as Substep3CompleteSubstepParamsSchema,
  substep3GoBackParams as Substep3GoBackParamsSchema,
  substep3GoBackQueryParams as Substep3GoBackQueryParamsSchema,
  substep3GetContextParams as Substep3GetContextParamsSchema,

  // Response схеми
  substep3InitializeSubstep200Response as Substep3InitializeSubstepResponseSchema,
  substep3ProcessStainSelection200Response as Substep3ProcessStainSelectionResponseSchema,
  substep3ProcessDefectSelection200Response as Substep3ProcessDefectSelectionResponseSchema,
  substep3ProcessDefectNotes200Response as Substep3ProcessDefectNotesResponseSchema,
  substep3CompleteSubstep200Response as Substep3CompleteSubstepResponseSchema,
  substep3GoBack200Response as Substep3GoBackResponseSchema,
  substep3GetAvailableStainTypes200Response as Substep3GetAvailableStainTypesResponseSchema,
  substep3GetAvailableDefectTypes200Response as Substep3GetAvailableDefectTypesResponseSchema,
  substep3GetContext200Response as Substep3GetContextResponseSchema,
} from '@api/substep3';

// =================== ЛОКАЛЬНІ UI ФОРМИ ===================
// Мінімальні схеми для UI компонентів (НЕ дублюємо API)

// Форма вибору забруднень
export const substep3StainSelectionFormSchema = z.object({
  selectedStains: z.array(z.string()).min(1, 'Оберіть принаймні одне забруднення'),
  otherStains: z.string().optional(),
});

export type Substep3StainSelectionFormData = z.infer<typeof substep3StainSelectionFormSchema>;

// Форма вибору дефектів
export const substep3DefectSelectionFormSchema = z
  .object({
    selectedDefects: z.array(z.string()),
    noGuaranteeReason: z.string().optional(),
  })
  .refine((data) => data.selectedDefects.length > 0 || !!data.noGuaranteeReason, {
    message: 'Оберіть дефекти або вкажіть причину відсутності гарантії',
    path: ['selectedDefects'],
  });

export type Substep3DefectSelectionFormData = z.infer<typeof substep3DefectSelectionFormSchema>;

// Форма приміток до дефектів
export const substep3DefectNotesFormSchema = z.object({
  defectNotes: z
    .string()
    .min(10, 'Примітки повинні містити мінімум 10 символів')
    .max(1000, 'Примітки не можуть перевищувати 1000 символів'),
});

export type Substep3DefectNotesFormData = z.infer<typeof substep3DefectNotesFormSchema>;

// Форма налаштувань відображення
export const substep3DisplaySettingsFormSchema = z.object({
  showRiskLevels: z.boolean(),
  groupByCategory: z.boolean(),
  showDescriptions: z.boolean(),
});

export type Substep3DisplaySettingsFormData = z.infer<typeof substep3DisplaySettingsFormSchema>;
