import { Box, Paper, Typography } from '@mui/material';
import type { Control } from 'react-hook-form';
import { ItemPricingFormValues, PriceModifier } from '@/features/order-wizard/model/schema/item-pricing.schema';
import { ModifierItem } from './ModifierItem';

interface ModifiersListProps {
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
 * Компонент для відображення списку модифікаторів ціни
 */
export const ModifiersList: React.FC<ModifiersListProps> = ({
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
    <Paper elevation={0} sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {modifiers.map((modifier) => (
          <ModifierItem
            key={modifier.id}
            modifier={modifier}
            control={control}
            isApplied={isModifierApplied(modifier.id)}
            selectedValue={getModifierSelectedValue(modifier.id)}
            onToggle={(applied: boolean) => onModifierToggle(modifier.id, applied)}
            onValueChange={(value: number) => onModifierValueChange(modifier.id, value)}
          />
        ))}
      </Box>
    </Paper>
  );
};
