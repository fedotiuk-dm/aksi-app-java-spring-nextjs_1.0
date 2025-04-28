import React from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';
import type { Control } from 'react-hook-form';
import { 
  ItemPricingFormValues,
  PriceModifier
} from '@/features/order-wizard/model/schema/item-pricing.schema';
import { ModifierItem } from './ModifierItem';

interface ModifierCategorySectionProps {
  title: string;
  description?: string;
  modifiers: PriceModifier[];
  control: Control<ItemPricingFormValues>;
  isModifierApplied: (modifierId: string) => boolean;
  getModifierSelectedValue: (modifierId: string) => number | undefined;
  onModifierToggle: (modifierId: string, applied: boolean) => void;
  onModifierValueChange: (modifierId: string, value: number) => void;
}

/**
 * Компонент для відображення секції категорії модифікаторів
 */
export const ModifierCategorySection: React.FC<ModifierCategorySectionProps> = ({
  title,
  description,
  modifiers,
  control,
  isModifierApplied,
  getModifierSelectedValue,
  onModifierToggle,
  onModifierValueChange,
}) => {
  if (!modifiers || modifiers.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>
      )}
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {modifiers.map((modifier) => (
          <Grid key={modifier.id} size={{ xs: 12, sm: 6 }}>
            <ModifierItem
              modifier={modifier}
              control={control}
              isApplied={isModifierApplied(modifier.id)}
              selectedValue={getModifierSelectedValue(modifier.id)}
              onToggle={(applied) => onModifierToggle(modifier.id, applied)}
              onValueChange={(value) => onModifierValueChange(modifier.id, value)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
