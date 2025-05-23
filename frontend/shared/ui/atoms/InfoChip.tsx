'use client';

import { Chip } from '@mui/material';
import { ChipProps } from '@mui/material/Chip';
import React from 'react';

interface InfoChipProps extends Omit<ChipProps, 'variant'> {
  variant?: 'filled' | 'outlined' | 'soft';
}

/**
 * Інформаційний чіп з додатковими варіантами
 */
export const InfoChip: React.FC<InfoChipProps> = ({
  variant = 'filled',
  color = 'primary',
  size = 'small',
  ...props
}) => {
  const chipVariant = variant === 'soft' ? 'filled' : variant;

  const sx =
    variant === 'soft'
      ? {
          backgroundColor: `${color}.50`,
          color: `${color}.700`,
          '& .MuiChip-label': {
            color: `${color}.700`,
          },
          ...props.sx,
        }
      : props.sx;

  return <Chip variant={chipVariant} color={color} size={size} sx={sx} {...props} />;
};
