/**
 * @fileoverview Головний композиційний хук для кроку CLIENT_SELECTION в Order Wizard
 * @module domain/client/hooks
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Цей хук реалізує принципи SOLID та архітектури DDD inside:
 * - Single Responsibility: тільки композиція спеціалізованих хуків
 * - Open/Closed: розширюється через options та callbacks
 * - Dependency Inversion: залежить від спеціалізованих хуків
 * - Composition over Inheritance: використання композиції
 *
 * Функціональність згідно з документацією Order Wizard (Етап 1):
 * 1.1. Вибір або створення клієнта:
 * - Форма пошуку існуючого клієнта
 * - Відображення списку знайдених клієнтів
 * - Можливість вибрати клієнта зі списку
 * - Можливість редагування клієнта
 * - Форма нового клієнта з повною валідацією
 *
 * 1.2. Базова інформація замовлення:
 * - Номер квитанції (генерується автоматично)
 * - Унікальна мітка (вводиться вручну)
 * - Дата створення замовлення (автоматично)
 */

import { useCallback } from 'react';

import { useClientStepActions } from './use-client-step-actions.hook';
import { useClientStepNavigation } from './use-client-step-navigation.hook';
import { useClientStepState } from './use-client-step-state.hook';
import { Client } from '../types';

/**
 * Конфігурація головного хука CLIENT_SELECTION кроку
 *
 * @interface UseClientStepOptions
 * @property {boolean} [autoAdvance=true] - Автоматично переходити до наступного кроку після вибору клієнта
 * @property {function} [onStepComplete] - Callback при завершенні кроку з обраним клієнтом
 *
 * @example
 * // Базова конфігурація
 * const options: UseClientStepOptions = {
 *   autoAdvance: true
 * };
 *
 * @example
 * // З кастомним callback
 * const options: UseClientStepOptions = {
 *   autoAdvance: false,
 *   onStepComplete: (client) => {
 *     console.log(`Клієнт обраний: ${client.firstName} ${client.lastName}`);
 *     // Кастомна логіка після вибору клієнта
 *   }
 * };
 */
interface UseClientStepOptions {
  /** Автоматично переходити до наступного кроку після вибору клієнта */
  autoAdvance?: boolean;
  /** Callback при завершенні кроку */
  onStepComplete?: (client: Client) => void;
}

/**
 * Результат виконання хука useClientStep
 *
 * @interface UseClientStepResult
 * @extends {ReturnType<typeof useClientStepState>}
 * @extends {ReturnType<typeof useClientStepActions>}
 *
 * @property {boolean} canProceed - Чи можна переходити до наступного кроку
 * @property {function} proceedToNext - Перехід до наступного кроку
 * @property {function} completeStep - Завершення кроку з вибраним клієнтом
 * @property {function} selectAndComplete - Вибір клієнта та автоматичне завершення
 * @property {Object} state - Доступ до спеціалізованого хука стану
 * @property {Object} navigation - Доступ до спеціалізованого хука навігації
 * @property {Object} actions - Доступ до спеціалізованого хука дій
 */
interface UseClientStepResult {
  // Стан кроку (з useClientStepState)
  canProceed: boolean;

  // Навігація (з useClientStepNavigation)
  proceedToNext: () => void;
  completeStep: (client: Client) => void;

  // Композиційні методи
  selectAndComplete: (client: Client) => void;

  // Доступ до спеціалізованих хуків
  state: ReturnType<typeof useClientStepState>;
  navigation: ReturnType<typeof useClientStepNavigation>;
  actions: ReturnType<typeof useClientStepActions>;
}

/**
 * Головний композиційний хук для кроку CLIENT_SELECTION
 *
 * @function useClientStep
 * @param {UseClientStepOptions} [options={}] - Конфігурація хука
 * @returns {UseClientStepResult} Об'єкт з методами та станом кроку
 *
 * @description
 * Композиційний хук що об'єднує функціональність спеціалізованих хуків для кроку CLIENT_SELECTION.
 * Забезпечує единий інтерфейс доступу до всіх операцій з клієнтами та навігацією між кроками.
 *
 * Архітектурні переваги:
 * - Інкапсуляція складності в спеціалізованих хуках
 * - Гнучкість конфігурації через options
 * - Можливість розширення через callbacks
 * - Збереження доступу до спеціалізованих хуків для edge cases
 *
 * @example
 * // Базове використання в UI компоненті
 * function ClientSelectionStep() {
 *   const {
 *     canProceed,
 *     selectAndComplete,
 *     searchTerm,
 *     searchResults
 *   } = useClientStep();
 *
 *   return (
 *     <div>
 *       <SearchForm />
 *       {searchResults.map(client => (
 *         <ClientCard
 *           key={client.id}
 *           client={client}
 *           onSelect={() => selectAndComplete(client)}
 *         />
 *       ))}
 *       {canProceed && <ContinueButton />}
 *     </div>
 *   );
 * }
 *
 * @example
 * // З кастомними опціями та обробкою
 * function AdvancedClientSelection() {
 *   const clientStep = useClientStep({
 *     autoAdvance: false,
 *     onStepComplete: (client) => {
 *       // Логування вибору клієнта
 *       console.log('Клієнт обраний:', client);
 *
 *       // Відправка аналітики
 *       analytics.track('client_selected', {
 *         clientId: client.id,
 *         isNewClient: client.createdAt.getTime() > Date.now() - 86400000
 *       });
 *     }
 *   });
 *
 *   // Доступ до спеціалізованих хуків для edge cases
 *   const { actions } = clientStep;
 *
 *   const handleSpecialCase = () => {
 *     actions.resetClientSelection();
 *     // Кастомна логіка...
 *   };
 *
 *   return <CustomClientInterface {...clientStep} />;
 * }
 *
 * @example
 * // Використання в тестах
 * function TestComponent() {
 *   const { selectAndComplete, canProceed } = useClientStep({
 *     autoAdvance: false
 *   });
 *
 *   // Програматичний вибір клієнта для тестування
 *   useEffect(() => {
 *     const testClient: Client = {
 *       id: 'test-client-1',
 *       firstName: 'Тестовий',
 *       lastName: 'Клієнт',
 *       phone: '+380501234567',
 *       // ... інші поля
 *     };
 *
 *     selectAndComplete(testClient);
 *   }, [selectAndComplete]);
 *
 *   return <div data-testid="can-proceed">{canProceed}</div>;
 * }
 *
 * @see {@link useClientStepState} - Управління станом кроку
 * @see {@link useClientStepActions} - Дії з клієнтами
 * @see {@link useClientStepNavigation} - Навігація між кроками
 * @see {@link Client} - Інтерфейс клієнта
 *
 * @throws {Error} Якщо хук використовується поза контекстом Order Wizard
 * @since 1.0.0
 */
export const useClientStep = (options: UseClientStepOptions = {}): UseClientStepResult => {
  const { autoAdvance = true, onStepComplete } = options;

  // Композиція спеціалізованих хуків
  const state = useClientStepState();
  const navigation = useClientStepNavigation();
  const actions = useClientStepActions();

  /**
   * Завершення кроку з автоматичним переходом або кастомним callback
   *
   * @method completeStep
   * @param {Client} client - Обраний клієнт
   * @memberof useClientStep
   *
   * @description
   * Виконує завершення кроку CLIENT_SELECTION з обраним клієнтом.
   * Залежно від конфігурації може автоматично переходити до наступного кроку
   * або викликати кастомний callback для обробки.
   */
  const completeStep = useCallback(
    (client: Client) => {
      if (autoAdvance) {
        navigation.proceedWithClient(client, onStepComplete);
      } else {
        onStepComplete?.(client);
      }
    },
    [autoAdvance, navigation, onStepComplete]
  );

  /**
   * Вибір клієнта з автоматичним завершенням кроку
   *
   * @method selectAndComplete
   * @param {Client} client - Клієнт для вибору
   * @memberof useClientStep
   *
   * @description
   * Комбінований метод що виконує вибір клієнта через actions.selectClient
   * та одразу завершує крок через completeStep. Зручний для використання
   * в UI компонентах де потрібна одна дія для вибору та продовження.
   *
   * @example
   * // В компоненті списку клієнтів
   * <button onClick={() => selectAndComplete(client)}>
   *   Обрати клієнта
   * </button>
   */
  const selectAndComplete = useCallback(
    (client: Client) => {
      actions.selectClient(client);
      completeStep(client);
    },
    [actions, completeStep]
  );

  return {
    // Стан кроку
    ...state,
    canProceed: state.isStepComplete && navigation.canProceedToNext,

    // Навігація
    proceedToNext: navigation.proceedToNext,
    completeStep,

    // Дії з клієнтами
    ...actions,
    selectAndComplete,

    // Доступ до спеціалізованих хуків (для розширення)
    state,
    navigation,
    actions,
  };
};
