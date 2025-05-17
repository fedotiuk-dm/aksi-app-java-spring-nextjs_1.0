'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  PriceModifier,
  AppliedModifier,
  ModifierCategoryType,
} from '@/features/order-wizard/model/schema/item-pricing.schema';
import ModifierCategorySection from './ModifierCategorySection';

interface ModifiersListProps {
  availableModifiers: PriceModifier[];
  appliedModifiers: AppliedModifier[];
  isLoading: boolean;
  error?: string;
  onModifierChange: (modifierId: string, value: number) => void;
  onModifierRemove: (modifierId: string) => void;
  categoryCode?: string;
}

/**
 * Компонент для відображення списку модифікаторів, згрупованих за категоріями
 */
const ModifiersList: React.FC<ModifiersListProps> = ({
  availableModifiers,
  appliedModifiers,
  isLoading,
  error,
  onModifierChange,
  onModifierRemove,
}) => {
  // Групуємо модифікатори за категоріями
  const groupedModifiers = useMemo(() => {
    const result = {
      [ModifierCategoryType.GENERAL]: [] as PriceModifier[],
      [ModifierCategoryType.TEXTILE]: [] as PriceModifier[],
      [ModifierCategoryType.LEATHER]: [] as PriceModifier[],
    };

    availableModifiers.forEach((modifier) => {
      if (modifier.category === ModifierCategoryType.GENERAL) {
        result[ModifierCategoryType.GENERAL].push(modifier);
      } else if (modifier.category === ModifierCategoryType.TEXTILE) {
        result[ModifierCategoryType.TEXTILE].push(modifier);
      } else if (modifier.category === ModifierCategoryType.LEATHER) {
        result[ModifierCategoryType.LEATHER].push(modifier);
      } else {
        // За замовчуванням додаємо в загальні
        result[ModifierCategoryType.GENERAL].push(modifier);
      }
    });

    return result;
  }, [availableModifiers]);

  // Відображення під час завантаження
  if (isLoading) {
    return (
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Відображення помилки
  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Помилка при завантаженні модифікаторів: {error}
      </Alert>
    );
  }

  // Якщо немає доступних модифікаторів
  if (availableModifiers.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Для даної категорії предметів немає доступних модифікаторів ціни
      </Alert>
    );
  }

  // Назви категорій для відображення
  const categoryTitles = {
    [ModifierCategoryType.GENERAL]: 'Загальні модифікатори',
    [ModifierCategoryType.TEXTILE]: 'Модифікатори для текстильних виробів',
    [ModifierCategoryType.LEATHER]: 'Модифікатори для шкіряних виробів',
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Модифікатори ціни
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Виберіть додаткові послуги та модифікатори, які впливають на ціну
        предмета
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Загальні модифікатори */}
      <ModifierCategorySection
        title={categoryTitles[ModifierCategoryType.GENERAL]}
        modifiers={groupedModifiers[ModifierCategoryType.GENERAL]}
        appliedModifiers={appliedModifiers}
        onModifierChange={onModifierChange}
        onModifierRemove={onModifierRemove}
      />

      {/* Модифікатори для текстильних виробів */}
      {groupedModifiers[ModifierCategoryType.TEXTILE].length > 0 && (
        <ModifierCategorySection
          title={categoryTitles[ModifierCategoryType.TEXTILE]}
          modifiers={groupedModifiers[ModifierCategoryType.TEXTILE]}
          appliedModifiers={appliedModifiers}
          onModifierChange={onModifierChange}
          onModifierRemove={onModifierRemove}
        />
      )}

      {/* Модифікатори для шкіряних виробів */}
      {groupedModifiers[ModifierCategoryType.LEATHER].length > 0 && (
        <ModifierCategorySection
          title={categoryTitles[ModifierCategoryType.LEATHER]}
          modifiers={groupedModifiers[ModifierCategoryType.LEATHER]}
          appliedModifiers={appliedModifiers}
          onModifierChange={onModifierChange}
          onModifierRemove={onModifierRemove}
        />
      )}
    </Box>
  );
};

export default ModifiersList;
