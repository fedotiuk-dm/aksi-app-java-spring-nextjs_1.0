// Схеми для Main Wizard - ТІЛЬКИ Orval схеми
// Використовуємо готові Orval схеми БЕЗ кастомних UI форм

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів
export type {
  OrderWizardResponseDTOCurrentState as WizardState,
  OrderWizardResponseDTO as WizardResponse,
} from '@api/main';

// Реекспорт Zod схем для валідації
export {
  // Start wizard
  orderWizardStart200Response as WizardStartResponseSchema,

  // Navigation
  orderWizardGoBackParams as WizardGoBackParamsSchema,
  orderWizardGoBack200Response as WizardGoBackResponseSchema,

  // Stage completion
  orderWizardCompleteStage1Params as WizardCompleteStage1ParamsSchema,
  orderWizardCompleteStage1200Response as WizardCompleteStage1ResponseSchema,
  orderWizardCompleteStage2Params as WizardCompleteStage2ParamsSchema,
  orderWizardCompleteStage2200Response as WizardCompleteStage2ResponseSchema,
  orderWizardCompleteStage3Params as WizardCompleteStage3ParamsSchema,
  orderWizardCompleteStage3200Response as WizardCompleteStage3ResponseSchema,

  // Order completion
  orderWizardCompleteOrderParams as WizardCompleteOrderParamsSchema,
  orderWizardCompleteOrder200Response as WizardCompleteOrderResponseSchema,

  // Order cancellation
  orderWizardCancelOrderParams as WizardCancelOrderParamsSchema,
  orderWizardCancelOrder200Response as WizardCancelOrderResponseSchema,

  // System operations
  orderWizardClearAllSessions200Response as WizardClearAllSessionsResponseSchema,
  orderWizardGetWorkflow200Response as WizardGetWorkflowResponseSchema,
  orderWizardGetSystemStats200Response as WizardGetSystemStatsResponseSchema,

  // Stage info
  orderWizardGetStageStatusParams as WizardGetStageStatusParamsSchema,
  orderWizardGetStageStatus200Response as WizardGetStageStatusResponseSchema,
  orderWizardGetStageMethodsParams as WizardGetStageMethodsParamsSchema,
  orderWizardGetStageMethods200Response as WizardGetStageMethodsResponseSchema,
  orderWizardGetStageInfoParams as WizardGetStageInfoParamsSchema,
  orderWizardGetStageInfo200Response as WizardGetStageInfoResponseSchema,
  orderWizardGetStagesStatus200Response as WizardGetStagesStatusResponseSchema,

  // Current state
  orderWizardGetCurrentStateParams as WizardGetCurrentStateParamsSchema,
  orderWizardGetCurrentState200Response as WizardGetCurrentStateResponseSchema,
} from '@api/main';
