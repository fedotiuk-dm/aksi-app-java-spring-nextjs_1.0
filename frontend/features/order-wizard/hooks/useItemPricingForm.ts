import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

  // Використовуємо state для надійного перерахунку ціни
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);
  // Додаємо ref для таймстампу останнього оновлення
  const timestampRef = useRef<number>(Date.now());

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

  // Функція для примусового оновлення розрахунку ціни
  const forceRecalculation = useCallback(() => {
    console.log('Примусове оновлення розрахунку ціни');
    timestampRef.current = Date.now(); // Оновлюємо таймстамп
    setUpdateTrigger((prev) => prev + 1); // Інкрементуємо тригер для React Query
  }, []);

  // Розрахунок ціни при зміні модифікаторів (через API)
  const { data: priceCalculation, isLoading: isPriceCalculating } =
    itemPricingApi.useCalculatePriceOnChange(
      formValues.basePrice,
      categoryId,
      itemName,
      formValues.appliedModifiers,
      modifiers,
      // Додаємо значення для примусового оновлення запиту
      timestampRef.current + updateTrigger
    );

  // Обробка додавання/видалення модифікатора
  const handleModifierToggle = useCallback(
    (modifier: PriceModifier, isSelected: boolean) => {
      console.log(
        `Перемикання модифікатора ${modifier.name} (${modifier.id}): ${
          isSelected ? 'додано' : 'видалено'
        }`
      );

      const currentModifiers = [...formValues.appliedModifiers];

      if (isSelected) {
        // Додаємо модифікатор, якщо його ще немає
        if (!currentModifiers.some((m) => m.modifierId === modifier.id)) {
          // Визначаємо початкове значення залежно від типу модифікатора
          let initialValue = modifier.value || 0;

          // Для діапазонних модифікаторів використовуємо мінімальне значення
          if (
            modifier.minValue !== undefined &&
            modifier.maxValue !== undefined &&
            modifier.minValue !== modifier.maxValue
          ) {
            initialValue = modifier.minValue;
            console.log(
              `Додаємо діапазонний модифікатор ${modifier.name} з початковим значенням ${initialValue}`
            );
          }
          // Для процентних модифікаторів використовуємо значення
          else if (modifier.isPercentage) {
            initialValue = modifier.value || 0;
            console.log(
              `Додаємо процентний модифікатор ${modifier.name} зі значенням ${initialValue}%`
            );
          }
          // Для фіксованих модифікаторів встановлюємо кількість 1 за замовчуванням
          else {
            initialValue = 1; // Мінімальна кількість для фіксованих модифікаторів
            console.log(
              `Додаємо фіксований модифікатор ${modifier.name} з кількістю ${initialValue}`
            );
          }

          currentModifiers.push({
            modifierId: modifier.id,
            selectedValue: initialValue,
          });

          console.log('Модифікатор додано з значенням:', initialValue);
        } else {
          console.log(`Модифікатор ${modifier.name} вже додано`);
        }
      } else {
        // Видаляємо модифікатор
        const index = currentModifiers.findIndex(
          (m) => m.modifierId === modifier.id
        );
        if (index !== -1) {
          console.log(
            `Видаляємо модифікатор ${modifier.name} з позиції ${index}`
          );
          currentModifiers.splice(index, 1);
        } else {
          console.log(`Модифікатор ${modifier.name} не знайдено для видалення`);
        }
      }

      // Оновлюємо стан форми
      setValue('appliedModifiers', currentModifiers, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      // Встановлюємо флаг брудної форми для відстеження змін
      setDirty(true);

      // Примусово перераховуємо ціну після зміни
      forceRecalculation();
    },
    [formValues.appliedModifiers, setValue, setDirty, forceRecalculation]
  );

  // Зміна значення модифікатора (для модифікаторів з діапазоном)
  const handleModifierValueChange = useCallback(
    (modifierId: string, value: number) => {
      console.log(`Зміна значення модифікатора ${modifierId} на ${value}`);

      const currentModifiers = [...formValues.appliedModifiers];
      const index = currentModifiers.findIndex(
        (m) => m.modifierId === modifierId
      );

      if (index !== -1) {
        // Знаходимо відповідний модифікатор в списку доступних
        const availableModifier = modifiers.find((m) => m.id === modifierId);

        if (availableModifier) {
          console.log(
            `Знайдено доступний модифікатор: ${availableModifier.name}`
          );

          // Для діапазонних модифікаторів
          if (
            availableModifier.minValue !== undefined &&
            availableModifier.maxValue !== undefined
          ) {
            // Переконуємося, що значення знаходиться в межах діапазону
            const boundedValue = Math.max(
              availableModifier.minValue,
              Math.min(value, availableModifier.maxValue)
            );

            console.log(
              `Змінюємо значення діапазонного модифікатора ${modifierId} на ${boundedValue} (було запрошено ${value})`
            );

            // Змінюємо значення модифікатора
            currentModifiers[index].selectedValue = boundedValue;
          } else if (!availableModifier.isPercentage) {
            // Для фіксованих модифікаторів (кількість)
            const quantity = Math.max(1, Math.floor(value)); // Мінімум 1 і ціле число
            console.log(
              `Змінюємо кількість фіксованого модифікатора ${modifierId} на ${quantity}`
            );
            currentModifiers[index].selectedValue = quantity;
          } else {
            // Для звичайних модифікаторів
            console.log(
              `Змінюємо значення звичайного модифікатора ${modifierId} на ${value}`
            );
            currentModifiers[index].selectedValue = value;
          }

          // Оновлюємо форму
          setValue('appliedModifiers', [...currentModifiers], {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });

          // Встановлюємо флаг брудної форми
          setDirty(true);

          // Обов'язково примусово оновлюємо розрахунок ціни
          forceRecalculation();
        } else {
          console.warn(
            `Модифікатор ${modifierId} не знайдено серед доступних модифікаторів`
          );
        }
      } else {
        console.warn(
          `Модифікатор ${modifierId} не знайдено в списку застосованих модифікаторів`
        );
      }
    },
    [
      formValues.appliedModifiers,
      modifiers,
      setValue,
      setDirty,
      forceRecalculation,
    ]
  );

  // Перевірка, чи модифікатор застосовано
  const isModifierApplied = useCallback(
    (modifierId: string) => {
      return formValues.appliedModifiers.some(
        (m) => m.modifierId === modifierId
      );
    },
    [formValues.appliedModifiers]
  );

  // Отримання вибраного значення модифікатора
  const getModifierSelectedValue = useCallback(
    (modifierId: string) => {
      const modifier = formValues.appliedModifiers.find(
        (m) => m.modifierId === modifierId
      );
      return modifier?.selectedValue;
    },
    [formValues.appliedModifiers]
  );

  // Ефект для логування розрахунку цін
  useEffect(() => {
    if (priceCalculation) {
      console.log('Оновлено розрахунок ціни:', {
        базова: priceCalculation.basePrice,
        загальна: priceCalculation.totalPrice,
        модифікатори: priceCalculation.modifiersImpact.length,
      });
    }
  }, [priceCalculation]);

  // Перехід до наступного кроку (підетапу) після збереження даних
  const onSubmit = handleSubmit(async (data) => {
    if (!currentItem) return;

    // Перевіряємо наявність обов'язкових даних
    if (!currentItem.categoryCode) {
      console.error('Помилка: код категорії не вказано');
      return;
    }

    if (!itemName) {
      console.error('Помилка: назва предмета не вказана');
      return;
    }

    try {
      // Отримуємо розрахунок ціни з API
      const categoryCode = currentItem.categoryCode.trim();
      const cleanItemName = itemName.trim();

      console.log(
        `Розрахунок ціни: категорія="${categoryCode}", предмет="${cleanItemName}"`
      );

      const calculationResult = await itemPricingApi.calculatePrice(
        data.basePrice,
        categoryCode,
        cleanItemName,
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
    navigateToStep(
      WizardStep.ITEM_WIZARD,
      ItemWizardSubStep.PHOTO_DOCUMENTATION
    );
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

  // Додаємо стеження за стором щоб оновити API запит коли змінюється категорія
  useEffect(() => {
    if (categoryId && itemName && currentItem?.categoryCode) {
      console.log(
        `Категорія змінилась: id=${categoryId}, code=${currentItem.categoryCode}, name=${itemName}`
      );
      // Примусово обновляємо розрахунок при зміні даних
      forceRecalculation();
    }
  }, [categoryId, itemName, currentItem?.categoryCode, forceRecalculation]);

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
