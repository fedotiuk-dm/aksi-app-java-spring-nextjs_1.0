'use client';

import { Box, Paper, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

interface StepContainerProps {
  title: string;
  children: ReactNode;
  subtitle?: string;
  className?: string;
  variant?: 'outlined' | 'elevation';
  padding?: number;
}

/**
 * Універсальний контейнер для кроку візарда
 * Забезпечує уніфікований стиль та структуру для всіх кроків
 *
 * FSD принципи:
 * - Універсальний organism для wizard steps
 * - Не містить domain-специфічної логіки
 * - Забезпечує консистентний UX для всіх wizard'ів
 *
 * Може використовуватися в:
 * - Order Wizard
 * - Client Registration Wizard
 * - Settings Wizard
 * - Будь-яких інших покрокових процесах
 */
export const StepContainer: React.FC<StepContainerProps> = ({
  title,
  children,
  subtitle,
  className,
  variant = 'outlined',
  padding = 3,
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

      <Paper variant={variant} sx={{ p: padding, mb: 3 }}>
        {children}
      </Paper>
    </Box>
  );
};
