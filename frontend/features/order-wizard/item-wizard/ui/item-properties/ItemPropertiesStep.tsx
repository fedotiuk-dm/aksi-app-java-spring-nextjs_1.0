'use client';

import { Box, Paper } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import React, { useCallback } from 'react';

import { useItemWizard, useItemProperties, MaterialType } from '@/domain/order';
import {
  MaterialSelector,
  ColorSelector,
  FillerSelector,
  WearLevelSelector,
  ItemPropertiesSummary,
  StatusMessage,
  StepContainer,
  StepNavigation,
} from '@/shared/ui';

/**
 * Підкрок 2.2: Характеристики предмета
 *
 * FSD принципи:
 * - "Тонкий" UI компонент без бізнес-логіки
 * - Отримує всю функціональність з domain layer
 * - Використовує shared UI компоненти
 */
export const ItemPropertiesStep: React.FC = () => {
  // === DOMAIN HOOKS ===
  const { itemData, validation, canProceed, updateProperties, wizard } = useItemWizard();
  const {
    baseColors,
    fillerOptions,
    wearLevelOptions,
    getMaterialOptions,
    needsFiller,
    getMaterialLabel,
    getFillerLabel,
  } = useItemProperties();

  // === COMPUTED VALUES ===
  const availableMaterials = getMaterialOptions(itemData.category);
  const showFiller = needsFiller(itemData.category);
  const selectedMaterialLabel = itemData.material ? getMaterialLabel(itemData.material) : '';
  const selectedFillerLabel = itemData.fillerType ? getFillerLabel(itemData.fillerType) : '';

  // === EVENT HANDLERS ===

  /**
   * Обробник зміни матеріалу
   */
  const handleMaterialChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      updateProperties({ material: event.target.value as MaterialType });
    },
    [updateProperties]
  );

  /**
   * Обробник зміни кольору через автокомпліт
   */
  const handleColorChange = useCallback(
    (event: React.SyntheticEvent, value: string | null) => {
      updateProperties({ color: value || '' });
    },
    [updateProperties]
  );

  /**
   * Обробник зміни кольору через текстове поле
   */
  const handleColorTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateProperties({ color: event.target.value });
    },
    [updateProperties]
  );

  /**
   * Обробник зміни типу наповнювача
   */
  const handleFillerTypeChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      updateProperties({ fillerType: event.target.value });
    },
    [updateProperties]
  );

  /**
   * Обробник зміни стану наповнювача
   */
  const handleFillerCompressedChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateProperties({ fillerCompressed: event.target.checked });
    },
    [updateProperties]
  );

  /**
   * Обробник зміни ступеня зносу
   */
  const handleWearDegreeChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      updateProperties({ wearDegree: event.target.value });
    },
    [updateProperties]
  );

  /**
   * Обробник переходу до наступного підкроку
   */
  const handleNext = useCallback(() => {
    if (canProceed) {
      const result = wizard.navigateForward();
      if (result.success) {
        console.log('Перехід до дефектів та плям');
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
      console.log('Повернення до основної інформації');
    } else {
      console.error('Помилка повернення:', result.errors);
    }
  }, [wizard]);

  return (
    <StepContainer
      title="Характеристики предмета"
      subtitle="Вкажіть матеріал, колір та інші важливі характеристики предмета"
    >
      <Box sx={{ minHeight: '400px' }}>
        {/* Матеріал */}
        {availableMaterials.length > 0 && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <MaterialSelector
              materials={availableMaterials.map((m) => ({
                value: m.value.toString(),
                label: m.label,
              }))}
              selectedMaterial={itemData.material?.toString() || ''}
              onMaterialChange={handleMaterialChange}
              error={validation.properties.errors.material}
            />
          </Paper>
        )}

        {/* Колір */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <ColorSelector
            color={itemData.color || ''}
            baseColors={baseColors}
            onColorChange={handleColorChange}
            onColorTextChange={handleColorTextChange}
            error={validation.properties.errors.color}
          />
        </Paper>

        {/* Наповнювач (якщо потрібен) */}
        {showFiller && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <FillerSelector
              fillerTypes={fillerOptions}
              selectedFillerType={itemData.fillerType || ''}
              fillerCompressed={itemData.fillerCompressed || false}
              onFillerTypeChange={handleFillerTypeChange}
              onFillerCompressedChange={handleFillerCompressedChange}
            />
          </Paper>
        )}

        {/* Ступінь зносу */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <WearLevelSelector
            wearLevels={wearLevelOptions}
            selectedWearLevel={itemData.wearDegree || ''}
            onWearLevelChange={handleWearDegreeChange}
          />
        </Paper>

        {/* Підсумок характеристик */}
        <Box sx={{ mb: 3 }}>
          <ItemPropertiesSummary
            material={selectedMaterialLabel}
            color={itemData.color}
            fillerType={selectedFillerLabel}
            fillerCompressed={itemData.fillerCompressed}
            wearLevel={itemData.wearDegree ? `${itemData.wearDegree}%` : undefined}
          />
        </Box>

        {/* Статусне повідомлення */}
        <StatusMessage
          message="Характеристики предмета заповнено. Можете переходити до наступного кроку."
          severity="success"
          show={canProceed}
        />
      </Box>

      <StepNavigation
        onNext={canProceed ? handleNext : undefined}
        onBack={handleBack}
        nextLabel="Продовжити до дефектів"
        backLabel="Назад до основної інформації"
        isNextDisabled={!canProceed}
      />
    </StepContainer>
  );
};

export default ItemPropertiesStep;
