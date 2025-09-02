'use client';

/**
 * Custom hook for Difficulty Level Management
 * Handles all difficulty level-related API operations and state management
 */

import { useEffect } from 'react';
import {
  useGamesListDifficultyLevels,
  useGamesCreateDifficultyLevel,
  useGamesUpdateDifficultyLevel,
  useGamesDeleteDifficultyLevel,
  useGamesActivateDifficultyLevel,
  useGamesDeactivateDifficultyLevel,
  useGamesListGames,
  CreateDifficultyLevelRequest,
  UpdateDifficultyLevelRequest,
} from '@api/game';
import { useDifficultyLevelManagementStore } from '@game-boosting-calculator/store';

export const useDifficultyLevelManagement = () => {
  // Orval API hooks
  const listDifficultyLevelsQuery = useGamesListDifficultyLevels({
    page: 0,
    size: 100,
    active: undefined, // Get all for management
  });

  const listGamesQuery = useGamesListGames({
    page: 0,
    size: 100,
    active: true,
  });

  const createDifficultyLevelMutation = useGamesCreateDifficultyLevel();
  const updateDifficultyLevelMutation = useGamesUpdateDifficultyLevel();
  const deleteDifficultyLevelMutation = useGamesDeleteDifficultyLevel();
  const activateMutation = useGamesActivateDifficultyLevel();
  const deactivateMutation = useGamesDeactivateDifficultyLevel();

  // UI state from store
  const { setDifficultyLevels, setGames, setLoading, setError, clearError } =
    useDifficultyLevelManagementStore();

  // Sync API data with store
  useEffect(() => {
    if (listDifficultyLevelsQuery.data) {
      setDifficultyLevels(listDifficultyLevelsQuery.data.data || []);
    }
    if (listGamesQuery.data) {
      setGames(listGamesQuery.data.data || []);
    }
    if (listDifficultyLevelsQuery.isLoading || listGamesQuery.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    if (listDifficultyLevelsQuery.error || listGamesQuery.error) {
      setError(String(listDifficultyLevelsQuery.error || listGamesQuery.error));
    } else {
      clearError();
    }
  }, [
    listDifficultyLevelsQuery.data,
    listDifficultyLevelsQuery.isLoading,
    listDifficultyLevelsQuery.error,
    listGamesQuery.data,
    listGamesQuery.isLoading,
    listGamesQuery.error,
    setDifficultyLevels,
    setGames,
    setLoading,
    setError,
    clearError,
  ]);

  const difficultyLevels = listDifficultyLevelsQuery.data?.data || [];
  const games = listGamesQuery.data?.data || [];
  const isLoading = listDifficultyLevelsQuery.isLoading || listGamesQuery.isLoading;
  const error = listDifficultyLevelsQuery.error || listGamesQuery.error;

  const handleCreateDifficultyLevel = async (difficultyLevelData: CreateDifficultyLevelRequest) => {
    try {
      await createDifficultyLevelMutation.mutateAsync({
        data: difficultyLevelData,
      });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to create difficulty level:', error);
      throw error;
    }
  };

  const handleUpdateDifficultyLevel = async (
    difficultyLevelId: string,
    difficultyLevelData: UpdateDifficultyLevelRequest
  ) => {
    try {
      await updateDifficultyLevelMutation.mutateAsync({
        difficultyLevelId,
        data: difficultyLevelData,
      });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to update difficulty level:', error);
      throw error;
    }
  };

  const handleDeleteDifficultyLevel = async (difficultyLevelId: string) => {
    try {
      await deleteDifficultyLevelMutation.mutateAsync({ difficultyLevelId });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to delete difficulty level:', error);
      throw error;
    }
  };

  const handleToggleActive = async (difficultyLevelId: string, active: boolean) => {
    try {
      if (active) {
        await activateMutation.mutateAsync({ difficultyLevelId });
      } else {
        await deactivateMutation.mutateAsync({ difficultyLevelId });
      }
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to toggle difficulty level active status:', error);
      throw error;
    }
  };

  const refreshDifficultyLevels = () => {
    listDifficultyLevelsQuery.refetch();
  };

  return {
    difficultyLevels,
    games,
    isLoading,
    error,
    handleCreateDifficultyLevel,
    handleUpdateDifficultyLevel,
    handleDeleteDifficultyLevel,
    handleToggleActive,
    refreshDifficultyLevels,
  };
};
