import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { CreateClient, EditClient, SimpleClient } from '../schemas';

interface FormError {
  field: string;
  message: string;
}

type FormType = ReturnType<typeof useForm<CreateClient>> | ReturnType<typeof useForm<EditClient>> | ReturnType<typeof useForm<SimpleClient>>;

interface UseClientFormValidationProps {
  form: FormType;
}

/**
 * Хук для валідації форми клієнта
 * Відповідає за обробку помилок валідації
 */
export const useClientFormValidation = ({ form }: UseClientFormValidationProps) => {
  /**
   * Форматування помилок валідації в зручну для відображення структуру
   */
  const getValidationErrors = useCallback((): FormError[] => {
    const { errors } = form.formState;
    return Object.entries(errors).map(([field, error]) => ({
      field,
      message: error?.message || `Помилка в полі ${field}`,
    }));
  }, [form.formState]);

  /**
   * Перевірка чи форма валідна
   */
  const isFormValid = useCallback((): boolean => {
    return form.formState.isValid;
  }, [form.formState.isValid]);

  /**
   * Отримання окремої помилки для конкретного поля
   */
  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      // Використовуємо безпечний доступ до елементів об'єкту помилок
      const errors = form.formState.errors as Record<string, { message?: string }>;
      const error = errors[fieldName];
      return error?.message;
    },
    [form.formState.errors]
  );

  return {
    getValidationErrors,
    isFormValid,
    getFieldError,
    isDirty: form.formState.isDirty,
    isSubmitted: form.formState.isSubmitted,
    touchedFields: form.formState.touchedFields,
  };
};
