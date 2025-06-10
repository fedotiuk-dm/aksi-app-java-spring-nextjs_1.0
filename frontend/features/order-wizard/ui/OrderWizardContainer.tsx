'use client';

/**
 * @fileoverview Головний контейнер для Order Wizard
 *
 * Приклад "тонкого" UI компонента згідно з принципом "FSD outside".
 * Всю бізнес-логіку отримує з доменного шару.
 */

import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  LinearProgress,
  Button,
  Paper,
  Container,
} from '@mui/material';
import React from 'react';

import {
  useOrderWizard,
  WIZARD_STAGES,
  WIZARD_STAGE_NAMES,
  type WizardStage,
} from '@/domains/wizard';

// Імпорт компонентів етапів
import { Stage1ClientSelection } from './stages/Stage1ClientSelection';
// import { Stage2ItemsManagement } from './stages/Stage2ItemsManagement';
// import { Stage3OrderParameters } from './stages/Stage3OrderParameters';
// import { Stage4Finalization } from './stages/Stage4Finalization';

export const OrderWizardContainer: React.FC = () => {
  // Отримуємо всю функціональність з доменного шару
  const wizard = useOrderWizard();

  const {
    coordinator: { currentStage, isWizardComplete, workflow, stagesStatus },
    isAnyStageLoading,
    hasAnyError,
    canProceedToNextStage,
    goToStage,
    goToNextStage,
    goToPreviousStage,
  } = wizard;

  // Рендер компонента для поточного етапу
  const renderCurrentStage = (): React.ReactNode => {
    switch (currentStage) {
      case WIZARD_STAGES.CLIENT_SELECTION:
        return <Stage1ClientSelection wizard={wizard} />;

      case WIZARD_STAGES.ITEMS_MANAGEMENT:
        return (
          <Typography variant="h6" sx={{ p: 3 }}>
            Етап 2: Менеджер предметів (у розробці)
          </Typography>
        );

      case WIZARD_STAGES.ORDER_PARAMETERS:
        return (
          <Typography variant="h6" sx={{ p: 3 }}>
            Етап 3: Загальні параметри замовлення (у розробці)
          </Typography>
        );

      case WIZARD_STAGES.FINALIZATION:
        return (
          <Typography variant="h6" sx={{ p: 3 }}>
            Етап 4: Підтвердження та завершення (у розробці)
          </Typography>
        );

      default:
        return <Alert severity="error">Невідомий етап: {currentStage}</Alert>;
    }
  };

  // Отримання статусу для степпера
  const getStepStatus = (stage: WizardStage): 'completed' | 'active' | 'disabled' => {
    if (stage < currentStage) return 'completed';
    if (stage === currentStage) return 'active';
    return 'disabled';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        {/* Заголовок */}
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Order Wizard - Оформлення замовлення
        </Typography>

        {/* Індикатор завантаження */}
        {isAnyStageLoading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Завантаження...
            </Typography>
          </Box>
        )}

        {/* Степпер */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={currentStage - 1} orientation="horizontal" sx={{ mb: 3 }}>
            {Object.entries(WIZARD_STAGE_NAMES).map(([stageNumber, stageName]) => {
              const stage = parseInt(stageNumber) as WizardStage;
              const status = getStepStatus(stage);

              return (
                <Step key={stage} completed={status === 'completed'}>
                  <StepLabel
                    onClick={() => goToStage(stage)}
                    sx={{
                      cursor: status !== 'disabled' ? 'pointer' : 'default',
                      opacity: status === 'disabled' ? 0.5 : 1,
                    }}
                  >
                    {stageName}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>

        {/* Повідомлення про помилки */}
        {hasAnyError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6">Виникли помилки</Typography>
            <Typography variant="body2">Перевірте заповнення форм та спробуйте ще раз</Typography>
          </Alert>
        )}

        {/* Поточний етап */}
        <Box sx={{ minHeight: 400, mb: 3 }}>{renderCurrentStage()}</Box>

        {/* Навігаційні кнопки */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={goToPreviousStage}
            disabled={currentStage === 1 || isAnyStageLoading}
          >
            Назад
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isWizardComplete && (
              <Button
                variant="contained"
                onClick={goToNextStage}
                disabled={!canProceedToNextStage || isAnyStageLoading}
              >
                {currentStage === 4 ? 'Завершити' : 'Далі'}
              </Button>
            )}

            {isWizardComplete && (
              <Alert severity="success">
                <Typography variant="h6">🎉 Замовлення успішно створено!</Typography>
              </Alert>
            )}
          </Box>
        </Box>

        {/* Debug інформація (тільки в розробці) */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Debug Info:
            </Typography>
            <Typography variant="body2">
              Current Stage: {currentStage}
              <br />
              Can Proceed: {canProceedToNextStage ? 'Yes' : 'No'}
              <br />
              Is Loading: {isAnyStageLoading ? 'Yes' : 'No'}
              <br />
              Has Errors: {hasAnyError ? 'Yes' : 'No'}
              <br />
              Is Complete: {isWizardComplete ? 'Yes' : 'No'}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};
