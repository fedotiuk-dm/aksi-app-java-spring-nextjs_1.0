import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createNavigationSlice } from '../slices/navigationSlice';
import { createClientSlice } from '../slices/clientSlice';
import { createBasicInfoSlice } from '../slices/basicInfoSlice';
import { createItemsSlice } from '../slices/itemsSlice';
import { createDetailsSlice } from '../slices/detailsSlice';
import { createBillingSlice } from '../slices/billingSlice';
import { OrderWizardState, WizardStep } from '../types/types';

// Початковий стан для візарда
const initialState: Partial<OrderWizardState> = {
  currentStep: WizardStep.CLIENT_SELECTION,
  currentSubStep: undefined,
  navigationHistory: [],

  // Клієнт
  selectedClient: null,
  searchQuery: '',
  searchResults: [],

  // Базова інформація
  tagNumber: '',
  branchLocation: '',
  expectedCompletionDate: null,
  express: false,

  // Предмети
  items: [],
  currentItemIndex: null,
  currentItem: null,

  // Загальна інформація
  customerNotes: '',
  internalNotes: '',

  // Ціни та оплата
  totalAmount: 0,
  discountAmount: 0,
  finalAmount: 0,
  prepaymentAmount: 0,
  balanceAmount: 0,

  // Мета-інформація
  isLoading: false,
  error: null,
  isDirty: false,
};

// Експортуємо хук для доступу до стору
export const useOrderWizardStore = create<OrderWizardState>()(
  immer((set, get, store) => ({
    ...(initialState as OrderWizardState),
    ...createNavigationSlice(set, get, store),
    ...createClientSlice(set, get, store),
    ...createBasicInfoSlice(set, get, store),
    ...createItemsSlice(set, get, store),
    ...createDetailsSlice(set, get, store),
    ...createBillingSlice(set, get, store),

    // Метод для повного очищення стору
    resetWizard: () => {
      set((state) => {
        Object.keys(initialState).forEach((key) => {
          // @ts-ignore - динамічний доступ до властивостей
          state[key] = initialState[key];
        });
      });
    },
  }))
);

// Хук для доступу до методів навігації візарда
export const useOrderWizardNavigation = () => {
  const {
    currentStep,
    currentSubStep,
    navigationHistory,
    navigateToStep,
    navigateBack,
    resetNavigationHistory,
  } = useOrderWizardStore();

  return {
    currentStep,
    currentSubStep,
    navigationHistory,
    navigateToStep,
    navigateBack,
    resetNavigationHistory,
    // Зручний метод для визначення активності кроку
    isStepActive: (step: WizardStep) => currentStep === step,
    // Зручний метод для визначення активності підкроку
    isSubStepActive: (subStep: string) => currentSubStep === subStep,
  };
};

// Хук для доступу до методів статусу візарда (завантаження, помилки)
export const useOrderWizardStatus = () => {
  const { isLoading, error, setLoading, setError } = useOrderWizardStore();

  return {
    isLoading,
    error,
    setLoading,
    setError,
    // Допоміжний метод для обробки запитів до API
    withLoading: async <T>(
      promiseOrFn: Promise<T> | (() => Promise<T>)
    ): Promise<T> => {
      try {
        setLoading(true);
        setError(null);
        // Перевіряємо, чи це функція, яка повертає Promise, чи сам Promise
        const promise =
          typeof promiseOrFn === 'function'
            ? (promiseOrFn as () => Promise<T>)()
            : promiseOrFn;
        return await promise;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Виникла невідома помилка'
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
  };
};
