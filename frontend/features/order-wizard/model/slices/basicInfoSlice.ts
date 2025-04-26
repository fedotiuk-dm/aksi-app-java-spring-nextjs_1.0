import { StateCreator } from 'zustand';
import { OrderWizardState } from '../types/types';

export const createBasicInfoSlice: StateCreator<
  OrderWizardState,
  [['zustand/immer', never]],
  [],
  Pick<
    OrderWizardState,
    | 'setTagNumber'
    | 'setBranchLocation'
    | 'setExpectedCompletionDate'
    | 'setExpress'
  >
> = (set) => ({
  setTagNumber: (tagNumber: string) => {
    set((state) => {
      state.tagNumber = tagNumber;
      state.isDirty = true;
    });
  },

  setBranchLocation: (location: string) => {
    set((state) => {
      state.branchLocation = location;
      state.isDirty = true;
    });
  },

  setExpectedCompletionDate: (date: Date | null) => {
    set((state) => {
      state.expectedCompletionDate = date;
      state.isDirty = true;
    });
  },

  setExpress: (express: boolean) => {
    set((state) => {
      state.express = express;
      state.isDirty = true;
    });
  },
});
