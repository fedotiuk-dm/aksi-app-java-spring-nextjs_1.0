/**
 * @fileoverview Головний компонент Order Wizard для хімчистки
 * Оркеструє всі 4 етапи замовлення на основі Spring State Machine
 */

'use client';

import {
  Person as PersonIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { useOrderWizard } from '@/domain/wizard';

import { Stage1ClientAndOrder } from './stage-1-client-and-order/ui';

const STAGES = [
  {
    label: 'Клієнт та замовлення',
    icon: <PersonIcon />,
    states: ['INITIAL', 'CLIENT_SELECTION', 'ORDER_INITIALIZATION', 'ITEM_MANAGEMENT'],
  },
  {
    label: 'Менеджер предметів',
    icon: <InventoryIcon />,
    states: [
      'ITEM_WIZARD_BASIC_INFO',
      'ITEM_WIZARD_PROPERTIES',
      'ITEM_WIZARD_DEFECTS_STAINS',
      'ITEM_WIZARD_PHOTO_DOCUMENTATION',
      'ITEM_WIZARD_PRICE_CALCULATION',
      'ITEM_MANAGER_OVERVIEW',
    ],
  },
  {
    label: 'Параметри замовлення',
    icon: <SettingsIcon />,
    states: ['ORDER_PARAMETERS', 'ORDER_DISCOUNTS', 'ORDER_PAYMENT'],
  },
  {
    label: 'Підтвердження',
    icon: <CheckCircleIcon />,
    states: ['ORDER_CONFIRMATION', 'RECEIPT_GENERATION', 'ORDER_COMPLETED'],
  },
];

/**
 * 🎯 Головний компонент Order Wizard
 */
export function OrderWizard() {
  const {
    wizardId,
    currentState,
    session,
    sessionData,
    createWizard,
    cancelWizard,
    isCreating,
    isExecutingAction,
    isLoadingState,
    createError,
    actionError,
    stateError,
    refetchState,
    resetErrors,
    selectClient,
    saveOrderInfo,
    isCancelling,
  } = useOrderWizard();

  const [isInitialized, setIsInitialized] = useState(false);

  // Ініціалізація сесії при першому завантаженні
  useEffect(() => {
    if (!isInitialized && !wizardId && !isCreating) {
      setIsInitialized(true);
      createWizard();
    }
  }, [isInitialized, wizardId, isCreating, createWizard]);

  // Визначення поточного етапу на основі стану State Machine
  const getCurrentStage = (): number => {
    if (!currentState) return 0;

    for (let i = 0; i < STAGES.length; i++) {
      if (STAGES[i].states.includes(currentState)) {
        return i;
      }
    }
    return 0;
  };

  const currentStage = getCurrentStage();
  const error = createError || actionError || stateError;

  // Обробка помилок
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            ⚠️
          </Typography>
          <Typography variant="h5" gutterBottom>
            Помилка завантаження
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error.message || 'Сталася несподівана помилка'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Перезавантажити
            </Button>
            <Button variant="outlined" onClick={() => cancelWizard?.()}>
              Скасувати
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Завантаження
  const isLoading = isCreating || isLoadingState;
  if (isLoading && !wizardId) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6">Ініціалізація Order Wizard...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Order Wizard - Хімчистка
        </Typography>
        {wizardId && (
          <Chip label={`Сесія: ${wizardId.slice(-8)}`} variant="outlined" size="small" />
        )}
      </Box>

      {/* Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={currentStage} alternativeLabel>
            {STAGES.map((stage, index) => (
              <Step key={stage.label} completed={index < currentStage}>
                <StepLabel icon={stage.icon}>{stage.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Debug Info (тільки в development) */}
      {process.env.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Debug Info:
          </Typography>
          <Typography variant="body2">
            <strong>Current State:</strong> {currentState || 'N/A'} <br />
            <strong>Current Stage:</strong> {currentStage + 1} <br />
            <strong>Session ID:</strong> {wizardId || 'N/A'} <br />
            <strong>Auth Token:</strong> Перевіряється через API
          </Typography>
        </Alert>
      )}

      {/* Індикатор виконання дій */}
      {isExecutingAction && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="body2">Обробка дії...</Typography>
          </Box>
        </Alert>
      )}

      {/* Основний контент */}
      <Card>
        <CardContent>
          {/* Етап 1: Клієнт та базова інформація */}
          {currentStage === 0 && (
            <Stage1ClientAndOrder
              wizardId={wizardId}
              currentState={currentState}
              sessionData={sessionData}
              isExecutingAction={isExecutingAction}
              onSelectClient={selectClient}
              onSaveOrderInfo={saveOrderInfo}
              onCancel={cancelWizard}
              actionError={actionError}
              isCancelling={isCancelling}
              onResetErrors={resetErrors}
            />
          )}

          {/* Етап 2: Менеджер предметів */}
          {currentStage === 1 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                🔄
              </Typography>
              <Typography variant="h5" gutterBottom>
                Етап 2: Менеджер предметів
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Циклічний процес додавання предметів до замовлення
              </Typography>
              <Chip label={`Current State: ${currentState}`} variant="outlined" />
            </Box>
          )}

          {/* Етап 3: Параметри замовлення */}
          {currentStage === 2 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                ⚙️
              </Typography>
              <Typography variant="h5" gutterBottom>
                Етап 3: Параметри замовлення
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Налаштування знижок, терміновості та способу оплати
              </Typography>
              <Chip label={`Current State: ${currentState}`} variant="outlined" />
            </Box>
          )}

          {/* Етап 4: Підтвердження */}
          {currentStage === 3 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                📋
              </Typography>
              <Typography variant="h5" gutterBottom>
                Етап 4: Підтвердження та квитанція
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Перегляд замовлення та формування квитанції
              </Typography>
              <Chip label={`Current State: ${currentState}`} variant="outlined" />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Відладочні дії (тільки в development) */}
      {process.env.NODE_ENV === 'development' && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Відладочні дії:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => refetchState()}
                disabled={isExecutingAction}
              >
                Оновити стан
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => cancelWizard?.()}
                disabled={isExecutingAction}
              >
                Скасувати сесію
              </Button>
              <Button variant="outlined" size="small" onClick={() => window.location.reload()}>
                Перезапуск
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
