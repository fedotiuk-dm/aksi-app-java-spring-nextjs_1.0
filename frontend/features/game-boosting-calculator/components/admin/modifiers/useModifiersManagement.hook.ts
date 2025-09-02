'use client';

/**
 * Custom hook for Modifiers Management
 * Handles all modifier-related API operations and state management
 */

import { useEffect } from 'react';
import {
  useListPriceModifiers,
  useCreatePriceModifier,
  useUpdatePriceModifier,
  useDeletePriceModifier,
  PriceModifier,
} from '@api/pricing';
import { useModifiersManagementStore } from '../../../store/modifiers-management-store';

export const useModifiersManagement = () => {
  // Orval API hooks
  const listModifiersQuery = useListPriceModifiers(
    { active: undefined }, // Get all for management
    {
      query: {
        select: (data) => data.data || [],
      },
    }
  );

  const createModifierMutation = useCreatePriceModifier();
  const updateModifierMutation = useUpdatePriceModifier();
  const deleteModifierMutation = useDeletePriceModifier();

  // UI state from store
  const { setModifiers, setLoading, setError, clearError } = useModifiersManagementStore();

  // Sync API data with store
  useEffect(() => {
    if (listModifiersQuery.data) {
      setModifiers(listModifiersQuery.data);
    }
    if (listModifiersQuery.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    if (listModifiersQuery.error) {
      setError(String(listModifiersQuery.error));
    } else {
      clearError();
    }
  }, [
    listModifiersQuery.data,
    listModifiersQuery.isLoading,
    listModifiersQuery.error,
    setModifiers,
    setLoading,
    setError,
    clearError,
  ]);

  const modifiers = listModifiersQuery.data || [];
  const isLoading = listModifiersQuery.isLoading;
  const error = listModifiersQuery.error;

  const handleCreateModifier = async (
    modifierData: Omit<PriceModifier, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
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
    modifierCode: string,
    modifierData: Partial<Omit<PriceModifier, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    try {
      await updateModifierMutation.mutateAsync({
        code: modifierCode,
        data: modifierData,
      });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to update modifier:', error);
      throw error;
    }
  };

  const handleDeleteModifier = async (modifierCode: string) => {
    try {
      await deleteModifierMutation.mutateAsync({ code: modifierCode });
      // List will automatically refresh due to React Query
    } catch (error) {
      console.error('Failed to delete modifier:', error);
      throw error;
    }
  };

  const handleToggleActive = async (modifierCode: string, active: boolean) => {
    try {
      await handleUpdateModifier(modifierCode, { active });
    } catch (error) {
      console.error('Failed to toggle modifier active status:', error);
      throw error;
    }
  };

  return {
    modifiers,
    isLoading,
    error,
    handleCreateModifier,
    handleUpdateModifier,
    handleDeleteModifier,
    handleToggleActive,
  };
};
