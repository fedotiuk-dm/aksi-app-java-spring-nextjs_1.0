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

interface PaymentMethod {
  id: string;
  name: string;
}

interface PaymentSectionProps {
  paymentMethod: string;
  paymentMethods: PaymentMethod[];
  paidAmount: number;
  remainingDebt: number;
  maxPayment: number;
  onPaymentMethodChange: (method: string) => void;
  onPaidAmountChange: (amount: number) => void;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Компонент для налаштування оплати замовлення
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення секції оплати
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки розрахунків
 */
export const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentMethod,
  paymentMethods,
  paidAmount,
  remainingDebt,
  maxPayment,
  onPaymentMethodChange,
  onPaidAmountChange,
  disabled = false,
  required = false,
}) => {
  return (
    <Grid size={{ xs: 12 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Оплата
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth required={required} disabled={disabled}>
                <InputLabel>Спосіб оплати</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => onPaymentMethodChange(e.target.value)}
                  label="Спосіб оплати"
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.id} value={method.id}>
                      {method.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                disabled={disabled}
                label="Сплачено (передоплата)"
                type="number"
                value={paidAmount}
                onChange={(e) => onPaidAmountChange(Number(e.target.value))}
                inputProps={{ min: 0, max: maxPayment }}
                helperText={`Макс: ${maxPayment.toFixed(2)} грн`}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Залишок до сплати"
                value={remainingDebt.toFixed(2)}
                InputProps={{ readOnly: true }}
                helperText="Розраховується автоматично"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default PaymentSection;
