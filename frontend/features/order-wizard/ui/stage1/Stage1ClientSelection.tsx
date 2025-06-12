'use client';

/**
 * @fileoverview Головний компонент Stage1 з об'єднаним екраном вибору клієнта та філії
 *
 * Архітектура: "DDD inside, FSD outside"
 * Компонент композиція з окремих панелей
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
import { FC, useState, useEffect } from 'react';

import { useOrderWizardMain } from '@/domains/wizard/main';
import { useBasicOrderInfo } from '@/domains/wizard/stage1/basic-order-info';
import { useClientCreation } from '@/domains/wizard/stage1/client-creation';
import { useClientSearch } from '@/domains/wizard/stage1/client-search';

import { BasicOrderInfoForm } from './BasicOrderInfoForm';
import { BranchSelectionPanel } from './BranchSelectionPanel';
import { ClientSelectionPanel } from './ClientSelectionPanel';
import { CreateClientModal } from './CreateClientModal';

export const Stage1ClientSelection: FC = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);

  // Головний Order Wizard хук
  const orderWizard = useOrderWizardMain();

  // Хуки для кожного підетапу
  const clientSearch = useClientSearch();
  const clientCreation = useClientCreation();
  const basicOrderInfo = useBasicOrderInfo();

  // Синхронізація sessionId між головним Order Wizard і доменами
  useEffect(() => {
    if (orderWizard.ui.sessionId) {
      console.log('🔄 Синхронізація sessionId:', {
        orderWizardSessionId: orderWizard.ui.sessionId,
        clientSearchSessionId: clientSearch.ui.sessionId,
        basicOrderInfoSessionId: basicOrderInfo.ui.sessionId,
      });

      // Синхронізуємо sessionId з усіма доменами
      if (orderWizard.ui.sessionId !== clientSearch.ui.sessionId) {
        console.log('🔄 Оновлюємо sessionId для client-search');
        clientSearch.actions.setSessionId(orderWizard.ui.sessionId);
      }

      if (orderWizard.ui.sessionId !== basicOrderInfo.ui.sessionId) {
        console.log('🔄 Оновлюємо sessionId для basic-order-info');
        basicOrderInfo.actions.setSessionId(orderWizard.ui.sessionId);
      }
    }
  }, [
    orderWizard.ui.sessionId,
    clientSearch.ui.sessionId,
    basicOrderInfo.ui.sessionId,
    clientSearch.actions,
    basicOrderInfo.actions,
  ]);

  // Обробники подій
  const handleClientSelected = (clientId: string) => {
    setSelectedClientId(clientId);
    console.log('Клієнт обраний:', clientId);
  };

  const handleClientCreated = (clientId: string) => {
    setSelectedClientId(clientId);
    console.log('Клієнт створений:', clientId);
  };

  const handleBranchSelected = (branchId: string) => {
    setSelectedBranchId(branchId);
    console.log('Філія обрана:', branchId);
  };

  // Синхронізація з доменним станом
  useEffect(() => {
    if (basicOrderInfo.ui.selectedBranch?.id && !selectedBranchId) {
      setSelectedBranchId(basicOrderInfo.ui.selectedBranch.id);
    }
  }, [basicOrderInfo.ui.selectedBranch, selectedBranchId]);

  const handleCompleteStage1 = () => {
    if (selectedClientId && selectedBranchId && orderWizard.ui.sessionId) {
      orderWizard.actions.completeCurrentStage();
    }
  };

  // Перевірка готовності до завершення етапу
  const canCompleteStage = Boolean(
    selectedClientId &&
      selectedBranchId &&
      orderWizard.ui.sessionId &&
      !orderWizard.loading.isAnyLoading
  );

  // Кроки для Stepper
  const steps = ['Вибір клієнта', 'Вибір філії', 'Завершення етапу'];
  const activeStep = selectedClientId ? (selectedBranchId ? 2 : 1) : 0;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Заголовок */}
        <Typography variant="h4" gutterBottom>
          Етап 1: Клієнт та базова інформація замовлення
        </Typography>

        {/* Стан сесії */}
        {!orderWizard.ui.sessionId && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body1">
              Для початку роботи потрібно ініціалізувати Order Wizard
            </Typography>
            <Button
              variant="contained"
              onClick={orderWizard.actions.startNewOrder}
              disabled={orderWizard.loading.isStarting}
              sx={{ mt: 1 }}
            >
              {orderWizard.loading.isStarting ? 'Запуск...' : 'Запустити Order Wizard'}
            </Button>
          </Alert>
        )}

        {/* Прогрес */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel>
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
        {orderWizard.ui.sessionId && (
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

            {/* Форма основної інформації замовлення (показується після вибору філії) */}
            {selectedBranchId && (
              <Grid size={{ xs: 12 }}>
                <BasicOrderInfoForm onDataUpdated={() => console.log('Дані оновлено')} />
              </Grid>
            )}
          </Grid>
        )}

        {/* Статус вибору */}
        {(selectedClientId || selectedBranchId) && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Поточний стан
              </Typography>

              {selectedClientId && (
                <Alert severity="success" sx={{ mb: 1 }}>
                  ✅ Клієнт обраний (ID: {selectedClientId})
                </Alert>
              )}

              {selectedBranchId && (
                <Alert severity="success" sx={{ mb: 1 }}>
                  ✅ Філія обрана: {basicOrderInfo.ui.selectedBranch?.name || selectedBranchId}
                  {basicOrderInfo.ui.selectedBranch?.address && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      📍 {basicOrderInfo.ui.selectedBranch.address}
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
                  disabled={!canCompleteStage}
                  startIcon={
                    orderWizard.loading.isCompletingStage1 ? (
                      <CircularProgress size={20} />
                    ) : (
                      <ArrowForwardIcon />
                    )
                  }
                >
                  {orderWizard.loading.isCompletingStage1
                    ? 'Завершення етапу...'
                    : 'Перейти до Етапу 2'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Помилки */}
        {orderWizard.errors.hasAnyError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Виникла помилка: {orderWizard.errors.stage1Error?.message || 'Невідома помилка'}
            </Typography>
          </Alert>
        )}

        {/* Модальне вікно створення клієнта */}
        <CreateClientModal
          open={showCreateClientModal}
          onClose={() => setShowCreateClientModal(false)}
          onClientCreated={handleClientCreated}
        />

        {/* Debug інформація (тільки в розробці) */}
        {orderWizard.debug && (
          <Card sx={{ mt: 3, bgcolor: 'grey.100' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Debug інформація
              </Typography>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify(
                  {
                    sessionId: orderWizard.ui.sessionId,
                    currentStage: orderWizard.ui.currentStage,
                    selectedClientId,
                    selectedBranchId,
                    canCompleteStage,
                    loading: orderWizard.loading,
                    clientSearch: {
                      sessionId: clientSearch.ui.sessionId,
                      searchResults: clientSearch.data.searchResults?.length || 0,
                    },
                    clientCreation: {
                      isFormVisible: clientCreation.ui.isFormVisible,
                      currentStep: clientCreation.ui.currentStep,
                    },
                    basicOrderInfo: {
                      selectedBranch: basicOrderInfo.ui.selectedBranch,
                      branches: (basicOrderInfo.ui.availableBranches || []).length,
                    },
                  },
                  null,
                  2
                )}
              </pre>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};
