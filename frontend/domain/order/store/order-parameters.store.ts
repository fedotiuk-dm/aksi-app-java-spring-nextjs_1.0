/**
 * Zustand Store для Order Parameters домену
 * Управляє станом параметрів замовлення: терміновість, знижки, оплата, нотатки
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { DiscountType, PaymentMethod } from '../types';

import type { UrgencyOption, OrderParametersValidation } from '../types';

/**
 * Стан Order Parameters Store
 */
export interface OrderParametersState {
  // === ПАРАМЕТРИ ВИКОНАННЯ ===
  executionDate: Date | null;
  urgencyOption: UrgencyOption;
  customDeadline: Date | null;
  isUrgent: boolean;

  // === ЗНИЖКИ ===
  discountType: DiscountType;
  discountPercentage: number;
  isDiscountApplicable: boolean;
  discountExclusions: string[]; // категорії що виключені зі знижки

  // === ОПЛАТА ===
  paymentMethod: PaymentMethod;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  prepaymentAmount: number;
  balanceAmount: number;

  // === ДОДАТКОВА ІНФОРМАЦІЯ ===
  orderNotes: string;
  clientRequirements: string;

  // === СТАН ЗАВАНТАЖЕННЯ ===
  isLoading: boolean;
  isSaving: boolean;

  // === ПОМИЛКИ ===
  error: string | null;
  validationErrors: OrderParametersValidation;

  // === ІСТОРІЯ ОПЕРАЦІЙ ===
  operationHistory: string[];
}

/**
 * Дії Order Parameters Store
 */
export interface OrderParametersActions {
  // === ПАРАМЕТРИ ВИКОНАННЯ ===
  setExecutionDate: (date: Date | null) => void;
  setUrgencyOption: (option: UrgencyOption) => void;
  setCustomDeadline: (date: Date | null) => void;
  setIsUrgent: (urgent: boolean) => void;

  // === ЗНИЖКИ ===
  setDiscountType: (type: DiscountType) => void;
  setDiscountPercentage: (percentage: number) => void;
  setIsDiscountApplicable: (applicable: boolean) => void;
  addDiscountExclusion: (category: string) => void;
  removeDiscountExclusion: (category: string) => void;

  // === ОПЛАТА ===
  setPaymentMethod: (method: PaymentMethod) => void;
  setTotalAmount: (amount: number) => void;
  setDiscountAmount: (amount: number) => void;
  setFinalAmount: (amount: number) => void;
  setPrepaymentAmount: (amount: number) => void;
  setBalanceAmount: (amount: number) => void;

  // === ДОДАТКОВА ІНФОРМАЦІЯ ===
  setOrderNotes: (notes: string) => void;
  setClientRequirements: (requirements: string) => void;

  // === СТАН ЗАВАНТАЖЕННЯ ===
  setIsLoading: (loading: boolean) => void;
  setIsSaving: (saving: boolean) => void;

  // === ПОМИЛКИ ===
  setError: (error: string | null) => void;
  clearError: () => void;
  setValidationErrors: (errors: OrderParametersValidation) => void;
  clearValidationErrors: () => void;

  // === ОПЕРАЦІЇ ===
  calculateAmounts: () => void;
  validateParameters: () => boolean;
  recalculateWithDiscount: () => void;
  recalculateWithUrgency: () => void;

  // === ІСТОРІЯ ===
  addToHistory: (operation: string) => void;
  clearHistory: () => void;

  // === СКИДАННЯ ===
  reset: () => void;
  resetToDefaults: () => void;
}

/**
 * Початковий стан
 */
const initialState: OrderParametersState = {
  // Параметри виконання
  executionDate: null,
  urgencyOption: 'STANDARD',
  customDeadline: null,
  isUrgent: false,

  // Знижки
  discountType: DiscountType.NONE,
  discountPercentage: 0,
  isDiscountApplicable: true,
  discountExclusions: [],

  // Оплата
  paymentMethod: PaymentMethod.CASH,
  totalAmount: 0,
  discountAmount: 0,
  finalAmount: 0,
  prepaymentAmount: 0,
  balanceAmount: 0,

  // Додаткова інформація
  orderNotes: '',
  clientRequirements: '',

  // Стан завантаження
  isLoading: false,
  isSaving: false,

  // Помилки
  error: null,
  validationErrors: {},

  // Історія
  operationHistory: [],
};

/**
 * Order Parameters Store
 */
export const useOrderParametersStore = create<OrderParametersState & OrderParametersActions>()(
  subscribeWithSelector((set, get) => ({
    // Початковий стан
    ...initialState,

    // === ПАРАМЕТРИ ВИКОНАННЯ ===

    setExecutionDate: (date) => {
      set({ executionDate: date });
      get().addToHistory(`Встановлено дату виконання: ${date?.toISOString() || 'очищено'}`);
      get().calculateAmounts();
    },

    setUrgencyOption: (option) => {
      set({ urgencyOption: option, isUrgent: option !== 'STANDARD' });
      get().addToHistory(`Встановлено терміновість: ${option}`);
      get().recalculateWithUrgency();
    },

    setCustomDeadline: (date) => {
      set({ customDeadline: date });
      get().addToHistory(`Встановлено індивідуальний дедлайн: ${date?.toISOString() || 'очищено'}`);
    },

    setIsUrgent: (urgent) => {
      set({ isUrgent: urgent });
      if (!urgent) {
        set({ urgencyOption: 'STANDARD' });
      }
      get().addToHistory(`Терміновість: ${urgent ? 'включено' : 'вимкнено'}`);
      get().recalculateWithUrgency();
    },

    // === ЗНИЖКИ ===

    setDiscountType: (type) => {
      const previousType = get().discountType;

      set({ discountType: type });

      // Автоматично встановлюємо відсоток для стандартних знижок
      switch (type) {
        case 'EVERCARD':
          set({ discountPercentage: 10 });
          break;
        case 'SOCIAL_MEDIA':
          set({ discountPercentage: 5 });
          break;
        case 'MILITARY':
          set({ discountPercentage: 10 });
          break;
        case 'NONE':
          set({ discountPercentage: 0 });
          break;
        default:
          // Для OTHER залишаємо поточний відсоток
          break;
      }

      get().addToHistory(`Змінено тип знижки з "${previousType}" на "${type}"`);
      get().recalculateWithDiscount();
    },

    setDiscountPercentage: (percentage) => {
      const clampedPercentage = Math.max(0, Math.min(100, percentage));
      set({ discountPercentage: clampedPercentage });
      get().addToHistory(`Встановлено відсоток знижки: ${clampedPercentage}%`);
      get().recalculateWithDiscount();
    },

    setIsDiscountApplicable: (applicable) => {
      set({ isDiscountApplicable: applicable });
      get().addToHistory(`Знижка ${applicable ? 'доступна' : 'недоступна'}`);
      get().calculateAmounts();
    },

    addDiscountExclusion: (category) => {
      const { discountExclusions } = get();
      if (!discountExclusions.includes(category)) {
        set({ discountExclusions: [...discountExclusions, category] });
        get().addToHistory(`Додано виключення зі знижки: ${category}`);
        get().recalculateWithDiscount();
      }
    },

    removeDiscountExclusion: (category) => {
      const { discountExclusions } = get();
      const filtered = discountExclusions.filter((exc) => exc !== category);
      set({ discountExclusions: filtered });
      get().addToHistory(`Видалено виключення зі знижки: ${category}`);
      get().recalculateWithDiscount();
    },

    // === ОПЛАТА ===

    setPaymentMethod: (method) => {
      set({ paymentMethod: method });
      get().addToHistory(`Встановлено спосіб оплати: ${method}`);
    },

    setTotalAmount: (amount) => {
      set({ totalAmount: Math.max(0, amount) });
      get().calculateAmounts();
    },

    setDiscountAmount: (amount) => {
      set({ discountAmount: Math.max(0, amount) });
      get().calculateAmounts();
    },

    setFinalAmount: (amount) => {
      set({ finalAmount: Math.max(0, amount) });
      get().calculateAmounts();
    },

    setPrepaymentAmount: (amount) => {
      const clampedAmount = Math.max(0, Math.min(get().finalAmount, amount));
      set({ prepaymentAmount: clampedAmount });
      get().calculateAmounts();
    },

    setBalanceAmount: (amount) => {
      set({ balanceAmount: Math.max(0, amount) });
    },

    // === ДОДАТКОВА ІНФОРМАЦІЯ ===

    setOrderNotes: (notes) => {
      set({ orderNotes: notes });
      get().addToHistory(`Оновлено примітки до замовлення`);
    },

    setClientRequirements: (requirements) => {
      set({ clientRequirements: requirements });
      get().addToHistory(`Оновлено вимоги клієнта`);
    },

    // === СТАН ЗАВАНТАЖЕННЯ ===

    setIsLoading: (loading) => set({ isLoading: loading }),

    setIsSaving: (saving) => set({ isSaving: saving }),

    // === ПОМИЛКИ ===

    setError: (error) => {
      set({ error });
      if (error) {
        get().addToHistory(`Помилка: ${error}`);
      }
    },

    clearError: () => set({ error: null }),

    setValidationErrors: (errors) => set({ validationErrors: errors }),

    clearValidationErrors: () => set({ validationErrors: {} }),

    // === ОПЕРАЦІЇ ===

    calculateAmounts: () => {
      const { totalAmount, discountAmount, prepaymentAmount } = get();

      const finalAmount = totalAmount - discountAmount;
      const balanceAmount = finalAmount - prepaymentAmount;

      set({
        finalAmount: Math.max(0, finalAmount),
        balanceAmount: Math.max(0, balanceAmount),
      });
    },

    validateParameters: () => {
      const state = get();
      const errors: OrderParametersValidation = {};

      // Валідація дати виконання
      if (!state.executionDate) {
        errors.executionDate = "Дата виконання обов'язкова";
      } else if (state.executionDate < new Date()) {
        errors.executionDate = 'Дата виконання не може бути в минулому';
      }

      // Валідація знижки
      if (state.discountType !== 'NONE' && state.discountPercentage <= 0) {
        errors.discountPercentage = 'Відсоток знижки повинен бути більше 0';
      }

      // Валідація передоплати
      if (state.prepaymentAmount > state.finalAmount) {
        errors.prepaymentAmount = 'Передоплата не може перевищувати загальну суму';
      }

      set({ validationErrors: errors });
      return Object.keys(errors).length === 0;
    },

    recalculateWithDiscount: () => {
      const { totalAmount, discountType, discountPercentage, isDiscountApplicable } = get();

      if (!isDiscountApplicable || discountType === 'NONE' || discountPercentage <= 0) {
        set({ discountAmount: 0 });
      } else {
        const discountAmount = (totalAmount * discountPercentage) / 100;
        set({ discountAmount });
      }

      get().calculateAmounts();
    },

    recalculateWithUrgency: () => {
      const { urgencyOption, totalAmount } = get();

      let urgencyMultiplier = 1;
      switch (urgencyOption) {
        case 'URGENT_48H':
          urgencyMultiplier = 1.5; // +50%
          break;
        case 'URGENT_24H':
          urgencyMultiplier = 2.0; // +100%
          break;
        default:
          urgencyMultiplier = 1;
          break;
      }

      const newTotalAmount = totalAmount * urgencyMultiplier;
      set({ totalAmount: newTotalAmount });

      get().recalculateWithDiscount();
    },

    // === ІСТОРІЯ ===

    addToHistory: (operation) => {
      const timestamp = new Date().toISOString();
      const entry = `[${timestamp}] ${operation}`;

      set((state) => ({
        operationHistory: [...state.operationHistory, entry].slice(-50), // Зберігаємо останні 50 операцій
      }));
    },

    clearHistory: () => set({ operationHistory: [] }),

    // === СКИДАННЯ ===

    reset: () => {
      set(initialState);
      get().addToHistory('Скинуто всі параметри');
    },

    resetToDefaults: () => {
      const defaultState = {
        ...initialState,
        operationHistory: get().operationHistory, // Зберігаємо історію
      };

      set(defaultState);
      get().addToHistory('Встановлено значення за замовчуванням');
    },
  }))
);

// === СЕЛЕКТОРИ ===

/**
 * Селектори для зручного доступу до частин стану
 */
export const useOrderParametersExecutionParams = () =>
  useOrderParametersStore((state) => ({
    executionDate: state.executionDate,
    urgencyOption: state.urgencyOption,
    customDeadline: state.customDeadline,
    isUrgent: state.isUrgent,
  }));

export const useOrderParametersDiscountParams = () =>
  useOrderParametersStore((state) => ({
    discountType: state.discountType,
    discountPercentage: state.discountPercentage,
    isDiscountApplicable: state.isDiscountApplicable,
    discountExclusions: state.discountExclusions,
  }));

export const useOrderParametersPaymentParams = () =>
  useOrderParametersStore((state) => ({
    paymentMethod: state.paymentMethod,
    totalAmount: state.totalAmount,
    discountAmount: state.discountAmount,
    finalAmount: state.finalAmount,
    prepaymentAmount: state.prepaymentAmount,
    balanceAmount: state.balanceAmount,
  }));

export const useOrderParametersAdditionalInfo = () =>
  useOrderParametersStore((state) => ({
    orderNotes: state.orderNotes,
    clientRequirements: state.clientRequirements,
  }));

export const useOrderParametersStatus = () =>
  useOrderParametersStore((state) => ({
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    error: state.error,
    validationErrors: state.validationErrors,
  }));

export const useOrderParametersHistory = () =>
  useOrderParametersStore((state) => state.operationHistory);
