'use client';

import React from 'react';
import { Stepper, Step, StepLabel, Box } from '@mui/material';

interface WizardStepperProps {
  steps: string[];
  activeStep: number;
  className?: string;
}

/**
 * Компонент для відображення кроків візарда
 * 
 * @param steps Масив назв кроків
 * @param activeStep Індекс активного кроку
 */
export const WizardStepper: React.FC<WizardStepperProps> = ({ 
  steps,
  activeStep,
  className
}) => {
  return (
    <Box className={className} sx={{ mb: 4 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
