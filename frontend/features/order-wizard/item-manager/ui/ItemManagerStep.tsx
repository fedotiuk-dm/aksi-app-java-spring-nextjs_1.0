'use client';

import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography, Paper, Chip } from '@mui/material';
import React from 'react';

import { useOrderItems } from '@/domain/order';
import { useWizard } from '@/domain/wizard';

import { ItemsTable, ItemsSummary } from './components';
import { StepContainer } from '../../shared/ui/step-container';
import { StepNavigation } from '../../shared/ui/step-navigation';

/**
 * Головний компонент для ITEM_MANAGER кроку Order Wizard
 *
 * FSD принципи:
 * - Тільки UI логіка (презентаційний компонент)
 * - Отримує всі дані з domain хуків
 * - Мінімальний локальний стан
 * - Композиція спеціалізованих UI компонентів
 *
 * Згідно з документацією Order Wizard:
 * Етап 2: Менеджер предметів (циклічний процес)
 * 2.0. Головний екран менеджера предметів
 * - Таблиця доданих предметів
 * - Кнопка "Додати предмет" (запускає підвізард)
 * - Лічильник загальної вартості
 * - Кнопка "Продовжити до наступного етапу"
 */
export const ItemManagerStep: React.FC = () => {
  // Отримуємо wizard функціональність
  const wizard = useWizard();

  // TODO: Отримати orderId з wizard state
  const orderId = 'temp-order-id'; // Тимчасове значення

  // Отримуємо дані предметів з domain layer
  const { hasItems, canProceed, isLoading, isOperating } = useOrderItems({ orderId });

  // Логування для діагностики
  console.log('ItemManagerStep render:', {
    currentStep: wizard.currentStep,
    isItemWizardActive: wizard.isItemWizardActive,
    hasItems,
    canProceed,
    isLoading,
    isOperating,
  });

  /**
   * Обробник запуску підвізарда для додавання предмета
   */
  const handleAddItem = () => {
    console.log('Запуск item wizard для додавання предмета');
    const result = wizard.startItemWizardFlow();

    if (result.success) {
      console.log('Item wizard запущено успішно');
    } else {
      console.error('Помилка запуску item wizard:', result.error);
    }
  };

  /**
   * Обробник переходу до наступного кроку
   */
  const handleNext = async () => {
    if (!hasItems) {
      console.log('Не можна продовжити - немає жодного предмета');
      return;
    }

    console.log('Перехід до параметрів замовлення');
    const result = wizard.navigateForward();
    if (result.success) {
      console.log('Успішно перейшли до ORDER_PARAMETERS');
    } else {
      console.error('Помилка переходу:', result.errors);
    }
  };

  /**
   * Обробник повернення до попереднього кроку
   */
  const handleBack = async () => {
    console.log('Повернення до вибору філії');

    const result = wizard.navigateBack();
    if (result.success) {
      console.log('Успішно повернулися до BRANCH_SELECTION');
    } else {
      console.error('Помилка повернення:', result.errors);
    }
  };

  /**
   * Перевірка чи можна перейти до наступного кроку
   */
  const canNavigateNext = canProceed && hasItems && !isLoading && !isOperating;

  return (
    <StepContainer
      title="Управління предметами"
      subtitle="Додайте предмети до замовлення та налаштуйте їх параметри"
    >
      <Box sx={{ minHeight: '400px' }}>
        {/* Статистика предметів */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
          <ItemsSummary />
        </Paper>

        {/* Кнопка додавання предмета */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            disabled={wizard.isItemWizardActive || isLoading || isOperating}
            size="large"
          >
            Додати предмет
          </Button>

          {wizard.isItemWizardActive && (
            <Chip label="Підвізард активний" color="primary" variant="outlined" />
          )}

          {isOperating && <Chip label="Збереження..." color="secondary" variant="outlined" />}
        </Box>

        {/* Таблиця предметів */}
        <ItemsTable />

        {/* Підказка якщо немає предметів */}
        {!hasItems && !isLoading && !wizard.isItemWizardActive && (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'grey.50',
              border: '2px dashed',
              borderColor: 'grey.300',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Почніть додавання предметів
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Натисніть кнопку &quot;Додати предмет&quot; щоб розпочати конфігурацію першого
              предмета
            </Typography>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddItem} size="large">
              Додати перший предмет
            </Button>
          </Paper>
        )}

        {/* Інформація про вимоги */}
        {!hasItems && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'info.light' }}>
            <Typography variant="body2" color="info.dark">
              <strong>Важливо:</strong> Для продовження до наступного етапу необхідно додати
              принаймні один предмет до замовлення.
            </Typography>
          </Paper>
        )}
      </Box>

      <StepNavigation
        onNext={canNavigateNext ? handleNext : undefined}
        onBack={handleBack}
        nextLabel="Продовжити до параметрів"
        backLabel="Назад до філії"
        isNextDisabled={!canNavigateNext}
        nextLoading={isLoading || isOperating}
      />
    </StepContainer>
  );
};

export default ItemManagerStep;
