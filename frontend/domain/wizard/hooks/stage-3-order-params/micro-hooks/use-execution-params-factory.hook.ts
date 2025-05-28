/**
 * @fileoverview Factory для композиції execution params мікро-хуків
 * @module domain/wizard/hooks/stage-3/micro
 */

import { useMemo } from 'react';
import { useExecutionDate } from './use-execution-date.hook';
import { useUrgencyPricing } from './use-urgency-pricing.hook';

/**
 * Factory хук який композує мікро-хуки execution params
 * 🏭 Композиція замість великого моноліту
 */
export const useExecutionParamsFactory = () => {
  // 📅 Дата виконання
  const dateHook = useExecutionDate();

  // ⚡ Терміновість і ціни
  const urgencyHook = useUrgencyPricing();

  // 🎯 Композиція в єдиний інтерфейс
  const composedInterface = useMemo(
    () => ({
      // Дата
      executionDate: dateHook.executionDate,
      setExecutionDate: dateHook.setExecutionDate,
      getMinDate: dateHook.getMinDate,
      hasValidDate: dateHook.hasValidDate,

      // Терміновість
      urgencyLevel: urgencyHook.currentUrgency,
      urgencyPricing: urgencyHook.urgencyPricing,
      urgencyOptions: urgencyHook.urgencyOptions,
      setUrgencyLevel: urgencyHook.setUrgencyLevel,
      hasUrgencyUpcharge: urgencyHook.hasUrgencyUpcharge,

      // Валідація
      isValid: dateHook.hasValidDate,

      // Статистика
      totalAdditionalCost: urgencyHook.urgencyPricing?.additionalCost || 0,
    }),
    [dateHook, urgencyHook]
  );

  return composedInterface;
};

/**
 * Тип для TypeScript автокомпліту
 */
export type ExecutionParamsInterface = ReturnType<typeof useExecutionParamsFactory>;
