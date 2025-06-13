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
  Stack,
} from '@mui/material';
import React from 'react';

// Домен wizard/main - головне управління
import { useMain, WIZARD_STAGES, WIZARD_STAGE_NAMES } from '@/domains/wizard';

// Імпорт компонентів етапів
import { Stage1SimplifiedContainer } from './stage1/Stage1SimplifiedContainer';
// import { Stage2ItemManager } from './stage2/Stage2ItemManager';
// import { Stage3OrderParameters } from './stages/Stage3OrderParameters';
// import { Stage4Finalization } from './stages/Stage4Finalization';

export const OrderWizardContainer: React.FC = () => {
  // ========== ДОМЕННА ЛОГІКА ==========
  const { ui, data, loading, actions, computed } = useMain();

  // Додаємо логування для діагностики
  console.log('🔍 OrderWizardContainer state:', {
    hasSession: !!ui.sessionId,
    sessionId: ui.sessionId,
    currentStateSuccess: data.currentState?.success,
    currentStateValue: data.currentState?.currentState,
    currentStateUndefined: data.currentState === undefined,
    computedStage: computed.currentStage,
    canStart: computed.canStart,
    isLoadingState: loading.isLoadingState,
    shouldShowStartButton:
      !ui.sessionId ||
      (ui.sessionId && data.currentState !== undefined && data.currentState.success === false),
  });

  // ========== ВИЧИСЛЕННЯ ==========
  // Поточний етап візарда (з доменного шару)
  const currentStage = computed.currentStage;

  // Перевірка наявності сесії
  const hasSession = !!ui.sessionId;

  // ========== EVENT HANDLERS ==========

  // Рендер компонента для поточного етапу
  const renderCurrentStage = (): React.ReactNode => {
    // Показуємо кнопку запуску тільки якщо:
    // 1. Немає sessionId в сторі АБО
    // 2. Є sessionId, але API повертає помилку (сесія не існує на бекенді)
    const shouldShowStartButton =
      !hasSession ||
      (hasSession && data.currentState !== undefined && data.currentState.success === false);

    if (shouldShowStartButton) {
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
            onClick={actions.startWizard}
            disabled={!computed.canStart || loading.isStarting}
            sx={{ minWidth: 200 }}
          >
            {loading.isStarting ? 'Запуск...' : 'Розпочати замовлення'}
          </Button>

          {/* Показуємо статус здоров'я системи */}
          {data.healthStatus && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Статус системи: {data.healthStatus.status || 'Невідомо'}
            </Alert>
          )}
        </Box>
      );
    }

    // Рендер етапів на основі currentStage
    switch (currentStage) {
      case WIZARD_STAGES.CLIENT_SELECTION:
        return <Stage1SimplifiedContainer onStageCompleted={() => actions.completeStage1()} />;

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

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        {/* Заголовок */}
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Order Wizard - Оформлення замовлення
        </Typography>

        {/* Інформація про сесію */}
        {hasSession && (
          <Card sx={{ mb: 2, bgcolor: 'primary.50' }}>
            <CardContent sx={{ py: 1 }}>
              <Typography variant="body2" color="primary.main">
                Сесія: {ui.sessionId} | Етап: {currentStage}/4
                {data.healthStatus?.status === 'UP' && ' | ✅ Система готова'}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Індикатор завантаження */}
        {(loading.isStarting || loading.isCompleting || loading.isNavigating) && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {loading.isStarting && 'Запуск Order Wizard...'}
              {loading.isCompleting && 'Завершення етапу...'}
              {loading.isNavigating && 'Навігація...'}
            </Typography>
          </Box>
        )}

        {/* Степпер */}
        {hasSession && data.currentState?.success === true && (
          <Box sx={{ mb: 3 }}>
            <Stepper activeStep={currentStage - 1} alternativeLabel>
              {Object.entries(WIZARD_STAGE_NAMES).map(([stage, name]) => (
                <Step key={stage}>
                  <StepLabel>{name as string}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        {/* Контент поточного етапу */}
        <Box sx={{ minHeight: 400 }}>{renderCurrentStage()}</Box>

        {/* Контроли навігації */}
        {hasSession && data.currentState?.success === true && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={actions.goBack}
                disabled={!computed.canGoBack || loading.isNavigating}
              >
                Назад
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={actions.cancelOrder}
                disabled={!computed.canCancel || loading.isNavigating}
              >
                Скасувати
              </Button>
            </Stack>

            <Stack direction="row" spacing={2}>
              {/* Кнопки завершення етапів */}
              {currentStage === 1 && (
                <Button
                  variant="contained"
                  onClick={actions.completeStage1}
                  disabled={!computed.canComplete || loading.isCompleting}
                >
                  Завершити етап 1
                </Button>
              )}

              {currentStage === 2 && (
                <Button
                  variant="contained"
                  onClick={actions.completeStage2}
                  disabled={!computed.canComplete || loading.isCompleting}
                >
                  Завершити етап 2
                </Button>
              )}

              {currentStage === 3 && (
                <Button
                  variant="contained"
                  onClick={actions.completeStage3}
                  disabled={!computed.canComplete || loading.isCompleting}
                >
                  Завершити етап 3
                </Button>
              )}

              {currentStage === 4 && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={actions.completeOrder}
                  disabled={!computed.canComplete || loading.isCompleting}
                >
                  Завершити замовлення
                </Button>
              )}
            </Stack>
          </Box>
        )}

        {/* Debug інформація */}
        {ui.showDebugMode && (
          <Card sx={{ mt: 2, bgcolor: 'grey.100' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🐛 Debug Info
              </Typography>
              <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                UI: {JSON.stringify(ui, null, 2)}
                {'\n\n'}
                Data: {JSON.stringify(data, null, 2)}
                {'\n\n'}
                Loading: {JSON.stringify(loading, null, 2)}
                {'\n\n'}
                Computed: {JSON.stringify(computed, null, 2)}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Контроли UI */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button size="small" onClick={actions.toggleDebugMode}>
            {ui.showDebugMode ? 'Сховати Debug' : 'Показати Debug'}
          </Button>
          <Button size="small" onClick={actions.toggleCompactMode}>
            {ui.isCompact ? 'Звичайний режим' : 'Компактний режим'}
          </Button>
          {ui.showDebugMode && (
            <Button
              size="small"
              onClick={async () => {
                console.log('🧹 Користувач натиснув "Очистити пам\'ять"');
                await actions.clearMemory();
                console.log("✅ Очищення пам'яті завершено");
              }}
              color="warning"
              variant="outlined"
            >
              🧹 Очистити пам&apos;ять
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};
