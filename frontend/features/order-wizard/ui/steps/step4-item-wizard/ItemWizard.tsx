/**
 * Компонент ItemWizard - підвізард для додавання/редагування предмета замовлення
 * Послідовно проводить користувача через всі етапи створення/редагування предмета
 */
import { FC, useState } from 'react';
import { BasicItemInfoForm } from './BasicItemInfoForm';
import { z } from 'zod';
import { basicItemSchema } from '@/features/order-wizard/model/schema';
import { Box, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';

// Типи форми, з використанням zod-схеми
type BasicItemFormValues = z.infer<typeof basicItemSchema>;

export interface ItemWizardProps {
  // Початкові значення для форми (при редагуванні)
  initialValues?: Partial<BasicItemFormValues>; 
  // Callback для збереження предмета
  onSave: (itemData: Partial<BasicItemFormValues>) => void; 
  // Callback для скасування
  onCancel: () => void; 
}

// Кроки підвізарда предметів
const ITEM_WIZARD_STEPS = [
  {
    id: 'basic-info',
    label: 'Основна інформація',
    description: 'Основна інформація про предмет',
  },
  {
    id: 'properties',
    label: 'Характеристики',
    description: 'Матеріал, колір та інші властивості',
  },
  {
    id: 'dirt',
    label: 'Забруднення',
    description: 'Забруднення, дефекти та ризики',
  },
  {
    id: 'pricing',
    label: 'Калькулятор ціни',
    description: 'Знижки та надбавки (калькулятор ціни)',
  },
  {
    id: 'summary',
    label: 'Фотодокументація',
    description: 'Завантаження, анотування та галерея фото',
  },
  {
    id: 'final',
    label: 'Підсумок',
    description: 'Підсумок інформації про предмет',
  },
];

/**
 * Підвізард предметів - SequentialWizard для покрокового додавання предмета
 */
export const ItemWizard: FC<ItemWizardProps> = ({
  initialValues,
  onSave,
  onCancel,
}) => {
  // Стан для відстеження поточного кроку підвізарда
  const [activeStep, setActiveStep] = useState(0);
  
  // Стан для зберігання даних з форм
  const [formData, setFormData] = useState<Partial<BasicItemFormValues>>(initialValues || {});
  
  // Стан завантаження під час збереження
  const [isSubmitting, setIsSubmitting] = useState(false);
  


  // Обробники навігації між кроками
  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, ITEM_WIZARD_STEPS.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // Обробник для збереження даних з першого кроку (базова інформація)
  const handleBasicInfoSubmit = (values: BasicItemFormValues) => {
    // Зберігаємо дані з форми
    setFormData((prev) => ({
      ...prev,
      ...values,
    }));
    
    // Переходимо до наступного кроку
    handleNext();
  };
  
  // Обробник відправки форми на останньому кроці
  const handleFinalSubmit = () => {
    // Задаємо стан "відправляється" під час збереження
    setIsSubmitting(true);
    
    // Зберігаємо всі накопичені дані
    onSave(formData);
    
    // Скидаємо стан після збереження
    setIsSubmitting(false);
  };

  // Функція для відображення поточного кроку підвізарда
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <BasicItemInfoForm
            initialValues={formData}
            onSubmit={handleBasicInfoSubmit}
            isSubmitting={isSubmitting}
          />
        );
      case 1: // properties
      case 2: // dirt
      case 3: // pricing
      case 4: // summary
        // Тимчасове рішення для проміжних кроків: відображаємо заглушку
        return (
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {ITEM_WIZARD_STEPS[activeStep].label}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Цей крок буде реалізовано на наступних етапах розробки
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <button onClick={handleBack}>Назад</button>
              <button onClick={handleNext}>Продовжити</button>
              <button onClick={onCancel}>Скасувати</button>
            </Box>
          </Paper>
        );
        
      case 5: // final - останній крок
        return (
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {ITEM_WIZARD_STEPS[activeStep].label}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Підсумок інформації про предмет
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Зібрана інформація:</Typography>
              <Typography>Назва: {formData.name}</Typography>
              <Typography>Категорія: {formData.categoryId}</Typography>
              <Typography>Кількість: {formData.quantity}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <button onClick={handleBack}>Назад</button>
              <button onClick={handleFinalSubmit}>Зберегти предмет</button>
              <button onClick={onCancel}>Скасувати</button>
            </Box>
          </Paper>
        );
      default:
        return <Typography>Крок не знайдено</Typography>;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
        {initialValues ? 'Редагування предмета' : 'Додавання нового предмета'}
      </Typography>
      
      <Typography variant="subtitle2" color="text.secondary" align="center" sx={{ mb: 2 }}>
        Реалізовано: Етап 1 - Основна інформація про предмет
      </Typography>

      {/* Stepper для відображення прогресу */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {ITEM_WIZARD_STEPS.map((step, index) => (
          <Step key={step.id}>
            <StepLabel 
              error={index === 0 ? false : activeStep === index}
              optional={index === 0 ? <Typography variant="caption" color="success.main">Реалізовано</Typography> : undefined}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Поточний крок */}
      <Box>
        {renderStep()}
      </Box>
    </Paper>
  );
};
