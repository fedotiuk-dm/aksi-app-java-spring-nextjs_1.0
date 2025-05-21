import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { BaseStore } from './baseStore';
import { StepValidationStatus } from '../../types/wizard.types';

/**
 * Інтерфейс стану стору базової інформації замовлення
 */
export interface BasicInfoState extends BaseStore {
  // Базова інформація замовлення
  orderDate: string | null;
  branchId: string | null;
  priority: string;
  comment: string;

  // Статус валідації кроку
  validationStatus: StepValidationStatus;

  // Методи для оновлення стану
  setOrderDate: (date: string | null) => void;
  setBranchId: (branchId: string | null) => void;
  setPriority: (priority: string) => void;
  setComment: (comment: string) => void;
  setValidationStatus: (status: StepValidationStatus) => void;
}

/**
 * Початковий стан для стору базової інформації
 */
const initialState = {
  orderDate: null,
  branchId: null,
  priority: 'standard',
  comment: '',
  validationStatus: 'not-validated' as StepValidationStatus,
  error: null,
  isSaving: false,
};

/**
 * Стор для управління базовою інформацією замовлення в Order Wizard
 */
export const useBasicInfoStore = create<BasicInfoState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Встановлення дати замовлення
        setOrderDate: (orderDate) => set({
          orderDate,
        }),

        // Встановлення філії
        setBranchId: (branchId) => set({
          branchId,
        }),

        // Встановлення пріоритету
        setPriority: (priority) => set({
          priority,
        }),

        // Встановлення коментаря
        setComment: (comment) => set({
          comment,
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
        name: 'order-wizard-basic-info',
      }
    )
  )
);
