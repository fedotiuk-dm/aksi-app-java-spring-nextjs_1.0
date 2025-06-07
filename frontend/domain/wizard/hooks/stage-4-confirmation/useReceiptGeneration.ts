/**
 * @fileoverview Хук для генерації та управління квитанціями
 *
 * Відповідальність:
 * - Генерація PDF квитанції
 * - Відправка квитанції на email
 * - Управління форматами квитанції
 * - Друк квитанції
 */

import { useState, useCallback, useMemo } from 'react';

import { useEmailReceipt } from '@/shared/api/generated/full/aksiApi';
import { useGeneratePdfReceipt } from '@/shared/api/generated/receipt/aksiApi';

import type { ReceiptGeneration, ReceiptFormat, UseReceiptGenerationReturn } from './types';
import type {
  ReceiptGenerationRequest,
  PdfReceiptResponse,
  EmailReceiptRequest,
} from '@/shared/api/generated/receipt/aksiApi.schemas';

/**
 * Хук для генерації та управління квитанціями
 *
 * @example
 * ```tsx
 * const {
 *   receipt,
 *   isGenerating,
 *   generateReceipt,
 *   emailReceipt
 * } = useReceiptGeneration();
 *
 * // Генерувати PDF квитанцію
 * await generateReceipt({
 *   orderId: 'order-123',
 *   includeSignature: true
 * });
 *
 * // Відправити на email
 * await emailReceipt('client@example.com');
 * ```
 */
export function useReceiptGeneration(): UseReceiptGenerationReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [receipt, setReceipt] = useState<ReceiptGeneration>({
    format: 'pdf',
    clientCopy: true,
    internalCopy: false,
    emailReceipt: false,
  });

  const [orderId, setOrderId] = useState<string>('');
  const [pdfData, setPdfData] = useState<PdfReceiptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // =====================================
  // API запити
  // =====================================

  // Генерація PDF квитанції
  const {
    mutateAsync: generatePdfMutation,
    isPending: isGenerating,
    error: generateError,
  } = useGeneratePdfReceipt();

  // Відправка на email
  const {
    mutateAsync: emailReceiptMutation,
    isPending: isEmailSending,
    error: emailError,
  } = useEmailReceipt();

  // =====================================
  // Обробка помилок
  // =====================================

  useMemo(() => {
    if (generateError || emailError) {
      setError('Помилка роботи з квитанцією');
    } else {
      setError(null);
    }
  }, [generateError, emailError]);

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Встановити формат квитанції
   */
  const setFormat = useCallback((format: ReceiptFormat) => {
    setReceipt((prev) => ({ ...prev, format }));
  }, []);

  /**
   * Увімкнути/вимкнути копію для клієнта
   */
  const setClientCopy = useCallback((enabled: boolean) => {
    setReceipt((prev) => ({ ...prev, clientCopy: enabled }));
  }, []);

  /**
   * Увімкнути/вимкнути внутрішню копію
   */
  const setInternalCopy = useCallback((enabled: boolean) => {
    setReceipt((prev) => ({ ...prev, internalCopy: enabled }));
  }, []);

  /**
   * Увімкнути/вимкнути відправку на email
   */
  const setEmailReceipt = useCallback((enabled: boolean, email?: string) => {
    setReceipt((prev) => ({
      ...prev,
      emailReceipt: enabled,
      emailAddress: enabled ? email : undefined,
    }));
  }, []);

  /**
   * Генерувати квитанцію
   */
  const generateReceipt = useCallback(
    async (request: ReceiptGenerationRequest) => {
      try {
        setError(null);

        const response = await generatePdfMutation({ data: request });

        if (response) {
          setPdfData(response);
          setReceipt((prev) => ({
            ...prev,
            orderId: request.orderId,
            generatedAt: response.generatedAt || new Date().toISOString(),
          }));

          setOrderId(request.orderId);
        }
      } catch (error) {
        console.error('Помилка генерації квитанції:', error);
        setError('Не вдалося згенерувати квитанцію');
      }
    },
    [generatePdfMutation]
  );

  /**
   * Друкувати квитанцію
   */
  const printReceipt = useCallback(async () => {
    try {
      if (!pdfData?.pdfUrl && !pdfData?.pdfData) {
        setError('Квитанція не згенерована');
        return;
      }

      setError(null);

      // Створюємо тимчасове посилання для друку
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        setError('Не вдалося відкрити вікно для друку');
        return;
      }

      if (pdfData.pdfUrl) {
        printWindow.location.href = pdfData.pdfUrl;
      } else if (pdfData.pdfData) {
        const blob = new Blob([atob(pdfData.pdfData)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        printWindow.location.href = url;

        // Очищаємо URL після використання
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      printWindow.focus();
      printWindow.print();
    } catch (error) {
      console.error('Помилка друку квитанції:', error);
      setError('Не вдалося надрукувати квитанцію');
    }
  }, [pdfData]);

  /**
   * Відправити квитанцію на email
   */
  const emailReceipt = useCallback(
    async (email: string) => {
      try {
        if (!orderId) {
          setError('Не вказано ID замовлення');
          return;
        }

        setError(null);

        const emailRequest: EmailReceiptRequest = {
          orderId,
          recipientEmail: email,
          includeSignature: true,
          subject: `Квитанція для замовлення ${orderId}`,
        };

        await emailReceiptMutation({ orderId, data: emailRequest });

        setReceipt((prev) => ({
          ...prev,
          emailReceipt: true,
          emailAddress: email,
        }));
      } catch (error) {
        console.error('Помилка відправки квитанції:', error);
        setError('Не вдалося відправити квитанцію на email');
      }
    },
    [orderId, emailReceiptMutation]
  );

  /**
   * Очистити дані квитанції
   */
  const clearReceipt = useCallback(() => {
    setReceipt({
      format: 'pdf',
      clientCopy: true,
      internalCopy: false,
      emailReceipt: false,
    });
    setOrderId('');
    setPdfData(null);
    setError(null);
  }, []);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    receipt,
    isGenerating,
    isEmailSending,
    error,

    // Дії
    setFormat,
    setClientCopy,
    setInternalCopy,
    setEmailReceipt,
    generateReceipt,
    printReceipt,
    emailReceipt,
    clearReceipt,
  };
}
