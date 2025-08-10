import React from 'react';
import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material/Typography';

type Props = {
  quantity: number;
  variant?: TypographyProps['variant'];
  color?: TypographyProps['color'];
};

export const QuantityIndicator: React.FC<Props> = ({
  quantity,
  variant = 'body2',
  color = 'text.secondary',
}) => {
  if (quantity <= 1) return null;
  
  return (
    <Typography variant={variant} color={color}>
      Кількість: {quantity}
    </Typography>
  );
};