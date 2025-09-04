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
import { useQueryClient } from '@tanstack/react-query';

export const useModifiersManagement = () => {
  const queryClient = useQueryClient();

  // Orval hooks for Game Modifiers
  const modifiersQuery = useListGameModifiers(
    undefined, // Get ALL modifiers without filters
    {
      query: {
        select: (data) => {
          console.log('🔍 Raw modifiers data:', data);
          const modifiers = data?.modifiers || [];
          console.log('🔍 Processed modifiers:', modifiers);
          return modifiers;
        },
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

  // Mutations with cache invalidation
  const createMutation = useCreateGameModifier({
    mutation: {
      onSuccess: () => {
        // Invalidate all modifier-related queries
        queryClient.invalidateQueries({ queryKey: ['listGameModifiers'] });
        queryClient.invalidateQueries({ queryKey: ['getGameModifier'] });
        console.log('✅ Modifier created successfully, cache invalidated');
      },
      onError: (error) => {
        console.error('❌ Failed to create modifier:', error);
      },
    },
  });

  const updateMutation = useUpdateGameModifier({
    mutation: {
      onSuccess: () => {
        // Invalidate all modifier-related queries
        queryClient.invalidateQueries({ queryKey: ['listGameModifiers'] });
        queryClient.invalidateQueries({ queryKey: ['getGameModifier'] });
        console.log('✅ Modifier updated successfully, cache invalidated');
      },
      onError: (error) => {
        console.error('❌ Failed to update modifier:', error);
      },
    },
  });

  const deleteMutation = useDeleteGameModifier({
    mutation: {
      onSuccess: () => {
        // Invalidate all modifier-related queries
        queryClient.invalidateQueries({ queryKey: ['listGameModifiers'] });
        queryClient.invalidateQueries({ queryKey: ['getGameModifier'] });
        console.log('✅ Modifier deleted successfully, cache invalidated');
      },
      onError: (error) => {
        console.error('❌ Failed to delete modifier:', error);
      },
    },
  });

  const activateMutation = useActivateGameModifier({
    mutation: {
      onSuccess: () => {
        // Invalidate all modifier-related queries
        queryClient.invalidateQueries({ queryKey: ['listGameModifiers'] });
        queryClient.invalidateQueries({ queryKey: ['getGameModifier'] });
        console.log('✅ Modifier activated successfully, cache invalidated');
      },
      onError: (error) => {
        console.error('❌ Failed to activate modifier:', error);
      },
    },
  });

  const deactivateMutation = useDeactivateGameModifier({
    mutation: {
      onSuccess: () => {
        // Invalidate all modifier-related queries
        queryClient.invalidateQueries({ queryKey: ['listGameModifiers'] });
        queryClient.invalidateQueries({ queryKey: ['getGameModifier'] });
        console.log('✅ Modifier deactivated successfully, cache invalidated');
      },
      onError: (error) => {
        console.error('❌ Failed to deactivate modifier:', error);
      },
    },
  });

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
