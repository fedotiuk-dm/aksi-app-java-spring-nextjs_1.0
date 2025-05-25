/**
 * @fileoverview Хук для навігації в wizard
 * @module domain/wizard/hooks/shared
 */

import { useActor } from '@xstate/react';
import { useCallback } from 'react';

import { wizardMachine } from '../../machines';
import { useWizardStore } from '../../store';
import { WizardStep } from '../../types';

const NAVIGATION_ERROR_MESSAGE = 'Помилка навігації';

/**
 * Хук для навігації в wizard
 *
 * Принципи DDD:
 * - XState: навігація між кроками та валідація переходів
 * - Zustand: бізнес-стан та дані
 * - Інтеграція обох систем через єдиний API
 */
export const useWizardNavigation = () => {
  // === XSTATE МАШИНА (навігація) ===
  const [state, send] = useActor(wizardMachine);

  // === ZUSTAND STORE (бізнес-стан) ===
  const { errors, hasUnsavedChanges, clearErrors, addError } = useWizardStore();

  // === ВАЛІДАЦІЯ ПЕРЕХОДІВ ===
  const canProceed = useCallback(() => {
    // Перевіряємо бізнес-правила з Zustand
    if (errors.length > 0) {
      return false;
    }

    // Перевіряємо можливість переходу в XState
    return state.can({ type: 'NEXT' });
  }, [errors.length, state]);

  // === НАВІГАЦІЯ ВПЕРЕД ===
  const navigateForward = useCallback(() => {
    clearErrors();

    if (!canProceed()) {
      addError('Виправте помилки перед переходом до наступного кроку');
      return { success: false, errors: ['Неможливо продовжити'] };
    }

    try {
      send({ type: 'NEXT' });
      return { success: true, errors: [] };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : NAVIGATION_ERROR_MESSAGE;
      addError(errorMessage);
      return { success: false, errors: [errorMessage] };
    }
  }, [canProceed, clearErrors, addError, send]);

  // === НАВІГАЦІЯ НАЗАД ===
  const navigateBack = useCallback(() => {
    clearErrors();

    if (!state.can({ type: 'PREV' })) {
      return { success: false, errors: ['Неможливо повернутися назад'] };
    }

    try {
      send({ type: 'PREV' });
      return { success: true, errors: [] };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : NAVIGATION_ERROR_MESSAGE;
      addError(errorMessage);
      return { success: false, errors: [errorMessage] };
    }
  }, [state, clearErrors, addError, send]);

  // === ПЕРЕХІД ДО КОНКРЕТНОГО КРОКУ ===
  const goToStep = useCallback(
    (step: WizardStep) => {
      clearErrors();

      try {
        send({ type: 'GO_TO_STEP', step });
        return { success: true, errors: [] };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : NAVIGATION_ERROR_MESSAGE;
        addError(errorMessage);
        return { success: false, errors: [errorMessage] };
      }
    },
    [clearErrors, addError, send]
  );

  // === ITEM WIZARD НАВІГАЦІЯ ===
  const startItemWizard = useCallback(() => {
    send({ type: 'START_ITEM_WIZARD' });
  }, [send]);

  const nextItemStep = useCallback(() => {
    if (!canProceed()) {
      addError('Виправте помилки перед переходом до наступного підкроку');
      return false;
    }

    send({ type: 'NEXT_ITEM_STEP' });
    return true;
  }, [canProceed, addError, send]);

  const prevItemStep = useCallback(() => {
    send({ type: 'PREV_ITEM_STEP' });
  }, [send]);

  const completeItemWizard = useCallback(() => {
    if (!canProceed()) {
      addError('Виправте помилки перед завершенням редагування предмета');
      return false;
    }

    send({ type: 'COMPLETE_ITEM_WIZARD' });
    return true;
  }, [canProceed, addError, send]);

  // === ЗАВЕРШЕННЯ WIZARD ===
  const completeWizard = useCallback(() => {
    if (!canProceed()) {
      addError('Виправте помилки перед завершенням замовлення');
      return false;
    }

    send({ type: 'COMPLETE_WIZARD' });
    return true;
  }, [canProceed, addError, send]);

  const resetWizard = useCallback(() => {
    send({ type: 'RESET' });
  }, [send]);

  return {
    // === ПОТОЧНИЙ СТАН ===
    currentStep: state.context.currentStep,
    currentSubStep: state.context.currentSubStep,
    isItemWizardActive: state.matches({ itemManager: 'itemWizard' }),

    // === МОЖЛИВОСТІ НАВІГАЦІЇ ===
    canNavigateForward: canProceed,
    canNavigateBack: () => state.can({ type: 'PREV' }),

    // === ОСНОВНА НАВІГАЦІЯ ===
    navigateForward,
    navigateBack,
    goToStep,

    // === ITEM WIZARD ===
    startItemWizard,
    nextItemStep,
    prevItemStep,
    completeItemWizard,

    // === ЗАВЕРШЕННЯ ===
    completeWizard,
    resetWizard,

    // === DEBUG (для розробки) ===
    machineState: state.value,
    hasNavigationErrors: errors.length > 0,
    hasUnsavedChanges,
  };
};
