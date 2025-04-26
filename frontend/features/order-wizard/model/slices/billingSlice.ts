import { StateCreator } from 'zustand';
import { OrderWizardState } from '../types';

export const createBillingSlice: StateCreator<
  OrderWizardState,
  [["zustand/immer", never]],
  [],
  Pick<OrderWizardState, 'setDiscountAmount' | 'setPrepaymentAmount'>
> = (set, get) => ({
  
  setDiscountAmount: (amount: number) => {
    set((state) => {
      state.discountAmount = amount;
      state.isDirty = true;
    });
    
    // Оновлюємо загальні суми після зміни знижки
    get().updateTotals();
  },
  
  setPrepaymentAmount: (amount: number) => {
    set((state) => {
      state.prepaymentAmount = amount;
      state.isDirty = true;
    });
    
    // Оновлюємо загальні суми після зміни передоплати
    get().updateTotals();
  },
});
