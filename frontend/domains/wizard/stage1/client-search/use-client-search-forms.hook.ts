/**
 * @fileoverview Форми хук для домену "Пошук клієнтів"
 *
 * Відповідальність: тільки управління формами та валідація
 * Принцип: Single Responsibility Principle
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  searchFormSchema,
  phoneFormSchema,
  type SearchFormData,
  type PhoneFormData,
} from './client-search.schemas';
import { useClientSearchStore } from './client-search.store';

/**
 * Хук для управління формами пошуку клієнтів
 * Інкапсулює всю логіку форм і валідації
 */
export const useClientSearchForms = () => {
  const { sessionId, searchTerm, phoneNumber } = useClientSearchStore();

  // React Hook Form для загального пошуку
  const searchForm = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    values: {
      searchTerm: searchTerm || '',
      sessionId: sessionId || '',
    },
    mode: 'onChange',
  });

  // React Hook Form для пошуку за телефоном
  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneFormSchema),
    values: {
      phoneNumber: phoneNumber || '',
      sessionId: sessionId || '',
    },
    mode: 'onChange',
  });

  return {
    // Основна форма пошуку
    search: searchForm,

    // Форма пошуку за телефоном
    phone: phoneForm,
  };
};

export type UseClientSearchFormsReturn = ReturnType<typeof useClientSearchForms>;
