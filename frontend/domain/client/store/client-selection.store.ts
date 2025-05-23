import { create } from 'zustand';

import { ClientEntity } from '../entities';
import { ClientRepository } from '../repositories';

// Додаємо імпорт wizard типів та store
// Використовуємо lazy import щоб уникнути циклічних залежностей
let wizardStoreModule: any = null;
const getWizardStore = async () => {
  if (!wizardStoreModule) {
    wizardStoreModule = await import('../../wizard/store/wizard.store');
  }
  return wizardStoreModule.useWizardStore;
};

const getWizardStep = async () => {
  if (!wizardStoreModule) {
    const wizardTypesModule = await import('../../wizard/types');
    return wizardTypesModule.WizardStep;
  }
  const wizardTypesModule = await import('../../wizard/types');
  return wizardTypesModule.WizardStep;
};

interface ClientSelectionState {
  // Дані
  selectedClientId: string | null;
  selectedClient: ClientEntity | null;

  // Статуси
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // Методи
  selectClient: (clientId: string) => Promise<void>;
  clearSelection: () => void;
  isClientSelected: () => boolean;
  deleteClient: (clientId: string) => Promise<void>;
}

/**
 * Стор Zustand для вибору клієнта
 */
export const useClientSelectionStore = create<ClientSelectionState>((set, get) => {
  // Створення репозиторію
  const clientRepository = new ClientRepository();

  return {
    // Початковий стан
    selectedClientId: null,
    selectedClient: null,

    isLoading: false,
    isError: false,
    error: null,

    // Методи для роботи з вибором клієнта
    selectClient: async (clientId: string) => {
      if (!clientId) {
        set({ selectedClientId: null, selectedClient: null });

        // Відключаємо availability для наступного кроку
        try {
          const useWizardStore = await getWizardStore();
          const WizardStep = await getWizardStep();
          useWizardStore.getState().updateStepAvailability(WizardStep.BRANCH_SELECTION, false);
        } catch (error) {
          console.warn('Помилка оновлення wizard availability:', error);
        }
        return;
      }

      set({
        isLoading: true,
        isError: false,
        error: null,
        selectedClientId: clientId,
      });

      try {
        const client = await clientRepository.getById(clientId);
        set({
          selectedClient: client,
          isLoading: false,
        });

        // Увімкнаємо availability для наступного кроку після успішного вибору
        try {
          const useWizardStore = await getWizardStore();
          const WizardStep = await getWizardStep();
          console.log('Client Selection Store: оновлюємо wizard availability для BRANCH_SELECTION');
          useWizardStore.getState().updateStepAvailability(WizardStep.BRANCH_SELECTION, true);
          console.log('Client Selection Store: availability оновлено успішно');
        } catch (error) {
          console.warn('Помилка оновлення wizard availability:', error);
        }
      } catch (error) {
        set({
          isLoading: false,
          isError: true,
          error: error instanceof Error ? error : new Error('Помилка отримання клієнта'),
          selectedClient: null,
        });
      }
    },

    clearSelection: () => {
      set({
        selectedClientId: null,
        selectedClient: null,
        isLoading: false,
        isError: false,
        error: null,
      });

      // Відключаємо availability для наступного кроку
      getWizardStore()
        .then((useWizardStore) => {
          return getWizardStep().then((WizardStep) => {
            useWizardStore.getState().updateStepAvailability(WizardStep.BRANCH_SELECTION, false);
          });
        })
        .catch((error) => {
          console.warn('Помилка оновлення wizard availability при очищенні:', error);
        });
    },

    isClientSelected: () => {
      return !!get().selectedClient;
    },

    deleteClient: async (clientId: string) => {
      if (!clientId) {
        set({ selectedClientId: null, selectedClient: null });
        return;
      }

      set({
        isLoading: true,
        isError: false,
        error: null,
        selectedClientId: null,
        selectedClient: null,
      });

      try {
        await clientRepository.delete(clientId);
        set({
          isLoading: false,
        });
      } catch (error) {
        set({
          isLoading: false,
          isError: true,
          error: error instanceof Error ? error : new Error('Помилка видалення клієнта'),
          selectedClientId: null,
          selectedClient: null,
        });
      }
    },
  };
});
