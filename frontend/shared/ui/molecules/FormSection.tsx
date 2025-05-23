'use client';

import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { Box, Divider, Typography, Collapse, IconButton } from '@mui/material';
import React, { ReactNode, useState } from 'react';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  required?: boolean;
  className?: string;
  spacing?: number;
  divider?: boolean;
}

/**
 * Універсальний компонент для секцій форм
 * Забезпечує консистентне групування полів з опціональним згортанням
 *
 * FSD принципи:
 * - Універсальний molecule для використання в різних формах
 * - Не містить domain-специфічної логіки
 * - Забезпечує консистентний UX для всіх форм
 *
 * Використовується в:
 * - Формах клієнтів
 * - Формах предметів
 * - Формах замовлень
 * - Будь-яких інших формах проекту
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  subtitle,
  children,
  collapsible = false,
  defaultExpanded = true,
  required = false,
  className,
  spacing = 3,
  divider = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    if (collapsible) {
      setExpanded(!expanded);
    }
  };

  return (
    <Box className={className} sx={{ mb: spacing }}>
      {divider && <Divider sx={{ mb: 2 }} />}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: collapsible ? 'pointer' : 'default',
          mb: 2,
        }}
        onClick={handleToggle}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
          {required && (
            <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
              *
            </Typography>
          )}
        </Typography>

        {collapsible && (
          <IconButton size="small">{expanded ? <ExpandLess /> : <ExpandMore />}</IconButton>
        )}
      </Box>

      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box>{children}</Box>
      </Collapse>
    </Box>
  );
};
