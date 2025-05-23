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
  TextField,
} from '@mui/material';
import React from 'react';

interface StainType {
  id: string;
  name: string;
  risk: string;
}

interface StainsSelectorProps {
  stainTypes: StainType[];
  selectedStains: string[];
  customStain: string;
  onStainToggle: (stainId: string) => void;
  onCustomStainChange: (value: string) => void;
  getStainRiskColor: (risk: string) => 'error' | 'warning' | 'success' | 'default';
  disabled?: boolean;
}

/**
 * Компонент для вибору плям та забруднень
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення секції плям
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки
 */
export const StainsSelector: React.FC<StainsSelectorProps> = ({
  stainTypes,
  selectedStains,
  customStain,
  onStainToggle,
  onCustomStainChange,
  getStainRiskColor,
  disabled = false,
}) => {
  const showCustomStainInput = selectedStains.includes('other');

  return (
    <Grid size={{ xs: 12 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Плями та забруднення
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Виберіть усі виявлені типи плям
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {stainTypes.map((stain) => (
              <FormControlLabel
                key={stain.id}
                control={
                  <Checkbox
                    checked={selectedStains.includes(stain.id)}
                    onChange={() => !disabled && onStainToggle(stain.id)}
                    disabled={disabled}
                  />
                }
                label={
                  <Chip
                    label={stain.name}
                    color={getStainRiskColor(stain.risk)}
                    variant={selectedStains.includes(stain.id) ? 'filled' : 'outlined'}
                    size="small"
                  />
                }
              />
            ))}
          </Box>

          {showCustomStainInput && (
            <TextField
              fullWidth
              disabled={disabled}
              label="Опишіть інші плями"
              value={customStain}
              onChange={(e) => onCustomStainChange(e.target.value)}
              placeholder="Наприклад: розчинник, фарба, їжа"
              sx={{ mt: 2 }}
            />
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default StainsSelector;
