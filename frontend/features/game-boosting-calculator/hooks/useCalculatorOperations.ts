/**
 * Calculator Operations Hook
 * Business logic for price calculation operations
 */

import React from 'react';
import { useGameBoostingStore } from '../store/game-boosting-store';
import {
  useCalculateGamePrice,
  useGamesListGames,
  useGamesListServiceTypes,
  useGamesListDifficultyLevels,
  useListGameModifiers,
} from '@api/game';
import type { GameModifierInfo } from '@api/game';

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
    query: {
      enabled: !!gameId,
    },
  });

  return {
    serviceTypes: serviceTypesQuery.data?.data || [
      { id: '1', code: 'BOOSTING', name: 'Boosting', baseMultiplier: 100, active: true },
    ],
    isLoading: serviceTypesQuery.isLoading,
    error: serviceTypesQuery.error,
  };
};

// Hook for fetching available difficulty levels for a game
export const useAvailableDifficultyLevels = (gameId?: string) => {
  const params = gameId ? { gameId } : undefined;
  const difficultyLevelsQuery = useGamesListDifficultyLevels(params, {
    query: {
      enabled: !!gameId,
    },
  });

  return {
    difficultyLevels: difficultyLevelsQuery.data?.data || [
      { id: '1', code: 'STANDARD', name: 'Standard', levelValue: 1, active: true },
    ],
    isLoading: difficultyLevelsQuery.isLoading,
    error: difficultyLevelsQuery.error,
  };
};

export const useCalculatorOperations = () => {
  const {
    selectedGameId,
    selectedGame,
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
  const { serviceTypes, error: serviceTypesError } = useAvailableServiceTypes(
    selectedGameId || undefined
  );
  const { difficultyLevels, error: difficultyLevelsError } = useAvailableDifficultyLevels(
    selectedGameId || undefined
  );

  // Get all modifiers first (similar to admin pattern)
  const modifiersQuery = useListGameModifiers(
    {
      active: true,
      // Remove filtering parameters that cause backend errors
      // gameCode: selectedGame?.code,
      // serviceTypeCode: serviceTypeCode,
    },
    {
      query: {
        enabled: !!selectedGame?.code && !!serviceTypeCode,
        select: (data) => data?.modifiers || [],
      },
    }
  );

  // Filter modifiers on frontend based on selected game and service type
  const availableModifiers = React.useMemo(() => {
    if (!modifiersQuery.data) {
      return [];
    }

    const allModifiers = modifiersQuery.data as unknown as GameModifierInfo[];
    return allModifiers.filter((modifier: GameModifierInfo) => {
      // Filter by game code if available
      if (selectedGame?.code) {
        // Show modifiers that belong to the selected game
        const belongsToGame = modifier.gameCode === selectedGame.code;

        // Also show modifiers that are game-agnostic (empty gameCode)
        const isGameAgnostic = !modifier.gameCode || modifier.gameCode === '';

        // Filter by service type if specified
        let matchesServiceType = true;
        if (serviceTypeCode && modifier.serviceTypeCodes && modifier.serviceTypeCodes.length > 0) {
          matchesServiceType = modifier.serviceTypeCodes.includes(serviceTypeCode);
        }

        return (belongsToGame || isGameAgnostic) && matchesServiceType && modifier.active;
      }

      // If no game selected, show only active modifiers
      return modifier.active;
    });
  }, [modifiersQuery.data, selectedGame?.code, serviceTypeCode]);

  const validateCalculationData = () => {
    const errors = [];

    if (!selectedGameId) errors.push('Game must be selected');
    if (!selectedBoosterId) errors.push('Booster must be selected');
    if (!basePrice || basePrice <= 0) errors.push('Valid base price is required');

    // Dynamic validation based on calculator config
    if (
      calculatorConfig.showStartLevel &&
      (!startLevel || startLevel < calculatorConfig.levelRange.min)
    ) {
      errors.push(`Start level must be at least ${calculatorConfig.levelRange.min}`);
    }

    if (calculatorConfig.showTargetLevel && (!targetLevel || targetLevel <= startLevel)) {
      errors.push('Target level must be higher than start level');
    }

    if (calculatorConfig.showServiceType && !serviceTypeCode) {
      errors.push('Service type must be selected');
    }

    if (calculatorConfig.showDifficultyLevel && !difficultyLevelCode) {
      errors.push('Difficulty level must be selected');
    }

    return errors;
  };

  const calculatePrice = async () => {
    // Dynamic validation based on calculator config
    const validationErrors = validateCalculationData();
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    setCalculating(true);

    try {
      // Use dynamic data from API or store defaults
      const actualGameId = selectedGameId || defaultGame?.id;
      const actualGameCode = selectedGame?.code || defaultGame?.code || 'LOL';
      const actualServiceTypeCode = serviceTypeCode || serviceTypes[0]?.code || 'BOOSTING';
      const actualDifficultyLevelCode =
        difficultyLevelCode || difficultyLevels[0]?.code || 'STANDARD';

      // Create proper modifier objects with full data
      const modifierObjects = selectedModifiers
        .map((code) => {
          return availableModifiers.find((mod: GameModifierInfo) => mod.code === code);
        })
        .filter(
          (modifier): modifier is GameModifierInfo => modifier !== null && modifier !== undefined
        )
        .map((modifier) => ({
          code: modifier.code,
          name: modifier.name,
          type: modifier.type,
          operation: modifier.operation,
          value: modifier.value,
        }));

      const result = await calculateMutation.mutateAsync({
        data: {
          gameCode: actualGameCode,
          serviceTypeCode: actualServiceTypeCode,
          difficultyLevelCode: actualDifficultyLevelCode,
          targetLevel: targetLevel,
          startLevel: startLevel,
          basePrice: Math.round(basePrice * 100), // Convert to cents
          modifiers: modifierObjects, // Send full modifier objects instead of just codes
        } as any, // Type assertion to bypass strict typing
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

  // Dynamic calculator configuration based on selected game
  const getCalculatorConfig = () => {
    if (!selectedGame) {
      return {
        showStartLevel: true,
        showTargetLevel: true,
        showDifficultyLevel: true,
        showServiceType: true,
        supportedOperations: ['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE'],
        levelRange: { min: 1, max: 100 },
      };
    }

    // Dynamic configuration based on game type and available data
    return {
      showStartLevel: !!difficultyLevels.length,
      showTargetLevel: !!difficultyLevels.length,
      showDifficultyLevel: difficultyLevels.length > 1,
      showServiceType: serviceTypes.length > 1,
      supportedOperations: ['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE'],
      levelRange: { min: 1, max: 100 },
      gameCode: selectedGame.code,
      gameName: selectedGame.name,
    };
  };

  const calculatorConfig = getCalculatorConfig();

  const canCalculate = !!(
    selectedGameId &&
    selectedBoosterId &&
    basePrice &&
    basePrice > 0 &&
    serviceTypes.length > 0 &&
    difficultyLevels.length > 0 &&
    !modifiersQuery.isLoading &&
    availableModifiers.length > 0 &&
    (!calculatorConfig.showStartLevel || startLevel > 0) &&
    (!calculatorConfig.showTargetLevel || targetLevel > startLevel)
  );

  return {
    // Data
    calculatedPrice: calculateMutation.data?.finalPrice,
    calculationDetails: calculateMutation.data,

    // Dynamic data from API
    availableGames: defaultGame ? [defaultGame] : [],
    availableServiceTypes: serviceTypes,
    availableDifficultyLevels: difficultyLevels,
    availableModifiers: availableModifiers,

    // Dynamic configuration
    calculatorConfig,

    // State
    isCalculating: calculateMutation.isPending,
    isLoadingModifiers: modifiersQuery.isLoading,
    error:
      calculateMutation.error || modifiersQuery.error || serviceTypesError || difficultyLevelsError,
    modifiersError: modifiersQuery.error,

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
