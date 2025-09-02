'use client';

/**
 * Custom hook for Game Management
 * Handles all game-related API operations and state management
 */

import { useEffect } from 'react';
import {
  useGamesListGames,
  useGamesCreateGame,
  useGamesUpdateGame,
  useGamesDeleteGame,
  useGamesActivateGame,
  useGamesDeactivateGame,
  CreateGameRequestCategory,
  UpdateGameRequestCategory,
  GameCategory,
} from '@api/game';
import { useGameManagementStore } from '../../../store/game-management-store';

export const useGameManagement = () => {
  // Orval API hooks - load all games for management
  const listGamesQuery = useGamesListGames({
    page: 0,
    size: 100,
    active: undefined, // Load all games (active and inactive) for management
  });
  const createGameMutation = useGamesCreateGame();
  const updateGameMutation = useGamesUpdateGame();
  const deleteGameMutation = useGamesDeleteGame();
  const activateGameMutation = useGamesActivateGame();
  const deactivateGameMutation = useGamesDeactivateGame();

  // UI state from store
  const { setGames, setLoading, setError, clearError } = useGameManagementStore();

  // Sync API data with store
  useEffect(() => {
    if (listGamesQuery.data) {
      setGames(listGamesQuery.data.data || []);
    }
    if (listGamesQuery.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    if (listGamesQuery.error) {
      setError(String(listGamesQuery.error));
    } else {
      clearError();
    }
  }, [
    listGamesQuery.data,
    listGamesQuery.isLoading,
    listGamesQuery.error,
    setGames,
    setLoading,
    setError,
    clearError,
  ]);

  const games = listGamesQuery.data?.data || [];
  const isLoading = listGamesQuery.isLoading;
  const error = listGamesQuery.error;

  const handleCreateGame = async (gameData: {
    name: string;
    code: string;
    category: CreateGameRequestCategory;
    description?: string;
  }) => {
    try {
      await createGameMutation.mutateAsync({
        data: gameData,
      });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to create game:', error);
      throw error;
    }
  };

  const handleUpdateGame = async (
    gameId: string,
    gameData: {
      name?: string;
      category?: UpdateGameRequestCategory;
      description?: string;
      active?: boolean;
    }
  ) => {
    try {
      await updateGameMutation.mutateAsync({
        gameId,
        data: gameData,
      });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to update game:', error);
      throw error;
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    try {
      await deleteGameMutation.mutateAsync({ gameId });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to delete game:', error);
      throw error;
    }
  };

  const handleActivateGame = async (gameId: string) => {
    try {
      await activateGameMutation.mutateAsync({ gameId });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to activate game:', error);
      throw error;
    }
  };

  const handleDeactivateGame = async (gameId: string) => {
    try {
      await deactivateGameMutation.mutateAsync({ gameId });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to deactivate game:', error);
      throw error;
    }
  };

  const refreshGames = () => {
    listGamesQuery.refetch();
  };

  return {
    games,
    isLoading,
    error,
    handleCreateGame,
    handleUpdateGame,
    handleDeleteGame,
    handleActivateGame,
    handleDeactivateGame,
    refreshGames,
    // Separate category arrays for different operations
    createGameCategories: Object.values(CreateGameRequestCategory),
    updateGameCategories: Object.values(UpdateGameRequestCategory),
    allGameCategories: Object.values(GameCategory),
  };
};
