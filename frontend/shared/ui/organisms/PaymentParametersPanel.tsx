'use client';

import { Payment } from '@mui/icons-material';
import { Box, Typography, Divider, Grid } from '@mui/material';
import React from 'react';

import {
  PaymentMethodSelector,
  PaymentMethodOption,
  FinancialSummaryWidget,
  PrepaymentAmountField,
} from '../molecules';

interface PaymentParametersPanelProps {
  // Payment method
  paymentMethods: PaymentMethodOption[];
  selectedPaymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
  paymentMethodError?: string;

  // Financial data
  totalAmount: number;
  discountAmount?: number;
  discountPercent?: number;
  discountType?: string;
  urgencySurcharge?: number;
  urgencyPercent?: number;
  finalAmount: number;

  // Prepayment
  prepaymentAmount: number;
  onPrepaymentChange: (amount: number) => void;
  prepaymentError?: string;
  maxPrepayment?: number;
  minPrepayment?: number;

  // Configuration
  disabled?: boolean;
  compact?: boolean;
  title?: string;
  description?: string;
  currency?: string;
  showFinancialSummary?: boolean;
  showPrepayment?: boolean;
  enablePrepaymentSlider?: boolean;
}

/**
 * Панель параметрів оплати замовлення
 */
export const PaymentParametersPanel: React.FC<PaymentParametersPanelProps> = ({
  paymentMethods,
  selectedPaymentMethod,
  onPaymentMethodChange,
  paymentMethodError,
  totalAmount,
  discountAmount = 0,
  discountPercent = 0,
  discountType,
  urgencySurcharge = 0,
  urgencyPercent = 0,
  finalAmount,
  prepaymentAmount,
  onPrepaymentChange,
  prepaymentError,
  maxPrepayment,
  minPrepayment = 0,
  disabled = false,
  compact = false,
  title = 'Параметри оплати',
  description = 'Оберіть спосіб оплати та вкажіть суму передоплати',
  currency = 'грн',
  showFinancialSummary = true,
  showPrepayment = true,
  enablePrepaymentSlider = false,
}) => {
  return (
    <Box sx={{ p: compact ? 2 : 3 }}>
      {/* Заголовок секції */}
      {!compact && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Payment color="primary" />
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Фінансова зводка */}
        {showFinancialSummary && (
          <Grid size={{ xs: 12 }}>
            <FinancialSummaryWidget
              totalAmount={totalAmount}
              discountAmount={discountAmount}
              discountPercent={discountPercent}
              discountType={discountType}
              urgencySurcharge={urgencySurcharge}
              urgencyPercent={urgencyPercent}
              finalAmount={finalAmount}
              prepaymentAmount={prepaymentAmount}
              currency={currency}
              compact={compact}
              showBreakdown={showPrepayment && prepaymentAmount > 0}
            />
          </Grid>
        )}

        {/* Розділювач */}
        {showFinancialSummary && !compact && (
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
          </Grid>
        )}

        {/* Спосіб оплати */}
        <Grid size={{ xs: 12, md: showPrepayment ? 6 : 12 }}>
          <PaymentMethodSelector
            options={paymentMethods}
            selectedValue={selectedPaymentMethod}
            onChange={onPaymentMethodChange}
            disabled={disabled}
            error={paymentMethodError}
            title={compact ? 'Спосіб оплати' : undefined}
            description={compact ? 'Оберіть зручний спосіб оплати' : undefined}
            variant={compact ? 'compact' : 'standard'}
          />
        </Grid>

        {/* Сума передоплати */}
        {showPrepayment && (
          <Grid size={{ xs: 12, md: 6 }}>
            <PrepaymentAmountField
              value={prepaymentAmount}
              onChange={onPrepaymentChange}
              totalAmount={finalAmount}
              maxAmount={maxPrepayment}
              minAmount={minPrepayment}
              disabled={disabled}
              error={prepaymentError}
              currency={currency}
              title={compact ? 'Передоплата' : undefined}
              description={compact ? 'Вкажіть суму передоплати' : undefined}
              showSlider={enablePrepaymentSlider}
              variant={compact ? 'compact' : 'standard'}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
