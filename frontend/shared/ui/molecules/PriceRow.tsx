import React from 'react';
import { Box, Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material/Typography';
import { PriceDisplay, PercentageBadge } from '../atoms';

type Props = {
  label: string;
  amount?: number;
  variant?: TypographyProps['variant'];
  fontWeight?: TypographyProps['fontWeight'];
  pricePrefix?: string;
  showBadge?: 'increase' | 'decrease' | null;
  sx?: Record<string, unknown>;
};

export const PriceRow: React.FC<Props> = ({
  label,
  amount,
  variant = 'body2',
  fontWeight,
  pricePrefix,
  showBadge,
  sx,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant={variant} fontWeight={fontWeight}>
          {label}
        </Typography>
        {showBadge && <PercentageBadge type={showBadge} />}
      </Box>
      <PriceDisplay 
        amount={amount} 
        variant={variant} 
        fontWeight={fontWeight}
        prefix={pricePrefix}
      />
    </Box>
  );
};