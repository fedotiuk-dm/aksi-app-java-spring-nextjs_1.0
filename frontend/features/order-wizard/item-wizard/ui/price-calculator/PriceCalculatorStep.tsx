'use client';

import { Alert, Box, Grid, Typography } from '@mui/material';
import React, { useCallback, useMemo } from 'react';

import { useItemWizard, usePriceCalculator } from '@/domain/order';
import {
  PriceBaseInfo,
  PriceModifierPanel,
  PriceCalculationResult,
  StatusMessage,
  StepContainer,
  StepNavigation,
} from '@/shared/ui';

/**
 * Підкрок 2.4: Розрахунок ціни (калькулятор ціни)
 *
 * FSD принципи:
 * - "Тонкий" UI компонент без бізнес-логіки
 * - Отримує всю функціональність з domain layer
 * - Використовує shared UI компоненти
 * - Інтерактивний розрахунок ціни з деталізацією
 */
export const PriceCalculatorStep: React.FC = () => {
  // === DOMAIN HOOKS ===
  // TODO: Отримати orderId з wizard state/context
  const orderId = 'temp-order-id'; // Тимчасове значення
  const { itemData, validation, canProceed, updatePriceModifiers, wizard } = useItemWizard({
    orderId,
  });
  const {
    expandedSections,
    isCalculating,
    customValues,
    getAvailableCategories,
    calculatePrice,
    simulateCalculation,
    handleModifierChange,
    handleCustomValueChange,
    handleSectionToggle,
    getAppliedModifiersFromItemData,
  } = usePriceCalculator();

  // === COMPUTED VALUES ===
  const selectedModifiers = useMemo(
    () => getAppliedModifiersFromItemData(itemData),
    [getAppliedModifiersFromItemData, itemData]
  );

  const availableCategories = useMemo(
    () => getAvailableCategories(itemData.category || ''),
    [getAvailableCategories, itemData.category]
  );

  const priceCalculation = useMemo(() => {
    if (!itemData.name || !itemData.unitPrice || itemData.quantity <= 0) {
      return null;
    }

    return calculatePrice(itemData, selectedModifiers, customValues);
  }, [itemData, selectedModifiers, customValues, calculatePrice]);

  // === EVENT HANDLERS ===

  /**
   * Обробник зміни модифікаторів
   */
  const handleModifierSelection = useCallback(
    (modifierId: string, checked: boolean, customValue?: number) => {
      // Симуляція розрахунку
      simulateCalculation();

      // Оновлюємо itemData через ItemWizard
      const updates: any = {};

      switch (modifierId) {
        case 'childSized':
          updates.childSized = checked;
          break;
        case 'manualCleaning':
          updates.manualCleaning = checked;
          break;
        case 'heavilySoiled':
          updates.heavilySoiled = checked;
          if (checked && customValue !== undefined) {
            updates.heavilySoiledPercentage = customValue;
          }
          break;
        default:
          // Інші модифікатори поки що не обробляються в ItemWizard
          break;
      }

      if (Object.keys(updates).length > 0) {
        updatePriceModifiers(updates);
      }

      // Також оновлюємо внутрішній стан PriceCalculator хука
      handleModifierChange(modifierId, checked, customValue);
    },
    [updatePriceModifiers, handleModifierChange, simulateCalculation]
  );

  /**
   * Обробник зміни кастомного значення
   */
  const handleCustomValue = useCallback(
    (modifierId: string, value: number) => {
      handleCustomValueChange(modifierId, value);

      // Оновлюємо ItemWizard якщо це відомий модифікатор
      if (modifierId === 'heavilySoiled' && itemData.heavilySoiled) {
        updatePriceModifiers({
          heavilySoiledPercentage: value,
        });
      }

      simulateCalculation();
    },
    [handleCustomValueChange, updatePriceModifiers, itemData.heavilySoiled, simulateCalculation]
  );

  /**
   * Обробник переходу до наступного підкроку
   */
  const handleNext = useCallback(() => {
    if (canProceed) {
      const result = wizard.navigateForward();
      if (result.success) {
        console.log('Перехід до фотодокументації');
      } else {
        console.error('Помилка переходу:', result.errors);
      }
    }
  }, [canProceed, wizard]);

  /**
   * Обробник повернення до попереднього підкроку
   */
  const handleBack = useCallback(() => {
    const result = wizard.navigateBack();
    if (result.success) {
      console.log('Повернення до дефектів та плям');
    } else {
      console.error('Помилка повернення:', result.errors);
    }
  }, [wizard]);

  // === VALIDATION ===
  const hasValidData = Boolean(itemData.name && itemData.unitPrice && itemData.quantity > 0);

  return (
    <StepContainer
      title="Розрахунок ціни"
      subtitle="Налаштуйте модифікатори ціни та переглядайте детальний розрахунок вартості"
    >
      <Box sx={{ minHeight: '400px' }}>
        {/* Базова інформація та ціна */}
        <PriceBaseInfo
          itemName={itemData.name || 'Не вказано'}
          category={itemData.category || 'Не вказано'}
          quantity={itemData.quantity || 0}
          unitOfMeasure={itemData.unitOfMeasure || 'шт'}
          unitPrice={itemData.unitPrice || 0}
        />

        {hasValidData ? (
          <Grid container spacing={3}>
            {/* Панель модифікаторів */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <PriceModifierPanel
                categories={availableCategories}
                selectedModifiers={selectedModifiers}
                customValues={customValues}
                expandedSections={expandedSections}
                onModifierChange={handleModifierSelection}
                onCustomValueChange={handleCustomValue}
                onSectionToggle={handleSectionToggle}
                disabled={isCalculating}
              />
            </Grid>

            {/* Результати розрахунку */}
            <PriceCalculationResult
              calculation={priceCalculation}
              isCalculating={isCalculating}
              sticky={true}
            />
          </Grid>
        ) : (
          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="body2">
              Заповніть базову інформацію про предмет на попередніх кроках для отримання розрахунку
              ціни
            </Typography>
          </Alert>
        )}

        {/* Валідація */}
        {validation.priceCalculator.errors &&
          Object.keys(validation.priceCalculator.errors).length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Виправте помилки: {Object.values(validation.priceCalculator.errors).join(', ')}
              </Typography>
            </Alert>
          )}

        {/* Статусне повідомлення */}
        <StatusMessage
          message={`Розрахунок завершено! Фінальна вартість: ${
            priceCalculation?.finalPrice.toFixed(2) || '0.00'
          } грн`}
          severity="success"
          show={hasValidData && priceCalculation !== null && canProceed}
        />
      </Box>

      <StepNavigation
        onNext={canProceed ? handleNext : undefined}
        onBack={handleBack}
        nextLabel="Продовжити до фото"
        backLabel="Назад до дефектів"
        isNextDisabled={!canProceed}
        nextLoading={isCalculating}
      />
    </StepContainer>
  );
};

export default PriceCalculatorStep;
