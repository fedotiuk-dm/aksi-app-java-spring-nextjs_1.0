import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useOrderWizard } from '../model/OrderWizardContext';
import { useOrderWizardStore } from '../model/store/store';
import { ItemWizardSubStep, WizardStep } from '../model/types/types';
import type { OrderItem } from '../model/types/types';

import {
  ItemPricingFormValues,
  itemPricingSchema,
  PriceModifier,
  ModifierCategoryType,
} from '../model/schema/item-pricing.schema';
import { useItemPricing } from '../api/stages/stage2/item-pricing';

/**
 * Хук для форми калькулятора ціни (підетап 2.4)
 */
export function useItemPricingForm() {
  // Отримуємо дані з контексту та стору
  const { navigateToStep } = useOrderWizard();
  const { currentItem, updateItem, setDirty } = useOrderWizardStore();

  // API для роботи з ціноутворенням
  const itemPricingApi = useItemPricing();

  // Категорія та назва поточного предмета
  const categoryId = currentItem?.category;
  const itemName = currentItem?.name;

  // Отримуємо базову ціну
  const { basePrice, isLoading: isBasePriceLoading } =
    itemPricingApi.useBasePriceForItem(categoryId, itemName);

  // Отримуємо доступні модифікатори ціни
  const { modifiers, isLoading: isModifiersLoading } =
    itemPricingApi.useModifiersForItem(categoryId);

  // Початкові значення форми
  const defaultValues: ItemPricingFormValues = useMemo(() => {
    return {
      basePrice: currentItem?.unitPrice || basePrice,
      appliedModifiers: currentItem?.priceModifiers || [],
    };
  }, [currentItem, basePrice]);

  // Ініціалізація форми з react-hook-form та валідацією zod
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<ItemPricingFormValues>({
    resolver: zodResolver(itemPricingSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Відстежуємо усі поля форми
  const formValues = watch();

  // Розрахунок ціни при зміні модифікаторів (через API)
  const { data: priceCalculation, isLoading: isPriceCalculating } =
    itemPricingApi.useCalculatePriceOnChange(
      formValues.basePrice,
      categoryId,
      itemName,
      formValues.appliedModifiers,
      modifiers
    );

  // Обробка додавання/видалення модифікатора
  const handleModifierToggle = (
    modifier: PriceModifier,
    isSelected: boolean
  ) => {
    const currentModifiers = [...formValues.appliedModifiers];

    if (isSelected) {
      // Додаємо модифікатор, якщо його ще немає
      if (!currentModifiers.some((m) => m.modifierId === modifier.id)) {
        const initialValue =
          modifier.minValue !== undefined ? modifier.minValue : modifier.value;

        currentModifiers.push({
          modifierId: modifier.id,
          selectedValue: initialValue,
        });
      }
    } else {
      // Видаляємо модифікатор
      const index = currentModifiers.findIndex(
        (m) => m.modifierId === modifier.id
      );
      if (index !== -1) {
        currentModifiers.splice(index, 1);
      }
    }

    setValue('appliedModifiers', currentModifiers);
    setDirty(true);
  };

  // Зміна значення модифікатора (для модифікаторів з діапазоном)
  const handleModifierValueChange = (modifierId: string, value: number) => {
    const currentModifiers = [...formValues.appliedModifiers];
    const index = currentModifiers.findIndex(
      (m) => m.modifierId === modifierId
    );

    if (index !== -1) {
      currentModifiers[index].selectedValue = value;
      setValue('appliedModifiers', currentModifiers);
      setDirty(true);
    }
  };

  // Перевірка, чи модифікатор застосовано
  const isModifierApplied = (modifierId: string) => {
    return formValues.appliedModifiers.some((m) => m.modifierId === modifierId);
  };

  // Отримання вибраного значення модифікатора
  const getModifierSelectedValue = (modifierId: string) => {
    const modifier = formValues.appliedModifiers.find(
      (m) => m.modifierId === modifierId
    );
    return modifier?.selectedValue;
  };

  // Перехід до наступного кроку (підетапу) після збереження даних
  const onSubmit = handleSubmit(async (data) => {
    if (currentItem) {
      try {
        // Отримуємо розрахунок ціни з API
        const calculationResult = await itemPricingApi.calculatePrice(
          data.basePrice,
          categoryId,
          itemName,
          data.appliedModifiers,
          modifiers
        );

        // Оновлюємо предмет з новою ціною та модифікаторами
        const updatedItem: Partial<OrderItem> = {
          ...currentItem,
          unitPrice: data.basePrice,
          totalPrice: calculationResult.totalPrice,
          priceModifiers: data.appliedModifiers,
          priceCalculationDetails: calculationResult,
        };

        // Оновлюємо предмет
        const currentIndex =
          typeof currentItem?.id === 'number' ? currentItem.id : -1;
        if (currentIndex >= 0) {
          updateItem(currentIndex, updatedItem as OrderItem);
        } else {
          console.warn('Поточний предмет не має коректного ID для оновлення');
        }
      } catch (error) {
        console.error('Помилка при розрахунку ціни:', error);
        // При помилці все одно зберігаємо базову інформацію
        const updatedItem: Partial<OrderItem> = {
          ...currentItem,
          unitPrice: data.basePrice,
          priceModifiers: data.appliedModifiers,
        };

        // Оновлюємо предмет
        const currentIndex =
          typeof currentItem?.id === 'number' ? currentItem.id : -1;
        if (currentIndex >= 0) {
          updateItem(currentIndex, updatedItem as OrderItem);
        } else {
          console.warn('Поточний предмет не має коректного ID для оновлення');
        }
      }
      navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.PHOTO_DOCUMENTATION);
    }
  });

  // Обробник повернення на попередній підетап
  const handleBack = useCallback(() => {
    navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.DEFECTS_STAINS);
  }, [navigateToStep]);

  // Оновлення форми при зміні базової ціни або деталей предмета
  useEffect(() => {
    if (basePrice && !currentItem?.priceModifiers) {
      reset({
        basePrice,
        appliedModifiers: [],
      });
    }
  }, [basePrice, currentItem, reset]);

  // Групування модифікаторів за категоріями
  const modifiersByCategory = useMemo(() => {
    const result: Record<string, PriceModifier[]> = {
      [ModifierCategoryType.GENERAL]: [],
      [ModifierCategoryType.TEXTILE]: [],
      [ModifierCategoryType.LEATHER]: [],
    };

    modifiers.forEach((modifier) => {
      // Розподіляємо модифікатори за категоріями
      if (modifier.category === ModifierCategoryType.GENERAL) {
        result[ModifierCategoryType.GENERAL].push(modifier);
      } else if (modifier.category === ModifierCategoryType.TEXTILE) {
        result[ModifierCategoryType.TEXTILE].push(modifier);
      } else if (modifier.category === ModifierCategoryType.LEATHER) {
        result[ModifierCategoryType.LEATHER].push(modifier);
      } else {
        // Якщо категорія невідома, додаємо до загальних
        result[ModifierCategoryType.GENERAL].push(modifier);
      }
    });

    return result;
  }, [modifiers]);

  return {
    control,
    formValues,
    errors,
    isValid,
    isLoading: isBasePriceLoading || isModifiersLoading || isPriceCalculating,
    basePrice,
    priceModifiers: modifiers,
    modifiersByCategory,
    priceCalculation,
    isModifierApplied,
    getModifierSelectedValue,
    handleModifierToggle,
    handleModifierValueChange,
    onSubmit,
    handleBack,
  };
}
