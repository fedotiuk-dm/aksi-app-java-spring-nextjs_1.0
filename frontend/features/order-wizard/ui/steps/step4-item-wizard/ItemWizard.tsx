/**
 * Компонент ItemWizard - підвізард для додавання/редагування предмета замовлення
 * Послідовно проводить користувача через всі етапи створення/редагування предмета
 */
import { FC, useState } from 'react';
import { BasicItemInfoForm } from './BasicItemInfoForm';
import { ItemPropertiesForm } from './ItemPropertiesForm';
import { z } from 'zod';
import { basicItemSchema, itemPropertiesSchema } from '@/features/order-wizard/model/schema';
import { Box, Paper, Step, StepLabel, Stepper, Typography, Button } from '@mui/material';

// Типи форми, з використанням zod-схеми
type BasicItemFormValues = z.infer<typeof basicItemSchema>;
type ItemPropertiesFormValues = z.infer<typeof itemPropertiesSchema>;

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
  const [formData, setFormData] = useState<Partial<BasicItemFormValues & ItemPropertiesFormValues>>(initialValues || {});
  
  // Стан завантаження під час збереження
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Функція для переходу до наступного кроку
  const handleNext = () => {
    const canMoveNext = validateCurrentStep();
    if (canMoveNext) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Функція для валідації поточного кроку перед переходом
  const validateCurrentStep = (): boolean => {
    // Перевіряємо, чи заповнені необхідні поля на поточному кроці
    switch(activeStep) {
      // Базова інформація - перевіряємо, чи вибрані категорія та послуга
      case 0:
        return !!(formData.categoryId && formData.priceListItemId);
      
      // Інші кроки поки не потребують додаткової валідації
      default:
        return true;
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // Обробники відправки форм різних етапів
  const handleBasicInfoSubmit = (values: BasicItemFormValues) => {
    // Зберігаємо дані з форми
    setFormData({ ...formData, ...values });
    
    // Якщо вибрано категорію та послугу, переходимо до наступного кроку
    if (values.categoryId && values.priceListItemId) {
      handleNext();
    } else {
      console.warn('Потрібно вибрати категорію та послугу перед переходом до наступного кроку');
    }
  };
  
  // Обробник для збереження даних з другого кроку (характеристики)
  const handlePropertiesSubmit = (values: ItemPropertiesFormValues) => {
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
      case 0: // Базова інформація
        return (
          <BasicItemInfoForm
            initialValues={formData}
            onSubmit={handleBasicInfoSubmit}
            isSubmitting={isSubmitting}
          />
        );
        
      case 1: // Характеристики предмета
        return (
          <ItemPropertiesForm
            initialValues={formData}
            onSubmit={handlePropertiesSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            categoryId={formData.categoryId || ''}
          />
        );
        
      case 2: // dirt (забруднення)
      case 3: // pricing (ціноутворення)
      case 4: // summary (фотодокументація)
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
              <Button variant="outlined" onClick={handleBack}>Назад</Button>
              <Button variant="contained" onClick={handleNext}>Продовжити</Button>
              <Button color="error" variant="outlined" onClick={onCancel}>Скасувати</Button>
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
              
              {/* Додаємо відображення характеристик предмета */}
              {formData.materialType && (
                <Typography>Матеріал: {formData.materialType}</Typography>
              )}
              {formData.color && (
                <Typography>Колір: {formData.color === 'custom' ? formData.customColor : formData.color}</Typography>
              )}
              {formData.wearDegree && (
                <Typography>Ступінь зносу: {formData.wearDegree}%</Typography>
              )}
              {formData.filling && (
                <Typography>Наповнювач: {formData.filling} {formData.isFillingFlattened ? '(збитий)' : ''}</Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button variant="outlined" onClick={handleBack}>Назад</Button>
              <Button variant="contained" color="primary" onClick={handleFinalSubmit}>Зберегти предмет</Button>
              <Button variant="outlined" color="error" onClick={onCancel}>Скасувати</Button>
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
