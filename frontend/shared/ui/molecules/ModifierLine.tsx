import React from 'react';
import { Box } from '@mui/material';
import { PriceRow } from './PriceRow';

type Props = {
  name: string;
  amount: number;
  type?: 'modifier' | 'urgency' | 'discount';
};

export const ModifierLine: React.FC<Props> = ({ name, amount, type = 'modifier' }) => {
  const prefix = type === 'discount' ? '-' : type === 'urgency' ? '+' : '';
  const showBadge = type === 'discount' ? 'decrease' : type === 'urgency' ? 'increase' : null;

  return (
    <Box sx={{ ml: 2 }}>
      <PriceRow
        label={name}
        amount={amount}
        variant="caption"
        pricePrefix={prefix}
        showBadge={showBadge}
        sx={{ mb: 0.5 }}
      />
    </Box>
  );
};