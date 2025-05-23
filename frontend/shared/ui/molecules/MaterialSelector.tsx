'use client';

import { Texture } from '@mui/icons-material';
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

export interface MaterialOption {
  value: string;
  label: string;
}

interface MaterialSelectorProps {
  materials: MaterialOption[];
  selectedMaterial: string;
  onMaterialChange: (event: SelectChangeEvent<string>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  showHeader?: boolean;
  showSummary?: boolean;
}

/**
 * Компонент для вибору матеріалу предмета
 */
export const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  materials,
  selectedMaterial,
  onMaterialChange,
  error,
  disabled = false,
  required = false,
  showHeader = true,
  showSummary = true,
}) => {
  const selectedMaterialOption = materials.find((m) => m.value === selectedMaterial);

  return (
    <>
      {showHeader && <SectionHeader icon={Texture} title="Матеріал" />}

      <FormControl fullWidth required={required} disabled={disabled} error={!!error}>
        <InputLabel>Оберіть матеріал</InputLabel>
        <Select value={selectedMaterial || ''} onChange={onMaterialChange} label="Оберіть матеріал">
          {materials.map((material) => (
            <MenuItem key={material.value} value={material.value}>
              {material.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>

      {showSummary && selectedMaterialOption && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Обраний матеріал:</strong> {selectedMaterialOption.label}
          </Typography>
        </Alert>
      )}
    </>
  );
};
