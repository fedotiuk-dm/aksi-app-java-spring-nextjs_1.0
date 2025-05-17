'use client';

import React from 'react';
import { Paper, Stepper, Step, StepLabel } from '@mui/material';
import { OrderWizardProvider } from '../model/OrderWizardContext';
import { useOrderWizardNavigation } from '../model/store/store';
import { WizardStep } from '../model/types/types';
import { ClientSelectionStep } from './steps/step1-client-selection/ClientSelectionStep';
import { BasicInfoStep } from './steps/step2-basic-info';
import { ItemManagerStep } from './steps/step3-item-manager';
import { ItemWizardStep } from './steps/step4-item-wizard';
import { CompletionStep } from './steps/step7-completion';

/**
 * Головний компонент OrderWizard.
 * Відображає покроковий інтерфейс для створення замовлення
 */
const OrderWizardContent: React.FC = () => {
  const { currentStep } = useOrderWizardNavigation();

  // Кроки майстра замовлень
  const wizardSteps = [
    { step: WizardStep.CLIENT_SELECTION, label: 'Клієнт' },
    { step: WizardStep.BASIC_INFO, label: 'Базова інформація' },
    { step: WizardStep.ITEM_MANAGER, label: 'Предмети' },
    { step: WizardStep.COMPLETION, label: 'Підтвердження' },
  ];

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
        return <CompletionStep />;
      default:
        return null;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
      <Stepper
        activeStep={wizardSteps.findIndex((item) => item.step === currentStep)}
        sx={{ mb: 4 }}
      >
        {wizardSteps.map(({ label }) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent()}
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
