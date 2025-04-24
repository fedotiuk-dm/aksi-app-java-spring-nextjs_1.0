import { useCallback, useState } from 'react';
import { PriceListService, ServiceCategoryDto } from '@/lib/api';

/**
 * Хук для отримання списку категорій послуг
 */
export const useServiceCategories = () => {
  const [categories, setCategories] = useState<ServiceCategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await PriceListService.getAllCategories();
      setCategories(response);
    } catch (err) {
      console.error('Помилка при отриманні категорій послуг:', err);
      setError('Не вдалося завантажити категорії послуг');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
  };
};
