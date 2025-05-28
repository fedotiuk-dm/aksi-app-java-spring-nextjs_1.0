/**
 * @fileoverview Order Basic Info Slice Store - Zustand store для базової інформації замовлення
 * @module domain/wizard/store/stage-1
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { BranchData } from '../../types';

/**
 * Стан базової інформації замовлення (Stage 1.2)
 */
interface OrderBasicInfoState {
  // Receipt information
  receiptNumber: string | null;
  tagNumber: string | null;
  isTagNumberManual: boolean;

  // Branch selection
  selectedBranch: BranchData | null;
  availableBranches: BranchData[];
  isBranchesLoading: boolean;

  // Dates
  createdDate: Date;
  estimatedCompletionDate: Date | null;

  // Generation flags
  isReceiptNumberGenerating: boolean;
  isTagNumberGenerating: boolean;

  // Validation
  basicInfoValidationErrors: Record<string, string[]>;
  isBasicInfoValid: boolean;
}

/**
 * Дії для базової інформації замовлення
 */
interface OrderBasicInfoActions {
  // Receipt information actions
  setReceiptNumber: (receiptNumber: string) => void;
  generateReceiptNumber: () => Promise<void>;
  setTagNumber: (tagNumber: string, isManual?: boolean) => void;
  generateTagNumber: () => Promise<void>;
  scanTagNumber: () => Promise<void>;

  // Branch selection actions
  setSelectedBranch: (branch: BranchData | null) => void;
  setAvailableBranches: (branches: BranchData[]) => void;
  setBranchesLoading: (loading: boolean) => void;
  loadBranches: () => Promise<void>;

  // Dates actions
  setCreatedDate: (date: Date) => void;
  setEstimatedCompletionDate: (date: Date | null) => void;
  calculateEstimatedDate: () => void;

  // Generation actions
  setReceiptNumberGenerating: (generating: boolean) => void;
  setTagNumberGenerating: (generating: boolean) => void;

  // Validation actions
  setBasicInfoValidationErrors: (field: string, errors: string[]) => void;
  clearBasicInfoValidationErrors: (field: string) => void;
  validateBasicInfo: () => void;
  setBasicInfoValid: (valid: boolean) => void;

  // Reset actions
  resetOrderBasicInfo: () => void;
}

/**
 * Початковий стан базової інформації замовлення
 */
const initialOrderBasicInfoState: OrderBasicInfoState = {
  receiptNumber: null,
  tagNumber: null,
  isTagNumberManual: false,
  selectedBranch: null,
  availableBranches: [],
  isBranchesLoading: false,
  createdDate: new Date(),
  estimatedCompletionDate: null,
  isReceiptNumberGenerating: false,
  isTagNumberGenerating: false,
  basicInfoValidationErrors: {},
  isBasicInfoValid: false,
};

/**
 * Order Basic Info Slice Store
 *
 * Відповідальність:
 * - Генерація номера квитанції
 * - Управління унікальною міткою (мануальна/сканування)
 * - Вибір пункту прийому (філії)
 * - Дати створення та оцінка термінів
 * - Валідація базової інформації
 *
 * Інтеграція:
 * - Orval типи для BranchData
 * - API для генерації номерів
 * - QR/Barcode сканування для міток
 * - Сервіси розрахунку дат
 */
export const useOrderBasicInfoStore = create<OrderBasicInfoState & OrderBasicInfoActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialOrderBasicInfoState,

      // Receipt information actions
      setReceiptNumber: (receiptNumber) => {
        set({ receiptNumber }, false, 'orderBasicInfo/setReceiptNumber');
        get().validateBasicInfo();
      },

      generateReceiptNumber: async () => {
        set(
          { isReceiptNumberGenerating: true },
          false,
          'orderBasicInfo/generateReceiptNumber/start'
        );

        try {
          // Тут буде API виклик для генерації номера
          // const receiptNumber = await generateReceiptNumber();

          // Мок для демонстрації
          await new Promise((resolve) => setTimeout(resolve, 500));
          const mockReceiptNumber = `R${Date.now().toString().slice(-6)}`;

          set(
            { receiptNumber: mockReceiptNumber },
            false,
            'orderBasicInfo/generateReceiptNumber/success'
          );
          get().validateBasicInfo();
        } catch (error) {
          get().setBasicInfoValidationErrors('receiptNumber', [
            'Помилка генерації номера квитанції',
          ]);
        } finally {
          set(
            { isReceiptNumberGenerating: false },
            false,
            'orderBasicInfo/generateReceiptNumber/complete'
          );
        }
      },

      setTagNumber: (tagNumber, isManual = true) => {
        set({ tagNumber, isTagNumberManual: isManual }, false, 'orderBasicInfo/setTagNumber');
        get().validateBasicInfo();
      },

      generateTagNumber: async () => {
        set({ isTagNumberGenerating: true }, false, 'orderBasicInfo/generateTagNumber/start');

        try {
          // Тут буде API виклик для генерації унікальної мітки
          // const tagNumber = await generateTagNumber();

          // Мок для демонстрації
          await new Promise((resolve) => setTimeout(resolve, 300));
          const mockTagNumber = `TAG${Date.now().toString().slice(-8)}`;

          set(
            { tagNumber: mockTagNumber, isTagNumberManual: false },
            false,
            'orderBasicInfo/generateTagNumber/success'
          );
          get().validateBasicInfo();
        } catch (error) {
          get().setBasicInfoValidationErrors('tagNumber', ['Помилка генерації унікальної мітки']);
        } finally {
          set({ isTagNumberGenerating: false }, false, 'orderBasicInfo/generateTagNumber/complete');
        }
      },

      scanTagNumber: async () => {
        set({ isTagNumberGenerating: true }, false, 'orderBasicInfo/scanTagNumber/start');

        try {
          // Тут буде інтеграція з QR/Barcode scanner
          // const scannedTag = await scanQRCode();

          // Мок для демонстрації
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const mockScannedTag = `SCAN${Date.now().toString().slice(-8)}`;

          set(
            { tagNumber: mockScannedTag, isTagNumberManual: false },
            false,
            'orderBasicInfo/scanTagNumber/success'
          );
          get().validateBasicInfo();
        } catch (error) {
          get().setBasicInfoValidationErrors('tagNumber', ['Помилка сканування унікальної мітки']);
        } finally {
          set({ isTagNumberGenerating: false }, false, 'orderBasicInfo/scanTagNumber/complete');
        }
      },

      // Branch selection actions
      setSelectedBranch: (branch) => {
        set({ selectedBranch: branch }, false, 'orderBasicInfo/setSelectedBranch');
        get().validateBasicInfo();
      },

      setAvailableBranches: (branches) => {
        set({ availableBranches: branches }, false, 'orderBasicInfo/setAvailableBranches');
      },

      setBranchesLoading: (loading) => {
        set({ isBranchesLoading: loading }, false, 'orderBasicInfo/setBranchesLoading');
      },

      loadBranches: async () => {
        set({ isBranchesLoading: true }, false, 'orderBasicInfo/loadBranches/start');

        try {
          // Тут буде API виклик для завантаження філій
          // const branches = await getBranchLocations();

          // Мок для демонстрації
          await new Promise((resolve) => setTimeout(resolve, 800));
          const mockBranches = [
            { id: '1', name: 'Філія Центр', address: 'вул. Центральна, 1', code: 'CTR' },
            { id: '2', name: 'Філія Північ', address: 'вул. Північна, 2', code: 'NTH' },
            { id: '3', name: 'Філія Південь', address: 'вул. Південна, 3', code: 'STH' },
          ] as BranchData[];

          set({ availableBranches: mockBranches }, false, 'orderBasicInfo/loadBranches/success');
        } catch (error) {
          get().setBasicInfoValidationErrors('branch', ['Помилка завантаження філій']);
        } finally {
          set({ isBranchesLoading: false }, false, 'orderBasicInfo/loadBranches/complete');
        }
      },

      // Dates actions
      setCreatedDate: (date) => {
        set({ createdDate: date }, false, 'orderBasicInfo/setCreatedDate');
      },

      setEstimatedCompletionDate: (date) => {
        set({ estimatedCompletionDate: date }, false, 'orderBasicInfo/setEstimatedCompletionDate');
      },

      calculateEstimatedDate: () => {
        // Розрахунок орієнтовної дати на основі стандартних термінів (48 год)
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + 2);

        set(
          { estimatedCompletionDate: estimatedDate },
          false,
          'orderBasicInfo/calculateEstimatedDate'
        );
      },

      // Generation actions
      setReceiptNumberGenerating: (generating) => {
        set(
          { isReceiptNumberGenerating: generating },
          false,
          'orderBasicInfo/setReceiptNumberGenerating'
        );
      },

      setTagNumberGenerating: (generating) => {
        set({ isTagNumberGenerating: generating }, false, 'orderBasicInfo/setTagNumberGenerating');
      },

      // Validation actions
      setBasicInfoValidationErrors: (field, errors) => {
        set(
          (state) => ({
            basicInfoValidationErrors: {
              ...state.basicInfoValidationErrors,
              [field]: errors,
            },
          }),
          false,
          'orderBasicInfo/setBasicInfoValidationErrors'
        );
        get().validateBasicInfo();
      },

      clearBasicInfoValidationErrors: (field) => {
        set(
          (state) => {
            const { [field]: removed, ...rest } = state.basicInfoValidationErrors;
            return { basicInfoValidationErrors: rest };
          },
          false,
          'orderBasicInfo/clearBasicInfoValidationErrors'
        );
        get().validateBasicInfo();
      },

      validateBasicInfo: () => {
        const state = get();
        const errors: string[] = [];

        if (!state.receiptNumber) {
          errors.push("Номер квитанції обов'язковий");
        }

        if (!state.selectedBranch) {
          errors.push("Пункт прийому обов'язковий");
        }

        const hasValidationErrors = Object.values(state.basicInfoValidationErrors).some(
          (fieldErrors) => fieldErrors.length > 0
        );

        const isValid = errors.length === 0 && !hasValidationErrors;
        set({ isBasicInfoValid: isValid }, false, 'orderBasicInfo/validateBasicInfo');
      },

      setBasicInfoValid: (valid) => {
        set({ isBasicInfoValid: valid }, false, 'orderBasicInfo/setBasicInfoValid');
      },

      // Reset actions
      resetOrderBasicInfo: () => {
        set(initialOrderBasicInfoState, false, 'orderBasicInfo/resetOrderBasicInfo');
      },
    }),
    {
      name: 'order-basic-info-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type OrderBasicInfoStore = ReturnType<typeof useOrderBasicInfoStore>;
