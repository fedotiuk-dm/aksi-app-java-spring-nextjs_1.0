/**
 * Game Calculator Operations Hook
 * Universal calculator using Orval API hooks
 */

import { useGameBoostingStore } from '@game-boosting-calculator/store';
import {
  useCalculateWithFormula,
  useGamesListGames,
  useGamesListServiceTypes,
  useGamesListDifficultyLevels,
  useListGameModifiers,
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

// Hook for fetching available modifiers
export const useAvailableModifiers = (gameCode?: string, serviceTypeCode?: string) => {
  const modifiersQuery = useListGameModifiers(
    {
      active: true,
      gameCode: gameCode || undefined, // Pass gameCode to let backend filter properly
      serviceTypeCode,
    },
    {
      query: {
        enabled: true,
      },
    }
  );

  return {
    modifiers: modifiersQuery.data?.modifiers || [],
    isLoading: modifiersQuery.isLoading,
    error: modifiersQuery.error,
  };
};

// Main calculator operations hook
export const useGameCalculatorOperations = () => {
  const {
    selectedGame,
    selectedGameId,
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
  const calculateMutation = useCalculateWithFormula();
  const { games: availableGames, defaultGame } = useAvailableGames();
  const { serviceTypes } = useAvailableServiceTypes(selectedGameId || undefined);
  const { difficultyLevels } = useAvailableDifficultyLevels(selectedGameId || undefined);
  const { modifiers: availableModifiers } = useAvailableModifiers(
    selectedGame?.code,
    serviceTypeCode
  );

  // Validate calculation data
  const validateCalculationData = () => {
    const errors = [];

    if (!selectedGameId) errors.push('Game must be selected');
    if (!basePrice || basePrice <= 0) errors.push('Valid base price is required');
    if (!serviceTypeCode?.trim()) errors.push('Service type must be selected');
    if (!difficultyLevelCode?.trim()) errors.push('Difficulty level must be selected');

    return errors;
  };

  // Calculate price using universal calculator
  const calculatePrice = async () => {
    const validationErrors = validateCalculationData();
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    setCalculating(true);

    try {
      // Create UniversalCalculationRequest structure
      const requestData = {
        // formula is optional for universal calculator - let backend create it
        context: {
          gameCode: selectedGame?.code || defaultGame?.code || 'LOL',
          serviceTypeCode: serviceTypeCode,
          difficultyLevelCode: difficultyLevelCode,
          startLevel: startLevel,
          targetLevel: targetLevel,
          modifiers: selectedModifiers,
          additionalParameters: {
            basePrice: Math.round(basePrice * 100),
            levelDiff: (targetLevel || 0) - (startLevel || 0),
          },
        },
      };

      const result = await calculateMutation.mutateAsync({
        formulaType: 'UNIVERSAL',
        data: requestData,
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

  // Get calculator configuration
  const getCalculatorConfig = () => {
    if (!selectedGame) {
      return {
        showStartLevel: true,
        showTargetLevel: true,
        showDifficultyLevel: true,
        showServiceType: true,
        levelRange: { min: 1, max: 100 },
      };
    }

    return {
      showStartLevel: difficultyLevels.length > 0,
      showTargetLevel: difficultyLevels.length > 0,
      showDifficultyLevel: difficultyLevels.length > 1,
      showServiceType: serviceTypes.length > 1,
      levelRange: { min: 1, max: 100 },
    };
  };

  const calculatorConfig = getCalculatorConfig();

  const canCalculate = !!(
    (selectedGameId || selectedGame) &&
    basePrice > 0 &&
    serviceTypeCode?.trim() &&
    difficultyLevelCode?.trim() &&
    (!calculatorConfig.showStartLevel || startLevel > 0) &&
    (!calculatorConfig.showTargetLevel || (targetLevel > 0 && targetLevel > startLevel))
  );

  return {
    // Data
    calculatedPrice: calculateMutation.data?.finalPrice,
    calculationDetails: calculateMutation.data,

    // Available options from API
    availableGames,
    availableServiceTypes: serviceTypes,
    availableDifficultyLevels: difficultyLevels,
    availableModifiers,

    // Configuration
    calculatorConfig,

    // State
    isCalculating: calculateMutation.isPending,
    isLoadingModifiers: availableModifiers.length === 0,
    error: calculateMutation.error,

    // Actions
    calculatePrice,
    resetCalculation,
    validateCalculationData,

    // Computed
    canCalculate,
    hasValidCalculation: !!calculateMutation.data?.finalPrice,
    validationErrors: validateCalculationData(),
  };
};
