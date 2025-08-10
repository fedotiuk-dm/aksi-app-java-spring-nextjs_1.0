import React from 'react';
import { Chip } from '@mui/material';

type Props = {
  type: 'increase' | 'decrease';
  size?: 'small' | 'medium';
};

export const PercentageBadge: React.FC<Props> = ({ type, size = 'small' }) => {
  return (
    <Chip
      label={type === 'increase' ? '+' : '-'}
      size={size}
      color={type === 'increase' ? 'warning' : 'success'}
    />
  );
};