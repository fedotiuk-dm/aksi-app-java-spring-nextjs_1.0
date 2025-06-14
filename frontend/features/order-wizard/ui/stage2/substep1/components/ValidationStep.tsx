'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Category as CategoryIcon,
  ShoppingBag as ItemIcon,
  Scale as QuantityIcon,
  Euro as PriceIcon,
} from '@mui/icons-material';
import React from 'react';

interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
}

interface PriceListItem {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  unit: string;
  code?: string;
}

interface ValidationStepProps {
  selectedCategory: ServiceCategory | undefined;
  selectedItem: PriceListItem | undefined;
  quantity: number;
  totalPrice: number;
  loading?: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export const ValidationStep: React.FC<ValidationStepProps> = ({
  selectedCategory,
  selectedItem,
  quantity,
  totalPrice,
  loading = false,
}) => {
  // ========== ВАЛІДАЦІЯ ==========
  const isValid = selectedCategory && selectedItem && quantity > 0;

  // ========== RENDER ==========
  if (!isValid) {
    return (
      <Alert severity="error">
        Не всі дані заповнені. Поверніться до попередніх кроків для завершення.
      </Alert>
    );
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
        <CheckIcon sx={{ mr: 1, color: 'success.main' }} />
        Підтвердження інформації
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Перевірте правильність введених даних перед завершенням.
      </Typography>

      {/* Підсумок інформації */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Підсумок предмета
          </Typography>

          <List>
            {/* Категорія */}
            <ListItem>
              <ListItemIcon>
                <CategoryIcon color="primary" />
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Категорія послуги
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedCategory.name}
                </Typography>
              </Box>
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* Предмет */}
            <ListItem>
              <ListItemIcon>
                <ItemIcon color="primary" />
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Найменування предмета
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedItem.name}
                </Typography>
                {selectedItem.description && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.25 }}
                  >
                    {selectedItem.description}
                  </Typography>
                )}
                {selectedItem.code && (
                  <Chip
                    label={`Код: ${selectedItem.code}`}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                )}
              </Box>
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* Кількість */}
            <ListItem>
              <ListItemIcon>
                <QuantityIcon color="primary" />
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Кількість
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {quantity} {selectedItem.unit}
                </Typography>
              </Box>
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* Ціна */}
            <ListItem>
              <ListItemIcon>
                <PriceIcon color="success" />
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Базова ціна
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedItem.basePrice} грн за {selectedItem.unit}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.25 }}
                >
                  Загалом: {quantity} × {selectedItem.basePrice} = {totalPrice.toFixed(2)} грн
                </Typography>
              </Box>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Фінальна вартість */}
      <Card variant="outlined" sx={{ mb: 3, bgcolor: 'success.50' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="success.main">
            Базова вартість предмета
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="body1">
              {selectedItem.name} × {quantity} {selectedItem.unit}
            </Typography>
            <Typography variant="h5" color="success.main" fontWeight="bold">
              {totalPrice.toFixed(2)} грн
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Увага:</strong> Це базова вартість без урахування модифікаторів, знижок та
              додаткових послуг. Фінальна ціна буде розрахована на наступних етапах.
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* Підтвердження готовності */}
      <Alert severity="success">
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Основна інформація заповнена!</strong>
        </Typography>
        <Typography variant="body2">
          Натисніть &quot;Завершити підетап&quot; для переходу до наступного кроку - вибору
          характеристик предмета.
        </Typography>
      </Alert>
    </Box>
  );
};
