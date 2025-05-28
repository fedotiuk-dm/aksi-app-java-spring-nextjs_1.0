/**
 * @fileoverview Типи wizard домену
 * @module domain/wizard/types
 *
 * Централізований експорт усіх TypeScript типів та інтерфейсів:
 * - Кроки та навігація
 * - Режими та статуси
 * - Контекст та метадані
 * - Стани кроків
 * - Події та операції
 */

// === ЗАГАЛЬНІ ТИПИ ===
// Кроки та навігація (enum та union types)
export { WizardStep, ItemWizardStep } from './wizard-steps.types';
export type { AnyWizardStep } from './wizard-steps.types';

// Режими та статуси (enum та union types)
export {
  ValidationStatus,
  WizardMode,
  WizardStatus,
  SaveStatus,
  StepCompletionStatus,
} from './wizard-modes.types';

// Контекст та метадані
export type {
  WizardContext,
  WizardMetadata,
  ExtendedWizardContext,
  OperatorContext,
  FullWizardContext,
} from './wizard-context.types';

// === ТИПИ СТАНУ ===
// Базові стани кроків
export type {
  WizardStepState,
  ExtendedWizardStepState,
  FieldValidationState,
  StepValidationGroup,
  DetailedStepValidationState,
} from './wizard-step-state.types';

// Стани конкретних кроків
export type {
  ClientStepState,
  BranchSelectionState,
  ItemsManagerState,
  OrderParametersState,
  OrderConfirmationState,
  AllStepsState,
  ClientSearchResult,
  ClientSearchCriteria,
  Branch,
  OrderItem,
  OrderSummary,
  OrderStatus,
  ExpediteType,
  ValidationConstraints,
} from './wizard-step-states.types';

// Глобальний стан
export type {
  WizardGlobalState,
  NavigationState,
  ItemWizardNavigationState,
  WizardSelectors,
} from './wizard-global-state.types';

// === ТИПИ ПОДІЙ ===
export type {
  WizardEvent,
  NavigationEvent,
  ValidationEvent,
  SaveEvent,
  ItemWizardEvent,
  WizardEventType,
} from './wizard-events.types';

// === ТИПИ ОПЕРАЦІЙ ===
export type { WizardOperationResult } from './wizard-operation-result.types';

// === ТИПИ ЗБЕРЕЖЕННЯ ===
export type {
  SaveState,
  ExtendedSaveState,
  AutoSaveConfig,
  SyncState,
  FullSaveState,
  SaveMetadata,
} from './wizard-save-state.types';
