'use client';

import { Clear, CheckCircle } from '@mui/icons-material';
import { Alert, Box, Chip, IconButton, Stack, Typography, Tooltip } from '@mui/material';
import React from 'react';

interface EntityInfoItem {
  icon?: React.ReactNode;
  label?: string;
  value: React.ReactNode;
  important?: boolean;
}

interface EntityTag {
  label: string;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  variant?: 'filled' | 'outlined';
}

interface EntityInfoAlertProps {
  title: string;
  subtitle?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  icon?: React.ReactNode;
  items?: EntityInfoItem[];
  tags?: EntityTag[];
  actions?: React.ReactNode;
  onClear?: () => void;
  clearTooltip?: string;
  className?: string;
  variant?: 'filled' | 'outlined' | 'standard';
}

/**
 * Універсальний компонент алерта для відображення інформації про обрану сутність
 *
 * Особливості:
 * - Підтримка різних типів алертів (success, error, warning, info)
 * - Відображення списку інформаційних полів
 * - Теги для додаткової інформації
 * - Кнопка очищення
 * - Гнучкі дії
 *
 * Використовується для:
 * - Відображення інформації про вибрану філію
 * - Відображення інформації про вибраного клієнта
 * - Відображення інформації про вибраний товар/послугу
 * - Будь-які інші інформаційні алерти
 */
export const EntityInfoAlert: React.FC<EntityInfoAlertProps> = ({
  title,
  subtitle,
  severity = 'success',
  icon,
  items = [],
  tags = [],
  actions,
  onClear,
  clearTooltip = 'Очистити вибір',
  className,
  variant = 'filled',
}) => {
  return (
    <Alert
      severity={severity}
      icon={icon || <CheckCircle />}
      variant={variant}
      className={className}
      action={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {actions}
          {onClear && (
            <Tooltip title={clearTooltip}>
              <IconButton aria-label="очистити" color="inherit" size="small" onClick={onClear}>
                <Clear fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      }
    >
      <Box>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          {title}
        </Typography>

        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        )}

        {/* Інформаційні поля */}
        {items.length > 0 && (
          <Stack spacing={1} sx={{ mb: tags.length > 0 ? 2 : 0 }}>
            {items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {item.icon}
                <Box>
                  {item.label && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', lineHeight: 1 }}
                    >
                      {item.label}:
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    fontWeight={item.important ? 'medium' : 'normal'}
                    color={item.important ? 'text.primary' : 'text.secondary'}
                  >
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        )}

        {/* Теги */}
        {tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag.label}
                color={tag.color || 'default'}
                variant={tag.variant || 'filled'}
                size="small"
              />
            ))}
          </Box>
        )}
      </Box>
    </Alert>
  );
};
