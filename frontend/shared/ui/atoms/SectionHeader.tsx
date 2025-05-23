'use client';

import { Typography, Box } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import React from 'react';

interface SectionHeaderProps {
  icon?: React.ComponentType<SvgIconProps>;
  title: string;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'inherit';
}

/**
 * Компонент заголовку секції з іконкою
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  color = 'primary',
}) => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: subtitle ? 1 : 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {Icon && <Icon color={color} />}
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};
