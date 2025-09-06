'use client';

/**
 * Custom hook for Service Type Management
 * Handles all service type-related API operations and state management
 */

import { useEffect } from 'react';
import {
  useGamesListServiceTypes,
  useGamesCreateServiceType,
  useGamesUpdateServiceType,
  useGamesDeleteServiceType,
  useGamesSetServiceTypeActive,
  useGamesForceDeleteServiceType,
  useGamesListGames,
  CreateServiceTypeRequest,
  UpdateServiceTypeRequest,
} from '@api/game';
import { useServiceTypeManagementStore } from '../../../store/service-type-management-store';

export const useServiceTypeManagement = () => {
  // Orval API hooks
  const listServiceTypesQuery = useGamesListServiceTypes({
    page: 0,
    size: 100,
    active: undefined, // Get all for management
  });

  const listGamesQuery = useGamesListGames({
    page: 0,
    size: 100,
    active: true,
  });

  const createServiceTypeMutation = useGamesCreateServiceType();
  const updateServiceTypeMutation = useGamesUpdateServiceType();
  const deleteServiceTypeMutation = useGamesDeleteServiceType();
  const forceDeleteServiceTypeMutation = useGamesForceDeleteServiceType();
  const setActiveMutation = useGamesSetServiceTypeActive();

  // UI state from store
  const {
    serviceTypes: storeServiceTypes,
    games: storeGames,
    setServiceTypes,
    setGames,
    setLoading,
    setError,
    clearError,
    updateServiceType,
    removeServiceType,
  } = useServiceTypeManagementStore();

  // Sync API data with store
  useEffect(() => {
    if (listServiceTypesQuery.data) {
      setServiceTypes(listServiceTypesQuery.data.data || []);
    }
    if (listGamesQuery.data) {
      setGames(listGamesQuery.data.data || []);
    }
    if (listServiceTypesQuery.isLoading || listGamesQuery.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    if (listServiceTypesQuery.error || listGamesQuery.error) {
      setError(String(listServiceTypesQuery.error || listGamesQuery.error));
    } else {
      clearError();
    }
  }, [
    listServiceTypesQuery.data,
    listServiceTypesQuery.isLoading,
    listServiceTypesQuery.error,
    listGamesQuery.data,
    listGamesQuery.isLoading,
    listGamesQuery.error,
    setServiceTypes,
    setGames,
    setLoading,
    setError,
    clearError,
  ]);

  // Fallback to React Query data if store is empty (initial load)
  const finalServiceTypes =
    storeServiceTypes.length > 0 ? storeServiceTypes : listServiceTypesQuery.data?.data || [];
  const finalGames = storeGames.length > 0 ? storeGames : listGamesQuery.data?.data || [];

  // Use final data with store priority for immediate updates
  const serviceTypes = finalServiceTypes;
  const games = finalGames;
  const isLoading = listServiceTypesQuery.isLoading || listGamesQuery.isLoading;
  const error = listServiceTypesQuery.error || listGamesQuery.error;

  const handleCreateServiceType = async (serviceTypeData: CreateServiceTypeRequest) => {
    try {
      await createServiceTypeMutation.mutateAsync({
        data: serviceTypeData,
      });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to create service type:', error);
      throw error;
    }
  };

  const handleUpdateServiceType = async (
    serviceTypeId: string,
    serviceTypeData: UpdateServiceTypeRequest
  ) => {
    try {
      const result = await updateServiceTypeMutation.mutateAsync({
        serviceTypeId,
        data: serviceTypeData,
      });

      // Immediately update the store with the updated service type
      updateServiceType(result);
    } catch (error) {
      console.error('Failed to update service type:', error);
      throw error;
    }
  };

  const handleDeleteServiceType = async (serviceTypeId: string) => {
    try {
      // For soft delete, we need to get the updated service type
      // Since the API returns void, we'll need to refresh the data
      await deleteServiceTypeMutation.mutateAsync({ serviceTypeId });

      // Trigger a refresh to get updated data
      listServiceTypesQuery.refetch();
    } catch (error) {
      console.error('Failed to delete service type:', error);
      throw error;
    }
  };

  const handleForceDeleteServiceType = async (serviceTypeId: string) => {
    try {
      await forceDeleteServiceTypeMutation.mutateAsync({ serviceTypeId });

      // Immediately remove the service type from the store
      removeServiceType(serviceTypeId);
    } catch (error) {
      console.error('Failed to force delete service type:', error);
      throw error;
    }
  };

  const handleToggleActive = async (serviceTypeId: string, active: boolean) => {
    try {
      const result = await setActiveMutation.mutateAsync({
        serviceTypeId,
        params: { active },
      });

      // Immediately update the store with the new service type
      updateServiceType(result);
    } catch (error) {
      console.error('Failed to toggle service type active status:', error);
      throw error;
    }
  };

  const refreshServiceTypes = () => {
    listServiceTypesQuery.refetch();
  };

  return {
    serviceTypes, // Use final data with store priority for immediate updates
    games,
    isLoading,
    error,
    handleCreateServiceType,
    handleUpdateServiceType,
    handleDeleteServiceType,
    handleForceDeleteServiceType,
    handleToggleActive,
    refreshServiceTypes,
  };
};
