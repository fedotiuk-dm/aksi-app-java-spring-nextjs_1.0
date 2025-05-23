'use client';

import { LocalLaundryService } from '@mui/icons-material';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import React from 'react';

import { SectionHeader } from '../atoms';

export interface FillerOption {
  value: string;
  label: string;
}

interface FillerSelectorProps {
  fillerTypes: FillerOption[];
  selectedFillerType: string;
  fillerCompressed: boolean;
  onFillerTypeChange: (event: SelectChangeEvent<string>) => void;
  onFillerCompressedChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  showHeader?: boolean;
  showSummary?: boolean;
}

/**
 * Компонент для вибору наповнювача предмета
 */
export const FillerSelector: React.FC<FillerSelectorProps> = ({
  fillerTypes,
  selectedFillerType,
  fillerCompressed,
  onFillerTypeChange,
  onFillerCompressedChange,
  disabled = false,
  showHeader = true,
  showSummary = true,
}) => {
  const selectedFillerOption = fillerTypes.find((f) => f.value === selectedFillerType);

  return (
    <>
      {showHeader && <SectionHeader icon={LocalLaundryService} title="Наповнювач" />}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth disabled={disabled}>
            <InputLabel>Тип наповнювача</InputLabel>
            <Select
              value={selectedFillerType || ''}
              onChange={onFillerTypeChange}
              label="Тип наповнювача"
            >
              <MenuItem value="">
                <em>Наповнювач відсутній</em>
              </MenuItem>
              {fillerTypes.map((filler) => (
                <MenuItem key={filler.value} value={filler.value}>
                  {filler.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {selectedFillerType && (
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={fillerCompressed}
                  onChange={onFillerCompressedChange}
                  disabled={disabled}
                />
              }
              label="Збитий наповнювач"
            />
          </Grid>
        )}
      </Grid>

      {showSummary && selectedFillerOption && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Наповнювач:</strong> {selectedFillerOption.label}
            {fillerCompressed && ' (збитий)'}
          </Typography>
        </Alert>
      )}
    </>
  );
};
