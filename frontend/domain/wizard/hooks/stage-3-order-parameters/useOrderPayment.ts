/**
 * @fileoverview Хук для управління оплатою замовлення
 *
 * Відповідальність:
 * - Вибір способу оплати (термінал, готівка, на рахунок)
 * - Встановлення суми передоплати з валідацією
 * - Розрахунок фінансових параметрів (загальна вартість, сплачено, борг)
 * - Автоматичний розрахунок залишкової суми
 */

import { useState, useCallback, useMemo } from 'react';

import { useCalculatePayment } from '@/shared/api/generated/full/aksiApi';

import type {
  OrderPayment,
  PaymentMethod,
  UseOrderPaymentReturn,
  PaymentCalculationInput,
} from './types';
import type { PaymentCalculationRequest } from '@/shared/api/generated/full/aksiApi.schemas';

/**
 * Хук для управління оплатою замовлення
 *
 * @example
 * ```tsx
 * const {
 *   payment,
 *   paymentMethods,
 *   setPaymentMethod,
 *   setPrepaymentAmount,
 *   updateTotalAmount
 * } = useOrderPayment();
 *
 * // Встановити спосіб оплати
 * setPaymentMethod('terminal');
 *
 * // Встановити передоплату
 * setPrepaymentAmount(500);
 *
 * // Оновити загальну суму
 * updateTotalAmount(1000);
 * ```
 */
export function useOrderPayment(): UseOrderPaymentReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [payment, setPayment] = useState<OrderPayment>({
    paymentMethod: 'terminal',
    totalAmount: 0,
    prepaymentAmount: 0,
    remainingAmount: 0,
  });

  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // =====================================
  // API запити
  // =====================================

  // Мутація для розрахунку платежу
  const {
    mutateAsync: calculatePaymentMutation,
    isPending: isCalculating,
    error: calculationMutationError,
  } = useCalculatePayment();

  // =====================================
  // Константи
  // =====================================

  const paymentMethods = useMemo(
    () => [
      {
        value: 'terminal' as PaymentMethod,
        label: 'Термінал',
      },
      {
        value: 'cash' as PaymentMethod,
        label: 'Готівка',
      },
      {
        value: 'bank_transfer' as PaymentMethod,
        label: 'На рахунок',
      },
    ],
    []
  );

  // =====================================
  // Обробка помилок
  // =====================================

  useMemo(() => {
    if (calculationMutationError) {
      setCalculationError('Помилка розрахунку платежу');
    } else {
      setCalculationError(null);
    }
  }, [calculationMutationError]);

  // =====================================
  // Утилітарні функції
  // =====================================

  /**
   * Валідувати суму передоплати
   */
  const validatePrepayment = useCallback((amount: number, totalAmount: number): string | null => {
    if (amount < 0) {
      return "Сума передоплати не може бути від'ємною";
    }

    if (amount > totalAmount) {
      return 'Сума передоплати не може перевищувати загальну вартість';
    }

    return null;
  }, []);

  /**
   * Розрахувати залишкову суму
   */
  const calculateRemainingAmount = useCallback(
    (totalAmount: number, prepaymentAmount: number): number => {
      return Math.max(0, totalAmount - prepaymentAmount);
    },
    []
  );

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Встановити спосіб оплати
   */
  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setPayment((prev) => ({ ...prev, paymentMethod: method }));
    setValidationError(null);
  }, []);

  /**
   * Встановити суму передоплати з валідацією
   */
  const setPrepaymentAmount = useCallback(
    (amount: number) => {
      const validationResult = validatePrepayment(amount, payment.totalAmount);

      if (validationResult) {
        setValidationError(validationResult);
        return;
      }

      setValidationError(null);

      const remainingAmount = calculateRemainingAmount(payment.totalAmount, amount);

      setPayment((prev) => ({
        ...prev,
        prepaymentAmount: amount,
        remainingAmount,
      }));
    },
    [payment.totalAmount, validatePrepayment, calculateRemainingAmount]
  );

  /**
   * Оновити загальну суму (викликається при зміні предметів або знижок)
   */
  const updateTotalAmount = useCallback(
    (totalAmount: number) => {
      const remainingAmount = calculateRemainingAmount(totalAmount, payment.prepaymentAmount);

      // Перевірити чи передоплата все ще валідна
      const validationResult = validatePrepayment(payment.prepaymentAmount, totalAmount);
      if (validationResult) {
        setValidationError(validationResult);
      } else {
        setValidationError(null);
      }

      setPayment((prev) => ({
        ...prev,
        totalAmount,
        remainingAmount,
      }));
    },
    [payment.prepaymentAmount, calculateRemainingAmount, validatePrepayment]
  );

  /**
   * Розрахувати платіж для замовлення (якщо потрібен API розрахунок)
   */
  const calculatePayment = useCallback(
    async (input: PaymentCalculationInput) => {
      try {
        setCalculationError(null);

        // Спочатку оновлюємо локально
        updateTotalAmount(input.totalAmount);

        // Якщо потрібен додатковий розрахунок через API
        if (input.items && input.items.length > 0) {
          // Мапування методів оплати до API формату
          let apiPaymentMethod: 'TERMINAL' | 'CASH' | 'BANK_TRANSFER' = 'TERMINAL';
          switch (payment.paymentMethod) {
            case 'terminal':
              apiPaymentMethod = 'TERMINAL';
              break;
            case 'cash':
              apiPaymentMethod = 'CASH';
              break;
            case 'bank_transfer':
              apiPaymentMethod = 'BANK_TRANSFER';
              break;
          }

          // Використовуємо тимчасовий ID під час створення замовлення
          const tempOrderId = 'calculating';

          const request: PaymentCalculationRequest = {
            orderId: tempOrderId,
            paymentMethod: apiPaymentMethod,
            prepaymentAmount: payment.prepaymentAmount,
          };

          try {
            const response = await calculatePaymentMutation({
              orderId: tempOrderId,
              data: request,
            });

            if (response && typeof response === 'object') {
              const responseObj = response as {
                totalAmount?: number;
                prepaymentAmount?: number;
                remainingAmount?: number;
              };

              if (responseObj.totalAmount !== undefined) {
                updateTotalAmount(responseObj.totalAmount);
              }
            }
          } catch (apiError) {
            console.warn(
              'API розрахунок недоступний, використовуємо локальний розрахунок:',
              apiError
            );
          }
        }
      } catch (error) {
        console.error('Помилка розрахунку платежу:', error);
        setCalculationError('Не вдалося розрахувати платіж');
      }
    },
    [calculatePaymentMutation, payment.paymentMethod, payment.prepaymentAmount, updateTotalAmount]
  );

  /**
   * Очистити всі дані про платіж
   */
  const clearPayment = useCallback(() => {
    setPayment({
      paymentMethod: 'terminal',
      totalAmount: 0,
      prepaymentAmount: 0,
      remainingAmount: 0,
    });
    setCalculationError(null);
    setValidationError(null);
  }, []);

  // =====================================
  // Обчислювані значення
  // =====================================

  const isValidPayment = useMemo(() => {
    return !validationError && payment.totalAmount >= 0;
  }, [validationError, payment.totalAmount]);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    payment,
    paymentMethods,
    isCalculating,
    calculationError,
    validationError,
    isValidPayment,

    // Дії
    setPaymentMethod,
    setPrepaymentAmount,
    updateTotalAmount,
    calculatePayment,
    clearPayment,
  };
}
