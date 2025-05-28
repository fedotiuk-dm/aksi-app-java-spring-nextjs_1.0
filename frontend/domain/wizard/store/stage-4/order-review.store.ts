/**
 * @fileoverview Order Review Slice Store - Zustand store для перегляду та завершення
 * @module domain/wizard/store/stage-4
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Стан перегляду замовлення (Stage 4)
 */
interface OrderReviewState {
  // Legal acceptance
  isTermsAccepted: boolean;
  clientSignature: string | null;
  signatureTimestamp: Date | null;

  // Order summary calculation
  orderSummary: {
    itemsCount: number;
    subtotal: number;
    discountAmount: number;
    expediteAmount: number;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
  };

  // Receipt generation
  receiptData: any | null;
  isReceiptGenerating: boolean;
  receiptPdfUrl: string | null;
  receiptError: string | null;

  // Order completion
  isOrderCompleting: boolean;
  orderCompletionError: string | null;
  completedOrderId: string | null;

  // Validation
  reviewValidationErrors: string[];
  isReadyForCompletion: boolean;
}

/**
 * Дії для перегляду замовлення
 */
interface OrderReviewActions {
  // Legal acceptance actions
  setTermsAccepted: (accepted: boolean) => void;
  setClientSignature: (signature: string) => void;
  clearSignature: () => void;

  // Order summary actions
  updateOrderSummary: (summary: Partial<OrderReviewState['orderSummary']>) => void;
  recalculateOrderSummary: (itemsData: any[], discount: any, expedite: any) => void;

  // Receipt generation actions
  setReceiptData: (data: any) => void;
  setReceiptGenerating: (isGenerating: boolean) => void;
  setReceiptPdfUrl: (url: string | null) => void;
  setReceiptError: (error: string | null) => void;
  generateReceipt: () => Promise<void>;

  // Order completion actions
  setOrderCompleting: (isCompleting: boolean) => void;
  setOrderCompletionError: (error: string | null) => void;
  setCompletedOrderId: (orderId: string) => void;
  completeOrder: () => Promise<boolean>;

  // Validation actions
  setReviewValidationErrors: (errors: string[]) => void;
  validateOrderReview: () => void;
  setReadyForCompletion: (ready: boolean) => void;

  // Reset actions
  resetOrderReview: () => void;
}

/**
 * Початковий стан перегляду замовлення
 */
const initialOrderReviewState: OrderReviewState = {
  isTermsAccepted: false,
  clientSignature: null,
  signatureTimestamp: null,
  orderSummary: {
    itemsCount: 0,
    subtotal: 0,
    discountAmount: 0,
    expediteAmount: 0,
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
  },
  receiptData: null,
  isReceiptGenerating: false,
  receiptPdfUrl: null,
  receiptError: null,
  isOrderCompleting: false,
  orderCompletionError: null,
  completedOrderId: null,
  reviewValidationErrors: [],
  isReadyForCompletion: false,
};

/**
 * Order Review Slice Store
 *
 * Відповідальність:
 * - Юридичне погодження умов послуг
 * - Цифровий підпис клієнта
 * - Фінальний розрахунок замовлення
 * - Генерація квитанції (PDF)
 * - Завершення створення замовлення
 * - Валідація перед завершенням
 *
 * Інтеграція:
 * - PDF генерація через API
 * - Збереження замовлення в БД
 * - Відправка email копії
 * - Друк квитанції
 */
export const useOrderReviewStore = create<OrderReviewState & OrderReviewActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialOrderReviewState,

      // Legal acceptance actions
      setTermsAccepted: (accepted) => {
        set({ isTermsAccepted: accepted }, false, 'orderReview/setTermsAccepted');
        get().validateOrderReview();
      },

      setClientSignature: (signature) => {
        set(
          {
            clientSignature: signature,
            signatureTimestamp: new Date(),
          },
          false,
          'orderReview/setClientSignature'
        );
        get().validateOrderReview();
      },

      clearSignature: () => {
        set(
          {
            clientSignature: null,
            signatureTimestamp: null,
          },
          false,
          'orderReview/clearSignature'
        );
        get().validateOrderReview();
      },

      // Order summary actions
      updateOrderSummary: (summary) => {
        set(
          (state) => ({
            orderSummary: { ...state.orderSummary, ...summary },
          }),
          false,
          'orderReview/updateOrderSummary'
        );
      },

      recalculateOrderSummary: (itemsData, discount, expedite) => {
        const itemsCount = itemsData.length;
        const subtotal = itemsData.reduce((sum, item) => sum + (item.finalPrice || 0), 0);

        // Розрахунок знижки (тільки на applicable категорії)
        const discountAmount = discount?.discountAmount || 0;

        // Розрахунок доплати за терміновість
        const expediteAmount = expedite?.expediteCostModifier
          ? (subtotal - discountAmount) * expedite.expediteCostModifier
          : 0;

        const totalAmount = subtotal - discountAmount + expediteAmount;
        const paidAmount = 0; // Буде встановлено в payment store
        const remainingAmount = totalAmount - paidAmount;

        get().updateOrderSummary({
          itemsCount,
          subtotal,
          discountAmount,
          expediteAmount,
          totalAmount,
          paidAmount,
          remainingAmount,
        });
      },

      // Receipt generation actions
      setReceiptData: (data) => {
        set({ receiptData: data }, false, 'orderReview/setReceiptData');
      },

      setReceiptGenerating: (isGenerating) => {
        set({ isReceiptGenerating: isGenerating }, false, 'orderReview/setReceiptGenerating');
      },

      setReceiptPdfUrl: (url) => {
        set({ receiptPdfUrl: url }, false, 'orderReview/setReceiptPdfUrl');
      },

      setReceiptError: (error) => {
        set({ receiptError: error }, false, 'orderReview/setReceiptError');
      },

      generateReceipt: async () => {
        const state = get();
        set(
          { isReceiptGenerating: true, receiptError: null },
          false,
          'orderReview/generateReceipt/start'
        );

        try {
          // Тут буде виклик API для генерації PDF
          // const pdfUrl = await generateReceiptPdf(state.receiptData);
          // set({ receiptPdfUrl: pdfUrl }, false, 'orderReview/generateReceipt/success');

          // Мок для демонстрації
          await new Promise((resolve) => setTimeout(resolve, 2000));
          set(
            { receiptPdfUrl: '/api/receipts/mock-receipt.pdf' },
            false,
            'orderReview/generateReceipt/success'
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Помилка генерації квитанції';
          set({ receiptError: errorMessage }, false, 'orderReview/generateReceipt/error');
        } finally {
          set({ isReceiptGenerating: false }, false, 'orderReview/generateReceipt/complete');
        }
      },

      // Order completion actions
      setOrderCompleting: (isCompleting) => {
        set({ isOrderCompleting: isCompleting }, false, 'orderReview/setOrderCompleting');
      },

      setOrderCompletionError: (error) => {
        set({ orderCompletionError: error }, false, 'orderReview/setOrderCompletionError');
      },

      setCompletedOrderId: (orderId) => {
        set({ completedOrderId: orderId }, false, 'orderReview/setCompletedOrderId');
      },

      completeOrder: async () => {
        const state = get();
        if (!state.isReadyForCompletion) {
          return false;
        }

        set(
          { isOrderCompleting: true, orderCompletionError: null },
          false,
          'orderReview/completeOrder/start'
        );

        try {
          // Тут буде виклик API для збереження замовлення
          // const orderId = await createOrder(state.receiptData);
          // set({ completedOrderId: orderId }, false, 'orderReview/completeOrder/success');

          // Мок для демонстрації
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const mockOrderId = `ORDER-${Date.now()}`;
          set({ completedOrderId: mockOrderId }, false, 'orderReview/completeOrder/success');

          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Помилка створення замовлення';
          set({ orderCompletionError: errorMessage }, false, 'orderReview/completeOrder/error');
          return false;
        } finally {
          set({ isOrderCompleting: false }, false, 'orderReview/completeOrder/complete');
        }
      },

      // Validation actions
      setReviewValidationErrors: (errors) => {
        set(
          {
            reviewValidationErrors: errors,
            isReadyForCompletion: errors.length === 0,
          },
          false,
          'orderReview/setReviewValidationErrors'
        );
      },

      validateOrderReview: () => {
        const state = get();
        const errors: string[] = [];

        if (!state.isTermsAccepted) {
          errors.push('Необхідно погодитися з умовами надання послуг');
        }

        if (!state.clientSignature) {
          errors.push('Необхідний підпис клієнта');
        }

        if (state.orderSummary.totalAmount <= 0) {
          errors.push('Загальна сума замовлення повинна бути більше 0');
        }

        get().setReviewValidationErrors(errors);
      },

      setReadyForCompletion: (ready) => {
        set({ isReadyForCompletion: ready }, false, 'orderReview/setReadyForCompletion');
      },

      // Reset actions
      resetOrderReview: () => {
        set(initialOrderReviewState, false, 'orderReview/resetOrderReview');
      },
    }),
    {
      name: 'order-review-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type OrderReviewStore = ReturnType<typeof useOrderReviewStore>;
