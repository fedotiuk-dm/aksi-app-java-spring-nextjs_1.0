import React, { useState } from 'react';
import { Button, Box, Typography, Divider, Paper, styled } from '@mui/material';
import { WizardStep } from '../../model/types';
import { useOrderWizardNavigation } from '../../model/store';

// Типи для підкроків Item Wizard
enum ItemWizardSubStep {
  BASIC_INFO = 'BASIC_INFO',
  ITEM_PROPERTIES = 'ITEM_PROPERTIES',
  DEFECTS_STAINS = 'DEFECTS_STAINS',
  PRICE_CALCULATOR = 'PRICE_CALCULATOR',
  PHOTO_DOCUMENTATION = 'PHOTO_DOCUMENTATION',
}

// Інтерфейс для пропсів нашої кнопки
interface NavButtonProps {
  isActive?: boolean;
}

// Стилізована кнопка для кращого відображення
const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<NavButtonProps>(({ theme, isActive }) => ({
  margin: theme.spacing(0.5),
  fontWeight: isActive ? 'bold' : 'normal',
  backgroundColor: isActive ? theme.palette.primary.main : theme.palette.grey[200],
  color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: isActive ? theme.palette.primary.dark : theme.palette.grey[300],
  },
}));

/**
 * Простий компонент для тестування навігації між кроками та підкроками візарда
 */
export const StepNavigationTest: React.FC = () => {
  const { currentStep, currentSubStep, navigateToStep } = useOrderWizardNavigation();
  
  // Локальний стан для відстеження історії переходів
  const [history, setHistory] = useState<{ step: WizardStep; subStep?: string }[]>([]);
  
  // Обробник для переходу до кроку
  const handleStepChange = (step: WizardStep) => {
    navigateToStep(step);
    
    // Додаємо в історію
    setHistory(prev => [...prev, { step, subStep: undefined }]);
  };
  
  // Обробник для переходу до підкроку
  const handleSubStepChange = (subStep: string) => {
    navigateToStep(currentStep, subStep);
    
    // Додаємо в історію
    setHistory(prev => [...prev, { step: currentStep, subStep }]);
  };
  
  // Отримуємо відповідні підкроки для поточного кроку
  const getSubStepsForCurrentStep = () => {
    switch (currentStep) {
      case WizardStep.ITEM_WIZARD:
        return Object.values(ItemWizardSubStep);
      default:
        return [];
    }
  };
  
  return (
    <Paper sx={{ p: 3, maxWidth: 900, margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Тестування навігації візарда
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Поточний стан:</Typography>
        <Typography>
          Крок: <strong>{currentStep}</strong>
          {currentSubStep && <> | Підкрок: <strong>{currentSubStep}</strong></>}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box>
        <Typography variant="h6" gutterBottom>Основні кроки:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {Object.values(WizardStep).map((step) => (
            <NavButton
              key={step}
              variant="contained"
              size="small"
              isActive={currentStep === step}
              onClick={() => handleStepChange(step)}
            >
              {step}
            </NavButton>
          ))}
        </Box>
      </Box>
      
      {getSubStepsForCurrentStep().length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Підкроки для {currentStep}:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {getSubStepsForCurrentStep().map((subStep) => (
              <NavButton
                key={subStep}
                variant="contained"
                size="small"
                isActive={currentSubStep === subStep}
                onClick={() => handleSubStepChange(subStep)}
              >
                {subStep}
              </NavButton>
            ))}
          </Box>
        </Box>
      )}
      
      <Divider sx={{ my: 3 }} />
      
      <Box>
        <Typography variant="h6" gutterBottom>Історія переходів:</Typography>
        <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
          {history.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Історія порожня
            </Typography>
          ) : (
            history.map((item, index) => (
              <Typography key={index} variant="body2">
                {index + 1}. Крок: <strong>{item.step}</strong>
                {item.subStep && <> | Підкрок: <strong>{item.subStep}</strong></>}
              </Typography>
            ))
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default StepNavigationTest;
