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
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);

  /**
   * Отримати елементи прайс-листа за ID категорії
   * Використовуємо getCategoryById, який повертає категорію з вкладеними items
   */
  const fetchPriceListItemsByCategory = useCallback(async (categoryId: string) => {
    if (!categoryId) {
      setPriceListItems([]);
      setCurrentCategoryId(null);
      return;
    }

    // Не робимо повторний запит, якщо категорія не змінилась
    if (categoryId === currentCategoryId && priceListItems.length > 0) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentCategoryId(categoryId);
    
    try {
      console.log(`Завантаження елементів прайс-листа для категорії ID: ${categoryId}`);
      
      // Отримуємо категорію за ID
      const categoryResponse = await PriceListService.getCategoryById({
        categoryId
      });
      
      // Перевіряємо наявність елементів
      const items = categoryResponse.items || [];
      
      console.log(`Отримано ${items.length} елементів прайс-листа:`, items);
      
      // Категорія містить масив items, що є елементами прайс-листа
      setPriceListItems(items);
    } catch (err) {
      console.error(`Помилка при отриманні елементів прайс-листа для категорії ID: ${categoryId}:`, err);
      setError('Не вдалося завантажити елементи прайс-листа');
      // Очищуємо список при помилці
      setPriceListItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentCategoryId, priceListItems.length]);

  return {
    priceListItems,
    isLoading,
    error,
    fetchPriceListItemsByCategory,
    currentCategoryId,
  };
};
