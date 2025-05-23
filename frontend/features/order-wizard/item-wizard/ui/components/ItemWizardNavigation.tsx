'use client';

import { Box, Button } from '@mui/material';
import React from 'react';

interface ItemWizardNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isNextDisabled?: boolean;
  nextLoading?: boolean;
  onNext: () => void;
  onBack: () => void;
  onCancel?: () => void;
}

/**
 * Компонент навігації підвізарда предметів
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення кнопок навігації
 * - Отримує обробники подій через пропси
 * - Не містить бізнес-логіки
 */
export const ItemWizardNavigation: React.FC<ItemWizardNavigationProps> = ({
  isFirstStep,
  isLastStep,
  isNextDisabled = false,
  nextLoading = false,
  onNext,
  onBack,
  onCancel,
}) => {
  // Динамічні тексти кнопок
  const nextLabel = isLastStep ? 'Завершити предмет' : 'Продовжити';
  const backLabel = isFirstStep ? 'Скасувати' : 'Назад';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        pt: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Кнопка "Назад" або "Скасувати" */}
      <Button variant="outlined" onClick={onBack} disabled={nextLoading} size="large">
        {backLabel}
      </Button>

      {/* Додаткові дії (показуємо кнопку скасування тільки не на першому кроці) */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {!isFirstStep && onCancel && (
          <Button
            variant="outlined"
            color="error"
            onClick={onCancel}
            size="small"
            disabled={nextLoading}
          >
            Скасувати предмет
          </Button>
        )}

        {/* Кнопка "Продовжити" або "Завершити" */}
        <Button
          variant="contained"
          onClick={onNext}
          disabled={isNextDisabled || nextLoading}
          size="large"
          sx={{ minWidth: 140 }}
        >
          {nextLoading ? 'Обробка...' : nextLabel}
        </Button>
      </Box>
    </Box>
  );
};

export default ItemWizardNavigation;
