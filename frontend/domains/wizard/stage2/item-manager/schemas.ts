// Схеми для Stage2 Item Manager - ТІЛЬКИ Orval схеми + мінімальні UI форми
// Використовуємо готові Orval схеми та мінімальні UI форми тільки для відсутніх в API

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================

// Реекспорт Zod схем для валідації
export {
  // Item Manager operations
  stage2InitializeItemManagerParams as InitializeItemManagerParamsSchema,
  stage2InitializeItemManager200Response as InitializeItemManagerResponseSchema,
  stage2GetCurrentManagerParams as GetCurrentManagerParamsSchema,
  stage2GetCurrentManager200Response as GetCurrentManagerResponseSchema,

  // Item operations with Body schemas
  stage2AddItemToOrderParams as AddItemParamsSchema,
  stage2AddItemToOrderBody as AddItemBodySchema,
  stage2AddItemToOrder200Response as AddItemResponseSchema,
  stage2UpdateItemInOrderParams as UpdateItemParamsSchema,
  stage2UpdateItemInOrderBody as UpdateItemBodySchema,
  stage2UpdateItemInOrder200Response as UpdateItemResponseSchema,
  stage2DeleteItemFromOrderParams as DeleteItemParamsSchema,
  stage2DeleteItemFromOrder200Response as DeleteItemResponseSchema,

  // Wizard operations
  stage2StartNewItemWizardParams as StartNewWizardParamsSchema,
  stage2StartNewItemWizard200Response as StartNewWizardResponseSchema,
  stage2StartEditItemWizardParams as StartEditWizardParamsSchema,
  stage2StartEditItemWizard200Response as StartEditWizardResponseSchema,
  stage2CloseWizardParams as CloseWizardParamsSchema,
  stage2CloseWizard200Response as CloseWizardResponseSchema,

  // Manager operations
  stage2SynchronizeManagerParams as SynchronizeManagerParamsSchema,
  stage2SynchronizeManager200Response as SynchronizeManagerResponseSchema,
  stage2CompleteStageParams as CompleteStageParamsSchema,
  stage2CompleteStage200Response as CompleteStageResponseSchema,

  // State operations
  stage2ValidateCurrentStateParams as ValidateStateParamsSchema,
  stage2ValidateCurrentState200Response as ValidateStateResponseSchema,
  stage2GetCurrentStateParams as GetCurrentStateParamsSchema,
  stage2GetCurrentState200Response as GetCurrentStateResponseSchema,
  stage2CheckReadinessToProceedParams as CheckReadinessParamsSchema,
  stage2CheckReadinessToProceed200Response as CheckReadinessResponseSchema,

  // Session operations
  stage2ResetSessionParams as ResetSessionParamsSchema,
  stage2TerminateSessionParams as TerminateSessionParamsSchema,
} from '@/shared/api/generated/stage2';

// =================== МІНІМАЛЬНІ UI ФОРМИ (тільки для відсутніх в API) ===================

// Форма пошуку предметів (UI тільки)
export const itemSearchFormSchema = z.object({
  searchTerm: z.string().max(100),
});

// Форма налаштувань таблиці (UI тільки)
export const tableDisplayFormSchema = z.object({
  showDetails: z.boolean(),
  itemsPerPage: z.number().min(5).max(50),
  sortBy: z.enum(['name', 'category', 'price']),
});

// Форма підтвердження видалення (UI тільки)
export const deleteConfirmationFormSchema = z.object({
  itemId: z.string(),
  confirmDelete: z.boolean(),
});

// Форма переходу до наступного етапу (UI тільки)
export const proceedToNextStageFormSchema = z.object({
  confirmProceed: z.boolean(),
});

// =================== ТИПИ ДЛЯ UI ФОРМ ===================
export type ItemSearchFormData = z.infer<typeof itemSearchFormSchema>;
export type TableDisplayFormData = z.infer<typeof tableDisplayFormSchema>;
export type DeleteConfirmationFormData = z.infer<typeof deleteConfirmationFormSchema>;
export type ProceedToNextStageFormData = z.infer<typeof proceedToNextStageFormSchema>;
