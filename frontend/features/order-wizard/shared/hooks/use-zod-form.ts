'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { formatZodErrors, ValidationErrors } from '../schemas/common.schema';

import type { UseFormProps, FieldValues, UseFormReturn } from 'react-hook-form';

interface UseZodFormProps<TFormValues extends FieldValues> {
  schema: z.ZodSchema<TFormValues>;
  formOptions?: Omit<UseFormProps<TFormValues>, 'resolver'>;
  onValid?: (data: TFormValues) => void;
  onInvalid?: (errors: ValidationErrors) => void;
}

type UseZodFormReturn<TFormValues extends FieldValues> = UseFormReturn<TFormValues> & {
  formErrors: ValidationErrors;
  clearErrors: () => void;
  onSubmit: () => void;
};

/**
 * Хук для інтеграції Zod схем з React Hook Form
 *
 * @param schema - Zod схема для валідації форми
 * @param formOptions - додаткові опції для useForm
 * @param onValid - колбек, що викликається при успішній валідації
 * @param onInvalid - колбек, що викликається при помилках валідації
 */
export function useZodForm<TFormValues extends FieldValues>({
  schema,
  formOptions = {},
  onValid,
  onInvalid,
}: UseZodFormProps<TFormValues>): UseZodFormReturn<TFormValues> {
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  // Підключаємо Zod через zodResolver до React Hook Form
  const formMethods = useForm<TFormValues>({
    ...formOptions,
    resolver: zodResolver(schema),
  });

  // Функція для очищення помилок
  const clearErrors = useCallback(() => {
    formMethods.clearErrors();
    setFormErrors({});
  }, [formMethods]);

  // Створюємо функцію для обробки подання форми
  const onSubmit = () => {
    formMethods.handleSubmit(
      // Успішна валідація
      (data) => {
        setFormErrors({});
        if (onValid) {
          onValid(data);
        }
      },
      // Помилка валідації
      (errors) => {
        // Перевіряємо, чи є помилки від Zod
        const zodErrors = errors.zodError;
        if (
          zodErrors &&
          typeof zodErrors === 'object' &&
          'issues' in zodErrors &&
          Array.isArray(zodErrors.issues)
        ) {
          const formattedErrors = formatZodErrors(zodErrors.issues);
          setFormErrors(formattedErrors);
          if (onInvalid) {
            onInvalid(formattedErrors);
          }
        }
      }
    )();
  };

  // При зміні схеми скидаємо помилки
  useEffect(() => {
    clearErrors();
  }, [schema, clearErrors]);

  return {
    ...formMethods,
    formErrors,
    clearErrors,
    onSubmit,
  };
}

/**
 * Хук для створення форми на основі Zod схем без додаткових колбеків
 * Спрощена версія useZodForm для більш простих форм
 */
export function useSimpleZodForm<TFormValues extends FieldValues>(
  schema: z.ZodSchema<TFormValues>,
  formOptions?: Omit<UseFormProps<TFormValues>, 'resolver'>
): UseZodFormReturn<TFormValues> {
  return useZodForm<TFormValues>({ schema, formOptions });
}
