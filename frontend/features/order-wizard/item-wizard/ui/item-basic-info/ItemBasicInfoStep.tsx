'use client';

import { Box, Typography, Button } from '@mui/material';
import React from 'react';

import { useItemWizard, useItemBasicInfo } from '@/domain/order';
import { useWizardDebug, useWizardOrderId } from '@/domain/wizard';
import { ItemBasicInfoForm, StepContainer, StepNavigation, OrderDebugInfo } from '@/shared/ui';

/**
 * Підкрок 2.1: Основна інформація про предмет
 *
 * Згідно з документацією Order Wizard:
 * - Категорія послуги (вибір з реальних даних API)
 * - Найменування виробу (динамічний список цін на основі вибраної категорії)
 * - Одиниця виміру і кількість
 * - Автоматичне завантаження базової ціни з прайс-листа
 */
export const ItemBasicInfoStep: React.FC = () => {
  // Отримуємо orderId з wizard context
  const { orderId, hasOrderId } = useWizardOrderId();

  // Отримуємо функціональність Item Wizard з domain layer
  const { canProceed, wizard } = useItemWizard({ orderId });

  // Додаємо дебагінг для діагностики проблем
  useWizardDebug(true);

  // Отримуємо функціональність для роботи з основною інформацією
  const { data, categories, itemNames, currentItem, isLoading, validation, handlers } =
    useItemBasicInfo();

  // Debug logging
  console.log('🔍 ItemBasicInfoStep render:', {
    orderId,
    hasOrderId,
    canProceed,
    'data.category': data.category,
    'categories.length': categories.length,
  });

  /**
   * Обробник переходу до наступного підкроку
   */
  const handleNext = () => {
    if (canProceed) {
      const result = wizard.navigateForward();
      if (result.success) {
        console.log('Перехід до характеристик предмета');
      } else {
        console.error('Помилка переходу:', result.errors);
      }
    }
  };

  /**
   * Обробник повернення до попереднього кроку/виходу з підвізарда
   */
  const handleBack = () => {
    // Для першого кроку Item Wizard виходимо з підвізарда
    const result = wizard.finishItemWizardFlow(false);
    if (result.success) {
      console.log('Вихід з Item Wizard без збереження');
    } else {
      console.error('Помилка виходу з підвізарда:', result.error);
    }
  };

  // Показуємо повідомлення якщо замовлення ще не створене
  if (!hasOrderId) {
    return (
      <StepContainer
        title="Основна інформація про предмет"
        subtitle="Підготовка до додавання предмета"
      >
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="warning.main" gutterBottom>
            Замовлення ще не створене
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Поверніться до попереднього кроку та створіть замовлення перед додаванням предметів
          </Typography>
          <Button variant="outlined" onClick={handleBack}>
            Повернутися до створення замовлення
          </Button>
        </Box>
      </StepContainer>
    );
  }

  return (
    <StepContainer
      title="Основна інформація про предмет"
      subtitle="Оберіть категорію послуги та вкажіть базові характеристики предмета"
    >
      {/* Діагностична інформація (тільки в dev режимі) */}
      <OrderDebugInfo title="Стан замовлення - Item Basic Info" />

      <Box sx={{ minHeight: '400px' }}>
        <ItemBasicInfoForm
          data={data}
          categories={categories}
          itemNames={itemNames}
          currentItem={currentItem}
          validation={validation}
          isLoadingItems={isLoading}
          onCategoryChange={handlers.onCategoryChange}
          onItemNameChange={handlers.onItemNameChange}
          onQuantityChange={handlers.onQuantityChange}
          onPriceChange={handlers.onPriceChange}
          onPriceTypeChange={handlers.onPriceTypeChange}
          onDescriptionChange={handlers.onDescriptionChange}
        />
      </Box>

      <StepNavigation
        onNext={canProceed ? handleNext : undefined}
        onBack={handleBack}
        nextLabel="Продовжити до характеристик"
        backLabel="Назад до менеджера"
        isNextDisabled={!canProceed}
      />
    </StepContainer>
  );
};

export default ItemBasicInfoStep;
