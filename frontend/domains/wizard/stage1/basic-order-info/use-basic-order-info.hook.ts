/**
 * @fileoverview Композиційний хук для домену "Основна інформація про замовлення"
 *
 * Об'єднує всі розділені хуки в єдиний інтерфейс
 * за принципом "Golden Rule" архітектури та SOLID принципами
 */

import { useMemo } from 'react';

import { useBasicOrderInfoStore } from './basic-order-info.store';
import { useBasicOrderInfoBusiness } from './use-basic-order-info-business.hook';
import { useBasicOrderInfoForms } from './use-basic-order-info-forms.hook';

/**
 * Головний композиційний хук домену "Основна інформація про замовлення"
 *
 * Принципи:
 * - Single Responsibility: кожен підхук має одну відповідальність
 * - Open/Closed: легко розширювати без модифікації існуючого коду
 * - Dependency Inversion: залежність від абстракцій (хуків), а не конкретних реалізацій
 *
 * Примітка: workflow управляється загальним Stage1 workflow хуком
 */
export const useBasicOrderInfo = () => {
  // 1. Бізнес-логіка (API + стор координація)
  const business = useBasicOrderInfoBusiness();

  // 2. Управління формами
  const forms = useBasicOrderInfoForms();

  // 3. Додатковий UI стан (що не входить в бізнес-логіку)
  const {
    currentStep,
    validationErrors,
    filteredBranches,
    isAdvancedMode,
    autoSaveEnabled,
    showValidationHints,
    branchFormData,

    // UI дії
    setCurrentStep,
    setOrderFormField,
    updateBranchFormData,
    filterBranches,
    setValidationError,
    clearValidationErrors,
    toggleAdvancedMode,
    setAutoSaveEnabled,
    setShowValidationHints,
  } = useBasicOrderInfoStore();

  // 4. Мемоізовані бізнес-операції (стабільні референції)
  const stableBusinessActions = useMemo(
    () => ({
      initializeBasicOrder: business.initializeBasicOrder,
      initializeWithBranches: business.initializeWithBranches,
      updateBasicOrderData: business.updateBasicOrderData,
      validateBasicOrder: business.validateBasicOrder,
      selectBranchForOrder: business.selectBranchForOrder,
      completeBasicOrder: business.completeBasicOrder,
      cancelBasicOrder: business.cancelBasicOrder,
      resetBasicOrder: business.resetBasicOrder,
      startWorkflowProcess: business.startWorkflowProcess,
      loadBranches: business.loadBranches,
      refreshBranchesData: business.refreshBranchesData,
      checkBranchesLoaded: business.checkBranchesLoaded,
      showBranchSelection: business.showBranchSelection,
      hideBranchSelection: business.hideBranchSelection,
      showReceiptGeneration: business.showReceiptGeneration,
      hideReceiptGeneration: business.hideReceiptGeneration,
      toggleAutoGenerate: business.toggleAutoGenerate,
      generateReceiptNumberForBranch: business.generateReceiptNumberForBranch,
      setUniqueTagForOrder: business.setUniqueTagForOrder,
      setExternalSessionId: business.setExternalSessionId,
    }),
    [
      business.initializeBasicOrder,
      business.initializeWithBranches,
      business.updateBasicOrderData,
      business.validateBasicOrder,
      business.selectBranchForOrder,
      business.completeBasicOrder,
      business.cancelBasicOrder,
      business.resetBasicOrder,
      business.startWorkflowProcess,
      business.loadBranches,
      business.refreshBranchesData,
      business.checkBranchesLoaded,
      business.showBranchSelection,
      business.hideBranchSelection,
      business.showReceiptGeneration,
      business.hideReceiptGeneration,
      business.toggleAutoGenerate,
      business.generateReceiptNumberForBranch,
      business.setUniqueTagForOrder,
      business.setExternalSessionId,
    ]
  );

  // 5. Групування результатів за логічними блоками
  const ui = useMemo(
    () => ({
      // З бізнес-логіки
      ...business.ui,

      // Додатковий UI стан
      currentStep,
      validationErrors,
      filteredBranches,
      isAdvancedMode,
      autoSaveEnabled,
      showValidationHints,
      branchFormData,
    }),
    [
      business.ui,
      currentStep,
      validationErrors,
      filteredBranches,
      isAdvancedMode,
      autoSaveEnabled,
      showValidationHints,
      branchFormData,
    ]
  );

  const data = useMemo(
    () => ({
      ...business.data,
    }),
    [business.data]
  );

  const loading = useMemo(
    () => ({
      ...business.loading,
    }),
    [business.loading]
  );

  const actions = useMemo(
    () => ({
      // Стабільні бізнес-операції
      initializeBasicOrder: stableBusinessActions.initializeBasicOrder,
      initializeWithBranches: stableBusinessActions.initializeWithBranches,
      updateBasicOrderData: stableBusinessActions.updateBasicOrderData,
      validateBasicOrder: stableBusinessActions.validateBasicOrder,
      selectBranchForOrder: stableBusinessActions.selectBranchForOrder,
      completeBasicOrder: stableBusinessActions.completeBasicOrder,
      cancelBasicOrder: stableBusinessActions.cancelBasicOrder,
      resetBasicOrder: stableBusinessActions.resetBasicOrder,
      startWorkflowProcess: stableBusinessActions.startWorkflowProcess,
      loadBranches: stableBusinessActions.loadBranches,
      refreshBranchesData: stableBusinessActions.refreshBranchesData,
      checkBranchesLoaded: stableBusinessActions.checkBranchesLoaded,
      showBranchSelection: stableBusinessActions.showBranchSelection,
      hideBranchSelection: stableBusinessActions.hideBranchSelection,
      showReceiptGeneration: stableBusinessActions.showReceiptGeneration,
      hideReceiptGeneration: stableBusinessActions.hideReceiptGeneration,
      toggleAutoGenerate: stableBusinessActions.toggleAutoGenerate,
      generateReceiptNumberForBranch: stableBusinessActions.generateReceiptNumberForBranch,
      setUniqueTagForOrder: stableBusinessActions.setUniqueTagForOrder,
      setSessionId: stableBusinessActions.setExternalSessionId,

      // UI управління
      setCurrentStep,
      setOrderFormField,
      updateBranchFormData,
      filterBranches,
      setValidationError,
      clearValidationErrors,
      toggleAdvancedMode,
      setAutoSaveEnabled,
      setShowValidationHints,
    }),
    [
      stableBusinessActions,
      setCurrentStep,
      setOrderFormField,
      updateBranchFormData,
      filterBranches,
      setValidationError,
      clearValidationErrors,
      toggleAdvancedMode,
      setAutoSaveEnabled,
      setShowValidationHints,
    ]
  );

  return {
    ui,
    data,
    loading,
    actions,
    forms,
  };
};

export type UseBasicOrderInfoReturn = ReturnType<typeof useBasicOrderInfo>;
