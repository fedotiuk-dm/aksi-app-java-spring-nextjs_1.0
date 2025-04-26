import { StateCreator } from 'zustand';
import { OrderWizardState } from '../types';

export const createDetailsSlice: StateCreator<
  OrderWizardState,
  [["zustand/immer", never]],
  [],
  Pick<OrderWizardState, 
    'setCustomerNotes' | 
    'setInternalNotes' | 
    'setDirty' |
    'setError' |
    'setLoading'
  >
> = (set) => ({
  
  setCustomerNotes: (notes: string) => {
    set((state) => {
      state.customerNotes = notes;
      state.isDirty = true;
    });
  },
  
  setInternalNotes: (notes: string) => {
    set((state) => {
      state.internalNotes = notes;
      state.isDirty = true;
    });
  },

  // Загальні методи для керування станом
  setDirty: (isDirty: boolean) => {
    set((state) => {
      state.isDirty = isDirty;
    });
  },
  
  setError: (error: string | null) => {
    set((state) => {
      state.error = error;
    });
  },
  
  setLoading: (isLoading: boolean) => {
    set((state) => {
      state.isLoading = isLoading;
    });
  },
});
