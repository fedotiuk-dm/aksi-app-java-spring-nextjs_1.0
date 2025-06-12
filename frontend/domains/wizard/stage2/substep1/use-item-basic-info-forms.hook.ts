/**
 * @fileoverview Форми хук для домену "Основна інформація про предмет (Substep1)"
 *
 * Відповідальність: тільки управління формами та валідація
 * Принцип: Single Responsibility Principle
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  serviceCategorySelectionSchema,
  priceListItemSelectionSchema,
  quantityInputSchema,
  type ServiceCategorySelectionData,
  type PriceListItemSelectionData,
  type QuantityInputData,
} from './item-basic-info.schemas';
import { useItemBasicInfoStore } from './item-basic-info.store';

/**
 * Хук для управління формами основної інформації про предмет
 * Інкапсулює всю логіку форм і валідації
 */
export const useItemBasicInfoForms = () => {
  const { selectedCategoryId, selectedItemId, enteredQuantity, selectedUnitOfMeasure, sessionId } =
    useItemBasicInfoStore();

  // React Hook Form для вибору категорії
  const categoryForm = useForm<ServiceCategorySelectionData>({
    resolver: zodResolver(serviceCategorySelectionSchema),
    defaultValues: {
      categoryId: selectedCategoryId || '',
    },
    mode: 'onChange',
  });

  // React Hook Form для вибору предмета
  const itemForm = useForm<PriceListItemSelectionData>({
    resolver: zodResolver(priceListItemSelectionSchema),
    defaultValues: {
      itemId: selectedItemId || '',
    },
    mode: 'onChange',
  });

  // React Hook Form для кількості
  const quantityForm = useForm<QuantityInputData>({
    resolver: zodResolver(quantityInputSchema),
    defaultValues: {
      quantity: enteredQuantity || 0,
      unitOfMeasure: selectedUnitOfMeasure || undefined,
    },
    mode: 'onChange',
  });

  // Синхронізація форм з стором
  useEffect(() => {
    categoryForm.setValue('categoryId', selectedCategoryId || '');
  }, [selectedCategoryId, categoryForm]);

  useEffect(() => {
    itemForm.setValue('itemId', selectedItemId || '');
  }, [selectedItemId, itemForm]);

  useEffect(() => {
    quantityForm.setValue('quantity', enteredQuantity || 0);
    if (selectedUnitOfMeasure) {
      quantityForm.setValue('unitOfMeasure', selectedUnitOfMeasure);
    }
  }, [enteredQuantity, selectedUnitOfMeasure, quantityForm]);

  return {
    // Форма вибору категорії
    category: categoryForm,

    // Форма вибору предмета
    item: itemForm,

    // Форма кількості
    quantity: quantityForm,
  };
};

export type UseItemBasicInfoFormsReturn = ReturnType<typeof useItemBasicInfoForms>;
