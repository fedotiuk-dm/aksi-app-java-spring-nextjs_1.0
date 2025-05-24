/**
 * Загальні утиліти для Order Wizard
 */

import {
  WIZARD_STEPS_ORDER,
  ITEM_WIZARD_STEPS_ORDER,
  getStepIndex,
  getItemStepIndex,
} from '../constants/steps.constants';
import {
  WizardStep,
  ItemWizardStep,
  ValidationStatus,
  WizardOperationResult,
  WizardStepState,
} from '../types/wizard-common.types';

// Генерація унікального ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Генерація номера квитанції
export const generateReceiptNumber = (): string => {
  const prefix = 'RC';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Генерація session ID
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
};

// Форматування дати для відображення
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Форматування дати та часу
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Форматування ціни
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Форматування номера телефону
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('38')) {
    const national = cleaned.slice(2);
    return `+38 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6, 8)}-${national.slice(8, 10)}`;
  }
  return phone;
};

// Розрахунок прогресу
export const calculateWizardProgress = (
  currentStep: WizardStep,
  completedSteps: WizardStep[]
): number => {
  const currentIndex = getStepIndex(currentStep);
  const completedCount = completedSteps.length;
  const totalSteps = WIZARD_STEPS_ORDER.length;

  // Прогрес = (завершені кроки + прогрес поточного кроку) / загальна кількість
  const currentStepProgress = currentIndex >= 0 ? 0.5 : 0; // 50% за початок кроку
  return ((completedCount + currentStepProgress) / totalSteps) * 100;
};

// Розрахунок прогресу Item Wizard
export const calculateItemWizardProgress = (
  currentStep: ItemWizardStep,
  completedSteps: ItemWizardStep[]
): number => {
  const currentIndex = getItemStepIndex(currentStep);
  const completedCount = completedSteps.length;
  const totalSteps = ITEM_WIZARD_STEPS_ORDER.length;

  const currentStepProgress = currentIndex >= 0 ? 0.5 : 0;
  return ((completedCount + currentStepProgress) / totalSteps) * 100;
};

// Перевірка валідності кроку
export const isStepValid = (
  step: WizardStep,
  stepValidations: Record<WizardStep, WizardStepState>
): boolean => {
  const validation = stepValidations[step];
  return validation?.isValid === true && validation?.validationStatus === ValidationStatus.VALID;
};

// Отримання всіх помилок валідації
export const getAllValidationErrors = (
  stepValidations: Record<WizardStep, WizardStepState>
): string[] => {
  const errors: string[] = [];

  Object.values(stepValidations).forEach((validation) => {
    if (validation.errors && Array.isArray(validation.errors)) {
      errors.push(...validation.errors);
    }
  });

  return errors;
};

// Перевірка можливості переходу на наступний крок
export const canProceedToNextStep = (
  currentStep: WizardStep,
  stepValidations: Record<WizardStep, WizardStepState>
): boolean => {
  return isStepValid(currentStep, stepValidations);
};

// Створення результату операції
export const createOperationResult = <T = void>(
  success: boolean,
  data?: T,
  errors?: string[],
  warnings?: string[]
): WizardOperationResult<T> => {
  return {
    success,
    data,
    errors,
    warnings,
  };
};

// Дебаунс функція
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Тротлінг функція
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Глибоке клонування об'єкта
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
};

// Перевірка на пустий об'єкт
export const isEmpty = (obj: unknown): boolean => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string') return obj.trim() === '';
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Безпечний доступ до вкладених властивостей
export const get = (obj: unknown, path: string, defaultValue?: unknown): unknown => {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== 'object' || !(key in result)) {
      return defaultValue;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return result;
};
