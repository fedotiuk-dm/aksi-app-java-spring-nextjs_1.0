"use client";

import React from 'react';
import { Box, Paper, Stepper, Step, StepLabel } from '@mui/material';
import { OrderWizardProvider } from '../model/OrderWizardContext';
import { useOrderWizardNavigation } from '../model/store/store';
import { WizardStep } from '../model/types';
import { StepContainer, StepNavigation } from './components';
import { ClientSelectionStep } from './steps/step1-client-selection/ClientSelectionStep';
import { BasicInfoStep } from './steps/step2-basic-info';
import { ItemManagerStep } from './steps/step3-item-manager';
import { ItemWizardStep } from './steps/step4-item-wizard';

/**
 * Головний компонент OrderWizard.
 * Відображає покроковий інтерфейс для створення замовлення
 */
const OrderWizardContent: React.FC = () => {
  const { currentStep, navigateToStep, navigateBack } = useOrderWizardNavigation();

  // Кроки майстра замовлень
  const wizardSteps = [
    { step: WizardStep.CLIENT_SELECTION, label: 'Клієнт' },
    { step: WizardStep.BASIC_INFO, label: 'Базова інформація' },
    { step: WizardStep.ITEM_MANAGER, label: 'Предмети' },
    { step: WizardStep.COMPLETION, label: 'Підтвердження' }
  ];

  // Обробники навігації
  const handleNext = () => {
    const currentIndex = wizardSteps.findIndex(item => item.step === currentStep);
    const nextStep = wizardSteps[currentIndex + 1]?.step;
    if (nextStep) {
      navigateToStep(nextStep);
    }
  };

  const handleBack = () => {
    navigateBack();
  };

  // Відображення контенту відповідно до поточного кроку
  const renderStepContent = () => {
    switch (currentStep) {
      case WizardStep.CLIENT_SELECTION:
        return <ClientSelectionStep />;
      case WizardStep.ITEM_MANAGER:
        return <ItemManagerStep />;
      case WizardStep.ITEM_WIZARD:
        return <ItemWizardStep />;
      case WizardStep.BASIC_INFO:
        return <BasicInfoStep />;
      case WizardStep.COMPLETION:
        return (
          <StepContainer title="Підтвердження замовлення">
            <Box py={3}>
              Компонент підтвердження замовлення буде реалізовано в наступних версіях
            </Box>
          </StepContainer>
        );
      default:
        return null;
    }
  };

  // Визначення стану кнопок для навігації
  const isFirstStep = currentStep === wizardSteps[0].step;
  const isLastStep = currentStep === wizardSteps[wizardSteps.length - 1].step;

  return (
    <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
      <Stepper activeStep={wizardSteps.findIndex(item => item.step === currentStep)} sx={{ mb: 4 }}>
        {wizardSteps.map(({ label }) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent()}

      <StepNavigation 
        onNext={handleNext} 
        onBack={handleBack} 
        isBackDisabled={isFirstStep}
        isNextDisabled={isLastStep}
        nextLabel={isLastStep ? 'Завершити' : 'Далі'}
      />
    </Paper>
  );
};

/**
 * Обгортка для OrderWizard з провайдером контексту
 */
const OrderWizard: React.FC = () => {
  return (
    <OrderWizardProvider>
      <OrderWizardContent />
    </OrderWizardProvider>
  );
};

export default OrderWizard;
