/**
 * @fileoverview Хук для обробки платежів (крок 3.3)
 * @module domain/wizard/hooks/stage-3
 */

import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { useWizardStore } from '../../store';

/**
 * Способи оплати
 */
type PaymentMethod = 'готівка' | 'термінал' | 'на_рахунок';

/**
 * Інтерфейс платіжної інформації
 */
interface PaymentInfo {
  paymentMethod: PaymentMethod;
  totalAmount: number;
  paidAmount: number;
  debtAmount: number;
  isFullyPaid: boolean;
}

/**
 * Хук для обробки платежів
 * 💰 Композиція: Zustand + валідація + розрахунки
 */
export const usePaymentProcessing = () => {
  // 🏪 Zustand - глобальний стан
  const { orderItems, executionParams, selectedDiscount, addError, addWarning } = useWizardStore();

  // 💰 Локальний стан платежу
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('готівка');
  const [paidAmount, setPaidAmount] = useState<number>(0);

  // 🧮 Розрахунок загальної суми
  const calculateTotalAmount = useCallback(() => {
    if (!orderItems || orderItems.length === 0) return 0;

    // Базова сума всіх предметів
    const itemsTotal = orderItems.reduce(
      (sum: number, item: any) => sum + (item.finalPrice || 0),
      0
    );

    // Додаємо націнку за терміновість
    let urgencyAmount = 0;
    if (executionParams?.urgencyPricing?.additionalCost) {
      urgencyAmount = executionParams.urgencyPricing.additionalCost;
    }

    // Віднімаємо знижку
    const discountAmount = selectedDiscount?.amount || 0;

    const total = itemsTotal + urgencyAmount - discountAmount;
    return Math.max(0, total); // Не може бути негативним
  }, [orderItems, executionParams, selectedDiscount]);

  // 💰 Мутація для процесу оплати
  const processPaymentMutation = useMutation({
    mutationFn: async ({ amount, method }: { amount: number; method: PaymentMethod }) => {
      // Мок логіка обробки платежу
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (amount < 0) {
        throw new Error('Сума платежу не може бути негативною');
      }

      const totalAmount = calculateTotalAmount();
      if (amount > totalAmount) {
        throw new Error('Сума платежу перевищує загальну вартість');
      }

      return {
        success: true,
        paidAmount: amount,
        method,
        processedAt: new Date(),
      };
    },
    onSuccess: (result, variables) => {
      setPaidAmount(variables.amount);
      addWarning(`Оплачено ${variables.amount} грн через ${variables.method}`);
    },
    onError: (error) => {
      addError(`Помилка обробки платежу: ${error.message}`);
    },
  });

  // 💰 Методи роботи з платежами
  const processPayment = useCallback(
    async (amount: number) => {
      if (amount <= 0) {
        addError('Введіть коректну суму для оплати');
        return;
      }

      await processPaymentMutation.mutateAsync({
        amount,
        method: paymentMethod,
      });
    },
    [paymentMethod, processPaymentMutation, addError]
  );

  const setFullPayment = useCallback(() => {
    const totalAmount = calculateTotalAmount();
    setPaidAmount(totalAmount);
  }, [calculateTotalAmount]);

  const clearPayment = useCallback(() => {
    setPaidAmount(0);
  }, []);

  // 📊 Платіжна інформація
  const paymentInfo: PaymentInfo = useMemo(() => {
    const totalAmount = calculateTotalAmount();
    const debtAmount = Math.max(0, totalAmount - paidAmount);

    return {
      paymentMethod,
      totalAmount,
      paidAmount,
      debtAmount,
      isFullyPaid: debtAmount === 0,
    };
  }, [paymentMethod, paidAmount, calculateTotalAmount]);

  // 📋 Опції способів оплати
  const paymentMethodOptions = useMemo(
    () => [
      { value: 'готівка' as PaymentMethod, label: 'Готівка' },
      { value: 'термінал' as PaymentMethod, label: 'Термінал' },
      { value: 'на_рахунок' as PaymentMethod, label: 'На рахунок' },
    ],
    []
  );

  // ✅ Валідація
  const validatePayment = useCallback(
    (amount: number): { isValid: boolean; error?: string } => {
      if (amount < 0) {
        return { isValid: false, error: 'Сума не може бути негативною' };
      }

      const totalAmount = calculateTotalAmount();
      if (amount > totalAmount) {
        return { isValid: false, error: 'Сума перевищує загальну вартість' };
      }

      return { isValid: true };
    },
    [calculateTotalAmount]
  );

  // 🧮 Розрахунки для UI
  const getPaymentBreakdown = useCallback(() => {
    if (!orderItems || orderItems.length === 0) return null;

    const itemsTotal = orderItems.reduce(
      (sum: number, item: any) => sum + (item.finalPrice || 0),
      0
    );
    const urgencyAmount = executionParams?.urgencyPricing?.additionalCost || 0;
    const discountAmount = selectedDiscount?.amount || 0;

    return {
      itemsTotal,
      urgencyAmount,
      discountAmount,
      finalTotal: itemsTotal + urgencyAmount - discountAmount,
    };
  }, [orderItems, executionParams, selectedDiscount]);

  return {
    // 💰 Стан платежу
    paymentInfo,
    paymentMethodOptions,

    // 🔄 Стани операцій
    isProcessing: processPaymentMutation.isPending,

    // 💰 Методи платежу
    setPaymentMethod,
    setPaidAmount,
    processPayment,
    setFullPayment,
    clearPayment,

    // ✅ Валідація
    validatePayment,

    // 🧮 Розрахунки
    calculateTotalAmount,
    getPaymentBreakdown,
  };
};
