/**
 * @fileoverview Форми хук для домену "Створення клієнта"
 *
 * Відповідальність: тільки управління формами та валідація
 * Принцип: Single Responsibility Principle
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  clientCreationUIFormSchema,
  type ClientCreationUIFormData,
} from './client-creation.schemas';
import { useClientCreationStore } from './client-creation.store';

/**
 * Хук для управління формами створення клієнта
 * Інкапсулює всю логіку форм і валідації
 */
export const useClientCreationForms = () => {
  const { formData } = useClientCreationStore();

  // React Hook Form з Zod валідацією
  const creationForm = useForm<ClientCreationUIFormData>({
    resolver: zodResolver(clientCreationUIFormSchema),
    values: formData as ClientCreationUIFormData,
    mode: 'onChange',
  });

  return {
    // Основна форма створення клієнта
    creation: creationForm,

    // Можна додати інші форми у майбутньому
    // validation: validationForm,
    // confirmation: confirmationForm,
  };
};

export type UseClientCreationFormsReturn = ReturnType<typeof useClientCreationForms>;
