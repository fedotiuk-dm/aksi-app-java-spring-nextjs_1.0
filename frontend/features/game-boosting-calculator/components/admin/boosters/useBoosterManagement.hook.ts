/**
 * Custom hook for Booster Management
 * Handles all booster-related API operations and state management
 */

import { useEffect } from 'react';
import { useListBoosters, useCreateBooster, useUpdateBooster, useDeleteBooster } from '@api/game';
import { useBoosterManagementStore } from '../../../store/booster-management-store';

export const useBoosterManagement = () => {
  // Orval API hooks
  const listBoostersQuery = useListBoosters({
    page: 0,
    size: 100,
    active: true,
  });
  const createBoosterMutation = useCreateBooster();
  const updateBoosterMutation = useUpdateBooster();
  const deleteBoosterMutation = useDeleteBooster();

  // UI state from store
  const { setBoosters, setLoading, setError, clearError } = useBoosterManagementStore();

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
        id: boosterId,
        data: boosterData,
      });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to update booster:', error);
      throw error;
    }
  };

  const handleDeleteBooster = async (boosterId: string) => {
    try {
      await deleteBoosterMutation.mutateAsync({ id: boosterId });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to delete booster:', error);
      throw error;
    }
  };

  return {
    boosters,
    isLoading,
    error,
    handleCreateBooster,
    handleUpdateBooster,
    handleDeleteBooster,
  };
};
