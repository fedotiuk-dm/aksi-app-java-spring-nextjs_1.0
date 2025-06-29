'use client';

import React from 'react';
import { Box, Stepper, Step, StepLabel, Paper, Alert } from '@mui/material';
import { WizardProvider, useWizardForm } from './WizardProvider';
import { useOrderWizardStore } from './useOrderWizardStore';
import { useAutosave, type AutosaveData } from './autosave';
import { StepClient } from './steps/StepClient';
import { StepOrderInfo } from './steps/StepOrderInfo';
import { StepReview } from './steps/StepReview';

// Конфігурація кроків
const steps = [
  { key: 'client', label: 'Клієнт' },
  { key: 'orderInfo', label: 'Інформація про замовлення' },
  { key: 'review', label: 'Підтвердження' },
];

// Внутрішній компонент з доступом до контексту
const WizardContent: React.FC<{ onStageCompleted?: (sessionId: string) => void }> = ({
  onStageCompleted,
}) => {
  const { form } = useWizardForm();
  const { currentStep, autosaveError, isLoading } = useOrderWizardStore();

  // Ініціалізація autosave
  const autosaveData = useAutosave(form.control);

  // Визначення активного кроку для Stepper
  const activeStep = steps.findIndex((step) => step.key === currentStep);

  // Рендер поточного кроку
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'client':
        return <StepClient autosaveData={autosaveData} />;
      case 'orderInfo':
        return <StepOrderInfo autosaveData={autosaveData} />;
      case 'review':
        return <StepReview autosaveData={autosaveData} onStageCompleted={onStageCompleted} />;
      default:
        return <StepClient autosaveData={autosaveData} />;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Stepper */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Помилки autosave */}
      {autosaveError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {autosaveError}
        </Alert>
      )}

      {/* Індикатор завантаження */}
      {isLoading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Збереження даних...
        </Alert>
      )}

      {/* Поточний крок */}
      <Paper elevation={2} sx={{ p: 4 }}>
        {renderCurrentStep()}
      </Paper>

      {/* Дебаг інформація (тільки в development) */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <details>
            <summary>Debug Info</summary>
            <pre style={{ fontSize: '12px', marginTop: '8px' }}>
              {JSON.stringify(
                {
                  currentStep,
                  sessionId: autosaveData.sessionId,
                  isLoading: autosaveData.isLoading,
                  formData: form.getValues(),
                },
                null,
                2
              )}
            </pre>
          </details>
        </Box>
      )}
    </Box>
  );
};

// Головний компонент з Provider
interface WizardContainerProps {
  onStageCompleted?: (sessionId: string) => void;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({ onStageCompleted }) => {
  return (
    <WizardProvider>
      <WizardContent onStageCompleted={onStageCompleted} />
    </WizardProvider>
  );
};

export default WizardContainer;
