"use client";

import React, { useState } from 'react';
import { Box, Typography, Paper, Stepper, Step, StepLabel, Button } from '@mui/material';

/**
 * Простий компонент-заглушка OrderWizard.
 * Базова реалізація покрокового інтерфейсу для створення замовлення
 */
const OrderWizard: React.FC = () => {
  // Простий локальний стан для кроків
  const [activeStep, setActiveStep] = useState(0);

  // Кроки майстра замовлень
  const wizardSteps = [
    'Клієнт',
    'Предмети',
    'Параметри',
    'Підтвердження'
  ];

  // Заглушка для контенту кроків
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box py={3}>
            <Typography variant="h6">Крок 1: Вибір або створення клієнта</Typography>
            <Typography variant="body1" color="text.secondary" my={2}>
              В цьому кроці ви зможете вибрати існуючого клієнта або створити нового.
            </Typography>
            <Typography variant="body2" color="primary">
              Очікується реалізація API та компонентів
            </Typography>
          </Box>
        );
      case 1:
        return (
          <Box py={3}>
            <Typography variant="h6">Крок 2: Управління предметами</Typography>
            <Typography variant="body1" color="text.secondary" my={2}>
              В цьому кроці ви зможете додати предмети до замовлення, вказати їх кількість та ціну.
            </Typography>
            <Typography variant="body2" color="primary">
              Очікується реалізація API та компонентів
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box py={3}>
            <Typography variant="h6">Крок 3: Параметри замовлення</Typography>
            <Typography variant="body1" color="text.secondary" my={2}>
              В цьому кроці ви вказуєте загальні параметри замовлення та додаткову інформацію.
            </Typography>
            <Typography variant="body2" color="primary">
              Очікується реалізація API та компонентів
            </Typography>
          </Box>
        );
      case 3:
        return (
          <Box py={3}>
            <Typography variant="h6">Крок 4: Підтвердження замовлення</Typography>
            <Typography variant="body1" color="text.secondary" my={2}>
              В цьому кроці ви можете переглянути та підтвердити замовлення.
            </Typography>
            <Typography variant="body2" color="primary">
              Очікується реалізація API та компонентів
            </Typography>
          </Box>
        );
      default:
        return 'Невідомий крок';
    }
  };

  // Перехід до наступного кроку
  const handleNext = () => {
    const nextStep = activeStep + 1;
    if (nextStep < wizardSteps.length) {
      setActiveStep(nextStep);
    }
  };

  // Перехід до попереднього кроку
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {wizardSteps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {getStepContent(activeStep)}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button 
          variant="outlined" 
          disabled={activeStep === 0} 
          onClick={handleBack}
        >
          Назад
        </Button>
        <Button 
          variant="contained" 
          onClick={handleNext}
          disabled={activeStep === wizardSteps.length - 1}
        >
          {activeStep === wizardSteps.length - 1 ? 'Завершити' : 'Далі'}
        </Button>
      </Box>
    </Paper>
  );
};

export default OrderWizard;
