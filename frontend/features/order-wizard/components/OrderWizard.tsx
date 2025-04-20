'use client';

import { useEffect } from 'react';
import { Typography, Container, Paper, Box, Stepper, Step, StepLabel, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { ClientSelectionStep } from './steps/ClientSelectionStep';
import { ServiceSelectionStep } from '@/features/order-wizard/components/steps/ServiceSelectionStep';
import { OrderDetailsStep } from '@/features/order-wizard/components/steps/OrderDetailsStep';
import { OrderSummaryStep } from '@/features/order-wizard/components/steps/OrderSummaryStep';
import { useOrderWizardStore } from '../store/orderWizardStore';

// Компонент OrderWizard з використанням Zustand для управління станом
export function OrderWizard() {
  // Отримуємо дані та дії зі сховища Zustand
  const { 
    currentStep, 
    steps, 
    client, 
    orderNote, 
    isCompleted,
    orderId,
    nextStep, 
    prevStep, 
    setClient, 
    setOrderNote,
    setIsNewClient,
    resetWizard
  } = useOrderWizardStore();

  // Скидаємо стан візарда при монтуванні компонента
  useEffect(() => {
    resetWizard();
  }, [resetWizard]);

  // Обробник для переходу до створення нового клієнта
  const handleCreateNewClient = () => {
    setIsNewClient(true);
    // Тут можна реалізувати логіку для відображення форми створення нового клієнта
  };

  // Рендеринг контенту відповідно до поточного кроку
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Етап вибору клієнта
        return (
          <ClientSelectionStep
            selectedClient={client}
            onClientSelect={setClient}
            onCreateNewClient={handleCreateNewClient}
            orderNote={orderNote}
            onOrderNoteChange={setOrderNote}
            onNext={nextStep}
          />
        );
      case 1: // Етап вибору послуг
        return (
          <ServiceSelectionStep 
            onNext={nextStep} 
            onPrevious={prevStep} 
          />
        );
      case 2: // Етап деталей замовлення
        return (
          <OrderDetailsStep 
            onNext={nextStep} 
            onPrevious={prevStep} 
          />
        );
      case 3: // Етап підсумку та завершення замовлення
        return (
          <OrderSummaryStep 
            onPrevious={prevStep} 
          />
        );
      default:
        return <Typography>Крок не знайдено</Typography>;
    }
  };

  // Якщо процес замовлення завершено, показуємо повідомлення про успіх
  if (isCompleted && orderId) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Замовлення успішно створено!
          </Typography>
          <Typography variant="body1">
            Номер замовлення: {orderId}
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={resetWizard}
          >
            Створити нове замовлення
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Створення нового замовлення
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Заповніть необхідні дані для створення нового замовлення у системі.
        </Typography>
      </Box>

      {/* Горизонтальний степпер з кроками */}
      <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
        {steps.map((step) => (
          <Step key={step.id}>
            <StepLabel>{step.title}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Контейнер для контенту поточного кроку */}
      <Paper sx={{ p: 3, mb: 3 }}>
        {renderStepContent()}
      </Paper>

      {/* Навігаційні кнопки */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Назад
        </Button>
        
        {/* Кнопка "Далі" відображається, якщо це не останній крок */}
        {currentStep < steps.length - 1 ? (
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={nextStep}
          >
            Далі
          </Button>
        ) : (
          /* Кнопка "Завершити" для останнього кроку */
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              // Тут буде логіка для створення замовлення
              console.log('Замовлення завершено');
            }}
          >
            Завершити
          </Button>
        )}
      </Box>
    </Container>
  );
}
