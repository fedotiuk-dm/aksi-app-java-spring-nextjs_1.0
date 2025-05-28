/**
 * @fileoverview Client Selection Slice Store - Zustand store для вибору клієнта
 * @module domain/wizard/store/stage-1
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { ClientSearchResultItem, BranchData } from '../../types';

/**
 * Стан вибору клієнта (Stage 1.1)
 */
interface ClientSelectionState {
  // Selected client data
  selectedClientId: string | null;
  selectedClient: ClientSearchResultItem | null;
  isNewClient: boolean;

  // Search state
  searchResults: ClientSearchResultItem[];
  searchTerm: string;
  isSearching: boolean;
  searchError: string | null;

  // Branch selection (частина Stage 1.2)
  selectedBranchId: string | null;
  selectedBranch: BranchData | null;
  branchValidationError: string | null;

  // Form states
  isClientFormValid: boolean;
  clientFormErrors: string[];
}

/**
 * Дії для вибору клієнта
 */
interface ClientSelectionActions {
  // Client selection actions
  setSelectedClient: (client: ClientSearchResultItem) => void;
  clearSelectedClient: () => void;
  setNewClientFlag: (isNew: boolean) => void;

  // Search actions
  setSearchResults: (results: ClientSearchResultItem[]) => void;
  setSearchTerm: (term: string) => void;
  setSearching: (isSearching: boolean) => void;
  setSearchError: (error: string | null) => void;
  clearSearchResults: () => void;

  // Branch selection actions
  setSelectedBranch: (branch: BranchData) => void;
  clearSelectedBranch: () => void;
  setBranchValidationError: (error: string | null) => void;

  // Form validation actions
  setClientFormValid: (isValid: boolean) => void;
  setClientFormErrors: (errors: string[]) => void;
  clearClientFormErrors: () => void;

  // Reset actions
  resetClientSelection: () => void;
}

/**
 * Початковий стан вибору клієнта
 */
const initialClientSelectionState: ClientSelectionState = {
  selectedClientId: null,
  selectedClient: null,
  isNewClient: false,
  searchResults: [],
  searchTerm: '',
  isSearching: false,
  searchError: null,
  selectedBranchId: null,
  selectedBranch: null,
  branchValidationError: null,
  isClientFormValid: false,
  clientFormErrors: [],
};

/**
 * Client Selection Slice Store
 *
 * Відповідальність:
 * - Управління вибраним клієнтом
 * - Пошук клієнтів та результати
 * - Стан нового клієнта (створення)
 * - Вибір філії (branch)
 * - Валідація форми клієнта
 *
 * Інтеграція:
 * - Orval типи для ClientSearchResult та Branch
 * - TanStack Query для API операцій пошуку
 * - React Hook Form для валідації форми
 * - XState для навігації після вибору
 */
export const useClientSelectionStore = create<ClientSelectionState & ClientSelectionActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialClientSelectionState,

      // Client selection actions
      setSelectedClient: (client) => {
        set(
          {
            selectedClient: client,
            selectedClientId: client.id,
            isNewClient: false,
            searchError: null,
            clientFormErrors: [],
          },
          false,
          'clientSelection/setSelectedClient'
        );
      },

      clearSelectedClient: () => {
        set(
          {
            selectedClient: null,
            selectedClientId: null,
            isNewClient: false,
            clientFormErrors: [],
            isClientFormValid: false,
          },
          false,
          'clientSelection/clearSelectedClient'
        );
      },

      setNewClientFlag: (isNew) => {
        set({ isNewClient: isNew }, false, 'clientSelection/setNewClientFlag');

        // Якщо переходимо до створення нового клієнта, очищаємо вибраного
        if (isNew) {
          get().clearSelectedClient();
        }
      },

      // Search actions
      setSearchResults: (results) => {
        set(
          { searchResults: results, searchError: null },
          false,
          'clientSelection/setSearchResults'
        );
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term }, false, 'clientSelection/setSearchTerm');
      },

      setSearching: (isSearching) => {
        set(
          {
            isSearching,
            // Очищуємо помилку при початку нового пошуку
            searchError: isSearching ? null : get().searchError,
          },
          false,
          'clientSelection/setSearching'
        );
      },

      setSearchError: (error) => {
        set(
          {
            searchError: error,
            isSearching: false,
            searchResults: error ? [] : get().searchResults,
          },
          false,
          'clientSelection/setSearchError'
        );
      },

      clearSearchResults: () => {
        set(
          {
            searchResults: [],
            searchTerm: '',
            searchError: null,
            isSearching: false,
          },
          false,
          'clientSelection/clearSearchResults'
        );
      },

      // Branch selection actions
      setSelectedBranch: (branch) => {
        set(
          {
            selectedBranch: branch,
            selectedBranchId: branch.id,
            branchValidationError: null,
          },
          false,
          'clientSelection/setSelectedBranch'
        );
      },

      clearSelectedBranch: () => {
        set(
          {
            selectedBranch: null,
            selectedBranchId: null,
            branchValidationError: null,
          },
          false,
          'clientSelection/clearSelectedBranch'
        );
      },

      setBranchValidationError: (error) => {
        set({ branchValidationError: error }, false, 'clientSelection/setBranchValidationError');
      },

      // Form validation actions
      setClientFormValid: (isValid) => {
        set({ isClientFormValid: isValid }, false, 'clientSelection/setClientFormValid');
      },

      setClientFormErrors: (errors) => {
        set(
          {
            clientFormErrors: errors,
            isClientFormValid: errors.length === 0,
          },
          false,
          'clientSelection/setClientFormErrors'
        );
      },

      clearClientFormErrors: () => {
        set(
          { clientFormErrors: [], isClientFormValid: true },
          false,
          'clientSelection/clearClientFormErrors'
        );
      },

      // Reset actions
      resetClientSelection: () => {
        set(initialClientSelectionState, false, 'clientSelection/resetClientSelection');
      },
    }),
    {
      name: 'client-selection-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type ClientSelectionStore = ReturnType<typeof useClientSelectionStore>;
