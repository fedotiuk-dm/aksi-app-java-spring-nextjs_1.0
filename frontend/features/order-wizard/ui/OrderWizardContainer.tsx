'use client';

import { Box, Paper, Container } from '@mui/material';

import { useWizardNavigation, useWizardProgress, WizardStep } from '@/domain/wizard';

import { WizardNavigation } from './shared/WizardNavigation';
import { WizardProgress } from './shared/WizardProgress';
import { BranchSelectionStep } from './stage-1/BranchSelectionStep';
import { ClientSelectionStep } from './stage-1/ClientSelectionStep';

/**
 * Головний контейнер для Order Wizard
 * "Тонкий" UI компонент згідно FSD, вся логіка в domain хуках
 */
export const OrderWizardContainer = () => {
  const { currentStep } = useWizardNavigation();
  const { progress, statistics } = useWizardProgress();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case WizardStep.CLIENT_SELECTION:
        return <ClientSelectionStep />;

      case WizardStep.BRANCH_SELECTION:
        return <BranchSelectionStep />;

      case WizardStep.ITEM_MANAGER:
        return <Box sx={{ p: 3 }}>Етап управління предметами (буде реалізовано)</Box>;

      case WizardStep.ORDER_PARAMETERS:
        return <Box sx={{ p: 3 }}>Етап параметрів замовлення (буде реалізовано)</Box>;

      case WizardStep.CONFIRMATION:
        return <Box sx={{ p: 3 }}>Етап підтвердження (буде реалізовано)</Box>;

      case WizardStep.COMPLETED:
        return <Box sx={{ p: 3 }}>Замовлення завершено!</Box>;

      default:
        return <Box sx={{ p: 3 }}>Невідомий крок</Box>;
    }
  };

  // Визначаємо поточний етап на основі кроку
  const getCurrentStage = () => {
    switch (currentStep) {
      case WizardStep.CLIENT_SELECTION:
      case WizardStep.BRANCH_SELECTION:
        return 1;
      case WizardStep.ITEM_MANAGER:
        return 2;
      case WizardStep.ORDER_PARAMETERS:
        return 3;
      case WizardStep.CONFIRMATION:
        return 4;
      default:
        return 1;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Paper elevation={3} sx={{ minHeight: '80vh' }}>
        {/* Прогрес бар */}
        <WizardProgress
          currentStage={getCurrentStage()}
          totalStages={4}
          progress={progress.percent}
          currentStep={currentStep}
        />

        {/* Основний контент етапу */}
        <Box sx={{ p: 3 }}>{renderCurrentStep()}</Box>

        {/* Навігація */}
        <WizardNavigation />
      </Paper>
    </Container>
  );
};
