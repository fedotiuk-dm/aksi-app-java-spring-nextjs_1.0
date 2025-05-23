'use client';

import { Box } from '@mui/material';
import React from 'react';

import { useBranchSelection } from '@/domain/branch';
import { Branch } from '@/domain/branch';
import { useWizard } from '@/domain/wizard';
import { StepContainer, StepNavigation } from '@/shared/ui';

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
 * - Пункт прийому замовлення (вибір філії)
 * - Дата створення замовлення (автоматично)
 */
export const BranchSelectionStep: React.FC = () => {
  // Отримуємо всю функціональність з domain layer
  const branchSelection = useBranchSelection();
  const wizard = useWizard();

  // Додаємо логування для діагностики
  console.log('BranchSelectionStep render:', {
    selectedBranch: branchSelection.selectedBranch,
    hasSelection: branchSelection.hasSelection,
    isSelectionValid: branchSelection.isSelectionValid,
    isLoading: branchSelection.isLoading,
    error: branchSelection.error,
    activeBranches: branchSelection.activeBranches.length,
  });

  /**
   * Обробник вибору філії
   */
  const handleBranchSelect = (branch: Branch) => {
    console.log('Філію вибрано для замовлення:', branch);
    branchSelection.selectBranchObject(branch);
  };

  /**
   * Обробник переходу до наступного кроку
   */
  const handleNext = async () => {
    if (branchSelection.isSelectionValid) {
      console.log('Перехід до наступного кроку з філією:', branchSelection.selectedBranch);

      // Переходимо до наступного кроку через wizard
      const result = wizard.navigateForward();
      if (result.success) {
        console.log('Успішно перейшли до наступного кроку');
      } else {
        console.error('Помилка переходу:', result.errors);
      }
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

  /**
   * Перевірка чи можна перейти до наступного кроку
   */
  const canProceed = branchSelection.isSelectionValid && !branchSelection.isLoading;

  return (
    <StepContainer
      title="Вибір приймального пункту"
      subtitle="Оберіть філію для прийому замовлення"
    >
      <Box sx={{ minHeight: '300px' }}>
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
          onClearSearch={branchSelection.clearSearch}
          onRefresh={branchSelection.refreshBranches}
          isLoading={branchSelection.isLoading}
          error={branchSelection.error}
          showActiveOnly={branchSelection.showActiveOnly}
          onToggleActiveFilter={branchSelection.toggleActiveFilter}
        />
      </Box>

      <StepNavigation
        onNext={canProceed ? handleNext : undefined}
        onBack={handleBack}
        nextLabel="Продовжити до предметів"
        backLabel="Назад до клієнта"
        isNextDisabled={!canProceed}
        nextLoading={branchSelection.isLoading}
      />
    </StepContainer>
  );
};

export default BranchSelectionStep;
