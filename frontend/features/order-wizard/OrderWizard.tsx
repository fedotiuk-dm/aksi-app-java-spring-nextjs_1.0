/**
 * Головний компонент OrderWizard
 * Використовує Zustand store для управління станом і переходами 
 */
import { FC } from 'react';
import { useOrderWizardStore, selectCurrentState, selectItemWizardState } from './model/store';

// MUI компоненти
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CircularProgress from '@mui/material/CircularProgress';

// Кроки візарда
import { ClientSelectionStep } from './ui/steps/step1-client-selection';
import { BasicOrderInfoForm } from './ui/steps/step2-basic-info';
import { ItemManager } from './ui/steps/step3-item-manager';
import { ItemWizard } from './ui/steps/step4-item-wizard';
import { OrderParamsStep } from './ui/steps/step5-order-params';
import { BillingStep } from './ui/steps/step6-billing';
import { CompletionStep } from './ui/steps/step7-completion';

// Перетворення OrderItemUI на BasicItemFormValues
import { orderItemUIToFormValues } from './lib/converters';

/**
 * Головний компонент візарда замовлення
 */
export const OrderWizard: FC = () => {
  // Отримуємо стан та дії з Zustand store
  const currentState = useOrderWizardStore(selectCurrentState);
  const itemWizardState = useOrderWizardStore(selectItemWizardState);
  const isInItemWizard = useOrderWizardStore(state => state.isInItemWizard());
  const currentItem = useOrderWizardStore(state => state.currentItem);
  
  // Дії
  const { 
    goNext, 
    goBack, 
    saveItem, 
    cancelItemEdit 
  } = useOrderWizardStore();
  
  // Опис етапів
  const steps = [
    '1. Вибір клієнта',
    '2. Базова інформація',
    '3. Предмети замовлення',
    '4. Параметри замовлення',
    '5. Оплата',
    '6. Завершення'
  ];
  
  // Рендеринг ItemWizard для додавання/редагування предмета
  const renderItemWizard = () => {
    // Конвертуємо дані з OrderItemUI у BasicItemFormValues для форми
    const formValues = currentItem 
      ? orderItemUIToFormValues(currentItem)
      : undefined;
    
    return (
      <ItemWizard
        initialValues={formValues}
        onSave={(item) => saveItem(item)}
        onCancel={() => cancelItemEdit()}
      />
    );
  };
  
  // Активний індекс для степера
  const getActiveStepIndex = () => {
    switch (currentState) {
      case 'clientSelection': return 0;
      case 'basicInfo': return 1;
      case 'itemManagement': return 2;
      case 'orderParams': return 3;
      case 'billing': return 4;
      case 'complete': return 5;
      default: return 0;
    }
  };
  
  // Рендеринг контенту залежно від поточного стану
  const renderContent = () => {
    console.log('Рендеримо на основі стану:', currentState);
    
    // Пріоритет 1: Якщо ми в режимі редагування предмета
    if (isInItemWizard || itemWizardState !== 'idle') {
      return renderItemWizard();
    }
    
    // Пріоритет 2: По стану візарда
    switch (currentState) {
      case 'clientSelection':
        return <ClientSelectionStep />;
        
      case 'basicInfo':
        console.log('Рендеримо BasicOrderInfoForm');
        return <BasicOrderInfoForm onNext={goNext} onBack={goBack} />;
        
      case 'itemManagement':
        return <ItemManager onNext={goNext} onBack={goBack} />;
        
      case 'orderParams':
        return <OrderParamsStep onNext={goNext} onBack={goBack} />;
        
      case 'billing':
        return <BillingStep onNext={goNext} onBack={goBack} />;
        
      case 'complete':
        return <CompletionStep />;
        
      default:
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        );
    }
  };
  
  const content = renderContent();
  const stepperIndex = getActiveStepIndex();
  
  console.log('Активний крок для степера:', stepperIndex, 'Для стану:', currentState);
  
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
        
        {/* Діагностична інформація про стан системи (лише для розробки) */}
        <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" component="div">
            Стан Zustand: <strong>{currentState}</strong>
            {isInItemWizard && <span> | <strong>В режимі товару</strong></span>}
          </Typography>
        </Box>
        
        {content}
      </Box>
    </Container>
  );
};
