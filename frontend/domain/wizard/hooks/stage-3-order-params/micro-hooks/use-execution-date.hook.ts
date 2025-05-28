/**
 * @fileoverview Мікро-хук для дати виконання
 * @module domain/wizard/hooks/stage-3/micro
 */

import { useCallback } from 'react';

import { ExecutionParamsService } from '../../../services/stage-3-order-params';
import { useWizardStore } from '../../../store';

/**
 * Мікро-хук для роботи тільки з датою виконання
 * 📅 Single Responsibility: тільки дата
 */
export const useExecutionDate = () => {
  const { executionParams, setExecutionParams, addError } = useWizardStore();
  const executionService = new ExecutionParamsService();

  const setExecutionDate = useCallback(
    (date: Date) => {
      const today = new Date();
      const minDate = new Date(today);
      minDate.setDate(today.getDate() + 1);

      if (date < minDate) {
        addError('Дата виконання не може бути раніше завтра');
        return false;
      }

      const validation = executionService.validateExecutionParams({ executionDate: date });
      if (!validation.success) {
        addError(`Некоректна дата виконання: ${validation.error?.errors[0]?.message}`);
        return false;
      }

      setExecutionParams({
        ...executionParams,
        executionDate: date,
      });
      return true;
    },
    [executionParams, setExecutionParams, executionService, addError]
  );

  const getMinDate = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }, []);

  return {
    executionDate: executionParams?.executionDate,
    setExecutionDate,
    getMinDate,
    hasValidDate: !!executionParams?.executionDate,
  };
};
