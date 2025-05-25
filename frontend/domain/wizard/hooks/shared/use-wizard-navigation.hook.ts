/**
 * @fileoverview Хук інтеграції XState машини з валідацією та навігацією
 * @module domain/wizard/hooks/shared
 */

import { useActor } from '@xstate/react';
import { useCallback } from 'react';

import { useWizardState } from './use-wizard-state.hook';
import { wizardMachine } from '../../machines';
import { WizardStep } from '../../types';

/**
 * Інтеграція XState машини з валідацією
 *
 * Розширений goNext з автоматичною валідацією через існуючі схеми
 * Контроль переходів між кроками з урахуванням помилок стору
 */
export const useWizardNavigation = () => {
  const [state, send] = useActor(wizardMachine);
  const { hasErrors, canProceed, addError } = useWizardState();

  // Навігація з валідацією
  const goNext = useCallback(() => {
    if (!canProceed) {
      addError('Виправте помилки перед переходом до наступного кроку');
      return false;
    }

    send({ type: 'NEXT' });
    return true;
  }, [canProceed, addError, send]);

  const goBack = useCallback(() => {
    send({ type: 'PREV' });
  }, [send]);

  const goToStep = useCallback(
    (step: WizardStep) => {
      send({ type: 'GO_TO_STEP', step });
    },
    [send]
  );

  // Item Wizard навігація
  const startItemWizard = useCallback(() => {
    send({ type: 'START_ITEM_WIZARD' });
  }, [send]);

  const nextItemStep = useCallback(() => {
    if (!canProceed) {
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
    if (!canProceed) {
      addError('Виправте помилки перед завершенням редагування предмета');
      return false;
    }

    send({ type: 'COMPLETE_ITEM_WIZARD' });
    return true;
  }, [canProceed, addError, send]);

  const cancelItemWizard = useCallback(() => {
    send({ type: 'CANCEL_ITEM_WIZARD' });
  }, [send]);

  // Wizard завершення
  const completeWizard = useCallback(() => {
    if (!canProceed) {
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
    // Поточний стан
    currentStep: state.context.currentStep,
    currentSubStep: state.context.currentSubStep,
    canGoNext: state.can({ type: 'NEXT' }) && canProceed,
    canGoBack: state.can({ type: 'PREV' }),
    isItemWizardActive: state.matches({ itemManager: 'itemWizard' }),

    // Основна навігація
    goNext,
    goBack,
    goToStep,

    // Item Wizard навігація
    startItemWizard,
    nextItemStep,
    prevItemStep,
    completeItemWizard,
    cancelItemWizard,

    // Wizard завершення
    completeWizard,
    resetWizard,

    // Debug інформація (для розробки)
    machineState: state.value,
    hasNavigationErrors: hasErrors,
  };
};
