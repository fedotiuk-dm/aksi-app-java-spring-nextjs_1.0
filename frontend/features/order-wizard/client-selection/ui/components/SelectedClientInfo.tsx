'use client';

import { Clear, CheckCircle, Warning } from '@mui/icons-material';
import { Alert, Box, Chip, Typography } from '@mui/material';
import React from 'react';

import { InfoCard, ActionButton } from '@/shared/ui';

import type { ClientSearchResult } from '@/domain/wizard';

interface SelectedClientInfoProps {
  client: ClientSearchResult;
  clientDisplay: {
    fullName: string;
    subtitle: string;
    completenessPercentage: number;
    missingFields: string[];
    recommendedFields: string[];
    canProceed: boolean;
    proceedReasons: string[];
  };
  validationResult?: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    canProceed: boolean;
  };
  onClear?: () => void;
  className?: string;
  compact?: boolean;
  showActions?: boolean;
}

/**
 * Компонент відображення інформації про вибраного клієнта (DDD архітектура)
 * Використовує дані з useClientSelection хука
 */
export const SelectedClientInfo: React.FC<SelectedClientInfoProps> = ({
  client,
  clientDisplay,
  validationResult,
  onClear,
  className,
  compact = false,
  showActions = true,
}) => {
  // Формуємо список інформації про клієнта
  const infoItems = [
    {
      label: 'Телефон',
      value: client.phone,
      important: true,
    },
    ...(client.email
      ? [
          {
            label: 'Email',
            value: client.email,
          },
        ]
      : []),
    ...(client.address
      ? [
          {
            label: 'Адреса',
            value: client.address,
          },
        ]
      : []),
    ...(client.orderCount !== undefined
      ? [
          {
            label: 'Кількість замовлень',
            value: client.orderCount.toString(),
          },
        ]
      : []),
  ];

  // Формуємо теги для способів зв'язку
  const communicationTags: Array<{
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  }> =
    client.communicationChannels?.map((channel) => ({
      label: channel,
      color: 'primary' as const,
    })) || [];

  // Додаємо тег джерела якщо є
  if (client.source) {
    communicationTags.push({
      label: `Джерело: ${client.source}`,
      color: 'secondary',
    });
  }

  // Статус валідації
  const getValidationStatus = () => {
    if (validationResult?.isValid) {
      return { status: 'success' as const, text: 'Готово до замовлення' };
    }
    if (validationResult?.canProceed) {
      return { status: 'warning' as const, text: 'Можна продовжити' };
    }
    return { status: 'error' as const, text: 'Потрібні додаткові дані' };
  };

  const { status } = getValidationStatus();

  // Дії для картки
  const actions = showActions ? (
    <>
      {onClear && (
        <ActionButton
          variant="outlined"
          color="error"
          size="small"
          startIcon={<Clear />}
          onClick={onClear}
        >
          Очистити вибір
        </ActionButton>
      )}
    </>
  ) : undefined;

  return (
    <Box className={className}>
      <InfoCard title={clientDisplay.fullName} status={status} compact={compact}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {clientDisplay.subtitle}
        </Typography>

        {/* Інформація про клієнта */}
        {infoItems.map((item, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
              {item.label}:
            </Typography>{' '}
            <Typography variant="body2" component="span">
              {item.value}
            </Typography>
          </Box>
        ))}

        {/* Теги */}
        {communicationTags.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {communicationTags.map((tag, index) => (
              <Chip key={index} label={tag.label} color={tag.color} size="small" />
            ))}
          </Box>
        )}

        {/* Дії */}
        {actions && <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>{actions}</Box>}
      </InfoCard>

      {/* Індикатор повноти профілю */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {clientDisplay.canProceed ? (
            <CheckCircle color="success" fontSize="small" />
          ) : (
            <Warning color="warning" fontSize="small" />
          )}
          <span>Повнота профілю: {clientDisplay.completenessPercentage}%</span>
        </Box>

        {/* Відсутні обов'язкові поля */}
        {clientDisplay.missingFields.length > 0 && (
          <Alert severity="error" sx={{ mb: 1 }}>
            <strong>Відсутні обов&apos;язкові поля:</strong>
            <Box sx={{ mt: 0.5 }}>
              {clientDisplay.missingFields.map((field, index) => (
                <Chip
                  key={index}
                  label={field}
                  size="small"
                  color="error"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>
          </Alert>
        )}

        {/* Рекомендовані поля */}
        {clientDisplay.recommendedFields.length > 0 && (
          <Alert severity="warning" sx={{ mb: 1 }}>
            <strong>Рекомендовані поля:</strong>
            <Box sx={{ mt: 0.5 }}>
              {clientDisplay.recommendedFields.map((field, index) => (
                <Chip
                  key={index}
                  label={field}
                  size="small"
                  color="warning"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>
          </Alert>
        )}

        {/* Причини можливості продовження */}
        {clientDisplay.proceedReasons.length > 0 && (
          <Alert severity="info">
            <strong>Можна продовжити тому що:</strong>
            <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
              {clientDisplay.proceedReasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </Alert>
        )}
      </Box>

      {/* Помилки валідації */}
      {validationResult?.errors && validationResult.errors.length > 0 && (
        <Alert severity="error" sx={{ mt: 1 }}>
          <strong>Помилки:</strong>
          <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
            {validationResult.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Попередження валідації */}
      {validationResult?.warnings && validationResult.warnings.length > 0 && (
        <Alert severity="warning" sx={{ mt: 1 }}>
          <strong>Попередження:</strong>
          <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
            {validationResult.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </Alert>
      )}
    </Box>
  );
};
