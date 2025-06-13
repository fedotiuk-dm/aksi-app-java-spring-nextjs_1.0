'use client';

import { FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  LinearProgress,
  Chip,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

import { useStage1SimplifiedWorkflow } from '@/domains/wizard/stage1';

import { ClientSelectionStep } from './ClientSelectionStep';
import { BranchSelectionStep } from './BranchSelectionStep';

interface Stage1SimplifiedContainerProps {
  onStageCompleted?: () => void;
}

const STEP_LABELS = ['Вибір клієнта', 'Вибір філії та створення замовлення'];
const TEXT_SECONDARY_COLOR = 'text.secondary';
const BODY2_VARIANT = 'body2';

export const Stage1SimplifiedContainer: FC<Stage1SimplifiedContainerProps> = ({
  onStageCompleted,
}) => {
  const { substeps, workflow, navigation, readiness, loading, handlers } =
    useStage1SimplifiedWorkflow();

  const handleOrderCreated = () => {
    const isOrderCreated = handlers.onOrderCreated();
    if (isOrderCreated && readiness.isStage1Ready) {
      onStageCompleted?.();
    }
  };

  const renderCurrentStep = () => {
    switch (workflow.currentSubstep) {
      case 'client-selection':
        return <ClientSelectionStep onClientSelected={handlers.onClientSelected} />;

      case 'branch-selection':
        return (
          <BranchSelectionStep
            onOrderCreated={handleOrderCreated}
            onGoBack={navigation.goBackToClientSelection}
            selectedClientName={
              substeps.clientSelection.data.selectedClient
                ? `${substeps.clientSelection.data.selectedClient.firstName} ${substeps.clientSelection.data.selectedClient.lastName}`
                : undefined
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      {/* Заголовок Stage1 */}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Етап 1: Клієнт та створення замовлення
      </Typography>

      <Typography variant="body1" color={TEXT_SECONDARY_COLOR} align="center" sx={{ mb: 4 }}>
        Оберіть клієнта та створіть нове замовлення
      </Typography>

      {/* Індикатор прогресу */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6">Прогрес виконання</Typography>
            <Typography variant={BODY2_VARIANT} color={TEXT_SECONDARY_COLOR}>
              {workflow.currentIndex + 1} з {workflow.totalSubsteps}
            </Typography>
          </Box>

          <Stepper activeStep={workflow.currentIndex} alternativeLabel>
            {STEP_LABELS.map((label, index) => {
              const isCompleted =
                index === 0
                  ? readiness.isClientSelectionCompleted
                  : index === 1
                    ? readiness.isBranchSelectionCompleted
                    : false;

              return (
                <Step key={index} completed={isCompleted}>
                  <StepLabel
                    StepIconComponent={({ active, completed }) => {
                      if (completed) {
                        return <CheckCircleIcon color="success" />;
                      }
                      return (
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            bgcolor: active ? 'primary.main' : 'grey.300',
                            color: active ? 'primary.contrastText' : TEXT_SECONDARY_COLOR,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {index + 1}
                        </Box>
                      );
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {/* Прогрес-бар */}
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={workflow.progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography
              variant="caption"
              color={TEXT_SECONDARY_COLOR}
              sx={{ mt: 0.5, display: 'block' }}
            >
              {Math.round(workflow.progress)}% завершено
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Стан завантаження */}
      {loading.isAnyLoading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Виконання операції...
        </Alert>
      )}

      {/* Стан готовності підетапів */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Стан виконання
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label="Клієнт"
                color={readiness.isClientSelectionCompleted ? 'success' : 'default'}
                variant={readiness.isClientSelectionCompleted ? 'filled' : 'outlined'}
                size="small"
              />
              {readiness.isClientSelectionCompleted ? (
                <Typography variant={BODY2_VARIANT}>
                  ✅ Клієнт обраний: {substeps.clientSelection.data.selectedClient?.firstName}{' '}
                  {substeps.clientSelection.data.selectedClient?.lastName}
                </Typography>
              ) : (
                <Typography variant={BODY2_VARIANT} color={TEXT_SECONDARY_COLOR}>
                  ⏳ Потрібно обрати або створити клієнта
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label="Замовлення"
                color={readiness.isBranchSelectionCompleted ? 'success' : 'default'}
                variant={readiness.isBranchSelectionCompleted ? 'filled' : 'outlined'}
                size="small"
              />
              {readiness.isBranchSelectionCompleted ? (
                <Typography variant={BODY2_VARIANT}>✅ Замовлення створено</Typography>
              ) : (
                <Typography variant={BODY2_VARIANT} color={TEXT_SECONDARY_COLOR}>
                  ⏳ Потрібно обрати філію та створити замовлення
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Поточний крок */}
      <Box sx={{ mb: 3 }}>{renderCurrentStep()}</Box>

      {/* Готовність до завершення Stage1 */}
      {readiness.isStage1Ready && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            🎉 Етап 1 завершено!
          </Typography>
          <Typography variant="body1">
            Клієнт обраний та замовлення створено. Можна переходити до наступного етапу.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
