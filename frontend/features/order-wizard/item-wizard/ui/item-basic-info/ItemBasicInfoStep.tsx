'use client';

import { Box } from '@mui/material';
import React from 'react';

import { useItemWizard, useItemBasicInfo } from '@/domain/order';
import { ItemBasicInfoForm, StepContainer, StepNavigation } from '@/shared/ui';

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
  // Отримуємо функціональність Item Wizard з domain layer
  const { canProceed, wizard } = useItemWizard();

  // Отримуємо функціональність для роботи з основною інформацією
  const { data, categories, itemNames, isLoading, validation, handlers } = useItemBasicInfo();

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

  return (
    <StepContainer
      title="Основна інформація про предмет"
      subtitle="Оберіть категорію послуги та вкажіть базові характеристики предмета"
    >
      <Box sx={{ minHeight: '400px' }}>
        <ItemBasicInfoForm
          data={data}
          categories={categories}
          itemNames={itemNames}
          validation={validation}
          isLoadingItems={isLoading}
          onCategoryChange={handlers.onCategoryChange}
          onItemNameChange={handlers.onItemNameChange}
          onQuantityChange={handlers.onQuantityChange}
          onPriceChange={handlers.onPriceChange}
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
