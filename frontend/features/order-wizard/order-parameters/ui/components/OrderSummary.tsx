'use client';

import { Grid, Card, CardContent, Typography, Stack, Box, Divider } from '@mui/material';
import React from 'react';

interface CalculatedTotals {
  baseAmount: number;
  urgencySurcharge: number;
  totalWithUrgency: number;
  discountPercent: number;
  discountAmount: number;
  finalTotal: number;
  paidAmount: number;
  remainingDebt: number;
}

interface OrderSummaryProps {
  calculatedTotals: CalculatedTotals;
}

/**
 * Компонент для відображення підсумку розрахунків замовлення
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення підсумку
 * - Отримує готові розрахунки через пропси
 * - Не містить бізнес-логіки розрахунків
 */
export const OrderSummary: React.FC<OrderSummaryProps> = ({ calculatedTotals }) => {
  return (
    <Grid size={{ xs: 12 }}>
      <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            Підсумок розрахунків
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Вартість послуг:</Typography>
              <Typography variant="body2">{calculatedTotals.baseAmount.toFixed(2)} грн</Typography>
            </Box>

            {calculatedTotals.urgencySurcharge > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="warning.main">
                  Націнка за терміновість:
                </Typography>
                <Typography variant="body2" color="warning.main">
                  +{calculatedTotals.urgencySurcharge.toFixed(2)} грн
                </Typography>
              </Box>
            )}

            {calculatedTotals.discountAmount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="success.main">
                  Знижка ({calculatedTotals.discountPercent}%):
                </Typography>
                <Typography variant="body2" color="success.main">
                  -{calculatedTotals.discountAmount.toFixed(2)} грн
                </Typography>
              </Box>
            )}

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">До сплати:</Typography>
              <Typography variant="h6" color="primary">
                {calculatedTotals.finalTotal.toFixed(2)} грн
              </Typography>
            </Box>

            {calculatedTotals.paidAmount > 0 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Сплачено:</Typography>
                  <Typography variant="body2">
                    {calculatedTotals.paidAmount.toFixed(2)} грн
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Залишок:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {calculatedTotals.remainingDebt.toFixed(2)} грн
                  </Typography>
                </Box>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default OrderSummary;
