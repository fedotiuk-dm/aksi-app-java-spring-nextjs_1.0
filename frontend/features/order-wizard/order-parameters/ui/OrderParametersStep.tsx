'use client';

import { Box, Divider, Alert, TextField } from '@mui/material';
import React, { useMemo, useCallback } from 'react';

import { useOrderParameters } from '@/domain/order';
import { useWizard } from '@/domain/wizard';
import {
  ExecutionParametersPanel,
  PaymentParametersPanel,
  DiscountParametersPanel,
  StepContainer,
  StepNavigation,
} from '@/shared/ui';

/**
 * Головний компонент для ORDER_PARAMETERS кроку Order Wizard
 *
 * FSD принципи:
 * - "Тонкий" UI компонент без бізнес-логіки
 * - Використовує композицію shared UI organisms
 * - Отримує всі дані з domain layer через useOrderParameters хук
 * - Мінімальна логіка координації
 *
 * Згідно з документацією Order Wizard:
 * Етап 3: Загальні параметри замовлення
 * 3.1. Параметри виконання (дата, терміновість +50%/+100%)
 * 3.2. Знижки (Еверкард 10%, Соцмережі 5%, ЗСУ 10%, обмеження)
 * 3.3. Оплата (Термінал/Готівка/На рахунок, передоплата, борг)
 * 3.4. Додаткова інформація (примітки, вимоги клієнта)
 */
export const OrderParametersStep: React.FC = () => {
  // Отримуємо всю функціональність з domain layer
  const orderParameters = useOrderParameters();
  const wizard = useWizard();

  // === COMPUTED VALUES ===

  /**
   * Підготовлені дані для ExecutionParametersPanel
   */
  const executionData = useMemo(
    () => ({
      urgencyOptions: orderParameters.urgencyOptions || [],
      selectedUrgency: orderParameters.executionParams?.urgencyOption || 'STANDARD',
      executionDate: orderParameters.executionParams?.executionDate || null,
      calculatedDate: orderParameters.calculatedExecutionDate || null,
      customDeadline: orderParameters.executionParams?.customDeadline || null,
    }),
    [
      orderParameters.urgencyOptions,
      orderParameters.executionParams,
      orderParameters.calculatedExecutionDate,
    ]
  );

  /**
   * Підготовлені дані для DiscountParametersPanel
   */
  const discountData = useMemo(
    () => ({
      discountOptions: [
        { value: 'NONE', label: 'Без знижки', percentage: 0 },
        { value: 'EVERCARD', label: 'Еверкард', percentage: 10 },
        { value: 'SOCIAL_MEDIA', label: 'Соцмережі', percentage: 5 },
        { value: 'MILITARY', label: 'ЗСУ', percentage: 10 },
        { value: 'CUSTOM', label: 'Індивідуальна', percentage: 0 },
      ],
      selectedDiscount: orderParameters.discountParams?.discountType || 'NONE',
      customPercentage: orderParameters.discountParams?.discountPercentage || 0,
      hasRestrictedItems: orderParameters.discountParams?.discountExclusions?.length > 0 || false,
      restrictedItemsCount: orderParameters.discountParams?.discountExclusions?.length || 0,
    }),
    [orderParameters.discountParams]
  );

  /**
   * Підготовлені дані для PaymentParametersPanel
   */
  const paymentData = useMemo(
    () => ({
      paymentMethods: orderParameters.paymentMethods || [
        { value: 'TERMINAL', label: 'Термінал' },
        { value: 'CASH', label: 'Готівка' },
        { value: 'BANK_TRANSFER', label: 'На рахунок' },
      ],
      selectedPaymentMethod: orderParameters.paymentParams?.paymentMethod || 'TERMINAL',
      totalAmount: orderParameters.paymentParams?.totalAmount || 0,
      discountAmount: orderParameters.paymentParams?.discountAmount || 0,
      discountPercent: orderParameters.discountParams?.discountPercentage || 0,
      discountType: orderParameters.discountParams?.discountType || '',
      urgencySurcharge: 0, // TODO: розрахувати з executionParams
      urgencyPercent: orderParameters.executionParams?.isUrgent ? 50 : 0, // fallback
      finalAmount: orderParameters.paymentParams?.finalAmount || 0,
      prepaymentAmount: orderParameters.paymentParams?.prepaymentAmount || 0,
    }),
    [
      orderParameters.paymentMethods,
      orderParameters.paymentParams,
      orderParameters.discountParams,
      orderParameters.executionParams,
    ]
  );

  // === EVENT HANDLERS ===

  /**
   * Обробники для параметрів виконання
   */
  const handleUrgencyChange = useCallback(
    (value: string) => {
      orderParameters.setUrgencyOption(value as any); // Type assertion for now
    },
    [orderParameters.setUrgencyOption]
  );

  const handleExecutionDateChange = useCallback(
    (date: Date | null) => {
      orderParameters.setExecutionDate(date);
    },
    [orderParameters.setExecutionDate]
  );

  const handleCustomDeadlineChange = useCallback(
    (date: Date | null) => {
      orderParameters.setCustomDeadline?.(date);
    },
    [orderParameters.setCustomDeadline]
  );

  /**
   * Обробники для знижок
   */
  const handleDiscountChange = useCallback(
    (value: string, customPercentage?: number) => {
      orderParameters.setDiscountType?.(value as any); // Type assertion for now
      if (customPercentage !== undefined) {
        orderParameters.setDiscountPercentage?.(customPercentage);
      }
    },
    [orderParameters.setDiscountType, orderParameters.setDiscountPercentage]
  );

  /**
   * Обробники для оплати
   */
  const handlePaymentMethodChange = useCallback(
    (value: string) => {
      orderParameters.setPaymentMethod(value as any); // Type assertion for now
    },
    [orderParameters.setPaymentMethod]
  );

  const handlePrepaymentChange = useCallback(
    (amount: number) => {
      orderParameters.setPrepaymentAmount(amount);
    },
    [orderParameters.setPrepaymentAmount]
  );

  /**
   * Обробник зміни примітки
   */
  const handleNotesChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      orderParameters.setOrderNotes?.(event.target.value);
    },
    [orderParameters.setOrderNotes]
  );

  /**
   * Обробник переходу до наступного кроку (підтвердження та завершення)
   */
  const handleNext = useCallback(async () => {
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
  }, [orderParameters.validateAll, orderParameters.validationErrors, wizard.navigateForward]);

  /**
   * Обробник повернення до попереднього кроку
   */
  const handleBack = useCallback(async () => {
    console.log('Повернення до менеджера предметів');

    const result = wizard.navigateBack();
    if (result.success) {
      console.log('Успішно повернулися до ITEM_MANAGER');
    } else {
      console.error('Помилка повернення:', result.errors);
    }
  }, [wizard.navigateBack]);

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
        <ExecutionParametersPanel
          urgencyOptions={executionData.urgencyOptions}
          selectedUrgency={executionData.selectedUrgency}
          onUrgencyChange={handleUrgencyChange}
          urgencyError={orderParameters.validationErrors?.urgencyOption}
          executionDate={executionData.executionDate}
          onExecutionDateChange={handleExecutionDateChange}
          calculatedDate={executionData.calculatedDate}
          executionDateError={orderParameters.validationErrors?.executionDate}
          customDeadline={executionData.customDeadline}
          onCustomDeadlineChange={handleCustomDeadlineChange}
          customDeadlineError={orderParameters.validationErrors?.customDeadline}
          disabled={orderParameters.isLoading}
          showCustomDeadline={executionData.selectedUrgency === 'CUSTOM'}
        />

        <Divider sx={{ my: 4 }} />

        {/* 3.2. Знижки */}
        <DiscountParametersPanel
          discountOptions={discountData.discountOptions}
          selectedDiscount={discountData.selectedDiscount}
          customPercentage={discountData.customPercentage}
          onDiscountChange={handleDiscountChange}
          discountError={orderParameters.validationErrors?.discountType}
          hasRestrictedItems={discountData.hasRestrictedItems}
          restrictedItemsCount={discountData.restrictedItemsCount}
          disabled={orderParameters.isLoading}
          allowCustomDiscount={true}
        />

        <Divider sx={{ my: 4 }} />

        {/* 3.3. Оплата */}
        <PaymentParametersPanel
          paymentMethods={paymentData.paymentMethods}
          selectedPaymentMethod={paymentData.selectedPaymentMethod}
          onPaymentMethodChange={handlePaymentMethodChange}
          paymentMethodError={orderParameters.validationErrors?.paymentMethod}
          totalAmount={paymentData.totalAmount}
          discountAmount={paymentData.discountAmount}
          discountPercent={paymentData.discountPercent}
          discountType={paymentData.discountType}
          urgencySurcharge={paymentData.urgencySurcharge}
          urgencyPercent={paymentData.urgencyPercent}
          finalAmount={paymentData.finalAmount}
          prepaymentAmount={paymentData.prepaymentAmount}
          onPrepaymentChange={handlePrepaymentChange}
          prepaymentError={orderParameters.validationErrors?.prepaymentAmount}
          disabled={orderParameters.isLoading}
          enablePrepaymentSlider={true}
        />

        <Divider sx={{ my: 4 }} />

        {/* 3.4. Додаткова інформація */}
        <Box sx={{ p: 3 }}>
          <TextField
            label="Примітки до замовлення"
            multiline
            rows={4}
            value={orderParameters.additionalInfo?.orderNotes || ''}
            onChange={handleNotesChange}
            disabled={orderParameters.isLoading}
            placeholder="Додаткові вимоги клієнта, особливості виконання..."
            helperText="Вкажіть будь-які особливості або побажання клієнта щодо виконання замовлення"
            fullWidth
          />
        </Box>

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
