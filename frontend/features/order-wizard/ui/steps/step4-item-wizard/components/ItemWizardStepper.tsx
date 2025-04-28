import React from 'react';
import { Stepper, Step, StepLabel, Box, useTheme, useMediaQuery } from '@mui/material';
import { useOrderWizardStore } from '@/features/order-wizard/model/store/store';
import { ItemWizardSubStep } from '@/features/order-wizard/model/types';

/**
 * Компонент для відображення поточного прогресу у візарді предметів
 */
export const ItemWizardStepper: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Отримуємо поточний підетап з глобального стану
  const currentSubStep = useOrderWizardStore(state => state.currentSubStep) as string;
  
  // Визначаємо всі підетапи у правильному порядку
  const subSteps = [
    { label: 'Основна інформація', value: ItemWizardSubStep.BASIC_INFO },
    { label: 'Властивості', value: ItemWizardSubStep.ITEM_PROPERTIES },
    { label: 'Дефекти і плями', value: ItemWizardSubStep.DEFECTS_STAINS },
    { label: 'Калькулятор ціни', value: ItemWizardSubStep.PRICE_CALCULATOR },
    { label: 'Фотодокументація', value: ItemWizardSubStep.PHOTO_DOCUMENTATION },
  ];
  
  // Отримуємо індекс поточного підетапу
  const activeStep = subSteps.findIndex(step => 
    step.value === currentSubStep || step.value === (currentSubStep as string)
  );
  
  // Для мобільних пристроїв показуємо тільки поточний крок і сусідні
  const visibleSteps = isMobile 
    ? subSteps.filter((_, index) => Math.abs(index - activeStep) <= 1) 
    : subSteps;

  // Починаємо з нуля, якщо підетап невідомий
  const safeActiveStep = activeStep === -1 ? 0 : activeStep;
  
  // Мобільна версія вже правильно оброблена через visibleSteps
  
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper 
        activeStep={isMobile && activeStep > 0 ? 1 : safeActiveStep} 
        alternativeLabel={!isMobile}
        sx={{ 
          overflowX: 'auto',
          '& .MuiStepConnector-line': {
            minWidth: isMobile ? '40px' : 'auto' 
          }
        }}
      >
        {visibleSteps.map((step, index) => (
          <Step 
            key={step.value}
            completed={index < safeActiveStep}
            active={index === safeActiveStep}
          >
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
