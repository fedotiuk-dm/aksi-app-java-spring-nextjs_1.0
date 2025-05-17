'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import { BasePriceDisplay, ModifiersList, PriceBreakdown } from './components';
import { useOrderWizardStore } from '@/features/order-wizard/model/store/store';
import {
  WizardStep,
  ItemWizardSubStep,
} from '@/features/order-wizard/model/types';
import { useItemPricing } from '@/features/order-wizard/api/stages/stage2/item-pricing';
import { AppliedModifier } from '@/features/order-wizard/model/schema/item-pricing.schema';
import { calculateTotalPrice } from '@/features/order-wizard/model/schema/item-pricing.schema';

/**
 * Підетап "Знижки та надбавки (калькулятор ціни)"
 */
const PriceCalculatorSubstep: React.FC = () => {
  // Стан із глобального стору
  const currentItem = useOrderWizardStore((state) => state.currentItem);
  const setCurrentItem = useOrderWizardStore((state) => state.setCurrentItem);
  const navigateToStep = useOrderWizardStore((state) => state.navigateToStep);

  // Локальний стан
  const [appliedModifiers, setAppliedModifiers] = useState<AppliedModifier[]>(
    currentItem?.priceModifiers || []
  );
  const [basePrice, setBasePrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [priceCalculationTimestamp, setPriceCalculationTimestamp] =
    useState<number>(Date.now());
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  // API хуки для роботи з модифікаторами ціни
  const {
    useBasePriceForItem,
    useModifiersForItem,
    useCalculatePriceOnChange,
  } = useItemPricing();

  // Отримання базової ціни для предмета
  const {
    basePrice: fetchedBasePrice,
    isLoading: isBasePriceLoading,
    error: basePriceError,
  } = useBasePriceForItem(currentItem?.categoryCode, currentItem?.name);

  // Отримання модифікаторів для вибраної категорії
  const {
    modifiers: availableModifiers,
    isLoading: isModifiersLoading,
    error: modifiersError,
  } = useModifiersForItem(currentItem?.categoryCode);

  // Розрахунок підсумкової ціни з урахуванням модифікаторів
  const {
    data: calculationResult,
    isLoading: isCalculationLoading,
    error: calculationError,
  } = useCalculatePriceOnChange(
    basePrice,
    currentItem?.categoryCode,
    currentItem?.name,
    appliedModifiers,
    availableModifiers,
    priceCalculationTimestamp
  );

  // При завантаженні або зміні базової ціни
  useEffect(() => {
    if (fetchedBasePrice) {
      console.log('Оновлення базової ціни:', fetchedBasePrice);
      setBasePrice(fetchedBasePrice);
    }
  }, [fetchedBasePrice]);

  // Оновлення при отриманні результату розрахунку
  useEffect(() => {
    if (calculationResult) {
      console.log('Отримано результат розрахунку ціни:', calculationResult);
      setTotalPrice(calculationResult.totalPrice);
    }
  }, [calculationResult]);

  // Підраховуємо локально, якщо API розрахунку недоступне
  useEffect(() => {
    if (calculationError || !calculationResult) {
      console.log('Використовуємо локальний розрахунок ціни через помилку API');

      // Викликаємо локальну функцію розрахунку
      const localCalculation = calculateTotalPrice(
        basePrice,
        appliedModifiers,
        availableModifiers
      );

      setTotalPrice(localCalculation.totalPrice);
    }
  }, [
    calculationError,
    calculationResult,
    basePrice,
    appliedModifiers,
    availableModifiers,
  ]);

  // Ініціалізуємо модифікатори з поточного предмета
  useEffect(() => {
    if (currentItem?.priceModifiers) {
      setAppliedModifiers(currentItem.priceModifiers);
    } else {
      setAppliedModifiers([]);
    }
  }, [currentItem]);

  // Обробник додавання/оновлення модифікатора
  const handleModifierChange = useCallback(
    (modifierId: string, value: number) => {
      setAppliedModifiers((prevModifiers) => {
        // Перевіряємо, чи вже є такий модифікатор
        const existingIndex = prevModifiers.findIndex(
          (m) => m.modifierId === modifierId
        );

        if (existingIndex >= 0) {
          // Оновлюємо існуючий модифікатор
          const updatedModifiers = [...prevModifiers];
          updatedModifiers[existingIndex] = {
            ...updatedModifiers[existingIndex],
            selectedValue: value,
          };
          return updatedModifiers;
        } else {
          // Додаємо новий модифікатор
          return [...prevModifiers, { modifierId, selectedValue: value }];
        }
      });

      // Оновлюємо часову мітку для перерахунку ціни
      setPriceCalculationTimestamp(Date.now());
    },
    []
  );

  // Обробник видалення модифікатора
  const handleRemoveModifier = useCallback((modifierId: string) => {
    setAppliedModifiers((prevModifiers) =>
      prevModifiers.filter((mod) => mod.modifierId !== modifierId)
    );

    // Оновлюємо часову мітку для перерахунку ціни
    setPriceCalculationTimestamp(Date.now());
  }, []);

  // Обробник збереження та переходу до наступного кроку
  const handleSaveAndNext = useCallback(() => {
    if (!currentItem) return;

    // Отримуємо функцію оновлення поточного предмета
    const { updateCurrentItem } = useOrderWizardStore.getState();

    // Розраховуємо підсумкову ціну для одиниці товару
    const unitPrice = basePrice;

    // Розраховуємо загальну вартість з урахуванням кількості
    const quantity = currentItem.quantity || 1;
    const totalPrice = calculationResult?.totalPrice
      ? calculationResult.totalPrice * quantity
      : basePrice * quantity;

    // Зберігаємо дані в глобальному стані
    const updatedItem = {
      ...currentItem,
      unitPrice,
      totalPrice,
      priceModifiers: appliedModifiers,
      // Зберігаємо деталі розрахунку, якщо вони є
      priceCalculationDetails: calculationResult || {
        basePrice,
        totalPrice,
        modifiersImpact: [],
      },
    };

    setCurrentItem(updatedItem);

    // Зберігаємо оновлений предмет в масиві предметів, якщо це редагування існуючого
    updateCurrentItem();

    navigateToStep(
      WizardStep.ITEM_WIZARD,
      ItemWizardSubStep.PHOTO_DOCUMENTATION
    );
  }, [
    currentItem,
    basePrice,
    calculationResult,
    appliedModifiers,
    setCurrentItem,
    navigateToStep,
  ]);

  // Обробник повернення до попереднього кроку
  const handleBack = useCallback(() => {
    navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.DEFECTS_STAINS);
  }, [navigateToStep]);

  // Розрахунок валідності форми
  useEffect(() => {
    // Форма валідна, якщо є базова ціна
    setIsFormValid(basePrice > 0);
  }, [basePrice]);

  // Перевірка на помилки та завантаження даних
  const isLoading =
    isBasePriceLoading || isModifiersLoading || isCalculationLoading;

  if (!currentItem) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">
          Помилка: дані предмета не знайдено
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Калькулятор ціни
      </Typography>

      {/* Базова інформація про предмет */}
      <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {currentItem.name} ({currentItem.category})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Кількість: {currentItem.quantity} шт.
        </Typography>
      </Card>

      <Grid container spacing={3}>
        {/* Ліва колонка - базова ціна та модифікатори */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Базова ціна */}
          <BasePriceDisplay
            basePrice={basePrice}
            isLoading={isBasePriceLoading}
            error={basePriceError ? String(basePriceError) : undefined}
          />

          {/* Список модифікаторів */}
          <ModifiersList
            availableModifiers={availableModifiers}
            appliedModifiers={appliedModifiers}
            isLoading={isModifiersLoading}
            error={modifiersError ? String(modifiersError) : undefined}
            onModifierChange={handleModifierChange}
            onModifierRemove={handleRemoveModifier}
            categoryCode={currentItem.categoryCode}
          />
        </Grid>

        {/* Права колонка - підсумок розрахунку */}
        <Grid size={{ xs: 12, md: 5 }}>
          <PriceBreakdown
            basePrice={basePrice}
            totalPrice={totalPrice}
            modifiersImpact={calculationResult?.modifiersImpact || []}
            quantity={currentItem.quantity || 1}
            isLoading={isCalculationLoading}
            error={calculationError ? String(calculationError) : undefined}
          />
        </Grid>
      </Grid>

      {/* Кнопки навігації */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={handleBack}>
          Назад
        </Button>
        <Box sx={{ position: 'relative' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAndNext}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Обчислення ціни...' : 'Зберегти та продовжити'}
          </Button>
          {isLoading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PriceCalculatorSubstep;
