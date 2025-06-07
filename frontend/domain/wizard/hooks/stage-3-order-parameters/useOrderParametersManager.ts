/**
 * @fileoverview Менеджер для координації всіх параметрів замовлення на етапі 3
 *
 * Відповідальність:
 * - Об'єднання всіх хуків етапу 3
 * - Валідація повноти параметрів
 * - Розрахунок підсумкової вартості
 * - Експорт даних для створення замовлення
 */

import { useState, useCallback, useMemo } from 'react';

import { useExecutionParameters } from './useExecutionParameters';
import { useOrderAdditionalInfo } from './useOrderAdditionalInfo';
import { useOrderDiscounts } from './useOrderDiscounts';
import { useOrderPayment } from './useOrderPayment';

import type {
  OrderParameters,
  UseOrderParametersManagerReturn,
  ExecutionParameters,
  OrderDiscounts,
  OrderPayment,
  OrderAdditionalInfo,
} from './types';
import type { OrderDTO } from '@/shared/api/generated/order/aksiApi.schemas';

/**
 * Менеджер для координації всіх параметрів замовлення на етапі 3
 *
 * @example
 * ```tsx
 * const {
 *   parameters,
 *   isValid,
 *   totalOrderAmount,
 *   finalOrderAmount,
 *   validateParameters,
 *   exportOrderData
 * } = useOrderParametersManager();
 *
 * // Перевірити валідність
 * if (validateParameters()) {
 *   // Експортувати дані
 *   const orderData = exportOrderData();
 * }
 * ```
 */
export function useOrderParametersManager(): UseOrderParametersManagerReturn {
  // =====================================
  // Дочірні хуки
  // =====================================

  const executionHook = useExecutionParameters();
  const discountsHook = useOrderDiscounts();
  const paymentHook = useOrderPayment();
  const additionalInfoHook = useOrderAdditionalInfo();

  // =====================================
  // Локальний стан
  // =====================================

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // =====================================
  // Обчислювані значення
  // =====================================

  const parameters: OrderParameters = useMemo(() => ({
    execution: executionHook.parameters,
    discounts: discountsHook.discounts,
    payment: paymentHook.payment,
    additionalInfo: additionalInfoHook.additionalInfo,
  }), [
    executionHook.parameters,
    discountsHook.discounts,
    paymentHook.payment,
    additionalInfoHook.additionalInfo,
  ]);

  const totalOrderAmount = useMemo(() => {
    return paymentHook.payment.totalAmount || 0;
  }, [paymentHook.payment.totalAmount]);

  const finalOrderAmount = useMemo(() => {
    const total = totalOrderAmount;
    const discount = discountsHook.discounts.totalDiscountAmount || 0;

    // Урахування терміновості
    const urgencyMultiplier = executionHook.urgencyOptions.find(
      opt => opt.value === executionHook.parameters.urgencyLevel
    )?.priceImpact || 0;

    const urgencyAmount = (total * urgencyMultiplier) / 100;

    return Math.max(0, total + urgencyAmount - discount);
  }, [
    totalOrderAmount,
    discountsHook.discounts.totalDiscountAmount,
    executionHook.parameters.urgencyLevel,
    executionHook.urgencyOptions,
  ]);

  // =====================================
  // Валідація
  // =====================================

  const isValid = useMemo(() => {
    const errors: string[] = [];

    // Перевірка параметрів виконання
    if (!parameters.execution.completionDate) {
      errors.push('Не встановлено дату завершення');
    }

    // Перевірка кастомної знижки
    if (parameters.discounts.discountType === 'custom') {
      if (!parameters.discounts.customDiscountPercent &&
          !parameters.discounts.customDiscountAmount) {
        errors.push('Для кастомної знижки потрібно вказати відсоток або суму');
      }
    }

    // Перевірка передоплати
    if (parameters.payment.prepaymentAmount > totalOrderAmount) {
      errors.push('Передоплата не може перевищувати загальну суму');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }, [parameters, totalOrderAmount]);

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Оновити параметри виконання
   */
  const updateExecution = useCallback((execution: Partial<ExecutionParameters>) => {
    Object.entries(execution).forEach(([key, value]) => {
      switch (key) {
        case 'completionDate':
          if (typeof value === 'string') {
            executionHook.setCompletionDate(value);
          }
          break;
        case 'urgencyLevel':
          if (value) {
            executionHook.setUrgencyLevel(value as any);
          }
          break;
      }
    });
  }, [executionHook]);

  /**
   * Оновити знижки
   */
  const updateDiscounts = useCallback((discounts: Partial<OrderDiscounts>) => {
    Object.entries(discounts).forEach(([key, value]) => {
      switch (key) {
        case 'discountType':
          if (value) {
            discountsHook.setDiscountType(value as any);
          }
          break;
        case 'customDiscountPercent':
          if (typeof value === 'number') {
            discountsHook.setCustomDiscountPercent(value);
          }
          break;
        case 'customDiscountAmount':
          if (typeof value === 'number') {
            discountsHook.setCustomDiscountAmount(value);
          }
          break;
      }
    });
  }, [discountsHook]);

  /**
   * Оновити параметри оплати
   */
  const updatePayment = useCallback((payment: Partial<OrderPayment>) => {
    Object.entries(payment).forEach(([key, value]) => {
      switch (key) {
        case 'paymentMethod':
          if (value) {
            paymentHook.setPaymentMethod(value as any);
          }
          break;
        case 'prepaymentAmount':
          if (typeof value === 'number') {
            paymentHook.setPrepaymentAmount(value);
          }
          break;
      }
    });
  }, [paymentHook]);

  /**
   * Оновити додаткову інформацію
   */
  const updateAdditionalInfo = useCallback((info: Partial<OrderAdditionalInfo>) => {
    Object.entries(info).forEach(([key, value]) => {
      switch (key) {
        case 'notes':
          if (typeof value === 'string') {
            additionalInfoHook.setNotes(value);
          }
          break;
        case 'clientRequirements':
          if (typeof value === 'string') {
            additionalInfoHook.setClientRequirements(value);
          }
          break;
        case 'internalNotes':
          if (typeof value === 'string') {
            additionalInfoHook.setInternalNotes(value);
          }
          break;
      }
    });
  }, [additionalInfoHook]);

  /**
   * Провести валідацію параметрів
   */
  const validateParameters = useCallback(() => {
    return isValid;
  }, [isValid]);

  /**
   * Очистити всі параметри
   */
  const clearAllParameters = useCallback(() => {
    executionHook.clearParameters();
    discountsHook.clearDiscounts();
    paymentHook.clearPayment();
    additionalInfoHook.clearAdditionalInfo();
    setValidationErrors([]);
  }, [executionHook, discountsHook, paymentHook, additionalInfoHook]);

  /**
   * Експортувати дані для створення замовлення
   */
  const exportOrderData = useCallback((): Partial<OrderDTO> => {
    return {
      completionDate: parameters.execution.completionDate,
      urgencyLevel: parameters.execution.urgencyLevel,
      paymentMethod: parameters.payment.paymentMethod,
      prepaymentAmount: parameters.payment.prepaymentAmount,
      notes: parameters.additionalInfo.notes,
      clientRequirements: parameters.additionalInfo.clientRequirements,
      internalNotes: parameters.additionalInfo.internalNotes,
      tags: parameters.additionalInfo.tags,
      discountType: parameters.discounts.discountType,
      customDiscountPercent: parameters.discounts.customDiscountPercent,
      customDiscountAmount: parameters.discounts.customDiscountAmount,
      totalAmount: finalOrderAmount,
    };
  }, [parameters, finalOrderAmount]);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    parameters,
    isValid,
    validationErrors,
    totalOrderAmount,
    finalOrderAmount,

    // Дії
    updateExecution,
    updateDiscounts,
    updatePayment,
    updateAdditionalInfo,
    validateParameters,
    clearAllParameters,
    exportOrderData,

    // Дочірні хуки для прямого доступу
    executionHook,
    discountsHook,
    paymentHook,
    additionalInfoHook,
  };
}
