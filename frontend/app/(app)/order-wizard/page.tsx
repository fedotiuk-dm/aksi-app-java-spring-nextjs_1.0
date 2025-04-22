'use client';

import React, { useState, useEffect } from 'react';
import { AuthGuard } from '@/features/auth/ui/AuthGuard';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { 
  Container, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Box, 
  Button,
  Paper
} from '@mui/material';
import { ClientSelector } from '@/features/order-wizard/ui/stage1/ClientSelector';
import { OrderBaseInfo } from '@/features/order-wizard/ui/stage1/OrderBaseInfo';
import { ClientResponse } from '@/lib/api';

const steps = [
  'Клієнт та базова інформація',
  'Менеджер предметів',
  'Загальні параметри',
  'Підтвердження та квитанція'
];

function OrderWizardContent() {
  const { isLoggedIn } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(null);
  const [isBaseInfoValid, setIsBaseInfoValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Перевіряємо стан авторизації при монтуванні компонента
  useEffect(() => {
    // Встановлюємо статус завантаження на false тільки якщо користувач авторизований
    if (isLoggedIn) {
      setIsLoading(false);
    }
    // Ефект буде запускатися при кожній зміні стану авторизації
  }, [isLoggedIn]);
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleClientSelected = (client: ClientResponse) => {
    console.log('Клієнт вибраний:', client.lastName || client.fullName);
    setSelectedClient(client);
  };
  
  const handleBaseInfoValidation = (isValid: boolean) => {
    console.log('Базова інформація валідна:', isValid);
    setIsBaseInfoValid(isValid);
  };
  
  // Перевірка валідності першого кроку з додатковим логуванням для діагностики
  const isStepOneValid = Boolean(selectedClient && isBaseInfoValid);
  
  // Додаємо діагностичне логування при зміні статусу валідації
  useEffect(() => {
    console.log('Стан валідації:', { isBaseInfoValid, clientSelected: Boolean(selectedClient), isStepOneValid });
  }, [isBaseInfoValid, selectedClient, isStepOneValid]);
  
  // Показуємо індикатор завантаження, якщо ще йде перевірка авторизації
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Завантаження даних...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Створення нового замовлення
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
      
      {activeStep === 0 && (
        <>
          <ClientSelector onClientSelected={handleClientSelected} />
          <OrderBaseInfo onChange={handleBaseInfoValidation} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepOneValid}
            >
              Продовжити
            </Button>
          </Box>
        </>
      )}
      
      {activeStep === 1 && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Менеджер предметів
            </Typography>
            <Typography>
              Тут буде реалізований Етап 2: Менеджер предметів
            </Typography>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={handleBack} variant="outlined">
              Назад
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Продовжити
            </Button>
          </Box>
        </>
      )}
      
      {activeStep === 2 && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Загальні параметри замовлення
            </Typography>
            <Typography>
              Тут буде реалізований Етап 3: Загальні параметри
            </Typography>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={handleBack} variant="outlined">
              Назад
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Продовжити
            </Button>
          </Box>
        </>
      )}
      
      {activeStep === 3 && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Підтвердження та квитанція
            </Typography>
            <Typography>
              Тут буде реалізований Етап 4: Підтвердження та квитанція
            </Typography>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={handleBack} variant="outlined">
              Назад
            </Button>
            <Button
              variant="contained"
              color="success"
            >
              Підтвердити замовлення
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}

export default function OrderWizardPage() {
  return (
    <AuthGuard>
      <OrderWizardContent />
    </AuthGuard>
  );
}
