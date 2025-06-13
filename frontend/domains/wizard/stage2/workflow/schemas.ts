// Схеми для Stage2 Workflow - ТІЛЬКИ Orval схеми
// Використовуємо готові Orval схеми БЕЗ кастомних UI форм

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів
export type { Stage2GetCurrentState200 as WorkflowState } from '@/shared/api/generated/stage2';

// Реекспорт Zod схем для валідації
export {
  // Item Manager operations
  stage2InitializeItemManagerParams as InitializeItemManagerParamsSchema,
  stage2InitializeItemManager200Response as InitializeItemManagerResponseSchema,

  // Item operations
  stage2AddItemToOrderParams as AddItemToOrderParamsSchema,
  stage2AddItemToOrder200Response as AddItemToOrderResponseSchema,
  stage2UpdateItemInOrderParams as UpdateItemInOrderParamsSchema,
  stage2UpdateItemInOrder200Response as UpdateItemInOrderResponseSchema,
  stage2DeleteItemFromOrderParams as DeleteItemFromOrderParamsSchema,
  stage2DeleteItemFromOrder200Response as DeleteItemFromOrderResponseSchema,

  // Wizard operations
  stage2StartNewItemWizardParams as StartNewItemWizardParamsSchema,
  stage2StartNewItemWizard200Response as StartNewItemWizardResponseSchema,
  stage2StartEditItemWizardParams as StartEditItemWizardParamsSchema,
  stage2StartEditItemWizard200Response as StartEditItemWizardResponseSchema,
  stage2CloseWizardParams as CloseWizardParamsSchema,
  stage2CloseWizard200Response as CloseWizardResponseSchema,

  // Manager operations
  stage2SynchronizeManagerParams as SynchronizeManagerParamsSchema,
  stage2SynchronizeManager200Response as SynchronizeManagerResponseSchema,
  stage2GetCurrentManagerParams as GetCurrentManagerParamsSchema,
  stage2GetCurrentManager200Response as GetCurrentManagerResponseSchema,

  // Stage operations
  stage2CompleteStageParams as CompleteStageParamsSchema,
  stage2CompleteStage200Response as CompleteStageResponseSchema,
  stage2ValidateCurrentStateParams as ValidateCurrentStateParamsSchema,
  stage2ValidateCurrentState200Response as ValidateCurrentStateResponseSchema,

  // State operations
  stage2GetCurrentStateParams as GetCurrentStateParamsSchema,
  stage2GetCurrentState200Response as GetCurrentStateResponseSchema,
  stage2CheckReadinessToProceedParams as CheckReadinessToProceedParamsSchema,
  stage2CheckReadinessToProceed200Response as CheckReadinessToProceedResponseSchema,

  // Session operations
  stage2ResetSessionParams as ResetSessionParamsSchema,
  stage2TerminateSessionParams as TerminateSessionParamsSchema,
  stage2GetActiveSessionCount200Response as GetActiveSessionCountResponseSchema,
} from '@/shared/api/generated/stage2';
