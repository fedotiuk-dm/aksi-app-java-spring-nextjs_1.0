/**
 * Game Modifiers Management Store
 * Zustand store for managing UI state of game modifiers management
 *
 * NOTE: This store is currently not used since we switched to React Query pattern.
 * It can be used for complex UI state management if needed in the future.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { GameModifierInfo, Game, ServiceType } from '@api/game';

export interface GameModifiersManagementStore {
  // Data state (managed by React Query)
  modifiers: GameModifierInfo[];
  games: Game[];
  serviceTypes: ServiceType[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // UI state for complex interactions
  selectedModifierId: string | null;
  isModalOpen: boolean;
  modalType: 'create' | 'edit' | 'delete' | null;

  // Filter state
  searchTerm: string;
  typeFilter: string;
  operationFilter: string;
  activeFilter: boolean | null;

  // Actions
  setModifiers: (modifiers: GameModifierInfo[]) => void;
  setGames: (games: Game[]) => void;
  setServiceTypes: (serviceTypes: ServiceType[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setSelectedModifierId: (id: string | null) => void;
  setModalOpen: (open: boolean, type?: 'create' | 'edit' | 'delete' | null) => void;
  setSearchTerm: (term: string) => void;
  setTypeFilter: (type: string) => void;
  setOperationFilter: (operation: string) => void;
  setActiveFilter: (active: boolean | null) => void;

  // Utility actions
  resetFilters: () => void;
  resetModal: () => void;
}

export const useGameModifiersManagementStore = create<GameModifiersManagementStore>()(
  devtools(
    (set) => ({
      // Initial state
      modifiers: [],
      games: [],
      serviceTypes: [],
      isLoading: false,
      error: null,
      selectedModifierId: null,
      isModalOpen: false,
      modalType: null,
      searchTerm: '',
      typeFilter: '',
      operationFilter: '',
      activeFilter: null,

      // Actions
      setModifiers: (modifiers) => set({ modifiers }),
      setGames: (games) => set({ games }),
      setServiceTypes: (serviceTypes) => set({ serviceTypes }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      setSelectedModifierId: (selectedModifierId) => set({ selectedModifierId }),

      setModalOpen: (isModalOpen, modalType = null) =>
        set({
          isModalOpen,
          modalType,
          selectedModifierId: isModalOpen ? null : undefined,
        }),

      setSearchTerm: (searchTerm) => set({ searchTerm }),

      setTypeFilter: (typeFilter) => set({ typeFilter }),

      setOperationFilter: (operationFilter) => set({ operationFilter }),

      setActiveFilter: (activeFilter) => set({ activeFilter }),

      resetFilters: () =>
        set({
          searchTerm: '',
          typeFilter: '',
          operationFilter: '',
          activeFilter: null,
        }),

      resetModal: () =>
        set({
          isModalOpen: false,
          modalType: null,
          selectedModifierId: null,
        }),
    }),
    {
      name: 'game-modifiers-management-store',
    }
  )
);
