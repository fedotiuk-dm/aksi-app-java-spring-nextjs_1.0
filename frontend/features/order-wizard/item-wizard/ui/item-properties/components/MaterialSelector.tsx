'use client';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React from 'react';

interface Material {
  id: string;
  name: string;
}

interface MaterialSelectorProps {
  materials: Material[];
  selectedMaterialId: string;
  onMaterialChange: (materialId: string) => void;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Компонент для вибору матеріалу предмета
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення селектора матеріалів
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки
 */
export const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  materials,
  selectedMaterialId,
  onMaterialChange,
  disabled = false,
  required = false,
}) => {
  return (
    <FormControl fullWidth required={required} disabled={disabled}>
      <InputLabel>Матеріал</InputLabel>
      <Select
        value={selectedMaterialId}
        onChange={(e) => onMaterialChange(e.target.value)}
        label="Матеріал"
      >
        {materials.map((material) => (
          <MenuItem key={material.id} value={material.id}>
            {material.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MaterialSelector;
