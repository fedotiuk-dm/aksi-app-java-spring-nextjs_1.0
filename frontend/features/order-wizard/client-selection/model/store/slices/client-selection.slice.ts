import { ClientResponse } from '@/lib/api';

import { WizardStep } from '../../../../wizard/store/navigation';
import { ClientSelectionActions, ClientSelectionMode, ClientStore } from '../../types';
import { createSlice, StoreModules } from '../utils/slice-factory';

/**
 * Слайс стору для функціональності вибору клієнта
 */
export const createClientSelectionSlice = createSlice<
  Pick<ClientStore, keyof ClientSelectionActions>
>('clientSelection', (set, get, store) => ({
  selectClient: (client: ClientResponse | null) => {
    if (client === null) {
      set({ selectedClient: null });
      return;
    }

    set({
      selectedClient: client,
      mode: 'existing',
    });

    // Доступ до навігаційних дій загального стору
    const wizardStore = store as unknown as StoreModules;
    if (wizardStore.navigation) {
      // Розблоковуємо наступний крок, коли клієнт вибраний
      wizardStore.navigation.updateStepAvailability(WizardStep.BRANCH_SELECTION, true);
    }
  },

  clearSelectedClient: () => {
    set({
      selectedClient: null,
    });

    // Доступ до навігаційних дій загального стору
    const wizardStore = store as unknown as StoreModules;
    if (wizardStore.navigation) {
      // Блокуємо наступний крок, коли клієнт не вибраний
      wizardStore.navigation.updateStepAvailability(WizardStep.BRANCH_SELECTION, false);
    }
  },

  setMode: (mode: ClientSelectionMode) => {
    set({ mode });

    // Скидаємо відповідні дані при зміні режиму
    if (mode === 'new') {
      set({ selectedClient: null });
    } else {
      set((state) => ({
        newClient: {
          ...state.newClient,
          firstName: '',
          lastName: '',
          phone: '',
          email: null,
        },
      }));
    }
  },

  confirmClientSelection: () => {
    const state = get();

    // Перевіряємо, чи є вибраний клієнт або заповнена форма нового клієнта
    const isClientValid =
      state.mode === 'existing' ? !!state.selectedClient : state.validateAndProceed();

    if (isClientValid) {
      // Доступ до навігаційних дій загального стору
      const wizardStore = store as unknown as StoreModules;
      if (wizardStore.navigation) {
        // Переходимо до наступного кроку (вибір філії)
        wizardStore.navigation.goToStep(WizardStep.BRANCH_SELECTION);
      }
      return true;
    }

    return false;
  },
}));
