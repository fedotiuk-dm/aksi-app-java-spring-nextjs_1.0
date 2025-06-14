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
import { useMainWizard } from '@/domains/wizard/main';
import { MAIN_WIZARD_STATES } from '@/domains/wizard/main/wizard.constants';

// Імпорт компонентів етапів
import { Stage1Container } from './stage1/Stage1Container';
import { Stage2Container } from './stage2';
// import { Stage3OrderParameters } from './stages/Stage3OrderParameters';
// import { Stage4Finalization } from './stages/Stage4Finalization';

export const OrderWizardContainer: React.FC = () => {
  // ========== ДОМЕННА ЛОГІКА ==========
  const { ui, data, loading, mutations, queries } = useMainWizard();

  // Додаємо логування для діагностики
  console.log('🔍 OrderWizardContainer state:', {
    hasSession: !!ui.sessionId,
    sessionId: ui.sessionId,
    currentState: ui.currentState,
    currentStage: ui.currentStage,
    canGoBack: ui.canGoBack,
    isNavigating: ui.isNavigating,
    backendState: data.backendState,
    isSyncing: loading.isSyncing,
  });

  // ========== ВИЧИСЛЕННЯ ==========
  // Поточний етап візарда (з доменного шару)
  const currentStage = ui.currentStage;

  // Перевірка наявності сесії
  const hasSession = !!ui.sessionId;

  // ========== EVENT HANDLERS ==========
  const handleStartWizard = async () => {
    try {
      console.log('Запуск wizard...');
      ui.setIsNavigating(true);

      const response = await mutations.startWizard.mutateAsync();

      if (response.sessionId) {
        ui.setSessionId(response.sessionId);
        ui.setCurrentState(MAIN_WIZARD_STATES.CLIENT_SELECTION);
        ui.setCurrentStage(1);
        ui.addActiveSession(response.sessionId);
        console.log('✅ Wizard запущено:', response);
      }
    } catch (error) {
      console.error('❌ Помилка запуску wizard:', error);
      ui.setLastError('Помилка запуску wizard');
    } finally {
      ui.setIsNavigating(false);
    }
  };

  const handleGoBack = async () => {
    if (!ui.sessionId) return;

    try {
      console.log('Повернення назад...');
      ui.setIsNavigating(true);

      await mutations.goBack.mutateAsync({
        sessionId: ui.sessionId,
      });

      // Оновлюємо UI стан
      const currentStage = ui.currentStage;
      if (currentStage > 1) {
        ui.setCurrentStage(currentStage - 1);
      }
    } catch (error) {
      console.error('❌ Помилка повернення назад:', error);
      ui.setLastError('Помилка повернення назад');
    } finally {
      ui.setIsNavigating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!ui.sessionId) return;

    try {
      console.log('Скасування замовлення...');
      ui.setIsNavigating(true);

      await mutations.cancelOrder.mutateAsync({
        sessionId: ui.sessionId,
      });

      // Скидаємо стан
      ui.resetWizardState();
      console.log('✅ Замовлення скасовано');
    } catch (error) {
      console.error('❌ Помилка скасування замовлення:', error);
      ui.setLastError('Помилка скасування замовлення');
    } finally {
      ui.setIsNavigating(false);
    }
  };

  const handleCompleteStage1 = async () => {
    if (!ui.sessionId) return;

    try {
      console.log('🔄 Завершення етапу 1 через API...');
      ui.setIsNavigating(true);

      await mutations.completeStage1.mutateAsync({
        sessionId: ui.sessionId,
      });

      console.log('✅ API complete-stage1 успішно викликано');

      // Оновлюємо UI стан
      ui.addCompletedStage(1);
      ui.setCurrentStage(2);
      ui.setCurrentState(MAIN_WIZARD_STATES.ITEM_MANAGEMENT);
      console.log('✅ Етап 1 завершено, перехід до етапу 2');
    } catch (error) {
      console.error('❌ Помилка завершення етапу 1:', error);
      ui.setLastError('Помилка завершення етапу 1');
    } finally {
      ui.setIsNavigating(false);
    }
  };

  const handleCompleteStage2 = async () => {
    if (!ui.sessionId) return;

    try {
      console.log('Завершення етапу 2...');
      ui.setIsNavigating(true);

      await mutations.completeStage2.mutateAsync({
        sessionId: ui.sessionId,
      });

      // Оновлюємо UI стан
      ui.addCompletedStage(2);
      ui.setCurrentStage(3);
      ui.setCurrentState(MAIN_WIZARD_STATES.EXECUTION_PARAMS);
      console.log('✅ Етап 2 завершено');
    } catch (error) {
      console.error('❌ Помилка завершення етапу 2:', error);
      ui.setLastError('Помилка завершення етапу 2');
    } finally {
      ui.setIsNavigating(false);
    }
  };

  // Рендер компонента для поточного етапу
  const renderCurrentStage = (): React.ReactNode => {
    // Показуємо кнопку запуску тільки якщо немає сесії
    const shouldShowStartButton = !hasSession;

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
            onClick={handleStartWizard}
            disabled={loading.isStarting || ui.isNavigating}
            sx={{ minWidth: 200 }}
          >
            {loading.isStarting || ui.isNavigating ? 'Запуск...' : 'Розпочати замовлення'}
          </Button>
        </Box>
      );
    }

    // Рендер етапів на основі currentState
    switch (ui.currentState) {
      case MAIN_WIZARD_STATES.CLIENT_SELECTION:
        return (
          <Stage1Container sessionId={ui.sessionId || ''} onStageCompleted={handleCompleteStage1} />
        );

      case MAIN_WIZARD_STATES.ITEM_MANAGEMENT:
        return (
          <Stage2Container
            sessionId={ui.sessionId || ''}
            onStageCompleted={handleCompleteStage2}
            onGoBack={handleGoBack}
          />
        );

      case MAIN_WIZARD_STATES.EXECUTION_PARAMS:
        return (
          <Typography variant="h6" sx={{ p: 3 }}>
            Етап 3: Параметри виконання (у розробці)
          </Typography>
        );

      case MAIN_WIZARD_STATES.ORDER_CONFIRMATION:
        return (
          <Typography variant="h6" sx={{ p: 3 }}>
            Етап 4: Підтвердження замовлення (у розробці)
          </Typography>
        );

      default:
        return <Alert severity="error">Невідомий етап: {ui.currentState}</Alert>;
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
                {loading.isSyncing && ' | Синхронізація...'}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Індикатор завантаження */}
        {(ui.isNavigating || loading.isStarting || loading.isGoingBack || loading.isCanceling) && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {loading.isStarting && 'Запуск wizard...'}
              {loading.isGoingBack && 'Повернення назад...'}
              {loading.isCanceling && 'Скасування замовлення...'}
              {ui.isNavigating &&
                !loading.isStarting &&
                !loading.isGoingBack &&
                !loading.isCanceling &&
                'Навігація...'}
            </Typography>
          </Box>
        )}

        {/* Помилки */}
        {ui.lastError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => ui.setLastError(null)}>
            {ui.lastError}
          </Alert>
        )}

        {/* Степпер */}
        {hasSession && ui.currentState && (
          <Box sx={{ mb: 3 }}>
            <Stepper activeStep={currentStage - 1} alternativeLabel>
              {Object.entries(MAIN_WIZARD_STATES).map(([stage, name]) => (
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
        {hasSession && ui.currentState && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={handleGoBack}
                disabled={
                  !ui.canGoBack || ui.isNavigating || loading.isGoingBack || ui.currentStage <= 1
                }
              >
                Назад
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={handleCancelOrder}
                disabled={ui.isNavigating || loading.isCanceling}
              >
                Скасувати
              </Button>
            </Stack>

            <Stack direction="row" spacing={2}>
              {/* Кнопки завершення етапів */}
              {ui.currentState === MAIN_WIZARD_STATES.CLIENT_SELECTION && (
                <Button
                  variant="contained"
                  onClick={handleCompleteStage1}
                  disabled={ui.isNavigating || loading.isCompletingStage}
                >
                  Завершити етап 1
                </Button>
              )}

              {ui.currentState === MAIN_WIZARD_STATES.ITEM_MANAGEMENT && (
                <Button
                  variant="contained"
                  onClick={handleCompleteStage2}
                  disabled={ui.isNavigating || loading.isCompletingStage}
                >
                  Завершити етап 2
                </Button>
              )}

              {ui.currentState === MAIN_WIZARD_STATES.EXECUTION_PARAMS && (
                <Button
                  variant="contained"
                  onClick={() => {
                    // TODO: Додати логіку завершення третього етапу
                    console.log('Завершення третього етапу');
                  }}
                  disabled={ui.isNavigating || loading.isCompletingStage}
                >
                  Завершити етап 3
                </Button>
              )}

              {ui.currentState === MAIN_WIZARD_STATES.ORDER_CONFIRMATION && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    // TODO: Додати логіку завершення замовлення
                    console.log('Завершення замовлення');
                  }}
                  disabled={ui.isNavigating || loading.isCompletingStage}
                >
                  Завершити замовлення
                </Button>
              )}
            </Stack>
          </Box>
        )}

        {/* Debug інформація */}
        {ui.compactMode && (
          <Card sx={{ mt: 2, bgcolor: 'grey.100' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🐛 Debug Info
              </Typography>
              <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                UI State:{' '}
                {JSON.stringify(
                  {
                    sessionId: ui.sessionId,
                    currentState: ui.currentState,
                    currentStage: ui.currentStage,
                    canGoBack: ui.canGoBack,
                    isNavigating: ui.isNavigating,
                    completedStages: ui.completedStages,
                    lastError: ui.lastError,
                  },
                  null,
                  2
                )}
                {'\n\n'}
                Backend Data: {JSON.stringify(data.backendState, null, 2)}
                {'\n\n'}
                Loading: {JSON.stringify(loading, null, 2)}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Контроли UI */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button size="small" onClick={() => ui.setCompactMode(!ui.compactMode)}>
            {ui.compactMode ? 'Сховати Debug' : 'Показати Debug'}
          </Button>

          <Button size="small" onClick={() => ui.setShowHints(!ui.showHints)}>
            {ui.showHints ? 'Сховати підказки' : 'Показати підказки'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
