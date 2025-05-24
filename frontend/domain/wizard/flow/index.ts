/**
 * @fileoverview Flow Management - управління переходами між кроками Order Wizard
 * @module domain/wizard/flow
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Модуль відповідає за управління flow (потоком) переходів між кроками Order Wizard
 * через XState state machine. Реалізує координацію загального стану wizard та
 * валідацію можливості переходів через guards.
 *
 * Відповідальність Flow Management:
 * - Управління переходами між кроками (NEXT, PREV, GOTO)
 * - Валідація можливості переходу через XState guards
 * - Координація загального стану wizard
 * - Обробка глобальних подій (RESET, AUTO_SAVE)
 * - Інтеграція з доменними сервісами для бізнес-логіки
 *
 * Архітектурні принципи:
 * - State Machine Pattern: використання XState для управління станом
 * - Immutability: всі зміни стану immutable через Immer
 * - Event-Driven: комунікація через події замість прямих викликів
 * - Separation of Concerns: логіка переходів відділена від бізнес-логіки кроків
 *
 * @example
 * // Використання XState машини
 * import { wizardFlowMachine } from '@/domain/wizard/flow';
 * import { useMachine } from '@xstate/react';
 *
 * function OrderWizard() {
 *   const [state, send] = useMachine(wizardFlowMachine);
 *
 *   const handleNext = () => {
 *     send({ type: 'NEXT' });
 *   };
 *
 *   return (
 *     <div>
 *       <h1>Поточний крок: {state.value}</h1>
 *       <button onClick={handleNext} disabled={!state.can('NEXT')}>
 *         Наступний крок
 *       </button>
 *     </div>
 *   );
 * }
 *
 * @example
 * // Перехід до конкретного кроку з даними
 * send({
 *   type: 'GOTO_STEP',
 *   step: 'ITEM_MANAGER',
 *   data: { fromStep: 'CLIENT_SELECTION' }
 * });
 *
 * @see {@link ./wizard-flow.machine} - XState машина wizard
 * @see {@link https://xstate.js.org/} - XState документація
 */

/**
 * Flow Management - управління переходами між кроками Order Wizard
 *
 * Модуль відповідає за управління flow переходів між кроками через XState state machine.
 * Реалізує координацію загального стану wizard та валідацію переходів.
 */

// === ГОЛОВНА МАШИНА ===
export { wizardFlowMachine } from './wizard-flow.machine';
export type { WizardFlowMachine } from './wizard-flow.machine';

// === КОНТЕКСТ ===
export {
  createInitialContext,
  createViewContext,
  createEditContext,
} from './context/wizard-context.factory';

export type {
  WizardContext as FlowWizardContext,
  WizardContextInput as FlowWizardContextInput,
  WizardProgressInfo as FlowWizardProgressInfo,
  WizardValidationInfo as FlowWizardValidationInfo,
  WizardSessionInfo as FlowWizardSessionInfo,
  WizardMetadata as FlowWizardMetadata,
} from './context/wizard-context.types';

// === ПОДІЇ ===
export { EventCreators } from './events';

// === GUARDS (ОХОРОНЦІ) ===
export {
  canProceedToNextStep as canProceedToNextStepFlow,
  canReturnToPrevStep,
  canGotoStep,
  canStartItemWizard,
  canCompleteItemWizard,
  needsValidation,
  canComplete,
} from './guards';

// === ACTIONS (ДІЇ) ===
export * from './actions';

// === STATES (СТАНИ) ===
export { wizardStates } from './states';
