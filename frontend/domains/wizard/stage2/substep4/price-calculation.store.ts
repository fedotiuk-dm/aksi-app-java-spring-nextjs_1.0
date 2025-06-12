/**
 * @fileoverview Zustand стор для UI стану домену "Розрахунок ціни (Substep4)"
 *
 * Відповідальність: тільки UI стан, НЕ API дані
 * Принцип: Single Responsibility Principle
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

/**
 * Інтерфейс UI стану для розрахунку ціни
 */
interface PriceCalculationUIState {
  // Основний стан
  sessionId: string | null;
  basePrice: number;
  quantity: number;
  unitOfMeasure: string;
  selectedModifiers: string[];
  customModifierName: string;
  customModifierPercentage: number | null;
  customModifierFixedAmount: number | null;

  // Знижки
  discountType: 'percentage' | 'fixed' | 'none';
  discountValue: number;
  discountReason: string;

  // Терміновість
  isUrgent: boolean;
  urgencyLevel: 'normal' | 'urgent_48h' | 'urgent_24h';
  urgencyMultiplier: number;

  // Розрахунки
  modifiersTotal: number;
  discountAmount: number;
  urgencyAmount: number;
  subtotal: number;
  finalPrice: number;

  // Примітки та валідація
  notes: string;
  isCalculationValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];

  // UI стан
  isSubstepCompleted: boolean;
  error: string | null;

  // Режими відображення
  showAdvancedModifiers: boolean;
  showCustomModifier: boolean;
  showDiscountOptions: boolean;
  showPriceBreakdown: boolean;
  showValidationDetails: boolean;
  isCalculating: boolean;
}

/**
 * Інтерфейс дій для UI стану
 */
interface PriceCalculationUIActions {
  // Основні дії
  setSessionId: (sessionId: string | null) => void;
  setBasePrice: (price: number) => void;
  setQuantity: (quantity: number) => void;
  setUnitOfMeasure: (unit: string) => void;
  setSelectedModifiers: (modifiers: string[]) => void;
  addModifier: (modifier: string) => void;
  removeModifier: (modifier: string) => void;
  setCustomModifierName: (name: string) => void;
  setCustomModifierPercentage: (percentage: number | null) => void;
  setCustomModifierFixedAmount: (amount: number | null) => void;

  // Знижки
  setDiscountType: (type: 'percentage' | 'fixed' | 'none') => void;
  setDiscountValue: (value: number) => void;
  setDiscountReason: (reason: string) => void;

  // Терміновість
  setIsUrgent: (urgent: boolean) => void;
  setUrgencyLevel: (level: 'normal' | 'urgent_48h' | 'urgent_24h') => void;
  setUrgencyMultiplier: (multiplier: number) => void;

  // Розрахунки
  setModifiersTotal: (total: number) => void;
  setDiscountAmount: (amount: number) => void;
  setUrgencyAmount: (amount: number) => void;
  setSubtotal: (subtotal: number) => void;
  setFinalPrice: (price: number) => void;

  // Примітки та валідація
  setNotes: (notes: string) => void;
  setCalculationValid: (valid: boolean) => void;
  setValidationErrors: (errors: string[]) => void;
  setValidationWarnings: (warnings: string[]) => void;

  // Стан підетапу
  setSubstepCompleted: (completed: boolean) => void;
  setError: (error: string | null) => void;

  // UI режими
  setShowAdvancedModifiers: (show: boolean) => void;
  setShowCustomModifier: (show: boolean) => void;
  setShowDiscountOptions: (show: boolean) => void;
  setShowPriceBreakdown: (show: boolean) => void;
  setShowValidationDetails: (show: boolean) => void;
  setIsCalculating: (calculating: boolean) => void;

  // Утиліти
  resetPriceCalculation: () => void;
  clearModifiers: () => void;
  clearDiscount: () => void;
  clearUrgency: () => void;
  clearCustomModifier: () => void;
  recalculatePrice: () => void;
}

/**
 * Початковий стан
 */
const initialState: PriceCalculationUIState = {
  // Основний стан
  sessionId: null,
  basePrice: 0,
  quantity: 1,
  unitOfMeasure: '',
  selectedModifiers: [],
  customModifierName: '',
  customModifierPercentage: null,
  customModifierFixedAmount: null,

  // Знижки
  discountType: 'none',
  discountValue: 0,
  discountReason: '',

  // Терміновість
  isUrgent: false,
  urgencyLevel: 'normal',
  urgencyMultiplier: 1,

  // Розрахунки
  modifiersTotal: 0,
  discountAmount: 0,
  urgencyAmount: 0,
  subtotal: 0,
  finalPrice: 0,

  // Примітки та валідація
  notes: '',
  isCalculationValid: false,
  validationErrors: [],
  validationWarnings: [],

  // UI стан
  isSubstepCompleted: false,
  error: null,

  // Режими відображення
  showAdvancedModifiers: false,
  showCustomModifier: false,
  showDiscountOptions: false,
  showPriceBreakdown: true,
  showValidationDetails: false,
  isCalculating: false,
};

/**
 * Zustand стор з subscribeWithSelector middleware
 */
export const usePriceCalculationStore = create<
  PriceCalculationUIState & PriceCalculationUIActions
>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Основні дії
    setSessionId: (sessionId) => set({ sessionId }),
    setBasePrice: (price) => {
      set({ basePrice: price });
      get().recalculatePrice();
    },
    setQuantity: (quantity) => {
      set({ quantity });
      get().recalculatePrice();
    },
    setUnitOfMeasure: (unit) => set({ unitOfMeasure: unit }),

    setSelectedModifiers: (modifiers) => {
      set({ selectedModifiers: modifiers });
      get().recalculatePrice();
    },
    addModifier: (modifier) => {
      const { selectedModifiers } = get();
      if (!selectedModifiers.includes(modifier)) {
        const newModifiers = [...selectedModifiers, modifier];
        set({ selectedModifiers: newModifiers });
        get().recalculatePrice();
      }
    },
    removeModifier: (modifier) => {
      const { selectedModifiers } = get();
      const newModifiers = selectedModifiers.filter((m) => m !== modifier);
      set({ selectedModifiers: newModifiers });
      get().recalculatePrice();
    },

    setCustomModifierName: (name) => set({ customModifierName: name }),
    setCustomModifierPercentage: (percentage) => {
      set({ customModifierPercentage: percentage });
      get().recalculatePrice();
    },
    setCustomModifierFixedAmount: (amount) => {
      set({ customModifierFixedAmount: amount });
      get().recalculatePrice();
    },

    // Знижки
    setDiscountType: (type) => {
      set({ discountType: type });
      if (type === 'none') {
        set({ discountValue: 0, discountReason: '' });
      }
      get().recalculatePrice();
    },
    setDiscountValue: (value) => {
      set({ discountValue: value });
      get().recalculatePrice();
    },
    setDiscountReason: (reason) => set({ discountReason: reason }),

    // Терміновість
    setIsUrgent: (urgent) => {
      set({ isUrgent: urgent });
      if (!urgent) {
        set({ urgencyLevel: 'normal', urgencyMultiplier: 1 });
      }
      get().recalculatePrice();
    },
    setUrgencyLevel: (level) => {
      set({ urgencyLevel: level });
      // Автоматично встановлюємо множник
      const multiplier = level === 'urgent_24h' ? 2 : level === 'urgent_48h' ? 1.5 : 1;
      set({ urgencyMultiplier: multiplier });
      get().recalculatePrice();
    },
    setUrgencyMultiplier: (multiplier) => {
      set({ urgencyMultiplier: multiplier });
      get().recalculatePrice();
    },

    // Розрахунки
    setModifiersTotal: (total) => set({ modifiersTotal: total }),
    setDiscountAmount: (amount) => set({ discountAmount: amount }),
    setUrgencyAmount: (amount) => set({ urgencyAmount: amount }),
    setSubtotal: (subtotal) => set({ subtotal }),
    setFinalPrice: (price) => set({ finalPrice: price }),

    // Примітки та валідація
    setNotes: (notes) => set({ notes }),
    setCalculationValid: (valid) => set({ isCalculationValid: valid }),
    setValidationErrors: (errors) => set({ validationErrors: errors }),
    setValidationWarnings: (warnings) => set({ validationWarnings: warnings }),

    // Стан підетапу
    setSubstepCompleted: (completed) => set({ isSubstepCompleted: completed }),
    setError: (error) => set({ error }),

    // UI режими
    setShowAdvancedModifiers: (show) => set({ showAdvancedModifiers: show }),
    setShowCustomModifier: (show) => {
      set({ showCustomModifier: show });
      if (!show) {
        get().clearCustomModifier();
      }
    },
    setShowDiscountOptions: (show) => set({ showDiscountOptions: show }),
    setShowPriceBreakdown: (show) => set({ showPriceBreakdown: show }),
    setShowValidationDetails: (show) => set({ showValidationDetails: show }),
    setIsCalculating: (calculating) => set({ isCalculating: calculating }),

    // Утиліти
    resetPriceCalculation: () => set(initialState),
    clearModifiers: () => {
      set({ selectedModifiers: [] });
      get().recalculatePrice();
    },
    clearDiscount: () => {
      set({
        discountType: 'none',
        discountValue: 0,
        discountReason: '',
      });
      get().recalculatePrice();
    },
    clearUrgency: () => {
      set({
        isUrgent: false,
        urgencyLevel: 'normal',
        urgencyMultiplier: 1,
      });
      get().recalculatePrice();
    },
    clearCustomModifier: () => {
      set({
        customModifierName: '',
        customModifierPercentage: null,
        customModifierFixedAmount: null,
      });
      get().recalculatePrice();
    },

    // Простий перерахунок ціни (базова логіка)
    recalculatePrice: () => {
      const state = get();
      const {
        basePrice,
        quantity,
        customModifierPercentage,
        customModifierFixedAmount,
        discountType,
        discountValue,
        urgencyMultiplier,
      } = state;

      // Базова сума
      const baseTotal = basePrice * quantity;

      // Модифікатори (спрощена логіка)
      let modifiersTotal = 0;
      if (customModifierPercentage !== null) {
        modifiersTotal += baseTotal * (customModifierPercentage / 100);
      }
      if (customModifierFixedAmount !== null) {
        modifiersTotal += customModifierFixedAmount;
      }

      // Проміжна сума
      const subtotal = baseTotal + modifiersTotal;

      // Знижка
      let discountAmount = 0;
      if (discountType === 'percentage') {
        discountAmount = subtotal * (discountValue / 100);
      } else if (discountType === 'fixed') {
        discountAmount = discountValue;
      }

      // Терміновість
      const urgencyAmount = subtotal * (urgencyMultiplier - 1);

      // Фінальна ціна
      const finalPrice = Math.max(0, subtotal - discountAmount + urgencyAmount);

      // Валідація
      const isValid = basePrice > 0 && quantity > 0 && finalPrice >= 0;

      set({
        modifiersTotal,
        discountAmount,
        urgencyAmount,
        subtotal,
        finalPrice,
        isCalculationValid: isValid,
        isSubstepCompleted: isValid,
      });
    },
  }))
);
