/**
 * @fileoverview Етап 1: Клієнт та базова інформація замовлення
 *
 * Компонент інтегрований з Spring State Machine через useOrderWizard
 */

'use client';

import {
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Alert,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { ClientSelectionStep } from './components/ClientSelectionStep';
import { OrderBasicInfoStep } from './components/OrderBasicInfoStep';

import type {
  ExecuteAction200,
  CancelWizard200,
  ClientResponse,
} from '@/shared/api/generated/order-wizard';

interface Stage1ClientAndOrderProps {
  wizardId: string | null;
  currentState?: string;
  sessionData?: any;
  isExecutingAction: boolean;
  // Додаємо функції з батьківського хука з правильними типами
  onSelectClient: (clientData: ClientResponse) => Promise<ExecuteAction200>;
  onSaveOrderInfo: (branchId: string, uniqueTag?: string) => Promise<ExecuteAction200>;
  onCancel: () => Promise<CancelWizard200 | undefined>;
  // Додаємо стани помилок
  actionError?: Error | null;
  isCancelling?: boolean;
  onResetErrors?: () => void;
}

const SUB_STEPS = [
  {
    label: '1.1. Вибір або створення клієнта',
    icon: <PersonIcon />,
    states: ['INITIAL', 'CLIENT_SELECTION'],
  },
  {
    label: '1.2. Базова інформація замовлення',
    icon: <AssignmentIcon />,
    states: ['ORDER_INITIALIZATION'],
  },
];

/**
 * 🎯 Етап 1: Клієнт та базова інформація замовлення
 *
 * Включає:
 * 1.1. Вибір або створення клієнта
 * 1.2. Базова інформація замовлення
 */
export function Stage1ClientAndOrder({
  wizardId,
  currentState,
  sessionData,
  isExecutingAction,
  onSelectClient,
  onSaveOrderInfo,
  onCancel,
  actionError,
  isCancelling,
  onResetErrors,
}: Stage1ClientAndOrderProps) {
  const [currentSubStep, setCurrentSubStep] = useState(0);

  // Debug logging для відладки
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Stage1 Debug (з пропсами):', {
      wizardId,
      currentState,
      isExecutingAction,
      hasWizardId: !!wizardId,
      hasCurrentState: !!currentState,
    });
  }

  // Автоматичне перемикання між підетапами на основі стану State Machine
  useEffect(() => {
    console.log('🔄 Перемикання підетапу для стану:', currentState);

    if (!currentState) return;

    // Знаходимо відповідний підетап для поточного стану
    for (let i = 0; i < SUB_STEPS.length; i++) {
      if (SUB_STEPS[i].states.includes(currentState)) {
        console.log(`📝 Встановлюємо підетап: ${i} (${SUB_STEPS[i].label})`);
        setCurrentSubStep(i);
        return;
      }
    }

    console.log('✅ Етап 1 завершено, стан:', currentState);
  }, [currentState]);

  // Обробники подій
  const handleClientSelected = async (clientData: ClientResponse) => {
    try {
      await onSelectClient(clientData);
      console.log('✅ Клієнт вибрано, переходимо до базової інформації');
    } catch (error) {
      console.error('❌ Помилка вибору клієнта:', error);
    }
  };

  const handleOrderInfoCompleted = async (branchId: string, uniqueTag?: string) => {
    try {
      await onSaveOrderInfo(branchId, uniqueTag);
      console.log('✅ Базова інформація збережена, етап 1 завершено');
    } catch (error) {
      console.error('❌ Помилка збереження базової інформації:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await onCancel();
      console.log('✅ Wizard скасовано');
    } catch (error) {
      console.error('❌ Помилка скасування:', error);
    }
  };

  // Показуємо завантаження поки wizard не ініціалізовано
  if (!wizardId) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Підготовка Order Wizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ініціалізація сесії для створення замовлення...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Заголовок етапу */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Етап 1: Клієнт та базова інформація замовлення
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Chip label={`Стан: ${currentState}`} variant="outlined" size="small" />
          <Chip
            label={`Підетап: ${SUB_STEPS[currentSubStep]?.label}`}
            color="primary"
            size="small"
          />
        </Box>
      </Box>

      {/* Індикатор завантаження дій */}
      {isExecutingAction && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Обробка дії...
        </Alert>
      )}

      {/* Помилки дій */}
      {actionError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            onResetErrors && (
              <Button color="inherit" size="small" onClick={onResetErrors}>
                Закрити
              </Button>
            )
          }
        >
          <Typography variant="subtitle2" gutterBottom>
            Помилка виконання дії
          </Typography>
          <Typography variant="body2">{actionError.message}</Typography>
        </Alert>
      )}

      {/* Вертикальний stepper для підетапів */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={currentSubStep} orientation="vertical">
            {SUB_STEPS.map((step, index) => (
              <Step key={step.label}>
                <StepLabel icon={step.icon}>
                  <Typography variant="subtitle1">{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  {/* Підетап 1.1: Вибір клієнта */}
                  {index === 0 && (
                    <ClientSelectionStep
                      onClientSelected={handleClientSelected}
                      isLoading={isExecutingAction}
                      sessionData={sessionData}
                    />
                  )}

                  {/* Підетап 1.2: Базова інформація */}
                  {index === 1 && (
                    <OrderBasicInfoStep
                      onOrderInfoCompleted={handleOrderInfoCompleted}
                      isLoading={isExecutingAction}
                      sessionData={sessionData}
                      wizardId={wizardId || undefined}
                    />
                  )}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Панель дій */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Button
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={handleCancel}
          disabled={isCancelling}
          color="error"
        >
          {isCancelling ? 'Скасування...' : 'Скасувати'}
        </Button>

        <Chip label={`Wizard ID: ${wizardId.slice(-8)}`} variant="outlined" size="small" />
      </Box>
    </Box>
  );
}

export default Stage1ClientAndOrder;
