/**
 * Хук для роботи з підтвердженням та завершенням замовлення
 * Інтегрує Order Confirmation logic з React Query та API
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import {
  OrderManagementLifecycleService,
  OrderManagementDocumentsService,
  OrderManagementBasicOperationsService,
  type OrderFinalizationRequest,
  type ReceiptGenerationRequest,
  type EmailReceiptRequest,
  type OrderDTO,
  type ReceiptDTO,
} from '@/lib/api';

export interface OrderConfirmationData {
  order: OrderDTO | null;
  receipt: ReceiptDTO | null;
  isLoading: boolean;
  isSaving: boolean;
  isGeneratingReceipt: boolean;
  isSendingEmail: boolean;
  error: string | null;
  termsAccepted: boolean;
  receiptGenerated: boolean;
  signatureData: string | null;
}

export interface OrderConfirmationActions {
  // Terms agreement
  setTermsAccepted: (accepted: boolean) => void;

  // Signature handling
  setSignatureData: (data: string | null) => void;
  clearSignature: () => void;

  // Receipt operations
  generateReceipt: (orderId: string) => Promise<boolean>;
  downloadPdfReceipt: (orderId: string) => Promise<boolean>;
  printReceipt: () => void;
  emailReceipt: (orderId: string, email: string) => Promise<boolean>;

  // Order finalization
  finalizeOrder: (orderId: string, additionalComments?: string) => Promise<boolean>;

  // Reset
  reset: () => void;

  // Error handling
  clearError: () => void;
}

/**
 * Основний хук для роботи з підтвердженням замовлення
 */
export const useOrderConfirmation = (orderId?: string) => {
  const queryClient = useQueryClient();

  // Локальний стан
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Отримуємо дані замовлення
  const {
    data: order,
    isLoading: isLoadingOrder,
    error: orderError,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () =>
      orderId ? OrderManagementBasicOperationsService.getOrderById({ id: orderId }) : null,
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Отримуємо дані квитанції якщо замовлення завершено
  const { data: receipt, isLoading: isLoadingReceipt } = useQuery({
    queryKey: ['receipt', orderId],
    queryFn: () => {
      if (!orderId || !order || order.status !== 'COMPLETED') {
        return null;
      }

      return OrderManagementDocumentsService.getReceiptData({ orderId });
    },
    enabled: !!orderId && !!order && order.status === 'COMPLETED',
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Мутація для генерації квитанції
  const generateReceiptMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const request: ReceiptGenerationRequest = {
        orderId,
        format: 'JSON',
        includeSignature: true,
      };

      return OrderManagementDocumentsService.generatePdfReceipt({
        requestBody: request,
      });
    },
    onSuccess: () => {
      setReceiptGenerated(true);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['receipt', orderId] });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка генерації квитанції');
    },
  });

  // Мутація для завантаження PDF квитанції
  const downloadPdfMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return OrderManagementLifecycleService.getOrderReceipt({
        orderId,
        includeSignature: true,
      });
    },
    onSuccess: (data) => {
      // Створюємо Blob та завантажуємо файл
      const blob = new Blob([data as any], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setError(null);
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка завантаження PDF');
    },
  });

  // Мутація для відправки квитанції на email
  const emailReceiptMutation = useMutation({
    mutationFn: async ({ orderId, email }: { orderId: string; email: string }) => {
      const request: EmailReceiptRequest = {
        orderId,
        recipientEmail: email,
        includeSignature: true,
      };

      return OrderManagementDocumentsService.sendReceiptByEmail({ requestBody: request });
    },
    onSuccess: () => {
      setError(null);
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка відправки email');
    },
  });

  // Мутація для завершення замовлення
  const finalizeOrderMutation = useMutation({
    mutationFn: async ({ orderId, comments }: { orderId: string; comments?: string }) => {
      const request: OrderFinalizationRequest = {
        orderId,
        signatureData: signatureData || undefined,
        termsAccepted,
        sendReceiptByEmail: false, // Буде окремо відправлятися
        generatePrintableReceipt: true,
        comments,
      };

      return OrderManagementLifecycleService.finalizeOrder({
        requestBody: request,
      });
    },
    onSuccess: (finalizedOrder) => {
      setError(null);
      setReceiptGenerated(true);

      // Оновлюємо кеш
      queryClient.setQueryData(['order', orderId], finalizedOrder);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['receipt', orderId] });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка завершення замовлення');
    },
  });

  // === COMPUTED VALUES ===

  const isLoading = isLoadingOrder || isLoadingReceipt;
  const isSaving = finalizeOrderMutation.isPending;
  const isGeneratingReceipt = generateReceiptMutation.isPending;
  const isSendingEmail = emailReceiptMutation.isPending;

  const hasError = !!error || !!orderError;
  const errorMessage =
    error || (orderError instanceof Error ? orderError.message : String(orderError));

  /**
   * Перевірка чи можна завершити замовлення
   */
  const canFinalize = useMemo(() => {
    return termsAccepted && !!signatureData && !isLoading && !isSaving && !!order;
  }, [termsAccepted, signatureData, isLoading, isSaving, order]);

  /**
   * Перевірка чи замовлення вже завершене
   */
  const isOrderFinalized = useMemo(() => {
    return order?.status === 'COMPLETED';
  }, [order?.status]);

  // === ACTION HANDLERS ===

  const handleGenerateReceipt = useCallback(
    async (orderId: string): Promise<boolean> => {
      try {
        await generateReceiptMutation.mutateAsync(orderId);
        return true;
      } catch (error) {
        console.error('Помилка генерації квитанції:', error);
        return false;
      }
    },
    [generateReceiptMutation]
  );

  const handleDownloadPdf = useCallback(
    async (orderId: string): Promise<boolean> => {
      try {
        await downloadPdfMutation.mutateAsync(orderId);
        return true;
      } catch (error) {
        console.error('Помилка завантаження PDF:', error);
        return false;
      }
    },
    [downloadPdfMutation]
  );

  const handlePrintReceipt = useCallback(() => {
    window.print();
  }, []);

  const handleEmailReceipt = useCallback(
    async (orderId: string, email: string): Promise<boolean> => {
      try {
        await emailReceiptMutation.mutateAsync({ orderId, email });
        return true;
      } catch (error) {
        console.error('Помилка відправки email:', error);
        return false;
      }
    },
    [emailReceiptMutation]
  );

  const handleFinalizeOrder = useCallback(
    async (orderId: string, comments?: string): Promise<boolean> => {
      try {
        await finalizeOrderMutation.mutateAsync({ orderId, comments });
        return true;
      } catch (error) {
        console.error('Помилка завершення замовлення:', error);
        return false;
      }
    },
    [finalizeOrderMutation]
  );

  const handleSetSignature = useCallback((data: string | null) => {
    setSignatureData(data);
  }, []);

  const handleClearSignature = useCallback(() => {
    setSignatureData(null);
  }, []);

  const handleReset = useCallback(() => {
    setTermsAccepted(false);
    setReceiptGenerated(false);
    setSignatureData(null);
    setError(null);
  }, []);

  const handleClearError = useCallback(() => {
    setError(null);
  }, []);

  // === PUBLIC API ===

  const data: OrderConfirmationData = {
    order: order || null,
    receipt: receipt || null,
    isLoading,
    isSaving,
    isGeneratingReceipt,
    isSendingEmail,
    error: errorMessage,
    termsAccepted,
    receiptGenerated: receiptGenerated || isOrderFinalized,
    signatureData,
  };

  const actions: OrderConfirmationActions = {
    setTermsAccepted,
    setSignatureData: handleSetSignature,
    clearSignature: handleClearSignature,
    generateReceipt: handleGenerateReceipt,
    downloadPdfReceipt: handleDownloadPdf,
    printReceipt: handlePrintReceipt,
    emailReceipt: handleEmailReceipt,
    finalizeOrder: handleFinalizeOrder,
    reset: handleReset,
    clearError: handleClearError,
  };

  return {
    ...data,
    ...actions,

    // Additional computed values
    canFinalize,
    isOrderFinalized,
    hasError,
  };
};
