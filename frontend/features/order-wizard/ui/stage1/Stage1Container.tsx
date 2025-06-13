'use client';

import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';

// UI компоненти кроків
import { ClientSearchStep } from './ClientSearchStep';
import { ClientCreationStep } from './ClientCreationStep';
import { BasicOrderInfoStep } from './BasicOrderInfoStep';

interface Stage1ContainerProps {
  onStageCompleted: () => void;
}

// Кроки Stage1
enum Stage1Steps {
  CLIENT_SEARCH = 'CLIENT_SEARCH',
  CLIENT_CREATION = 'CLIENT_CREATION',
  BASIC_ORDER_INFO = 'BASIC_ORDER_INFO',
}

const stepLabels = {
  [Stage1Steps.CLIENT_SEARCH]: 'Пошук клієнта',
  [Stage1Steps.CLIENT_CREATION]: 'Створення клієнта',
  [Stage1Steps.BASIC_ORDER_INFO]: 'Базова інформація',
};

export const Stage1Container: React.FC<Stage1ContainerProps> = ({ onStageCompleted }) => {
  // ========== ЛОКАЛЬНИЙ UI СТАН ==========
  const [currentStep, setCurrentStep] = React.useState<Stage1Steps>(Stage1Steps.CLIENT_SEARCH);
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // ========== EVENT HANDLERS ==========
  const handleClientSelected = (clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentStep(Stage1Steps.BASIC_ORDER_INFO);
  };

  const handleCreateNewClient = () => {
    setCurrentStep(Stage1Steps.CLIENT_CREATION);
  };

  const handleClientCreated = (clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentStep(Stage1Steps.BASIC_ORDER_INFO);
  };

  const handleGoBackToSearch = () => {
    setCurrentStep(Stage1Steps.CLIENT_SEARCH);
    setSelectedClientId(null);
  };

  const handleGoBackToClient = () => {
    if (selectedClientId) {
      // Якщо клієнт вже обраний, повертаємося до пошуку
      setCurrentStep(Stage1Steps.CLIENT_SEARCH);
    } else {
      // Якщо клієнт був створений, повертаємося до створення
      setCurrentStep(Stage1Steps.CLIENT_CREATION);
    }
  };

  const handleOrderInfoCompleted = () => {
    setIsLoading(true);
    // Симуляція завершення етапу
    setTimeout(() => {
      setIsLoading(false);
      onStageCompleted();
    }, 1000);
  };

  // ========== RENDER HELPERS ==========
  const getCurrentStepIndex = (): number => {
    switch (currentStep) {
      case Stage1Steps.CLIENT_SEARCH:
        return 0;
      case Stage1Steps.CLIENT_CREATION:
        return 1;
      case Stage1Steps.BASIC_ORDER_INFO:
        return 2;
      default:
        return 0;
    }
  };

  const renderCurrentStep = (): React.ReactNode => {
    switch (currentStep) {
      case Stage1Steps.CLIENT_SEARCH:
        return (
          <ClientSearchStep
            onClientSelected={handleClientSelected}
            onCreateNewClient={handleCreateNewClient}
          />
        );

      case Stage1Steps.CLIENT_CREATION:
        return (
          <ClientCreationStep
            onClientCreated={handleClientCreated}
            onGoBack={handleGoBackToSearch}
          />
        );

      case Stage1Steps.BASIC_ORDER_INFO:
        if (!selectedClientId) {
          return <Alert severity="error">Клієнт не обраний</Alert>;
        }
        return (
          <BasicOrderInfoStep
            selectedClientId={selectedClientId}
            onOrderInfoCompleted={handleOrderInfoCompleted}
            onGoBack={handleGoBackToClient}
          />
        );

      default:
        return <Alert severity="error">Невідомий крок: {currentStep}</Alert>;
    }
  };

  // ========== RENDER ==========
  return (
    <Box sx={{ width: '100%' }}>
      {/* Заголовок етапу */}
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Етап 1: Клієнт та базова інформація замовлення
      </Typography>

      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Оберіть або створіть клієнта та заповніть базову інформацію замовлення
      </Typography>

      {/* Степпер */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={getCurrentStepIndex()} alternativeLabel>
            <Step>
              <StepLabel>Пошук клієнта</StepLabel>
            </Step>
            <Step>
              <StepLabel optional={<Typography variant="caption">Опціонально</Typography>}>
                Створення клієнта
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>Базова інформація</StepLabel>
            </Step>
          </Stepper>
        </CardContent>
      </Card>

      {/* Індикатор завантаження */}
      {isLoading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Завершення етапу 1...
          </Typography>
        </Box>
      )}

      {/* Поточний крок */}
      <Box sx={{ minHeight: 600 }}>{renderCurrentStep()}</Box>

      {/* Інформація про прогрес */}
      <Card sx={{ mt: 3, bgcolor: 'grey.50' }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            <strong>Поточний крок:</strong> {stepLabels[currentStep]}
            {selectedClientId && (
              <>
                {' • '}
                <strong>Клієнт обраний:</strong> ✓
              </>
            )}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
