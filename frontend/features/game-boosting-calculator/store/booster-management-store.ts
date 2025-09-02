/**
 * Booster Management Store
 * Zustand store for managing CRUD operations for boosters
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Booster } from '@api/game';

export interface BoosterManagementStore {
  // Data
  boosters: Booster[];
  isLoading: boolean;
  error: string | null;

  // UI state
  statusFilter: '' | 'active' | 'inactive';

  // Actions - UI state management only
  setBoosters: (boosters: Booster[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addBooster: (booster: Booster) => void;
  updateBoosterInList: (boosterId: string, boosterData: Partial<Booster>) => void;
  removeBooster: (boosterId: string) => void;
  clearError: () => void;
  setStatusFilter: (statusFilter: '' | 'active' | 'inactive') => void;
}

export const useBoosterManagementStore = create<BoosterManagementStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      boosters: [],
      isLoading: false,
      error: null,
      statusFilter: '',

      // Actions - UI state management only
      setBoosters: (boosters: Booster[]) => {
        set({ boosters });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      // Local state management (API calls should be in components)
      addBooster: (booster: Booster) => {
        const currentBoosters = get().boosters;
        set({ boosters: [...currentBoosters, booster] });
      },

      updateBoosterInList: (boosterId: string, boosterData: Partial<Booster>) => {
        const currentBoosters = get().boosters;
        const updatedBoosters = currentBoosters.map((booster) =>
          booster.id === boosterId ? { ...booster, ...boosterData } : booster
        );
        set({ boosters: updatedBoosters });
      },

      removeBooster: (boosterId: string) => {
        const currentBoosters = get().boosters;
        const filteredBoosters = currentBoosters.filter((booster) => booster.id !== boosterId);
        set({ boosters: filteredBoosters });
      },

      clearError: () => {
        set({ error: null });
      },

      setStatusFilter: (statusFilter: '' | 'active' | 'inactive') => {
        set({ statusFilter });
      },
    }),
    {
      name: 'booster-management-store',
    }
  )
);
