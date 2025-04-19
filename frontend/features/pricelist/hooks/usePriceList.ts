import { useState, useEffect } from 'react';
import { ServiceCategory } from '../types';
import { priceListApi } from '../api/priceListApi';

/**
 * Хук для отримання даних прайс-листа
 */
export const usePriceList = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  return { categories, loading, error };
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
