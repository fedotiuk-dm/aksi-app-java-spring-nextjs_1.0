/**
 * @fileoverview Хук для параметрів виконання замовлення (крок 3.1)
 * @module domain/wizard/hooks/stage-3
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { ExecutionParamsService } from '../../services/stage-3-order-params';
import { useWizardStore } from '../../store';

/**
 * Інтерфейс параметрів виконання
 */
interface ExecutionParams {
  executionDate: Date;
  urgencyLevel: 'звичайне' | 'термінове_50_за_48год' | 'термінове_100_за_24год';
  urgencyPricing: {
    multiplier: number;
    additionalCost: number;
  };
  estimatedDays: number;
}

/**
 * Хук для параметрів виконання замовлення
 * 📅 Композиція: TanStack Query + Zustand + ExecutionParamsService
 */
export const useExecutionParams = () => {
  // 🏪 Zustand - глобальний стан
  const { orderItems, executionParams, setExecutionParams, addError, addWarning } =
    useWizardStore();

  // ⚙️ Сервіс
  const executionService = useMemo(() => new ExecutionParamsService(), []);

  // 📋 Розрахунок стандартних термінів виконання
  const {
    data: estimatedTerms,
    isLoading: isCalculatingTerms,
    error: termsError,
  } = useQuery({
    queryKey: ['execution-terms', orderItems?.length],
    queryFn: async () => {
      if (!orderItems || orderItems.length === 0) {
        return { minDays: 2, maxDays: 14, recommendedDate: new Date() };
      }

      // Отримуємо категорії сервісів з предметів
      const serviceCategoryIds = orderItems
        .map((item: any) => item.serviceCategoryId || '')
        .filter(Boolean);
      const result = await executionService.calculateCompletionDate(serviceCategoryIds);

      if (result) {
        // Конвертуємо WizardCompletionDateCalculationResult в наш формат
        return {
          minDays: 2, // базове значення
          maxDays: 14,
          recommendedDate: new Date(result.expectedCompletionDate),
          originalResult: result,
        };
      }

      return { minDays: 2, maxDays: 14, recommendedDate: new Date() };
    },
    enabled: !!(orderItems && orderItems.length > 0),
    staleTime: 300000, // 5 хвилин кеш
    gcTime: 600000, // 10 хвилин в кеші
  });

  // 🧮 Розрахунок вартості терміновості (мок логіка)
  const calculateUrgencyMutation = useMutation({
    mutationFn: async ({
      urgencyLevel,
      totalAmount,
    }: {
      urgencyLevel: ExecutionParams['urgencyLevel'];
      totalAmount: number;
    }) => {
      // Мок логіка розрахунку терміновості
      const urgencyOptions = executionService.getUrgentExecutionOptions();
      const option = urgencyOptions.find((opt) => opt.value === urgencyLevel);
      const multiplier = (option?.percent || 0) / 100 + 1;
      const additionalCost = (totalAmount * (option?.percent || 0)) / 100;

      return { multiplier, additionalCost };
    },
    onError: (error) => {
      addError(`Помилка розрахунку терміновості: ${error.message}`);
    },
  });

  // 📅 Методи роботи з датами
  const setExecutionDate = useCallback(
    (date: Date) => {
      const today = new Date();
      const minDate = new Date(today);
      minDate.setDate(today.getDate() + 1); // Мінімум завтра

      if (date < minDate) {
        addError('Дата виконання не може бути раніше завтра');
        return;
      }

      const validation = executionService.validateExecutionParams({ executionDate: date });
      if (!validation.success) {
        addError(`Некоректна дата виконання: ${validation.error?.errors[0]?.message}`);
        return;
      }

      setExecutionParams({
        ...executionParams,
        executionDate: date,
      });
    },
    [executionParams, setExecutionParams, executionService, addError]
  );

  const setUrgencyLevel = useCallback(
    async (urgencyLevel: ExecutionParams['urgencyLevel']) => {
      try {
        // Розраховуємо вартість терміновості
        const currentTotal =
          orderItems?.reduce((sum: number, item: any) => sum + (item.finalPrice || 0), 0) || 0;
        const urgencyPricing = await calculateUrgencyMutation.mutateAsync({
          urgencyLevel,
          totalAmount: currentTotal,
        });

        // Розраховуємо нову дату виконання (мок логіка)
        const newDate = new Date();
        if (urgencyLevel === 'термінове_50_за_48год') {
          newDate.setDate(newDate.getDate() + 2);
        } else if (urgencyLevel === 'термінове_100_за_24год') {
          newDate.setDate(newDate.getDate() + 1);
        } else {
          newDate.setDate(newDate.getDate() + 7);
        }

        setExecutionParams({
          ...executionParams,
          urgencyLevel,
          urgencyPricing,
          executionDate: newDate,
        });

        if (urgencyLevel !== 'звичайне') {
          addWarning(
            `Встановлено термінове виконання. Додаткова вартість: ${urgencyPricing.additionalCost} грн`
          );
        }
      } catch (error) {
        addError('Не вдалося розрахувати вартість терміновості');
      }
    },
    [
      executionParams,
      setExecutionParams,
      orderItems,
      calculateUrgencyMutation,
      addError,
      addWarning,
    ]
  );

  // 🔍 Утиліти
  const getRecommendedDate = useCallback(() => {
    if (!estimatedTerms) return new Date();

    const recommended = new Date();
    recommended.setDate(recommended.getDate() + estimatedTerms.minDays);
    return recommended;
  }, [estimatedTerms]);

  const getUrgencyOptions = useCallback(() => {
    return executionService.getUrgentExecutionOptions();
  }, [executionService]);

  const getStandardDeadlineInfo = useCallback(
    (hasSkinItems: boolean = false) => {
      return executionService.getStandardDeadlineInfo(hasSkinItems);
    },
    [executionService]
  );

  // 📊 Статус та інформація
  const executionInfo = useMemo(
    () => ({
      hasEstimatedTerms: !!estimatedTerms,
      isCalculating: isCalculatingTerms || calculateUrgencyMutation.isPending,
      hasValidDate: !!executionParams?.executionDate,
      urgencyMultiplier: executionParams?.urgencyPricing?.multiplier || 1,
      additionalCost: executionParams?.urgencyPricing?.additionalCost || 0,
      estimatedDays: estimatedTerms?.minDays || 2,
    }),
    [estimatedTerms, isCalculatingTerms, calculateUrgencyMutation.isPending, executionParams]
  );

  return {
    // 📋 Дані
    executionParams,
    estimatedTerms,
    executionInfo,

    // 🔄 Стани
    isCalculatingTerms,
    termsError,

    // 📅 Методи дат
    setExecutionDate,
    setUrgencyLevel,
    getRecommendedDate,
    getUrgencyOptions,
    getStandardDeadlineInfo,
  };
};
