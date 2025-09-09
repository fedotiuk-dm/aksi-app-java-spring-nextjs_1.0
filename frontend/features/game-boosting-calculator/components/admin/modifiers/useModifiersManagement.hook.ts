'use client';

/**
 * Game Modifiers Management Hook
 * Handles CRUD operations for game modifiers using Orval Game API hooks
 */

import { useEffect } from 'react';
import {
  useListGameModifiers,
  useCreateGameModifier,
  useUpdateGameModifier,
  useDeleteGameModifier,
  useActivateGameModifier,
  useDeactivateGameModifier,
  useGamesListGames,
  useGamesListServiceTypes,
  CreateGameModifierRequest,
  UpdateGameModifierRequest,
} from '@api/game';
import { useGameModifiersManagementStore } from '../../../store/modifiers-management-store';

export const useModifiersManagement = () => {
  // Orval API hooks with proper parameters
  const listModifiersQuery = useListGameModifiers({
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

  const createModifierMutation = useCreateGameModifier();
  const updateModifierMutation = useUpdateGameModifier();
  const deleteModifierMutation = useDeleteGameModifier();
  const activateModifierMutation = useActivateGameModifier();
  const deactivateModifierMutation = useDeactivateGameModifier();

  // UI state from store
  const { setModifiers, setGames, setServiceTypes, setLoading, setError, clearError } =
    useGameModifiersManagementStore();

  // Sync API data with store
  useEffect(() => {
    if (listModifiersQuery.data) {
      setModifiers(listModifiersQuery.data.modifiers || []);
    }
    if (listGamesQuery.data) {
      setGames(listGamesQuery.data.data || []);
    }
    if (listServiceTypesQuery.data) {
      setServiceTypes(listServiceTypesQuery.data.data || []);
    }

    const isLoading =
      listModifiersQuery.isLoading || listGamesQuery.isLoading || listServiceTypesQuery.isLoading;

    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    const error = listModifiersQuery.error || listGamesQuery.error || listServiceTypesQuery.error;

    if (error) {
      setError(String(error));
    } else {
      clearError();
    }
  }, [
    listModifiersQuery.data,
    listModifiersQuery.isLoading,
    listModifiersQuery.error,
    listGamesQuery.data,
    listGamesQuery.isLoading,
    listGamesQuery.error,
    listServiceTypesQuery.data,
    listServiceTypesQuery.isLoading,
    listServiceTypesQuery.error,
    setModifiers,
    setGames,
    setServiceTypes,
    setLoading,
    setError,
    clearError,
  ]);

  const modifiers = listModifiersQuery.data?.modifiers || [];
  const games = listGamesQuery.data?.data || [];
  const serviceTypes = listServiceTypesQuery.data?.data || [];
  const isLoading =
    listModifiersQuery.isLoading || listGamesQuery.isLoading || listServiceTypesQuery.isLoading;
  const error = listModifiersQuery.error || listGamesQuery.error || listServiceTypesQuery.error;

  const handleCreateModifier = async (modifierData: CreateGameModifierRequest) => {
    try {
      await createModifierMutation.mutateAsync({
        data: modifierData,
      });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to create modifier:', error);
      throw error;
    }
  };

  const handleUpdateModifier = async (
    modifierId: string,
    modifierData: UpdateGameModifierRequest
  ) => {
    try {
      await updateModifierMutation.mutateAsync({
        modifierId,
        data: modifierData,
      });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to update modifier:', error);
      throw error;
    }
  };

  const handleDeleteModifier = async (modifierId: string) => {
    try {
      await deleteModifierMutation.mutateAsync({ modifierId });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to delete modifier:', error);
      throw error;
    }
  };

  const handleToggleActive = async (modifierId: string, active: boolean) => {
    try {
      if (active) {
        await activateModifierMutation.mutateAsync({ modifierId });
      } else {
        await deactivateModifierMutation.mutateAsync({ modifierId });
      }
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to toggle modifier active status:', error);
      throw error;
    }
  };

  return {
    modifiers,
    games,
    serviceTypes,
    isLoading,
    error,
    handleCreateModifier,
    handleUpdateModifier,
    handleDeleteModifier,
    handleToggleActive,
    isCreating: createModifierMutation.isPending,
    isUpdating:
      updateModifierMutation.isPending ||
      activateModifierMutation.isPending ||
      deactivateModifierMutation.isPending,
    isDeleting: deleteModifierMutation.isPending,
  };
};
