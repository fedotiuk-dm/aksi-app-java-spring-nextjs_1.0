'use client';

import { ArrowBack, ArrowForward, Save } from '@mui/icons-material';
import { Box, Button, Paper, Typography, Divider } from '@mui/material';

import { useWizardNavigation } from '@/domain/wizard';

/**
 * Компонент навігації wizard
 * Надає кнопки для переходу між кроками
 */
export const WizardNavigation = () => {
  const { canGoBack, canProceed, goToPreviousStep, goToNextStep, currentStep } =
    useWizardNavigation();

  return (
    <Paper elevation={1} sx={{ p: 3, mt: 2 }}>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Кнопка "Назад" */}
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={goToPreviousStep}
          disabled={!canGoBack}
          sx={{ minWidth: 120 }}
        >
          Назад
        </Button>

        {/* Інформація про поточний крок */}
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Поточний крок: {currentStep}
        </Typography>

        {/* Кнопка "Далі" або "Зберегти" */}
        <Button
          variant="contained"
          endIcon={canProceed ? <ArrowForward /> : <Save />}
          onClick={goToNextStep}
          disabled={!canProceed}
          sx={{ minWidth: 120 }}
        >
          {canProceed ? 'Далі' : 'Зберегти'}
        </Button>
      </Box>
    </Paper>
  );
};
