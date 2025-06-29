'use client';

import { AccountBalance, TrendingUp, LocalOffer } from '@mui/icons-material';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import React from 'react';

interface FinancialSummaryCardProps {
  baseAmount: number;
  modifiersAmount?: number;
  subtotal: number;
  urgencySurcharge?: number;
  discountType?: string;
  discountPercent?: number;
  discountAmount?: number;
  finalTotal: number;
  paidAmount?: number;
  remainingDebt?: number;
  paymentMethod?: string;
  title?: string;
  showIcons?: boolean;
  currency?: string;
}

/**
 * Компонент для відображення фінансової інформації замовлення
 */
export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  baseAmount,
  modifiersAmount = 0,
  subtotal,
  urgencySurcharge = 0,
  discountType,
  discountPercent = 0,
  discountAmount = 0,
  finalTotal,
  paidAmount = 0,
  remainingDebt = 0,
  paymentMethod,
  title = 'Фінансова інформація',
  showIcons = true,
  currency = 'грн',
}) => {
  const SUCCESS_COLOR = 'success.main';

  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  const getPaymentMethodLabel = (method: string): string => {
    switch (method?.toUpperCase()) {
      case 'TERMINAL':
        return 'Термінал';
      case 'CASH':
        return 'Готівка';
      case 'ACCOUNT':
        return 'На рахунок';
      default:
        return method || 'Не вказано';
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          {showIcons && <AccountBalance color="primary" />}
          {title}
        </Typography>

        <Table size="small">
          <TableBody>
            {/* Базова сума */}
            <TableRow>
              <TableCell>Базова вартість послуг</TableCell>
              <TableCell align="right">{formatCurrency(baseAmount)}</TableCell>
            </TableRow>

            {/* Модифікатори */}
            {modifiersAmount !== 0 && (
              <TableRow>
                <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {showIcons && <TrendingUp fontSize="small" />}
                  Модифікатори ціни
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: modifiersAmount >= 0 ? SUCCESS_COLOR : 'error.main' }}
                >
                  {modifiersAmount >= 0 ? '+' : ''}
                  {formatCurrency(modifiersAmount)}
                </TableCell>
              </TableRow>
            )}

            {/* Надбавка за терміновість */}
            {urgencySurcharge > 0 && (
              <TableRow>
                <TableCell>Надбавка за терміновість</TableCell>
                <TableCell align="right" sx={{ color: 'warning.main' }}>
                  +{formatCurrency(urgencySurcharge)}
                </TableCell>
              </TableRow>
            )}

            {/* Проміжна сума */}
            <TableRow>
              <TableCell sx={{ fontWeight: 'medium' }}>Сума до знижки</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                {formatCurrency(subtotal)}
              </TableCell>
            </TableRow>

            {/* Знижка */}
            {discountAmount > 0 && (
              <TableRow>
                <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {showIcons && <LocalOffer fontSize="small" />}
                  <Box>
                    Знижка
                    {discountType && (
                      <Chip
                        label={`${discountType} ${discountPercent > 0 ? `(${discountPercent}%)` : ''}`}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ color: SUCCESS_COLOR }}>
                  -{formatCurrency(discountAmount)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        {/* Фінальна сума */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary">
            Загальна вартість:
          </Typography>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            {formatCurrency(finalTotal)}
          </Typography>
        </Box>

        {/* Оплата */}
        {paidAmount > 0 && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2">
                <strong>Сплачено:</strong> {formatCurrency(paidAmount)}
              </Typography>
              {paymentMethod && (
                <Typography variant="body2" color="text.secondary">
                  Спосіб оплати: {getPaymentMethodLabel(paymentMethod)}
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="body2"
                color={remainingDebt > 0 ? 'warning.main' : SUCCESS_COLOR}
              >
                <strong>До доплати:</strong> {formatCurrency(remainingDebt)}
              </Typography>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
