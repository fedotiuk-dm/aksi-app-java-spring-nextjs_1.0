import React from 'react';
import { Box, Paper, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { OrderWizardProvider, useOrderWizard } from '../context/OrderWizardContext';
import { OrderWizardStage } from '../model/types';
import ClientStage from '../stages/stage1-client/ui';
import { Stage1Data } from '../stages/stage1-client/model/types';

// Компонент-обгортка для OrderWizard з провайдером контексту
export default function OrderWizard() {
  return (
    <OrderWizardProvider>
      <OrderWizardContent />
    </OrderWizardProvider>
  );
}

// Основний контент OrderWizard
function OrderWizardContent() {
  const { 
    state, 
    nextStage, 
    setStage1Data
  } = useOrderWizard();
  
  // Конфігурація кроків візарда
  const steps = [
    'Клієнт і базова інформація',
    'Управління предметами',
    'Загальні параметри',
    'Підтвердження та квитанція'
  ];
  
  // Обробник завершення етапу 1
  const handleStage1Complete = (data: Stage1Data) => {
    setStage1Data(data);
  };
  
  // Відображення поточного етапу
  const renderCurrentStage = () => {
    switch (state.currentStage) {
      case OrderWizardStage.CLIENT_SELECTION:
        return (
          <ClientStage 
            onComplete={handleStage1Complete} 
            onNext={nextStage} 
            initialData={state.stage1 || {}}
          />
        );
      case OrderWizardStage.ITEMS_MANAGEMENT:
        // Буде реалізовано пізніше
        return (
          <Box sx={{ padding: 3 }}>
            <Typography variant="h6">
              Етап 2: Управління предметами
            </Typography>
            <Typography>
              Цей етап буде реалізовано пізніше
            </Typography>
          </Box>
        );
      case OrderWizardStage.GENERAL_PARAMETERS:
        // Буде реалізовано пізніше
        return (
          <Box sx={{ padding: 3 }}>
            <Typography variant="h6">
              Етап 3: Загальні параметри
            </Typography>
            <Typography>
              Цей етап буде реалізовано пізніше
            </Typography>
          </Box>
        );
      case OrderWizardStage.CONFIRMATION:
        // Буде реалізовано пізніше
        return (
          <Box sx={{ padding: 3 }}>
            <Typography variant="h6">
              Етап 4: Підтвердження та квитанція
            </Typography>
            <Typography>
              Цей етап буде реалізовано пізніше
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };
  
  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Оформлення замовлення
        </Typography>
        
        <Stepper activeStep={state.currentStage} sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
      
      {renderCurrentStage()}
    </Box>
  );
}
