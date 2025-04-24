import { useCallback, useState } from 'react';
import { PriceListItemDto, PriceListService } from '@/lib/api';

/**
 * Хук для отримання елементів прайс-листа за ID категорії
 * Використовує OpenAPI клієнт для взаємодії з бекендом
 */
export const usePriceListItems = () => {
  const [priceListItems, setPriceListItems] = useState<PriceListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Отримати елементи прайс-листа за ID категорії
   * Використовуємо getCategoryById, який повертає категорію з вкладеними items
   */
  const fetchPriceListItemsByCategory = useCallback(async (categoryId: string) => {
    if (!categoryId) {
      setPriceListItems([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Отримуємо категорію за ID
      const categoryResponse = await PriceListService.getCategoryById({
        categoryId
      });
      
      // Категорія містить масив items, що є елементами прайс-листа
      setPriceListItems(categoryResponse.items || []);
    } catch (err) {
      console.error('Помилка при отриманні елементів прайс-листа:', err);
      setError('Не вдалося завантажити елементи прайс-листа');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    priceListItems,
    isLoading,
    error,
    fetchPriceListItemsByCategory,
  };
};
