import React from 'react';
import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material/Typography';
import { formatPrice } from '@/shared/lib/utils/format';

// Простий тип для CSS fontWeight
type FontWeightType = 'normal' | 'bold' | 'lighter' | 'bolder' | number;

type Props = {
  amount?: number;
  currency?: 'UAH' | 'USD';
  variant?: TypographyProps['variant'];
  color?: TypographyProps['color'];
  fontWeight?: FontWeightType;
  prefix?: string;
  inline?: boolean; // Новий проп для inline відображення
};

export const PriceDisplay: React.FC<Props> = ({
  amount,
  currency = 'UAH',
  variant = 'body2',
  color,
  fontWeight,
  prefix = '',
  inline = false,
}) => {
  const priceText = `${prefix}${formatPrice(amount || 0, currency)}`;

  // Якщо inline=true, використовуємо span замість Typography
  if (inline) {
    return (
      <span
        style={{
          color: color ? `var(--mui-palette-${color.replace('.', '-')})` : undefined,
          fontWeight: fontWeight,
        }}
      >
        {priceText}
      </span>
    );
  }

  return (
    <Typography variant={variant} color={color} fontWeight={fontWeight}>
      {priceText}
    </Typography>
  );
};
