/**
 * @fileoverview Branch store для управління UI станом
 *
 * Зберігає тільки UI стан - фільтри, вибрані елементи, налаштування відображення
 * Серверні дані управляються через React Query (Orval hooks)
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { BranchInfo, ListBranchesParams } from '@/shared/api/generated/branch';

export interface BranchUIState {
  // Filters
  searchQuery: string;
  statusFilter: 'all' | 'active' | 'inactive';

  // UI State
  selectedBranchId: string | null;
  isFormOpen: boolean;
  editingBranch: BranchInfo | null;

  // View preferences
  viewMode: 'table' | 'cards';
  sortBy: 'name' | 'address';
  sortOrder: 'asc' | 'desc';

  // Actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: 'all' | 'active' | 'inactive') => void;
  setSelectedBranch: (id: string | null) => void;
  openForm: (branch?: BranchInfo) => void;
  closeForm: () => void;
  setViewMode: (mode: 'table' | 'cards') => void;
  setSorting: (field: 'name' | 'address', order: 'asc' | 'desc') => void;

  // Computed
  getListParams: () => ListBranchesParams;
  resetFilters: () => void;
}

const initialState = {
  searchQuery: '',
  statusFilter: 'active' as const,
  selectedBranchId: null,
  isFormOpen: false,
  editingBranch: null,
  viewMode: 'table' as const,
  sortBy: 'name' as const,
  sortOrder: 'asc' as const,
};

export const useBranchStore = create<BranchUIState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Actions
        setSearchQuery: (query) =>
          set((state) => {
            state.searchQuery = query;
          }),

        setStatusFilter: (status) =>
          set((state) => {
            state.statusFilter = status;
          }),

        setSelectedBranch: (id) =>
          set((state) => {
            state.selectedBranchId = id;
          }),

        openForm: (branch) =>
          set((state) => {
            state.isFormOpen = true;
            state.editingBranch = branch || null;
          }),

        closeForm: () =>
          set((state) => {
            state.isFormOpen = false;
            state.editingBranch = null;
          }),

        setViewMode: (mode) =>
          set((state) => {
            state.viewMode = mode;
          }),

        setSorting: (field, order) =>
          set((state) => {
            state.sortBy = field;
            state.sortOrder = order;
          }),

        // Computed
        getListParams: () => {
          const state = get();
          const params: ListBranchesParams = {
            page: 0,
            size: 20,
          };

          // Sorting (map UI -> API params)
          params.sortBy = state.sortBy;
          params.sortOrder = state.sortOrder.toUpperCase() as 'ASC' | 'DESC';

          // Add search if present
          if (state.searchQuery) {
            params.search = state.searchQuery;
          }

          // Add status filter
          if (state.statusFilter === 'active') {
            params.active = true;
          } else if (state.statusFilter === 'inactive') {
            params.active = false;
          }

          return params;
        },

        resetFilters: () =>
          set((state) => {
            state.searchQuery = '';
            state.statusFilter = 'active';
          }),
      })),
      {
        name: 'branch-ui-store',
        // Persist only view preferences
        partialize: (state) => ({
          viewMode: state.viewMode,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
          statusFilter: state.statusFilter,
        }),
      }
    ),
    {
      name: 'BranchStore',
    }
  )
);

// Selectors
export const selectSearchQuery = (state: BranchUIState) => state.searchQuery;
export const selectStatusFilter = (state: BranchUIState) => state.statusFilter;
export const selectSelectedBranchId = (state: BranchUIState) => state.selectedBranchId;
export const selectIsFormOpen = (state: BranchUIState) => state.isFormOpen;
export const selectEditingBranch = (state: BranchUIState) => state.editingBranch;
export const selectViewMode = (state: BranchUIState) => state.viewMode;
export const selectSorting = (state: BranchUIState) => ({
  sortBy: state.sortBy,
  sortOrder: state.sortOrder,
});
