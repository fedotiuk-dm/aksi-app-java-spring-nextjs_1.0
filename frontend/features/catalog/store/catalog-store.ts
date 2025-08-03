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
  priceRange?: {
    min: number;
    max: number;
  };
  processingTime?: ProcessingTime;
  activeOnly?: boolean;
}

interface CatalogState {
  // Current selections
  selectedService: ServiceInfo | null;
  selectedItem: ItemInfo | null;
  selectedServiceItem: ServiceItemInfo | null;
  
  // Filters
  filters: CatalogFilters;
  
  // UI state
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  modalType: CatalogModalType | null;
  
  // Actions
  selectService: (service: ServiceInfo | null) => void;
  selectItem: (item: ItemInfo | null) => void;
  selectServiceItem: (serviceItem: ServiceItemInfo | null) => void;
  
  // Filter actions
  setFilters: (filters: Partial<CatalogFilters>) => void;
  resetFilters: () => void;
  
  // Modal actions
  openCreateModal: (type: CatalogModalType) => void;
  openEditModal: (type: CatalogModalType) => void;
  closeModal: () => void;
  
  // Clear all selections
  clearSelections: () => void;
}

const initialFilters: CatalogFilters = {
  activeOnly: CATALOG_DEFAULTS.FILTERS.ACTIVE_ONLY,
};

export const useCatalogStore = create<CatalogState>()(
  devtools(
    (set) => ({
      // Initial state
      selectedService: null,
      selectedItem: null,
      selectedServiceItem: null,
      filters: initialFilters,
      isCreateModalOpen: false,
      isEditModalOpen: false,
      modalType: null,
      
      // Service selection
      selectService: (service) => 
        set((state) => ({ 
          selectedService: service,
          // Clear service item if service changed
          selectedServiceItem: service?.id !== state.selectedService?.id ? null : state.selectedServiceItem
        })),
      
      // Item selection
      selectItem: (item) => 
        set((state) => ({ 
          selectedItem: item,
          // Clear service item if item changed
          selectedServiceItem: item?.id !== state.selectedItem?.id ? null : state.selectedServiceItem
        })),
      
      // Service item selection
      selectServiceItem: (serviceItem) => 
        set(() => ({ 
          selectedServiceItem: serviceItem,
          // Also set service and item if selecting service item
          selectedService: serviceItem?.service || null,
          selectedItem: serviceItem?.item || null,
        })),
      
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
      openCreateModal: (type) => 
        set(() => ({ 
          isCreateModalOpen: true, 
          isEditModalOpen: false,
          modalType: type 
        })),
      
      openEditModal: (type) => 
        set(() => ({ 
          isEditModalOpen: true,
          isCreateModalOpen: false, 
          modalType: type 
        })),
      
      closeModal: () => 
        set(() => ({ 
          isCreateModalOpen: false, 
          isEditModalOpen: false,
          modalType: null 
        })),
      
      // Clear all selections
      clearSelections: () => 
        set(() => ({ 
          selectedService: null,
          selectedItem: null,
          selectedServiceItem: null,
        })),
    }),
    {
      name: CATALOG_DEFAULTS.STORE_NAME,
    }
  )
);