/**
 * @fileoverview Композиційний хук для stage-4 - підтвердження та завершення
 * @module domain/wizard/hooks/stage-4
 */

import { useCallback, useMemo } from 'react';

import { useOrderCompletion } from './use-order-completion.hook';
import { useOrderValidation } from './use-order-validation.hook';
import { useReceiptGeneration } from './use-receipt-generation.hook';

/**
 * Композиційний хук для stage-4 (підтвердження та завершення)
 * 🎯 Об'єднує: валідацію + генерацію квитанцій + завершення
 */
export const useStage4Composition = () => {
  // 📋 Підхуки stage-4
  const validation = useOrderValidation();
  const receiptGeneration = useReceiptGeneration();
  const orderCompletion = useOrderCompletion();

  // 🔍 Загальна валідація готовності stage-4
  const stage4Validation = useMemo(() => {
    const validationErrors = validation.validationResult?.errors || [];
    const validationWarnings = validation.validationResult?.warnings || [];
    const completionErrors = orderCompletion.completionValidation.errors;
    const completionWarnings = orderCompletion.completionValidation.warnings;

    const allErrors = [...validationErrors.map((e) => e.message), ...completionErrors];
    const allWarnings = [...validationWarnings.map((w) => w.message), ...completionWarnings];

    const isStage4Ready =
      validation.validationInfo.isReadyForConfirmation &&
      orderCompletion.completionValidation.canComplete &&
      receiptGeneration.generationInfo.canGenerate;

    const completionPercentage = Math.min(
      validation.validationInfo.completeness,
      orderCompletion.completionValidation.readinessPercentage
    );

    return {
      isReady: isStage4Ready,
      completionPercentage,
      totalErrors: allErrors.length,
      totalWarnings: allWarnings.length,
      errors: allErrors,
      warnings: allWarnings,
      canProceedToCompletion: isStage4Ready && completionPercentage >= 90,
    };
  }, [
    validation.validationResult,
    validation.validationInfo.isReadyForConfirmation,
    validation.validationInfo.completeness,
    orderCompletion.completionValidation,
    receiptGeneration.generationInfo.canGenerate,
  ]);

  // 🔄 Загальні стани завантаження
  const loadingStates = useMemo(
    () => ({
      isValidating: validation.isValidating,
      isGeneratingReceipt: receiptGeneration.isGenerating,
      isPrintingReceipt: receiptGeneration.isPrinting,
      isSavingOrder: orderCompletion.isSaving,
      isCompletingOrder: orderCompletion.isCompleting,
      isAnyOperation:
        validation.isValidating ||
        receiptGeneration.isGenerating ||
        receiptGeneration.isPrinting ||
        orderCompletion.isSaving ||
        orderCompletion.isCompleting,
    }),
    [
      validation.isValidating,
      receiptGeneration.isGenerating,
      receiptGeneration.isPrinting,
      orderCompletion.isSaving,
      orderCompletion.isCompleting,
    ]
  );

  // 🎯 Композиційні методи для завершення
  const completeWithReceipt = useCallback(
    async (shouldPrint: boolean = true) => {
      try {
        // 1. Валідація
        const validationResult = await validation.revalidate();
        if (!validationResult.data?.isValid) {
          throw new Error('Замовлення не пройшло валідацію');
        }

        // 2. Генерація та друк квитанції (якщо потрібно)
        let receipt = null;
        if (shouldPrint) {
          receipt = await receiptGeneration.generateAndPrint();
        } else {
          receipt = await receiptGeneration.generateReceipt();
        }

        // 3. Завершення замовлення
        const orderResult = await orderCompletion.completeAndReset();

        return {
          success: true,
          orderId: orderResult.orderId,
          receiptNumber: orderResult.receiptNumber,
          receipt,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Невідома помилка',
        };
      }
    },
    [validation.revalidate, receiptGeneration, orderCompletion.completeAndReset]
  );

  const completeWithEmail = useCallback(
    async (email: string) => {
      try {
        // 1. Валідація
        const validationResult = await validation.revalidate();
        if (!validationResult.data?.isValid) {
          throw new Error('Замовлення не пройшло валідацію');
        }

        // 2. Генерація та відправка квитанції
        const receipt = await receiptGeneration.generateAndEmail(email);

        // 3. Завершення замовлення
        const orderResult = await orderCompletion.completeAndReset();

        return {
          success: true,
          orderId: orderResult.orderId,
          receiptNumber: orderResult.receiptNumber,
          receipt,
          emailSent: email,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Невідома помилка',
        };
      }
    },
    [validation.revalidate, receiptGeneration, orderCompletion.completeAndReset]
  );

  // 📊 Підсумкова інформація
  const finalSummary = useMemo(() => {
    const orderSummary = orderCompletion.getOrderSummary();
    const receiptPreview = receiptGeneration.getReceiptPreview();

    return {
      // Базова інформація
      clientName: orderSummary?.clientName,
      branchName: orderSummary?.branchName,
      itemsCount: orderSummary?.itemsCount || 0,

      // Фінансова інформація
      financial: orderSummary?.financial || {
        itemsTotal: 0,
        urgencyAmount: 0,
        discountAmount: 0,
        finalTotal: 0,
      },

      // Виконання
      executionDate: orderSummary?.executionDate,
      urgencyLevel: orderSummary?.urgencyLevel,

      // Готовність
      isReadyForCompletion: stage4Validation.isReady,
      readinessPercentage: stage4Validation.completionPercentage,

      // Попередній перегляд квитанції
      receiptPreview,
    };
  }, [
    orderCompletion.getOrderSummary(),
    receiptGeneration.getReceiptPreview(),
    stage4Validation.isReady,
    stage4Validation.completionPercentage,
  ]);

  return {
    // 📋 Модулі stage-4
    validation,
    receiptGeneration,
    orderCompletion,

    // 📊 Композиційні дані
    stage4Validation,
    loadingStates,
    finalSummary,

    // 🔧 Композиційні методи
    completeWithReceipt,
    completeWithEmail,

    // 🎯 Швидкі дії
    quickActions: {
      // Повна валідація та підготовка
      validateAndPrepare: async () => {
        await validation.revalidate();
        return {
          isReady: stage4Validation.isReady,
          errors: stage4Validation.errors,
          warnings: stage4Validation.warnings,
        };
      },

      // Попередній перегляд повного процесу
      previewComplete: () => ({
        orderSummary: orderCompletion.getOrderSummary(),
        receiptPreview: receiptGeneration.getReceiptPreview(),
        validationStatus: stage4Validation,
      }),

      // Швидке завершення з друком
      quickCompleteWithPrint: () => completeWithReceipt(true),

      // Швидке завершення без друку
      quickCompleteWithoutPrint: () => completeWithReceipt(false),
    },
  };
};
