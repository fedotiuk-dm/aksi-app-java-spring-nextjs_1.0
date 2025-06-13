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
  Paper,
  Chip,
  Button,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

import { useStage1Workflow } from '@/domains/wizard/stage1';
import { STAGE1_SUBSTEPS } from '@/domains/wizard/stage1/utils/stage1-mapping';

import { ClientSearchStep } from './ClientSearchStep';
import { ClientCreateStep } from './ClientCreateStep';
import { BasicOrderInfoStep } from './BasicOrderInfoStep';

interface Stage1ContainerProps {
  onStageCompleted?: () => void;
}

const STEP_LABELS = ['Пошук клієнта', 'Створення клієнта', 'Інформація замовлення'];
const TEXT_SECONDARY_COLOR = 'text.secondary';
const BODY2_VARIANT = 'body2';

export const Stage1Container: FC<Stage1ContainerProps> = ({ onStageCompleted }) => {
  const { substeps, workflow, navigation, readiness, loading } = useStage1Workflow();

  const handleClientSelected = () => {
    navigation.navigateToSubstep(STAGE1_SUBSTEPS.BASIC_ORDER_INFO);
  };

  const handleClientCreated = () => {
    navigation.navigateToSubstep(STAGE1_SUBSTEPS.BASIC_ORDER_INFO);
  };

  const handleCreateNewClient = () => {
    navigation.navigateToSubstep(STAGE1_SUBSTEPS.CLIENT_CREATION);
  };

  const handleCancelCreateClient = () => {
    navigation.navigateToSubstep(STAGE1_SUBSTEPS.CLIENT_SEARCH);
  };

  const handleBasicOrderInfoCompleted = () => {
    if (readiness.isStage1Ready) {
      onStageCompleted?.();
    }
  };

  const renderCurrentStep = () => {
    switch (workflow.currentSubstep) {
      case 'client-search':
        return (
          <ClientSearchStep
            onClientSelected={handleClientSelected}
            onCreateNewClient={handleCreateNewClient}
          />
        );

      case 'client-creation':
        return (
          <ClientCreateStep
            onClientCreated={handleClientCreated}
            onCancel={handleCancelCreateClient}
          />
        );

      case 'basic-order-info':
        return <BasicOrderInfoStep onCompleted={handleBasicOrderInfoCompleted} />;

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      {/* Заголовок Stage1 */}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Етап 1: Клієнт та базова інформація
      </Typography>

      <Typography variant="body1" color={TEXT_SECONDARY_COLOR} align="center" sx={{ mb: 4 }}>
        Знайдіть або створіть клієнта та вкажіть основну інформацію для замовлення
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
                  ? readiness.isClientSearchCompleted
                  : index === 1
                    ? readiness.isClientCreateCompleted
                    : index === 2
                      ? readiness.isBasicOrderInfoCompleted
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
            Стан підетапів
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label="Клієнт"
                color={readiness.isClientSearchCompleted ? 'success' : 'default'}
                variant={readiness.isClientSearchCompleted ? 'filled' : 'outlined'}
                size="small"
              />
              {readiness.isClientSearchCompleted ? (
                <Typography variant={BODY2_VARIANT}>
                  ✅ Клієнт обраний: {substeps.clientSearch.computed.selectedClient?.firstName}{' '}
                  {substeps.clientSearch.computed.selectedClient?.lastName}
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
                color={readiness.isBasicOrderInfoCompleted ? 'success' : 'default'}
                variant={readiness.isBasicOrderInfoCompleted ? 'filled' : 'outlined'}
                size="small"
              />
              {readiness.isBasicOrderInfoCompleted ? (
                <Typography variant={BODY2_VARIANT}>✅ Основна інформація заповнена</Typography>
              ) : (
                <Typography variant={BODY2_VARIANT} color={TEXT_SECONDARY_COLOR}>
                  ⏳ Потрібно заповнити основну інформацію
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Поточний крок */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 0 }}>{renderCurrentStep()}</CardContent>
      </Card>

      {/* Навігація між підетапами */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={navigation.previousSubstep}
          disabled={!navigation.canGoPrevious}
        >
          Попередній підетап
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant={BODY2_VARIANT} color={TEXT_SECONDARY_COLOR}>
            {STEP_LABELS[workflow.currentIndex]}
          </Typography>
        </Box>

        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={navigation.nextSubstep}
          disabled={!navigation.canGoNext}
        >
          Наступний підетап
        </Button>
      </Box>

      {/* Готовність до переходу на Stage2 */}
      {readiness.isStage1Ready && (
        <Paper
          sx={{
            p: 3,
            mt: 3,
            bgcolor: 'success.50',
            border: '1px solid',
            borderColor: 'success.200',
            textAlign: 'center',
          }}
        >
          <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h5" color="success.main" gutterBottom>
            Етап 1 завершено!
          </Typography>
          <Typography variant="body1" color={TEXT_SECONDARY_COLOR} sx={{ mb: 2 }}>
            Всі необхідні дані заповнені. Можна переходити до наступного етапу.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={onStageCompleted}
            endIcon={<ArrowForwardIcon />}
          >
            Перейти до Етапу 2
          </Button>
        </Paper>
      )}
    </Box>
  );
};
