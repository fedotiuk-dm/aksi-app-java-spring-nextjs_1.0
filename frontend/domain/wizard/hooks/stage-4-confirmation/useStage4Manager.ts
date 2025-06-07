/**
 * @fileoverview Менеджер для координації всіх операцій на етапі 4 (підтвердження та завершення)
 *
 * Відповідальність:
 * - Об'єднання всіх хуків етапу 4
 * - Управління переходами між підетапами
 * - Валідація кожного підетапу
 * - Координація завершення візарда
 */

import { useState, useCallback, useMemo } from 'react';

import { useCustomerSignature } from './useCustomerSignature';
import { useOrderSummary } from './useOrderSummary';
import { useReceiptGeneration } from './useReceiptGeneration';
import { useTermsAgreement } from './useTermsAgreement';
import { useWizardCompletion } from './useWizardCompletion';

import type { Stage4Data, UseStage4ManagerReturn } from './types';

/**
 * Менеджер для координації всіх операцій на етапі 4
 *
 * @example
 * ```tsx
 * const {
 *   data,
 *   currentStep,
 *   canProceed,
 *   setCurrentStep,
 *   proceedToNext,
 *   completeStage4
 * } = useStage4Manager();
 *
 * // Перейти до наступного підетапу
 * if (canProceed) {
 *   proceedToNext();
 * }
 *
 * // Завершити весь етап 4
 * await completeStage4();
 * ```
 */
export function useStage4Manager(): UseStage4ManagerReturn {
  // =====================================
  // Дочірні хуки
  // =====================================

  const summaryHook = useOrderSummary();
  const agreementHook = useTermsAgreement();
  const signatureHook = useCustomerSignature();
  const receiptHook = useReceiptGeneration();
  const completionHook = useWizardCompletion();

  // =====================================
  // Локальний стан
  // =====================================

  const [currentStep, setCurrentStep] = useState<
    'summary' | 'agreement' | 'signature' | 'receipt' | 'completion'
  >('summary');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // =====================================
  // Обчислювані значення
  // =====================================

  const data: Stage4Data = useMemo(
    () => ({
      summary: summaryHook.summary,
      signature: signatureHook.signature,
      receipt: receiptHook.receipt,
      completion: completionHook.completion,
    }),
    [summaryHook.summary, signatureHook.signature, receiptHook.receipt, completionHook.completion]
  );

  // =====================================
  // Валідація підетапів
  // =====================================

  /**
   * Валідувати поточний підетап
   */
  const validateCurrentStep = useCallback(() => {
    const errors: string[] = [];

    switch (currentStep) {
      case 'summary':
        if (!data.summary) {
          errors.push('Підсумок замовлення не завантажено');
        } else {
          if (!data.summary.clientInfo.name) {
            errors.push("Не вказано ім'я клієнта");
          }
          if (!data.summary.clientInfo.phone) {
            errors.push('Не вказано телефон клієнта');
          }
          if (data.summary.items.length === 0) {
            errors.push('Замовлення не містить жодного предмета');
          }
          if (data.summary.financials.totalAmount <= 0) {
            errors.push('Загальна сума замовлення повинна бути більше нуля');
          }
        }
        break;

      case 'signature':
        if (!data.signature) {
          errors.push('Підпис клієнта відсутній');
        } else if (!signatureHook.validateSignature()) {
          errors.push('Підпис клієнта недійсний');
        }
        break;

      case 'receipt':
        if (!data.receipt.receipt) {
          errors.push('Квитанція не згенерована');
        }
        if (data.receipt.emailReceipt && !data.receipt.emailAddress) {
          errors.push('Для відправки email потрібно вказати адресу');
        }
        break;

      case 'completion':
        if (!completionHook.isAllStepsCompleted) {
          errors.push('Не всі етапи завершені');
        }
        if (!data.completion.success) {
          errors.push('Замовлення не створено успішно');
        }
        break;
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }, [currentStep, data, signatureHook, completionHook.isAllStepsCompleted]);

  const isValid = useMemo(() => {
    return validateCurrentStep();
  }, [validateCurrentStep]);

  const canProceed = useMemo(() => {
    return (
      isValid &&
      !summaryHook.isLoading &&
      !signatureHook.isSaving &&
      !receiptHook.isGenerating &&
      !completionHook.isCompleting
    );
  }, [
    isValid,
    summaryHook.isLoading,
    signatureHook.isSaving,
    receiptHook.isGenerating,
    completionHook.isCompleting,
  ]);

  // =====================================
  // Навігація між підетапами
  // =====================================

  const stepOrder: Array<'summary' | 'signature' | 'receipt' | 'completion'> = [
    'summary',
    'signature',
    'receipt',
    'completion',
  ];

  /**
   * Перейти до наступного підетапу
   */
  const proceedToNext = useCallback(() => {
    if (!canProceed) return;

    const currentIndex = stepOrder.indexOf(currentStep);
    const nextIndex = currentIndex + 1;

    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);

      // Відмітити поточний етап як завершений
      completionHook.markStepCompleted(currentIndex + 1);
    }
  }, [currentStep, canProceed, completionHook]);

  /**
   * Перейти до попереднього підетапу
   */
  const goToPrevious = useCallback(() => {
    const currentIndex = stepOrder.indexOf(currentStep);
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      setCurrentStep(stepOrder[previousIndex]);
    }
  }, [currentStep]);

  // =====================================
  // Завершення етапу 4
  // =====================================

  /**
   * Завершити весь етап 4
   */
  const completeStage4 = useCallback(async () => {
    try {
      // Валідуємо всі підетапи
      if (!data.summary) {
        throw new Error('Підсумок замовлення відсутній');
      }

      if (!data.signature || !signatureHook.validateSignature()) {
        throw new Error('Підпис клієнта недійсний');
      }

      if (!data.receipt.receipt) {
        throw new Error('Квитанція не згенерована');
      }

      // Створюємо фінальне замовлення
      const orderData = {
        ...data.summary,
        signatureData: data.signature.signatureData,
        receiptGenerated: true,
      };

      await completionHook.completeWizard(orderData);

      // Переходимо до останнього підетапу
      setCurrentStep('completion');
    } catch (error) {
      console.error('Помилка завершення етапу 4:', error);
      setValidationErrors([error instanceof Error ? error.message : 'Невідома помилка']);
    }
  }, [data, signatureHook, completionHook]);

  /**
   * Скинути весь етап 4
   */
  const resetStage4 = useCallback(() => {
    setCurrentStep('summary');
    setValidationErrors([]);
    summaryHook.clearSummary();
    signatureHook.clearSignature();
    receiptHook.clearReceipt();
    completionHook.resetCompletion();
  }, [summaryHook, signatureHook, receiptHook, completionHook]);

  // =====================================
  // Автоматичні переходи
  // =====================================

  // Автоматично переходимо до completion після успішного створення замовлення
  useMemo(() => {
    if (completionHook.completion.success && currentStep !== 'completion') {
      setCurrentStep('completion');
    }
  }, [completionHook.completion.success, currentStep]);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    data,
    isValid,
    validationErrors,
    currentStep,
    canProceed,

    // Дії
    setCurrentStep,
    validateCurrentStep,
    proceedToNext,
    goToPrevious,
    completeStage4,
    resetStage4,

    // Дочірні хуки для прямого доступу
    summaryHook,
    signatureHook,
    receiptHook,
    completionHook,
  };
}
