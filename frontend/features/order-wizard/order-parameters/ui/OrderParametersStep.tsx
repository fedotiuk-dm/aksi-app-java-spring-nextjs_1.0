'use client';

import { Box, Divider, Alert } from '@mui/material';
import React from 'react';

import { useOrderParameters } from '@/domain/order';
import { useWizard } from '@/domain/wizard';

import {
  ExecutionParameters,
  DiscountParameters,
  PaymentParameters,
  AdditionalInfo,
} from './components';
import { StepContainer } from '../../shared/ui/step-container';
import { StepNavigation } from '../../shared/ui/step-navigation';

/**
 * Головний компонент для ORDER_PARAMETERS кроку Order Wizard
 *
 * FSD принципи:
 * - Тільки UI логіка (презентаційний компонент)
 * - Отримує всі дані з domain хуків
 * - Мінімальний локальний стан
 * - Композиція спеціалізованих UI компонентів
 *
 * Згідно з документацією Order Wizard:
 * Етап 3: Загальні параметри замовлення
 * 3.1. Параметри виконання (дата, терміновість +50%/+100%)
 * 3.2. Знижки (Еверкард 10%, Соцмережі 5%, ЗСУ 10%, обмеження)
 * 3.3. Оплата (Термінал/Готівка/На рахунок, передоплата, борг)
 * 3.4. Додаткова інформація (примітки, вимоги клієнта)
 */

/**
 * Головний компонент для ORDER_PARAMETERS кроку Order Wizard
 */
export const OrderParametersStep: React.FC = () => {
  // Отримуємо всю функціональність з domain layer
  const orderParameters = useOrderParameters();
  const wizard = useWizard();

  // Логування для діагностики
  console.log('OrderParametersStep render:', {
    currentStep: wizard.currentStep,
    isValid: orderParameters.isValid,
    canSave: orderParameters.canSave,
    hasErrors: Object.keys(orderParameters.validationErrors).length > 0,
  });

  /**
   * Обробник переходу до наступного кроку (підтвердження та завершення)
   */
  const handleNext = async () => {
    console.log('Валідація параметрів замовлення...');

    // Валідуємо всі параметри
    const isValid = orderParameters.validateAll();

    if (!isValid) {
      console.log('Параметри містять помилки:', orderParameters.validationErrors);
      return;
    }

    console.log('Перехід до підтвердження та завершення');
    const result = wizard.navigateForward();
    if (result.success) {
      console.log('Успішно перейшли до ORDER_CONFIRMATION');
    } else {
      console.error('Помилка переходу:', result.errors);
    }
  };

  /**
   * Обробник повернення до попереднього кроку
   */
  const handleBack = async () => {
    console.log('Повернення до менеджера предметів');

    const result = wizard.navigateBack();
    if (result.success) {
      console.log('Успішно повернулися до ITEM_MANAGER');
    } else {
      console.error('Помилка повернення:', result.errors);
    }
  };

  /**
   * Перевірка чи можна перейти до наступного кроку
   */
  const canProceed = orderParameters.isValid && !orderParameters.isLoading;

  return (
    <StepContainer
      title="Параметри замовлення"
      subtitle="Налаштуйте терміни виконання, знижки, спосіб оплати та додайте примітки"
    >
      <Box sx={{ minHeight: '400px' }}>
        {/* Показуємо загальні помилки */}
        {orderParameters.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {orderParameters.error}
          </Alert>
        )}

        {/* 3.1. Параметри виконання */}
        <ExecutionParameters disabled={orderParameters.isLoading} />

        <Divider sx={{ my: 4 }} />

        {/* 3.2. Знижки */}
        <DiscountParameters disabled={orderParameters.isLoading} />

        <Divider sx={{ my: 4 }} />

        {/* 3.3. Оплата */}
        <PaymentParameters disabled={orderParameters.isLoading} />

        <Divider sx={{ my: 4 }} />

        {/* 3.4. Додаткова інформація */}
        <AdditionalInfo disabled={orderParameters.isLoading} />

        {/* Інформація про валідацію */}
        {!orderParameters.isValid && Object.keys(orderParameters.validationErrors).length > 0 && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            Будь ласка, виправте помилки валідації перед переходом до наступного кроку
          </Alert>
        )}
      </Box>

      <StepNavigation
        onNext={handleNext}
        onBack={handleBack}
        nextLabel="Перейти до підтвердження"
        backLabel="Назад до предметів"
        isNextDisabled={!canProceed}
        nextLoading={orderParameters.isLoading || orderParameters.isSaving}
      />
    </StepContainer>
  );
};

export default OrderParametersStep;
