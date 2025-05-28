/**
 * @fileoverview Execution Parameters Slice Store - Zustand store для параметрів виконання
 * @module domain/wizard/store/stage-3
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { ExpediteType } from '../../types';

/**
 * Стан параметрів виконання (Stage 3.1)
 */
interface ExecutionParametersState {
  // Execution date
  completionDate: Date | null;
  originalCompletionDate: Date | null;
  isCompletionDateCustom: boolean;

  // Expedite options
  selectedExpediteType: ExpediteType | null;
  expediteCostModifier: number;
  expediteDescription: string;

  // Standard processing times (інформаційно)
  standardProcessingDays: number;
  leatherProcessingDays: number;

  // Validation
  isCompletionDateValid: boolean;
  executionValidationErrors: string[];
}

/**
 * Дії для параметрів виконання
 */
interface ExecutionParametersActions {
  // Execution date actions
  setCompletionDate: (date: Date | null) => void;
  setCustomCompletionDate: (date: Date) => void;
  resetToStandardDate: () => void;
  calculateStandardDate: (baseDate?: Date) => void;

  // Expedite actions
  setExpediteType: (expediteType: ExpediteType | null) => void;
  clearExpedite: () => void;

  // Processing times actions
  setStandardProcessingDays: (days: number) => void;
  setLeatherProcessingDays: (days: number) => void;

  // Validation actions
  setCompletionDateValid: (isValid: boolean) => void;
  setExecutionValidationErrors: (errors: string[]) => void;
  clearExecutionValidationErrors: () => void;

  // Calculated values
  calculateExpediteModifier: () => void;

  // Reset actions
  resetExecutionParameters: () => void;

  // Helper methods
  getExpediteDescription: (expediteType: ExpediteType) => string;
  calculateDiscountPercentage: (expediteType: ExpediteType | null) => number;
}

/**
 * Початковий стан параметрів виконання
 */
const initialExecutionParametersState: ExecutionParametersState = {
  completionDate: null,
  originalCompletionDate: null,
  isCompletionDateCustom: false,
  selectedExpediteType: null,
  expediteCostModifier: 0,
  expediteDescription: '',
  standardProcessingDays: 2,
  leatherProcessingDays: 14,
  isCompletionDateValid: false,
  executionValidationErrors: [],
};

/**
 * Execution Parameters Slice Store
 *
 * Відповідальність:
 * - Управління датою виконання замовлення
 * - Терміновість виконання та надбавки
 * - Розрахунок стандартних термінів
 * - Валідація параметрів виконання
 *
 * Інтеграція:
 * - Orval типи для ExpediteType
 * - Сервіси розрахунку дат та надбавок
 * - API для отримання робочих днів
 */
export const useExecutionParametersStore = create<
  ExecutionParametersState & ExecutionParametersActions
>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialExecutionParametersState,

      // Execution date actions
      setCompletionDate: (date) => {
        set(
          {
            completionDate: date,
            isCompletionDateValid: date !== null,
            executionValidationErrors: date ? [] : ["Дата виконання обов'язкова"],
          },
          false,
          'executionParams/setCompletionDate'
        );
      },

      setCustomCompletionDate: (date) => {
        set(
          {
            completionDate: date,
            isCompletionDateCustom: true,
            isCompletionDateValid: true,
            executionValidationErrors: [],
          },
          false,
          'executionParams/setCustomCompletionDate'
        );
      },

      resetToStandardDate: () => {
        const state = get();
        set(
          {
            completionDate: state.originalCompletionDate,
            isCompletionDateCustom: false,
          },
          false,
          'executionParams/resetToStandardDate'
        );
      },

      calculateStandardDate: (baseDate = new Date()) => {
        const state = get();
        const daysToAdd = state.standardProcessingDays;

        // Додаємо робочі дні (спрощено - без вихідних)
        const standardDate = new Date(baseDate);
        standardDate.setDate(standardDate.getDate() + daysToAdd);

        set(
          {
            originalCompletionDate: standardDate,
            completionDate: state.isCompletionDateCustom ? state.completionDate : standardDate,
          },
          false,
          'executionParams/calculateStandardDate'
        );
      },

      // Expedite actions
      setExpediteType: (expediteType) => {
        const percentage = expediteType ? get().calculateDiscountPercentage(expediteType) : 0;
        const description = expediteType ? get().getExpediteDescription(expediteType) : '';

        set(
          {
            selectedExpediteType: expediteType,
            expediteDescription: description,
          },
          false,
          'executionParams/setExpediteType'
        );
        get().calculateExpediteModifier();
      },

      clearExpedite: () => {
        set(
          {
            selectedExpediteType: null,
            expediteCostModifier: 0,
            expediteDescription: '',
          },
          false,
          'executionParams/clearExpedite'
        );
      },

      // Processing times actions
      setStandardProcessingDays: (days) => {
        set({ standardProcessingDays: days }, false, 'executionParams/setStandardProcessingDays');
        get().calculateStandardDate();
      },

      setLeatherProcessingDays: (days) => {
        set({ leatherProcessingDays: days }, false, 'executionParams/setLeatherProcessingDays');
      },

      // Validation actions
      setCompletionDateValid: (isValid) => {
        set({ isCompletionDateValid: isValid }, false, 'executionParams/setCompletionDateValid');
      },

      setExecutionValidationErrors: (errors) => {
        set(
          {
            executionValidationErrors: errors,
            isCompletionDateValid: errors.length === 0,
          },
          false,
          'executionParams/setExecutionValidationErrors'
        );
      },

      clearExecutionValidationErrors: () => {
        set(
          { executionValidationErrors: [], isCompletionDateValid: true },
          false,
          'executionParams/clearExecutionValidationErrors'
        );
      },

      // Calculated values
      calculateExpediteModifier: () => {
        const state = get();
        let modifier = 0;

        switch (state.selectedExpediteType) {
          case 'EXPRESS_48H':
            modifier = 0.5; // +50%
            break;
          case 'EXPRESS_24H':
            modifier = 1.0; // +100%
            break;
          case 'STANDARD':
          default:
            modifier = 0;
            break;
        }

        set({ expediteCostModifier: modifier }, false, 'executionParams/calculateExpediteModifier');
      },

      // Helper method for expedite description
      getExpediteDescription: (expediteType: ExpediteType): string => {
        switch (expediteType) {
          case 'EXPRESS_48H':
            return 'Термінове виконання за 48 годин (+50% до вартості)';
          case 'EXPRESS_24H':
            return 'Термінове виконання за 24 години (+100% до вартості)';
          case 'STANDARD':
          default:
            return 'Стандартний термін виконання';
        }
      },

      // Helper method for calculating percentage
      calculateDiscountPercentage: (expediteType: ExpediteType | null): number => {
        switch (expediteType) {
          case 'EXPRESS_48H':
            return 50;
          case 'EXPRESS_24H':
            return 100;
          case 'STANDARD':
          default:
            return 0;
        }
      },

      // Reset actions
      resetExecutionParameters: () => {
        set(initialExecutionParametersState, false, 'executionParams/resetExecutionParameters');
      },
    }),
    {
      name: 'execution-parameters-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type ExecutionParametersStore = ReturnType<typeof useExecutionParametersStore>;
