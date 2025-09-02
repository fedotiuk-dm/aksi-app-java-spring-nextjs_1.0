'use client';

/**
 * Custom hook for Booster Management
 * Handles all booster-related API operations and state management
 */

import { useEffect } from 'react';
import {
  useGamesListBoosters,
  useGamesCreateBooster,
  useGamesUpdateBooster,
  useGamesDeleteBooster,
} from '@api/game';
import { useBoosterManagementStore } from '@game-boosting-calculator/store';

export const useBoosterManagement = () => {
  // UI state from store - single import
  const { statusFilter, setStatusFilter, setBoosters, setLoading, setError, clearError } =
    useBoosterManagementStore();

  // Orval API hooks - get all boosters for management
  const listBoostersQuery = useGamesListBoosters({
    page: 0,
    size: 100,
    active: undefined, // Get all boosters (active and inactive)
  });
  const createBoosterMutation = useGamesCreateBooster();
  const updateBoosterMutation = useGamesUpdateBooster();
  const deleteBoosterMutation = useGamesDeleteBooster();

  // Sync API data with store
  useEffect(() => {
    if (listBoostersQuery.data) {
      setBoosters(listBoostersQuery.data.data || []);
    }
    if (listBoostersQuery.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    if (listBoostersQuery.error) {
      setError(String(listBoostersQuery.error));
    } else {
      clearError();
    }
  }, [
    listBoostersQuery.data,
    listBoostersQuery.isLoading,
    listBoostersQuery.error,
    setBoosters,
    setLoading,
    setError,
    clearError,
  ]);

  const boosters = listBoostersQuery.data?.data || [];
  const isLoading = listBoostersQuery.isLoading;
  const error = listBoostersQuery.error;

  const handleCreateBooster = async (boosterData: {
    discordUsername: string;
    displayName: string;
    contactEmail: string;
    phoneNumber?: string;
  }) => {
    try {
      await createBoosterMutation.mutateAsync({
        data: boosterData,
      });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to create booster:', error);
      throw error;
    }
  };

  const handleUpdateBooster = async (
    boosterId: string,
    boosterData: {
      discordUsername?: string;
      displayName?: string;
      contactEmail?: string;
      phoneNumber?: string;
      active?: boolean;
    }
  ) => {
    try {
      await updateBoosterMutation.mutateAsync({
        boosterId,
        data: boosterData,
      });
      // Manually refresh the list after update (especially for status changes)
      setTimeout(() => {
        listBoostersQuery.refetch();
      }, 100);
    } catch (error) {
      console.error('Failed to update booster:', error);
      throw error;
    }
  };

  const handleDeleteBooster = async (boosterId: string) => {
    try {
      await deleteBoosterMutation.mutateAsync({ boosterId });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to delete booster:', error);
      throw error;
    }
  };

  const refreshBoosters = () => {
    listBoostersQuery.refetch();
  };

  return {
    boosters,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    handleCreateBooster,
    handleUpdateBooster,
    handleDeleteBooster,
    refreshBoosters,
  };
};
