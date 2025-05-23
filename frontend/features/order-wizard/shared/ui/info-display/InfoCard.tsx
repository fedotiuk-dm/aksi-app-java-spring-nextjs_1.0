'use client';

import { Card, CardContent, CardActions, Typography, Box, Chip, Alert } from '@mui/material';
import React, { ReactNode } from 'react';

interface InfoItem {
  label: string;
  value: ReactNode;
  important?: boolean;
}

interface InfoCardProps {
  title: string;
  subtitle?: string;
  items: InfoItem[];
  actions?: ReactNode;
  status?: 'info' | 'success' | 'warning' | 'error';
  statusText?: string;
  tags?: Array<{
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  }>;
  className?: string;
  variant?: 'outlined' | 'elevation';
  compact?: boolean;
}

/**
 * Універсальний компонент для відображення інформаційних карток
 * Забезпечує консистентне відображення даних в різних частинах Order Wizard
 *
 * Використовується для:
 * - Відображення інформації про клієнта
 * - Показу деталей предметів
 * - Підсумків замовлення
 * - Статусів та результатів
 */
export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  subtitle,
  items,
  actions,
  status,
  statusText,
  tags,
  className,
  variant = 'outlined',
  compact = false,
}) => {
  const cardPadding = compact ? 2 : 3;

  return (
    <Card variant={variant} className={className}>
      <CardContent sx={{ pb: actions ? 1 : cardPadding, p: cardPadding }}>
        {/* Заголовок та статус */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: subtitle || status ? 1 : 2,
          }}
        >
          <Typography variant={compact ? 'subtitle1' : 'h6'} component="h3">
            {title}
          </Typography>
          {status && statusText && (
            <Alert severity={status} sx={{ py: 0, px: 1 }} variant="outlined">
              <Typography variant="caption">{statusText}</Typography>
            </Alert>
          )}
        </Box>

        {/* Підзаголовок */}
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        )}

        {/* Теги */}
        {tags && tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag.label}
                size="small"
                color={tag.color || 'default'}
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {/* Список інформації */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: compact ? 1 : 1.5 }}>
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontWeight: item.important ? 500 : 400,
                  minWidth: 'fit-content',
                }}
              >
                {item.label}:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: item.important ? 500 : 400,
                  textAlign: 'right',
                  wordBreak: 'break-word',
                }}
              >
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>

      {/* Дії */}
      {actions && (
        <CardActions sx={{ px: cardPadding, pb: cardPadding, pt: 0 }}>{actions}</CardActions>
      )}
    </Card>
  );
};
