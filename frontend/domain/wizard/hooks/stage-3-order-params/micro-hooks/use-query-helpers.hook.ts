/**
 * @fileoverview Хелпери для TanStack Query в wizard
 * @module domain/wizard/hooks/shared
 */

import { useMutation, useQuery, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useWizardStore } from '../../../store';

/**
 * Хелпер для wizard mutations з автоматичним error handling
 */
export const useWizardMutation = <TData, TError, TVariables>(
  options: UseMutationOptions<TData, TError, TVariables>
) => {
  const { addError } = useWizardStore();

  return useMutation<TData, TError, TVariables>({
    ...options,
    onError: (error: TError, variables: TVariables, context: any) => {
      // Автоматичний error handling
      addError(error instanceof Error ? error.message : 'Невідома помилка');

      // Викликаємо користувацький onError якщо є
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
  });
};

/**
 * Хелпер для wizard queries з автоматичним error handling
 */
export const useWizardQuery = <TData, TError>(options: UseQueryOptions<TData, TError>) => {
  const { addError } = useWizardStore();

  return useQuery<TData, TError>({
    ...options,
    onError: (error: TError) => {
      // Автоматичний error handling для queries
      addError(error instanceof Error ? error.message : 'Помилка завантаження');
    },
  });
};

/**
 * Factory для створення wizard-specific query keys
 */
export const createWizardQueryKey = {
  // Ключі для stage-1
  clients: (searchTerm?: string) => ['wizard', 'clients', searchTerm],
  client: (id: string) => ['wizard', 'client', id],
  branches: () => ['wizard', 'branches'],

  // Ключі для stage-2
  priceList: (categoryId?: string) => ['wizard', 'price-list', categoryId],
  priceCalculation: () => ['wizard', 'price-calculation'],

  // Ключі для stage-3
  discounts: () => ['wizard', 'discounts'],

  // Ключі для stage-4
  orderValidation: () => ['wizard', 'order-validation'],
  receiptGeneration: () => ['wizard', 'receipt-generation'],
};

/**
 * Хук для інвалідації wizard кешу
 */
export const useWizardCacheInvalidation = () => {
  const { addWarning } = useWizardStore();

  return {
    invalidateAll: () => {
      // TODO: Implement queryClient.invalidateQueries(['wizard'])
      addWarning('Кеш оновлено');
    },
    invalidateStage: (stage: number) => {
      // TODO: Implement specific stage cache invalidation
      addWarning(`Кеш для етапу ${stage} оновлено`);
    },
  };
};
