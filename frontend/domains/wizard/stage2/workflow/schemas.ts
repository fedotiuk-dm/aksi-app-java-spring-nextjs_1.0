// Схеми для Stage2 Workflow - ТІЛЬКИ Orval схеми
// Використовуємо готові Orval схеми БЕЗ кастомних UI форм

import { z } from 'zod';

import { STAGE2_WORKFLOW_LIMITS, STAGE2_SUBSTEPS } from './constants';

// Константа для повідомлення підтвердження
const CONFIRMATION_REQUIRED_MESSAGE = "Підтвердження обов'язкове";

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів
export type { ItemManagerDTO, Stage2GetCurrentState200 } from '@api/stage2';

// Реекспорт Zod схем для валідації
export {
  // Params схеми (тільки реальні)
  stage2InitializeItemManagerParams as InitializeWorkflowParamsSchema,
  stage2StartNewItemWizardParams as StartNewItemWizardParamsSchema,
  stage2StartEditItemWizardParams as StartEditItemWizardParamsSchema,
  stage2CloseWizardParams as CloseWizardParamsSchema,
  stage2CompleteStageParams as CompleteStageParamsSchema,
  stage2SynchronizeManagerParams as SynchronizeWorkflowParamsSchema,
  stage2GetCurrentStateParams as GetCurrentStateParamsSchema,
  stage2ValidateCurrentStateParams as ValidateCurrentStateParamsSchema,

  // Response схеми
  stage2InitializeItemManager200Response as InitializeWorkflowResponseSchema,
  stage2StartNewItemWizard200Response as StartNewItemWizardResponseSchema,
  stage2StartEditItemWizard200Response as StartEditItemWizardResponseSchema,
  stage2CloseWizard200Response as CloseWizardResponseSchema,
  stage2CompleteStage200Response as CompleteStageResponseSchema,
  stage2SynchronizeManager200Response as SynchronizeWorkflowResponseSchema,
  stage2GetCurrentState200Response as GetCurrentStateResponseSchema,
  stage2ValidateCurrentState200Response as ValidateCurrentStateResponseSchema,
} from '@api/stage2';

// =================== МІНІМАЛЬНІ UI ФОРМИ ===================
// Тільки для UI компонентів, які не покриті Orval схемами

// Форма навігації між підетапами
export const substepNavigationFormSchema = z.object({
  targetSubstep: z.enum(Object.values(STAGE2_SUBSTEPS) as [string, ...string[]]),
  confirmed: z.boolean().refine((val) => val === true, CONFIRMATION_REQUIRED_MESSAGE),
});

export type SubstepNavigationFormData = z.infer<typeof substepNavigationFormSchema>;

// Форма завершення етапу
export const completeStageFormSchema = z.object({
  confirmed: z.boolean().refine((val) => val === true, CONFIRMATION_REQUIRED_MESSAGE),
  itemsCount: z
    .number()
    .min(
      STAGE2_WORKFLOW_LIMITS.MIN_ITEMS_COUNT,
      `Повинно бути мінімум ${STAGE2_WORKFLOW_LIMITS.MIN_ITEMS_COUNT} предмет`
    )
    .max(
      STAGE2_WORKFLOW_LIMITS.MAX_ITEMS_COUNT,
      `Максимум ${STAGE2_WORKFLOW_LIMITS.MAX_ITEMS_COUNT} предметів`
    ),
});

export type CompleteStageFormData = z.infer<typeof completeStageFormSchema>;

// Форма закриття візарда
export const closeWizardFormSchema = z.object({
  saveChanges: z.boolean(),
  confirmed: z.boolean().refine((val) => val === true, CONFIRMATION_REQUIRED_MESSAGE),
});

export type CloseWizardFormData = z.infer<typeof closeWizardFormSchema>;
