import { StateCreator } from 'zustand';

import { ClientResponse } from '@/lib/api';

import { NavigationActions, WizardStep } from '../../../wizard/store/navigation';
import { ClientSelectionMode, ClientStore } from '../types';

/**
 * Слайс стору для функціональності вибору клієнта
 * @template State - тип стану стору
 * @template Middlewares - тип middleware для Zustand
 * @template Extenders - тип екстендерів для Zustand
 * @template Selection - тип вибраних методів та властивостей
 */
export const createClientSelectionSlice: StateCreator<
  ClientStore,
  [],
  [],
  Pick<ClientStore, 'selectClient' | 'clearSelectedClient' | 'setMode'>
> = (set, store) => ({
  selectClient: (client: ClientResponse) => {
    set({
      selectedClient: client,
      mode: 'existing',
    });

    // Доступ до навігаційних дій загального стору
    const wizardStore = store as unknown as { navigation?: NavigationActions };
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
    const wizardStore = store as unknown as { navigation?: NavigationActions };
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
});
