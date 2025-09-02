/**
 * Calculator Operations Hook
 * Business logic for price calculation operations
 */

import { useGameBoostingStore } from '../store/game-boosting-store';
import {
  useCalculateGamePrice,
  useGamesListGames,
  useGamesListServiceTypes,
  useGamesListDifficultyLevels,
} from '@api/game';

// Hook for fetching available games
export const useAvailableGames = () => {
  const gamesQuery = useGamesListGames(undefined, {
    query: { enabled: true },
  });

  return {
    games: gamesQuery.data?.data || [],
    isLoading: gamesQuery.isLoading,
    error: gamesQuery.error,
    // Get first available game as default
    defaultGame: gamesQuery.data?.data?.[0],
  };
};

// Hook for fetching available service types for a game
export const useAvailableServiceTypes = (gameId?: string) => {
  const params = gameId ? { gameId } : undefined;
  const serviceTypesQuery = useGamesListServiceTypes(params, {
    query: { enabled: !!gameId },
  });

  return {
    serviceTypes: serviceTypesQuery.data?.data || [],
    isLoading: serviceTypesQuery.isLoading,
    error: serviceTypesQuery.error,
  };
};

// Hook for fetching available difficulty levels for a game
export const useAvailableDifficultyLevels = (gameId?: string) => {
  const params = gameId ? { gameId } : undefined;
  const difficultyLevelsQuery = useGamesListDifficultyLevels(params, {
    query: { enabled: !!gameId },
  });

  return {
    difficultyLevels: difficultyLevelsQuery.data?.data || [],
    isLoading: difficultyLevelsQuery.isLoading,
    error: difficultyLevelsQuery.error,
  };
};

export const useCalculatorOperations = () => {
  const {
    selectedGameId,
    selectedBoosterId,
    basePrice,
    selectedModifiers,
    startLevel,
    targetLevel,
    serviceTypeCode,
    difficultyLevelCode,
    setCalculatedPrice,
    setCalculating,
  } = useGameBoostingStore();

  // API hooks
  const calculateMutation = useCalculateGamePrice();
  const { defaultGame } = useAvailableGames();
  const { serviceTypes } = useAvailableServiceTypes(selectedGameId || undefined);
  const { difficultyLevels } = useAvailableDifficultyLevels(selectedGameId || undefined);

  const calculatePrice = async () => {
    if (!selectedGameId || !selectedBoosterId || !basePrice) {
      throw new Error('Missing required data for price calculation');
    }

    setCalculating(true);

    try {
      // Use dynamic data from API or store defaults
      const actualGameCode = selectedGameId || defaultGame?.code || 'LOL';
      const actualServiceTypeCode = serviceTypeCode || serviceTypes[0]?.code || 'BOOSTING';
      const actualDifficultyLevelCode =
        difficultyLevelCode || difficultyLevels[0]?.code || 'STANDARD';

      const result = await calculateMutation.mutateAsync({
        data: {
          gameCode: actualGameCode,
          serviceTypeCode: actualServiceTypeCode,
          difficultyLevelCode: actualDifficultyLevelCode,
          targetLevel: targetLevel,
          startLevel: startLevel,
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

    // Dynamic data from API
    availableGames: defaultGame ? [defaultGame] : [],
    availableServiceTypes: serviceTypes,
    availableDifficultyLevels: difficultyLevels,

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
