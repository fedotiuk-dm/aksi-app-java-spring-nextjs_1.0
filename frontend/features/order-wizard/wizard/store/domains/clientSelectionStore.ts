import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { BaseStore } from './baseStore';
import { StepValidationStatus } from '../../types/wizard.types';

/**
 * Тип даних клієнта
 */
export interface ClientData {
  id: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
}

/**
 * Інтерфейс стану стору вибору клієнта
 */
export interface ClientSelectionState extends BaseStore {
  // Ідентифікатор вибраного клієнта
  selectedClientId: string | null;
  // Статус валідації кроку вибору клієнта
  validationStatus: StepValidationStatus;
  // Дані про вибраного клієнта
  clientData: ClientData | null;

  // Встановлення вибраного клієнта
  setSelectedClient: (clientId: string | null, clientData: ClientData | null) => void;
  // Встановлення статусу валідації
  setValidationStatus: (status: StepValidationStatus) => void;
}

/**
 * Початковий стан для стору вибору клієнта
 */
const initialState = {
  selectedClientId: null,
  clientData: null,
  validationStatus: 'not-validated' as StepValidationStatus,
  error: null,
  isSaving: false,
};

/**
 * Стор для управління вибором клієнта в Order Wizard
 */
export const useClientSelectionStore = create<ClientSelectionState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Встановлення вибраного клієнта
        setSelectedClient: (clientId, clientData) => set({
          selectedClientId: clientId,
          clientData: clientData,
        }),

        // Встановлення статусу валідації кроку
        setValidationStatus: (status) => set({
          validationStatus: status,
        }),

        // Встановлення помилки
        setError: (error) => set({
          error,
        }),

        // Встановлення статусу збереження
        setIsSaving: (isSaving) => set({
          isSaving,
        }),

        // Скидання стану стору
        reset: () => set(initialState),
      }),
      {
        name: 'order-wizard-client-selection',
      }
    )
  )
);
