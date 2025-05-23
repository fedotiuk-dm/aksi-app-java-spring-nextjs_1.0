'use client';

import { LocalLaundryService } from '@mui/icons-material';
import {
  Grid,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Chip,
  TextField,
} from '@mui/material';
import React from 'react';

import { SectionHeader } from '../atoms';

export interface StainOption {
  value: string;
  label: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface StainsSelectorProps {
  stains: StainOption[];
  selectedStains: string[];
  customStainDescription?: string;
  onStainToggle: (stainId: string, checked: boolean) => void;
  onCustomDescriptionChange?: (description: string) => void;
  showCustomInput?: boolean;
  disabled?: boolean;
  error?: string;
}

/**
 * Компонент для вибору плям предмета
 */
export const StainsSelector: React.FC<StainsSelectorProps> = ({
  stains,
  selectedStains,
  customStainDescription = '',
  onStainToggle,
  onCustomDescriptionChange,
  showCustomInput = false,
  disabled = false,
  error,
}) => {
  const hasOtherStain = selectedStains.includes('OTHER');

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'hard':
        return 'error';
      case 'medium':
        return 'warning';
      case 'easy':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <>
      <SectionHeader icon={LocalLaundryService} title="Виявлені плями" />

      <FormControl component="fieldset" fullWidth error={!!error}>
        <FormGroup>
          <Grid container spacing={2}>
            {stains.map((stain) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stain.value}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedStains.includes(stain.value)}
                      onChange={(e) => onStainToggle(stain.value, e.target.checked)}
                      disabled={disabled}
                    />
                  }
                  label={
                    <Chip
                      label={stain.label}
                      size="small"
                      color={getDifficultyColor(stain.difficulty) as any}
                      variant={selectedStains.includes(stain.value) ? 'filled' : 'outlined'}
                    />
                  }
                />
              </Grid>
            ))}
          </Grid>
        </FormGroup>
      </FormControl>

      {/* Кастомний опис для "Інше" */}
      {(hasOtherStain || showCustomInput) && onCustomDescriptionChange && (
        <TextField
          fullWidth
          label="Опишіть інші плями"
          placeholder="Вкажіть тип та місце розташування плям..."
          value={customStainDescription}
          onChange={(e) => onCustomDescriptionChange(e.target.value)}
          multiline
          rows={2}
          disabled={disabled}
          sx={{ mt: 2 }}
        />
      )}

      {/* Вибрані плями */}
      {selectedStains.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedStains.map((stainValue) => {
              const stain = stains.find((s) => s.value === stainValue);
              return (
                <Chip
                  key={stainValue}
                  label={stain?.label || stainValue}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              );
            })}
          </Box>
        </Box>
      )}
    </>
  );
};
