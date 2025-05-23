/**
 * Хук для роботи з параметрами замовлення
 * Інтегрує Order Parameters Zustand store з React Query та бізнес-логікою
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { OrderParametersService } from '../services/order-parameters.service';
import {
  useOrderParametersStore,
  useOrderParametersExecutionParams,
  useOrderParametersDiscountParams,
  useOrderParametersPaymentParams,
  useOrderParametersAdditionalInfo,
  useOrderParametersStatus,
  useOrderParametersHistory,
} from '../store';
import { DiscountType } from '../types';
import { OrderParametersUtils } from '../utils/order-parameters.utils';

import type { UrgencyOption } from '../types';

/**
 * Основний хук для роботи з параметрами замовлення
 */
export const useOrderParameters = () => {
  const queryClient = useQueryClient();

  // === ZUSTAND STORE ACTIONS ===
  const {
    // Execution actions
    setExecutionDate,
    setUrgencyOption,
    setCustomDeadline,
    setIsUrgent,

    // Discount actions
    setDiscountType,
    setDiscountPercentage,
    setIsDiscountApplicable,
    addDiscountExclusion,
    removeDiscountExclusion,

    // Payment actions
    setPaymentMethod,
    setTotalAmount,
    setPrepaymentAmount,

    // Additional info actions
    setOrderNotes,
    setClientRequirements,

    // State actions
    setIsLoading,
    setIsSaving,
    setError,
    clearError,
    setValidationErrors,
    clearValidationErrors,

    // Operations
    calculateAmounts,
    validateParameters,
    recalculateWithDiscount,
    recalculateWithUrgency,

    // Reset
    reset,
    resetToDefaults,
  } = useOrderParametersStore();

  // === СЕЛЕКТОРИ СТАНУ ===
  const executionParams = useOrderParametersExecutionParams();
  const discountParams = useOrderParametersDiscountParams();
  const paymentParams = useOrderParametersPaymentParams();
  const additionalInfo = useOrderParametersAdditionalInfo();
  const status = useOrderParametersStatus();
  const history = useOrderParametersHistory();

  // === REACT QUERY MUTATIONS ===

  /**
   * Мутація для збереження параметрів замовлення
   */
  const saveParametersMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const params = {
        executionParams,
        discountParams,
        paymentParams,
        additionalInfo,
      };

      const result = await OrderParametersService.saveOrderParameters(orderId, params);
      if (!result.success) {
        throw new Error(result.errors?.general || 'Помилка збереження параметрів');
      }
      return result;
    },
    onMutate: () => {
      setIsSaving(true);
      clearError();
    },
    onSuccess: () => {
      setIsSaving(false);
      queryClient.invalidateQueries({ queryKey: ['order-parameters'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка збереження параметрів');
      setIsSaving(false);
    },
  });

  /**
   * Мутація для завантаження параметрів з існуючого замовлення
   */
  const loadParametersMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const result = await OrderParametersService.loadOrderParameters(orderId);
      if (!result.success || !result.order) {
        throw new Error(result.errors?.general || 'Помилка завантаження параметрів');
      }
      return result.order as any; // Тимчасове приведення типу
    },
    onMutate: () => {
      setIsLoading(true);
      clearError();
    },
    onSuccess: (data) => {
      // Оновлюємо стор даними з сервера
      if (data.executionDate) setExecutionDate(new Date(data.executionDate));
      if (data.urgencyOption) setUrgencyOption(data.urgencyOption);
      if (data.discountType) setDiscountType(data.discountType);
      if (data.discountPercentage !== undefined) setDiscountPercentage(data.discountPercentage);
      if (data.paymentMethod) setPaymentMethod(data.paymentMethod);
      if (data.totalAmount !== undefined) setTotalAmount(data.totalAmount);
      if (data.prepaymentAmount !== undefined) setPrepaymentAmount(data.prepaymentAmount);
      if (data.orderNotes) setOrderNotes(data.orderNotes);
      if (data.clientRequirements) setClientRequirements(data.clientRequirements);

      setIsLoading(false);
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка завантаження параметрів');
      setIsLoading(false);
    },
  });

  // === COMPUTED VALUES ===

  /**
   * Доступні варіанти терміновості з описами
   */
  const urgencyOptions = useMemo(() => OrderParametersUtils.getUrgencyOptions(), []);

  /**
   * Доступні типи знижок з описами
   */
  const discountTypes = useMemo(() => OrderParametersUtils.getDiscountTypes(), []);

  /**
   * Доступні способи оплати з описами
   */
  const paymentMethods = useMemo(() => OrderParametersUtils.getPaymentMethods(), []);

  /**
   * Перевірка чи параметри валідні
   */
  const isValid = useMemo(
    () => Object.keys(status.validationErrors).length === 0,
    [status.validationErrors]
  );

  /**
   * Перевірка чи можна зберігати
   */
  const canSave = useMemo(
    () => isValid && !status.isLoading && !status.isSaving,
    [isValid, status.isLoading, status.isSaving]
  );

  /**
   * Розрахунок дати виконання на основі терміновості
   */
  const calculatedExecutionDate = useMemo(() => {
    if (executionParams.urgencyOption === 'CUSTOM' && executionParams.customDeadline) {
      return executionParams.customDeadline;
    }

    return OrderParametersUtils.calculateExecutionDate(executionParams.urgencyOption, new Date());
  }, [executionParams.urgencyOption, executionParams.customDeadline]);

  /**
   * Перевірка чи знижка застосовна до поточних предметів
   */
  const isDiscountValidForItems = useMemo(() => {
    if (discountParams.discountType === DiscountType.NONE) return true;

    // TODO: Інтеграція з предметами замовлення
    // Перевірити чи немає категорій що виключені зі знижки
    return discountParams.isDiscountApplicable;
  }, [discountParams.discountType, discountParams.isDiscountApplicable]);

  // === ПУБЛІЧНИЙ API ===

  /**
   * Встановлення дати виконання з валідацією
   */
  const handleSetExecutionDate = useCallback(
    (date: Date | null) => {
      if (date && date < new Date()) {
        setValidationErrors({
          executionDate: 'Дата виконання не може бути в минулому',
        });
        return;
      }

      clearValidationErrors();
      setExecutionDate(date);
    },
    [setExecutionDate, setValidationErrors, clearValidationErrors]
  );

  /**
   * Встановлення терміновості з автоматичним перерахунком
   */
  const handleSetUrgencyOption = useCallback(
    (option: UrgencyOption) => {
      setUrgencyOption(option);

      if (option !== 'CUSTOM') {
        const calculatedDate = OrderParametersUtils.calculateExecutionDate(option, new Date());
        setExecutionDate(calculatedDate);
      }
    },
    [setUrgencyOption, setExecutionDate]
  );

  /**
   * Встановлення типу знижки з перевіркою застосування
   */
  const handleSetDiscountType = useCallback(
    (type: DiscountType) => {
      setDiscountType(type);

      // Перевірити чи можна застосувати знижку
      const canApply = OrderParametersUtils.isDiscountApplicable(type);
      setIsDiscountApplicable(canApply);

      if (!canApply) {
        setValidationErrors({
          discountType: 'Цей тип знижки не може бути застосований до поточних предметів',
        });
      } else {
        clearValidationErrors();
      }
    },
    [setDiscountType, setIsDiscountApplicable, setValidationErrors, clearValidationErrors]
  );

  /**
   * Встановлення передоплати з валідацією
   */
  const handleSetPrepaymentAmount = useCallback(
    (amount: number) => {
      if (amount < 0) {
        setValidationErrors({
          prepaymentAmount: "Передоплата не може бути від'ємною",
        });
        return;
      }

      if (amount > paymentParams.finalAmount) {
        setValidationErrors({
          prepaymentAmount: 'Передоплата не може перевищувати загальну суму',
        });
        return;
      }

      clearValidationErrors();
      setPrepaymentAmount(amount);
    },
    [setPrepaymentAmount, paymentParams.finalAmount, setValidationErrors, clearValidationErrors]
  );

  /**
   * Валідація всіх параметрів
   */
  const handleValidateAll = useCallback(() => {
    return validateParameters();
  }, [validateParameters]);

  /**
   * Збереження параметрів
   */
  const handleSaveParameters = useCallback(
    (orderId: string) => {
      if (!handleValidateAll()) {
        setError('Параметри містять помилки');
        return;
      }

      saveParametersMutation.mutate(orderId);
    },
    [handleValidateAll, saveParametersMutation, setError]
  );

  /**
   * Завантаження параметрів
   */
  const handleLoadParameters = useCallback(
    (orderId: string) => {
      loadParametersMutation.mutate(orderId);
    },
    [loadParametersMutation]
  );

  /**
   * Скидання до початкових значень
   */
  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  /**
   * Скидання до значень за замовчуванням
   */
  const handleResetToDefaults = useCallback(() => {
    resetToDefaults();
  }, [resetToDefaults]);

  return {
    // === СТАН ===
    executionParams,
    discountParams,
    paymentParams,
    additionalInfo,
    status,
    history,

    // === COMPUTED VALUES ===
    urgencyOptions,
    discountTypes,
    paymentMethods,
    isValid,
    canSave,
    calculatedExecutionDate,
    isDiscountValidForItems,

    // === ACTIONS ===
    setExecutionDate: handleSetExecutionDate,
    setUrgencyOption: handleSetUrgencyOption,
    setCustomDeadline,
    setDiscountType: handleSetDiscountType,
    setDiscountPercentage,
    addDiscountExclusion,
    removeDiscountExclusion,
    setPaymentMethod,
    setTotalAmount,
    setPrepaymentAmount: handleSetPrepaymentAmount,
    setOrderNotes,
    setClientRequirements,

    // === OPERATIONS ===
    validateAll: handleValidateAll,
    saveParameters: handleSaveParameters,
    loadParameters: handleLoadParameters,
    reset: handleReset,
    resetToDefaults: handleResetToDefaults,
    calculateAmounts,
    recalculateWithDiscount,
    recalculateWithUrgency,

    // === STATUS ===
    isLoading: status.isLoading,
    isSaving: status.isSaving,
    error: status.error,
    validationErrors: status.validationErrors,
    clearError,
    clearValidationErrors,
  };
};
