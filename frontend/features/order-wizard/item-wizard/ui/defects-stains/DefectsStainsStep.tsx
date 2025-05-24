'use client';

import { Info } from '@mui/icons-material';
import { Box, Paper } from '@mui/material';
import React, { useState, useCallback } from 'react';

import { useItemWizard, useDefectsStains, DefectType, StainType } from '@/domain/order';
import {
  SectionHeader,
  FormField,
  StatusMessage,
  DefectsSelector,
  StainsSelector,
  WarrantySection,
  DefectsStainsWarningsPanel,
  StepContainer,
  StepNavigation,
} from '@/shared/ui';

/**
 * Підкрок 2.3: Забруднення, дефекти та ризики
 *
 * FSD принципи:
 * - "Тонкий" UI компонент без бізнес-логіки
 * - Отримує всю функціональність з domain layer
 * - Використовує shared UI компоненти
 */
export const DefectsStainsStep: React.FC = () => {
  // TODO: Отримати orderId з wizard state/context
  const orderId = 'temp-order-id'; // Тимчасове значення

  // === DOMAIN HOOKS ===
  const { itemData, validation, canProceed, updateDefectsStains, wizard } = useItemWizard({
    orderId,
  });
  const { defectOptions, stainOptions, convertDefectsToStrings, convertStainsToStrings } =
    useDefectsStains();

  // === LOCAL STATE ===
  const [customStainDescription, setCustomStainDescription] = useState('');
  const [customDefectDescription, setCustomDefectDescription] = useState('');

  // === COMPUTED VALUES ===
  const selectedStains = convertStainsToStrings(itemData.stains || []);
  const selectedDefects = convertDefectsToStrings(itemData.defects || []);
  const hasIssues = selectedStains.length > 0 || selectedDefects.length > 0 || itemData.noWarranty;

  // === EVENT HANDLERS ===

  /**
   * Обробник зміни плям
   */
  const handleStainToggle = useCallback(
    (stainValue: string, checked: boolean) => {
      const stainType = stainValue as StainType;
      const currentStains = itemData.stains || [];

      if (checked) {
        updateDefectsStains({
          stains: [...currentStains, stainType],
        });
      } else {
        updateDefectsStains({
          stains: currentStains.filter((s) => s !== stainType),
        });
      }
    },
    [itemData.stains, updateDefectsStains]
  );

  /**
   * Обробник зміни дефектів
   */
  const handleDefectToggle = useCallback(
    (defectValue: string, checked: boolean) => {
      const defectType = defectValue as DefectType;
      const currentDefects = itemData.defects || [];

      if (checked) {
        updateDefectsStains({
          defects: [...currentDefects, defectType],
        });
      } else {
        updateDefectsStains({
          defects: currentDefects.filter((d) => d !== defectType),
        });
      }
    },
    [itemData.defects, updateDefectsStains]
  );

  /**
   * Обробник зміни примітки
   */
  const handleNotesChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateDefectsStains({
        defectsNotes: event.target.value,
      });
    },
    [updateDefectsStains]
  );

  /**
   * Обробник зміни "без гарантій"
   */
  const handleNoWarrantyChange = useCallback(
    (checked: boolean) => {
      updateDefectsStains({
        noWarranty: checked,
        noWarrantyReason: checked ? itemData.noWarrantyReason : '',
      });
    },
    [itemData.noWarrantyReason, updateDefectsStains]
  );

  /**
   * Обробник зміни причини "без гарантій"
   */
  const handleNoWarrantyReasonChange = useCallback(
    (reason: string) => {
      updateDefectsStains({
        noWarrantyReason: reason,
      });
    },
    [updateDefectsStains]
  );

  /**
   * Обробник переходу до наступного підкроку
   */
  const handleNext = useCallback(() => {
    if (canProceed) {
      const result = wizard.navigateForward();
      if (result.success) {
        console.log('Перехід до калькулятора ціни');
      } else {
        console.error('Помилка переходу:', result.errors);
      }
    }
  }, [canProceed, wizard]);

  /**
   * Обробник повернення до попереднього підкроку
   */
  const handleBack = useCallback(() => {
    const result = wizard.navigateBack();
    if (result.success) {
      console.log('Повернення до характеристик');
    } else {
      console.error('Помилка повернення:', result.errors);
    }
  }, [wizard]);

  return (
    <StepContainer
      title="Забруднення, дефекти та ризики"
      subtitle="Відмітьте всі виявлені плями, дефекти та можливі ризики при чистці"
    >
      <Box sx={{ minHeight: '400px' }}>
        {/* Плями */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <StainsSelector
            stains={stainOptions.map((option) => ({
              value: option.value.toString(),
              label: option.label,
              difficulty: option.difficulty,
            }))}
            selectedStains={selectedStains}
            customStainDescription={customStainDescription}
            onStainToggle={handleStainToggle}
            onCustomDescriptionChange={setCustomStainDescription}
          />
        </Paper>

        {/* Дефекти та ризики */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <DefectsSelector
            defects={defectOptions.map((option) => ({
              value: option.value.toString(),
              label: option.label,
              severity: option.severity,
            }))}
            selectedDefects={selectedDefects}
            customDefectDescription={customDefectDescription}
            onDefectToggle={handleDefectToggle}
            onCustomDescriptionChange={setCustomDefectDescription}
          />
        </Paper>

        {/* Примітки та "без гарантій" */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <SectionHeader icon={Info} title="Додаткова інформація" />

          {/* Загальні примітки */}
          <FormField
            type="text"
            label="Примітки щодо дефектів та плям"
            placeholder="Додайте детальний опис стану предмета, розташування дефектів тощо..."
            value={itemData.defectsNotes || ''}
            onChange={handleNotesChange}
            multiline
            rows={3}
            error={validation.defectsStains.errors.defectsNotes}
            helperText={validation.defectsStains.errors.defectsNotes || 'Максимум 1000 символів'}
            sx={{ mb: 3 }}
          />

          {/* Без гарантій */}
          <WarrantySection
            noWarranty={itemData.noWarranty || false}
            noWarrantyReason={itemData.noWarrantyReason || ''}
            onNoWarrantyChange={handleNoWarrantyChange}
            onReasonChange={handleNoWarrantyReasonChange}
            reasonError={validation.defectsStains.errors.noWarrantyReason}
          />
        </Paper>

        {/* Попередження та інформаційні повідомлення */}
        <Box sx={{ mb: 3 }}>
          <DefectsStainsWarningsPanel
            hasStains={selectedStains.length > 0}
            hasDefects={selectedDefects.length > 0}
            hasNoWarranty={itemData.noWarranty || false}
          />
        </Box>

        {/* Статусне повідомлення успіху */}
        <StatusMessage
          message="Інформацію про дефекти та плями заповнено. Можете переходити до наступного кроку."
          severity="success"
          show={canProceed && hasIssues}
        />
      </Box>

      <StepNavigation
        onNext={canProceed ? handleNext : undefined}
        onBack={handleBack}
        nextLabel="Продовжити до ціни"
        backLabel="Назад до характеристик"
        isNextDisabled={!canProceed}
      />
    </StepContainer>
  );
};

export default DefectsStainsStep;
