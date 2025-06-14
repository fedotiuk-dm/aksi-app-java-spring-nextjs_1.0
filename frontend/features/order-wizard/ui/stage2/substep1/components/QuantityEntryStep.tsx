'use client';

import {
  Box,
  Typography,
  TextField,
  Alert,
  Card,
  CardContent,
  Divider,
  InputAdornment,
} from '@mui/material';
import { Scale as ScaleIcon, Euro as PriceIcon } from '@mui/icons-material';
import React, { useState } from 'react';

interface PriceListItem {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  unit: string;
  code?: string;
}

interface QuantityEntryStepProps {
  selectedItem: PriceListItem | undefined;
  quantity: number;
  onQuantitySubmit: (quantity: number) => void;
  loading?: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export const QuantityEntryStep: React.FC<QuantityEntryStepProps> = ({
  selectedItem,
  quantity,
  onQuantitySubmit,
  loading = false,
}) => {
  const [localQuantity, setLocalQuantity] = useState(quantity || 1);
  const [error, setError] = useState<string>('');

  // ========== ОБРОБНИКИ ПОДІЙ ==========
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    setLocalQuantity(value);

    // Валідація
    if (value <= 0) {
      setError('Кількість повинна бути більше 0');
    } else if (selectedItem?.unit === 'кг' && value < 0.1) {
      setError('Мінімальна вага: 0.1 кг');
    } else if (selectedItem?.unit === 'шт' && value < 1) {
      setError('Мінімальна кількість: 1 шт');
    } else if (value > 999) {
      setError('Максимальна кількість: 999');
    } else {
      setError('');
    }
  };

  const handleSubmit = () => {
    if (!error && localQuantity > 0) {
      onQuantitySubmit(localQuantity);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !error && localQuantity > 0) {
      handleSubmit();
    }
  };

  // ========== ОБЧИСЛЕННЯ ==========
  const totalPrice = selectedItem ? selectedItem.basePrice * localQuantity : 0;
  const isValid = !error && localQuantity > 0;

  // ========== RENDER ==========
  if (!selectedItem) {
    return <Alert severity="error">Предмет не вибрано. Поверніться до попереднього кроку.</Alert>;
  }

  return (
    <Box>
      {/* Заголовок */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <ScaleIcon sx={{ mr: 1 }} />
        Введіть кількість
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Вкажіть кількість предметів для обробки.
      </Typography>

      {/* Інформація про вибраний предмет */}
      <Card variant="outlined" sx={{ mb: 3, bgcolor: 'primary.50' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {selectedItem.name}
          </Typography>

          {selectedItem.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {selectedItem.description}
            </Typography>
          )}

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <PriceIcon sx={{ fontSize: 18, mr: 0.5, color: 'success.main' }} />
              <Typography variant="body1" fontWeight="bold" color="success.main">
                {selectedItem.basePrice} грн
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary">
              за {selectedItem.unit}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Поле введення кількості */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          type="number"
          label={`Кількість (${selectedItem.unit})`}
          value={localQuantity}
          onChange={handleQuantityChange}
          onKeyPress={handleKeyPress}
          error={!!error}
          helperText={error || `Введіть кількість у ${selectedItem.unit}`}
          disabled={loading}
          inputProps={{
            min: selectedItem.unit === 'кг' ? 0.1 : 1,
            max: 999,
            step: selectedItem.unit === 'кг' ? 0.1 : 1,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ScaleIcon />
              </InputAdornment>
            ),
            endAdornment: <InputAdornment position="end">{selectedItem.unit}</InputAdornment>,
          }}
          sx={{ mb: 2 }}
        />

        {/* Підказки */}
        <Typography variant="caption" color="text.secondary">
          {selectedItem.unit === 'кг'
            ? 'Мінімум: 0.1 кг, Максимум: 999 кг'
            : 'Мінімум: 1 шт, Максимум: 999 шт'}
        </Typography>
      </Box>

      {/* Розрахунок вартості */}
      {isValid && (
        <Card variant="outlined" sx={{ mb: 3, bgcolor: 'success.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="success.main">
              Розрахунок вартості
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {selectedItem.name} × {localQuantity} {selectedItem.unit} × {selectedItem.basePrice}{' '}
                грн
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" fontWeight="bold">
                Базова вартість:
              </Typography>
              <Typography variant="h6" color="success.main" fontWeight="bold">
                {totalPrice.toFixed(2)} грн
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              * Без урахування модифікаторів та знижок
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Підтвердження */}
      {isValid && (
        <Alert severity="success">
          <Typography variant="body2">
            Готово до переходу на наступний крок. Кількість:{' '}
            <strong>
              {localQuantity} {selectedItem.unit}
            </strong>
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
