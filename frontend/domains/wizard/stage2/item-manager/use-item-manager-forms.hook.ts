/**
 * @fileoverview Форми хук для домену "Менеджер предметів Stage2"
 *
 * Відповідальність: тільки управління формами та валідація
 * Принцип: Single Responsibility Principle
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  itemSearchFormSchema,
  itemFilterFormSchema,
  itemManagerSettingsSchema,
  type ItemSearchFormData,
  type ItemFilterFormData,
  type ItemManagerSettingsData,
} from './item-manager.schemas';
import { useItemManagerStore } from './item-manager.store';

/**
 * Хук для управління формами менеджера предметів
 * Інкапсулює всю логіку форм і валідації
 */
export const useItemManagerForms = () => {
  const { searchTerm, activeFilters, settings } = useItemManagerStore();

  // React Hook Form для пошуку предметів
  const searchForm = useForm<ItemSearchFormData>({
    resolver: zodResolver(itemSearchFormSchema),
    defaultValues: {
      searchTerm: searchTerm || '',
    },
    mode: 'onChange',
  });

  // React Hook Form для фільтрації
  const filterForm = useForm<ItemFilterFormData>({
    resolver: zodResolver(itemFilterFormSchema),
    defaultValues: activeFilters,
    mode: 'onChange',
  });

  // React Hook Form для налаштувань
  const settingsForm = useForm<ItemManagerSettingsData>({
    resolver: zodResolver(itemManagerSettingsSchema),
    defaultValues: settings,
    mode: 'onChange',
  });

  // Синхронізація форм з стором
  useEffect(() => {
    searchForm.setValue('searchTerm', searchTerm || '');
  }, [searchTerm, searchForm]);

  useEffect(() => {
    filterForm.reset(activeFilters);
  }, [activeFilters, filterForm]);

  useEffect(() => {
    settingsForm.reset(settings);
  }, [settings, settingsForm]);

  return {
    // Форма пошуку
    search: searchForm,

    // Форма фільтрації
    filter: filterForm,

    // Форма налаштувань
    settings: settingsForm,
  };
};

export type UseItemManagerFormsReturn = ReturnType<typeof useItemManagerForms>;
