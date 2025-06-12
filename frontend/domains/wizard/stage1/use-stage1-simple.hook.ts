/**
 * @fileoverview Простий інтегрований хук для Stage1
 *
 * Принцип: Тимчасове рішення для координації з головним Order Wizard
 * До повної реалізації композиційної архітектури
 */

import { useMemo, useCallback } from 'react';

import { useOrderWizardMain } from '../main';

/**
 * Простий хук для Stage1 який працює в рамках головного Order Wizard
 *
 * Тимчасове рішення для координації без складних залежностей
 */
export const useStage1Simple = () => {
  // 1. Отримуємо стан головного Order Wizard
  const mainWizard = useOrderWizardMain();

  // 2. Простий стан для Stage1
  const isStage1Active = useMemo(() => {
    return mainWizard.ui.currentStage === 1;
  }, [mainWizard.ui.currentStage]);

  const canProceedToStage2 = useMemo(() => {
    // Поки що повертаємо true для тестування
    return Boolean(mainWizard.ui.sessionId && isStage1Active);
  }, [mainWizard.ui.sessionId, isStage1Active]);

  // 3. Дії (hooks на верхньому рівні)
  const completeStage1 = useCallback(() => {
    if (canProceedToStage2) {
      mainWizard.actions.completeCurrentStage();
    }
  }, [canProceedToStage2, mainWizard.actions]);

  const resetStage1 = useCallback(() => {
    // Тимчасово тільки логування
    console.log('Stage1 reset requested');
  }, []);

  // 4. Групування дій в об'єкт
  const actions = useMemo(
    () => ({
      completeStage1,
      resetStage1,
    }),
    [completeStage1, resetStage1]
  );

  return {
    // Головний wizard
    mainWizard,

    // UI стан
    ui: {
      sessionId: mainWizard.ui.sessionId,
      isStage1Active,
      canProceedToStage2,
      currentStage: mainWizard.ui.currentStage,
    },

    // Готовність
    readiness: {
      canProceedToStage2,
      isWizardReady: Boolean(mainWizard.ui.sessionId),
      isStage1Ready: isStage1Active && Boolean(mainWizard.ui.sessionId),
    },

    // Дії
    actions,

    // Завантаження та помилки з головного wizard
    loading: mainWizard.loading,
    errors: mainWizard.errors,
  };
};

export type UseStage1SimpleReturn = ReturnType<typeof useStage1Simple>;
