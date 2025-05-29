'use client';

import { Box, Typography, LinearProgress, Stepper, Step, StepLabel, Paper } from '@mui/material';

import { WizardStep } from '@/domain/wizard';

interface WizardProgressProps {
  currentStage: number;
  totalStages: number;
  progress: number;
  currentStep: WizardStep;
}

const stageLabels = ['Клієнт та замовлення', 'Предмети', 'Параметри', 'Підтвердження'];

const stepLabels: Record<WizardStep, string> = {
  [WizardStep.CLIENT_SELECTION]: 'Вибір клієнта',
  [WizardStep.BRANCH_SELECTION]: 'Базова інформація',
  [WizardStep.ITEM_MANAGER]: 'Управління предметами',
  [WizardStep.ORDER_PARAMETERS]: 'Параметри замовлення',
  [WizardStep.CONFIRMATION]: 'Підтвердження',
  [WizardStep.COMPLETED]: 'Завершено',
};

/**
 * Компонент прогресу wizard
 * Відображає поточний етап та загальний прогрес
 */
export const WizardProgress = ({
  currentStage,
  totalStages,
  progress,
  currentStep,
}: WizardProgressProps) => {
  return (
    <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Етап {currentStage} з {totalStages}: {stageLabels[currentStage - 1]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {stepLabels[currentStep]}
        </Typography>
      </Box>

      {/* Прогрес бар */}
      <Box sx={{ mb: 3 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
            },
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Прогрес: {Math.round(progress)}%
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={currentStage - 1} alternativeLabel>
        {stageLabels.map((label, index) => (
          <Step key={label} completed={index < currentStage - 1}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};
