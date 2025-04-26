import { StateCreator } from 'zustand';
import { OrderWizardState, Client } from '../types';

export const createClientSlice: StateCreator<
  OrderWizardState,
  [["zustand/immer", never]],
  [],
  Pick<OrderWizardState, 
    'setSelectedClient' | 
    'setSearchQuery' | 
    'setSearchResults'
  >
> = (set) => ({
  
  setSelectedClient: (client: Client | null) => {
    set((state) => {
      state.selectedClient = client;
      // Якщо клієнт вибраний, скидаємо пошуковий запит
      if (client) {
        state.searchQuery = '';
        state.searchResults = [];
      }
      // Встановлюємо прапорець dirty, щоб показати, що форма була змінена
      state.isDirty = true;
    });
  },
  
  setSearchQuery: (query: string) => {
    set((state) => {
      state.searchQuery = query;
    });
  },
  
  setSearchResults: (results: Client[]) => {
    set((state) => {
      state.searchResults = results;
    });
  },
});
