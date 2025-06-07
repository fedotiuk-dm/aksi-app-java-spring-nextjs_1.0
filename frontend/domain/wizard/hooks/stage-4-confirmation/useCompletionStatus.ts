/**
 * @fileoverview Хук для етапу 4.4 - Завершення процесу (показ результату)
 *
 * Відповідальність:
 * - Показ статусу успішного завершення замовлення
 * - Інформація про надіслані копії квитанції
 * - Нагадування про дату готовності
 * - Навігація до нового замовлення або списку замовлень
 */

import { useState, useCallback, useMemo, useEffect } from 'react';

import { useGetOrderById } from '@/shared/api/generated/full/aksiApi';

import type { OrderDTO } from '@/shared/api/generated/full/aksiApi.schemas';

// ===================================
// Типи для хука
// ===================================

export interface CompletionStatus {
  // Статус замовлення
  orderId: string | null;
  orderNumber: string | null;
  isSuccess: boolean;
  completedAt: string | null;

  // Дата готовності
  expectedCompletionDate: string | null;
  formattedCompletionDate: string | null; // "після 14:00 23.12.2024"

  // Копії квитанції
  receiptSent: {
    printed: boolean;
    emailed: boolean;
    emailAddress?: string;
  };

  // Деталі клієнта
  clientInfo: {
    name: string;
    phone: string;
    email?: string;
  } | null;

  // Фінансова інформація
  financialSummary: {
    totalAmount: number;
    prepaymentAmount: number;
    balanceAmount: number;
    paymentMethod: string;
  } | null;
}

export interface UseCompletionStatusReturn {
  // Стан
  status: CompletionStatus;
  isLoading: boolean;
  error: string | null;

  // Валідація
  isValidCompletion: boolean;

  // Дії навігації
  goToNewOrder: () => void;
  goToOrdersList: () => void;
  goToOrderDetail: () => void;

  // Дані для показу
  completionMessages: {
    success: string;
    emailStatus: string;
    printStatus: string;
    reminderDate: string;
  };

  // Допоміжні функції
  formatCompletionDate: (date: string) => string;
  getEmailStatusMessage: () => string;
  getPrintStatusMessage: () => string;
}

/**
 * Хук для управління етапом 4.4 - показ статусу завершення замовлення
 *
 * @example
 * ```tsx
 * const {
 *   status,
 *   isValidCompletion,
 *   completionMessages,
 *   goToNewOrder,
 *   goToOrdersList
 * } = useCompletionStatus(orderId);
 *
 * if (status.isSuccess) {
 *   return (
 *     <div>
 *       <h2>{completionMessages.success}</h2>
 *       <p>{completionMessages.emailStatus}</p>
 *       <p>{completionMessages.reminderDate}</p>
 *       <Button onClick={goToNewOrder}>Нове замовлення</Button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCompletionStatus(orderId?: string): UseCompletionStatusReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [status, setStatus] = useState<CompletionStatus>({
    orderId: null,
    orderNumber: null,
    isSuccess: false,
    completedAt: null,
    expectedCompletionDate: null,
    formattedCompletionDate: null,
    receiptSent: {
      printed: false,
      emailed: false,
    },
    clientInfo: null,
    financialSummary: null,
  });

  const [error, setError] = useState<string | null>(null);

  // =====================================
  // API хуки
  // =====================================

  const {
    data: orderData,
    isLoading,
    error: orderError,
  } = useGetOrderById(orderId || '', {
    query: {
      enabled: !!orderId,
    },
  });

  // =====================================
  // Допоміжні функції
  // =====================================

  /**
   * Отримати відображення способу оплати
   */
  const getPaymentMethodDisplay = useCallback((order: OrderDTO): string => {
    // Якщо є повна передоплата, то не важливо яким способом
    if (order.balanceAmount === 0) {
      return 'Повністю сплачено';
    }

    // Якщо є частина передоплати
    if ((order.prepaymentAmount || 0) > 0) {
      return 'Часткова передоплата';
    }

    // За замовчуванням
    return 'При отриманні';
  }, []);

  const formatCompletionDateInternal = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      return `після 14:00 ${day}.${month}.${year}`;
    } catch (error) {
      console.error('Помилка форматування дати:', error);
      return dateString;
    }
  }, []);

  // =====================================
  // Ефекти для оновлення статусу
  // =====================================

  useEffect(() => {
    if (orderData && orderId) {
      const order = orderData as OrderDTO;

      setStatus({
        orderId,
        orderNumber: order.receiptNumber || null,
        isSuccess: true,
        completedAt: order.finalizedAt || new Date().toISOString(),
        expectedCompletionDate: order.expectedCompletionDate || null,
        formattedCompletionDate: order.expectedCompletionDate
          ? formatCompletionDateInternal(order.expectedCompletionDate)
          : null,
        receiptSent: {
          printed: order.printed || false,
          emailed: order.emailed || false,
          emailAddress: order.client?.email,
        },
        clientInfo: order.client
          ? {
              name: `${order.client.firstName || ''} ${order.client.lastName || ''}`.trim(),
              phone: order.client.phone || '',
              email: order.client.email,
            }
          : null,
        financialSummary: {
          totalAmount: order.finalAmount || 0,
          prepaymentAmount: order.prepaymentAmount || 0,
          balanceAmount: order.balanceAmount || 0,
          paymentMethod: getPaymentMethodDisplay(order),
        },
      });

      setError(null);
    }
  }, [orderData, orderId, formatCompletionDateInternal, getPaymentMethodDisplay]);

  useEffect(() => {
    if (orderError) {
      setError('Помилка завантаження інформації про замовлення');
    }
  }, [orderError]);

  // =====================================
  // Обчислювані значення
  // =====================================

  const getEmailStatusMessageInternal = useCallback((): string => {
    if (status.receiptSent.emailed && status.receiptSent.emailAddress) {
      return `✅ Електронну копію квитанції надіслано на ${status.receiptSent.emailAddress}`;
    } else if (status.clientInfo?.email) {
      return `📧 Електронну копію можна надіслати на ${status.clientInfo.email}`;
    } else {
      return '📧 Email адреса клієнта не вказана';
    }
  }, [status.receiptSent, status.clientInfo]);

  const getPrintStatusMessageInternal = useCallback((): string => {
    if (status.receiptSent.printed) {
      return '🖨️ Квитанцію надруковано';
    } else {
      return '🖨️ Квитанція готова до друку';
    }
  }, [status.receiptSent.printed]);

  const isValidCompletion = useMemo(() => {
    return (
      status.isSuccess &&
      status.orderId !== null &&
      status.orderNumber !== null &&
      status.clientInfo !== null
    );
  }, [status]);

  const completionMessages = useMemo(() => {
    const clientName = status.clientInfo?.name || 'Клієнт';
    const orderNumber = status.orderNumber || '';

    return {
      success: `Замовлення №${orderNumber} успішно створено для ${clientName}`,
      emailStatus: getEmailStatusMessageInternal(),
      printStatus: getPrintStatusMessageInternal(),
      reminderDate: status.formattedCompletionDate
        ? `Орієнтовна дата готовності: ${status.formattedCompletionDate}`
        : '',
    };
  }, [status, getEmailStatusMessageInternal, getPrintStatusMessageInternal]);

  // =====================================
  // Дії навігації
  // =====================================

  const goToNewOrder = useCallback(() => {
    // Очистити поточний стан та перейти до нового замовлення
    window.location.href = '/order-wizard';
  }, []);

  const goToOrdersList = useCallback(() => {
    // Перейти до списку замовлень
    window.location.href = '/orders';
  }, []);

  const goToOrderDetail = useCallback(() => {
    if (status.orderId) {
      // Перейти до деталей замовлення
      window.location.href = `/orders/${status.orderId}`;
    }
  }, [status.orderId]);

  // =====================================
  // Публічні допоміжні функції
  // =====================================

  const formatCompletionDate = useCallback(
    (date: string): string => {
      return formatCompletionDateInternal(date);
    },
    [formatCompletionDateInternal]
  );

  const getEmailStatusMessage = useCallback((): string => {
    return getEmailStatusMessageInternal();
  }, [getEmailStatusMessageInternal]);

  const getPrintStatusMessage = useCallback((): string => {
    return getPrintStatusMessageInternal();
  }, [getPrintStatusMessageInternal]);

  // =====================================
  // Повернення інтерфейсу
  // =====================================

  return {
    // Стан
    status,
    isLoading,
    error,

    // Валідація
    isValidCompletion,

    // Дії навігації
    goToNewOrder,
    goToOrdersList,
    goToOrderDetail,

    // Дані для показу
    completionMessages,

    // Допоміжні функції
    formatCompletionDate,
    getEmailStatusMessage,
    getPrintStatusMessage,
  };
}
