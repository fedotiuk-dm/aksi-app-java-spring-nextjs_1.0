/**
 * @fileoverview Catalog state management store
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { 
  type ServiceCategory,
  type ItemCategory,
  type PriceListCategory,
  type CatalogModalType,
  CATALOG_DEFAULTS
} from '../constants/catalog.constants';

interface CatalogFilters {
  serviceCategory?: ServiceCategory;
  itemCategory?: ItemCategory;
  priceListCategory?: PriceListCategory;
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