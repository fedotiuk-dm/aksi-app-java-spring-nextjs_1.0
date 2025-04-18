'use client';

import { useState } from 'react';
import { Typography, Container, Paper, Box, Stepper, Step, StepLabel, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

const steps = [
  'Інформація про клієнта',
  'Вибір предметів',
  'Параметри замовлення',
  'Підтвердження'
];

export function OrderWizard() {
  const [activeStep, setActiveStep] = useState(0);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Створення нового замовлення
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        {activeStep === steps.length ? (
          <Box>
            <Typography variant="h5" gutterBottom>
              Замовлення успішно створено!
            </Typography>
            <Typography variant="body1">
              Номер замовлення: #12345. Ви можете переглянути деталі замовлення або повернутися до списку.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="contained" href="/orders">
                Перейти до списку замовлень
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="h5" gutterBottom>
              {steps[activeStep]}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Тут буде відображатися форма для {steps[activeStep].toLowerCase()}.
              Це заглушка для демонстрації пустих сторінок.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />}
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Назад
              </Button>
              <Button 
                variant="contained" 
                endIcon={<ArrowForwardIcon />}
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? 'Завершити' : 'Далі'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
