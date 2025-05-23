'use client';

import { Grid, Typography, Stack, Chip, TextField } from '@mui/material';
import React from 'react';

interface Color {
  id: string;
  name: string;
  hex: string;
}

interface ColorPickerProps {
  colors: Color[];
  selectedColorId: string;
  customColor: string;
  onColorSelect: (colorId: string) => void;
  onCustomColorChange: (color: string) => void;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Компонент для вибору кольору предмета з базових кольорів або власного
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення селектора кольорів
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColorId,
  customColor,
  onColorSelect,
  onCustomColorChange,
  disabled = false,
  required = false,
}) => {
  const showCustomColorInput = selectedColorId === 'custom';

  return (
    <>
      {/* Базові кольори */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="subtitle2" gutterBottom>
          Колір предмета {required && '*'}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
          {colors.map((color) => (
            <Chip
              key={color.id}
              label={color.name}
              variant={selectedColorId === color.id ? 'filled' : 'outlined'}
              onClick={() => !disabled && onColorSelect(color.id)}
              disabled={disabled}
              sx={{
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: color.hex,
                  border: '1px solid #ccc',
                  marginRight: 0.5,
                },
              }}
            />
          ))}
          <Chip
            label="Інший колір"
            variant={selectedColorId === 'custom' ? 'filled' : 'outlined'}
            onClick={() => !disabled && onColorSelect('custom')}
            color="primary"
            disabled={disabled}
          />
        </Stack>
      </Grid>

      {/* Власний колір */}
      {showCustomColorInput && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required={required}
            disabled={disabled}
            label="Вкажіть колір"
            value={customColor}
            onChange={(e) => onCustomColorChange(e.target.value)}
            placeholder="Наприклад: темно-зелений, бордовий"
          />
        </Grid>
      )}
    </>
  );
};

export default ColorPicker;
