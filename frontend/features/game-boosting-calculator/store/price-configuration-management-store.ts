/**
 * Price Configuration Management Store
 * Zustand store for managing UI state of price configuration management
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { PriceConfiguration, Game, ServiceType, DifficultyLevel } from '@api/game';

export interface PriceConfigurationManagementStore {
  // Data state
  priceConfigurations: PriceConfiguration[];
  games: Game[];
  serviceTypes: ServiceType[];
  difficultyLevels: DifficultyLevel[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setPriceConfigurations: (priceConfigurations: PriceConfiguration[]) => void;
  setGames: (games: Game[]) => void;
  setServiceTypes: (serviceTypes: ServiceType[]) => void;
  setDifficultyLevels: (difficultyLevels: DifficultyLevel[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const usePriceConfigurationManagementStore = create<PriceConfigurationManagementStore>()(
  devtools(
    (set) => ({
      // Initial state
      priceConfigurations: [],
      games: [],
      serviceTypes: [],
      difficultyLevels: [],
      isLoading: false,
      error: null,

      // Actions
      setPriceConfigurations: (priceConfigurations) => set({ priceConfigurations }),

      setGames: (games) => set({ games }),

      setServiceTypes: (serviceTypes) => set({ serviceTypes }),

      setDifficultyLevels: (difficultyLevels) => set({ difficultyLevels }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) =>
        set({
          error,
          isLoading: false,
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'price-configuration-management-store',
    }
  )
);
