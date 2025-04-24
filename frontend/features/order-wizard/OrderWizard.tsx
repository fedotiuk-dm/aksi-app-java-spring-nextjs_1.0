import { FC, useState } from 'react';
import { useOrderWizardMachine } from './hooks/state';

// Використовуємо імпорти через індексні файли згідно з Feature-Sliced Design
import { ClientSelectionStep } from './ui/steps/step1-client-selection';
import { BasicOrderInfoForm } from './ui/steps/step2-basic-info';
import { ItemManager } from './ui/steps/step3-item-manager';

// MUI компоненти
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Головний компонент Order Wizard
 * 
 * Відповідає за відображення інтерфейсу для оформлення замовлень у хімчистці
 * з інтегрованою системою розрахунку цін, управлінням клієнтами
 * та формуванням квитанцій.
 */
// Визначаємо типи станів візарда
type WizardStep = 'clientSelection' | 'basicInfo' | 'itemManagement' | 'orderParams' | 'billing' | 'complete';

export const OrderWizard: FC = () => {
  // Використовуємо React useState для керування етапами візарда
  const [activeStep, setActiveStep] = useState<WizardStep>('clientSelection');
  
  // Використання XState машини станів для бізнес-логіки
  const orderWizard = useOrderWizardMachine();
  console.log('Поточний стан XState:', orderWizard.currentState);
  console.log('Поточний активний крок React:', activeStep);
  
  // Опис етапів візарда
  const steps = [
    '1. Вибір клієнта',
    '2. Базова інформація',
    '3. Предмети замовлення',
    '4. Параметри замовлення',
    '5. Оплата',
    '6. Завершення',
  ];
  
  // Визначення активного етапу для степера
  const getActiveStepIndex = () => {
    switch (activeStep) {
      case 'clientSelection':
        return 0;
      case 'basicInfo':
        return 1;
      case 'itemManagement':
        return 2;
      case 'orderParams':
        return 3;
      case 'billing':
        return 4;
      case 'complete':
        return 5;
      default:
        return 0;
    }
  };
  
  // Функція для переходу до наступного кроку
  const goToNextStep = () => {
    console.log('Переходимо до наступного кроку від:', activeStep);
    
    switch (activeStep) {
      case 'clientSelection':
        setActiveStep('basicInfo');
        break;
      case 'basicInfo':
        setActiveStep('itemManagement');
        break;
      case 'itemManagement':
        setActiveStep('orderParams');
        break;
      case 'orderParams':
        setActiveStep('billing');
        break;
      case 'billing':
        setActiveStep('complete');
        break;
    }
  };
  
  // Функція для повернення до попереднього кроку
  const goToPreviousStep = () => {
    console.log('Повертаємось до попереднього кроку від:', activeStep);
    
    switch (activeStep) {
      case 'basicInfo':
        setActiveStep('clientSelection');
        break;
      case 'itemManagement':
        setActiveStep('basicInfo');
        break;
      case 'orderParams':
        setActiveStep('itemManagement');
        break;
      case 'billing':
        setActiveStep('orderParams');
        break;
      case 'complete':
        setActiveStep('billing');
        break;
    }
  };

  // Відображення відповідного компонента в залежності від поточного стану
  const renderContent = () => {
    console.log('Рендеримо компонент для кроку:', activeStep);
    
    switch (activeStep) {
      case 'clientSelection':
        return <ClientSelectionStep onClientSelect={() => goToNextStep()} />;
      case 'basicInfo':
        console.log('Рендеримо BasicOrderInfoForm');
        return (
          <BasicOrderInfoForm 
            onNext={goToNextStep} 
            onBack={goToPreviousStep} 
          />
        );
      case 'itemManagement':
        return (
          <ItemManager
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 'orderParams':
      case 'billing':
      case 'complete':
        return (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Етап в розробці</Typography>
            <Typography variant="body2" color="text.secondary">
              Цей етап буде реалізовано в наступних версіях...
            </Typography>
          </Paper>
        );
      default:
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        );
    }
  };

  // Рендеримо відповідний компонент
  const content = renderContent();
  const stepperIndex = getActiveStepIndex();
  
  console.log('Активний крок для степера:', stepperIndex, 'Для стану:', activeStep);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Візард створення замовлення
        </Typography>
        
        <Stepper activeStep={stepperIndex} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Завжди показуємо поточний стан для діагностики */}
        <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption">Поточний крок візарда: <strong>{activeStep}</strong></Typography>
        </Box>
        
        {content}
      </Box>
    </Container>
  );
};
