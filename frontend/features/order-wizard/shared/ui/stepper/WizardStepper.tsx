'use client';

import { Stepper, Step, StepLabel, Box, StepContent, Typography } from '@mui/material';
import React from 'react';

interface WizardStep {
  label: string;
  description?: string;
  completed?: boolean;
  disabled?: boolean;
  optional?: boolean;
}

interface WizardStepperProps {
  steps: string[] | WizardStep[];
  activeStep: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  alternativeLabel?: boolean;
  nonLinear?: boolean;
  onStepClick?: (step: number) => void;
  showStepContent?: boolean;
  connector?: React.ReactElement;
}

/**
 * Універсальний компонент для відображення кроків візарда
 * Підтримує різні варіанти відображення та інтерактивність
 *
 * Особливості:
 * - Горизонтальна та вертикальна орієнтація
 * - Детальна інформація про кроки
 * - Опціональна інтерактивність
 * - Консистентний стиль з іншими shared компонентами
 */
export const WizardStepper: React.FC<WizardStepperProps> = ({
  steps,
  activeStep,
  className,
  orientation = 'horizontal',
  alternativeLabel = false,
  nonLinear = false,
  onStepClick,
  showStepContent = false,
  connector,
}) => {
  // Нормалізуємо кроки до об'єктів
  const normalizedSteps: WizardStep[] = steps.map((step) =>
    typeof step === 'string' ? { label: step } : step
  );

  const handleStepClick = (stepIndex: number) => {
    if (nonLinear && onStepClick && !normalizedSteps[stepIndex].disabled) {
      onStepClick(stepIndex);
    }
  };

  const getStepProps = (step: WizardStep, index: number) => ({
    completed: step.completed ?? index < activeStep,
    disabled: step.disabled ?? false,
    onClick: nonLinear && onStepClick ? () => handleStepClick(index) : undefined,
    style: {
      cursor: nonLinear && onStepClick && !step.disabled ? 'pointer' : 'default',
    },
  });

  const renderStepLabel = (step: WizardStep) => (
    <StepLabel optional={step.optional && <Typography variant="caption">Опціонально</Typography>}>
      {step.label}
    </StepLabel>
  );

  const renderStepContent = (step: WizardStep) =>
    showStepContent &&
    step.description && (
      <StepContent>
        <Typography variant="body2" color="text.secondary">
          {step.description}
        </Typography>
      </StepContent>
    );

  return (
    <Box className={className} sx={{ mb: 4 }}>
      <Stepper
        activeStep={activeStep}
        orientation={orientation}
        alternativeLabel={alternativeLabel}
        nonLinear={nonLinear}
        connector={connector}
      >
        {normalizedSteps.map((step, index) => (
          <Step key={step.label} {...getStepProps(step, index)}>
            {renderStepLabel(step)}
            {renderStepContent(step)}
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
