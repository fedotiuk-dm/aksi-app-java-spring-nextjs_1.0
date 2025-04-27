import { StateCreator } from 'zustand';
import { OrderWizardState } from '../types/types';
import { UUID } from 'node:crypto';

export const createBasicInfoSlice: StateCreator<
  OrderWizardState,
  [['zustand/immer', never]],
  [],
  Pick<
    OrderWizardState,
    | 'setTagNumber'
    | 'setBranchLocationId'
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

  setBranchLocationId: (locationId: UUID | null) => {
    set((state) => {
      state.branchLocationId = locationId;
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
