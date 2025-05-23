'use client';

import { Calculate, TrendingUp, TrendingDown, AccountBalance } from '@mui/icons-material';
import { Box, Typography, Paper, Grid, Chip, Divider } from '@mui/material';
import React from 'react';

interface FinancialSummaryWidgetProps {
  totalAmount: number;
  discountAmount?: number;
  discountPercent?: number;
  discountType?: string;
  urgencySurcharge?: number;
  urgencyPercent?: number;
  finalAmount: number;
  prepaymentAmount?: number;
  remainingAmount?: number;
  currency?: string;
  title?: string;
  compact?: boolean;
  showBreakdown?: boolean;
}

/**
 * Компонент для відображення фінансової зводки замовлення
 */
export const FinancialSummaryWidget: React.FC<FinancialSummaryWidgetProps> = ({
  totalAmount,
  discountAmount = 0,
  discountPercent = 0,
  discountType,
  urgencySurcharge = 0,
  urgencyPercent = 0,
  finalAmount,
  prepaymentAmount = 0,
  remainingAmount,
  currency = 'грн',
  title = 'Фінансова зводка',
  compact = false,
  showBreakdown = true,
}) => {
  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  const calculatedRemaining = remainingAmount ?? finalAmount - prepaymentAmount;

  if (compact) {
    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Calculate color="primary" fontSize="small" />
          {title}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            До сплати:
          </Typography>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
            {formatCurrency(finalAmount)}
          </Typography>
        </Box>

        {prepaymentAmount > 0 && (
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}
          >
            <Typography variant="body2" color="text.secondary">
              Залишок:
            </Typography>
            <Typography
              variant="body2"
              color={calculatedRemaining > 0 ? 'warning.main' : 'success.main'}
            >
              {formatCurrency(calculatedRemaining)}
            </Typography>
          </Box>
        )}
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 3, bgcolor: 'grey.50' }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <Calculate color="primary" />
        {title}
      </Typography>

      <Grid container spacing={2}>
        {/* Загальна вартість */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Загальна вартість
            </Typography>
            <Typography variant="h6" color="text.primary">
              {formatCurrency(totalAmount)}
            </Typography>
          </Box>
        </Grid>

        {/* Надбавка за терміновість */}
        {urgencySurcharge > 0 && (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Надбавка за терміновість
              </Typography>
              <Typography
                variant="h6"
                color="warning.main"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
              >
                <TrendingUp fontSize="small" />+{formatCurrency(urgencySurcharge)}
              </Typography>
              {urgencyPercent > 0 && (
                <Chip
                  label={`+${urgencyPercent}%`}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              )}
            </Box>
          </Grid>
        )}

        {/* Знижка */}
        {discountAmount > 0 && (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Знижка
              </Typography>
              <Typography
                variant="h6"
                color="success.main"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
              >
                <TrendingDown fontSize="small" />-{formatCurrency(discountAmount)}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                {discountType && (
                  <Chip
                    label={discountType}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ mr: 0.5 }}
                  />
                )}
                {discountPercent > 0 && (
                  <Chip
                    label={`${discountPercent}%`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </Grid>
        )}

        {/* До сплати */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              До сплати
            </Typography>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
              {formatCurrency(finalAmount)}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Розбивка оплати */}
      {showBreakdown && prepaymentAmount > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Передоплата
                </Typography>
                <Typography variant="body1" color="primary.main" sx={{ fontWeight: 600 }}>
                  {formatCurrency(prepaymentAmount)}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Залишок
                </Typography>
                <Typography
                  variant="body1"
                  color={calculatedRemaining > 0 ? 'warning.main' : 'success.main'}
                  sx={{ fontWeight: 600 }}
                >
                  {formatCurrency(calculatedRemaining)}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Статус оплати
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    icon={<AccountBalance />}
                    label={calculatedRemaining <= 0 ? 'Сплачено' : 'Часткова оплата'}
                    size="small"
                    color={calculatedRemaining <= 0 ? 'success' : 'warning'}
                    variant="filled"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
};
