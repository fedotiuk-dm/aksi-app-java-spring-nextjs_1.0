'use client';

/**
 * @fileoverview Головний компонент Stage1 з об'єднаним екраном вибору клієнта та філії
 *
 * Архітектура: "DDD inside, FSD outside"
 * Компонент використовує композиційний хук useStage1Workflow
 */

import {
  PersonSearch as PersonSearchIcon,
  Store as StoreIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { FC, useState } from 'react';

import { useStage1Workflow } from '@/domains/wizard/stage1';
import { useMain } from '@/domains/wizard/main';
import { useMainStore } from '@/domains/wizard/main/store/main.store';

import { BasicOrderInfoForm } from './BasicOrderInfoForm';
import { BranchSelectionPanel } from './BranchSelectionPanel';
import { ClientSelectionPanel } from './ClientSelectionPanel';
import { CreateClientModal } from './CreateClientModal';

export const Stage1ClientSelection: FC = () => {
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);

  // Композиційний хук для всього Stage1
  const stage1 = useStage1Workflow();

  // Головний хук для завершення етапу
  const main = useMain();

  // Отримуємо sessionId з головного стору
  const sessionId = useMainStore((state) => state.sessionId);

  // Режим пошуку клієнтів має бути завжди активний

  // Обробники подій
  const handleClientSelected = (clientId: string) => {
    console.log('Клієнт обраний:', clientId);
    // Логіка вибору клієнта вже обробляється в доменному хуку
  };

  const handleClientCreated = (clientId: string) => {
    console.log('Клієнт створений:', clientId);
    setShowCreateClientModal(false);
    // Логіка створення клієнта вже обробляється в доменному хуку
  };

  const handleBranchSelected = (branchId: string) => {
    console.log('Філія обрана:', branchId);
    // Логіка вибору філії вже обробляється в доменному хуку
  };

  const handleCompleteStage1 = () => {
    if (stage1.readiness.isStage1Ready) {
      console.log('Завершення Stage1');
      // Викликаємо завершення етапу через головний хук
      main.actions.completeStage1();
    }
  };

  // Кроки для Stepper на основі підетапів
  const steps = ['Пошук/створення клієнта', 'Базова інформація замовлення', 'Завершення етапу'];

  // Визначаємо активний крок на основі прогресу
  const getActiveStep = () => {
    if (!stage1.readiness.isClientSearchCompleted) return 0;
    if (!stage1.readiness.isBasicOrderInfoCompleted) return 1;
    return 2;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Заголовок */}
        <Typography variant="h4" gutterBottom>
          Етап 1: Клієнт та базова інформація замовлення
        </Typography>

        {/* Стан сесії */}
        {!sessionId && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body1">
              Для початку роботи потрібно ініціалізувати Order Wizard
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                // TODO: Додати ініціалізацію сесії
                console.log('Ініціалізація сесії');
              }}
              disabled={stage1.loading.isAnyLoading}
              sx={{ mt: 1 }}
            >
              {stage1.loading.isAnyLoading ? 'Запуск...' : 'Запустити Order Wizard'}
            </Button>
          </Alert>
        )}

        {/* Прогрес */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stepper activeStep={getActiveStep()} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconProps={{
                      icon:
                        index === 0 ? (
                          <PersonSearchIcon />
                        ) : index === 1 ? (
                          <StoreIcon />
                        ) : (
                          <CheckCircleIcon />
                        ),
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Основний контент */}
        {sessionId && (
          <Grid container spacing={3}>
            {/* Панель вибору клієнта */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ClientSelectionPanel
                onClientSelected={handleClientSelected}
                onCreateNewClient={() => setShowCreateClientModal(true)}
              />
            </Grid>

            {/* Панель вибору філії */}
            <Grid size={{ xs: 12, md: 6 }}>
              <BranchSelectionPanel onBranchSelected={handleBranchSelected} />
            </Grid>

            {/* Етап 1.3: Базова інформація замовлення */}
            <Grid size={{ xs: 12 }}>
              <BasicOrderInfoForm />
            </Grid>
          </Grid>
        )}

        {/* Статус вибору */}
        {(stage1.readiness.isClientSearchCompleted ||
          stage1.readiness.isBasicOrderInfoCompleted) && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Поточний стан
              </Typography>

              {stage1.readiness.isClientSearchCompleted && (
                <Alert severity="success" sx={{ mb: 1 }}>
                  ✅ Клієнт обраний
                  {stage1.substeps.clientSearch.computed.selectedClient && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {stage1.substeps.clientSearch.computed.selectedClient.firstName}{' '}
                      {stage1.substeps.clientSearch.computed.selectedClient.lastName}
                      {stage1.substeps.clientSearch.computed.selectedClient.phone &&
                        ` • ${stage1.substeps.clientSearch.computed.selectedClient.phone}`}
                    </Typography>
                  )}
                </Alert>
              )}

              {stage1.readiness.isBasicOrderInfoCompleted && (
                <Alert severity="success" sx={{ mb: 1 }}>
                  ✅ Базова інформація заповнена
                  {stage1.substeps.basicOrderInfo.computed.selectedBranch && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      📍 {stage1.substeps.basicOrderInfo.computed.selectedBranch.name}
                      {stage1.substeps.basicOrderInfo.computed.selectedBranch.address &&
                        ` • ${stage1.substeps.basicOrderInfo.computed.selectedBranch.address}`}
                    </Typography>
                  )}
                  {stage1.substeps.basicOrderInfo.computed.hasReceiptNumber && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      🧾 Квитанція згенерована
                    </Typography>
                  )}
                </Alert>
              )}

              {/* Кнопка завершення етапу */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCompleteStage1}
                  disabled={!stage1.readiness.isStage1Ready}
                  startIcon={
                    stage1.loading.isAnyLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <ArrowForwardIcon />
                    )
                  }
                >
                  {stage1.loading.isAnyLoading ? 'Завершення етапу...' : 'Перейти до Етапу 2'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Помилки */}
        {stage1.loading.isAnyLoading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">Обробка даних...</Typography>
          </Alert>
        )}

        {/* Модальне вікно створення клієнта */}
        <CreateClientModal
          open={showCreateClientModal}
          onClose={() => setShowCreateClientModal(false)}
          onClientCreated={handleClientCreated}
        />
      </Box>
    </Container>
  );
};
