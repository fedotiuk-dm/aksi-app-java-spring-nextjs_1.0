import { useCallback, useMemo } from 'react';

import { useWizardStore } from '../../wizard/store/wizard.store';
import { WizardStep } from '../../wizard/types';
import { Client } from '../types';

/**
 * Хук для навігації CLIENT_SELECTION кроку
 *
 * SOLID принципи:
 * - Single Responsibility: тільки навігація між кроками
 * - Interface Segregation: мінімальний API для навігації
 * - Dependency Inversion: залежить від wizard store абстракції
 */
export const useClientStepNavigation = () => {
  const { goToStep, validateStep } = useWizardStore();

  /**
   * Перевірка можливості переходу до наступного кроку
   */
  const canProceedToNext = useMemo(() => {
    return validateStep(WizardStep.BRANCH_SELECTION);
  }, [validateStep]);

  /**
   * Перехід до наступного кроку
   */
  const proceedToNext = useCallback(() => {
    if (canProceedToNext) {
      goToStep(WizardStep.BRANCH_SELECTION);
    }
  }, [canProceedToNext, goToStep]);

  /**
   * Перехід до наступного кроку з клієнтом
   */
  const proceedWithClient = useCallback(
    (client: Client, onComplete?: (client: Client) => void) => {
      if (canProceedToNext) {
        goToStep(WizardStep.BRANCH_SELECTION);
        onComplete?.(client);
      }
    },
    [canProceedToNext, goToStep]
  );

  return {
    // Стан навігації
    canProceedToNext,

    // Дії навігації
    proceedToNext,
    proceedWithClient,
    goToStep,
  };
};
