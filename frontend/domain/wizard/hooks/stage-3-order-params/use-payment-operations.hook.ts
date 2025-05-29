/**
 * @fileoverview Спрощений хук для операцій з платежами
 *
 * Прямо використовує orval API + zod без додаткових шарів трансформації
 * Слідує принципу "DDD inside, FSD outside"
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import {
  useApplyPayment,
  useAddPrepayment,
  type PaymentCalculationRequest,
} from '@/shared/api/generated/order';
import { zodSchemas } from '@/shared/api/generated/order';

import {
  PaymentProcessingService,
  type PaymentValidationData,
  type PaymentMethodType,
  type FinancialSummary,
} from '../../services/stage-3-order-params/payment-processing/payment-processing.service';
import { useWizardBase } from '../base.hook';

import type { ZodIssue } from 'zod';

/**
 * 🚀 Спрощений хук для операцій з платежами
 * Використовує orval API + zod безпосередньо
 */
export function usePaymentOperations() {
  const { logInfo, logError } = useWizardBase();
  const queryClient = useQueryClient();
  const paymentService = new PaymentProcessingService();

  // Orval мутації для платежів (правильні параметри: orderId та data)
  const applyPaymentMutation = useApplyPayment({
    mutation: {
      onSuccess: (data, variables) => {
        logInfo('Платіж застосовано:', data);
        queryClient.invalidateQueries({ queryKey: ['getOrderPayment', variables.orderId] });
      },
      onError: (error) => logError('Помилка застосування платежу:', error),
    },
  });

  // Orval мутації для передоплати (параметри: id та amount)
  const addPrepaymentMutation = useAddPrepayment({
    mutation: {
      onSuccess: (data, variables) => {
        logInfo('Передоплату додано:', data);
        queryClient.invalidateQueries({ queryKey: ['getOrderPayment', variables.id] });
      },
      onError: (error) => logError('Помилка додавання передоплати:', error),
    },
  });

  /**
   * 💰 Застосування платежу з orval zod валідацією
   */
  const applyPayment = useCallback(
    async (orderId: string, paymentData: PaymentCalculationRequest) => {
      // Використовуємо zod схему orval прямо
      const validationResult = zodSchemas.applyPaymentBody.safeParse(paymentData);

      if (!validationResult.success) {
        const errorMessages = validationResult.error.errors.map((e: ZodIssue) => e.message);
        throw new Error(errorMessages.join(', '));
      }

      return applyPaymentMutation.mutateAsync({ orderId, data: paymentData });
    },
    [applyPaymentMutation]
  );

  /**
   * 📋 Додавання передоплати з orval zod валідацією
   */
  const addPrepayment = useCallback(
    async (orderId: string, amount: number) => {
      if (amount <= 0) {
        throw new Error('Сума передоплати повинна бути більше нуля');
      }

      return addPrepaymentMutation.mutateAsync({ id: orderId, amount });
    },
    [addPrepaymentMutation]
  );

  /**
   * 📊 Отримання інформації про платіж
   */
  const getPaymentInfo = useCallback((orderId: string) => {
    return useGetOrderPayment(orderId, {
      query: { enabled: !!orderId },
    });
  }, []);

  /**
   * ✅ Валідація платіжних даних через сервіс
   */
  const validatePaymentData = useCallback(
    (paymentData: PaymentValidationData) => {
      return paymentService.validatePaymentData(paymentData);
    },
    [paymentService]
  );

  /**
   * 🧮 Розрахунок фінансового підсумку через сервіс
   */
  const calculateFinancialSummary = useCallback(
    (data: {
      totalAmount: number;
      paidAmount: number;
      prepaymentAmount?: number;
    }): FinancialSummary => {
      return paymentService.calculateFinancialSummary(data);
    },
    [paymentService]
  );

  /**
   * 🎯 Отримання способів оплати з сервісу
   */
  const getPaymentMethods = useCallback(() => {
    return paymentService.getPaymentMethodOptions();
  }, [paymentService]);

  /**
   * 💡 Отримання рекомендованого методу оплати
   */
  const getRecommendedPaymentMethod = useCallback(
    (amount: number) => {
      return paymentService.getRecommendedPaymentMethod(amount);
    },
    [paymentService]
  );

  /**
   * 🚫 Валідація лімітів платежу
   */
  const validatePaymentLimits = useCallback(
    (method: PaymentMethodType, amount: number) => {
      return paymentService.validatePaymentLimits(method, amount);
    },
    [paymentService]
  );

  /**
   * 💸 Перевірка можливості застосування передоплати
   */
  const canApplyPrepayment = useCallback(
    (totalAmount: number, prepaymentAmount: number, currentlyPaid: number = 0) => {
      return paymentService.canApplyPrepayment(totalAmount, prepaymentAmount, currentlyPaid);
    },
    [paymentService]
  );

  return {
    // Дані з orval хуків прямо
    isApplyingPayment: applyPaymentMutation.isPending,
    isAddingPrepayment: addPrepaymentMutation.isPending,
    paymentError:
      applyPaymentMutation.error?.message || addPrepaymentMutation.error?.message || null,

    // Методи
    applyPayment,
    addPrepayment,
    getPaymentInfo,
    validatePaymentData,
    calculateFinancialSummary,
    getPaymentMethods,
    getRecommendedPaymentMethod,
    validatePaymentLimits,
    canApplyPrepayment,

    // Утиліти форматування
    formatAmount: paymentService.formatFinancialAmount.bind(paymentService),

    // Утиліти очищення помилок
    clearErrors: () => {
      applyPaymentMutation.reset();
      addPrepaymentMutation.reset();
    },

    // Orval типи для TypeScript (реекспорт)
    zodSchemas,
  };
}

/**
 * 💰 Спрощений хук для швидкої валідації платежу
 */
export function usePaymentValidation() {
  const paymentService = new PaymentProcessingService();

  const validatePayment = useCallback(
    (paymentData: PaymentValidationData) => {
      return paymentService.validatePaymentData(paymentData);
    },
    [paymentService]
  );

  const validateMethod = useCallback(
    (method: string) => {
      return paymentService.validatePaymentMethod(method);
    },
    [paymentService]
  );

  return {
    validatePayment,
    validateMethod,
    getPaymentMethods: () => paymentService.getPaymentMethodOptions(),
    formatAmount: paymentService.formatFinancialAmount.bind(paymentService),
  };
}
