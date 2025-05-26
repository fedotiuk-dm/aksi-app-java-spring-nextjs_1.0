'use client';

import { Clear, CheckCircle, Warning, Edit } from '@mui/icons-material';
import { Alert, Box, Chip, Typography } from '@mui/material';
import React from 'react';

import { InfoCard, ActionButton } from '@/shared/ui';

import type { ClientSearchResult } from '@/domain/wizard';

interface ClientValidationResult {
  canProceed: boolean;
  errors: string[];
  warnings: string[];
}

interface SelectedClientInfoProps {
  client: ClientSearchResult;
  validationResult?: ClientValidationResult | null;
  onClear?: () => void;
  onEdit?: () => void;
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
  validationResult,
  onClear,
  onEdit,
  className,
  compact = false,
  showActions = true,
}) => {
  // Формуємо повне ім'я
  const fullName = client.fullName || `${client.firstName} ${client.lastName}`.trim();

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
    if (validationResult?.canProceed) {
      return { status: 'success' as const, text: 'Готово до замовлення' };
    }
    if (validationResult?.errors && validationResult.errors.length > 0) {
      return { status: 'error' as const, text: 'Потрібні додаткові дані' };
    }
    return { status: 'warning' as const, text: 'Можна продовжити' };
  };

  const { status } = getValidationStatus();

  // Обчислюємо повноту профілю
  const calculateCompleteness = () => {
    const requiredFields = ['firstName', 'lastName', 'phone'];
    const optionalFields = ['email', 'address'];

    const filledRequired = requiredFields.filter(
      (field) => client[field as keyof ClientSearchResult]
    ).length;

    const filledOptional = optionalFields.filter(
      (field) => client[field as keyof ClientSearchResult]
    ).length;

    const totalFields = requiredFields.length + optionalFields.length;
    const filledFields = filledRequired + filledOptional;

    return Math.round((filledFields / totalFields) * 100);
  };

  const completenessPercentage = calculateCompleteness();

  // Дії для картки
  const actions = showActions ? (
    <>
      {onEdit && (
        <ActionButton
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<Edit />}
          onClick={onEdit}
        >
          Редагувати
        </ActionButton>
      )}
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
      <InfoCard title={fullName} status={status} compact={compact}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Вибраний клієнт
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
          {validationResult?.canProceed ? (
            <CheckCircle color="success" fontSize="small" />
          ) : (
            <Warning color="warning" fontSize="small" />
          )}
          <Typography variant="body2">Повнота профілю: {completenessPercentage}%</Typography>
        </Box>

        {/* Помилки валідації */}
        {validationResult?.errors && validationResult.errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 1 }}>
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
          <Alert severity="warning" sx={{ mb: 1 }}>
            <strong>Попередження:</strong>
            <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
              {validationResult.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </Alert>
        )}
      </Box>
    </Box>
  );
};
