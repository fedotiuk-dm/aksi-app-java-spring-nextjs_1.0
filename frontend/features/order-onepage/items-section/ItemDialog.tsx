'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { Close, ArrowBack, ArrowForward } from '@mui/icons-material';
import {
  useOrderOnepageStore,
  useIsAddingItem,
  useIsEditingItem,
} from '../store/order-onepage.store';
import { ItemBasicInfoStep } from './steps/ItemBasicInfoStep';
import { ItemCharacteristicsStep } from './steps/ItemCharacteristicsStep';
import { ItemStainsDefectsStep } from './steps/ItemStainsDefectsStep';
import { ItemPriceCalculationStep } from './steps/ItemPriceCalculationStep';
import { ItemPhotoStep } from './steps/ItemPhotoStep';

const steps = [
  'Основна інформація',
  'Характеристики',
  'Забруднення та дефекти',
  'Розрахунок ціни',
  'Фотодокументація',
];

export const ItemDialog = () => {
  // Тип для даних по предмету
  interface ItemDataType {
    categoryId?: string;
    itemId?: string;
    quantity?: number;
    unit?: string;
    material?: string;
    color?: string;
    stains?: string[];
    defects?: string[];
    modifiers?: string[];
    basePrice?: number;
    totalPrice?: number;
    notes?: string;
    photos?: string[];
    // Дозволяємо додаткові поля в залежності від потреб
    [key: string]: unknown;
  }
  
  const [activeStep, setActiveStep] = useState(0);
  const [itemData, setItemData] = useState<ItemDataType>({});

  const { closeItemDialog } = useOrderOnepageStore();
  const isAdding = useIsAddingItem();
  const isEditing = useIsEditingItem();

  const handleClose = () => {
    setActiveStep(0);
    setItemData({});
    closeItemDialog();
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepData = (stepData: Partial<ItemDataType>) => {
    setItemData((prev) => ({ ...prev, ...stepData }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ItemBasicInfoStep data={itemData} onDataChange={handleStepData} onNext={handleNext} />
        );
      case 1:
        return (
          <ItemCharacteristicsStep
            data={itemData}
            onDataChange={handleStepData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <ItemStainsDefectsStep
            data={itemData}
            onDataChange={handleStepData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ItemPriceCalculationStep
            data={itemData}
            onDataChange={handleStepData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <ItemPhotoStep
            data={itemData}
            onDataChange={handleStepData}
            onBack={handleBack}
            onComplete={handleClose}
            isEditing={isEditing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: { sx: { height: '80vh', maxHeight: '800px' } }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{isAdding ? 'Додати предмет' : 'Редагувати предмет'}</Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
        {/* Stepper */}
        <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step Content */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>{renderStepContent(activeStep)}</Box>
      </DialogContent>

      {/* Navigation Buttons (показуємо тільки якщо крок не має власної навігації) */}
      {activeStep !== 0 && activeStep !== steps.length - 1 && (
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
          <Button onClick={handleBack} startIcon={<ArrowBack />} disabled={activeStep === 0}>
            Назад
          </Button>
          <Button
            onClick={handleNext}
            endIcon={<ArrowForward />}
            variant="contained"
            disabled={activeStep === steps.length - 1}
          >
            Далі
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
