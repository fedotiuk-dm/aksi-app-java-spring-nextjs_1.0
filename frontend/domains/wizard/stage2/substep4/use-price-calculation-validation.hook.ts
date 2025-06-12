/**
 * @fileoverview Хук для валідації Substep4 Price Calculation
 *
 * Відповідальність: валідація даних та бізнес-правил
 * Принцип: Single Responsibility Principle
 */

import { useMemo, useCallback } from 'react';

import { usePriceCalculationStore } from './price-calculation.store';

/**
 * Інтерфейс для результату валідації
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  canProceed: boolean;
}

/**
 * Інтерфейс для хука валідації
 */
export interface UsePriceCalculationValidationReturn {
  // Результати валідації
  validation: {
    overall: ValidationResult;
    basePrice: ValidationResult;
    modifiers: ValidationResult;
    calculation: ValidationResult;
    business: ValidationResult;
  };

  // Методи валідації
  validate: {
    all: () => ValidationResult;
    basePrice: () => ValidationResult;
    modifiers: () => ValidationResult;
    calculation: () => ValidationResult;
    businessRules: () => ValidationResult;
  };

  // Утиліти
  getFirstError: () => string | null;
  getFirstWarning: () => string | null;
  hasErrors: boolean;
  hasWarnings: boolean;
  canProceed: boolean;
}

/**
 * Хук для валідації Substep4 Price Calculation
 */
export const usePriceCalculationValidation = (): UsePriceCalculationValidationReturn => {
  const store = usePriceCalculationStore();

  // Валідація базової ціни
  const validateBasePrice = useCallback((): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (store.basePrice <= 0) {
      errors.push('Базова ціна повинна бути більше 0');
    }

    if (store.quantity <= 0) {
      errors.push('Кількість повинна бути більше 0');
    }

    if (store.quantity > 1000) {
      warnings.push('Велика кількість предметів. Перевірте правильність');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0,
    };
  }, [store.basePrice, store.quantity]);

  // Валідація модифікаторів
  const validateModifiers = useCallback((): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (store.selectedModifiers.length > 10) {
      warnings.push('Багато модифікаторів може ускладнити розрахунок');
    }

    // Перевірка конфліктуючих модифікаторів
    const conflictingModifiers = ['MOD_URGENT_50', 'MOD_URGENT_100'];
    const selectedConflicting = store.selectedModifiers.filter((id) =>
      conflictingModifiers.includes(id)
    );

    if (selectedConflicting.length > 1) {
      errors.push('Не можна вибрати кілька модифікаторів терміновості одночасно');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0,
    };
  }, [store.selectedModifiers]);

  // Валідація розрахунку
  const validateCalculation = useCallback((): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (store.finalPrice <= 0) {
      errors.push('Фінальна ціна повинна бути більше 0');
    }

    if (store.discountPercentage < 0 || store.discountPercentage > 50) {
      errors.push('Знижка повинна бути від 0% до 50%');
    }

    if (store.urgencyPercentage < 0 || store.urgencyPercentage > 200) {
      errors.push('Надбавка за терміновість повинна бути від 0% до 200%');
    }

    if (store.finalPrice > store.basePrice * 5) {
      warnings.push('Фінальна ціна значно перевищує базову. Перевірте розрахунок');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0,
    };
  }, [store.finalPrice, store.basePrice, store.discountPercentage, store.urgencyPercentage]);

  // Валідація бізнес-правил
  const validateBusinessRules = useCallback((): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Правило: знижки не поширюються на деякі категорії
    if (store.discountPercentage > 0 && store.categoryCode === 'IRONING') {
      errors.push('Знижки не поширюються на прасування');
    }

    // Правило: мінімальна вартість замовлення
    if (store.finalPrice < 50) {
      warnings.push('Мінімальна вартість замовлення 50 грн');
    }

    // Правило: максимальна терміновість
    if (store.urgencyPercentage > 100 && !store.isUrgentConfirmed) {
      warnings.push('Висока надбавка за терміновість потребує підтвердження');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0,
    };
  }, [
    store.discountPercentage,
    store.categoryCode,
    store.finalPrice,
    store.urgencyPercentage,
    store.isUrgentConfirmed,
  ]);

  // Загальна валідація
  const validateAll = useCallback((): ValidationResult => {
    const basePriceResult = validateBasePrice();
    const modifiersResult = validateModifiers();
    const calculationResult = validateCalculation();
    const businessResult = validateBusinessRules();

    const allErrors = [
      ...basePriceResult.errors,
      ...modifiersResult.errors,
      ...calculationResult.errors,
      ...businessResult.errors,
    ];

    const allWarnings = [
      ...basePriceResult.warnings,
      ...modifiersResult.warnings,
      ...calculationResult.warnings,
      ...businessResult.warnings,
    ];

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      canProceed: allErrors.length === 0,
    };
  }, [validateBasePrice, validateModifiers, validateCalculation, validateBusinessRules]);

  // Мемоізовані результати валідації
  const validation = useMemo(
    () => ({
      overall: validateAll(),
      basePrice: validateBasePrice(),
      modifiers: validateModifiers(),
      calculation: validateCalculation(),
      business: validateBusinessRules(),
    }),
    [validateAll, validateBasePrice, validateModifiers, validateCalculation, validateBusinessRules]
  );

  // Утиліти
  const getFirstError = useCallback((): string | null => {
    return validation.overall.errors[0] || null;
  }, [validation.overall.errors]);

  const getFirstWarning = useCallback((): string | null => {
    return validation.overall.warnings[0] || null;
  }, [validation.overall.warnings]);

  const hasErrors = useMemo(
    () => validation.overall.errors.length > 0,
    [validation.overall.errors]
  );
  const hasWarnings = useMemo(
    () => validation.overall.warnings.length > 0,
    [validation.overall.warnings]
  );
  const canProceed = useMemo(() => validation.overall.canProceed, [validation.overall.canProceed]);

  return {
    validation,
    validate: {
      all: validateAll,
      basePrice: validateBasePrice,
      modifiers: validateModifiers,
      calculation: validateCalculation,
      businessRules: validateBusinessRules,
    },
    getFirstError,
    getFirstWarning,
    hasErrors,
    hasWarnings,
    canProceed,
  };
};
