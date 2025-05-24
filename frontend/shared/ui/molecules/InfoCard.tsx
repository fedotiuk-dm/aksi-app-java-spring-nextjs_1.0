'use client';

import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { FC, ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  icon?: ReactNode;
  status?: 'success' | 'info' | 'warning' | 'error';
  children: ReactNode;
  compact?: boolean;
}

/**
 * Універсальний компонент для відображення інформації у картці
 *
 * Використання:
 * - Інформація про замовлення
 * - Статуси та результати
 * - Структуровані дані
 */
export const InfoCard: FC<InfoCardProps> = ({
  title,
  icon,
  status = 'info',
  children,
  compact = false,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'success.main';
      case 'warning':
        return 'warning.main';
      case 'error':
        return 'error.main';
      default:
        return 'info.main';
    }
  };

  const getStatusBgColor = () => {
    switch (status) {
      case 'success':
        return 'success.light';
      case 'warning':
        return 'warning.light';
      case 'error':
        return 'error.light';
      default:
        return 'info.light';
    }
  };

  return (
    <Card
      sx={{
        border: `1px solid`,
        borderColor: getStatusColor(),
        bgcolor: getStatusBgColor(),
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <CardContent sx={{ p: compact ? 2 : 3, '&:last-child': { pb: compact ? 2 : 3 } }}>
        {/* Заголовок з іконкою */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon && <Box sx={{ mr: 1, color: getStatusColor() }}>{icon}</Box>}
          <Typography
            variant={compact ? 'subtitle1' : 'h6'}
            sx={{
              fontWeight: 600,
              color: getStatusColor(),
            }}
          >
            {title}
          </Typography>
          {status === 'success' && (
            <Chip label="Завершено" color="success" size="small" sx={{ ml: 'auto' }} />
          )}
        </Box>

        {/* Вміст */}
        <Box>{children}</Box>
      </CardContent>
    </Card>
  );
};
