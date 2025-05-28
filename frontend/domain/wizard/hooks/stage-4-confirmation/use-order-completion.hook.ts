/**
 * @fileoverview Хук для завершення замовлення (крок 4.3)
 * @module domain/wizard/hooks/stage-4
 */

import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { useWizardStore } from '../../store';

/**
 * Результат завершення замовлення
 */
interface OrderCompletionResult {
  orderId: string;
  receiptNumber: string;
  createdAt: Date;
  estimatedCompletionDate: Date;
  status: 'completed' | 'pending_signature' | 'payment_required';
}

/**
 * Хук для завершення замовлення
 * ✅ Композиція: збереження + завершення + очищення
 */
export const useOrderCompletion = () => {
  // 🏪 Zustand - отримуємо всі дані та методи
  const {
    selectedClient,
    selectedBranch,
    orderItems,
    executionParams,
    selectedDiscount,
    completeWizard,
    resetWizard,
    addError,
    addWarning,
  } = useWizardStore();

  // 💾 Мутація для збереження замовлення
  const saveOrderMutation = useMutation({
    mutationFn: async (): Promise<OrderCompletionResult> => {
      // Валідація обов'язкових даних
      if (!selectedClient || !selectedBranch || !orderItems || orderItems.length === 0) {
        throw new Error("Відсутні обов'язкові дані для збереження замовлення");
      }

      if (!executionParams?.executionDate) {
        throw new Error('Не вказано дату виконання');
      }

      // Підготовка даних замовлення
      const orderData = {
        client: selectedClient,
        branch: selectedBranch,
        items: orderItems,
        execution: executionParams,
        discount: selectedDiscount,
        createdAt: new Date(),
      };

      // Мок логіка збереження (тут буде API виклик)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Генерація результату
      const orderId = `ORD-${Date.now().toString().slice(-8)}`;
      const receiptNumber = `RC-${Date.now().toString().slice(-6)}`;

      return {
        orderId,
        receiptNumber,
        createdAt: new Date(),
        estimatedCompletionDate: executionParams.executionDate,
        status: 'completed',
      };
    },
    onSuccess: (result) => {
      addWarning(`Замовлення ${result.orderId} успішно збережено`);
    },
    onError: (error) => {
      addError(`Помилка збереження замовлення: ${error.message}`);
    },
  });

  // 🎯 Мутація для повного завершення
  const completeOrderMutation = useMutation({
    mutationFn: async (): Promise<OrderCompletionResult> => {
      // Спочатку зберігаємо замовлення
      const result = await saveOrderMutation.mutateAsync();

      // Додаткові дії завершення (мок логіка)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Оновлюємо стан wizard
      completeWizard();

      return result;
    },
    onSuccess: (result) => {
      addWarning(`Замовлення ${result.orderId} повністю завершено`);
    },
    onError: (error) => {
      addError(`Помилка завершення замовлення: ${error.message}`);
    },
  });

  // 🔄 Методи керування процесом
  const completeAndReset = useCallback(async () => {
    try {
      const result = await completeOrderMutation.mutateAsync();

      // Невелика затримка для користувача побачити результат
      setTimeout(() => {
        resetWizard();
      }, 2000);

      return result;
    } catch (error) {
      addError('Не вдалося завершити та скинути замовлення');
      throw error;
    }
  }, [completeOrderMutation, resetWizard, addError]);

  const saveWithoutCompletion = useCallback(async () => {
    try {
      const result = await saveOrderMutation.mutateAsync();
      addWarning('Замовлення збережено як чернетка');
      return result;
    } catch (error) {
      addError('Не вдалося зберегти замовлення');
      throw error;
    }
  }, [saveOrderMutation, addError, addWarning]);

  // 📊 Підготовка даних для збереження
  const getOrderSummary = useCallback(() => {
    if (!selectedClient || !selectedBranch || !orderItems) {
      return null;
    }

    const itemsTotal = orderItems.reduce(
      (sum: number, item: any) => sum + (item.finalPrice || 0),
      0
    );
    const urgencyAmount = executionParams?.urgencyPricing?.additionalCost || 0;
    const discountAmount = selectedDiscount?.amount || 0;
    const finalTotal = itemsTotal + urgencyAmount - discountAmount;

    return {
      clientName: selectedClient.fullName,
      branchName: selectedBranch.name,
      itemsCount: orderItems.length,
      financial: {
        itemsTotal,
        urgencyAmount,
        discountAmount,
        finalTotal,
      },
      executionDate: executionParams?.executionDate,
      urgencyLevel: executionParams?.urgencyLevel,
    };
  }, [selectedClient, selectedBranch, orderItems, executionParams, selectedDiscount]);

  // ✅ Валідація готовності до завершення
  const completionValidation = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!selectedClient) errors.push('Не вибрано клієнта');
    if (!selectedBranch) errors.push('Не вибрано філію');
    if (!orderItems || orderItems.length === 0) errors.push('Немає предметів у замовленні');
    if (!executionParams?.executionDate) errors.push('Не встановлено дату виконання');

    // Попередження
    if (orderItems?.some((item: any) => item.defects?.includes('без_гарантій'))) {
      warnings.push('Є предмети без гарантій');
    }

    if (!selectedDiscount && orderItems && orderItems.length > 5) {
      warnings.push('Можливо варто застосувати знижку для великого замовлення');
    }

    return {
      canComplete: errors.length === 0,
      errors,
      warnings,
      readinessPercentage: errors.length === 0 ? 100 : Math.max(0, 100 - errors.length * 25),
    };
  }, [selectedClient, selectedBranch, orderItems, executionParams, selectedDiscount]);

  // 📊 Інформація про завершення
  const completionInfo = useMemo(
    () => ({
      isSaving: saveOrderMutation.isPending,
      isCompleting: completeOrderMutation.isPending,
      isAnyOperation: saveOrderMutation.isPending || completeOrderMutation.isPending,
      canComplete: completionValidation.canComplete,
      hasWarnings: completionValidation.warnings.length > 0,
      orderSummary: getOrderSummary(),
    }),
    [
      saveOrderMutation.isPending,
      completeOrderMutation.isPending,
      completionValidation.canComplete,
      completionValidation.warnings.length,
      getOrderSummary,
    ]
  );

  return {
    // 📊 Дані
    completionValidation,
    completionInfo,
    getOrderSummary,

    // 💾 Операції збереження
    saveOrder: saveOrderMutation.mutateAsync,
    completeOrder: completeOrderMutation.mutateAsync,

    // 🔧 Комбіновані методи
    completeAndReset,
    saveWithoutCompletion,

    // 🔄 Стани
    isSaving: saveOrderMutation.isPending,
    isCompleting: completeOrderMutation.isPending,
  };
};
