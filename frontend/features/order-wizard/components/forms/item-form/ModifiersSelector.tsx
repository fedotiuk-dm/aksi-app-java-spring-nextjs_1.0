'use client';

import React, { useMemo } from 'react';
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Typography,
} from '@mui/material';
import type { PriceListItemInfoCategoryCode } from '@/shared/api/generated/priceList';
import { useListPriceModifiers } from '@/shared/api/generated/pricing';
import type { ListPriceModifiersCategoryCode } from '@/shared/api/generated/pricing/';

interface ModifiersSelectorProps {
  selectedCategory: PriceListItemInfoCategoryCode | '';
  selectedModifiers: string[];
  onChangeAction: (modifiers: string[]) => void;
  disabled?: boolean;
}

export const ModifiersSelector: React.FC<ModifiersSelectorProps> = ({
  selectedCategory,
  selectedModifiers,
  onChangeAction,
  disabled,
}) => {
  const { data, isLoading } = useListPriceModifiers(
    selectedCategory
      ? { categoryCode: selectedCategory as ListPriceModifiersCategoryCode }
      : undefined,
    { query: { enabled: !!selectedCategory } }
  );

  const availableModifiers = useMemo(() => {
    const merged = [
      ...(data?.generalModifiers ?? []),
      ...(data?.modifiers ?? []),
      ...(data?.textileModifiers ?? []),
      ...(data?.leatherModifiers ?? []),
    ];
    // Фільтрація за categoryRestrictions (якщо вказані)
    const filtered = merged.filter((m) => {
      const restrictions = m.categoryRestrictions as unknown as string[] | undefined;
      if (!selectedCategory) return false;
      return !restrictions || restrictions.includes(selectedCategory);
    });
    // Сортування за sortOrder якщо є
    type Mod = { sortOrder?: number };
    return filtered.sort((a: Mod, b: Mod) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [data, selectedCategory]);

  const handleModifierToggle = (modifierCode: string) => {
    const index = selectedModifiers.indexOf(modifierCode);
    if (index >= 0) {
      onChangeAction(selectedModifiers.filter((code) => code !== modifierCode));
    } else {
      onChangeAction([...selectedModifiers, modifierCode]);
    }
  };

  if (!selectedCategory) {
    return null;
  }

  if (isLoading) {
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">Модифікатори</FormLabel>
        <CircularProgress size={18} sx={{ mt: 1 }} />
      </FormControl>
    );
  }

  if (availableModifiers.length === 0) {
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">Модифікатори</FormLabel>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Немає модифікаторів для цієї категорії
        </Typography>
      </FormControl>
    );
  }

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Модифікатори</FormLabel>
      <FormGroup>
        {availableModifiers.map((modifier) => (
          <FormControlLabel
            key={modifier.code}
            control={
              <Checkbox
                checked={selectedModifiers.includes(modifier.code)}
                onChange={() => handleModifierToggle(modifier.code)}
                disabled={disabled}
              />
            }
            label={modifier.name}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};
