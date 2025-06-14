'use client';

import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  LinearProgress,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import React from 'react';

// Доменна логіка
import {
  useSubstep1ItemBasicInfo,
  SUBSTEP1_UI_STEPS,
  type ServiceCategory,
  type PriceListItem,
  type Substep1UIStep,
} from '@/domains/wizard/stage2/substep1';
import { useStage2Workflow } from '@/domains/wizard/stage2/workflow';

// Локальні компоненти кроків (тільки UI)
import {
  ServiceCategorySelectionStep,
  ItemSelectionStep,
  QuantityEntryStep,
  ValidationStep,
} from './components';

interface Substep1ContainerProps {
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
}

// Конфігурація кроків
const STEPS = [
  { key: SUBSTEP1_UI_STEPS.CATEGORY_SELECTION, label: 'Категорія послуги' },
  { key: SUBSTEP1_UI_STEPS.ITEM_SELECTION, label: 'Предмет з прайсу' },
  { key: SUBSTEP1_UI_STEPS.QUANTITY_ENTRY, label: 'Кількість' },
  { key: SUBSTEP1_UI_STEPS.VALIDATION, label: 'Підтвердження' },
] as const;

export const Substep1Container: React.FC<Substep1ContainerProps> = ({
  onNext,
  onPrevious,
  onComplete,
}) => {
  // ========== ДОМЕННА ЛОГІКА ==========
  const substep = useSubstep1ItemBasicInfo();
  const workflow = useStage2Workflow();

  // ========== ПОТОЧНИЙ КРОК ==========
  const currentStepIndex = STEPS.findIndex((step) => step.key === substep.ui.currentStep);

  // ========== ОБРОБНИКИ НАВІГАЦІЇ ==========
  const handleNext = async () => {
    if (substep.computed.isLastStep && substep.computed.isReadyToComplete) {
      try {
        await substep.mutations.validateAndComplete.mutateAsync({
          sessionId: substep.ui.sessionId || '',
        });
        onComplete();
      } catch (error) {
        console.error('Помилка завершення підетапу:', error);
      }
    } else if (substep.computed.canGoToNextStep) {
      const nextStep = substep.computed.nextStep;
      if (nextStep) {
        substep.ui.setCurrentStep(nextStep);
      }
    }
  };

  const handlePrevious = () => {
    if (substep.computed.isFirstStep) {
      onPrevious();
    } else {
      const previousStep = substep.computed.previousStep;
      if (previousStep) {
        substep.ui.setCurrentStep(previousStep);
      }
    }
  };

  const handleStepClick = (stepKey: string) => {
    const targetIndex = STEPS.findIndex((step) => step.key === stepKey);
    if (
      targetIndex <= currentStepIndex &&
      Object.values(SUBSTEP1_UI_STEPS).includes(stepKey as Substep1UIStep)
    ) {
      substep.ui.setCurrentStep(stepKey as Substep1UIStep);
    }
  };

  // ========== ОБРОБНИКИ КРОКІВ ==========
  const handleCategorySelect = async (categoryId: string) => {
    substep.ui.setSelectedCategoryId(categoryId);
    try {
      await substep.mutations.selectServiceCategory.mutateAsync({
        sessionId: substep.ui.sessionId || '',
        params: { categoryId },
      });
      setTimeout(() => handleNext(), 300);
    } catch (error) {
      console.error('Помилка при виборі категорії:', error);
    }
  };

  const handleItemSelect = async (itemId: string) => {
    substep.ui.setSelectedItemId(itemId);
    try {
      await substep.mutations.selectPriceListItem.mutateAsync({
        sessionId: substep.ui.sessionId || '',
        params: { itemId },
      });
      setTimeout(() => handleNext(), 300);
    } catch (error) {
      console.error('Помилка при виборі предмета:', error);
    }
  };

  const handleQuantitySubmit = async (quantity: number) => {
    substep.ui.setQuantity(quantity);
    try {
      await substep.mutations.enterQuantity.mutateAsync({
        sessionId: substep.ui.sessionId || '',
        params: { quantity },
      });
      setTimeout(() => handleNext(), 300);
    } catch (error) {
      console.error('Помилка при введенні кількості:', error);
    }
  };

  // ========== РЕНДЕР КРОКІВ ==========
  const renderCurrentStep = () => {
    const commonProps = {
      loading: substep.loading.isAnyLoading,
      onNext: handleNext,
      onPrevious: handlePrevious,
    };

    switch (substep.ui.currentStep) {
      case SUBSTEP1_UI_STEPS.CATEGORY_SELECTION:
        return (
          <ServiceCategorySelectionStep
            {...commonProps}
            categories={substep.data.serviceCategories || []}
            selectedCategoryId={substep.ui.selectedCategoryId}
            onCategorySelect={handleCategorySelect}
            searchTerm={substep.ui.searchTerm}
            onSearchChange={substep.ui.setSearchTerm}
          />
        );

      case SUBSTEP1_UI_STEPS.ITEM_SELECTION:
        return (
          <ItemSelectionStep
            {...commonProps}
            items={substep.data.itemsForCategory || []}
            selectedItemId={substep.ui.selectedItemId}
            selectedCategory={substep.data.serviceCategories?.find(
              (c) => c.id === substep.ui.selectedCategoryId
            )}
            onItemSelect={handleItemSelect}
            searchTerm={substep.ui.searchTerm}
            onSearchChange={substep.ui.setSearchTerm}
          />
        );

      case SUBSTEP1_UI_STEPS.QUANTITY_ENTRY:
        return (
          <QuantityEntryStep
            {...commonProps}
            selectedItem={substep.data.itemsForCategory?.find(
              (item) => item.id === substep.ui.selectedItemId
            )}
            quantity={substep.ui.quantity}
            onQuantitySubmit={handleQuantitySubmit}
          />
        );

      case SUBSTEP1_UI_STEPS.VALIDATION:
        return (
          <ValidationStep
            {...commonProps}
            selectedCategory={substep.data.serviceCategories?.find(
              (c) => c.id === substep.ui.selectedCategoryId
            )}
            selectedItem={substep.data.itemsForCategory?.find(
              (item) => item.id === substep.ui.selectedItemId
            )}
            quantity={substep.ui.quantity}
            totalPrice={
              substep.data.itemsForCategory?.find((item) => item.id === substep.ui.selectedItemId)
                ?.basePrice || 0
            }
          />
        );

      default:
        return <Alert severity="error">Невідомий крок: {substep.ui.currentStep}</Alert>;
    }
  };

  // ========== RENDER ==========
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Заголовок */}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Основна інформація про предмет
      </Typography>

      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Крок {currentStepIndex + 1} з {STEPS.length}: {STEPS[currentStepIndex]?.label}
      </Typography>

      {/* Прогрес-бар */}
      <Box sx={{ mb: 4 }}>
        <LinearProgress
          variant="determinate"
          value={substep.computed.progressPercentage}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Прогрес: {substep.computed.progressPercentage}%
        </Typography>
      </Box>

      {/* Степпер */}
      <Stepper activeStep={currentStepIndex} sx={{ mb: 4 }}>
        {STEPS.map((step, index) => (
          <Step key={step.key} completed={index < currentStepIndex}>
            <StepLabel
              sx={{
                cursor: index <= currentStepIndex ? 'pointer' : 'default',
                opacity: index <= currentStepIndex ? 1 : 0.6,
              }}
              onClick={() => handleStepClick(step.key)}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Поточний крок */}
      <Paper sx={{ p: 4, mb: 4, minHeight: 400 }}>{renderCurrentStep()}</Paper>

      {/* Навігація */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handlePrevious}
          disabled={substep.loading.isAnyLoading}
        >
          {substep.computed.isFirstStep ? 'До попереднього етапу' : 'Попередній крок'}
        </Button>

        <Typography variant="body2" color="text.secondary">
          Крок {currentStepIndex + 1} з {STEPS.length}
        </Typography>

        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          disabled={!substep.computed.canGoToNextStep || substep.loading.isAnyLoading}
        >
          {substep.computed.isLastStep ? 'Завершити підетап' : 'Наступний крок'}
        </Button>
      </Box>

      {/* Статус workflow */}
      {workflow.loading.isAnyLoading && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Обробка запиту...
        </Alert>
      )}
    </Box>
  );
};
