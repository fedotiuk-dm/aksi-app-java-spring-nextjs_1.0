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
  Card,
  CardContent,
} from '@mui/material';
import React from 'react';

// Домен wizard/main - головне управління
import { useOrderWizardMain } from '@/domains/wizard/main';

// Імпорт компонентів етапів
import { Stage1ClientSelection } from './stage1/Stage1ClientSelection';
// import { Stage2ItemManager } from './stage2/Stage2ItemManager';
// import { Stage3OrderParameters } from './stages/Stage3OrderParameters';
// import { Stage4Finalization } from './stages/Stage4Finalization';

// Константи для етапів
const WIZARD_STAGES = {
  CLIENT_SELECTION: 1,
  ITEMS_MANAGEMENT: 2,
  ORDER_PARAMETERS: 3,
  FINALIZATION: 4,
} as const;

const WIZARD_STAGE_NAMES = {
  1: 'Клієнт та базова інформація',
  2: 'Менеджер предметів',
  3: 'Загальні параметри',
  4: 'Підтвердження та завершення',
} as const;

type WizardStage = 1 | 2 | 3 | 4;

export const OrderWizardContainer: React.FC = () => {
  // ========== ДОМЕННА ЛОГІКА ==========
  const { ui, data, loading, errors, readiness, actions, system, debug } = useOrderWizardMain();

  // ========== EVENT HANDLERS ==========

  // Навігація між етапами
  const handleStageClick = (stage: WizardStage) => {
    if (readiness.canNavigateToStage(stage)) {
      actions.navigateToStage(stage);
    }
  };

  const handleNextStage = () => {
    if (ui.currentStage < 4) {
      actions.navigateToStage((ui.currentStage + 1) as WizardStage);
    }
  };

  const handlePreviousStage = () => {
    if (ui.currentStage > 1) {
      actions.navigateToStage((ui.currentStage - 1) as WizardStage);
    }
  };

  // Запуск нового замовлення
  const handleStartNewOrder = () => {
    actions.startNewOrder();
  };

  // Завершення поточного етапу
  const handleCompleteStage = () => {
    actions.completeCurrentStage();
  };

  // ========== RENDER HELPERS ==========

  // Рендер компонента для поточного етапу
  const renderCurrentStage = (): React.ReactNode => {
    if (!ui.isWizardStarted && !ui.sessionId) {
      return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h5" gutterBottom>
            🚀 Розпочати нове замовлення
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Натисніть кнопку нижче, щоб розпочати процес оформлення замовлення
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartNewOrder}
            disabled={!readiness.canStartNewOrder || loading.isStarting}
            sx={{ minWidth: 200 }}
          >
            {loading.isStarting ? 'Запуск...' : 'Розпочати замовлення'}
          </Button>

          {!ui.isSystemHealthy && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Система тимчасово недоступна. Спробуйте пізніше.
            </Alert>
          )}
        </Box>
      );
    }

    switch (ui.currentStage) {
      case WIZARD_STAGES.CLIENT_SELECTION:
        return <Stage1ClientSelection />;

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
        return <Alert severity="error">Невідомий етап: {ui.currentStage}</Alert>;
    }
  };

  // Отримання статусу для степпера
  const getStepStatus = (stage: WizardStage): 'completed' | 'active' | 'disabled' => {
    if (ui.isStageCompleted(stage)) return 'completed';
    if (stage === ui.currentStage) return 'active';
    if (!ui.isStageAvailable(stage)) return 'disabled';
    return 'disabled';
  };

  const canProceedToNextStage =
    ui.currentStage < Object.keys(WIZARD_STAGE_NAMES).length && readiness.canCompleteCurrentStage;
  const isWizardComplete = readiness.isOrderComplete;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        {/* Заголовок */}
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Order Wizard - Оформлення замовлення
        </Typography>

        {/* Інформація про сесію */}
        {ui.sessionId && (
          <Card sx={{ mb: 2, bgcolor: 'primary.50' }}>
            <CardContent sx={{ py: 1 }}>
              <Typography variant="body2" color="primary.main">
                Сесія: {ui.sessionId} | Етап: {ui.currentStage}/4
                {system.isHealthy && ' | ✅ Система готова'}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Індикатор завантаження */}
        {loading.isAnyLoading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {loading.isStarting && 'Запуск Order Wizard...'}
              {loading.isCompletingStage1 && 'Завершення етапу 1...'}
              {loading.isCompletingStage2 && 'Завершення етапу 2...'}
              {loading.isCompletingStage3 && 'Завершення етапу 3...'}
              {loading.isCompletingOrder && 'Завершення замовлення...'}
              {loading.isCancelling && 'Скасування замовлення...'}
            </Typography>
          </Box>
        )}

        {/* Відображення помилок */}
        {errors.hasAnyError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6">Помилка:</Typography>
            {errors.startError && <div>Запуск: {errors.startError.message}</div>}
            {errors.stage1Error && <div>Етап 1: {errors.stage1Error.message}</div>}
            {errors.stage2Error && <div>Етап 2: {errors.stage2Error.message}</div>}
            {errors.stage3Error && <div>Етап 3: {errors.stage3Error.message}</div>}
            {errors.orderError && <div>Замовлення: {errors.orderError.message}</div>}
            {errors.cancelError && <div>Скасування: {errors.cancelError.message}</div>}
          </Alert>
        )}

        {/* Степпер (тільки якщо візард запущений) */}
        {ui.isWizardStarted && (
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={ui.currentStage - 1} orientation="horizontal" sx={{ mb: 3 }}>
              {Object.entries(WIZARD_STAGE_NAMES).map(([stageNumber, stageName]) => {
                const stage = parseInt(stageNumber) as WizardStage;
                const status = getStepStatus(stage);

                return (
                  <Step key={stage} completed={status === 'completed'}>
                    <StepLabel
                      onClick={() => handleStageClick(stage)}
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
        )}

        {/* Поточний етап */}
        <Box sx={{ minHeight: 400, mb: 3 }}>{renderCurrentStage()}</Box>

        {/* Навігаційні кнопки (тільки для запущеного візарда) */}
        {ui.isWizardStarted && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handlePreviousStage}
              disabled={ui.currentStage === 1 || loading.isAnyLoading}
            >
              Назад
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {!isWizardComplete && (
                <Button
                  variant="contained"
                  onClick={ui.currentStage === 4 ? handleCompleteStage : handleNextStage}
                  disabled={!canProceedToNextStage || loading.isAnyLoading}
                >
                  {ui.currentStage === 4 ? 'Завершити замовлення' : 'Далі'}
                </Button>
              )}

              <Button
                variant="outlined"
                color="error"
                onClick={actions.cancelCurrentOrder}
                disabled={loading.isAnyLoading}
              >
                Скасувати
              </Button>
            </Box>
          </Box>
        )}

        {/* Повідомлення про завершення */}
        {isWizardComplete && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="h6">🎉 Замовлення успішно створено!</Typography>
          </Alert>
        )}

        {/* Debug інформація (тільки в розробці) */}
        {debug && (
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Debug Info:
            </Typography>
            <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
              {JSON.stringify(debug, null, 2)}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};
