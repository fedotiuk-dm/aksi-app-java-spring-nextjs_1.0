/**
 * @fileoverview Мікро-хук для терміновості та цін
 * @module domain/wizard/hooks/stage-3/micro
 */

import { useCallback, useMemo } from 'react';
import { useWizardStore } from '../../../store';
import { UrgencyLevel, UrgencyPricing } from '../../../types';

/**
 * Мікро-хук для роботи тільки з терміновістю
 * ⚡ Single Responsibility: тільки urgency pricing
 */
export const useUrgencyPricing = () => {
  const { executionParams, setExecutionParams, orderItems } = useWizardStore();

  const currentUrgency = executionParams?.urgencyLevel || UrgencyLevel.STANDARD;

  const setUrgencyLevel = useCallback(
    (level: UrgencyLevel) => {
      const urgencyPricing = calculateUrgencyPricing(level);

      setExecutionParams({
        ...executionParams,
        urgencyLevel: level,
        urgencyPricing,
      });
    },
    [executionParams, setExecutionParams]
  );

  const calculateUrgencyPricing = useCallback(
    (level: UrgencyLevel): UrgencyPricing => {
      if (!orderItems || orderItems.length === 0) {
        return {
          urgencyLevel: level,
          multiplier: getUrgencyMultiplier(level),
          additionalCost: 0,
          affectedItems: [],
        };
      }

      const multiplier = getUrgencyMultiplier(level);
      const affectedItems = orderItems.map((item) => item.id);
      const itemsTotal = orderItems.reduce((sum, item) => sum + (item.finalPrice || 0), 0);
      const additionalCost = itemsTotal * (multiplier - 1);

      return {
        urgencyLevel: level,
        multiplier,
        additionalCost,
        affectedItems,
      };
    },
    [orderItems]
  );

  const urgencyOptions = useMemo(
    () => [
      {
        level: UrgencyLevel.STANDARD,
        label: 'Звичайне виконання',
        additionalCost: 0,
        multiplier: 1,
      },
      {
        level: UrgencyLevel.URGENT_48H,
        label: '+50% за 48 годин',
        additionalCost: calculateUrgencyPricing(UrgencyLevel.URGENT_48H).additionalCost,
        multiplier: 1.5,
      },
      {
        level: UrgencyLevel.URGENT_24H,
        label: '+100% за 24 години',
        additionalCost: calculateUrgencyPricing(UrgencyLevel.URGENT_24H).additionalCost,
        multiplier: 2,
      },
    ],
    [calculateUrgencyPricing]
  );

  return {
    currentUrgency,
    urgencyPricing: executionParams?.urgencyPricing,
    urgencyOptions,
    setUrgencyLevel,
    hasUrgencyUpcharge: currentUrgency !== UrgencyLevel.STANDARD,
  };
};

// Утиліта для multiplier
function getUrgencyMultiplier(level: UrgencyLevel): number {
  switch (level) {
    case UrgencyLevel.URGENT_48H:
      return 1.5;
    case UrgencyLevel.URGENT_24H:
      return 2;
    default:
      return 1;
  }
}
