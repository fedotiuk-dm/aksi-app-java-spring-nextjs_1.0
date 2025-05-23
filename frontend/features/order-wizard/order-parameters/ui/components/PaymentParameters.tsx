/**
 * Компонент параметрів оплати замовлення
 *
 * Відповідає розділу 3.3 з документації Order Wizard:
 * - Спосіб оплати (вибір один):
 *   • Термінал
 *   • Готівка
 *   • На рахунок
 * - Фінансові деталі:
 *   • Загальна вартість (сума всіх предметів з урахуванням знижок/надбавок)
 *   • Сплачено (поле для введення суми передоплати)
 *   • Борг (розраховується автоматично як різниця)
 */

'use client';

import {
  Payment,
  CreditCard,
  Money,
  AccountBalance,
  Calculate,
  TrendingUp,
  TrendingDown,
  Info,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Alert,
  Chip,
  Divider,
  Paper,
  Grid,
  InputAdornment,
} from '@mui/material';
import React from 'react';

import { useOrderParameters, PaymentMethod } from '@/domain/order';

/**
 * Props для PaymentParameters компонента
 */
interface PaymentParametersProps {
  /**
   * Чи компонент доступний для редагування
   */
  disabled?: boolean;

  /**
   * Чи показувати компактну версію
   */
  compact?: boolean;
}

/**
 * Компонент параметрів оплати замовлення
 */
export const PaymentParameters: React.FC<PaymentParametersProps> = ({
  disabled = false,
  compact = false,
}) => {
  // Отримуємо всю функціональність з domain layer
  const { paymentParams, paymentMethods, setPaymentMethod, setPrepaymentAmount, validationErrors } =
    useOrderParameters();

  /**
   * Обробник зміни способу оплати
   */
  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const method = event.target.value as PaymentMethod;
    setPaymentMethod(method);
  };

  /**
   * Обробник зміни суми передоплати
   */
  const handlePrepaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(event.target.value);
    setPrepaymentAmount(amount);
  };

  /**
   * Отримання іконки для способу оплати
   */
  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.TERMINAL:
        return <CreditCard />;
      case PaymentMethod.CASH:
        return <Money />;
      case PaymentMethod.BANK_TRANSFER:
        return <AccountBalance />;
      default:
        return <Payment />;
    }
  };

  /**
   * Отримання кольору для способу оплати
   */
  const getPaymentColor = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.TERMINAL:
        return 'primary';
      case PaymentMethod.CASH:
        return 'success';
      case PaymentMethod.BANK_TRANSFER:
        return 'info';
      default:
        return 'default';
    }
  };

  /**
   * Форматування грошової суми
   */
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

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
            Параметри оплати
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Оберіть спосіб оплати та вкажіть суму передоплати
          </Typography>
        </Box>
      )}

      {/* Фінансова зводка */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Calculate color="primary" />
          Фінансова зводка
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Загальна вартість
              </Typography>
              <Typography variant="h6" color="text.primary">
                {formatCurrency(paymentParams.totalAmount)} грн
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Знижка
              </Typography>
              <Typography
                variant="h6"
                color="error.main"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
              >
                <TrendingDown fontSize="small" />-{formatCurrency(paymentParams.discountAmount)} грн
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                До сплати
              </Typography>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                {formatCurrency(paymentParams.finalAmount)} грн
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Залишок
              </Typography>
              <Typography
                variant="h6"
                color={paymentParams.balanceAmount > 0 ? 'warning.main' : 'success.main'}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
              >
                {paymentParams.balanceAmount > 0 ? <TrendingUp fontSize="small" /> : '✓'}
                {formatCurrency(paymentParams.balanceAmount)} грн
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Способи оплати */}
      <FormControl component="fieldset" sx={{ mb: 3 }} disabled={disabled} fullWidth>
        <FormLabel component="legend" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Спосіб оплати
          </Typography>
        </FormLabel>

        <RadioGroup
          value={paymentParams.paymentMethod}
          onChange={handlePaymentMethodChange}
          sx={{ gap: 1 }}
        >
          {paymentMethods.map((method) => (
            <Box key={method.value} sx={{ mb: 1 }}>
              <FormControlLabel
                value={method.value}
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getPaymentIcon(method.value)}
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {method.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {method.description}
                      </Typography>
                    </Box>

                    <Chip
                      size="small"
                      label={
                        method.value === PaymentMethod.CASH
                          ? 'Готівка'
                          : method.value === PaymentMethod.TERMINAL
                            ? 'Картка'
                            : 'Переказ'
                      }
                      color={getPaymentColor(method.value) as any}
                      variant="outlined"
                    />
                  </Box>
                }
                sx={{
                  m: 0,
                  p: 1.5,
                  border: '1px solid',
                  borderColor:
                    paymentParams.paymentMethod === method.value ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  backgroundColor:
                    paymentParams.paymentMethod === method.value
                      ? 'action.selected'
                      : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  width: '100%',
                }}
              />
            </Box>
          ))}
        </RadioGroup>

        {/* Помилка валідації способу оплати */}
        {validationErrors.paymentMethod && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {validationErrors.paymentMethod}
          </Alert>
        )}
      </FormControl>

      <Divider sx={{ my: 2 }} />

      {/* Передоплата */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Передоплата
        </Typography>

        <TextField
          fullWidth
          type="number"
          label="Сума передоплати"
          value={paymentParams.prepaymentAmount}
          onChange={handlePrepaymentChange}
          disabled={disabled}
          inputProps={{
            min: 0,
            max: paymentParams.finalAmount,
            step: 0.01,
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">₴</InputAdornment>,
          }}
          helperText={
            validationErrors.prepaymentAmount ||
            `Максимальна сума: ${formatCurrency(paymentParams.finalAmount)} грн`
          }
          error={!!validationErrors.prepaymentAmount}
          sx={{ maxWidth: 300 }}
        />

        {/* Інформація про передоплату */}
        <Box sx={{ mt: 2 }}>
          {paymentParams.prepaymentAmount === 0 && (
            <Alert severity="info" icon={<Info />}>
              <Typography variant="body2">
                Передоплата не вказана - повна оплата при отриманні замовлення
              </Typography>
            </Alert>
          )}

          {paymentParams.prepaymentAmount > 0 &&
            paymentParams.prepaymentAmount < paymentParams.finalAmount && (
              <Alert severity="warning">
                <Typography variant="body2">
                  <strong>Часткова передоплата:</strong>{' '}
                  {formatCurrency(paymentParams.prepaymentAmount)} грн
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Залишок {formatCurrency(paymentParams.balanceAmount)} грн буде сплачений при
                  отриманні
                </Typography>
              </Alert>
            )}

          {paymentParams.prepaymentAmount === paymentParams.finalAmount &&
            paymentParams.finalAmount > 0 && (
              <Alert severity="success">
                <Typography variant="body2">
                  <strong>Повна передоплата</strong> - замовлення повністю оплачене
                </Typography>
              </Alert>
            )}
        </Box>
      </Box>

      {/* Інформаційна секція про оплату */}
      {!compact && (
        <Alert severity="info" variant="outlined">
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Способи оплати:</strong>
          </Typography>
          <Typography variant="caption" component="div">
            • <strong>Термінал:</strong> Безготівкова оплата карткою
            <br />• <strong>Готівка:</strong> Оплата готівкою при здачі або отриманні
            <br />• <strong>На рахунок:</strong> Банківський переказ на рахунок компанії
            <br />• Передоплата зменшує суму до доплати при отриманні
          </Typography>
        </Alert>
      )}

      {/* Підсумок оплати */}
      {paymentParams.finalAmount > 0 && (
        <Paper sx={{ p: 2, mt: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
          <Typography
            variant="body1"
            color="primary.dark"
            sx={{ fontWeight: 600, textAlign: 'center' }}
          >
            {paymentParams.balanceAmount === 0
              ? '✅ Замовлення повністю оплачене'
              : `💰 До доплати при отриманні: ${formatCurrency(paymentParams.balanceAmount)} грн`}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
