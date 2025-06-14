'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper, Alert } from '@mui/material';
import { useWizardStore } from '../stores/wizard.store';

// Готові Orval хуки
import { useOrderWizardStart, useOrderWizardCompleteStage1 } from '@/shared/api/generated/main';
import {
  useStage1GetClientSearchState,
  useStage1GetBasicOrderState,
  useStage1GetSelectedClient,
  useStage1GetClientFormState,
} from '@/shared/api/generated/stage1';

// Stage1 компонент (об'єднаний)
import { ClientSearchStep } from './stage1/ClientSearchStep';

const steps = ['Клієнт та базова інформація', 'Предмети замовлення'];

/**
 * Order Wizard Stage1 - Клієнт та базова інформація замовлення
 * Використовує готові Orval хуки БЕЗ дублювання логіки
 */
export const WizardContainer = () => {
  const [activeStep, setActiveStep] = useState(0);

  // UI стан з Zustand
  const {
    sessionId,
    currentStage,
    setSessionId,
    setCurrentStage,
    setLoading,
    isLoading,
    setActiveStep: setStoreActiveStep,
    activeStep: storeActiveStep,
  } = useWizardStore();

  // Синхронізація локального стану з store
  useEffect(() => {
    if (storeActiveStep !== undefined) {
      setActiveStep(storeActiveStep);
    }
  }, [storeActiveStep]);

  // Головні Orval хуки
  const startWizardMutation = useOrderWizardStart();
  const completeStage1Mutation = useOrderWizardCompleteStage1();

  // Stage1 queries для відслідковування стану
  const clientSearchState = useStage1GetClientSearchState(sessionId || '', {
    query: { enabled: !!sessionId },
  });
  const basicOrderState = useStage1GetBasicOrderState(sessionId || '', {
    query: { enabled: !!sessionId },
  });
  const selectedClient = useStage1GetSelectedClient(sessionId || '', {
    query: { enabled: !!sessionId },
  });
  const clientFormState = useStage1GetClientFormState(sessionId || '', {
    query: { enabled: !!sessionId },
  });

  // Початок візарда
  const handleStartWizard = async () => {
    setLoading(true);
    try {
      const result = await startWizardMutation.mutateAsync();
      setSessionId(result.sessionId || '');
      setCurrentStage('stage1');
      setActiveStep(0);
      setStoreActiveStep(0);
    } catch (error) {
      console.error('Помилка запуску візарда:', error);
    } finally {
      setLoading(false);
    }
  };

  // Перехід до наступного кроку (тепер тільки 2 кроки)
  const handleNext = useCallback(() => {
    const nextStep = activeStep + 1;
    setActiveStep(nextStep);
    setStoreActiveStep(nextStep);
  }, [activeStep, setStoreActiveStep]);

  // Повернення до попереднього кроку
  const handleBack = () => {
    const prevStep = activeStep - 1;
    setActiveStep(prevStep);
    setStoreActiveStep(prevStep);
  };

  // Завершення Stage1
  const handleCompleteStage1 = async () => {
    if (!sessionId) return;

    setLoading(true);
    try {
      await completeStage1Mutation.mutateAsync({ sessionId });
      setCurrentStage('stage2');
      // Перехід до Stage2 або показ успіху
      alert('Stage1 завершено успішно! Готовий до Stage2');
    } catch (error) {
      console.error('Помилка завершення Stage1:', error);
      alert(`Помилка завершення Stage1: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Перевірка готовності до наступного кроку
  const canProceedToNext = () => {
    switch (activeStep) {
      case 0: // Клієнт та базова інформація (об'єднаний крок)
        // Перевіряємо чи базова інформація заповнена
        return basicOrderState.data === 'COMPLETED' || basicOrderState.data === 'CREATION_DATE_SET';
      case 1: // Stage2 - предмети замовлення
        return false; // Поки що не реалізовано
      default:
        return false;
    }
  };

  // Автоматичний перехід відключений - покладаємося на явні виклики onNext()

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
        return <ClientSearchStep sessionId={sessionId} onNext={handleNext} />;
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
        Order Wizard - Stage 1
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Клієнт та базова інформація замовлення
      </Typography>

      {/* Статус сесії */}
      {sessionId && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Сесія: {sessionId} | Стан: {currentStage || 'Ініціалізація'}
        </Alert>
      )}

      {/* Помилки */}
      {startWizardMutation.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Помилка запуску візарда: {startWizardMutation.error.message}
        </Alert>
      )}

      {completeStage1Mutation.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Помилка завершення Stage1: {completeStage1Mutation.error.message}
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

      {/* Навігація */}
      {sessionId && activeStep < steps.length && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
            Назад
          </Button>

          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleCompleteStage1}
                disabled={!canProceedToNext() || completeStage1Mutation.isPending || isLoading}
              >
                {completeStage1Mutation.isPending || isLoading
                  ? 'Завершення...'
                  : 'Завершити Stage1'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext} disabled={!canProceedToNext()}>
                Далі
              </Button>
            )}
          </Box>
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
            Client search state: {clientSearchState.data || 'Немає'}
          </Typography>
          <Typography variant="caption" component="div">
            Client form state: {clientFormState.data || 'Немає'}
          </Typography>
          <Typography variant="caption" component="div">
            Basic order state: {basicOrderState.data || 'Немає'}
          </Typography>
          <Typography variant="caption" component="div">
            Client selected: {selectedClient.data ? 'Так' : 'Ні'}
          </Typography>
          <Typography variant="caption" component="div">
            Can proceed: {canProceedToNext() ? 'Так' : 'Ні'}
          </Typography>
          <Typography variant="caption" component="div">
            Loading: {isLoading ? 'Так' : 'Ні'}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
