import React from 'react';
import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material/Typography';
import { formatPrice } from '@/shared/lib/utils/format';

type Props = {
  amount?: number;
  variant?: TypographyProps['variant'];
  color?: TypographyProps['color'];
  fontWeight?: TypographyProps['fontWeight'];
  prefix?: string;
};

export const PriceDisplay: React.FC<Props> = ({
  amount,
  variant = 'body2',
  color,
  fontWeight,
  prefix = '',
}) => {
  return (
    <Typography variant={variant} color={color} fontWeight={fontWeight}>
      {prefix}{formatPrice(amount || 0)}
    </Typography>
  );
};