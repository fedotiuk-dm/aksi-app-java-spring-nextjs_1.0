/**
 * @fileoverview Хук для централізованої обробки помилок в Order Wizard
 *
 * Забезпечує уніфіковану обробку помилок з можливістю показу
 * користувацьких повідомлень та автоматичного відновлення.
 */

import { useState, useCallback, useRef, useEffect } from 'react';

import type { ErrorResponse } from '@/shared/api/generated/full';

/**
 * Типи деталей помилок для різних категорій
 */
export type ErrorDetails =
  | ErrorResponse
  | Error
  | { [key: string]: unknown }
  | string
  | null
  | undefined;

/**
 * Базова структура помилки в Order Wizard
 */
export interface WizardError {
  id: string;
  type: 'api' | 'validation' | 'network' | 'unknown';
  message: string;
  details?: ErrorDetails;
  timestamp: Date;
  stage?: number;
  autoRetry?: boolean;
  retryCount?: number;
}

/**
 * Стан системи обробки помилок
 */
export interface ErrorHandlingState {
  errors: WizardError[];
  hasErrors: boolean;
  criticalError: WizardError | null;
  isRetrying: boolean;
}

/**
 * Дії для управління помилками
 */
export interface ErrorHandlingActions {
  addError: (error: Partial<WizardError>) => string;
  removeError: (errorId: string) => void;
  clearErrors: () => void;
  clearErrorsForStage: (stage: number) => void;
  retryLastOperation: () => Promise<void>;
  handleApiError: (error: ErrorResponse | Error, stage?: number) => string;
  handleValidationError: (message: string, details?: ErrorDetails, stage?: number) => string;
  setLastOperation: (operation: () => Promise<void>) => void;
}

export type ErrorHandling = ErrorHandlingState & ErrorHandlingActions;

const AUTO_CLEAR_TIMEOUT = 5000; // 5 секунд

// Перевірка чи є помилка ErrorResponse
const isErrorResponse = (error: unknown): error is ErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('status' in error || 'message' in error || 'error' in error)
  );
};

// Перевірка чи є помилка стандартним Error
const isStandardError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export const useErrorHandling = (): ErrorHandling => {
  const [state, setState] = useState<ErrorHandlingState>({
    errors: [],
    hasErrors: false,
    criticalError: null,
    isRetrying: false,
  });

  const lastOperationRef = useRef<(() => Promise<void>) | null>(null);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Генерація унікального ID для помилки
  const generateErrorId = useCallback((): string => {
    return `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  // Додавання помилки
  const addError = useCallback(
    (errorInput: Partial<WizardError>): string => {
      const errorId = generateErrorId();
      const newError: WizardError = {
        id: errorId,
        type: 'unknown',
        message: 'Невідома помилка',
        timestamp: new Date(),
        ...errorInput,
      };

      setState((prev) => {
        const errors = [...prev.errors, newError];
        const criticalError =
          newError.type === 'api' && !prev.criticalError ? newError : prev.criticalError;

        return {
          ...prev,
          errors,
          hasErrors: true,
          criticalError,
        };
      });

      // Логування в development
      if (process.env.NODE_ENV === 'development') {
        console.error('🚨 Order Wizard Error:', newError);
      }

      return errorId;
    },
    [generateErrorId]
  );

  // Видалення помилки
  const removeError = useCallback((errorId: string) => {
    // Очищуємо таймаут якщо є
    const timeout = timeoutsRef.current.get(errorId);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(errorId);
    }

    setState((prev) => {
      const errors = prev.errors.filter((error) => error.id !== errorId);
      const criticalError = prev.criticalError?.id === errorId ? null : prev.criticalError;

      return {
        ...prev,
        errors,
        hasErrors: errors.length > 0,
        criticalError,
      };
    });
  }, []);

  // Автоматичне видалення некритичних помилок
  useEffect(() => {
    const lastError = state.errors[state.errors.length - 1];
    if (lastError && lastError.type !== 'api') {
      const timeout = setTimeout(() => {
        removeError(lastError.id);
      }, AUTO_CLEAR_TIMEOUT);

      timeoutsRef.current.set(lastError.id, timeout);
    }
  }, [state.errors, removeError]);

  // Очищення всіх помилок
  const clearErrors = useCallback(() => {
    // Очищуємо всі таймаути
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();

    setState({
      errors: [],
      hasErrors: false,
      criticalError: null,
      isRetrying: false,
    });
  }, []);

  // Очищення помилок для конкретного етапу
  const clearErrorsForStage = useCallback((stage: number) => {
    setState((prev) => {
      const errors = prev.errors.filter((error) => error.stage !== stage);
      const criticalError = prev.criticalError?.stage === stage ? null : prev.criticalError;

      return {
        ...prev,
        errors,
        hasErrors: errors.length > 0,
        criticalError,
      };
    });
  }, []);

  // Повторна спроба останньої операції
  const retryLastOperation = useCallback(async () => {
    if (!lastOperationRef.current) return;

    setState((prev) => ({ ...prev, isRetrying: true }));

    try {
      await lastOperationRef.current();
      // Очищуємо помилки після успішного повтору
      clearErrors();
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setState((prev) => ({ ...prev, isRetrying: false }));
    }
  }, [clearErrors]);

  // Обробка API помилок
  const handleApiError = useCallback(
    (error: ErrorResponse | Error, stage?: number): string => {
      let message = 'Помилка при виконанні запиту';
      let details: ErrorDetails = error;

      if (isStandardError(error)) {
        message = error.message || message;
      } else if (isErrorResponse(error)) {
        if (error.message) {
          message = error.message;
        } else if (error.error) {
          message = error.error;
        }
      }

      // Визначаємо чи потрібен автоматичний повтор
      const isRetryable = isErrorResponse(error)
        ? error.status === 500 || error.status === 503 || error.status === 408
        : false;

      return addError({
        type: 'api',
        message,
        details,
        stage,
        autoRetry: isRetryable,
        retryCount: 0,
      });
    },
    [addError]
  );

  // Обробка помилок валідації
  const handleValidationError = useCallback(
    (message: string, details?: ErrorDetails, stage?: number): string => {
      return addError({
        type: 'validation',
        message,
        details,
        stage,
      });
    },
    [addError]
  );

  // Збереження останньої операції для повтору
  const setLastOperation = useCallback((operation: () => Promise<void>) => {
    lastOperationRef.current = operation;
  }, []);

  // Очищення таймаутів при размонтуванні
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  return {
    // Стан
    ...state,

    // Дії
    addError,
    removeError,
    clearErrors,
    clearErrorsForStage,
    retryLastOperation,
    handleApiError,
    handleValidationError,
    setLastOperation,
  };
};
