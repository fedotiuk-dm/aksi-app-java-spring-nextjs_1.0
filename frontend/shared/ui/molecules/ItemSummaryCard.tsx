'use client';

import { Paper, Typography } from '@mui/material';
import React from 'react';

interface ItemSummaryData {
  name: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
}

interface ItemSummaryCardProps {
  data: ItemSummaryData;
  showTotalPrice?: boolean;
}

/**
 * Картка підсумку предмета
 */
export const ItemSummaryCard: React.FC<ItemSummaryCardProps> = ({
  data,
  showTotalPrice = true,
}) => {
  const { name, quantity, unitOfMeasure, unitPrice } = data;
  const totalPrice = quantity * unitPrice;

  if (!name) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Підсумок:
      </Typography>
      <Typography variant="body2">
        <strong>{name}</strong> • {quantity} {unitOfMeasure} • {unitPrice.toFixed(2)} грн/
        {unitOfMeasure}
      </Typography>
      {showTotalPrice && (
        <Typography variant="caption" color="text.secondary">
          Орієнтовна вартість: {totalPrice.toFixed(2)} грн
        </Typography>
      )}
    </Paper>
  );
};
