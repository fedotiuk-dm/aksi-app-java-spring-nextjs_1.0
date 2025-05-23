'use client';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React from 'react';

interface WearLevel {
  id: string;
  name: string;
  description: string;
}

interface WearLevelSelectorProps {
  wearLevels: WearLevel[];
  selectedWearLevelId: string;
  onWearLevelChange: (wearLevelId: string) => void;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Компонент для вибору ступеня зносу предмета
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення селектора ступеня зносу
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки
 */
export const WearLevelSelector: React.FC<WearLevelSelectorProps> = ({
  wearLevels,
  selectedWearLevelId,
  onWearLevelChange,
  disabled = false,
  required = false,
}) => {
  return (
    <FormControl fullWidth required={required} disabled={disabled}>
      <InputLabel>Ступінь зносу</InputLabel>
      <Select
        value={selectedWearLevelId}
        onChange={(e) => onWearLevelChange(e.target.value)}
        label="Ступінь зносу"
      >
        {wearLevels.map((level) => (
          <MenuItem key={level.id} value={level.id}>
            {level.name} - {level.description}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default WearLevelSelector;
