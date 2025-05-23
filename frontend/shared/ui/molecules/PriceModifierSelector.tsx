'use client';

import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Tooltip,
  Chip,
} from '@mui/material';
import React from 'react';

export interface PriceModifier {
  id: string;
  label: string;
  description: string;
  value: number;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  applicable?: boolean;
  customizable?: boolean;
  min?: number;
  max?: number;
}

interface PriceModifierSelectorProps {
  modifiers: PriceModifier[];
  selectedModifiers: string[];
  onModifierChange: (modifierId: string, checked: boolean, customValue?: number) => void;
  disabled?: boolean;
  showTooltips?: boolean;
}

/**
 * Компонент для вибору модифікаторів ціни
 */
export const PriceModifierSelector: React.FC<PriceModifierSelectorProps> = ({
  modifiers,
  selectedModifiers,
  onModifierChange,
  disabled = false,
  showTooltips = true,
}) => {
  const formatModifierValue = (modifier: PriceModifier): string => {
    if (modifier.type === 'PERCENTAGE') {
      return modifier.value >= 0 ? `+${modifier.value}%` : `${modifier.value}%`;
    } else {
      return `${modifier.value} грн`;
    }
  };

  const getModifierColor = (modifier: PriceModifier): 'success' | 'error' | 'warning' => {
    if (modifier.value > 0) return 'success';
    if (modifier.value < 0) return 'error';
    return 'warning';
  };

  return (
    <FormControl component="fieldset" fullWidth>
      <FormGroup>
        {modifiers.map((modifier) => {
          const isSelected = selectedModifiers.includes(modifier.id);
          const isApplicable = modifier.applicable !== false;

          const modifierControl = (
            <FormControlLabel
              key={modifier.id}
              control={
                <Checkbox
                  checked={isSelected}
                  onChange={(e) => onModifierChange(modifier.id, e.target.checked)}
                  disabled={disabled || !isApplicable}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body2">{modifier.label}</Typography>
                  <Chip
                    label={formatModifierValue(modifier)}
                    size="small"
                    color={getModifierColor(modifier)}
                    variant="outlined"
                  />
                  {modifier.customizable && (
                    <Chip label="Кастомне значення" size="small" variant="outlined" color="info" />
                  )}
                </Box>
              }
              sx={{
                alignItems: 'flex-start',
                '& .MuiFormControlLabel-label': {
                  mt: 0.5,
                },
              }}
            />
          );

          if (showTooltips && modifier.description) {
            return (
              <Tooltip key={modifier.id} title={modifier.description} placement="right">
                <Box>{modifierControl}</Box>
              </Tooltip>
            );
          }

          return modifierControl;
        })}
      </FormGroup>
    </FormControl>
  );
};
