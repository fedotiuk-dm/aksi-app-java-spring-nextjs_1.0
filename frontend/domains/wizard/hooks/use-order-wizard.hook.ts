/**
 * @fileoverview Головний композиційний хук для Order Wizard
 *
 * Об'єднує всі етапи та забезпечує централізований доступ до функціональності
 * Order Wizard. Це головна точка входу для UI компонентів.
 */

import { useMemo } from 'react';

import { useOrderWizardCoordinator } from './use-order-wizard-coordinator.hook';
import { useStage1Operations } from './use-stage1-operations.hook';

export interface OrderWizardContext {
  // Координація
  coordinator: ReturnType<typeof useOrderWizardCoordinator>;

  // Етапи
  stage1: ReturnType<typeof useStage1Operations>;
  // stage2: ReturnType<typeof useStage2Operations>; // Буде додано пізніше
  // stage3: ReturnType<typeof useStage3Operations>; // Буде додано пізніше
  // stage4: ReturnType<typeof useStage4Operations>; // Буде додано пізніше

  // Загальні утиліти
  isAnyStageLoading: boolean;
  hasAnyError: boolean;
  canProceedToNextStage: boolean;

  // Навігаційні методи
  goToStage: (stageNumber: number) => void;
  goToNextStage: () => void;
  goToPreviousStage: () => void;
  resetWizard: () => void;
}

/**
 * Головний хук для Order Wizard
 *
 * Використання:
 * ```tsx
 * const wizard = useOrderWizard();
 *
 * // Доступ до координатора
 * const { currentStage, isWizardComplete } = wizard.coordinator;
 *
 * // Доступ до операцій першого етапу
 * const { searchClients, selectClient } = wizard.stage1;
 *
 * // Навігація
 * wizard.goToNextStage();
 * ```
 */
export const useOrderWizard = (): OrderWizardContext => {
  // Координатор
  const coordinator = useOrderWizardCoordinator();

  // Етапи
  const stage1 = useStage1Operations();

  // Обчислювальні властивості
  const isAnyStageLoading = useMemo(() => {
    return coordinator.isLoading || stage1.isLoading;
  }, [coordinator.isLoading, stage1.isLoading]);

  const hasAnyError = useMemo(() => {
    return coordinator.isError || !!stage1.error;
  }, [coordinator.isError, stage1.error]);

  const canProceedToNextStage = useMemo(() => {
    const { currentStage } = coordinator;

    switch (currentStage) {
      case 1:
        return stage1.isStage1Valid;
      case 2:
        // return stage2.isStage2Valid; // Буде додано пізніше
        return false;
      case 3:
        // return stage3.isStage3Valid; // Буде додано пізніше
        return false;
      case 4:
        // return stage4.isStage4Valid; // Буде додано пізніше
        return false;
      default:
        return false;
    }
  }, [coordinator, stage1.isStage1Valid]);

  return {
    // Координація
    coordinator,

    // Етапи
    stage1,

    // Загальні утиліти
    isAnyStageLoading,
    hasAnyError,
    canProceedToNextStage,

    // Навігаційні методи (делегуємо до координатора)
    goToStage: coordinator.navigateToStage,
    goToNextStage: coordinator.goToNextStage,
    goToPreviousStage: coordinator.goToPreviousStage,
    resetWizard: coordinator.resetWizard,
  };
};
