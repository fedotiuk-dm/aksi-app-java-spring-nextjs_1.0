import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Хук для відкладеного виконання функції (debounce)
 * @param callback - функція, яка буде викликана після затримки
 * @param delay - затримка в мілісекундах
 */
export function useDebounce<T>(
  callback: (value: string) => Promise<T | null>,
  delay: number = 500
) {
  const [value, setValue] = useState<string>('');
  const [lastValue, setLastValue] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const inProgress = useRef<boolean>(false);

  /**
   * Функція для виконання відкладеної дії
   */
  const executeAction = useCallback(
    async (currentValue: string) => {
      // Якщо запит вже виконується, пропускаємо його
      if (inProgress.current) {
        return;
      }

      // Валідація значення (мінімум 2 символи)
      if (currentValue.length >= 2) {
        // Встановлюємо прапорець, що запит почався
        inProgress.current = true;
        setIsProcessing(true);
        setValidationMessage(null);
        setError(null);
        setLastValue(currentValue);

        try {
          await callback(currentValue);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Помилка під час виконання';
          setError(errorMessage);
        } finally {
          setIsProcessing(false);
          inProgress.current = false;
        }
      } else if (currentValue.length === 0 && lastValue.length > 0) {
        // Якщо поле очищено, виконуємо пошук з пустим значенням
        setLastValue('');
        setValidationMessage(null);
        try {
          await callback('');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Помилка під час виконання';
          setError(errorMessage);
        }
      } else if (currentValue.length === 1) {
        // Встановлюємо повідомлення валідації
        setValidationMessage('Введіть щонайменше 2 символи');
      }
    },
    [callback, lastValue]
  );

  // Ефект для відкладеного виклику функції
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value !== lastValue) {
        void executeAction(value);
      }
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, lastValue, executeAction, delay]);

  // Функція для зміни значення
  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  // Функція для скидання
  const reset = useCallback(() => {
    setValue('');
    setLastValue('');
    setValidationMessage(null);
    setError(null);
  }, []);

  return {
    value,
    lastValue,
    isProcessing,
    error,
    validationMessage,
    handleChange,
    reset,
    setValue
  };
}
