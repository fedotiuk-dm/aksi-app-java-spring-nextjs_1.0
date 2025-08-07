import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  PriceListItemInfo, 
  ListPriceListItemsParams,
  PriceListItemInfoCategoryCode 
} from '@/shared/api/generated/priceList';

interface PriceListState {
  // State
  selectedCategory: PriceListItemInfoCategoryCode | null;
  searchQuery: string;
  activeOnly: boolean;
  selectedItem: PriceListItemInfo | null;
  isFormOpen: boolean;
  
  // Actions
  setSelectedCategory: (category: PriceListItemInfoCategoryCode | null) => void;
  setSearchQuery: (query: string) => void;
  setActiveOnly: (active: boolean) => void;
  setSelectedItem: (item: PriceListItemInfo | null) => void;
  setFormOpen: (open: boolean) => void;
  
  // Computed
  getListParams: () => ListPriceListItemsParams;
  resetFilters: () => void;
}

export const usePriceListStore = create<PriceListState>()(
  devtools(
    (set, get) => ({
      // Initial state
      selectedCategory: null,
      searchQuery: '',
      activeOnly: true,
      selectedItem: null,
      isFormOpen: false,
      
      // Actions
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveOnly: (active) => set({ activeOnly: active }),
      setSelectedItem: (item) => set({ selectedItem: item }),
      setFormOpen: (open) => set({ isFormOpen: open }),
      
      // Computed getters
      getListParams: () => {
        const state = get();
        const params: ListPriceListItemsParams = {};
        
        if (state.selectedCategory) {
          params.categoryCode = state.selectedCategory as any;
        }
        
        if (state.activeOnly !== null) {
          params.active = state.activeOnly;
        }
        
        return params;
      },
      
      resetFilters: () => set({
        selectedCategory: null,
        searchQuery: '',
        activeOnly: true,
      }),
    }),
    {
      name: 'price-list-store',
    }
  )
);