'use client';

import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import React, { useEffect } from 'react';

// Workflow хук
import { useStage1Workflow } from '@/domains/wizard/stage1/workflow';

// UI компоненти кроків
import { BasicOrderInfoStep } from './BasicOrderInfoStep';
import { ClientCreationStep } from './ClientCreationStep';
import { ClientSearchStep } from './ClientSearchStep';

interface Stage1ContainerProps {
  sessionId: string;
  onStageCompleted: () => void;
}

// Константи для кроків
const SUBSTEPS = {
  CLIENT_SEARCH: 'client-search' as const,
  CLIENT_CREATION: 'client-creation' as const,
  BASIC_ORDER_INFO: 'basic-order-info' as const,
};

const stepLabels = {
  [SUBSTEPS.CLIENT_SEARCH]: 'Пошук клієнта',
  [SUBSTEPS.CLIENT_CREATION]: 'Створення клієнта',
  [SUBSTEPS.BASIC_ORDER_INFO]: 'Базова інформація',
};

export const Stage1Container: React.FC<Stage1ContainerProps> = ({
  sessionId,
  onStageCompleted,
}) => {
  // ========== WORKFLOW ХУКИ ==========
  const { ui, loading, mutations } = useStage1Workflow();

  // ========== ІНІЦІАЛІЗАЦІЯ ==========
  useEffect(() => {
    const initializeWorkflow = () => {
      if (!ui.isInitialized && sessionId) {
        console.log('🔄 Ініціалізація Stage1 workflow з sessionId:', sessionId);
        // Ініціалізуємо workflow з sessionId від OrderWizardContainer
        ui.initializeWorkflow(sessionId);
        console.log('✅ Stage1 workflow ініціалізовано з sessionId');
      }
    };

    initializeWorkflow();
  }, [ui.isInitialized, sessionId, ui]);

  // ========== EVENT HANDLERS ==========
  const handleClientSelected = async (clientId: string) => {
    console.log('🔄 Вибір клієнта:', clientId);
    // Використовуємо композиційний метод з workflow
    const success = await ui.selectClient(clientId, 'client-search');
    if (success) {
      console.log('✅ Клієнт успішно обраний, перехід до basic-order-info');
    } else {
      console.error('❌ Помилка при виборі клієнта');
    }
  };

  const handleCreateNewClient = () => {
    // Переходимо до client-creation
    ui.goToSubstep(SUBSTEPS.CLIENT_CREATION);
  };

  const handleClientCreated = async (clientId: string) => {
    console.log('🔄 Створення та вибір клієнта:', clientId);
    // Використовуємо композиційний метод з workflow
    const success = await ui.selectClient(clientId, 'client-creation');
    if (success) {
      console.log('✅ Клієнт успішно створений та обраний, перехід до basic-order-info');
    } else {
      console.error('❌ Помилка при створенні/виборі клієнта');
    }
  };

  const handleGoBackToSearch = () => {
    ui.goToSubstep(SUBSTEPS.CLIENT_SEARCH);
  };

  const handleGoBackToClient = () => {
    // Якщо client-creation завершений, повертаємося туди
    if (ui.completedSubsteps.has(SUBSTEPS.CLIENT_CREATION)) {
      ui.goToSubstep(SUBSTEPS.CLIENT_CREATION);
    } else {
      // Інакше повертаємося до пошуку
      ui.goToSubstep(SUBSTEPS.CLIENT_SEARCH);
    }
  };

  const handleOrderInfoCompleted = async () => {
    try {
      console.log('🔄 Підготовка до завершення Stage1, sessionId:', ui.sessionId);
      console.log('🔄 Обраний клієнт:', ui.selectedClientId);
      console.log('🔄 Поточний підетап:', ui.currentSubstep);

      // Завершуємо basic-order-info
      ui.markSubstepCompleted(SUBSTEPS.BASIC_ORDER_INFO);
      ui.completeWorkflow();

      console.log('✅ Stage1 workflow завершено, повідомляємо OrderWizardContainer');
      // Повідомляємо OrderWizardContainer про готовність до завершення
      // OrderWizardContainer викличе API complete-stage1
      onStageCompleted();
    } catch (error) {
      console.error('❌ Помилка підготовки до завершення Stage1:', error);
      ui.setValidationError('Помилка підготовки до завершення етапу. Спробуйте ще раз.');
    }
  };

  // ========== RENDER HELPERS ==========
  const getCurrentStepIndex = (): number => {
    switch (ui.currentSubstep) {
      case SUBSTEPS.CLIENT_SEARCH:
        return 0;
      case SUBSTEPS.CLIENT_CREATION:
        return 1;
      case SUBSTEPS.BASIC_ORDER_INFO:
        return 2;
      default:
        return 0;
    }
  };

  const renderCurrentStep = (): React.ReactNode => {
    if (!ui.isInitialized) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <LinearProgress sx={{ width: '50%' }} />
        </Box>
      );
    }

    switch (ui.currentSubstep) {
      case SUBSTEPS.CLIENT_SEARCH:
        return (
          <ClientSearchStep
            onClientSelected={handleClientSelected}
            onCreateNewClient={handleCreateNewClient}
          />
        );

      case SUBSTEPS.CLIENT_CREATION:
        return (
          <ClientCreationStep
            onClientCreated={handleClientCreated}
            onGoBack={handleGoBackToSearch}
          />
        );

      case SUBSTEPS.BASIC_ORDER_INFO:
        return (
          <BasicOrderInfoStep
            selectedClientId={ui.selectedClientId || ''}
            onOrderInfoCompleted={handleOrderInfoCompleted}
            onGoBack={handleGoBackToClient}
          />
        );

      default:
        return <Alert severity="error">Невідомий крок: {ui.currentSubstep}</Alert>;
    }
  };

  // ========== RENDER ==========
  return (
    <Box sx={{ width: '100%' }}>
      {/* Заголовок етапу */}
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Етап 1: Клієнт та базова інформація замовлення
      </Typography>

      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Оберіть або створіть клієнта та заповніть базову інформацію замовлення
      </Typography>

      {/* Степпер */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={getCurrentStepIndex()} alternativeLabel>
            <Step completed={ui.completedSubsteps.has(SUBSTEPS.CLIENT_SEARCH)}>
              <StepLabel>Пошук клієнта</StepLabel>
            </Step>
            <Step completed={ui.completedSubsteps.has(SUBSTEPS.CLIENT_CREATION)}>
              <StepLabel optional={<Typography variant="caption">Опціонально</Typography>}>
                Створення клієнта
              </StepLabel>
            </Step>
            <Step completed={ui.completedSubsteps.has(SUBSTEPS.BASIC_ORDER_INFO)}>
              <StepLabel>Базова інформація</StepLabel>
            </Step>
          </Stepper>
        </CardContent>
      </Card>

      {/* Помилки валідації */}
      {ui.hasValidationErrors && ui.validationMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {ui.validationMessage}
        </Alert>
      )}

      {/* Індикатор завантаження */}
      {loading.isLoading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            {loading.isInitializing && 'Ініціалізація...'}
            {loading.isCompletingStage && 'Завершення етапу 1...'}
            {loading.isSyncing && 'Синхронізація...'}
          </Typography>
        </Box>
      )}

      {/* Поточний крок */}
      <Box sx={{ minHeight: 600 }}>{renderCurrentStep()}</Box>

      {/* Інформація про прогрес */}
      <Card sx={{ mt: 3, bgcolor: 'grey.50' }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            <strong>Поточний крок:</strong> {stepLabels[ui.currentSubstep]}
            {ui.sessionId && (
              <>
                {' • '}
                <strong>Session ID:</strong> {ui.sessionId.slice(0, 8)}...
              </>
            )}
            {ui.hasUnsavedChanges && (
              <>
                {' • '}
                <strong>Незбережені зміни</strong> ⚠️
              </>
            )}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
