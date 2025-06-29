'use client';

import { Palette } from '@mui/icons-material';
import { Grid, TextField, InputAdornment, Autocomplete, Box, Chip } from '@mui/material';
import React from 'react';

import { SectionHeader } from '../atoms';

interface ColorSelectorProps {
  color: string;
  baseColors: string[];
  onColorChange: (event: React.SyntheticEvent, value: string | null) => void;
  onColorTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  showHeader?: boolean;
  showSummary?: boolean;
}

/**
 * Компонент для вибору кольору предмета
 */
export const ColorSelector: React.FC<ColorSelectorProps> = ({
  color,
  baseColors,
  onColorChange,
  onColorTextChange,
  error,
  disabled = false,
  showHeader = true,
  showSummary = true,
}) => {
  return (
    <>
      {showHeader && <SectionHeader icon={Palette} title="Колір" />}

      <Grid container spacing={3}>
        {/* Швидкий вибір кольору */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            options={baseColors}
            value={color}
            onChange={onColorChange}
            freeSolo
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Колір предмета"
                placeholder="Оберіть або введіть колір"
                error={!!error}
                helperText={error || 'Оберіть зі списку або введіть власний колір'}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Palette />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* Текстове поле для кольору */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Або введіть колір вручну"
            placeholder="Наприклад: темно-зелений"
            value={color}
            onChange={onColorTextChange}
            error={!!error}
            helperText="Опишіть колір максимально точно"
            disabled={disabled}
          />
        </Grid>
      </Grid>

      {showSummary && color && (
        <Box sx={{ mt: 2 }}>
          <Chip label={`Колір: ${color}`} color="primary" variant="outlined" />
        </Box>
      )}
    </>
  );
};
