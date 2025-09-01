/**
 * Calculator Operations Hook
 * Business logic for price calculation operations
 */

import { useGameBoostingStore } from '../store/game-boosting-store';
import { useCalculatePrice } from '@api/game';

export const useCalculatorOperations = () => {
  const {
    selectedGameId,
    selectedBoosterId,
    basePrice,
    selectedModifiers,
    setCalculatedPrice,
    setCalculating,
  } = useGameBoostingStore();

  // API hook
  const calculateMutation = useCalculatePrice();

  const calculatePrice = async () => {
    if (!selectedGameId || !selectedBoosterId || !basePrice) {
      throw new Error('Missing required data for price calculation');
    }

    setCalculating(true);

    try {
      const result = await calculateMutation.mutateAsync({
        data: {
          gameCode: selectedGameId || 'default',
          serviceTypeCode: 'BOOSTING',
          difficultyLevelCode: 'STANDARD',
          targetLevel: 100,
          startLevel: 1,
          modifiers: selectedModifiers,
        },
      });

      setCalculatedPrice(result.finalPrice);
      return result;
    } finally {
      setCalculating(false);
    }
  };

  const resetCalculation = () => {
    setCalculatedPrice(null);
    calculateMutation.reset();
  };

  const canCalculate = !!(selectedGameId && selectedBoosterId && basePrice && basePrice > 0);

  return {
    // Data
    calculatedPrice: calculateMutation.data?.finalPrice,
    calculationDetails: calculateMutation.data,

    // State
    isCalculating: calculateMutation.isPending,
    error: calculateMutation.error,

    // Actions
    calculatePrice,
    resetCalculation,

    // Computed
    canCalculate,
    hasValidCalculation: !!calculateMutation.data?.finalPrice,
  };
};
