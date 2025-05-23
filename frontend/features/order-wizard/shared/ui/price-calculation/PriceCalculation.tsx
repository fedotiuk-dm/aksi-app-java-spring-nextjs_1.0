'use client';

import { Calculate, Receipt } from '@mui/icons-material';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import React from 'react';

interface PriceModifier {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  type?: 'addition' | 'discount' | 'surcharge';
  description?: string;
}

interface PriceCalculationProps {
  basePrice: number;
  modifiers: PriceModifier[];
  totalPrice: number;
  currency?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  showDetails?: boolean;
  showDisclaimer?: boolean;
  disclaimerText?: string;
  variant?: 'detailed' | 'summary';
  status?: 'draft' | 'confirmed' | 'final';
  roundingPrecision?: number;
}

/**
 * Універсальний компонент для відображення розрахунку ціни з деталізацією
 * Використовується на підетапі 2.4 та на етапі підтвердження замовлення
 *
 * Особливості:
 * - Детальний розрахунок з модифікаторами
 * - Різні варіанти відображення (detailed/summary)
 * - Статуси розрахунку
 * - Консистентний стиль з іншими shared компонентами
 *
 * Важливо: сам розрахунок відбувається на бекенді, компонент лише відображає результати
 */
export const PriceCalculation: React.FC<PriceCalculationProps> = ({
  basePrice,
  modifiers,
  totalPrice,
  currency = 'грн',
  className,
  title = 'Розрахунок вартості',
  subtitle,
  compact = false,
  showDetails = true,
  showDisclaimer = true,
  disclaimerText = '* Всі розрахунки є попередніми та можуть бути уточнені після перевірки виробу',
  variant = 'detailed',
  status = 'draft',
  roundingPrecision = 2,
}) => {
  const formatPrice = (price: number) => {
    return `${price.toFixed(roundingPrecision)} ${currency}`;
  };

  const getModifierSign = (amount: number) => {
    return amount >= 0 ? '+' : '';
  };

  const getModifierColor = (
    type?: string
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (type) {
      case 'addition':
        return 'info';
      case 'discount':
        return 'success';
      case 'surcharge':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusColor = ():
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning' => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'final':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'confirmed':
        return 'Підтверджено';
      case 'final':
        return 'Остаточно';
      case 'draft':
      default:
        return 'Попередньо';
    }
  };

  if (variant === 'summary') {
    return (
      <Box className={className}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Receipt fontSize="small" />
          <Typography variant={compact ? 'subtitle2' : 'h6'}>{title}</Typography>
          <Chip label={getStatusText()} size="small" color={getStatusColor()} variant="outlined" />
        </Box>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">Загальна вартість:</Typography>
            <Typography variant="h6" color="primary">
              {formatPrice(totalPrice)}
            </Typography>
          </Box>

          {showDetails && modifiers.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Включає {modifiers.length} модифікатор(ів)
            </Typography>
          )}
        </Paper>
      </Box>
    );
  }

  return (
    <Box className={className}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Calculate fontSize="small" />
        <Typography variant={compact ? 'subtitle1' : 'h6'}>{title}</Typography>
        <Chip label={getStatusText()} size="small" color={getStatusColor()} variant="outlined" />
      </Box>

      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table size={compact ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>Найменування</TableCell>
              <TableCell align="right">Відсоток</TableCell>
              <TableCell align="right">Сума</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <Typography fontWeight="500">Базова ціна</Typography>
              </TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">
                <Typography fontWeight="500">{formatPrice(basePrice)}</Typography>
              </TableCell>
            </TableRow>

            {modifiers.map((modifier) => (
              <TableRow key={modifier.id}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {modifier.name}
                    {modifier.type && (
                      <Chip
                        label={modifier.type}
                        size="small"
                        color={getModifierColor(modifier.type)}
                        variant="outlined"
                      />
                    )}
                  </Box>
                  {modifier.description && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {modifier.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Typography color={modifier.amount >= 0 ? 'success.main' : 'error.main'}>
                    {getModifierSign(modifier.percentage)}
                    {modifier.percentage}%
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color={modifier.amount >= 0 ? 'success.main' : 'error.main'}>
                    {getModifierSign(modifier.amount)}
                    {formatPrice(Math.abs(modifier.amount))}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={3}>
                <Divider />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="h6" fontWeight="600">
                  Загальна вартість
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6" fontWeight="600" color="primary">
                  {formatPrice(totalPrice)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {showDisclaimer && disclaimerText && (
        <Alert severity="info" sx={{ mt: 2 }} variant="outlined">
          <Typography variant="caption">{disclaimerText}</Typography>
        </Alert>
      )}
    </Box>
  );
};
