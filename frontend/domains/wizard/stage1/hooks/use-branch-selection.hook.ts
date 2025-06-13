// 🎯 ХУК для вибору філії та створення ордера
// Спрощена логіка без окремого етапу базової інформації

import { useCallback, useMemo, useEffect } from 'react';

import { useBasicOrderInfo } from './use-basic-order-info.hook';

/**
 * 🎯 Хук для вибору філії та створення ордера
 *
 * Функціональність:
 * - Вибір філії
 * - Автогенерація номера квитанції
 * - Введення унікальної мітки
 * - Створення ордера
 */
export const useBranchSelection = () => {
  // 1. Базовий хук (перевикористовуємо існуючу логіку)
  const basicOrderInfo = useBasicOrderInfo();

  // 2. Автоматична генерація номеру квитанції
  useEffect(() => {
    const hasUniqueTag = !!basicOrderInfo.computed.hasUniqueTag;
    const hasReceiptNumber = !!basicOrderInfo.computed.hasReceiptNumber;
    const selectedBranch = basicOrderInfo.computed.selectedBranch;
    const isGenerating = basicOrderInfo.loading.isGeneratingReceiptNumber;

    // Генеруємо номер квитанції автоматично після введення унікальної мітки
    if (hasUniqueTag && selectedBranch && !hasReceiptNumber && !isGenerating) {
      console.log('🎯 Автоматична генерація номеру квитанції:', {
        hasUniqueTag,
        selectedBranch: selectedBranch.name,
        hasReceiptNumber,
        isGenerating,
      });

      // Використовуємо код філії для генерації номеру
      const branchCode = selectedBranch.code || 'DEFAULT';
      basicOrderInfo.actions.generateReceiptNumber(branchCode);
    }
  }, [
    basicOrderInfo.computed.hasUniqueTag,
    basicOrderInfo.computed.hasReceiptNumber,
    basicOrderInfo.computed.selectedBranch,
    basicOrderInfo.loading.isGeneratingReceiptNumber,
    basicOrderInfo.actions,
  ]);

  // 3. Обробники дій
  const handleBranchSelected = useCallback(
    (branchId: string) => {
      basicOrderInfo.actions.selectBranch(branchId);
    },
    [basicOrderInfo.actions]
  );

  const handleUniqueTagEntered = useCallback(
    (tag: string) => {
      basicOrderInfo.actions.setUniqueTag(tag);
    },
    [basicOrderInfo.actions]
  );

  const handleCreateOrder = useCallback(() => {
    // Створення ордера з обраними параметрами
    basicOrderInfo.actions.completeBasicOrder();
  }, [basicOrderInfo.actions]);

  // 4. Computed значення
  const computed = useMemo(() => {
    return {
      // Стан готовності
      hasBranchSelected: !!basicOrderInfo.computed.selectedBranch,
      hasUniqueTag: !!basicOrderInfo.computed.hasUniqueTag,
      hasReceiptNumber: !!basicOrderInfo.computed.hasReceiptNumber,

      // Готовність до створення ордера
      canCreateOrder:
        !!basicOrderInfo.computed.selectedBranch &&
        !!basicOrderInfo.computed.hasUniqueTag &&
        !!basicOrderInfo.computed.hasReceiptNumber,

      // Обрані значення
      selectedBranch: basicOrderInfo.computed.selectedBranch,
      uniqueTag: basicOrderInfo.computed.basicOrderData?.uniqueTag,
      receiptNumber: basicOrderInfo.computed.basicOrderData?.receiptNumber,

      // Стан завершення
      isBranchSelectionCompleted:
        !!basicOrderInfo.computed.selectedBranch &&
        !!basicOrderInfo.computed.hasUniqueTag &&
        !!basicOrderInfo.computed.hasReceiptNumber,
    };
  }, [
    basicOrderInfo.computed.selectedBranch,
    basicOrderInfo.computed.hasUniqueTag,
    basicOrderInfo.computed.hasReceiptNumber,
    basicOrderInfo.computed.basicOrderData?.uniqueTag,
    basicOrderInfo.computed.basicOrderData?.receiptNumber,
  ]);

  // 5. Групування повернення
  return {
    // Дані
    data: {
      branches: basicOrderInfo.data.branches,
      selectedBranch: computed.selectedBranch,
      uniqueTag: computed.uniqueTag,
      receiptNumber: computed.receiptNumber,
    },

    // Стани завантаження
    loading: {
      isLoadingBranches: basicOrderInfo.loading.isLoadingBranches,
      isCreatingOrder: basicOrderInfo.loading.isCompleting,
      isGeneratingReceiptNumber: basicOrderInfo.loading.isGeneratingReceiptNumber,
      isSettingUniqueTag: basicOrderInfo.loading.isSettingUniqueTag,
      isSelectingBranch: basicOrderInfo.loading.isSelectingBranch,
      isAnyLoading:
        basicOrderInfo.loading.isLoadingBranches ||
        basicOrderInfo.loading.isCompleting ||
        basicOrderInfo.loading.isGeneratingReceiptNumber ||
        basicOrderInfo.loading.isSettingUniqueTag ||
        basicOrderInfo.loading.isSelectingBranch,
    },

    // Дії
    actions: {
      selectBranch: handleBranchSelected,
      setUniqueTag: handleUniqueTagEntered,
      createOrder: handleCreateOrder,
      // Додаткові дії з базового хука
      generateReceiptNumber: basicOrderInfo.actions.generateReceiptNumber,
    },

    // Форми
    form: basicOrderInfo.form,

    // Computed значення
    computed,

    // Базовий хук (для доступу до всіх функцій)
    basicOrderInfo,
  };
};

export type UseBranchSelectionReturn = ReturnType<typeof useBranchSelection>;
