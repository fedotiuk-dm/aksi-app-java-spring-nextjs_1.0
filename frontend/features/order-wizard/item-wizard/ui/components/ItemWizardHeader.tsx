'use client';

import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import React from 'react';

import { WizardStep } from '@/domain/wizard';

interface ItemWizardHeaderProps {
  currentStep: WizardStep;
  currentStepIndex: number;
  totalSteps: number;
}

/**
 * Компонент заголовка підвізарда предметів
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення заголовка
 * - Отримує дані через пропси
 * - Не містить бізнес-логіки
 */
export const ItemWizardHeader: React.FC<ItemWizardHeaderProps> = ({
  currentStep,
  currentStepIndex,
  totalSteps,
}) => {
  /**
   * Маппінг кроків до їх назв
   */
  const getStepTitle = (step: WizardStep): string => {
    const stepTitles: Record<string, string> = {
      [WizardStep.ITEM_BASIC_INFO]: 'Основна інформація',
      [WizardStep.ITEM_PROPERTIES]: 'Характеристики предмета',
      [WizardStep.DEFECTS_STAINS]: 'Забруднення та дефекти',
      [WizardStep.PRICE_CALCULATOR]: 'Розрахунок ціни',
      [WizardStep.PHOTO_DOCUMENTATION]: 'Фотодокументація',
    };
    return stepTitles[step] || 'Невідомий крок';
  };

  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <Box sx={{ mb: 3 }}>
      {/* Основний заголовок */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Додавання предмета: {getStepTitle(currentStep)}
        </Typography>

        <Chip
          label={`${currentStepIndex + 1} з ${totalSteps}`}
          color="primary"
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Прогрес бар */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Прогрес виконання
          </Typography>
          <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
            {Math.round(progress)}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
            },
          }}
        />
      </Box>

      {/* Підзаголовок з описом поточного кроку */}
      <Typography variant="body2" color="text.secondary">
        {getStepDescription(currentStep)}
      </Typography>
    </Box>
  );
};

/**
 * Допоміжна функція для отримання опису кроку
 */
function getStepDescription(step: WizardStep): string {
  const descriptions: Record<string, string> = {
    [WizardStep.ITEM_BASIC_INFO]: 'Оберіть категорію послуги та найменування предмета',
    [WizardStep.ITEM_PROPERTIES]: 'Вкажіть матеріал, колір та інші характеристики',
    [WizardStep.DEFECTS_STAINS]: 'Відзначте забруднення, дефекти та ризики',
    [WizardStep.PRICE_CALCULATOR]: 'Налаштуйте модифікатори та перегляньте ціну',
    [WizardStep.PHOTO_DOCUMENTATION]: 'Додайте фотографії предмета для документації',
  };
  return descriptions[step] || '';
}

export default ItemWizardHeader;
