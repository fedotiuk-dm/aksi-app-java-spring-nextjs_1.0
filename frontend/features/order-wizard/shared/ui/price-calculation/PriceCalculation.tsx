'use client';

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
} from '@mui/material';
import React from 'react';

interface PriceModifier {
  id: string;
  name: string;
  percentage: number;
  amount: number;
}

interface PriceCalculationProps {
  basePrice: number;
  modifiers: PriceModifier[];
  totalPrice: number;
  currency?: string;
  className?: string;
}

/**
 * Компонент для відображення розрахунку ціни з деталізацією
 * Використовується на підетапі 2.4 та на етапі підтвердження замовлення
 *
 * Важливо: сам розрахунок відбувається на бекенді, компонент лише відображає результати
 */
export const PriceCalculation: React.FC<PriceCalculationProps> = ({
  basePrice,
  modifiers,
  totalPrice,
  currency = 'грн',
  className,
}) => {
  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} ${currency}`;
  };

  const getModifierSign = (percentage: number) => {
    return percentage >= 0 ? '+' : '';
  };

  return (
    <Box className={className}>
      <Typography variant="h6" gutterBottom>
        Розрахунок вартості
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
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
              <TableCell align="right">{formatPrice(basePrice)}</TableCell>
            </TableRow>

            {modifiers.map((modifier) => (
              <TableRow key={modifier.id}>
                <TableCell component="th" scope="row">
                  {modifier.name}
                </TableCell>
                <TableCell align="right">
                  {getModifierSign(modifier.percentage)}
                  {modifier.percentage}%
                </TableCell>
                <TableCell align="right">
                  {getModifierSign(modifier.amount)}
                  {formatPrice(modifier.amount)}
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={2}>
                <Typography fontWeight="500">Загальна вартість</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="500">{formatPrice(totalPrice)}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          * Всі розрахунки є попередніми та можуть бути уточнені після перевірки виробу
        </Typography>
      </Box>
    </Box>
  );
};
