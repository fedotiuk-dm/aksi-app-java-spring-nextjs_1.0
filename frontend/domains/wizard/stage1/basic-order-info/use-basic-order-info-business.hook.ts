/**
 * @fileoverview Бізнес-логіка хук для домену "Основна інформація про замовлення"
 *
 * Відповідальність: координація між API та UI стором
 * Принцип: Single Responsibility Principle
 */

import { useCallback, useEffect } from 'react';

import { transformApiBranchesToDisplay } from './basic-order-info.schemas';
import { useBasicOrderInfoStore } from './basic-order-info.store';
import { useBasicOrderInfoAPI } from './use-basic-order-info-api.hook';

import type { BasicOrderUIFormData, BranchDisplayData } from './basic-order-info.schemas';

/**
 * Хук для бізнес-логіки основної інформації замовлення
 * Координує взаємодію між API та UI станом
 */
export const useBasicOrderInfoBusiness = () => {
  const {
    // Стан
    sessionId,
    isWorkflowActive,
    orderFormData,
    isDirty,
    isSubmitting,
    availableBranches,
    selectedBranch,
    showBranchSelector,
    showReceiptGenerator,
    autoGenerateReceipt,

    // Дії з стором
    setSessionId,
    setWorkflowActive,
    updateOrderFormData,
    setAvailableBranches,
    selectBranch,
    setDirty,
    setSubmitting,
    clearValidationErrors,
    setBranchSelectorVisible,
    setReceiptGeneratorVisible,
    setAutoGenerateReceipt,
    resetState,
  } = useBasicOrderInfoStore();

  // API операції
  const api = useBasicOrderInfoAPI(sessionId);

  // Координаційні бізнес-операції
  const initializeBasicOrder = useCallback(async () => {
    try {
      setSubmitting(true);
      clearValidationErrors();

      const newSessionId = await api.operations.initializeBasicOrder();
      setSessionId(newSessionId);
      setWorkflowActive(true);

      return newSessionId;
    } catch (error) {
      console.error('Business Error - Failed to initialize basic order:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [api.operations, setSessionId, setWorkflowActive, setSubmitting, clearValidationErrors]);

  const updateBasicOrderData = useCallback(
    async (data: Partial<BasicOrderUIFormData>) => {
      try {
        setSubmitting(true);

        // Оновлюємо локальний стан
        updateOrderFormData(data);

        // Синхронізуємо з сервером
        const response = await api.operations.updateBasicOrderData(data);

        setDirty(false);
        return response;
      } catch (error) {
        console.error('Business Error - Failed to update basic order data:', error);
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [api.operations, updateOrderFormData, setDirty, setSubmitting]
  );

  const validateBasicOrder = useCallback(async () => {
    try {
      return await api.operations.validateBasicOrder();
    } catch (error) {
      console.error('Business Error - Failed to validate basic order:', error);
      throw error;
    }
  }, [api.operations]);

  const selectBranchForOrder = useCallback(
    async (branchId: string) => {
      try {
        setSubmitting(true);

        // Спочатку оновлюємо UI стан (для миттєвого відгуку)
        let branch = availableBranches.find((b) => b.id === branchId);

        // Якщо філія не знайдена в локальному стані, шукаємо в API даних
        if (!branch && Array.isArray(api.data.branches)) {
          const apiBranch = api.data.branches.find((b) => b.id === branchId);
          if (apiBranch) {
            branch = transformApiBranchesToDisplay([apiBranch])[0];
          }
        }

        // Оновлюємо UI стан
        if (branch) {
          selectBranch(branch);
          setBranchSelectorVisible(false);
        }

        // API виклик
        return await api.operations.selectBranch(branchId);
      } catch (error) {
        console.error('Business Error - Failed to select branch:', error);
        // Якщо API помилка, але філія знайдена - залишаємо UI стан
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [
      api.operations,
      api.data.branches,
      availableBranches,
      selectBranch,
      setBranchSelectorVisible,
      setSubmitting,
    ]
  );

  const completeBasicOrder = useCallback(async () => {
    try {
      setSubmitting(true);
      return await api.operations.completeBasicOrder();
    } catch (error) {
      console.error('Business Error - Failed to complete basic order:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [api.operations, setSubmitting]);

  const cancelBasicOrder = useCallback(async () => {
    try {
      await api.operations.cancelBasicOrder();
    } catch (error) {
      console.error('Business Error - Failed to cancel basic order:', error);
    } finally {
      resetState();
    }
  }, [api.operations, resetState]);

  const resetBasicOrder = useCallback(async () => {
    try {
      await api.operations.resetBasicOrder();
    } catch (error) {
      console.error('Business Error - Failed to reset basic order:', error);
    } finally {
      resetState();
    }
  }, [api.operations, resetState]);

  const startWorkflowProcess = useCallback(async () => {
    try {
      setSubmitting(true);
      return await api.operations.startWorkflow();
    } catch (error) {
      console.error('Business Error - Failed to start workflow:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [api.operations, setSubmitting]);

  // Управління філіями
  const loadBranches = useCallback(
    async (branches: BranchDisplayData[]) => {
      setAvailableBranches(branches);
    },
    [setAvailableBranches]
  );

  const refreshBranchesData = useCallback(async () => {
    try {
      await api.operations.refreshBranches();

      // Отримуємо оновлені дані з API хука після рефрешу
      setTimeout(() => {
        const branchesFromApi = api.data.branches;

        if (Array.isArray(branchesFromApi)) {
          const branchesData = transformApiBranchesToDisplay(branchesFromApi);
          setAvailableBranches(branchesData);
        }
      }, 100);
    } catch (error) {
      console.error('Failed to refresh branches:', error);

      // Якщо є помилка, але дані все ж таки прийшли
      setTimeout(() => {
        const branchesFromApi = api.data.branches;
        if (Array.isArray(branchesFromApi)) {
          const branchesData = transformApiBranchesToDisplay(branchesFromApi);
          setAvailableBranches(branchesData);
        }
      }, 200);
    }
  }, [api.operations, api.data.branches, setAvailableBranches]);

  const checkBranchesLoaded = useCallback(async () => {
    if (!api.data.areBranchesLoaded && sessionId) {
      await refreshBranchesData();
    }
  }, [api.data.areBranchesLoaded, sessionId, refreshBranchesData]);

  // Автоматичне завантаження філій при ініціалізації сесії
  const initializeWithBranches = useCallback(async () => {
    try {
      const newSessionId = await initializeBasicOrder();

      // Запускаємо завантаження філій після ініціалізації
      setTimeout(() => {
        if (newSessionId) {
          refreshBranchesData();
        }
      }, 500); // Невелика затримка для стабілізації State Machine

      return newSessionId;
    } catch (error) {
      console.error('Business Error - Failed to initialize with branches:', error);
      throw error;
    }
  }, [initializeBasicOrder, refreshBranchesData]);

  const showBranchSelection = useCallback(() => {
    setBranchSelectorVisible(true);
  }, [setBranchSelectorVisible]);

  const hideBranchSelection = useCallback(() => {
    setBranchSelectorVisible(false);
  }, [setBranchSelectorVisible]);

  // Управління генерацією квитанції
  const showReceiptGeneration = useCallback(() => {
    setReceiptGeneratorVisible(true);
  }, [setReceiptGeneratorVisible]);

  const hideReceiptGeneration = useCallback(() => {
    setReceiptGeneratorVisible(false);
  }, [setReceiptGeneratorVisible]);

  const toggleAutoGenerate = useCallback(() => {
    setAutoGenerateReceipt(!autoGenerateReceipt);
  }, [autoGenerateReceipt, setAutoGenerateReceipt]);

  const generateReceiptNumberForBranch = useCallback(
    async (branchId: string) => {
      try {
        setSubmitting(true);

        console.log('🔍 Генерація номера квитанції для філії:', branchId);
        console.log('📋 Доступні філії (UI):', availableBranches);
        console.log('📋 Доступні філії (API):', api.data.branches);

        // Спочатку шукаємо в API даних (там є поле code)
        let branch = null;
        let branchCode = 'DEFAULT';

        if (Array.isArray(api.data.branches)) {
          branch = api.data.branches.find((b) => b.id === branchId);
          if (branch && branch.code) {
            branchCode = branch.code;
            console.log('✅ Знайдено філію в API даних:', {
              id: branch.id,
              name: branch.name,
              code: branch.code,
            });
          }
        }

        // Якщо не знайшли в API, шукаємо в UI даних
        if (!branch) {
          const uiBranch = availableBranches.find((b) => b.id === branchId);
          if (uiBranch && uiBranch.code) {
            branchCode = uiBranch.code;
            console.log('✅ Знайдено філію в UI даних:', {
              id: uiBranch.id,
              name: uiBranch.name,
              code: uiBranch.code,
            });
          }
        }

        if (!branch && !availableBranches.find((b) => b.id === branchId)) {
          throw new Error('Філія не знайдена');
        }

        console.log('🏷️ Використовуємо код філії:', branchCode);

        const receiptNumber = await api.operations.generateReceiptNumber(branchCode);
        console.log('🎫 Отримано номер квитанції:', receiptNumber);

        // Оновлюємо форму
        updateOrderFormData({ receiptNumber });

        return receiptNumber;
      } catch (error) {
        console.error('Business Error - Failed to generate receipt number:', error);
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [api.operations, api.data.branches, availableBranches, updateOrderFormData, setSubmitting]
  );

  const setUniqueTagForOrder = useCallback(
    async (uniqueTag: string) => {
      try {
        setSubmitting(true);

        await api.operations.setUniqueTag(uniqueTag);

        // Оновлюємо форму
        updateOrderFormData({ uniqueTag });

        return uniqueTag;
      } catch (error) {
        console.error('Business Error - Failed to set unique tag:', error);
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [api.operations, updateOrderFormData, setSubmitting]
  );

  // Зовнішнє встановлення sessionId (для синхронізації між доменами)
  const setExternalSessionId = useCallback(
    (newSessionId: string) => {
      setSessionId(newSessionId);
    },
    [setSessionId]
  );

  // Автоматичне завантаження філій при встановленні sessionId
  useEffect(() => {
    if (sessionId && availableBranches.length === 0) {
      refreshBranchesData();
    }
  }, [sessionId, availableBranches.length, refreshBranchesData]);

  // Автоматична обробка даних філій коли вони приходять з API
  useEffect(() => {
    const branchesFromApi = api.data.branches;

    if (Array.isArray(branchesFromApi) && availableBranches.length === 0) {
      const branchesData = transformApiBranchesToDisplay(branchesFromApi);
      setAvailableBranches(branchesData);
    }
  }, [api.data.branches, availableBranches.length, setAvailableBranches]);

  return {
    // Основні операції
    initializeBasicOrder,
    initializeWithBranches,
    updateBasicOrderData,
    validateBasicOrder,
    selectBranchForOrder,
    completeBasicOrder,
    cancelBasicOrder,
    resetBasicOrder,
    startWorkflowProcess,

    // Управління філіями
    loadBranches,
    refreshBranchesData,
    checkBranchesLoaded,
    showBranchSelection,
    hideBranchSelection,

    // Управління квитанціями
    showReceiptGeneration,
    hideReceiptGeneration,
    toggleAutoGenerate,
    generateReceiptNumberForBranch,
    setUniqueTagForOrder,

    // Синхронізація з іншими доменами
    setExternalSessionId,

    // API дані
    data: api.data,

    // Стани завантаження
    loading: api.loading,

    // UI стан
    ui: {
      sessionId,
      isWorkflowActive,
      orderFormData,
      isDirty,
      isSubmitting,
      availableBranches,
      selectedBranch,
      showBranchSelector,
      showReceiptGenerator,
      autoGenerateReceipt,
    },
  };
};

export type UseBasicOrderInfoBusinessReturn = ReturnType<typeof useBasicOrderInfoBusiness>;
