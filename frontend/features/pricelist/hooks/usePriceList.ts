import { useState, useEffect, useCallback } from 'react';
import { ServiceCategory, PriceListItem } from '../types';
import { priceListApi } from '../api/priceListApi';

/**
 * Хук для отримання даних прайс-листа
 */
export const usePriceList = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    const fetchPriceList = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await priceListApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Помилка при завантаженні прайс-листа:', err);
        setError(err instanceof Error ? err.message : 'Невідома помилка');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceList();
  }, [refreshTrigger]); // Додаємо refreshTrigger в залежності

  // Функція для створення нової категорії
  const createCategory = useCallback(async (categoryData: Partial<ServiceCategory>) => {
    try {
      const result = await priceListApi.createCategory(categoryData);
      refreshData();
      return result;
    } catch (err) {
      console.error('Помилка при створенні категорії:', err);
      throw err;
    }
  }, [refreshData]);
  
  // Функція для оновлення категорії
  const updateCategory = useCallback(async (categoryId: string, categoryData: Partial<ServiceCategory>) => {
    try {
      const result = await priceListApi.updateCategory(categoryId, categoryData);
      refreshData();
      return result;
    } catch (err) {
      console.error('Помилка при оновленні категорії:', err);
      throw err;
    }
  }, [refreshData]);
  
  // Функція для створення нового елемента прайс-листа
  const createPriceListItem = useCallback(async (categoryId: string, itemData: Partial<PriceListItem>) => {
    try {
      const result = await priceListApi.createPriceListItem(categoryId, itemData);
      refreshData();
      return result;
    } catch (err) {
      console.error('Помилка при створенні елемента прайс-листа:', err);
      throw err;
    }
  }, [refreshData]);
  
  // Функція для оновлення елемента прайс-листа
  const updatePriceListItem = useCallback(async (itemId: string, itemData: Partial<PriceListItem>) => {
    try {
      const result = await priceListApi.updatePriceListItem(itemId, itemData);
      refreshData();
      return result;
    } catch (err) {
      console.error('Помилка при оновленні елемента прайс-листа:', err);
      throw err;
    }
  }, [refreshData]);

  return { 
    categories, 
    loading, 
    error,
    refreshData,
    createCategory,
    updateCategory,
    createPriceListItem,
    updatePriceListItem
  };
};

/**
 * Хук для отримання даних конкретної категорії прайс-листа
 */
export const usePriceListCategory = (categoryId: string) => {
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        setError(null);

        const data = await priceListApi.getCategoryById(categoryId);
        setCategory(data);
      } catch (err) {
        console.error('Помилка при завантаженні категорії:', err);
        setError(err instanceof Error ? err.message : 'Невідома помилка');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  return { category, loading, error };
};
