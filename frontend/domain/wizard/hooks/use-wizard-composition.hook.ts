/**
 * @fileoverview Головний композиційний хук для Order Wizard
 * @module domain/wizard/hooks
 */

import { useCallback, useMemo } from 'react';

import { useWizardNavigation } from './navigation';
import {
  useWizardBaseStore,
  useClientSelectionStore,
  useItemsManagerStore,
  useExecutionParametersStore,
  useDiscountsStore,
} from '../store';
import { WizardStep } from '../types/wizard-steps.types';

/**
 * Загальний стан wizard
 */
interface WizardStatus {
  currentStep: WizardStep;
  isValid: boolean;
  completionPercentage: number;
  totalErrors: number;
  totalWarnings: number;
  isReadyForNext: boolean;
}

/**
 * Головний композиційний хук для Order Wizard
 * 🎯 Об'єднує навігацію та глобальний стан
 */
export const useWizardComposition = () => {
  // 🧭 Навігація
  const navigation = useWizardNavigation();

  // 🏪 Глобальний стан з slice stores
  const { errors, warnings, resetWizard, addError, addWarning } = useWizardBaseStore();

  // Заглушки для даних (TODO: підключити реальні stores)
  const selectedClient = null;
  const selectedBranch = null;
  const orderItems: any[] = [];
  const executionParams = null;
  const selectedDiscount = null;

  // 📊 Загальний статус wizard
  const wizardStatus = useMemo((): WizardStatus => {
    const currentStep = navigation.currentStep;
    let completionPercentage = 0;
    let isValid = false;

    // Розрахунок completion percentage та валідності
    const hasClient = !!selectedClient;
    const hasBranch = !!selectedBranch;
    const hasItems = !!(orderItems && orderItems.length > 0);
    const hasExecution = !!executionParams?.executionDate;

    // Прогрес по етапах
    if (hasClient) completionPercentage += 25;
    if (hasBranch) completionPercentage += 15;
    if (hasItems) completionPercentage += 40;
    if (hasExecution) completionPercentage += 20;

    // Валідність поточного стану
    switch (currentStep) {
      case WizardStep.CLIENT_SELECTION:
        isValid = hasClient;
        break;
      case WizardStep.BRANCH_SELECTION:
        isValid = hasClient && hasBranch;
        break;
      case WizardStep.ITEM_MANAGER:
        isValid = hasClient && hasBranch && hasItems;
        break;
      case WizardStep.ORDER_PARAMETERS:
        isValid = hasClient && hasBranch && hasItems && hasExecution;
        break;
      case WizardStep.CONFIRMATION:
        isValid = hasClient && hasBranch && hasItems && hasExecution;
        break;
      default:
        isValid = false;
    }

    return {
      currentStep,
      isValid,
      completionPercentage: Math.min(completionPercentage, 100),
      totalErrors: errors.length,
      totalWarnings: warnings.length,
      isReadyForNext: isValid && errors.length === 0,
    };
  }, [
    navigation.currentStep,
    selectedClient,
    selectedBranch,
    orderItems,
    executionParams,
    errors.length,
    warnings.length,
  ]);

  // 🎯 Глобальні дії управління
  const globalActions = useMemo(
    () => ({
      // Перехід до наступного кроку з валідацією
      proceedNext: async () => {
        if (!wizardStatus.isValid) {
          addError('Завершіть поточний крок перед переходом до наступного');
          return false;
        }

        if (wizardStatus.totalErrors > 0) {
          addError(`Виправте ${wizardStatus.totalErrors} помилок перед продовженням`);
          return false;
        }

        try {
          await navigation.goToNextStep();
          return true;
        } catch (error) {
          addError('Не вдалося перейти до наступного кроку');
          return false;
        }
      },

      // Перехід до попереднього кроку
      goBack: async () => {
        try {
          await navigation.goToPreviousStep();
          return true;
        } catch (error) {
          addError('Не вдалося повернутися до попереднього кроку');
          return false;
        }
      },

      // Скидання всього wizard
      resetWizard: () => {
        resetWizard();
        navigation.goToStep(WizardStep.CLIENT_SELECTION);
      },

      // Швидкий перехід до specific кроку
      goToStep: async (step: WizardStep) => {
        try {
          await navigation.goToStep(step);
          return true;
        } catch (error) {
          addError(`Не вдалося перейти до кроку ${step}`);
          return false;
        }
      },
    }),
    [wizardStatus.isValid, wizardStatus.totalErrors, navigation, addError, resetWizard]
  );

  // 📋 Підсумок замовлення
  const orderSummary = useMemo(() => {
    if (!selectedClient || !orderItems) return null;

    const itemsTotal = orderItems.reduce(
      (sum: number, item: any) => sum + (item.finalPrice || 0),
      0
    );
    const urgencyAmount = executionParams?.urgencyPricing?.additionalCost || 0;
    const discountAmount = selectedDiscount?.amount || 0;
    const finalTotal = itemsTotal + urgencyAmount - discountAmount;

    return {
      client: {
        name: selectedClient.fullName,
        phone: selectedClient.phone,
      },
      branch: {
        name: selectedBranch?.name || 'Не вибрано',
      },
      items: {
        count: orderItems.length,
        total: itemsTotal,
      },
      execution: {
        date: executionParams?.executionDate,
        urgencyLevel: executionParams?.urgencyLevel || 'звичайне',
      },
      financial: {
        itemsTotal,
        urgencyAmount,
        discountAmount,
        finalTotal,
      },
    };
  }, [selectedClient, selectedBranch, orderItems, executionParams, selectedDiscount]);

  // 🎯 Стани завантаження (спрощені)
  const loadingStates = useMemo(
    () => ({
      isNavigating: false, // TODO: додати реальний стан навігації
      isAnyLoading: false, // TODO: додати інші стани завантаження з хуків етапів
    }),
    []
  );

  return {
    // 📊 Стан wizard
    wizardStatus,
    orderSummary,
    loadingStates,

    // 🧭 Навігація
    navigation: {
      currentStep: navigation.currentStep,
      currentSubStep: navigation.currentSubStep,
      canGoNext: wizardStatus.isReadyForNext,
      canGoBack: true, // спрощено для поки що
      ...globalActions,
    },

    // 🎯 Швидкі дії
    quickActions: {
      // Повний сброс
      fullReset: () => {
        globalActions.resetWizard();
        addWarning('Wizard повністю скинуто');
      },

      // Автоматичний розрахунок готовності
      checkReadiness: () => ({
        isReady: wizardStatus.completionPercentage >= 80 && wizardStatus.totalErrors === 0,
        completion: wizardStatus.completionPercentage,
        blockers: wizardStatus.totalErrors,
        warnings: wizardStatus.totalWarnings,
      }),

      // Швидка валідація
      quickValidate: () => {
        const issues: string[] = [];

        if (!selectedClient) issues.push('Не вибрано клієнта');
        if (!selectedBranch) issues.push('Не вибрано філії');
        if (!orderItems || orderItems.length === 0) issues.push('Немає предметів у замовленні');
        if (!executionParams?.executionDate) issues.push('Не встановлено дату виконання');

        return {
          isValid: issues.length === 0,
          issues,
        };
      },
    },

    // 🔧 Утиліти
    utils: {
      getStepName: (step: WizardStep) => {
        const stepNames: Record<WizardStep, string> = {
          [WizardStep.CLIENT_SELECTION]: 'Вибір клієнта',
          [WizardStep.BRANCH_SELECTION]: 'Вибір філії',
          [WizardStep.ITEM_MANAGER]: 'Управління предметами',
          [WizardStep.ORDER_PARAMETERS]: 'Параметри замовлення',
          [WizardStep.CONFIRMATION]: 'Підтвердження',
          [WizardStep.COMPLETED]: 'Завершено',
        };
        return stepNames[step] || step;
      },

      getProgressColor: () => {
        if (wizardStatus.totalErrors > 0) return 'error';
        if (wizardStatus.completionPercentage < 50) return 'warning';
        return 'success';
      },
    },
  };
};
