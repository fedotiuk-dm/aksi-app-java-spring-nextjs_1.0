'use client';

import { LinearScale } from '@mui/icons-material';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import React from 'react';

import { SectionHeader } from '../atoms';

export interface WearLevelOption {
  value: string;
  label: string;
}

interface WearLevelSelectorProps {
  wearLevels: WearLevelOption[];
  selectedWearLevel: string;
  onWearLevelChange: (event: SelectChangeEvent<string>) => void;
  disabled?: boolean;
  showHeader?: boolean;
  showSummary?: boolean;
}

/**
 * Компонент для вибору ступеня зносу предмета
 */
export const WearLevelSelector: React.FC<WearLevelSelectorProps> = ({
  wearLevels,
  selectedWearLevel,
  onWearLevelChange,
  disabled = false,
  showHeader = true,
  showSummary = true,
}) => {
  const selectedWearOption = wearLevels.find((w) => w.value === selectedWearLevel);

  return (
    <>
      {showHeader && <SectionHeader icon={LinearScale} title="Ступінь зносу" />}

      <FormControl fullWidth disabled={disabled}>
        <InputLabel>Оберіть ступінь зносу</InputLabel>
        <Select
          value={selectedWearLevel || ''}
          onChange={onWearLevelChange}
          label="Оберіть ступінь зносу"
        >
          <MenuItem value="">
            <em>Не вказано</em>
          </MenuItem>
          {wearLevels.map((level) => (
            <MenuItem key={level.value} value={level.value}>
              {level.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Виберіть приблизний відсоток зносу предмета</FormHelperText>
      </FormControl>

      {showSummary && selectedWearOption && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Ступінь зносу:</strong> {selectedWearOption.label}
          </Typography>
        </Alert>
      )}
    </>
  );
};
