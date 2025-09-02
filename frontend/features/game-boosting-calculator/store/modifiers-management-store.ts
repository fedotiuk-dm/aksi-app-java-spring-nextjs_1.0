/**
 * Modifiers Management Store
 * Zustand store for managing UI state of modifiers management
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { PriceModifier } from '@api/pricing';

export interface ModifiersManagementStore {
  // Data state
  modifiers: PriceModifier[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setModifiers: (modifiers: PriceModifier[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useModifiersManagementStore = create<ModifiersManagementStore>()(
  devtools(
    (set) => ({
      // Initial state
      modifiers: [],
      isLoading: false,
      error: null,

      // Actions
      setModifiers: (modifiers) => set({ modifiers }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) =>
        set({
          error,
          isLoading: false,
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'modifiers-management-store',
    }
  )
);
