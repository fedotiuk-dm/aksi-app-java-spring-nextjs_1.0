'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Stepper, Step, StepLabel, Alert, CircularProgress } from '@mui/material';

// Готові UI компоненти
import { StepContainer } from '@/shared/ui';

// Прямі Orval хуки
import { useStage1CompleteBasicOrder } from '@/shared/api/generated/stage1';

// Стор
import { useStage1WizardStore, SUBSTEPS } from '../../stores/stage1-wizard.store';

// Компоненти кроків
import { ClientSearchStep } from './ClientSearchStep';
import { BasicOrderInfoStep } from './BasicOrderInfoStep';
import { ClientCreationStep } from './ClientCreationStep';

interface Stage1ContainerProps {
  sessionId: string;
  onStageCompleted: () => void;
}

/**
 * Контейнер для Stage1 Order Wizard
 * Використовує прямі Orval хуки + простий стор для UI стану
 */
export const Stage1Container = ({ sessionId, onStageCompleted }: Stage1ContainerProps) => {
  // ========== СТОР ==========
  const {
    currentSubstep,
    setCurrentSubstep,
    showClientForm,
    setShowClientForm,
    selectedClientId,
    isInitialized,
    setIsInitialized,
    reset,
  } = useStage1WizardStore();

  // ========== ЛОКАЛЬНИЙ СТАН ==========
  const [error, setError] = useState<string | null>(null);

  // ========== ORVAL ХУКИ ==========
  const completeStage = useStage1CompleteBasicOrder({
    mutation: {
      onSuccess: (data: unknown) => {
        console.log('✅ Stage1 успішно завершено:', data);
        onStageCompleted();
      },
      onError: (error: unknown) => {
        console.error('❌ Помилка завершення Stage1:', error);
        const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
        setError(`Помилка завершення етапу: ${errorMessage}`);
      },
    },
  });

  // ========== EFFECTS ==========
  // Ініціалізація при завантаженні
  useEffect(() => {
    if (sessionId && !isInitialized) {
      console.log('🚀 Ініціалізація Stage1 з sessionId:', sessionId);
      setIsInitialized(true);
      setCurrentSubstep(SUBSTEPS.CLIENT_SEARCH);
      setError(null);
    }
  }, [sessionId, isInitialized, setIsInitialized, setCurrentSubstep]);

  // Очищення при unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Очищення Stage1Container');
      reset();
    };
  }, [reset]);

  // ========== EVENT HANDLERS ==========
  const handleClientSearchNext = () => {
    console.log('➡️ Перехід до базової інформації замовлення');
    setCurrentSubstep(SUBSTEPS.BASIC_ORDER_INFO);
    setError(null);
  };

  const handleBasicOrderInfoBack = () => {
    console.log('⬅️ Повернення до пошуку клієнта');
    setCurrentSubstep(SUBSTEPS.CLIENT_SEARCH);
    setError(null);
  };

  const handleBasicOrderInfoComplete = async () => {
    if (!selectedClientId) {
      setError('Спочатку оберіть або створіть клієнта');
      return;
    }

    console.log('🏁 Завершення Stage1 з клієнтом:', selectedClientId);
    setError(null);

    try {
      await completeStage.mutateAsync({ sessionId });
    } catch (error) {
      console.error('❌ Помилка завершення етапу:', error);
    }
  };

  const handleClientFormBack = () => {
    console.log('⬅️ Закриття форми створення клієнта');
    setShowClientForm(false);
    setError(null);
  };

  const handleClientFormNext = () => {
    console.log('✅ Клієнт створений, перехід до базової інформації');
    setShowClientForm(false);
    setCurrentSubstep(SUBSTEPS.BASIC_ORDER_INFO);
    setError(null);
  };

  // ========== COMPUTED VALUES ==========
  const steps = [
    { key: SUBSTEPS.CLIENT_SEARCH, label: 'Пошук клієнта' },
    { key: SUBSTEPS.BASIC_ORDER_INFO, label: 'Базова інформація' },
  ];

  const activeStepIndex = steps.findIndex((step) => step.key === currentSubstep);
  const isLoading = completeStage.isPending;

  // ========== VALIDATION ==========
  if (!sessionId) {
    return <Alert severity="error">Не вказано ID сесії для Stage1. Перезавантажте сторінку.</Alert>;
  }

  return (
    <StepContainer
      title="Етап 1: Клієнт та базова інформація замовлення"
      subtitle="Оберіть клієнта та введіть базову інформацію про замовлення"
    >
      {/* Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStepIndex} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Помилки */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Форма створення клієнта (модальний режим) */}
      {showClientForm && (
        <Box sx={{ mb: 4 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Створення нового клієнта
          </Alert>
          <ClientCreationStep
            sessionId={sessionId}
            onNext={handleClientFormNext}
            onBack={handleClientFormBack}
          />
        </Box>
      )}

      {/* Основний контент залежно від поточного кроку */}
      {!showClientForm && (
        <>
          {currentSubstep === SUBSTEPS.CLIENT_SEARCH && (
            <ClientSearchStep sessionId={sessionId} onNext={handleClientSearchNext} />
          )}

          {currentSubstep === SUBSTEPS.BASIC_ORDER_INFO && (
            <BasicOrderInfoStep
              sessionId={sessionId}
              onComplete={handleBasicOrderInfoComplete}
              onBack={handleBasicOrderInfoBack}
            />
          )}
        </>
      )}

      {/* Loading стан */}
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 3,
            p: 2,
            bgcolor: 'action.hover',
            borderRadius: 1,
          }}
        >
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Завершення етапу...
          </Typography>
        </Box>
      )}

      {/* Debug інформація (тільки в development) */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" display="block">
            Debug: sessionId={sessionId}, substep={currentSubstep}, clientId={selectedClientId}
          </Typography>
        </Box>
      )}
    </StepContainer>
  );
};
