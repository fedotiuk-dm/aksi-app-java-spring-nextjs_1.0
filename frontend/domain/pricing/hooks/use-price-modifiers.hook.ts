/**
 * Хук для роботи з модифікаторами цін
 * Управляє модифікаторами, їх застосуванням та валідацією
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { PricingService } from '../services/pricing.service';
import { usePricingStore, pricingSelectors } from '../store/pricing.store';
import { PricingValidator } from '../utils/pricing.validator';

import type {
  PriceModifier,
  PriceListItem,
  ServiceCategory,
  PriceCalculationParams,
  PricingOperationResult,
} from '../types';

/**
 * Опції для хука модифікаторів
 */
interface UsePriceModifiersOptions {
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
  enableCache?: boolean;
  category?: ServiceCategory;
}

export const usePriceModifiers = (options: UsePriceModifiersOptions = {}) => {
  const queryClient = useQueryClient();

  const {
    enableAutoRefresh = true,
    refreshInterval = 10 * 60 * 1000, // 10 хвилин
    enableCache = true,
    category,
  } = options;

  // Store state
  const { priceModifiers, selectedModifiers, isLoading, error } = usePricingStore();

  // Store actions
  const {
    setPriceModifiers,
    addPriceModifier,
    updatePriceModifier,
    removePriceModifier,
    setSelectedModifiers,
    addSelectedModifier,
    removeSelectedModifier,
    clearSelectedModifiers,
    setIsLoading,
    setError,
    clearErrors,
  } = usePricingStore();

  // === QUERIES ===

  /**
   * Завантажує всі модифікатори
   */
  const modifiersQuery = useQuery({
    queryKey: ['priceModifiers', { category }],
    queryFn: async (): Promise<PriceModifier[]> => {
      // Тут буде API виклик до бекенду
      // Поки що повертаємо пустий масив
      return [];
    },
    enabled: true,
    refetchInterval: enableAutoRefresh ? refreshInterval : false,
    staleTime: enableCache ? 15 * 60 * 1000 : 0, // 15 хвилин
  });

  // === MUTATIONS ===

  /**
   * Створення нового модифікатора
   */
  const createModifierMutation = useMutation({
    mutationFn: async (modifierData: Omit<PriceModifier, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = PricingService.createPriceModifier(modifierData);

      if (!result.success) {
        throw new Error(result.errors?.general || 'Помилка створення модифікатора');
      }

      return result.data as PriceModifier;
    },
    onSuccess: (newModifier) => {
      addPriceModifier(newModifier);
      queryClient.invalidateQueries({ queryKey: ['priceModifiers'] });
      clearErrors();
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка створення модифікатора');
    },
  });

  /**
   * Оновлення модифікатора
   */
  const updateModifierMutation = useMutation({
    mutationFn: async ({
      modifierId,
      updates,
    }: {
      modifierId: string;
      updates: Partial<PriceModifier>;
    }) => {
      const existingModifier = priceModifiers.find((m) => m.id === modifierId);

      if (!existingModifier) {
        throw new Error('Модифікатор не знайдено');
      }

      const updatedModifier = { ...existingModifier, ...updates };
      const result = PricingService.validatePriceModifier(updatedModifier);

      if (!result.success) {
        throw new Error(result.errors?.general || 'Помилка валідації модифікатора');
      }

      return updatedModifier;
    },
    onSuccess: (updatedModifier) => {
      updatePriceModifier(updatedModifier.id, updatedModifier);
      queryClient.invalidateQueries({ queryKey: ['priceModifiers'] });
      clearErrors();
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка оновлення модифікатора');
    },
  });

  /**
   * Видалення модифікатора
   */
  const deleteModifierMutation = useMutation({
    mutationFn: async (modifierId: string) => {
      // Тут буде API виклик до бекенду для видалення
      return modifierId;
    },
    onSuccess: (deletedId) => {
      removePriceModifier(deletedId);
      removeSelectedModifier(deletedId);
      queryClient.invalidateQueries({ queryKey: ['priceModifiers'] });
      clearErrors();
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка видалення модифікатора');
    },
  });

  // === COMPUTED VALUES ===

  /**
   * Активні модифікатори
   */
  const activeModifiers = useMemo(() => {
    return pricingSelectors.getActiveModifiers();
  }, [priceModifiers]);

  /**
   * Модифікатори за категорією
   */
  const modifiersByCategory = useMemo(() => {
    if (!category) return priceModifiers;

    return pricingSelectors.getModifiersByCategory(category);
  }, [priceModifiers, category]);

  /**
   * Кількість обраних модифікаторів
   */
  const selectedModifiersCount = useMemo(() => {
    return pricingSelectors.getSelectedModifiersCount();
  }, [selectedModifiers]);

  /**
   * Групування модифікаторів за типом
   */
  const modifiersByType = useMemo(() => {
    const grouped = {
      percentage: [] as PriceModifier[],
      fixed_amount: [] as PriceModifier[],
      multiplier: [] as PriceModifier[],
    };

    priceModifiers.forEach((modifier) => {
      grouped[modifier.type].push(modifier);
    });

    return grouped;
  }, [priceModifiers]);

  /**
   * Групування модифікаторів за пріоритетом
   */
  const modifiersByPriority = useMemo(() => {
    return [...priceModifiers].sort((a, b) => a.priority - b.priority);
  }, [priceModifiers]);

  // === METHODS ===

  /**
   * Отримує модифікатори, застосовні до предмета
   */
  const getApplicableModifiers = useCallback(
    (item: PriceListItem) => {
      return PricingService.getApplicableModifiers(item, priceModifiers);
    },
    [priceModifiers]
  );

  /**
   * Отримує рекомендовані модифікатори для предмета
   */
  const getRecommendedModifiers = useCallback(
    (item: PriceListItem, params: PriceCalculationParams) => {
      return PricingService.getRecommendedModifiers(item, params, priceModifiers);
    },
    [priceModifiers]
  );

  /**
   * Перевіряє чи можна застосувати модифікатор
   */
  const canApplyModifier = useCallback(
    (modifier: PriceModifier, params: PriceCalculationParams, orderAmount?: number) => {
      return PricingValidator.canApplyModifier(modifier, params, orderAmount);
    },
    []
  );

  /**
   * Перевіряє чи модифікатор застосовується до категорії
   */
  const isApplicableToCategory = useCallback(
    (modifier: PriceModifier, category: ServiceCategory) => {
      return PricingValidator.isModifierApplicableToCategory(modifier, category);
    },
    []
  );

  /**
   * Валідує модифікатор
   */
  const validateModifier = useCallback((modifier: PriceModifier) => {
    return PricingService.validatePriceModifier(modifier);
  }, []);

  /**
   * Додає модифікатор до обраних
   */
  const selectModifier = useCallback(
    (modifier: PriceModifier) => {
      addSelectedModifier(modifier);
    },
    [addSelectedModifier]
  );

  /**
   * Видаляє модифікатор з обраних
   */
  const unselectModifier = useCallback(
    (modifierId: string) => {
      removeSelectedModifier(modifierId);
    },
    [removeSelectedModifier]
  );

  /**
   * Перемикає стан модифікатора (обрано/не обрано)
   */
  const toggleModifier = useCallback(
    (modifier: PriceModifier) => {
      const isSelected = selectedModifiers.some((m) => m.id === modifier.id);

      if (isSelected) {
        removeSelectedModifier(modifier.id);
      } else {
        addSelectedModifier(modifier);
      }
    },
    [selectedModifiers, addSelectedModifier, removeSelectedModifier]
  );

  /**
   * Встановлює список обраних модифікаторів
   */
  const setSelected = useCallback(
    (modifiers: PriceModifier[]) => {
      setSelectedModifiers(modifiers);
    },
    [setSelectedModifiers]
  );

  /**
   * Очищає всі обрані модифікатори
   */
  const clearSelected = useCallback(() => {
    clearSelectedModifiers();
  }, [clearSelectedModifiers]);

  /**
   * Знаходить модифікатор за ID
   */
  const findModifierById = useCallback(
    (id: string) => {
      return priceModifiers.find((modifier) => modifier.id === id) || null;
    },
    [priceModifiers]
  );

  /**
   * Знаходить модифікатори за кодом
   */
  const findModifiersByCode = useCallback(
    (code: string) => {
      return priceModifiers.filter((modifier) =>
        modifier.code.toLowerCase().includes(code.toLowerCase())
      );
    },
    [priceModifiers]
  );

  /**
   * Фільтрує модифікатори за активністю
   */
  const filterByActive = useCallback(
    (activeOnly: boolean = true) => {
      return priceModifiers.filter((modifier) => !activeOnly || modifier.isActive);
    },
    [priceModifiers]
  );

  /**
   * Сортує модифікатори
   */
  const sortModifiers = useCallback(
    (sortBy: 'name' | 'priority' | 'type' | 'value', order: 'asc' | 'desc' = 'asc') => {
      return [...priceModifiers].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name, 'uk');
            break;
          case 'priority':
            comparison = a.priority - b.priority;
            break;
          case 'type':
            comparison = a.type.localeCompare(b.type);
            break;
          case 'value':
            comparison = a.value - b.value;
            break;
          default:
            comparison = 0;
        }

        return order === 'desc' ? -comparison : comparison;
      });
    },
    [priceModifiers]
  );

  /**
   * Перевіряє чи модифікатор обраний
   */
  const isSelected = useCallback(
    (modifierId: string) => {
      return selectedModifiers.some((modifier) => modifier.id === modifierId);
    },
    [selectedModifiers]
  );

  /**
   * Отримує конфліктні модифікатори (що виключають один одного)
   */
  const getConflictingModifiers = useCallback(
    (modifier: PriceModifier) => {
      if (modifier.applicationRule !== 'exclusive') {
        return [];
      }

      return priceModifiers.filter(
        (m) =>
          m.id !== modifier.id &&
          m.applicableCategories.some((cat) => modifier.applicableCategories.includes(cat))
      );
    },
    [priceModifiers]
  );

  return {
    // Data
    priceModifiers: modifiersByCategory,
    allModifiers: priceModifiers,
    activeModifiers,
    selectedModifiers,
    modifiersByType,
    modifiersByPriority,
    selectedModifiersCount,

    // Loading states
    isLoading: isLoading || modifiersQuery.isPending,
    error,
    isCreating: createModifierMutation.isPending,
    isUpdating: updateModifierMutation.isPending,
    isDeleting: deleteModifierMutation.isPending,

    // Query methods
    getApplicableModifiers,
    getRecommendedModifiers,
    findModifierById,
    findModifiersByCode,
    filterByActive,
    sortModifiers,

    // Validation methods
    canApplyModifier,
    isApplicableToCategory,
    validateModifier,
    getConflictingModifiers,

    // Selection methods
    selectModifier,
    unselectModifier,
    toggleModifier,
    setSelected,
    clearSelected,
    isSelected,

    // CRUD methods
    createModifier: createModifierMutation.mutate,
    updateModifier: updateModifierMutation.mutate,
    deleteModifier: deleteModifierMutation.mutate,

    // Utility methods
    clearErrors,
    refetch: () => modifiersQuery.refetch(),
    reset: () => {
      clearSelected();
      clearErrors();
    },
  };
};
