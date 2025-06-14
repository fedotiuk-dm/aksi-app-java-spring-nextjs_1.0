// 📋 ПІДЕТАП 2.3: Схеми для забруднень та дефектів
// Реекспорт Orval схем + локальні UI форми

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів
export type {
  StainTypeDTO,
  DefectTypeDTO,
  StainsDefectsDTO,
  SubstepResultDTO,
  OrderItemAddRequest,
  StainsDefectsContext,
  StainsDefectsContextCurrentState,
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

// =================== ЛОКАЛЬНІ UI ФОРМИ ===================
// Мінімальні схеми для UI компонентів (НЕ дублюємо API)

// Форма вибору забруднень
export const stainSelectionFormSchema = z.object({
  selectedStains: z.array(z.string()).min(1, 'Оберіть принаймні одне забруднення'),
  otherStains: z.string().optional(),
});

export type StainSelectionFormData = z.infer<typeof stainSelectionFormSchema>;

// Форма вибору дефектів
export const defectSelectionFormSchema = z
  .object({
    selectedDefects: z.array(z.string()),
    noGuaranteeReason: z.string().optional(),
  })
  .refine((data) => data.selectedDefects.length > 0 || !!data.noGuaranteeReason, {
    message: 'Оберіть дефекти або вкажіть причину відсутності гарантії',
    path: ['selectedDefects'],
  });

export type DefectSelectionFormData = z.infer<typeof defectSelectionFormSchema>;

// Форма приміток до дефектів
export const defectNotesFormSchema = z.object({
  defectNotes: z
    .string()
    .min(10, 'Примітки повинні містити мінімум 10 символів')
    .max(1000, 'Примітки не можуть перевищувати 1000 символів'),
});

export type DefectNotesFormData = z.infer<typeof defectNotesFormSchema>;

// Форма налаштувань відображення
export const displaySettingsFormSchema = z.object({
  showRiskLevels: z.boolean().default(true),
  groupByCategory: z.boolean().default(false),
  showDescriptions: z.boolean().default(true),
});

export type DisplaySettingsFormData = z.infer<typeof displaySettingsFormSchema>;
