'use client';

import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { ModifierItem } from './';
import {
  PriceModifier,
  AppliedModifier,
} from '@/features/order-wizard/model/schema/item-pricing.schema';

interface ModifierCategorySectionProps {
  title: string;
  modifiers: PriceModifier[];
  appliedModifiers: AppliedModifier[];
  onModifierChange: (modifierId: string, value: number) => void;
  onModifierRemove: (modifierId: string) => void;
}

/**
 * Компонент для групування модифікаторів за категорією
 */
const ModifierCategorySection: React.FC<ModifierCategorySectionProps> = ({
  title,
  modifiers,
  appliedModifiers,
  onModifierChange,
  onModifierRemove,
}) => {
  if (modifiers.length === 0) {
    return null; // Не відображаємо секцію, якщо немає модифікаторів
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {modifiers.map((modifier) => {
        // Перевіряємо, чи модифікатор вже застосований
        const appliedModifier = appliedModifiers.find(
          (m) => m.modifierId === modifier.id
        );

        return (
          <ModifierItem
            key={modifier.id}
            modifier={modifier}
            isApplied={!!appliedModifier}
            selectedValue={appliedModifier?.selectedValue || 0}
            onModifierChange={onModifierChange}
            onModifierRemove={onModifierRemove}
          />
        );
      })}
    </Box>
  );
};

export default ModifierCategorySection;
