/**
 * Публічне API всіх типів домену wizard
 * Централізований експорт усіх TypeScript типів та інтерфейсів
 */

// === ЗАГАЛЬНІ ТИПИ ===
// Кроки та навігація
export { WizardStep, ItemWizardStep } from './common/wizard-steps.types';
export type { AnyWizardStep } from './common/wizard-steps.types';

// Режими та статуси
export {
  ValidationStatus,
  WizardMode,
  WizardStatus,
  SaveStatus,
  StepCompletionStatus,
} from './common/wizard-modes.types';

// Контекст
export type {
  WizardContext,
  WizardMetadata,
  ExtendedWizardContext,
  OperatorContext,
  FullWizardContext,
} from './common/wizard-context.types';

// === ТИПИ СТАНУ ===
// Базові стани кроків
export type {
  WizardStepState,
  ExtendedWizardStepState,
  FieldValidationState,
  StepValidationGroup,
  DetailedStepValidationState,
} from './state/wizard-step-state.types';

// Стани конкретних кроків
export type {
  ClientStepState,
  BranchSelectionState,
  ItemsManagerState,
  OrderParametersState,
  OrderConfirmationState,
  AllStepsState,
  ClientSearchResult,
  Branch,
  OrderItem,
  OrderSummary,
  OrderStatus,
  ExpediteType,
  ValidationConstraints,
} from './state/wizard-step-states.types';

// Глобальний стан
export type {
  WizardGlobalState,
  WizardMachineContext,
  NavigationState,
  ItemWizardNavigationState,
  WizardSelectors,
} from './state/wizard-global-state.types';

// === ТИПИ ПОДІЙ ===
export type {
  WizardEvent,
  NavigationEvent,
  ValidationEvent,
  SaveEvent,
  ItemWizardEvent,
  WizardEventType,
} from './events/wizard-events.types';

// === ТИПИ ОПЕРАЦІЙ ===
export type { WizardOperationResult } from './operations/wizard-operation-result.types';
