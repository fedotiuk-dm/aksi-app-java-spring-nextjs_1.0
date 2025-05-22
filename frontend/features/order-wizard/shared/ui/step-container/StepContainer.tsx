'use client';

import { Box, Paper, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

interface StepContainerProps {
  title: string;
  children: ReactNode;
  subtitle?: string;
  className?: string;
}

/**
 * Контейнер для кроку візарда
 * Забезпечує уніфікований стиль та структуру для всіх кроків
 */
export const StepContainer: React.FC<StepContainerProps> = ({
  title,
  children,
  subtitle,
  className,
}) => {
  return (
    <Box className={className}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        {children}
      </Paper>
    </Box>
  );
};
