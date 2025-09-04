'use client';

/**
 * Custom hook for Price Configuration Management
 * Handles all price configuration-related API operations and state management
 */

import { useEffect } from 'react';
import {
  useGamesListPriceConfigurations,
  useGamesCreatePriceConfiguration,
  useGamesUpdatePriceConfiguration,
  useGamesDeletePriceConfiguration,
  useGamesListGames,
  useGamesListServiceTypes,
  useGamesListDifficultyLevels,
  CreatePriceConfigurationRequest,
  UpdatePriceConfigurationRequest,
} from '@api/game';
import { usePriceConfigurationManagementStore } from '../../../store/price-configuration-management-store';

export const usePriceConfigurationManagement = () => {
  // Orval API hooks
  const listPriceConfigurationsQuery = useGamesListPriceConfigurations({
    page: 0,
    size: 100,
    active: undefined, // Get all for management
  });

  const listGamesQuery = useGamesListGames({
    page: 0,
    size: 100,
    active: true,
  });

  const listServiceTypesQuery = useGamesListServiceTypes({
    page: 0,
    size: 100,
    active: true,
  });

  const listDifficultyLevelsQuery = useGamesListDifficultyLevels({
    page: 0,
    size: 100,
    active: true,
  });

  const createPriceConfigurationMutation = useGamesCreatePriceConfiguration();
  const updatePriceConfigurationMutation = useGamesUpdatePriceConfiguration();
  const deletePriceConfigurationMutation = useGamesDeletePriceConfiguration();

  // UI state from store
  const {
    setPriceConfigurations,
    setGames,
    setServiceTypes,
    setDifficultyLevels,
    setLoading,
    setError,
    clearError,
  } = usePriceConfigurationManagementStore();

  // Sync API data with store
  useEffect(() => {
    if (listPriceConfigurationsQuery.data) {
      setPriceConfigurations(listPriceConfigurationsQuery.data.data || []);
    }
    if (listGamesQuery.data) {
      setGames(listGamesQuery.data.data || []);
    }
    if (listServiceTypesQuery.data) {
      setServiceTypes(listServiceTypesQuery.data.data || []);
    }
    if (listDifficultyLevelsQuery.data) {
      setDifficultyLevels(listDifficultyLevelsQuery.data.data || []);
    }

    const isLoading =
      listPriceConfigurationsQuery.isLoading ||
      listGamesQuery.isLoading ||
      listServiceTypesQuery.isLoading ||
      listDifficultyLevelsQuery.isLoading;

    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    const error =
      listPriceConfigurationsQuery.error ||
      listGamesQuery.error ||
      listServiceTypesQuery.error ||
      listDifficultyLevelsQuery.error;

    if (error) {
      setError(String(error));
    } else {
      clearError();
    }
  }, [
    listPriceConfigurationsQuery.data,
    listPriceConfigurationsQuery.isLoading,
    listPriceConfigurationsQuery.error,
    listGamesQuery.data,
    listGamesQuery.isLoading,
    listGamesQuery.error,
    listServiceTypesQuery.data,
    listServiceTypesQuery.isLoading,
    listServiceTypesQuery.error,
    listDifficultyLevelsQuery.data,
    listDifficultyLevelsQuery.isLoading,
    listDifficultyLevelsQuery.error,
    setPriceConfigurations,
    setGames,
    setServiceTypes,
    setDifficultyLevels,
    setLoading,
    setError,
    clearError,
  ]);

  const priceConfigurations = listPriceConfigurationsQuery.data?.data || [];
  const games = listGamesQuery.data?.data || [];
  const serviceTypes = listServiceTypesQuery.data?.data || [];
  const difficultyLevels = listDifficultyLevelsQuery.data?.data || [];
  const isLoading =
    listPriceConfigurationsQuery.isLoading ||
    listGamesQuery.isLoading ||
    listServiceTypesQuery.isLoading ||
    listDifficultyLevelsQuery.isLoading;
  const error =
    listPriceConfigurationsQuery.error ||
    listGamesQuery.error ||
    listServiceTypesQuery.error ||
    listDifficultyLevelsQuery.error;

  const handleCreatePriceConfiguration = async (
    priceConfigurationData: CreatePriceConfigurationRequest
  ) => {
    try {
      await createPriceConfigurationMutation.mutateAsync({
        data: priceConfigurationData,
      });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to create price configuration:', error);
      throw error;
    }
  };

  const handleUpdatePriceConfiguration = async (
    priceConfigurationId: string,
    priceConfigurationData: UpdatePriceConfigurationRequest
  ) => {
    try {
      await updatePriceConfigurationMutation.mutateAsync({
        configId: priceConfigurationId,
        data: priceConfigurationData,
      });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to update price configuration:', error);
      throw error;
    }
  };

  const handleDeletePriceConfiguration = async (priceConfigurationId: string) => {
    try {
      await deletePriceConfigurationMutation.mutateAsync({ configId: priceConfigurationId });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to delete price configuration:', error);
      throw error;
    }
  };

  const handleToggleActive = async (priceConfigurationId: string, active: boolean) => {
    try {
      // Note: Price configurations don't have separate active toggle endpoints
      // We'll need to update the active field through the update endpoint
      // Get current configuration to preserve other fields
      const currentConfig = priceConfigurations.find((pc) => pc.id === priceConfigurationId);
      if (currentConfig) {
        await handleUpdatePriceConfiguration(priceConfigurationId, {
          gameId: currentConfig.gameId,
          serviceTypeId: currentConfig.serviceTypeId,
          difficultyLevelId: currentConfig.difficultyLevelId,
          active: active,
        });
      }
    } catch (error) {
      console.error('Failed to toggle price configuration active status:', error);
      throw error;
    }
  };

  return {
    priceConfigurations,
    games,
    serviceTypes,
    difficultyLevels,
    isLoading,
    error,
    handleCreatePriceConfiguration,
    handleUpdatePriceConfiguration,
    handleDeletePriceConfiguration,
    handleToggleActive,
  };
};
