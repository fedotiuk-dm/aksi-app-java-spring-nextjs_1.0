'use client';

/**
 * Game Modifiers Management Hook
 * Handles CRUD operations for game modifiers using Orval Game API hooks
 */

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

export const useModifiersManagement = () => {
  // Orval hooks for Game Modifiers
  const modifiersQuery = useListGameModifiers(
    undefined, // Get ALL modifiers without filters
    {
      query: {
        select: (data) => data.modifiers || [],
      },
    }
  );

  // Additional data for forms
  const gamesQuery = useGamesListGames(
    {}, // Get all games
    {
      query: {
        select: (data) => data.data || [],
      },
    }
  );

  const serviceTypesQuery = useGamesListServiceTypes(
    {}, // Get all service types
    {
      query: {
        select: (data) => data.data || [],
      },
    }
  );

  const createMutation = useCreateGameModifier();
  const updateMutation = useUpdateGameModifier();
  const deleteMutation = useDeleteGameModifier();
  const activateMutation = useActivateGameModifier();
  const deactivateMutation = useDeactivateGameModifier();

  // Handler functions
  const handleCreateModifier = async (data: CreateGameModifierRequest) => {
    await createMutation.mutateAsync({
      data,
    });
  };

  const handleUpdateModifier = async (code: string, data: UpdateGameModifierRequest) => {
    await updateMutation.mutateAsync({
      modifierId: code, // API uses code as identifier
      data,
    });
  };

  const handleDeleteModifier = async (code: string) => {
    await deleteMutation.mutateAsync({ modifierId: code }); // API uses code as identifier
  };

  const handleToggleActive = async (code: string, active: boolean) => {
    if (active) {
      await activateMutation.mutateAsync({ modifierId: code }); // API uses code as identifier
    } else {
      await deactivateMutation.mutateAsync({ modifierId: code }); // API uses code as identifier
    }
  };

  return {
    // Data
    modifiers: modifiersQuery.data || [],
    games: gamesQuery.data || [],
    serviceTypes: serviceTypesQuery.data || [],
    isLoading: modifiersQuery.isLoading || gamesQuery.isLoading || serviceTypesQuery.isLoading,
    error: modifiersQuery.error || gamesQuery.error || serviceTypesQuery.error,

    // Operations
    handleCreateModifier,
    handleUpdateModifier,
    handleDeleteModifier,
    handleToggleActive,

    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isActivating: activateMutation.isPending,
    isDeactivating: deactivateMutation.isPending,
  };
};
