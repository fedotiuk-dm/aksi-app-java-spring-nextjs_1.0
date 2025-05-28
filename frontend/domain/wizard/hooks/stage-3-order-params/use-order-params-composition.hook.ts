/**
 * @fileoverview Композиційний хук для stage-3 - параметри замовлення
 * @module domain/wizard/hooks/stage-3
 */

import { useMemo } from 'react';

import { useExecutionParams } from './use-execution-params.hook';
import { useGlobalDiscounts } from './use-global-discounts.hook';
import { usePaymentProcessing } from './use-payment-processing.hook';

/**
 * Композиційний хук для stage-3 (параметри замовлення)
 * 📋 Об'єднує: параметри виконання + знижки + платежі
 */
export const useOrderParamsComposition = () => {
  // 📅 Підхуки stage-3
  const executionParams = useExecutionParams();
  const globalDiscounts = useGlobalDiscounts();
  const paymentProcessing = usePaymentProcessing();

  // 📊 Загальна валідація stage-3
  const validation = useMemo(() => {
    const hasValidExecutionDate = executionParams.executionInfo.hasValidDate;
    const hasProcessingErrors = executionParams.termsError || globalDiscounts.discountsError;

    const isStage3Valid = hasValidExecutionDate && !hasProcessingErrors;

    const completionPercentage =
      ([
        hasValidExecutionDate,
        true, // знижки опціональні
        true, // платежі можуть бути часткові
      ].filter(Boolean).length /
        3) *
      100;

    return {
      isValid: isStage3Valid,
      hasValidExecutionDate,
      hasProcessingErrors,
      completionPercentage,
      errors: [
        ...(!hasValidExecutionDate ? ['Не вибрано дату виконання'] : []),
        ...(hasProcessingErrors ? ['Помилки обробки даних'] : []),
      ],
    };
  }, [
    executionParams.executionInfo.hasValidDate,
    executionParams.termsError,
    globalDiscounts.discountsError,
  ]);

  // 📊 Загальна інформація про замовлення
  const orderSummary = useMemo(() => {
    const breakdown = paymentProcessing.getPaymentBreakdown();

    return {
      // Фінансова інформація
      itemsTotal: breakdown?.itemsTotal || 0,
      urgencyAmount: breakdown?.urgencyAmount || 0,
      discountAmount: breakdown?.discountAmount || 0,
      finalTotal: breakdown?.finalTotal || 0,

      // Виконання
      executionDate: executionParams.executionParams?.executionDate,
      urgencyLevel: executionParams.executionParams?.urgencyLevel,
      estimatedDays: executionParams.executionInfo.estimatedDays,

      // Знижки
      selectedDiscount: globalDiscounts.selectedDiscount,
      discountPercentage: globalDiscounts.discountInfo.discountPercentage,

      // Платежі
      paymentInfo: paymentProcessing.paymentInfo,
      isFullyPaid: paymentProcessing.paymentInfo.isFullyPaid,
    };
  }, [
    paymentProcessing.getPaymentBreakdown(),
    executionParams.executionParams,
    executionParams.executionInfo.estimatedDays,
    globalDiscounts.selectedDiscount,
    globalDiscounts.discountInfo.discountPercentage,
    paymentProcessing.paymentInfo,
  ]);

  // 🔄 Загальні стани завантаження
  const loadingStates = useMemo(
    () => ({
      isCalculatingTerms: executionParams.isCalculatingTerms,
      isCalculatingDiscounts: globalDiscounts.discountInfo.isCalculating,
      isProcessingPayment: paymentProcessing.isProcessing,
      isAnyLoading:
        executionParams.isCalculatingTerms ||
        globalDiscounts.discountInfo.isCalculating ||
        paymentProcessing.isProcessing,
    }),
    [
      executionParams.isCalculatingTerms,
      globalDiscounts.discountInfo.isCalculating,
      paymentProcessing.isProcessing,
    ]
  );

  return {
    // 📅 Параметри виконання
    execution: executionParams,

    // 🏷️ Знижки
    discounts: globalDiscounts,

    // 💰 Платежі
    payment: paymentProcessing,

    // 📊 Композиційні дані
    validation,
    orderSummary,
    loadingStates,

    // 🔧 Швидкі методи
    quickActions: {
      // Встановити рекомендовану дату
      setRecommendedDate: () => {
        const recommendedDate = executionParams.getRecommendedDate();
        executionParams.setExecutionDate(recommendedDate);
      },

      // Очистити знижку та повну оплату
      resetToDefault: () => {
        globalDiscounts.clearDiscount();
        paymentProcessing.clearPayment();
      },

      // Встановити повну оплату
      setFullPayment: () => {
        paymentProcessing.setFullPayment();
      },
    },
  };
};
