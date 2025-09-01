/**
 * Game Operations Hook
 * Business logic for game-related operations
 */

import { useGameBoostingStore } from '../store/game-boosting-store';
import { useListGames, useGetGameById } from '@api/game';
import type { Game } from '@api/game';

export const useGameOperations = () => {
  const { selectedGameId, setSelectedGame } = useGameBoostingStore();

  // API hooks
  const listGamesQuery = useListGames({
    page: 0,
    size: 100,
    active: true,
  });

  const selectedGameQuery = useGetGameById(selectedGameId || '', {
    query: {
      enabled: !!selectedGameId,
    },
  });

  const selectGame = (gameId: string) => {
    const game = listGamesQuery.data?.data?.find((g: Game) => g.id === gameId);
    if (game) {
      setSelectedGame(gameId, game);
    }
  };

  const clearGameSelection = () => {
    setSelectedGame(null);
  };

  return {
    // Data
    games: listGamesQuery.data?.data || [],
    selectedGame: selectedGameQuery.data,
    isLoading: listGamesQuery.isLoading || selectedGameQuery.isLoading,
    error: listGamesQuery.error || selectedGameQuery.error,

    // Actions
    selectGame,
    clearGameSelection,

    // Loading states
    isGamesLoading: listGamesQuery.isLoading,
    isSelectedGameLoading: selectedGameQuery.isLoading,
  };
};
