/**
 * Хук для роботи з основною інформацією про предмет
 * Інтегрує функціональність pricing domain з order domain
 */

import { SelectChangeEvent } from '@mui/material/Select';
import { useCallback, useMemo } from 'react';

import { useServiceCategories, usePriceList } from '@/domain/pricing';

import { useItemWizard } from './use-item-wizard.hook';

/**
 * Хук для роботи з основною інформацією про предмет
 */
export const useItemBasicInfo = () => {
  const { itemData, validation, updateBasicInfo } = useItemWizard();

  // Завантаження категорій послуг
  const {
    categoriesForUI: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
    getCategoryByCode,
  } = useServiceCategories();

  // Завантаження предметів для обраної категорії
  const {
    itemNames,
    isLoading: isLoadingItems,
    error: itemsError,
    getBasePrice,
  } = usePriceList(itemData.category);

  // Обробники подій
  const handleCategoryChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const categoryCode = event.target.value;
      const selectedCategory = getCategoryByCode(categoryCode);

      updateBasicInfo({
        category: categoryCode,
        unitOfMeasure: selectedCategory?.standardProcessingDays ? 'шт' : 'кг', // Базова логіка
        name: '', // Очищуємо назву при зміні категорії
        unitPrice: 0, // Очищуємо ціну
      });
    },
    [getCategoryByCode, updateBasicInfo]
  );

  const handleItemNameChange = useCallback(
    async (event: React.SyntheticEvent, value: string | null) => {
      const itemName = value || '';

      // Завантажуємо базову ціну для обраного предмета
      let basePrice = 0;
      if (itemName && itemData.category) {
        try {
          basePrice = await getBasePrice(itemName, 'other'); // За замовчуванням 'other' колір
        } catch (error) {
          console.error('Помилка завантаження базової ціни:', error);
        }
      }

      updateBasicInfo({
        name: itemName,
        unitPrice: basePrice,
      });
    },
    [itemData.category, getBasePrice, updateBasicInfo]
  );

  const handleQuantityChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const quantity = Number(event.target.value);
      updateBasicInfo({ quantity });
    },
    [updateBasicInfo]
  );

  const handlePriceChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const unitPrice = Number(event.target.value);
      updateBasicInfo({ unitPrice });
    },
    [updateBasicInfo]
  );

  const handleDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateBasicInfo({ description: event.target.value });
    },
    [updateBasicInfo]
  );

  // Валідація
  const validationErrors = useMemo(
    () => ({
      category: validation.basicInfo.errors.category,
      name: validation.basicInfo.errors.name,
      quantity: validation.basicInfo.errors.quantity,
      unitPrice: validation.basicInfo.errors.unitPrice,
    }),
    [validation.basicInfo.errors]
  );

  // Стан завантаження
  const isLoading = isLoadingCategories || isLoadingItems;
  const hasErrors = !!(categoriesError || itemsError);

  return {
    // Дані (трансформовані для UI)
    data: {
      ...itemData,
      description: itemData.description || '', // Забезпечуємо string замість string | undefined
    },
    categories,
    itemNames,

    // Стан
    isLoading,
    isLoadingCategories,
    isLoadingItems,
    hasErrors,
    validation: validationErrors,

    // Обробники
    handlers: {
      onCategoryChange: handleCategoryChange,
      onItemNameChange: handleItemNameChange,
      onQuantityChange: handleQuantityChange,
      onPriceChange: handlePriceChange,
      onDescriptionChange: handleDescriptionChange,
    },

    // Утиліти
    utils: {
      getCategoryByCode,
      getBasePrice,
    },
  };
};
