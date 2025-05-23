'use client';

import { Box, Grid, Alert, Typography } from '@mui/material';
import React, { useEffect, useMemo, useCallback } from 'react';

import { useOrderConfirmation } from '@/domain/order';
import { useWizard } from '@/domain/wizard';
import {
  OrderConfirmationSummary,
  DigitalSignaturePad,
  LegalCheckbox,
  ReceiptActionButtons,
  StatusMessage,
  StepContainer,
  StepNavigation,
} from '@/shared/ui';

/**
 * Етап 4: Підтвердження та завершення з формуванням квитанції
 *
 * FSD принципи:
 * - "Тонкий" UI компонент без бізнес-логіки
 * - Використовує композицію shared UI компонентів
 * - Отримує дані з domain layer через useOrderConfirmation хук
 * - Мінімальна логіка координації
 *
 * Згідно з документацією Order Wizard:
 * 4.1. Перегляд замовлення з детальним розрахунком
 * 4.2. Юридичні аспекти
 * 4.3. Формування та друк квитанції
 * 4.4. Завершення процесу
 */
export const OrderConfirmationStep: React.FC = () => {
  const wizard = useWizard();

  // TODO: Отримати orderId з wizard state, поки що використовуємо темп. значення
  const orderId = 'temp-order-id';

  // Отримуємо всю функціональність Order Confirmation з domain layer
  const orderConfirmation = useOrderConfirmation(orderId);

  // Скидаємо стан при розмонтуванні компонента
  useEffect(() => {
    return () => {
      orderConfirmation.reset();
    };
  }, [orderConfirmation.reset]);

  // === COMPUTED VALUES ===

  /**
   * Підготовлені дані для OrderConfirmationSummary
   */
  const summaryData = useMemo(() => {
    if (!orderConfirmation.order) return null;

    const order = orderConfirmation.order;

    return {
      receiptNumber: order.receiptNumber,
      uniqueTag: order.tagNumber || '',
      createdDate: order.createdDate ? new Date(order.createdDate).toLocaleDateString('uk-UA') : '',
      executionDate: order.expectedCompletionDate
        ? new Date(order.expectedCompletionDate).toLocaleDateString('uk-UA')
        : '',
      clientName: order.client ? `${order.client.lastName} ${order.client.firstName}` : '',
      clientPhone: order.client?.phone || '',
      clientContactMethod: 'Телефон', // TODO: отримати з даних клієнта
      clientAddress: order.client?.address || '',
      branchName: order.branchLocation?.name || '',
      branchAddress: order.branchLocation?.address || '',
      items:
        order.items?.map((item: any) => ({
          id: item.id?.toString() || '',
          name: item.itemName || '',
          category: item.serviceCategoryName || '',
          quantity: item.quantity || 1,
          unit: item.unit || 'шт',
          material: item.material || '',
          color: item.color || '',
          basePrice: item.basePrice || 0,
          modifiers: [], // TODO: отримати модифікатори з даних предмета
          finalPrice: item.totalPrice || 0,
          stains: [], // TODO: отримати плями з даних предмета
          defects: [], // TODO: отримати дефекти з даних предмета
        })) || [],
      baseAmount:
        order.items?.reduce((sum: number, item: any) => sum + (item.basePrice || 0), 0) || 0,
      modifiersAmount: 0, // TODO: розрахувати з модифікаторів
      subtotal: order.totalAmount || 0,
      urgencySurcharge: 0, // TODO: розрахувати з expediteType
      discountType: '', // TODO: отримати з order
      discountPercent: 0, // TODO: розрахувати з discountAmount
      discountAmount: order.discountAmount || 0,
      finalTotal: order.finalAmount || 0,
      paidAmount: order.prepaymentAmount || 0,
      remainingDebt: order.balanceAmount || 0,
      paymentMethod: 'TERMINAL', // TODO: отримати з order parameters
    };
  }, [orderConfirmation.order]);

  // === EVENT HANDLERS ===

  /**
   * Обробник зміни згоди з умовами
   */
  const handleTermsChange = useCallback(
    (checked: boolean) => {
      orderConfirmation.setTermsAccepted(checked);
    },
    [orderConfirmation.setTermsAccepted]
  );

  /**
   * Обробник генерації квитанції
   */
  const handleGenerateReceipt = useCallback(async () => {
    const success = await orderConfirmation.generateReceipt(orderId);
    if (success) {
      console.log('Квитанцію згенеровано успішно');
    } else {
      console.error('Помилка генерації квитанції');
    }
  }, [orderConfirmation.generateReceipt, orderId]);

  /**
   * Обробник друку квитанції
   */
  const handlePrintReceipt = useCallback(() => {
    orderConfirmation.printReceipt();
  }, [orderConfirmation.printReceipt]);

  /**
   * Обробник завантаження PDF
   */
  const handleDownloadPdf = useCallback(async () => {
    const success = await orderConfirmation.downloadPdfReceipt(orderId);
    if (success) {
      console.log('PDF завантажено успішно');
    } else {
      console.error('Помилка завантаження PDF');
    }
  }, [orderConfirmation.downloadPdfReceipt, orderId]);

  /**
   * Обробник відправки email
   */
  const handleEmailReceipt = useCallback(async () => {
    if (!orderConfirmation.order?.client?.email) {
      console.log('Email клієнта не вказано');
      return;
    }

    const success = await orderConfirmation.emailReceipt(
      orderId,
      orderConfirmation.order.client.email
    );

    if (success) {
      console.log('Email відправлено успішно');
    } else {
      console.error('Помилка відправки email');
    }
  }, [orderConfirmation.emailReceipt, orderConfirmation.order?.client?.email, orderId]);

  /**
   * Обробник завершення замовлення
   */
  const handleCompleteOrder = useCallback(async () => {
    if (!orderConfirmation.canFinalize) {
      console.log('Неможливо завершити замовлення - не всі умови виконано');
      return;
    }

    const success = await orderConfirmation.finalizeOrder(orderId);

    if (success) {
      console.log('Замовлення завершено успішно');
      wizard.resetWizard();
    } else {
      console.error('Помилка завершення замовлення');
    }
  }, [orderConfirmation.canFinalize, orderConfirmation.finalizeOrder, orderId, wizard.resetWizard]);

  /**
   * Обробник повернення назад
   */
  const handleBack = useCallback(() => {
    const result = wizard.navigateBack();
    if (result.success) {
      console.log('Успішно повернулися до ORDER_PARAMETERS');
    } else {
      console.error('Помилка повернення:', result.errors);
    }
  }, [wizard.navigateBack]);

  // === RENDER ===

  // Помилка завантаження даних
  if (!orderConfirmation.isLoading && !orderConfirmation.order) {
    return (
      <StepContainer
        title="Підтвердження замовлення"
        subtitle="Помилка завантаження даних замовлення"
      >
        <Alert severity="error" sx={{ mb: 3 }}>
          Не вдалося завантажити дані замовлення. Перевірте з&apos;єднання та спробуйте ще раз.
        </Alert>
        <StepNavigation onBack={handleBack} backLabel="Повернутися назад" hideNextButton />
      </StepContainer>
    );
  }

  return (
    <StepContainer
      title="Підтвердження замовлення"
      subtitle="Перевірте дані та завершіть оформлення замовлення"
    >
      <Box sx={{ minHeight: '400px' }}>
        {/* Показуємо загальні помилки */}
        {orderConfirmation.hasError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={orderConfirmation.clearError}>
            {orderConfirmation.error}
          </Alert>
        )}

        {/* Показуємо лоадер під час завантаження */}
        {orderConfirmation.isLoading && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Завантаження даних замовлення...
          </Alert>
        )}

        {/* Основний вміст */}
        {summaryData && (
          <Grid container spacing={3}>
            {/* Підсумок замовлення */}
            <Grid size={{ xs: 12 }}>
              <OrderConfirmationSummary {...summaryData} />
            </Grid>

            {/* Примітки до замовлення */}
            {orderConfirmation.order?.customerNotes && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="info">
                  <Typography variant="subtitle2" gutterBottom>
                    Примітки до замовлення:
                  </Typography>
                  <Typography variant="body2">{orderConfirmation.order.customerNotes}</Typography>
                </Alert>
              </Grid>
            )}

            {/* Юридичні аспекти */}
            <Grid size={{ xs: 12, md: 6 }}>
              <LegalCheckbox
                checked={orderConfirmation.termsAccepted}
                onChange={handleTermsChange}
                disabled={orderConfirmation.isSaving || orderConfirmation.isGeneratingReceipt}
                required={true}
              />
            </Grid>

            {/* Дії з квитанцією */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ReceiptActionButtons
                isReceiptGenerated={orderConfirmation.receiptGenerated}
                isProcessing={orderConfirmation.isGeneratingReceipt}
                onGenerateReceipt={handleGenerateReceipt}
                onPrintReceipt={handlePrintReceipt}
                onDownloadPdf={handleDownloadPdf}
                onEmailReceipt={handleEmailReceipt}
                disabled={orderConfirmation.isSaving}
              />
            </Grid>

            {/* Цифровий підпис */}
            <DigitalSignaturePad
              signatureData={orderConfirmation.signatureData}
              onSignatureChange={orderConfirmation.setSignatureData}
              disabled={orderConfirmation.isSaving || orderConfirmation.isGeneratingReceipt}
              required={true}
            />
          </Grid>
        )}

        {/* Статусні повідомлення */}
        <StatusMessage
          message="Для завершення замовлення необхідно погодитися з умовами надання послуг та залишити цифровий підпис."
          severity="info"
          show={!orderConfirmation.termsAccepted && !orderConfirmation.isLoading}
        />

        <StatusMessage
          message="Замовлення готове до завершення. Натисніть 'Завершити замовлення' для фінального збереження."
          severity="success"
          show={orderConfirmation.canFinalize}
        />

        <StatusMessage
          message="Замовлення вже завершено та збережено в системі."
          severity="success"
          show={orderConfirmation.isOrderFinalized}
        />
      </Box>

      <StepNavigation
        onNext={orderConfirmation.canFinalize ? handleCompleteOrder : undefined}
        onBack={handleBack}
        nextLabel={
          orderConfirmation.isOrderFinalized ? 'Створити нове замовлення' : 'Завершити замовлення'
        }
        backLabel="Назад до параметрів"
        isNextDisabled={!orderConfirmation.canFinalize}
        nextLoading={orderConfirmation.isSaving || orderConfirmation.isGeneratingReceipt}
      />
    </StepContainer>
  );
};

export default OrderConfirmationStep;
