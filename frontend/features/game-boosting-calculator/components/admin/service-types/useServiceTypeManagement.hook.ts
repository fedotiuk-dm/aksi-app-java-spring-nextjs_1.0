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
  const setActiveMutation = useGamesSetServiceTypeActive();

  // UI state from store
  const { setServiceTypes, setGames, setLoading, setError, clearError } =
    useServiceTypeManagementStore();

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

  const serviceTypes = listServiceTypesQuery.data?.data || [];
  const games = listGamesQuery.data?.data || [];
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
      await updateServiceTypeMutation.mutateAsync({
        serviceTypeId,
        data: serviceTypeData,
      });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to update service type:', error);
      throw error;
    }
  };

  const handleDeleteServiceType = async (serviceTypeId: string) => {
    try {
      await deleteServiceTypeMutation.mutateAsync({ serviceTypeId });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to delete service type:', error);
      throw error;
    }
  };

  const handleToggleActive = async (serviceTypeId: string, active: boolean) => {
    try {
      await setActiveMutation.mutateAsync({
        serviceTypeId,
        params: { active },
      });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to toggle service type active status:', error);
      throw error;
    }
  };

  const refreshServiceTypes = () => {
    listServiceTypesQuery.refetch();
  };

  return {
    serviceTypes,
    games,
    isLoading,
    error,
    handleCreateServiceType,
    handleUpdateServiceType,
    handleDeleteServiceType,
    handleToggleActive,
    refreshServiceTypes,
  };
};
