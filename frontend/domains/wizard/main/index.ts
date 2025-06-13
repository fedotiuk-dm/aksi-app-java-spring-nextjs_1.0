// Публічне API для Main Wizard домену

// Основні компоненти
export { useMainWizardStore, useMainWizardSelectors } from './wizard.store';
export { useMainWizard } from './use-main-wizard.hook';
export type { UseMainWizardReturn } from './use-main-wizard.hook';

// Константи та типи
export {
  MAIN_WIZARD_STATES,
  MAIN_WIZARD_EVENTS,
  MAIN_WIZARD_TRANSITIONS,
  MAIN_WIZARD_VALIDATION_RULES,
  type MainWizardState,
  type MainWizardEvent,
} from './wizard.constants';

// Схеми (Orval схеми)
export {
  // TypeScript типи
  type WizardState,
  type WizardResponse,

  // Zod схеми
  WizardStartResponseSchema,
  WizardGoBackParamsSchema,
  WizardGoBackResponseSchema,
  WizardCompleteStage1ParamsSchema,
  WizardCompleteStage1ResponseSchema,
  WizardCompleteStage2ParamsSchema,
  WizardCompleteStage2ResponseSchema,
  WizardCompleteStage3ParamsSchema,
  WizardCompleteStage3ResponseSchema,
  WizardCompleteOrderParamsSchema,
  WizardCompleteOrderResponseSchema,
  WizardCancelOrderParamsSchema,
  WizardCancelOrderResponseSchema,
  WizardClearAllSessionsResponseSchema,
  WizardGetWorkflowResponseSchema,
  WizardGetSystemStatsResponseSchema,
  WizardGetStageStatusParamsSchema,
  WizardGetStageStatusResponseSchema,
  WizardGetStageMethodsParamsSchema,
  WizardGetStageMethodsResponseSchema,
  WizardGetStageInfoParamsSchema,
  WizardGetStageInfoResponseSchema,
  WizardGetStagesStatusResponseSchema,
  WizardGetCurrentStateParamsSchema,
  WizardGetCurrentStateResponseSchema,
} from './schemas';
