/**
 * Хук для логіки роботи з елементами прайс-листа у формі
 */
import { useState, useEffect } from 'react';
import { useServiceCategories, usePriceListItems } from '@/features/order-wizard/api/hooks';

interface UseItemFormLogicProps {
  categoryId: string;
  priceListItemId: string;
  // Функція setValue з React Hook Form
  setValue: (name: string, value: unknown) => void;
}

/**
 * Хук для обробки логіки вибору категорій та предметів прайс-листа
 */
export const useItemFormLogic = ({
  categoryId,
  priceListItemId,
  setValue,
}: UseItemFormLogicProps) => {
  // Стан для відображення одиниці виміру
  const [itemUnitOfMeasurement, setItemUnitOfMeasurement] = useState<string>('PIECE');

  // Отримуємо список категорій послуг
  const { categories, isLoading: categoriesLoading } = useServiceCategories();

  // Отримуємо список предметів для вибраної категорії
  const { 
    priceListItems, 
    isLoading: itemsLoading, 
    fetchPriceListItemsByCategory 
  } = usePriceListItems();
  
  // Завантажуємо елементи прайс-листа при зміні категорії
  useEffect(() => {
    if (categoryId) {
      fetchPriceListItemsByCategory(categoryId);
    }
  }, [categoryId, fetchPriceListItemsByCategory]);

  // Встановлюємо одиницю виміру та назву при виборі предмета
  useEffect(() => {
    if (priceListItemId && priceListItems.length > 0) {
      const selectedItem = priceListItems.find(item => item.id === priceListItemId);
      if (selectedItem) {
        // Отримуємо unit і переконуємося, що це допустимий тип
        let unit = selectedItem.unitOfMeasure || 'PIECE';
        if (unit !== 'PIECE' && unit !== 'KILOGRAM') {
          unit = 'PIECE';
        }
        setItemUnitOfMeasurement(unit);
        setValue('unitOfMeasurement', unit as 'PIECE' | 'KILOGRAM');
        
        // Також встановлюємо назву предмета
        if (selectedItem.name) {
          setValue('name', selectedItem.name);
        }
      }
    }
  }, [priceListItemId, priceListItems, setValue]);

  return {
    categories,
    priceListItems,
    categoriesLoading,
    itemsLoading,
    itemUnitOfMeasurement,
  };
};
