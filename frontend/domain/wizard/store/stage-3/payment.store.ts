/**
 * @fileoverview Payment Slice Store - Zustand store для оплати та фінансових розрахунків
 * @module domain/wizard/store/stage-3
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Типи способів оплати
 */
export enum PaymentMethod {
  TERMINAL = 'TERMINAL',
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

/**
 * Інтерфейс фінансового розрахунку
 */
interface PaymentCalculation {
  orderTotal: number;
  discountAmount: number;
  expediteAmount: number;
  taxAmount: number;
  finalAmount: number;
  prepaymentAmount: number;
  remainingAmount: number;
}

/**
 * Стан оплати (Stage 3.3)
 */
interface PaymentState {
  // Payment method
  selectedPaymentMethod: PaymentMethod | null;
  isPaymentMethodValid: boolean;

  // Financial calculation
  calculation: PaymentCalculation;
  isCalculationLoading: boolean;
  calculationError: string | null;

  // Prepayment
  prepaymentAmount: number;
  maxPrepaymentAmount: number;
  isFullPayment: boolean;

  // Receipt preferences
  generateReceiptOnCompletion: boolean;
  sendReceiptByEmail: boolean;
  printReceiptCopies: number;

  // Payment processing
  isProcessingPayment: boolean;
  paymentTransactionId: string | null;
  paymentError: string | null;
  paymentSuccess: boolean;

  // Validation
  paymentValidationErrors: string[];
  isPaymentValid: boolean;
}

/**
 * Дії для оплати
 */
interface PaymentActions {
  // Payment method actions
  setPaymentMethod: (method: PaymentMethod | null) => void;
  validatePaymentMethod: () => void;

  // Financial calculation actions
  updateCalculation: (calculation: Partial<PaymentCalculation>) => void;
  recalculateFinancials: (orderTotal: number, discount: number, expedite: number) => void;
  setCalculationLoading: (loading: boolean) => void;
  setCalculationError: (error: string | null) => void;

  // Prepayment actions
  setPrepaymentAmount: (amount: number) => void;
  setMaxPrepaymentAmount: (maxAmount: number) => void;
  setFullPayment: (fullPayment: boolean) => void;
  validatePrepaymentAmount: () => void;

  // Receipt preferences actions
  setGenerateReceiptOnCompletion: (generate: boolean) => void;
  setSendReceiptByEmail: (send: boolean) => void;
  setPrintReceiptCopies: (copies: number) => void;

  // Payment processing actions
  setProcessingPayment: (processing: boolean) => void;
  setPaymentTransactionId: (transactionId: string | null) => void;
  setPaymentError: (error: string | null) => void;
  setPaymentSuccess: (success: boolean) => void;
  processPayment: () => Promise<boolean>;

  // Validation actions
  setPaymentValidationErrors: (errors: string[]) => void;
  clearPaymentValidationErrors: () => void;
  validatePayment: () => void;
  setPaymentValid: (valid: boolean) => void;

  // Reset actions
  resetPayment: () => void;
}

/**
 * Початковий стан оплати
 */
const initialPaymentState: PaymentState = {
  selectedPaymentMethod: null,
  isPaymentMethodValid: false,
  calculation: {
    orderTotal: 0,
    discountAmount: 0,
    expediteAmount: 0,
    taxAmount: 0,
    finalAmount: 0,
    prepaymentAmount: 0,
    remainingAmount: 0,
  },
  isCalculationLoading: false,
  calculationError: null,
  prepaymentAmount: 0,
  maxPrepaymentAmount: 0,
  isFullPayment: false,
  generateReceiptOnCompletion: true,
  sendReceiptByEmail: false,
  printReceiptCopies: 2,
  isProcessingPayment: false,
  paymentTransactionId: null,
  paymentError: null,
  paymentSuccess: false,
  paymentValidationErrors: [],
  isPaymentValid: false,
};

/**
 * Payment Slice Store
 *
 * Відповідальність:
 * - Вибір способу оплати (термінал, готівка, рахунок)
 * - Фінансові розрахунки з урахуванням знижок та надбавок
 * - Управління передоплатою та залишком
 * - Налаштування квитанцій (генерація, email, друк)
 * - Обробка платежів через термінал
 * - Валідація фінансової інформації
 *
 * Інтеграція:
 * - API платіжних терміналів
 * - Сервіси фінансових розрахунків
 * - PDF генерація квитанцій
 * - Email сервіси
 */
export const usePaymentStore = create<PaymentState & PaymentActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialPaymentState,

      // Payment method actions
      setPaymentMethod: (method) => {
        set({ selectedPaymentMethod: method }, false, 'payment/setPaymentMethod');
        get().validatePaymentMethod();
        get().validatePayment();
      },

      validatePaymentMethod: () => {
        const state = get();
        const isValid = state.selectedPaymentMethod !== null;
        set({ isPaymentMethodValid: isValid }, false, 'payment/validatePaymentMethod');
      },

      // Financial calculation actions
      updateCalculation: (calculationUpdate) => {
        set(
          (state) => ({
            calculation: { ...state.calculation, ...calculationUpdate },
          }),
          false,
          'payment/updateCalculation'
        );
        get().validatePayment();
      },

      recalculateFinancials: (orderTotal, discount, expedite) => {
        const taxRate = 0; // В Україні ПДВ зазвичай включений в ціну
        const taxAmount = 0;

        const finalAmount = orderTotal - discount + expedite + taxAmount;
        const state = get();
        const prepaymentAmount = state.prepaymentAmount;
        const remainingAmount = Math.max(0, finalAmount - prepaymentAmount);

        const newCalculation: PaymentCalculation = {
          orderTotal,
          discountAmount: discount,
          expediteAmount: expedite,
          taxAmount,
          finalAmount,
          prepaymentAmount,
          remainingAmount,
        };

        get().updateCalculation(newCalculation);
        get().setMaxPrepaymentAmount(finalAmount);
      },

      setCalculationLoading: (loading) => {
        set({ isCalculationLoading: loading }, false, 'payment/setCalculationLoading');
      },

      setCalculationError: (error) => {
        set({ calculationError: error }, false, 'payment/setCalculationError');
      },

      // Prepayment actions
      setPrepaymentAmount: (amount) => {
        const state = get();
        const clampedAmount = Math.max(0, Math.min(amount, state.maxPrepaymentAmount));
        const remainingAmount = state.calculation.finalAmount - clampedAmount;
        const isFullPayment = clampedAmount >= state.calculation.finalAmount;

        set(
          {
            prepaymentAmount: clampedAmount,
            isFullPayment,
            calculation: {
              ...state.calculation,
              prepaymentAmount: clampedAmount,
              remainingAmount,
            },
          },
          false,
          'payment/setPrepaymentAmount'
        );
        get().validatePrepaymentAmount();
        get().validatePayment();
      },

      setMaxPrepaymentAmount: (maxAmount) => {
        set({ maxPrepaymentAmount: maxAmount }, false, 'payment/setMaxPrepaymentAmount');
      },

      setFullPayment: (fullPayment) => {
        const state = get();
        if (fullPayment) {
          get().setPrepaymentAmount(state.calculation.finalAmount);
        }
        set({ isFullPayment: fullPayment }, false, 'payment/setFullPayment');
      },

      validatePrepaymentAmount: () => {
        const state = get();
        const errors: string[] = [];

        if (state.prepaymentAmount < 0) {
          errors.push('Сума передоплати не може бути відʼємною');
        }

        if (state.prepaymentAmount > state.calculation.finalAmount) {
          errors.push('Сума передоплати не може перевищувати загальну вартість');
        }

        // Можна додати мінімальну передоплату
        const minPrepayment = state.calculation.finalAmount * 0.1; // 10% мінімум
        if (state.prepaymentAmount < minPrepayment && state.prepaymentAmount > 0) {
          errors.push(`Мінімальна передоплата: ${minPrepayment.toFixed(2)} грн`);
        }

        if (errors.length > 0) {
          get().setPaymentValidationErrors(errors);
        }
      },

      // Receipt preferences actions
      setGenerateReceiptOnCompletion: (generate) => {
        set(
          { generateReceiptOnCompletion: generate },
          false,
          'payment/setGenerateReceiptOnCompletion'
        );
      },

      setSendReceiptByEmail: (send) => {
        set({ sendReceiptByEmail: send }, false, 'payment/setSendReceiptByEmail');
      },

      setPrintReceiptCopies: (copies) => {
        const clampedCopies = Math.max(1, Math.min(copies, 5)); // 1-5 копій
        set({ printReceiptCopies: clampedCopies }, false, 'payment/setPrintReceiptCopies');
      },

      // Payment processing actions
      setProcessingPayment: (processing) => {
        set({ isProcessingPayment: processing }, false, 'payment/setProcessingPayment');
      },

      setPaymentTransactionId: (transactionId) => {
        set({ paymentTransactionId: transactionId }, false, 'payment/setPaymentTransactionId');
      },

      setPaymentError: (error) => {
        set({ paymentError: error, paymentSuccess: false }, false, 'payment/setPaymentError');
      },

      setPaymentSuccess: (success) => {
        set({ paymentSuccess: success, paymentError: null }, false, 'payment/setPaymentSuccess');
      },

      processPayment: async () => {
        const state = get();
        if (!state.isPaymentValid || state.prepaymentAmount <= 0) {
          return false;
        }

        set(
          { isProcessingPayment: true, paymentError: null },
          false,
          'payment/processPayment/start'
        );

        try {
          // Тут буде інтеграція з платіжним терміналом або API
          switch (state.selectedPaymentMethod) {
            case PaymentMethod.TERMINAL:
              // await processTerminalPayment(state.prepaymentAmount);
              break;
            case PaymentMethod.CASH:
              // Готівкові операції не потребують обробки
              break;
            case PaymentMethod.BANK_TRANSFER:
              // await processBankTransfer(state.prepaymentAmount);
              break;
          }

          // Мок для демонстрації
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const mockTransactionId = `TXN${Date.now()}`;

          set(
            {
              paymentTransactionId: mockTransactionId,
              paymentSuccess: true,
            },
            false,
            'payment/processPayment/success'
          );

          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Помилка обробки платежу';
          get().setPaymentError(errorMessage);
          return false;
        } finally {
          set({ isProcessingPayment: false }, false, 'payment/processPayment/complete');
        }
      },

      // Validation actions
      setPaymentValidationErrors: (errors) => {
        set(
          {
            paymentValidationErrors: errors,
            isPaymentValid: errors.length === 0,
          },
          false,
          'payment/setPaymentValidationErrors'
        );
      },

      clearPaymentValidationErrors: () => {
        set(
          { paymentValidationErrors: [], isPaymentValid: true },
          false,
          'payment/clearPaymentValidationErrors'
        );
      },

      validatePayment: () => {
        const state = get();
        const errors: string[] = [];

        if (!state.selectedPaymentMethod) {
          errors.push('Виберіть спосіб оплати');
        }

        if (state.calculation.finalAmount <= 0) {
          errors.push('Сума замовлення повинна бути більше 0');
        }

        if (state.prepaymentAmount < 0) {
          errors.push('Сума передоплати не може бути відʼємною');
        }

        if (state.prepaymentAmount > state.calculation.finalAmount) {
          errors.push('Сума передоплати не може перевищувати загальну вартість');
        }

        // Для email квитанції потрібен email клієнта
        if (state.sendReceiptByEmail) {
          // Тут можна додати перевірку наявності email клієнта
          // if (!clientEmail) errors.push('Для відправки email потрібна адреса клієнта');
        }

        get().setPaymentValidationErrors(errors);
      },

      setPaymentValid: (valid) => {
        set({ isPaymentValid: valid }, false, 'payment/setPaymentValid');
      },

      // Reset actions
      resetPayment: () => {
        set(initialPaymentState, false, 'payment/resetPayment');
      },
    }),
    {
      name: 'payment-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type PaymentStore = ReturnType<typeof usePaymentStore>;
