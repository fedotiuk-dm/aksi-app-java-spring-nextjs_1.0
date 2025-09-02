/**
 * Booster Operations Hook
 * Business logic for booster-related operations
 */

import { useGameBoostingStore } from '../store/game-boosting-store';
import { useGamesListBoosters, useGamesGetBoosterById } from '@api/game';
import type { Booster } from '@api/game';

export const useBoosterOperations = () => {
  const { selectedBoosterId, setSelectedBooster } = useGameBoostingStore();

  // API hooks - only fetch when game is selected
  const listBoostersQuery = useGamesListBoosters(
    {
      page: 0,
      size: 100,
      active: true,
    },
    {
      query: {
        enabled: true,
      },
    }
  );

  const selectedBoosterQuery = useGamesGetBoosterById(selectedBoosterId || '', {
    query: {
      enabled: !!selectedBoosterId,
    },
  });

  const selectBooster = (boosterId: string) => {
    const booster = listBoostersQuery.data?.data?.find((b: Booster) => b.id === boosterId);
    if (booster) {
      setSelectedBooster(boosterId, booster);
    }
  };

  const clearBoosterSelection = () => {
    setSelectedBooster(null);
  };

  return {
    // Data
    boosters: listBoostersQuery.data?.data || [],
    selectedBooster: selectedBoosterQuery.data,
    isLoading: listBoostersQuery.isLoading || selectedBoosterQuery.isLoading,
    error: listBoostersQuery.error || selectedBoosterQuery.error,

    // Actions
    selectBooster,
    clearBoosterSelection,

    // Loading states
    isBoostersLoading: listBoostersQuery.isLoading,
    isSelectedBoosterLoading: selectedBoosterQuery.isLoading,

    // Computed
    hasAvailableBoosters: (listBoostersQuery.data?.data?.length || 0) > 0,
  };
};
