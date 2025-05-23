'use client';

import { Box, Typography } from '@mui/material';
import React from 'react';

import { WizardStep } from '@/domain/wizard';

// Імпорт реальних компонентів підкроків
import { ItemBasicInfoStep } from '../item-basic-info';
import { ItemPropertiesStep } from '../item-properties';
import { DefectsStainsStep } from '../defects-stains';
import { PriceCalculatorStep } from '../price-calculator';
import { PhotoDocumentationStep } from '../photo-documentation';

interface ItemWizardContentProps {
  currentStep: WizardStep;
}

/**
 * Компонент контенту підвізарда предметів
 *
 * FSD принципи:
 * - Тільки UI логіка для рендерингу поточного підкроку
 * - Отримує поточний крок через пропси
 * - Не містить бізнес-логіки навігації
 */
export const ItemWizardContent: React.FC<ItemWizardContentProps> = ({ currentStep }) => {
  /**
   * Маппінг кроків до компонентів з правильною типізацією
   */
  const stepComponents: Record<string, React.ReactElement> = {
    [WizardStep.ITEM_BASIC_INFO]: <ItemBasicInfoStep />,
    [WizardStep.ITEM_PROPERTIES]: <ItemPropertiesStep />,
    [WizardStep.DEFECTS_STAINS]: <DefectsStainsStep />,
    [WizardStep.PRICE_CALCULATOR]: <PriceCalculatorStep />,
    [WizardStep.PHOTO_DOCUMENTATION]: <PhotoDocumentationStep />,
  };

  const component = stepComponents[currentStep];

  if (!component) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Невідомий підкрок підвізарда
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Поточний крок: {currentStep}
        </Typography>
      </Box>
    );
  }

  return <Box sx={{ minHeight: '400px', py: 2 }}>{component}</Box>;
};

export default ItemWizardContent;
