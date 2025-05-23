import { useCallback, useMemo } from 'react';

import { useClientSelection } from './use-client-selection.hook';
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
  const { goToStep } = useWizardStore();

  // Додаємо client selection для перевірки стану
  const { hasSelection } = useClientSelection();

  /**
   * Перевірка можливості переходу до наступного кроку
   * Тепер безпосередньо перевіряємо чи клієнт вибраний
   */
  const canProceedToNext = useMemo(() => {
    console.log('Navigation: canProceedToNext перевірка, hasSelection:', hasSelection);
    return hasSelection;
  }, [hasSelection]);

  /**
   * Перехід до наступного кроку
   */
  const proceedToNext = useCallback(() => {
    if (canProceedToNext) {
      console.log('Navigation: переходимо до BRANCH_SELECTION');
      goToStep(WizardStep.BRANCH_SELECTION);
    } else {
      console.log('Navigation: не можу перейти - клієнт не вибраний');
    }
  }, [canProceedToNext, goToStep]);

  /**
   * Перехід до наступного кроку з клієнтом
   */
  const proceedWithClient = useCallback(
    (client: Client, onComplete?: (client: Client) => void) => {
      if (canProceedToNext) {
        console.log('Navigation: переходимо до BRANCH_SELECTION з клієнтом:', client);
        goToStep(WizardStep.BRANCH_SELECTION);
        onComplete?.(client);
      } else {
        console.log('Navigation: не можу перейти з клієнтом - перевірка не пройдена');
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
