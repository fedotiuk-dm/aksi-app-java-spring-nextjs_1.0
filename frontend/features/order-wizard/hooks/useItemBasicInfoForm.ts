import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOrderWizardStore, useOrderWizardNavigation } from '@/features/order-wizard/model/store/store';
import { useServiceCategories } from '@/features/order-wizard/api/stages/stage2/categories';
import { 
  basicItemSchema,
  ItemBasicInfoFormValues 
} from '@/features/order-wizard/model/schema/item-basic-info.schema';
import { 
  MeasurementUnit, 
  ServiceCategory,
  KILOGRAM_CATEGORIES
} from '@/features/order-wizard/model/types/service-categories';
import { ItemWizardSubStep, WizardStep } from '@/features/order-wizard/model/types';
import type { ServiceCategoryDTO, PriceListItemDTO } from '@/lib/api';

/**
 * Хук для форми основної інформації про предмет (підетап 2.1)
 */
export const useItemBasicInfoForm = () => {
  // Дані з глобального стану - використовуємо окремі селектори
  const currentItem = useOrderWizardStore(state => state.currentItem);
  const setCurrentItem = useOrderWizardStore(state => state.setCurrentItem);
  
  // Отримуємо функцію для навігації між кроками
  const { navigateToStep } = useOrderWizardNavigation();
  
  // Локальний стан
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryDTO | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<PriceListItemDTO | null>(null);
  const [hasFormChanged, setHasFormChanged] = useState<boolean>(false);
  
  // Хук для взаємодії з API
  const { useActiveCategories, useItemNames, useUnitsOfMeasure, useCheckUnitSupport } = useServiceCategories();
  
  // Запити даних
  const { data: categories = [], isLoading: isLoadingCategories } = useActiveCategories();
  const { data: itemNames = [], isLoading: isLoadingItemNames } = useItemNames(
    selectedCategory?.id || null
  );
  const { data: unitsOfMeasure = [], isLoading: isLoadingUnits } = useUnitsOfMeasure(
    selectedCategory?.id || null
  );
  
  // Ініціалізація форми з react-hook-form + zod
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
    reset
  } = useForm<ItemBasicInfoFormValues>({
    resolver: zodResolver(basicItemSchema),
    mode: 'onChange',
    defaultValues: {
      categoryId: '',
      itemNameId: '',
      quantity: 1,
      measurementUnit: MeasurementUnit.PIECES,
    }
  });
  
  // Отримання поточних значень полів
  const watchedCategoryId = watch('categoryId');
  const watchedItemNameId = watch('itemNameId');
  const watchedMeasurementUnit = watch('measurementUnit');
  
  // Перевірка підтримки одиниці виміру для предмета
  const { data: isUnitSupportedForItem = true } = useCheckUnitSupport(
    selectedCategory?.id || null,
    selectedItemName?.id || null,
    watchedMeasurementUnit
  );
  
  // Ефект для відстеження змін в формі
  useEffect(() => {
    setHasFormChanged(isDirty);
  }, [isDirty]);
  
  // Обробник зміни категорії
  const handleCategoryChange = useCallback((categoryId: string) => {
    if (categoryId && categories.length > 0) {
      const category = categories.find(cat => cat.id === categoryId) || null;
      setSelectedCategory(category);
      
      // Якщо категорія змінилася, скидаємо найменування виробу
      setValue('itemNameId', '');
      setSelectedItemName(null);
      
      // Встановлюємо одиницю виміру за замовчуванням для категорії
      const isCategoryWithKg = KILOGRAM_CATEGORIES.includes(
        category?.code as ServiceCategory
      );
      
      setValue(
        'measurementUnit', 
        isCategoryWithKg ? MeasurementUnit.KILOGRAMS : MeasurementUnit.PIECES
      );
    }
  }, [categories, setValue, setSelectedCategory, setSelectedItemName]);
  
  // Ефект для вибору категорії при зміні watchedCategoryId
  useEffect(() => {
    if (watchedCategoryId && categories.length > 0) {
      handleCategoryChange(watchedCategoryId);
    }
  }, [watchedCategoryId, categories, handleCategoryChange]);
  
  // Обробник зміни найменування предмета
  const handleItemNameChange = useCallback((itemId: string) => {
    if (itemId && itemNames.length > 0) {
      const itemName = itemNames.find(item => item.id === itemId) || null;
      setSelectedItemName(itemName);
    }
  }, [itemNames, setSelectedItemName]);
  
  // Ефект для вибору найменування при зміні watchedItemNameId
  useEffect(() => {
    if (watchedItemNameId && itemNames.length > 0) {
      handleItemNameChange(watchedItemNameId);
    }
  }, [watchedItemNameId, itemNames, handleItemNameChange]);
  
  // Обробник зміни одиниці виміру
  const handleUnitChange = useCallback(() => {
    // Можна додати додаткову логіку при зміні одиниці виміру
    // Поки що залишаємо порожнім, але в майбутньому можемо додати логіку
  }, []);
  
  // Обробник успішної валідації форми
  const handleSaveItem = useCallback((formData: ItemBasicInfoFormValues) => {
    // Оновлюємо currentItem у глобальному стані
    const newItem = {
      ...currentItem,
      category: selectedCategory?.name || '',
      name: selectedItemName?.name || '',
      quantity: formData.quantity,
      unitPrice: selectedItemName?.basePrice || 0,
      totalPrice: (selectedItemName?.basePrice || 0) * formData.quantity,
    };
    
    setCurrentItem(newItem);
    
    // Переходимо до наступного підетапу - Властивості предмета
    navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.ITEM_PROPERTIES);
  }, [currentItem, selectedCategory, selectedItemName, setCurrentItem, navigateToStep]);
  
  // Мемоізуємо об'єкт завантаження, щоб уникнути його перестворення при кожному рендері
  const loading = useMemo(() => ({
    categories: isLoadingCategories,
    itemNames: isLoadingItemNames,
    unitsOfMeasure: isLoadingUnits
  }), [isLoadingCategories, isLoadingItemNames, isLoadingUnits]);

  // Мемоізуємо об'єкт форми
  const form = useMemo(() => ({
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  }), [control, handleSubmit, watch, errors, isValid]);

  // Мемоізуємо функцію-хелпер
  const isCategoryWithKg = useCallback((categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? KILOGRAM_CATEGORIES.includes(category.code as ServiceCategory) : false;
  }, [categories]);
  
  const isLoading = isLoadingCategories || isLoadingItemNames || isLoadingUnits;

  return useMemo(() => ({
    // Дані
    categories,
    itemNames,
    unitsOfMeasure,
    selectedCategory,
    selectedItemName,
    isItemSupported: isUnitSupportedForItem,
    hasChanges: hasFormChanged,
    
    // Стан завантаження
    loading,
    isLoading,
    
    // Форма
    form,
    errors,
    isValid,
    handleSubmit,
    handleSaveItem,
    reset,
    
    // Обробники подій
    handleCategoryChange,
    handleItemNameChange,
    handleUnitChange,
    
    // Додаткові хелпери
    isCategoryWithKg
  }), [
    categories, itemNames, unitsOfMeasure, selectedCategory, selectedItemName,
    isUnitSupportedForItem, hasFormChanged, loading, isLoading, form, errors, isValid,
    handleSubmit, handleSaveItem, reset, handleCategoryChange, handleItemNameChange,
    handleUnitChange, isCategoryWithKg
  ]);
};
