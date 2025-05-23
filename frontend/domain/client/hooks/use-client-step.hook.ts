import { useCallback } from 'react';

import { useClientStepActions } from './use-client-step-actions.hook';
import { useClientStepNavigation } from './use-client-step-navigation.hook';
import { useClientStepState } from './use-client-step-state.hook';
import { Client } from '../types';

/**
 * Конфігурація головного хука CLIENT_SELECTION кроку
 */
interface UseClientStepOptions {
  /** Автоматично переходити до наступного кроку після вибору клієнта */
  autoAdvance?: boolean;
  /** Callback при завершенні кроку */
  onStepComplete?: (client: Client) => void;
}

/**
 * Головний композиційний хук для кроку CLIENT_SELECTION
 *
 * SOLID принципи:
 * - Single Responsibility: тільки композиція спеціалізованих хуків
 * - Open/Closed: розширюється через options та callbacks
 * - Dependency Inversion: залежить від спеціалізованих хуків
 * - Composition over Inheritance: використання композиції
 *
 * Функціональність згідно з документацією Order Wizard:
 * 1.1. Вибір або створення клієнта
 * - Форма пошуку існуючого клієнта
 * - Відображення списку знайдених клієнтів
 * - Можливість вибрати клієнта зі списку
 * - Можливість редагування клієнта
 * - Форма нового клієнта з повною валідацією
 */
export const useClientStep = (options: UseClientStepOptions = {}) => {
  const { autoAdvance = true, onStepComplete } = options;

  // Композиція спеціалізованих хуків
  const state = useClientStepState();
  const navigation = useClientStepNavigation();
  const actions = useClientStepActions();

  /**
   * Завершення кроку з автоматичним переходом
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
   * Вибір клієнта з автоматичним завершенням
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
