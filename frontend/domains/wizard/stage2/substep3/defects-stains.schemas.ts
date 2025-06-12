// Експорт готових Orval схем для Substep3 Defects & Stains
export {
  substep3InitializeSubstepParams as InitializeSubstepParamsSchema,
  substep3InitializeSubstep200Response as InitializeSubstepResponseSchema,
  substep3ProcessStainSelectionParams as ProcessStainSelectionParamsSchema,
  substep3ProcessStainSelection200Response as ProcessStainSelectionResponseSchema,
  substep3ProcessDefectSelectionParams as ProcessDefectSelectionParamsSchema,
  substep3ProcessDefectSelection200Response as ProcessDefectSelectionResponseSchema,
  substep3ProcessDefectNotesParams as ProcessDefectNotesParamsSchema,
  substep3ProcessDefectNotes200Response as ProcessDefectNotesResponseSchema,
  substep3CompleteSubstep200Response as CompleteSubstepResponseSchema,
  substep3GetContext200Response as GetContextResponseSchema,
  substep3GetAvailableStainTypes200Response as GetAvailableStainTypesResponseSchema,
  substep3GetAvailableDefectTypes200Response as GetAvailableDefectTypesResponseSchema,
} from '@/shared/api/generated/wizard/zod/aksiApi';

import { z } from 'zod';

// UI форми для Defects & Stains
export const stainSelectionSchema = z.object({
  selectedStains: z.array(z.string()).min(1, 'Оберіть принаймні одну пляму'),
  customStain: z.string().max(100, 'Назва плями не може перевищувати 100 символів').optional(),
});

export const defectSelectionSchema = z.object({
  selectedDefects: z.array(z.string()).min(1, 'Оберіть принаймні один дефект'),
  customDefect: z.string().max(100, 'Назва дефекту не може перевищувати 100 символів').optional(),
});

export const defectNotesSchema = z.object({
  notes: z.string().max(500, 'Примітки не можуть перевищувати 500 символів').optional(),
  hasNoGuarantee: z.boolean().default(false),
  noGuaranteeReason: z
    .string()
    .max(200, 'Причина відсутності гарантій не може перевищувати 200 символів')
    .optional(),
});

export const defectsStainsFormSchema = z.object({
  selectedStains: z.array(z.string()).default([]),
  customStain: z.string().optional(),
  selectedDefects: z.array(z.string()).default([]),
  customDefect: z.string().optional(),
  notes: z.string().max(500, 'Примітки не можуть перевищувати 500 символів').optional(),
  hasNoGuarantee: z.boolean().default(false),
  noGuaranteeReason: z
    .string()
    .max(200, 'Причина відсутності гарантій не може перевищувати 200 символів')
    .optional(),
});

// Додаткові схеми для UI
export const quickStainSelectionSchema = z.object({
  commonStains: z.array(z.string()).min(1, 'Оберіть принаймні одну пляму'),
});

export const riskAssessmentSchema = z.object({
  hasColorChangeRisk: z.boolean().default(false),
  hasDeformationRisk: z.boolean().default(false),
  hasDamageRisk: z.boolean().default(false),
  riskNotes: z
    .string()
    .max(300, 'Примітки про ризики не можуть перевищувати 300 символів')
    .optional(),
});

// Типи для UI форм
export type StainSelectionData = z.infer<typeof stainSelectionSchema>;
export type DefectSelectionData = z.infer<typeof defectSelectionSchema>;
export type DefectNotesData = z.infer<typeof defectNotesSchema>;
export type DefectsStainsFormData = z.infer<typeof defectsStainsFormSchema>;
export type QuickStainSelectionData = z.infer<typeof quickStainSelectionSchema>;
export type RiskAssessmentData = z.infer<typeof riskAssessmentSchema>;
