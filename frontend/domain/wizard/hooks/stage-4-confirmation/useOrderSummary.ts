/**
 * @fileoverview Хук для управління підсумком замовлення
 *
 * Відповідальність:
 * - Завантаження повного підсумку замовлення через useGetOrderReceipt
 * - Відображення інформації про клієнта, предмети, фінанси
 * - Валідація та трансформація даних з ReceiptDTO
 * - Оновлення підсумку при необхідності
 */

import { useState, useCallback, useMemo, useEffect } from 'react';

import { useGetOrderReceipt } from '@/shared/api/generated/full/aksiApi';

import type { OrderSummary, UseOrderSummaryReturn } from './types';
import type { ReceiptDTO, ReceiptItemDTO } from '@/shared/api/generated/full/aksiApi.schemas';

/**
 * Хук для управління підсумком замовлення
 *
 * @example
 * ```tsx
 * const {
 *   summary,
 *   isLoading,
 *   loadSummary,
 *   refreshSummary
 * } = useOrderSummary();
 *
 * // Завантажити підсумок
 * await loadSummary('order-123');
 *
 * // Оновити підсумок
 * await refreshSummary();
 * ```
 */
export function useOrderSummary(): UseOrderSummaryReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [orderId, setOrderId] = useState<string>('');
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // =====================================
  // API запити
  // =====================================

  const {
    data: receiptData,
    isLoading,
    error: queryError,
    refetch,
  } = useGetOrderReceipt(orderId, undefined, {
    query: {
      enabled: !!orderId,
      staleTime: 5 * 60 * 1000, // 5 хвилин кеш
      gcTime: 10 * 60 * 1000, // 10 хвилин в кеші
    },
  });

  // =====================================
  // Утилітарні функції
  // =====================================

  /**
   * Трансформує дані з ReceiptDTO в формат для UI
   */
  const transformReceiptToSummary = useCallback((receiptData: ReceiptDTO): OrderSummary => {
    return {
      orderId: receiptData.orderId || '',
      clientInfo: {
        name: receiptData.clientInfo
          ? `${receiptData.clientInfo.lastName || ''} ${receiptData.clientInfo.firstName || ''}`.trim()
          : '',
        phone: receiptData.clientInfo?.phone || '',
        email: receiptData.clientInfo?.email,
        address: receiptData.clientInfo?.address,
      },
      items: (receiptData.items || []).map((item: ReceiptItemDTO) => ({
        id: item.id || '',
        name: item.name || '',
        quantity: item.quantity || 1,
        unitPrice: item.basePrice || 0,
        totalPrice: item.finalPrice || 0,
        modifiers: (item.priceModifiers || []).map((modifier) => modifier.name || ''),
        defects: item.defects || [],
        stains: item.stains || [],
      })),
      financials: {
        subtotal: receiptData.financialInfo?.totalAmount || 0,
        discountAmount: receiptData.financialInfo?.discountAmount || 0,
        urgencyFee: receiptData.financialInfo?.expediteSurcharge || 0,
        totalAmount: receiptData.financialInfo?.finalAmount || 0,
        prepaymentAmount: receiptData.financialInfo?.prepaymentAmount || 0,
        remainingAmount: receiptData.financialInfo?.balanceAmount || 0,
      },
      execution: {
        completionDate: receiptData.expectedCompletionDate || '',
        urgencyLevel: receiptData.expediteType || 'NORMAL',
      },
      additionalInfo: {
        notes: receiptData.additionalNotes,
        clientRequirements: '', // Це поле може бути недоступне в ReceiptDTO
        tags: [], // Теги можуть бути недоступні в ReceiptDTO
      },
    };
  }, []);

  /**
   * Валідує дані підсумку
   */
  const validateSummary = useCallback((summaryData: OrderSummary): string[] => {
    const errors: string[] = [];

    if (!summaryData.orderId) {
      errors.push('Відсутній ID замовлення');
    }

    if (!summaryData.clientInfo.name || !summaryData.clientInfo.phone) {
      errors.push('Неповна інформація про клієнта');
    }

    if (summaryData.items.length === 0) {
      errors.push('Замовлення не містить предметів');
    }

    if (summaryData.financials.totalAmount <= 0) {
      errors.push('Некоректна загальна сума замовлення');
    }

    return errors;
  }, []);

  // =====================================
  // Обробка даних
  // =====================================

  useMemo(() => {
    if (receiptData && orderId) {
      try {
        const transformedSummary = transformReceiptToSummary(receiptData);
        const validationErrors = validateSummary(transformedSummary);

        if (validationErrors.length > 0) {
          setError(`Помилки валідації: ${validationErrors.join(', ')}`);
          setSummary(null);
          return;
        }

        setSummary(transformedSummary);
        setError(null);
      } catch (transformError) {
        console.error('Помилка трансформації даних:', transformError);
        setError('Помилка обробки даних замовлення');
        setSummary(null);
      }
    } else if (queryError) {
      setError('Помилка завантаження підсумку замовлення');
      setSummary(null);
    }
  }, [receiptData, orderId, queryError, transformReceiptToSummary, validateSummary]);

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Завантажити підсумок замовлення
   */
  const loadSummary = useCallback(async (newOrderId: string): Promise<void> => {
    if (!newOrderId.trim()) {
      setError('ID замовлення не може бути порожнім');
      return;
    }

    try {
      setError(null);
      setOrderId(newOrderId);
    } catch (error) {
      console.error('Помилка завантаження підсумку:', error);
      setError('Не вдалося завантажити підсумок замовлення');
    }
  }, []);

  /**
   * Оновити підсумок
   */
  const refreshSummary = useCallback(async (): Promise<void> => {
    if (orderId) {
      try {
        setError(null);
        await refetch();
      } catch (error) {
        console.error('Помилка оновлення підсумку:', error);
        setError('Не вдалося оновити підсумок замовлення');
      }
    }
  }, [orderId, refetch]);

  /**
   * Очистити підсумок
   */
  const clearSummary = useCallback(() => {
    setSummary(null);
    setOrderId('');
    setError(null);
  }, []);

  // =====================================
  // Обчислювані значення
  // =====================================

  const isValidSummary = useMemo(() => {
    if (!summary) return false;
    const validationErrors = validateSummary(summary);
    return validationErrors.length === 0;
  }, [summary, validateSummary]);

  const totalItemsCount = useMemo(() => {
    if (!summary) return 0;
    return summary.items.reduce((total, item) => total + item.quantity, 0);
  }, [summary]);

  const hasDefectsOrStains = useMemo(() => {
    if (!summary) return false;
    return summary.items.some(
      (item) => (item.defects && item.defects.length > 0) || (item.stains && item.stains.length > 0)
    );
  }, [summary]);

  // =====================================
  // Автоматичні ефекти
  // =====================================

  useEffect(() => {
    // Автоматичне очищення помилки через 10 секунд
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    summary,
    isLoading,
    error,
    isValidSummary,
    totalItemsCount,
    hasDefectsOrStains,

    // Дії
    loadSummary,
    refreshSummary,
    clearSummary,
  };
}
