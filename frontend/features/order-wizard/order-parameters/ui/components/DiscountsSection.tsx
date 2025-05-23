'use client';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import React from 'react';

interface DiscountOption {
  id: string;
  name: string;
  percent: number;
}

interface DiscountsSectionProps {
  discountType: string;
  discountOptions: DiscountOption[];
  customDiscountPercent: number;
  onDiscountTypeChange: (discountType: string) => void;
  onCustomDiscountChange: (percent: number) => void;
  disabled?: boolean;
}

/**
 * Компонент для налаштування знижок на замовлення
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення секції знижок
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки розрахунків
 */
export const DiscountsSection: React.FC<DiscountsSectionProps> = ({
  discountType,
  discountOptions,
  customDiscountPercent,
  onDiscountTypeChange,
  onCustomDiscountChange,
  disabled = false,
}) => {
  const showCustomInput = discountType === 'custom';

  return (
    <Grid size={{ xs: 12 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Знижки
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Знижки не діють на прасування, прання і фарбування текстилю
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={disabled}>
                <InputLabel>Тип знижки</InputLabel>
                <Select
                  value={discountType}
                  onChange={(e) => onDiscountTypeChange(e.target.value)}
                  label="Тип знижки"
                >
                  {discountOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                      {option.percent > 0 && ` (${option.percent}%)`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {showCustomInput && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  disabled={disabled}
                  label="Відсоток знижки"
                  type="number"
                  value={customDiscountPercent}
                  onChange={(e) => onCustomDiscountChange(Number(e.target.value))}
                  inputProps={{ min: 0, max: 50 }}
                  helperText="Максимум 50%"
                />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DiscountsSection;
