'use client';

import { Box, Grid, Alert } from '@mui/material';
import React, { useEffect } from 'react';

import { useOrderConfirmation } from '@/domain/order';
import { useWizard } from '@/domain/wizard';

import {
  OrderSummaryInfo,
  ItemsTable,
  FinancialSummary,
  OrderNotes,
  LegalAgreement,
  ReceiptActions,
  DigitalSignature,
} from './components';
import { StepContainer } from '../../shared/ui/step-container';
import { StepNavigation } from '../../shared/ui/step-navigation';

/**
 * Етап 4: Підтвердження та завершення з формуванням квитанції
 *
 * FSD принципи:
 * - Використовує композицію малих UI компонентів
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

  // Логування для діагностики
  console.log('OrderConfirmationStep render:', {
    currentStep: wizard.currentStep,
    orderId,
    hasOrder: !!orderConfirmation.order,
    isOrderFinalized: orderConfirmation.isOrderFinalized,
    termsAccepted: orderConfirmation.termsAccepted,
    receiptGenerated: orderConfirmation.receiptGenerated,
    canFinalize: orderConfirmation.canFinalize,
    isLoading: orderConfirmation.isLoading,
    hasError: orderConfirmation.hasError,
  });

  // Скидаємо стан при розмонтуванні компонента
  useEffect(() => {
    return () => {
      orderConfirmation.reset();
    };
  }, [orderConfirmation.reset]);

  /**
   * Обробники подій
   */
  const handleTermsChange = (checked: boolean) => {
    orderConfirmation.setTermsAccepted(checked);
  };

  const handleGenerateReceipt = async () => {
    console.log('Генерація квитанції для замовлення:', orderId);
    const success = await orderConfirmation.generateReceipt(orderId);

    if (success) {
      console.log('Квитанцію згенеровано успішно');
    } else {
      console.error('Помилка генерації квитанції');
    }
  };

  const handlePrintReceipt = () => {
    console.log('Друк квитанції');
    orderConfirmation.printReceipt();
  };

  const handleDownloadPdf = async () => {
    console.log('Завантаження PDF квитанції');
    const success = await orderConfirmation.downloadPdfReceipt(orderId);

    if (success) {
      console.log('PDF завантажено успішно');
    } else {
      console.error('Помилка завантаження PDF');
    }
  };

  const handleEmailReceipt = async () => {
    if (!orderConfirmation.order?.client?.email) {
      console.log('Email клієнта не вказано');
      return;
    }

    console.log('Відправка квитанції на email:', orderConfirmation.order.client.email);
    const success = await orderConfirmation.emailReceipt(
      orderId,
      orderConfirmation.order.client.email
    );

    if (success) {
      console.log('Email відправлено успішно');
    } else {
      console.error('Помилка відправки email');
    }
  };

  /**
   * Навігація
   */
  const handleCompleteOrder = async () => {
    if (!orderConfirmation.canFinalize) {
      console.log('Неможливо завершити замовлення - не всі умови виконано');
      return;
    }

    console.log('Завершення оформлення замовлення');
    const success = await orderConfirmation.finalizeOrder(orderId);

    if (success) {
      console.log('Замовлення завершено успішно');
      // Переходимо до початку для нового замовлення
      wizard.resetWizard();
    } else {
      console.error('Помилка завершення замовлення');
    }
  };

  const handleBack = async () => {
    console.log('Повернення до ORDER_PARAMETERS');
    const result = wizard.navigateBack();
    if (result.success) {
      console.log('Успішно повернулися до ORDER_PARAMETERS');
    } else {
      console.error('Помилка повернення:', result.errors);
    }
  };

  // Якщо немає даних замовлення і не завантажується - показуємо помилку
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

  // Перетворюємо дані API в формат компонентів
  const orderInfo = orderConfirmation.order
    ? {
        receiptNumber: orderConfirmation.order.receiptNumber,
        uniqueTag: orderConfirmation.order.tagNumber || '',
        createdDate: orderConfirmation.order.createdDate
          ? new Date(orderConfirmation.order.createdDate).toLocaleDateString('uk-UA')
          : '',
        executionDate: orderConfirmation.order.expectedCompletionDate
          ? new Date(orderConfirmation.order.expectedCompletionDate).toLocaleDateString('uk-UA')
          : '',
      }
    : null;

  const clientInfo = orderConfirmation.order?.client
    ? {
        name: `${orderConfirmation.order.client.lastName} ${orderConfirmation.order.client.firstName}`,
        phone: orderConfirmation.order.client.phone || '',
        contactMethod: 'Телефон', // TODO: отримати з даних клієнта
        address: orderConfirmation.order.client.address || '',
      }
    : null;

  const branchInfo = orderConfirmation.order?.branchLocation
    ? {
        name: orderConfirmation.order.branchLocation.name,
        address: orderConfirmation.order.branchLocation.address,
      }
    : null;

  const items =
    orderConfirmation.order?.items?.map((item: any) => ({
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
    })) || [];

  const totals = orderConfirmation.order
    ? {
        baseAmount: items.reduce((sum: number, item: any) => sum + item.basePrice, 0),
        modifiersAmount: 0, // TODO: розрахувати з модифікаторів
        subtotal: orderConfirmation.order.totalAmount || 0,
        urgencySurcharge: 0, // TODO: розрахувати з expediteType
        discountType: '', // TODO: отримати з order
        discountPercent: 0, // TODO: розрахувати з discountAmount
        discountAmount: orderConfirmation.order.discountAmount || 0,
        finalTotal: orderConfirmation.order.finalAmount || 0,
        paidAmount: orderConfirmation.order.prepaymentAmount || 0,
        remainingDebt: orderConfirmation.order.balanceAmount || 0,
        paymentMethod: 'TERMINAL', // TODO: отримати з order parameters
      }
    : null;

  const notes = {
    orderNotes: orderConfirmation.order?.customerNotes || '',
    clientRequirements: '', // TODO: отримати з даних замовлення
  };

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
        {orderConfirmation.order && (
          <Grid container spacing={3}>
            {/* Інформація про замовлення */}
            {orderInfo && clientInfo && branchInfo && (
              <OrderSummaryInfo
                orderInfo={orderInfo}
                clientInfo={clientInfo}
                branchInfo={branchInfo}
              />
            )}

            {/* Таблиця предметів */}
            <ItemsTable items={items} />

            {/* Фінансова інформація */}
            {totals && <FinancialSummary totals={totals} />}

            {/* Примітки */}
            <OrderNotes notes={notes} />

            {/* Юридичні аспекти */}
            <LegalAgreement
              agreesToTerms={orderConfirmation.termsAccepted}
              onTermsChange={handleTermsChange}
              disabled={orderConfirmation.isSaving || orderConfirmation.isGeneratingReceipt}
            />

            {/* Цифровий підпис */}
            <DigitalSignature
              signatureData={orderConfirmation.signatureData}
              onSignatureChange={orderConfirmation.setSignatureData}
              disabled={orderConfirmation.isSaving || orderConfirmation.isGeneratingReceipt}
              required={true}
            />

            {/* Формування та друк квитанції */}
            <ReceiptActions
              isReceiptGenerated={orderConfirmation.receiptGenerated}
              isProcessingOrder={orderConfirmation.isGeneratingReceipt}
              agreesToTerms={orderConfirmation.termsAccepted}
              onGenerateReceipt={handleGenerateReceipt}
              onPrintReceipt={handlePrintReceipt}
              onDownloadPdf={handleDownloadPdf}
              onEmailReceipt={handleEmailReceipt}
              disabled={orderConfirmation.isSaving}
            />
          </Grid>
        )}

        {/* Інформаційні повідомлення */}
        {!orderConfirmation.termsAccepted && !orderConfirmation.isLoading && (
          <Alert severity="info" sx={{ mt: 3 }}>
            Для завершення замовлення необхідно погодитися з умовами надання послуг.
          </Alert>
        )}

        {orderConfirmation.canFinalize && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Замовлення готове до завершення. Натисніть &quot;Завершити замовлення&quot; для
            фінального збереження.
          </Alert>
        )}

        {orderConfirmation.isOrderFinalized && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Замовлення вже завершено та збережено в системі.
          </Alert>
        )}
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
