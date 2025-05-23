'use client';

import { Box } from '@mui/material';
import React from 'react';

import { useWizard, WizardStep } from '@/domain/wizard';
import { StepContainer } from '@/shared/ui';

import { ItemWizardHeader, ItemWizardNavigation, ItemWizardContent } from './components';

/**
 * Головний компонент для підвізарда предметів (Item Wizard)
 *
 * FSD принципи:
 * - Тільки координація між UI компонентами
 * - Отримує всі дані з domain хуків
 * - Використовує композицію менших компонентів
 * - Мінімальна логіка відображення
 *
 * Згідно з документацією Order Wizard:
 * Етап 2: Менеджер предметів (циклічний процес)
 * Підкроки:
 * - 2.1: Основна інформація про предмет (ITEM_BASIC_INFO)
 * - 2.2: Характеристики предмета (ITEM_PROPERTIES)
 * - 2.3: Забруднення, дефекти та ризики (DEFECTS_STAINS)
 * - 2.4: Знижки та надбавки (PRICE_CALCULATOR)
 * - 2.5: Фотодокументація (PHOTO_DOCUMENTATION)
 */
export const ItemWizardStep: React.FC = () => {
  // Отримуємо всю логіку з domain layer
  const wizard = useWizard();

  // Конфігурація підкроків Item Wizard
  const itemWizardSteps = [
    WizardStep.ITEM_BASIC_INFO,
    WizardStep.ITEM_PROPERTIES,
    WizardStep.DEFECTS_STAINS,
    WizardStep.PRICE_CALCULATOR,
    WizardStep.PHOTO_DOCUMENTATION,
  ];

  // Обчислюємо поточний стан навігації
  const currentStepIndex = itemWizardSteps.findIndex((step) => step === wizard.currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === itemWizardSteps.length - 1;
  const isValidStepIndex = currentStepIndex !== -1;

  /**
   * Обробник переходу до наступного підкроку
   */
  const handleNext = () => {
    if (isLastStep) {
      // Останній крок - завершуємо підвізард зі збереженням
      const result = wizard.finishItemWizardFlow(true);
      if (!result.success) {
        console.error('Помилка завершення item wizard:', result.error);
      }
    } else {
      // Переходимо до наступного підкроку
      const result = wizard.navigateForward();
      if (!result.success) {
        console.error('Помилка переходу:', result.errors);
      }
    }
  };

  /**
   * Обробник повернення до попереднього підкроку
   */
  const handleBack = () => {
    if (isFirstStep) {
      // Перший крок - скасовуємо підвізард без збереження
      const result = wizard.finishItemWizardFlow(false);
      if (!result.success) {
        console.error('Помилка скасування item wizard:', result.error);
      }
    } else {
      // Повертаємося до попереднього підкроку
      const result = wizard.navigateBack();
      if (!result.success) {
        console.error('Помилка повернення:', result.errors);
      }
    }
  };

  /**
   * Обробник швидкого скасування підвізарда
   */
  const handleCancel = () => {
    const result = wizard.finishItemWizardFlow(false);
    if (!result.success) {
      console.error('Помилка скасування item wizard:', result.error);
    }
  };

  // Якщо підвізард не активний, не відображаємо компонент
  if (!wizard.isItemWizardActive) {
    return null;
  }

  // Якщо поточний крок не належить до item wizard кроків
  if (!isValidStepIndex) {
    return (
      <StepContainer title="Помилка підвізарда" subtitle="Невідомий крок підвізарда предметів">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Box>Поточний крок не відноситься до підвізарда предметів: {wizard.currentStep}</Box>
        </Box>
      </StepContainer>
    );
  }

  // Конфігурація для компонентів
  const navigationConfig = {
    isFirstStep,
    isLastStep,
    isNextDisabled: false, // TODO: додати логіку валідації з domain layer
    nextLoading: false, // TODO: додати логіку завантаження з domain layer
    onNext: handleNext,
    onBack: handleBack,
    onCancel: handleCancel,
  };

  const headerConfig = {
    currentStep: wizard.currentStep,
    currentStepIndex,
    totalSteps: itemWizardSteps.length,
  };

  return (
    <StepContainer
      title="Підвізард предметів"
      subtitle="Налаштування параметрів предмета замовлення"
    >
      {/* Заголовок з прогресом */}
      <ItemWizardHeader {...headerConfig} />

      {/* Контент поточного підкроку */}
      <ItemWizardContent currentStep={wizard.currentStep} />

      {/* Навігація */}
      <ItemWizardNavigation {...navigationConfig} />
    </StepContainer>
  );
};

export default ItemWizardStep;
