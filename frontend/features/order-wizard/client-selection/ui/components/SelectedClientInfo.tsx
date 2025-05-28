'use client';

import { Clear, CheckCircle, Warning, Edit, Person } from '@mui/icons-material';
import { Alert, Box, Chip, Typography } from '@mui/material';
import React from 'react';

// Shared компоненти
import { InfoCard, ActionButton } from '@/shared/ui';

// Типи з API
import type { ClientResponse } from '@/shared/api/generated/client';

interface ClientValidationResult {
  canProceed: boolean;
  errors: string[];
  warnings: string[];
}

interface SelectedClientInfoProps {
  client: ClientResponse;
  validationResult?: ClientValidationResult | null;
  onClear?: () => void;
  onEdit?: () => void;
  className?: string;
  compact?: boolean;
  showActions?: boolean;
}

/**
 * Компонент відображення інформації про вибраного клієнта (DDD архітектура + Shared UI)
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
  const fullName = `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Без імені';

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

  // Переклад способів зв'язку
  const translateCommunicationChannel = (channel: string) => {
    switch (channel) {
      case 'PHONE':
        return 'Телефон';
      case 'SMS':
        return 'SMS';
      case 'VIBER':
        return 'Viber';
      default:
        return channel;
    }
  };

  // Переклад джерел інформації
  const translateSource = (source: string) => {
    switch (source) {
      case 'INSTAGRAM':
        return 'Instagram';
      case 'GOOGLE':
        return 'Google';
      case 'RECOMMENDATION':
        return 'Рекомендації';
      case 'OTHER':
        return 'Інше';
      default:
        return source;
    }
  };

  // Формуємо теги для способів зв'язку
  const communicationTags: Array<{
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  }> =
    client.communicationChannels?.map((channel) => ({
      label: translateCommunicationChannel(channel),
      color: 'primary' as const,
    })) || [];

  // Додаємо тег джерела якщо є
  if (client.source) {
    communicationTags.push({
      label: `Джерело: ${translateSource(client.source)}`,
      color: 'secondary',
    });
  }

  // Статус валідації для InfoCard
  const getValidationStatus = (): 'success' | 'info' | 'warning' | 'error' => {
    if (validationResult?.canProceed) {
      return 'success';
    }
    if (validationResult?.errors && validationResult.errors.length > 0) {
      return 'error';
    }
    return 'warning';
  };

  // Обчислюємо повноту профілю
  const calculateCompleteness = () => {
    const requiredFields = ['firstName', 'lastName', 'phone'];
    const optionalFields = ['email', 'address'];

    const filledRequired = requiredFields.filter(
      (field) => client[field as keyof ClientResponse]
    ).length;

    const filledOptional = optionalFields.filter(
      (field) => client[field as keyof ClientResponse]
    ).length;

    const totalFields = requiredFields.length + optionalFields.length;
    const filledFields = filledRequired + filledOptional;

    return Math.round((filledFields / totalFields) * 100);
  };

  const completenessPercentage = calculateCompleteness();

  return (
    <Box className={className}>
      <InfoCard title={fullName} icon={<Person />} status={getValidationStatus()} compact={compact}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Вибраний клієнт
        </Typography>

        {/* Інформація про клієнта */}
        {infoItems
          .filter((item) => item.value)
          .map((item, index) => (
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
        {showActions && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
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
          </Box>
        )}
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
          <Alert severity="error" sx={{ mt: 1 }}>
            <Typography variant="body2">Помилки: {validationResult.errors.join(', ')}</Typography>
          </Alert>
        )}

        {/* Попередження валідації */}
        {validationResult?.warnings && validationResult.warnings.length > 0 && (
          <Alert severity="warning" sx={{ mt: 1 }}>
            <Typography variant="body2">
              Попередження: {validationResult.warnings.join(', ')}
            </Typography>
          </Alert>
        )}
      </Box>
    </Box>
  );
};
