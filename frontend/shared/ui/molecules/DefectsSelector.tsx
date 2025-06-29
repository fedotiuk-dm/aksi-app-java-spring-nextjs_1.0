'use client';

import { ReportProblem } from '@mui/icons-material';
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

export interface DefectOption {
  value: string;
  label: string;
  severity?: 'low' | 'medium' | 'high';
}

interface DefectsSelectorProps {
  defects: DefectOption[];
  selectedDefects: string[];
  customDefectDescription?: string;
  onDefectToggle: (defectId: string, checked: boolean) => void;
  onCustomDescriptionChange?: (description: string) => void;
  showCustomInput?: boolean;
  disabled?: boolean;
  error?: string;
}

/**
 * Компонент для вибору дефектів предмета
 */
export const DefectsSelector: React.FC<DefectsSelectorProps> = ({
  defects,
  selectedDefects,
  customDefectDescription = '',
  onDefectToggle,
  onCustomDescriptionChange,
  showCustomInput = false,
  disabled = false,
  error,
}) => {
  const hasOtherDefect = selectedDefects.includes('OTHER');

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <>
      <SectionHeader icon={ReportProblem} title="Дефекти та ризики" />

      <FormControl component="fieldset" fullWidth error={!!error}>
        <FormGroup>
          <Grid container spacing={2}>
            {defects.map((defect) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={defect.value}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedDefects.includes(defect.value)}
                      onChange={(e) => onDefectToggle(defect.value, e.target.checked)}
                      disabled={disabled}
                    />
                  }
                  label={
                    <Chip
                      label={defect.label}
                      size="small"
                      color={getSeverityColor(defect.severity) as any}
                      variant={selectedDefects.includes(defect.value) ? 'filled' : 'outlined'}
                    />
                  }
                />
              </Grid>
            ))}
          </Grid>
        </FormGroup>
      </FormControl>

      {/* Кастомний опис для "Інше" */}
      {(hasOtherDefect || showCustomInput) && onCustomDescriptionChange && (
        <TextField
          fullWidth
          label="Опишіть інші дефекти"
          placeholder="Вкажіть додаткові дефекти або ризики..."
          value={customDefectDescription}
          onChange={(e) => onCustomDescriptionChange(e.target.value)}
          multiline
          rows={2}
          disabled={disabled}
          sx={{ mt: 2 }}
        />
      )}

      {/* Вибрані дефекти */}
      {selectedDefects.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedDefects.map((defectValue) => {
              const defect = defects.find((d) => d.value === defectValue);
              return (
                <Chip
                  key={defectValue}
                  label={defect?.label || defectValue}
                  size="small"
                  color="error"
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
