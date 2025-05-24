'use client';

import { Box, TextField, Paper, Typography, Alert } from '@mui/material';
import React, { useState } from 'react';

import { useBranchSelection } from '@/domain/branch';
import { Branch } from '@/domain/branch';
import { useOrderCreation } from '@/domain/order';
import { useWizard } from '@/domain/wizard';
import { StepContainer, StepNavigation, OrderCreationSummary, AutoFieldsInfo } from '@/shared/ui';

import { BranchSelector } from './ui/BranchSelector';
import { SelectedBranchInfo } from './ui/SelectedBranchInfo';

/**
 * Головний компонент для BRANCH_SELECTION кроку Order Wizard
 *
 * FSD принципи:
 * - Тільки UI логіка (презентаційний компонент)
 * - Отримує всі дані з domain хуків
 * - Мінімальний локальний стан
 * - Композиція спеціалізованих UI компонентів
 *
 * Згідно з документацією Order Wizard:
 * 1.2. Базова інформація замовлення
 * - Номер квитанції (генерується автоматично)
 * - Унікальна мітка (вводиться вручну або сканується)
 * - Пункт прийому замовлення (вибір філії)
 * - Дата створення замовлення (автоматично)
 */
export const BranchSelectionStep: React.FC = () => {
  // Отримуємо всю функціональність з domain layer
  const branchSelection = useBranchSelection();
  const wizard = useWizard();
  const orderCreation = useOrderCreation();

  // Локальний стан для унікальної мітки
  const [tagNumber, setTagNumber] = useState<string>('');

  // Додаємо логування для діагностики
  console.log('BranchSelectionStep render:', {
    selectedBranch: branchSelection.selectedBranch,
    hasSelection: branchSelection.hasSelection,
    isSelectionValid: branchSelection.isSelectionValid,
    isLoading: branchSelection.isLoading,
    error: branchSelection.error,
    activeBranches: branchSelection.activeBranches.length,
    tagNumber,
    orderCreationState: orderCreation.creationState,
  });

  /**
   * Обробник вибору філії
   */
  const handleBranchSelect = (branch: Branch) => {
    console.log('Філію вибрано для замовлення:', branch);
    branchSelection.selectBranchObject(branch);
  };

  /**
   * Обробник зміни унікальної мітки
   */
  const handleTagNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagNumber(event.target.value);
  };

  /**
   * Перевірка готовності до створення замовлення
   */
  const canCreateOrder =
    branchSelection.isSelectionValid && tagNumber.trim().length > 0 && !orderCreation.isCreating;

  /**
   * Обробник переходу до наступного кроку (створення замовлення)
   */
  const handleNext = async () => {
    if (!canCreateOrder) {
      console.log('❌ Не можна створити замовлення:', {
        canCreateOrder,
        hasValidBranch: branchSelection.isSelectionValid,
        hasTagNumber: tagNumber.trim().length > 0,
        isCreating: orderCreation.isCreating,
      });
      return;
    }

    console.log('🔄 Створення замовлення з:', {
      customerId: wizard.context?.customerId,
      branchLocationId: branchSelection.selectedBranch?.id,
      tagNumber: tagNumber.trim(),
    });

    try {
      // Перевіряємо наявність необхідних даних
      if (!wizard.context?.customerId) {
        console.error('❌ Відсутній customerId в wizard context');
        return;
      }

      if (!branchSelection.selectedBranch?.id) {
        console.error('❌ Відсутній branchLocationId');
        return;
      }

      if (!tagNumber.trim()) {
        console.error('❌ Відсутня унікальна мітка');
        return;
      }

      // Створюємо реальне замовлення через domain layer
      const result = await orderCreation.createOrderForWizard(
        wizard.context.customerId,
        branchSelection.selectedBranch.id,
        tagNumber.trim()
      );

      if (result.success && result.order) {
        console.log('✅ Замовлення успішно створено:', result.order);
        // Не переходимо автоматично - користувач натисне кнопку "Продовжити до Item Manager"
      } else {
        console.error('❌ Помилка створення замовлення:', result.errors);
      }
    } catch (error) {
      console.error('❌ Виняток при створенні замовлення:', error);
    }
  };

  /**
   * Обробник повернення до попереднього кроку
   */
  const handleBack = async () => {
    console.log('Повернення до попереднього кроку (клієнти)');

    // Повертаємося до попереднього кроку через wizard
    const result = wizard.navigateBack();
    if (result.success) {
      console.log('Успішно повернулися до попереднього кроку');
    } else {
      console.error('Помилка повернення:', result.errors);
    }
  };

  return (
    <StepContainer
      title="Базова інформація замовлення"
      subtitle="Оберіть філію та введіть унікальну мітку"
    >
      <Box sx={{ minHeight: '400px' }}>
        {/* Показуємо помилки створення замовлення */}
        {orderCreation.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Помилка створення замовлення: {orderCreation.error}
          </Alert>
        )}

        {/* 1. Унікальна мітка */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Унікальна мітка замовлення
          </Typography>
          <TextField
            fullWidth
            label="Введіть або відскануйте унікальну мітку"
            value={tagNumber}
            onChange={handleTagNumberChange}
            placeholder="Наприклад: OW-001234"
            helperText="Обов'язкове поле. Використовується для ідентифікації замовлення"
            error={tagNumber.trim().length === 0}
            sx={{ mb: 2 }}
          />
        </Paper>

        {/* 2. Вибір філії */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Пункт прийому замовлення
          </Typography>

          {/* Інформація про обрану філію */}
          {branchSelection.hasSelection && branchSelection.selectedBranch && (
            <Box sx={{ mb: 3 }}>
              <SelectedBranchInfo
                branch={branchSelection.selectedBranch}
                onClear={branchSelection.clearSelection}
              />
            </Box>
          )}

          {/* Селектор філій */}
          <BranchSelector
            availableBranches={branchSelection.activeBranches}
            selectedBranch={branchSelection.selectedBranch}
            searchResults={branchSelection.searchResults?.branches}
            onSelectBranch={handleBranchSelect}
            onSearch={branchSelection.search}
            onClearSearch={() => {
              branchSelection.clearSearch();
            }}
            onRefresh={async () => {
              await branchSelection.clearSelection();
              await branchSelection.refreshBranches();
            }}
            isLoading={branchSelection.isLoading}
            error={branchSelection.error}
            showActiveOnly={branchSelection.showActiveOnly}
            onToggleActiveFilter={async () => {
              await branchSelection.clearSelection();
              await branchSelection.toggleActiveFilter();
            }}
          />
        </Paper>

        {/* 3. Інформація про автоматичні поля */}
        {canCreateOrder && (
          <Box sx={{ mb: 3 }}>
            <AutoFieldsInfo
              fields={['Номер квитанції', 'Дата створення замовлення']}
              variant="info"
            />
          </Box>
        )}

        {/* 4. Покращений компонент інформації про замовлення */}
        {orderCreation.hasOrder && orderCreation.currentOrder && (
          <Box sx={{ mb: 3 }}>
            <OrderCreationSummary
              order={{
                receiptNumber: orderCreation.currentOrder.receiptNumber,
                tagNumber: orderCreation.currentOrder.tagNumber,
                createdDate: orderCreation.currentOrder.createdDate,
                expectedCompletionDate: orderCreation.currentOrder.expectedCompletionDate,
                branchLocation: {
                  name: orderCreation.currentOrder.branchLocation?.name || 'Не вказано',
                  address: orderCreation.currentOrder.branchLocation?.address,
                  phone: orderCreation.currentOrder.branchLocation?.phone,
                  code: orderCreation.currentOrder.branchLocation?.code,
                },
              }}
            />
          </Box>
        )}
      </Box>

      {/* Навігація залежно від стану */}
      {orderCreation.hasOrder && orderCreation.currentOrder ? (
        // Замовлення створено - показуємо кнопку переходу до Item Manager
        <StepNavigation
          onNext={() => {
            const result = wizard.navigateForward();
            if (result.success) {
              console.log('✅ Успішно перейшли до Item Manager');
            } else {
              console.error('❌ Помилка переходу до Item Manager:', result.errors);
            }
          }}
          onBack={handleBack}
          nextLabel="Продовжити до Item Manager"
          backLabel="Назад до клієнта"
          isNextDisabled={false}
          nextLoading={false}
        />
      ) : (
        // Замовлення ще не створено - показуємо кнопку створення
        <StepNavigation
          onNext={canCreateOrder ? handleNext : undefined}
          onBack={handleBack}
          nextLabel={orderCreation.isCreating ? 'Створення замовлення...' : 'Створити замовлення'}
          backLabel="Назад до клієнта"
          isNextDisabled={!canCreateOrder}
          nextLoading={orderCreation.isCreating}
        />
      )}
    </StepContainer>
  );
};

export default BranchSelectionStep;
