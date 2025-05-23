/**
 * Основний хук для роботи з Pricing доменом
 * Забезпечує CRUD операції з прайс-листом та налаштуваннями
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { PricingService } from '../services/pricing.service';
import { usePricingStore, pricingSelectors } from '../store/pricing.store';
import { PricingUtils } from '../utils/pricing.utils';

import type {
  PriceListItem,
  PriceModifier,
  PriceSearchParams,
  ServiceCategory,
  PricingOperationResult,
  PricingStatistics,
} from '../types';

/**
 * Налаштування хука
 */
interface UsePricingOptions {
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
  enableCache?: boolean;
  enableOfflineMode?: boolean;
}

export const usePricing = (options: UsePricingOptions = {}) => {
  const queryClient = useQueryClient();

  const {
    enableAutoRefresh = true,
    refreshInterval = 5 * 60 * 1000, // 5 хвилин
    enableCache = true,
    enableOfflineMode = false,
  } = options;

  // Store selectors
  const {
    priceListItems,
    selectedPriceItem,
    priceModifiers,
    isLoading,
    error,
    searchKeyword,
    selectedCategory,
    priceRange,
    showActiveOnly,
  } = usePricingStore();

  // Store actions
  const {
    setPriceListItems,
    setSelectedPriceItem,
    setPriceModifiers,
    setIsLoading,
    setError,
    clearErrors,
    setSearchKeyword,
    setSelectedCategory,
    setPriceRange,
    setShowActiveOnly,
    clearFilters,
    reset,
  } = usePricingStore();

  // === QUERIES ===

  /**
   * Завантажує прайс-лист
   */
  const priceListQuery = useQuery({
    queryKey: ['priceList'],
    queryFn: async (): Promise<PriceListItem[]> => {
      // Тут буде API виклик до бекенду
      // Поки що повертаємо пустий масив
      return [];
    },
    enabled: true,
    refetchInterval: enableAutoRefresh ? refreshInterval : false,
    staleTime: enableCache ? 10 * 60 * 1000 : 0, // 10 хвилин
    retry: enableOfflineMode ? 0 : 3,
  });

  /**
   * Завантажує модифікатори цін
   */
  const modifiersQuery = useQuery({
    queryKey: ['priceModifiers'],
    queryFn: async (): Promise<PriceModifier[]> => {
      // Тут буде API виклик до бекенду
      return [];
    },
    enabled: true,
    refetchInterval: enableAutoRefresh ? refreshInterval : false,
    staleTime: enableCache ? 15 * 60 * 1000 : 0, // 15 хвилин
  });

  // === MUTATIONS ===

  /**
   * Створення нового елемента прайс-листа
   */
  const createPriceItemMutation = useMutation({
    mutationFn: async (itemData: Omit<PriceListItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = PricingService.createPriceListItem(itemData, priceListItems);

      if (!result.success) {
        throw new Error(result.errors?.general || 'Помилка створення елемента');
      }

      return result.data as PriceListItem;
    },
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: ['priceList'] });
      clearErrors();
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка створення елемента');
    },
  });

  /**
   * Оновлення елемента прайс-листа
   */
  const updatePriceItemMutation = useMutation({
    mutationFn: async ({
      itemId,
      updates,
    }: {
      itemId: string;
      updates: Partial<PriceListItem>;
    }) => {
      const result = PricingService.updatePriceListItem(itemId, updates, priceListItems);

      if (!result.success) {
        throw new Error(result.errors?.general || 'Помилка оновлення елемента');
      }

      return result.data as PriceListItem;
    },
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: ['priceList'] });

      // Оновлюємо обраний елемент, якщо він був оновлений
      if (selectedPriceItem?.id === updatedItem.id) {
        setSelectedPriceItem(updatedItem);
      }

      clearErrors();
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка оновлення елемента');
    },
  });

  /**
   * Видалення елемента прайс-листа
   */
  const deletePriceItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const result = PricingService.deletePriceListItem(itemId, priceListItems);

      if (!result.success) {
        throw new Error(result.errors?.general || 'Помилка видалення елемента');
      }

      return itemId;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['priceList'] });

      // Очищаємо обраний елемент, якщо він був видалений
      if (selectedPriceItem?.id === deletedId) {
        setSelectedPriceItem(null);
      }

      clearErrors();
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка видалення елемента');
    },
  });

  /**
   * Експорт прайс-листа
   */
  const exportPriceListMutation = useMutation({
    mutationFn: async (format: 'csv' | 'json' = 'csv') => {
      const result = PricingService.exportPriceList(priceListItems, format);

      if (!result.success) {
        throw new Error(result.errors?.general || 'Помилка експорту');
      }

      return result.data;
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка експорту');
    },
  });

  /**
   * Імпорт прайс-листа з CSV
   */
  const importPriceListMutation = useMutation({
    mutationFn: async (csvContent: string) => {
      const result = PricingService.importPriceListFromCsv(csvContent);

      if (!result.success) {
        throw new Error(result.errors?.general || 'Помилка імпорту');
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priceList'] });
      clearErrors();
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Помилка імпорту');
    },
  });

  // === COMPUTED VALUES ===

  /**
   * Фільтровані елементи прайс-листа
   */
  const filteredPriceListItems = useMemo(() => {
    const searchParams: PriceSearchParams = {
      keyword: searchKeyword,
      category: selectedCategory ?? undefined,
      minPrice: priceRange?.min,
      maxPrice: priceRange?.max,
      isActive: showActiveOnly,
    };

    return PricingUtils.filterPriceListItems(priceListItems, searchParams);
  }, [priceListItems, searchKeyword, selectedCategory, priceRange, showActiveOnly]);

  /**
   * Статистика цін
   */
  const pricingStatistics = useMemo((): PricingStatistics => {
    return PricingService.calculateStatistics(priceListItems, priceModifiers);
  }, [priceListItems, priceModifiers]);

  /**
   * Активні елементи прайс-листа
   */
  const activePriceListItems = useMemo(() => {
    return pricingSelectors.getActivePriceListItems();
  }, [priceListItems]);

  /**
   * Групування елементів за категоріями
   */
  const priceListByCategory = useMemo(() => {
    return PricingUtils.groupPriceListItemsByCategory(filteredPriceListItems);
  }, [filteredPriceListItems]);

  /**
   * Чи є активні фільтри
   */
  const hasActiveFilters = useMemo(() => {
    return pricingSelectors.hasActiveFilters();
  }, [searchKeyword, selectedCategory, priceRange]);

  // === METHODS ===

  /**
   * Пошук елементів прайс-листа
   */
  const searchPriceList = useCallback(
    (searchParams: PriceSearchParams) => {
      return PricingService.searchPriceList(priceListItems, searchParams);
    },
    [priceListItems]
  );

  /**
   * Знаходить елемент за номером
   */
  const findItemByNumber = useCallback(
    (itemNumber: string) => {
      return PricingService.findPriceListItemByNumber(priceListItems, itemNumber);
    },
    [priceListItems]
  );

  /**
   * Знаходить подібні послуги
   */
  const findSimilarServices = useCallback(
    (targetItem: PriceListItem, maxResults = 5) => {
      return PricingService.findSimilarServices(targetItem, priceListItems, maxResults);
    },
    [priceListItems]
  );

  /**
   * Генерує унікальний номер для нового елемента
   */
  const generateItemNumber = useCallback(
    (category: ServiceCategory) => {
      return PricingService.generateItemNumber(category, priceListItems);
    },
    [priceListItems]
  );

  /**
   * Валідує елемент прайс-листа
   */
  const validatePriceItem = useCallback((item: PriceListItem) => {
    return PricingService.validatePriceListItem(item);
  }, []);

  /**
   * Оновлює пошукове слово
   */
  const updateSearchKeyword = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
    },
    [setSearchKeyword]
  );

  /**
   * Оновлює вибрану категорію
   */
  const updateSelectedCategory = useCallback(
    (category: ServiceCategory | null) => {
      setSelectedCategory(category);
    },
    [setSelectedCategory]
  );

  /**
   * Оновлює ціновий діапазон
   */
  const updatePriceRange = useCallback(
    (range: { min: number; max: number } | null) => {
      setPriceRange(range);
    },
    [setPriceRange]
  );

  /**
   * Очищає всі фільтри
   */
  const resetFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  /**
   * Скидає весь стан
   */
  const resetPricing = useCallback(() => {
    reset();
    queryClient.removeQueries({ queryKey: ['priceList'] });
    queryClient.removeQueries({ queryKey: ['priceModifiers'] });
  }, [reset, queryClient]);

  return {
    // Data
    priceListItems: filteredPriceListItems,
    allPriceListItems: priceListItems,
    activePriceListItems,
    selectedPriceItem,
    priceModifiers,
    priceListByCategory,
    pricingStatistics,

    // Loading states
    isLoading: isLoading || priceListQuery.isPending || modifiersQuery.isPending,
    error,
    isCreating: createPriceItemMutation.isPending,
    isUpdating: updatePriceItemMutation.isPending,
    isDeleting: deletePriceItemMutation.isPending,
    isExporting: exportPriceListMutation.isPending,
    isImporting: importPriceListMutation.isPending,

    // Filters
    searchKeyword,
    selectedCategory,
    priceRange,
    showActiveOnly,
    hasActiveFilters,

    // Methods
    searchPriceList,
    findItemByNumber,
    findSimilarServices,
    generateItemNumber,
    validatePriceItem,

    // Filter methods
    updateSearchKeyword,
    updateSelectedCategory,
    updatePriceRange,
    setShowActiveOnly,
    resetFilters,

    // CRUD methods
    createPriceItem: createPriceItemMutation.mutate,
    updatePriceItem: updatePriceItemMutation.mutate,
    deletePriceItem: deletePriceItemMutation.mutate,
    exportPriceList: exportPriceListMutation.mutate,
    importPriceList: importPriceListMutation.mutate,

    // Selection methods
    setSelectedPriceItem,
    clearSelection: () => setSelectedPriceItem(null),

    // Utility methods
    clearErrors,
    reset: resetPricing,
    refetch: () => {
      priceListQuery.refetch();
      modifiersQuery.refetch();
    },
  };
};
