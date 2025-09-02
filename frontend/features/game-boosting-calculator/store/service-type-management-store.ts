/**
 * Service Type Management Store
 * Zustand store for managing UI state of service type management
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ServiceType, Game } from '@api/game';

export interface ServiceTypeManagementStore {
  // Data state
  serviceTypes: ServiceType[];
  games: Game[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setServiceTypes: (serviceTypes: ServiceType[]) => void;
  setGames: (games: Game[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useServiceTypeManagementStore = create<ServiceTypeManagementStore>()(
  devtools(
    (set) => ({
      // Initial state
      serviceTypes: [],
      games: [],
      isLoading: false,
      error: null,

      // Actions
      setServiceTypes: (serviceTypes) => set({ serviceTypes }),

      setGames: (games) => set({ games }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) =>
        set({
          error,
          isLoading: false,
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'service-type-management-store',
    }
  )
);
