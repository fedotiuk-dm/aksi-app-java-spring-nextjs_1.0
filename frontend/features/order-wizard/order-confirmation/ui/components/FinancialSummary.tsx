'use client';

import { Grid, Card, CardContent, Typography, Stack, Box, Divider } from '@mui/material';
import React from 'react';

interface OrderTotals {
  baseAmount: number;
  modifiersAmount: number;
  subtotal: number;
  urgencySurcharge: number;
  discountType: string;
  discountPercent: number;
  discountAmount: number;
  finalTotal: number;
  paidAmount: number;
  remainingDebt: number;
  paymentMethod: string;
}

interface FinancialSummaryProps {
  totals: OrderTotals;
}

/**
 * Компонент для відображення фінансового підсумку замовлення
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення фінансового розрахунку
 * - Отримує готові дані через пропси
 * - Не містить бізнес-логіки розрахунків
 */
export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ totals }) => {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            Фінансовий розрахунок
          </Typography>

          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Вартість послуг:</Typography>
              <Typography variant="body2">{totals.baseAmount} грн</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Модифікатори:</Typography>
              <Typography variant="body2">+{totals.modifiersAmount} грн</Typography>
            </Box>

            {totals.urgencySurcharge > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="warning.main">
                  Націнка за терміновість:
                </Typography>
                <Typography variant="body2" color="warning.main">
                  +{totals.urgencySurcharge} грн
                </Typography>
              </Box>
            )}

            {totals.discountAmount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="success.main">
                  Знижка {totals.discountType} ({totals.discountPercent}%):
                </Typography>
                <Typography variant="body2" color="success.main">
                  -{totals.discountAmount} грн
                </Typography>
              </Box>
            )}

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Загальна вартість:</Typography>
              <Typography variant="h6" color="primary">
                {totals.finalTotal} грн
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Сплачено:</Typography>
              <Typography variant="body2">{totals.paidAmount} грн</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Залишок до сплати:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {totals.remainingDebt} грн
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Спосіб оплати: {totals.paymentMethod}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default FinancialSummary;
