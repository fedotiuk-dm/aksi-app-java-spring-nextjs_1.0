/**
 * @fileoverview Універсальний хук інтеграції React Hook Form + Zod + Zustand
 * @module domain/wizard/hooks/shared
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ZodSchema, ZodError } from 'zod';

import { useWizardStore } from '../../store';

/**
 * Універсальний хук для інтеграції ваших Zod схем з React Hook Form
 *
 * Автоматично:
 * - Інтегрує Zod валідацію з React Hook Form
 * - Синхронізує помилки з Zustand стором
 * - Обробляє стан завантаження
 */
export const useWizardForm = <T extends Record<string, unknown>>(
  schema: ZodSchema<T>,
  options?: Parameters<typeof useForm<T>>[0]
) => {
  const { addError, clearErrors, setLoading } = useWizardStore();

  const formMethods = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    ...options,
  });

  const submitWithValidation = useCallback(
    (onValid: (data: T) => Promise<void> | void) => async (data: T) => {
      try {
        clearErrors();
        setLoading(true);

        // Повторна валідація через схему (додаткова безпека)
        schema.parse(data);

        await onValid(data);
      } catch (error) {
        if (error instanceof ZodError) {
          error.errors.forEach((err) => {
            addError(`${err.path.join('.')}: ${err.message}`);
          });
        } else if (error instanceof Error) {
          addError(error.message);
        } else {
          addError('Невідома помилка при обробці форми');
        }
      } finally {
        setLoading(false);
      }
    },
    [schema, addError, clearErrors, setLoading]
  );

  return {
    ...formMethods,
    submitWithValidation,
  };
};
