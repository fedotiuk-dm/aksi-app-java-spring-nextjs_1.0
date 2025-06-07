/**
 * @fileoverview Хук для етапу 4.2 - Юридичні аспекти (згода з умовами та цифровий підпис)
 *
 * Відповідальність:
 * - Управління згодою з умовами надання послуг
 * - Збереження цифрового підпису клієнта
 * - Фіналізація замовлення з підписом та згодою
 * - Валідація всіх юридичних аспектів
 */

import { useState, useCallback, useMemo } from 'react';

import { useSaveSignature, useFinalizeOrder } from '@/shared/api/generated/full/aksiApi';

import type {
  CustomerSignatureRequest,
  OrderFinalizationRequest,
  OrderDTO,
} from '@/shared/api/generated/full/aksiApi.schemas';

// ===================================
// Типи для хука
// ===================================

export interface LegalAspects {
  // Згода з умовами
  termsAccepted: boolean;
  termsAcceptedAt: string | null;

  // Цифровий підпис
  signatureData: string | null;
  signatureSaved: boolean;
  signatureSavedAt: string | null;

  // Статус
  isComplete: boolean;
  orderId: string | null;
}

export interface SignatureDrawingData {
  signatureData: string; // Base64 SVG/PNG
  width: number;
  height: number;
}

export interface UseLegalAspectsReturn {
  // Стан
  legalAspects: LegalAspects;
  isLoading: boolean;
  isSaving: boolean;
  isCompleting: boolean;
  error: string | null;

  // Валідація
  canProceed: boolean;
  validationErrors: string[];

  // Дії
  acceptTerms: (orderId: string) => void;
  rejectTerms: () => void;
  saveSignature: (signatureData: SignatureDrawingData, orderId: string) => Promise<void>;
  clearSignature: () => void;
  finalizeOrder: (orderId: string, options?: FinalizeOptions) => Promise<OrderDTO | null>;
  reset: () => void;

  // Валідація
  validateLegalAspects: () => boolean;
}

export interface FinalizeOptions {
  sendReceiptByEmail?: boolean;
  generatePrintableReceipt?: boolean;
  comments?: string;
}

/**
 * Хук для управління юридичними аспектами замовлення (етап 4.2)
 *
 * @example
 * ```tsx
 * const {
 *   legalAspects,
 *   canProceed,
 *   acceptTerms,
 *   saveSignature,
 *   finalizeOrder
 * } = useLegalAspects();
 *
 * // Прийняти умови
 * acceptTerms('order-123');
 *
 * // Зберегти підпис
 * await saveSignature({
 *   signatureData: 'data:image/svg+xml;base64,...',
 *   width: 400,
 *   height: 200,
 *   deviceInfo: 'Tablet Chrome'
 * }, 'order-123');
 *
 * // Фіналізувати замовлення
 * await finalizeOrder('order-123', {
 *   sendReceiptByEmail: true,
 *   generatePrintableReceipt: true
 * });
 * ```
 */
export function useLegalAspects(): UseLegalAspectsReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [legalAspects, setLegalAspects] = useState<LegalAspects>({
    termsAccepted: false,
    termsAcceptedAt: null,
    signatureData: null,
    signatureSaved: false,
    signatureSavedAt: null,
    isComplete: false,
    orderId: null,
  });

  const [error, setError] = useState<string | null>(null);

  // =====================================
  // API хуки
  // =====================================

  const {
    mutateAsync: saveSignatureMutation,
    isPending: isSavingSignature,
    error: signatureError,
  } = useSaveSignature();

  const {
    mutateAsync: finalizeOrderMutation,
    isPending: isCompletingOrder,
    error: finalizeError,
  } = useFinalizeOrder();

  // =====================================
  // Обчислювані значення
  // =====================================

  const isLoading = false; // Поки що немає завантаження даних
  const isSaving = isSavingSignature;
  const isCompleting = isCompletingOrder;

  const canProceed = useMemo(() => {
    return (
      legalAspects.termsAccepted &&
      legalAspects.signatureSaved &&
      legalAspects.signatureData !== null
    );
  }, [legalAspects.termsAccepted, legalAspects.signatureSaved, legalAspects.signatureData]);

  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    if (!legalAspects.termsAccepted) {
      errors.push('Необхідно прийняти умови надання послуг');
    }

    if (!legalAspects.signatureData || !legalAspects.signatureSaved) {
      errors.push('Необхідно поставити цифровий підпис');
    }

    return errors;
  }, [legalAspects.termsAccepted, legalAspects.signatureData, legalAspects.signatureSaved]);

  // =====================================
  // Обробка помилок
  // =====================================

  useMemo(() => {
    if (signatureError) {
      setError('Помилка збереження підпису клієнта');
    } else if (finalizeError) {
      setError('Помилка завершення замовлення');
    } else {
      setError(null);
    }
  }, [signatureError, finalizeError]);

  // =====================================
  // Допоміжні функції
  // =====================================

  // =====================================
  // Основні дії
  // =====================================

  /**
   * Прийняти умови надання послуг
   */
  const acceptTerms = useCallback((orderId: string) => {
    setError(null);

    setLegalAspects((prev) => ({
      ...prev,
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
      orderId,
    }));
  }, []);

  /**
   * Відхилити умови надання послуг
   */
  const rejectTerms = useCallback(() => {
    setLegalAspects((prev) => ({
      ...prev,
      termsAccepted: false,
      termsAcceptedAt: null,
    }));
  }, []);

  /**
   * Зберегти цифровий підпис клієнта
   */
  const saveSignature = useCallback(
    async (signatureData: SignatureDrawingData, orderId: string) => {
      try {
        setError(null);

        const request: CustomerSignatureRequest = {
          orderId,
          signatureData: signatureData.signatureData,
          termsAccepted: legalAspects.termsAccepted,
          signatureType: 'CUSTOMER_ACCEPTANCE',
        };

        const response = await saveSignatureMutation({ data: request });

        if (response) {
          setLegalAspects((prev) => ({
            ...prev,
            signatureData: signatureData.signatureData,
            signatureSaved: true,
            signatureSavedAt: new Date().toISOString(),
            orderId,
          }));
        }
      } catch (error) {
        console.error('Помилка збереження підпису:', error);
        setError('Не вдалося зберегти підпис клієнта');
      }
    },
    [saveSignatureMutation, legalAspects.termsAccepted]
  );

  /**
   * Очистити підпис
   */
  const clearSignature = useCallback(() => {
    setLegalAspects((prev) => ({
      ...prev,
      signatureData: null,
      signatureSaved: false,
      signatureSavedAt: null,
    }));
  }, []);

  /**
   * Фіналізувати замовлення з підписом та згодою
   */
  const finalizeOrder = useCallback(
    async (orderId: string, options: FinalizeOptions = {}): Promise<OrderDTO | null> => {
      try {
        setError(null);

        if (!legalAspects.termsAccepted) {
          throw new Error('Умови надання послуг не прийняті');
        }

        if (!legalAspects.signatureSaved || !legalAspects.signatureData) {
          throw new Error('Підпис клієнта не збережено');
        }

        const request: OrderFinalizationRequest = {
          orderId,
          signatureData: legalAspects.signatureData,
          termsAccepted: legalAspects.termsAccepted,
          sendReceiptByEmail: options.sendReceiptByEmail ?? false,
          generatePrintableReceipt: options.generatePrintableReceipt ?? true,
          comments: options.comments,
        };

        const finalizedOrder = await finalizeOrderMutation({ data: request });

        if (finalizedOrder) {
          setLegalAspects((prev) => ({
            ...prev,
            isComplete: true,
          }));
        }

        return finalizedOrder || null;
      } catch (error) {
        console.error('Помилка фіналізації замовлення:', error);
        setError('Не вдалося завершити замовлення');
        return null;
      }
    },
    [
      finalizeOrderMutation,
      legalAspects.termsAccepted,
      legalAspects.signatureSaved,
      legalAspects.signatureData,
    ]
  );

  /**
   * Валідувати юридичні аспекти
   */
  const validateLegalAspects = useCallback(() => {
    const errors = validationErrors;

    if (errors.length > 0) {
      setError(errors.join('; '));
      return false;
    }

    setError(null);
    return true;
  }, [validationErrors]);

  /**
   * Скинути стан
   */
  const reset = useCallback(() => {
    setLegalAspects({
      termsAccepted: false,
      termsAcceptedAt: null,
      signatureData: null,
      signatureSaved: false,
      signatureSavedAt: null,
      isComplete: false,
      orderId: null,
    });
    setError(null);
  }, []);

  // =====================================
  // Повернення інтерфейсу
  // =====================================

  return {
    // Стан
    legalAspects,
    isLoading,
    isSaving,
    isCompleting,
    error,

    // Валідація
    canProceed,
    validationErrors,

    // Дії
    acceptTerms,
    rejectTerms,
    saveSignature,
    clearSignature,
    finalizeOrder,
    reset,

    // Валідація
    validateLegalAspects,
  };
}
