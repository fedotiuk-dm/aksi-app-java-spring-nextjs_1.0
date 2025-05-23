'use client';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Chip,
} from '@mui/material';
import React from 'react';

interface DefectType {
  id: string;
  name: string;
  category: string;
}

interface DefectsSelectorProps {
  defectTypes: DefectType[];
  selectedDefects: string[];
  onDefectToggle: (defectId: string) => void;
  getDefectCategoryColor: (
    category: string
  ) => 'error' | 'warning' | 'info' | 'secondary' | 'default';
  disabled?: boolean;
}

/**
 * Компонент для вибору дефектів та ризиків
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення секції дефектів
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки
 */
export const DefectsSelector: React.FC<DefectsSelectorProps> = ({
  defectTypes,
  selectedDefects,
  onDefectToggle,
  getDefectCategoryColor,
  disabled = false,
}) => {
  return (
    <Grid size={{ xs: 12 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Дефекти та ризики
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Відмітьте виявлені дефекти та потенційні ризики
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {defectTypes.map((defect) => (
              <FormControlLabel
                key={defect.id}
                control={
                  <Checkbox
                    checked={selectedDefects.includes(defect.id)}
                    onChange={() => !disabled && onDefectToggle(defect.id)}
                    disabled={disabled}
                  />
                }
                label={
                  <Chip
                    label={defect.name}
                    color={getDefectCategoryColor(defect.category)}
                    variant={selectedDefects.includes(defect.id) ? 'filled' : 'outlined'}
                    size="small"
                  />
                }
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DefectsSelector;
