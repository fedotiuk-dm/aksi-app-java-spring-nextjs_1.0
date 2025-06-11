'use client';

import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import React, { useState } from 'react';

import { useItemWizard } from '@/domains/wizard';

import { BasicItemInfoStep } from './substeps';

import type { BasicItemInfoData, ItemWizardData } from './substeps';
import type { WizardMode } from '@/domains/wizard';

// Підетапи візарда
const WIZARD_STEPS = [
  { id: 1, label: 'Основна інформація' },
  { id: 2, label: 'Характеристики' },
  { id: 3, label: 'Забруднення та дефекти' },
  { id: 4, label: 'Знижки та надбавки' },
  { id: 5, label: 'Фотодокументація' },
] as const;

/**
 * Підвізард для створення та редагування предметів замовлення
 *
 * Відповідальність:
 * - Поетапне додавання/редагування предметів
 * - Навігація між підетапами 2.1-2.5
 * - Управління станом візарда
 */
interface ItemWizardProps {
  mode: WizardMode;
  onComplete?: () => void;
}

export const ItemWizard: React.FC<ItemWizardProps> = ({ mode, onComplete }) => {
  const { isWizardActive, closeWizard } = useItemWizard();

  // Локальний стан для навігації по підетапах
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Стан для даних візарда
  const [wizardData, setWizardData] = useState<ItemWizardData>({
    basicInfo: {
      categoryId: '',
      itemId: '',
      quantity: 1,
      unitOfMeasure: '',
    },
  });

  // Стан для помилок валідації
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  // Якщо візард не активний, не відображаємо його
  if (!isWizardActive) {
    return null;
  }

  const handleClose = () => {
    closeWizard();
  };

  // Обробники оновлення даних кожного підетапу
  const handleBasicInfoChange = (data: Partial<BasicItemInfoData>) => {
    setWizardData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...data },
    }));
    // Очищуємо помилки після зміни
    if (errors.basicInfo) {
      setErrors((prev) => ({ ...prev, basicInfo: {} }));
    }
  };

  // Валідація поточного кроку
  const validateCurrentStep = (): boolean => {
    const stepErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!wizardData.basicInfo.categoryId) {
        stepErrors.categoryId = 'Оберіть категорію послуги';
      }
      if (!wizardData.basicInfo.itemId) {
        stepErrors.itemId = 'Оберіть найменування виробу';
      }
      if (!wizardData.basicInfo.quantity || wizardData.basicInfo.quantity <= 0) {
        stepErrors.quantity = 'Введіть коректну кількість';
      }
      setErrors((prev) => ({ ...prev, basicInfo: stepErrors }));
      return Object.keys(stepErrors).length === 0;
    }

    return true;
  };

  const handleNext = () => {
    // Очищуємо загальні помилки при переході
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: {} }));
    }

    if (validateCurrentStep() && currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // Валідуємо всі кроки перед збереженням
    if (!validateCurrentStep()) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Тут буде логіка створення предмета через API
      // Створюємо OrderItemDTO на основі wizardData
      console.log('Saving item with data:', wizardData);

      // Симуляція API виклику (замінити на реальний API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onComplete?.();
      closeWizard();
    } catch (error) {
      console.error('Error completing item wizard:', error);
      setErrors((prev) => ({
        ...prev,
        general: { save: 'Помилка збереження предмета. Спробуйте ще раз.' },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <BasicItemInfoStep
          data={wizardData.basicInfo}
          onChange={handleBasicInfoChange}
          errors={errors.basicInfo || {}}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Підетап 2.2: Характеристики предмета
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Тут буде форма для вибору матеріалу, кольору, наповнювача та ступеня зносу.
              <br />
              <strong>Матеріали:</strong> Бавовна, Шерсть, Шовк, Синтетика, Шкіра, Нубук, Замша
            </Alert>
          </CardContent>
        </Card>
      );
    }

    if (currentStep === 3) {
      return (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Підетап 2.3: Забруднення, дефекти та ризики
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Тут буде форма для вибору плям, дефектів та ризиків.
              <br />
              <strong>Плями:</strong> Жир, Кров, Білок, Вино, Кава, Трава, Чорнило, Косметика
              <br />
              <strong>Дефекти:</strong> Потертості, Порване, Відсутність фурнітури, Ризики зміни
              кольору
            </Alert>
          </CardContent>
        </Card>
      );
    }

    if (currentStep === 4) {
      return (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Підетап 2.4: Знижки та надбавки (калькулятор ціни)
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Тут буде інтерактивний калькулятор ціни з базовою ціною та модифікаторами.
              <br />
              <strong>Модифікатори:</strong> Дитячі речі (-30%), Ручна чистка (+20%), Дуже
              забруднені (+20-100%), Термінова (+50-100%)
            </Alert>
          </CardContent>
        </Card>
      );
    }

    if (currentStep === 5) {
      return (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Підетап 2.5: Фотодокументація
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Тут буде інтерфейс для завантаження фото предмета.
              <br />
              <strong>Можливості:</strong> Зйомка з камери, завантаження з галереї, до 5 фото на
              предмет, до 5MB кожне
            </Alert>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === WIZARD_STEPS.length;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Заголовок з кнопкою закриття */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          {mode === 'create' ? 'Додати новий предмет' : 'Редагувати предмет'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<CloseIcon />}
          onClick={handleClose}
          disabled={isLoading}
        >
          Закрити
        </Button>
      </Box>

      {/* Степпер */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={currentStep - 1} orientation="horizontal">
            {WIZARD_STEPS.map((step) => (
              <Step key={step.id}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Контент поточного кроку */}
      <Box sx={{ mb: 3 }}>{renderStepContent()}</Box>

      {/* Загальні помилки */}
      {errors.general?.save && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.general.save}
        </Alert>
      )}

      {/* Навігаційні кнопки */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handlePrevious}
              disabled={isFirstStep || isLoading}
            >
              Назад
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {!isLastStep && (
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  Далі
                </Button>
              )}

              {isLastStep && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleComplete}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
                >
                  {isLoading ? 'Збереження...' : 'Додати до замовлення'}
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
