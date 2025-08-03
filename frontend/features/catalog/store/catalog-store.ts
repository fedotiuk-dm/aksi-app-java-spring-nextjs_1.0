/**
 * @fileoverview Catalog state management store
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  ServiceInfo, 
  ItemInfo, 
  ServiceItemInfo
} from '@/shared/api/generated/serviceItem';
import { 
  type ServiceCategory,
  type ItemCategory,
  type ProcessingTime,
  type CatalogModalType,
  CATALOG_DEFAULTS
} from '@/features/catalog';

interface CatalogFilters {
  serviceCategory?: ServiceCategory;
  itemCategory?: ItemCategory;
  searchQuery?: string;
  activeOnly?: boolean;
}

interface CatalogState {
  // Filters
  filters: CatalogFilters;
  
  // UI state
  modalType: CatalogModalType | null;
  
  // Filter actions
  setFilters: (filters: Partial<CatalogFilters>) => void;
  resetFilters: () => void;
  
  // Modal actions
  openModal: (type: CatalogModalType) => void;
  closeModal: () => void;
}

const initialFilters: CatalogFilters = {
  activeOnly: CATALOG_DEFAULTS.FILTERS.ACTIVE_ONLY,
};

export const useCatalogStore = create<CatalogState>()(
  devtools(
    (set) => ({
      // Initial state
      filters: initialFilters,
      modalType: null,
      
      // Filter management
      setFilters: (filters) => 
        set((state) => ({ 
          filters: { ...state.filters, ...filters } 
        })),
      
      resetFilters: () => 
        set(() => ({ 
          filters: initialFilters 
        })),
      
      // Modal management
      openModal: (type) => 
        set(() => ({ 
          modalType: type 
        })),
      
      closeModal: () => 
        set(() => ({ 
          modalType: null 
        })),
    }),
    {
      name: CATALOG_DEFAULTS.STORE_NAME,
    }
  )
);