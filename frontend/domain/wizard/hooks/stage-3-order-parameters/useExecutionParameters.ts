/**
 * @fileoverview Хук для управління параметрами виконання замовлення
 *
 * Відповідальність:
 * - Встановлення дати завершення
 * - Вибір рівня терміновості (звичайний, 48 годин, 24 години)
 * - Автоматичний розрахунок дати завершення на основі предметів
 * - Валідація дат та стандартних термінів
 */

import { useState, useCallback, useMemo } from 'react';

import { useCalculateCompletionDate } from '@/shared/api/generated/full/aksiApi';

import type {
  ExecutionParameters,
  UrgencyLevel,
  UseExecutionParametersReturn,
  OrderItemForCalculation,
} from './types';
import type { CompletionDateCalculationRequest } from '@/shared/api/generated/full/aksiApi.schemas';

// Стандартні терміни виконання (у годинах)
const STANDARD_DELIVERY_HOURS = {
  normal: 48, // 48 годин для звичайних предметів
  leather: 336, // 14 днів для шкіряних виробів (14 * 24 = 336 годин)
};

/**
 * Хук для управління параметрами виконання замовлення
 *
 * @example
 * ```tsx
 * const {
 *   parameters,
 *   urgencyOptions,
 *   setCompletionDate,
 *   calculateCompletionDate
 * } = useExecutionParameters();
 *
 * // Встановити дату
 * setCompletionDate('2024-12-31');
 *
 * // Розрахувати автоматично
 * await calculateCompletionDate(orderItems);
 * ```
 */
export function useExecutionParameters(): UseExecutionParametersReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [parameters, setParameters] = useState<ExecutionParameters>({
    completionDate: '',
    urgencyLevel: 'normal',
  });

  const [calculationError, setCalculationError] = useState<string | null>(null);

  // =====================================
  // API запити
  // =====================================

  // Мутація для розрахунку дати завершення
  const {
    mutateAsync: calculateCompletionMutation,
    isPending: isCalculatingDate,
    error: calculationMutationError,
  } = useCalculateCompletionDate();

  // =====================================
  // Константи
  // =====================================

  const urgencyOptions = useMemo(
    () => [
      {
        value: 'normal' as UrgencyLevel,
        label: 'Звичайне виконання',
        priceImpact: 0,
      },
      {
        value: 'urgent_48h' as UrgencyLevel,
        label: 'Терміново (48 годин)',
        priceImpact: 50, // 50% надбавка
      },
      {
        value: 'urgent_24h' as UrgencyLevel,
        label: 'Дуже терміново (24 години)',
        priceImpact: 100, // 100% надбавка
      },
    ],
    []
  );

  // =====================================
  // Обробка помилок
  // =====================================

  useMemo(() => {
    if (calculationMutationError) {
      setCalculationError('Помилка розрахунку дати завершення');
    } else {
      setCalculationError(null);
    }
  }, [calculationMutationError]);

  // =====================================
  // Утилітарні функції
  // =====================================

  /**
   * Перевірити чи є предмет шкіряним виробом
   */
  const isLeatherItem = useCallback((item: OrderItemForCalculation): boolean => {
    const categoryName = item.category?.name?.toLowerCase() || '';
    const categoryCode = item.category?.code?.toLowerCase() || '';

    return (
      categoryName.includes('шкір') ||
      categoryName.includes('дублян') ||
      categoryName.includes('хутр') ||
      categoryCode.includes('leather') ||
      categoryCode.includes('fur')
    );
  }, []);

  /**
   * Розрахувати мінімальну дату завершення на основі предметів
   */
  const calculateMinimumCompletionDate = useCallback(
    (items: OrderItemForCalculation[]): Date => {
      const now = new Date();
      let maxHours = STANDARD_DELIVERY_HOURS.normal;

      // Знайти найдовший термін серед всіх предметів
      for (const item of items) {
        if (isLeatherItem(item)) {
          maxHours = Math.max(maxHours, STANDARD_DELIVERY_HOURS.leather);
        }
      }

      // Застосувати терміновість
      if (parameters.urgencyLevel === 'urgent_48h') {
        maxHours = 48;
      } else if (parameters.urgencyLevel === 'urgent_24h') {
        maxHours = 24;
      }

      return new Date(now.getTime() + maxHours * 60 * 60 * 1000);
    },
    [isLeatherItem, parameters.urgencyLevel]
  );

  /**
   * Валідувати вибрану дату
   */
  const validateCompletionDate = useCallback(
    (date: string, items: OrderItemForCalculation[]): string | null => {
      if (!date) {
        return "Дата завершення обов'язкова";
      }

      const selectedDate = new Date(date);
      const now = new Date();

      if (selectedDate <= now) {
        return 'Дата завершення повинна бути в майбутньому';
      }

      const minimumDate = calculateMinimumCompletionDate(items);
      if (selectedDate < minimumDate) {
        const isLeatherOrder = items.some(isLeatherItem);
        const standardTerm = isLeatherOrder ? '14 днів' : '48 годин';
        return `Мінімальний термін виконання: ${standardTerm}`;
      }

      return null;
    },
    [calculateMinimumCompletionDate, isLeatherItem]
  );

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Встановити дату завершення
   */
  const setCompletionDate = useCallback((date: string) => {
    setParameters((prev) => ({ ...prev, completionDate: date }));
    setCalculationError(null);
  }, []);

  /**
   * Встановити рівень терміновості
   */
  const setUrgencyLevel = useCallback((level: UrgencyLevel) => {
    setParameters((prevParams) => ({ ...prevParams, urgencyLevel: level }));
    setCalculationError(null);
  }, []);

  /**
   * Розрахувати автоматичну дату завершення
   */
  const calculateCompletionDate = useCallback(
    async (items: OrderItemForCalculation[]) => {
      if (!items || items.length === 0) {
        setCalculationError('Немає предметів для розрахунку дати');
        return;
      }

      try {
        setCalculationError(null);

        // Локальний розрахунок як основний підхід
        const calculatedDate = calculateMinimumCompletionDate(items);
        const dateString = calculatedDate.toISOString().split('T')[0]; // YYYY-MM-DD

        setParameters((prev) => ({
          ...prev,
          completionDate: dateString,
          autoCalculatedDate: dateString,
        }));

        // Спробувати API як додатковий шлях (якщо доступний)
        try {
          const serviceCategoryIds = items.map(
            (item) => item.category?.id || item.category?.code || 'default'
          );

          let expediteType: 'STANDARD' | 'EXPRESS_48H' | 'EXPRESS_24H' = 'STANDARD';
          if (parameters.urgencyLevel === 'urgent_48h') {
            expediteType = 'EXPRESS_48H';
          } else if (parameters.urgencyLevel === 'urgent_24h') {
            expediteType = 'EXPRESS_24H';
          }

          const request: CompletionDateCalculationRequest = {
            serviceCategoryIds,
            expediteType,
          };

          const response = await calculateCompletionMutation({ data: request });

          if (response && typeof response === 'object' && 'completionDate' in response) {
            const apiDate = (response as { completionDate: string }).completionDate;
            if (apiDate) {
              setParameters((prev) => ({
                ...prev,
                completionDate: apiDate,
                autoCalculatedDate: apiDate,
              }));
            }
          }
        } catch (apiError) {
          console.warn(
            'API розрахунок недоступний, використовуємо локальний розрахунок:',
            apiError
          );
        }
      } catch (error) {
        console.error('Помилка розрахунку дати завершення:', error);
        setCalculationError('Не вдалося розрахувати дату завершення');
      }
    },
    [calculateCompletionMutation, parameters.urgencyLevel, calculateMinimumCompletionDate]
  );

  /**
   * Валідувати поточні параметри
   */
  const validateParameters = useCallback(
    (items: OrderItemForCalculation[] = []): boolean => {
      const dateError = validateCompletionDate(parameters.completionDate, items);
      if (dateError) {
        setCalculationError(dateError);
        return false;
      }
      return true;
    },
    [parameters.completionDate, validateCompletionDate]
  );

  /**
   * Очистити всі параметри
   */
  const clearParameters = useCallback(() => {
    setParameters({
      completionDate: '',
      urgencyLevel: 'normal',
    });
    setCalculationError(null);
  }, []);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    parameters,
    urgencyOptions,
    isCalculatingDate,
    calculationError,

    // Дії
    setCompletionDate,
    setUrgencyLevel,
    calculateCompletionDate,
    validateParameters,
    clearParameters,
  };
}
