import React from 'react';
import { 
  Box, 
  Checkbox, 
  FormControlLabel, 
  Slider, 
  Typography, 
  TextField,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import type { Control } from 'react-hook-form';
import { 
  ItemPricingFormValues, 
  PriceModifier 
} from '@/features/order-wizard/model/schema/item-pricing.schema';

interface ModifierItemProps {
  modifier: PriceModifier;
  control: Control<ItemPricingFormValues>;
  isApplied: boolean;
  selectedValue?: number;
  onToggle: (applied: boolean) => void;
  onValueChange: (value: number) => void;
}

/**
 * Компонент для відображення окремого модифікатора ціни
 */
export const ModifierItem: React.FC<ModifierItemProps> = ({
  modifier,
  isApplied,
  selectedValue,
  onToggle,
  onValueChange,
}) => {
  // Форматування значення модифікатора
  const formatModifierValue = (value: number) => {
    if (modifier.isPercentage) {
      return `${value}%`;
    }
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
    }).format(value);
  };

  // Визначення значення для відображення
  const displayValue = selectedValue !== undefined
    ? selectedValue
    : (modifier.value || 0);

  // Визначаємо, чи це модифікатор з діапазоном значень
  const isRangeModifier = modifier.minValue !== undefined && 
                         modifier.maxValue !== undefined && 
                         modifier.minValue !== modifier.maxValue;

  // Визначаємо колір чіпу (зелений для знижок, червоний для надбавок)
  const chipColor = modifier.isDiscount ? 'success' : 'error';
  const chipLabel = modifier.isDiscount 
    ? `Знижка ${formatModifierValue(displayValue)}` 
    : `Надбавка ${formatModifierValue(displayValue)}`;

  return (
    <Card variant="outlined" sx={{ 
      borderColor: isApplied ? 'primary.main' : 'divider',
      transition: 'all 0.2s',
      bgcolor: isApplied ? 'action.hover' : 'background.paper'
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isApplied}
                  onChange={(e) => onToggle(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2">{modifier.name}</Typography>
                  {modifier.description && (
                    <Typography variant="body2" color="text.secondary">
                      {modifier.description}
                    </Typography>
                  )}
                </Box>
              }
            />
          </Box>
          {isApplied && (
            <Chip
              label={chipLabel}
              color={chipColor}
              size="small"
              sx={{ mt: 1 }}
            />
          )}
        </Box>

        {isApplied && isRangeModifier && (
          <Box sx={{ px: 2, mt: 2 }}>
            <Slider
              value={displayValue}
              min={modifier.minValue}
              max={modifier.maxValue}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={formatModifierValue}
              onChange={(_, value) => onValueChange(value as number)}
              marks={[
                { value: modifier.minValue || 0, label: formatModifierValue(modifier.minValue || 0) },
                { value: modifier.maxValue || 0, label: formatModifierValue(modifier.maxValue || 0) },
              ]}
            />
          </Box>
        )}

        {isApplied && !isRangeModifier && !modifier.isPercentage && (
          <Box sx={{ px: 2, mt: 2 }}>
            <TextField
              type="number"
              label="Кількість"
              value={displayValue}
              onChange={(e) => onValueChange(Number(e.target.value))}
              size="small"
              InputProps={{
                inputProps: {
                  min: 1,
                }
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
