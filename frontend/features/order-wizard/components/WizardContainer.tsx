'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper, Alert } from '@mui/material';
import { useWizardStore } from '../stores/wizard.store';

// Готові Orval хуки
import { useOrderWizardStart } from '@/shared/api/generated/main';

// Stage1 компонент (повний з підетапами)
import { Stage1Container } from './stage1/Stage1Container';

const steps = ['Клієнт та базова інформація', 'Предмети замовлення'];

/**
 * Order Wizard - Головний контейнер
 * Використовує готові Orval хуки + Stage1Container з підетапами
 */
export const WizardContainer = () => {
  const [activeStep, setActiveStep] = useState(0);

  // UI стан з Zustand
  const { sessionId, currentStage, setSessionId, setCurrentStage, setLoading, isLoading, reset } =
    useWizardStore();

  // Головний Orval хук для початку візарда
  const startWizardMutation = useOrderWizardStart();

  // Початок візарда
  const handleStartWizard = async () => {
    setLoading(true);
    try {
      const result = await startWizardMutation.mutateAsync();
      setSessionId(result.sessionId || '');
      setCurrentStage('stage1');
      setActiveStep(0);
    } catch (error) {
      console.error('❌ Помилка запуску візарда:', error);
    } finally {
      setLoading(false);
    }
  };

  // Завершення Stage1 - переданий в Stage1Container через onStageCompleted
  const handleStage1Completed = useCallback(() => {
    console.log('✅ Stage1 завершено, перехід до Stage2');
    setCurrentStage('stage2');
    setActiveStep(1);
  }, [setCurrentStage]);

  // Повернення до попереднього кроку
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      if (activeStep === 1) {
        setCurrentStage('stage1');
      }
    }
  };

  // Скидання при unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Рендер активного кроку
  const renderStepContent = (step: number) => {
    if (!sessionId) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Розпочніть створення замовлення
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartWizard}
            disabled={startWizardMutation.isPending || isLoading}
          >
            {startWizardMutation.isPending || isLoading
              ? 'Ініціалізація...'
              : 'Розпочати замовлення'}
          </Button>
        </Box>
      );
    }

    switch (step) {
      case 0:
        return <Stage1Container sessionId={sessionId} onStageCompleted={handleStage1Completed} />;
      case 1:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Stage 2: Предмети замовлення
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Тут буде реалізований Stage2 - додавання предметів до замовлення
            </Typography>
            <Button variant="outlined" onClick={handleBack}>
              Повернутися назад
            </Button>
          </Box>
        );
      default:
        return <Typography>Невідомий крок</Typography>;
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Order Wizard
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Система оформлення замовлень для хімчистки
      </Typography>

      {/* Статус сесії */}
      {sessionId && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Сесія: {sessionId} | Етап: {currentStage || 'Ініціалізація'}
        </Alert>
      )}

      {/* Помилки */}
      {startWizardMutation.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Помилка запуску візарда: {startWizardMutation.error.message}
        </Alert>
      )}

      {/* Stepper */}
      {sessionId && (
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label} completed={index < activeStep}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {/* Контент кроку */}
      <Paper elevation={2} sx={{ p: 3, minHeight: 400 }}>
        {renderStepContent(activeStep)}
      </Paper>

      {/* Навігація (тільки для Stage2+, Stage1 має власну навігацію) */}
      {sessionId && activeStep > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button onClick={handleBack} variant="outlined">
            Назад до Stage1
          </Button>

          <Button variant="contained" disabled>
            Stage2 поки не реалізовано
          </Button>
        </Box>
      )}

      {/* Дебаг інформація */}
      {sessionId && process.env.NODE_ENV === 'development' && (
        <Paper elevation={1} sx={{ mt: 3, p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            Debug info:
          </Typography>
          <Typography variant="caption" component="div">
            Active step: {activeStep}
          </Typography>
          <Typography variant="caption" component="div">
            Current stage: {currentStage || 'Немає'}
          </Typography>
          <Typography variant="caption" component="div">
            Session ID: {sessionId}
          </Typography>
          <Typography variant="caption" component="div">
            Loading: {isLoading ? 'Так' : 'Ні'}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
