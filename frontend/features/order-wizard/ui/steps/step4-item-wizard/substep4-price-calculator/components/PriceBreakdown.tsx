'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import { formatCurrency } from '@/features/order-wizard/api/helpers/formatters';

interface PriceBreakdownProps {
  basePrice: number;
  totalPrice: number;
  modifiersImpact: Array<{
    modifierId: string;
    name: string;
    value: number;
    impact: number;
  }>;
  quantity: number;
  isLoading: boolean;
  error?: string;
}

/**
 * Компонент для детального відображення розрахунку ціни
 */
const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  basePrice,
  totalPrice,
  modifiersImpact,
  quantity,
  isLoading,
  error,
}) => {
  const totalAmount = totalPrice * quantity;
  const hasModifiers = modifiersImpact && modifiersImpact.length > 0;

  if (isLoading) {
    return (
      <Card
        variant="outlined"
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={30} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            Помилка при розрахунку ціни: {error}
          </Alert>
          <Typography variant="h6" gutterBottom>
            Базова ціна
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {formatCurrency(basePrice)}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader title="Підсумок розрахунку" />
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Базова ціна
        </Typography>
        <Typography variant="h6" gutterBottom>
          {formatCurrency(basePrice)}
        </Typography>

        {hasModifiers && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Застосовані модифікатори
            </Typography>
            <List dense>
              {modifiersImpact.map((item) => (
                <ListItem key={item.modifierId} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      item.value
                        ? `Значення: ${item.value}${
                            typeof item.value === 'number' && item.value <= 100
                              ? '%'
                              : ''
                          }`
                        : undefined
                    }
                  />
                  <Typography
                    variant="body2"
                    color={item.impact > 0 ? 'error.main' : 'success.main'}
                    fontWeight="bold"
                  >
                    {item.impact > 0 ? '+' : ''}
                    {formatCurrency(item.impact)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </>
        )}

        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle1">Ціна за одиницю:</Typography>
          <Typography
            variant="h6"
            fontWeight="bold"
            color={totalPrice > basePrice ? 'error' : 'inherit'}
          >
            {formatCurrency(totalPrice)}
          </Typography>
        </Box>

        {quantity > 1 && (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 1,
              }}
            >
              <Typography variant="subtitle1">Кількість:</Typography>
              <Typography variant="h6">{quantity} шт.</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1">Загальна сума:</Typography>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {formatCurrency(totalAmount)}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceBreakdown;
