'use client';

import { Edit, Clear, Delete } from '@mui/icons-material';
import React from 'react';

import { Client, CommunicationChannel } from '@/domain/client';
import { InfoCard, ActionButton } from '@/shared/ui';

interface SelectedClientInfoProps {
  client: Client;
  onEdit?: () => void;
  onClear?: () => void;
  onDelete?: () => void;
  className?: string;
  compact?: boolean;
  showActions?: boolean;
}

/**
 * Компонент відображення інформації про вибраного клієнта
 * Використовує InfoCard для консистентного стилю
 */
export const SelectedClientInfo: React.FC<SelectedClientInfoProps> = ({
  client,
  onEdit,
  onClear,
  onDelete,
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
  ];

  // Формуємо теги для способів зв'язку
  const communicationTags: Array<{
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  }> =
    client.communicationChannels?.map((channel) => {
      const channelLabels: Partial<Record<CommunicationChannel, string>> = {
        [CommunicationChannel.PHONE]: 'Телефон',
        [CommunicationChannel.SMS]: 'SMS',
        [CommunicationChannel.VIBER]: 'Viber',
      };

      return {
        label: channelLabels[channel] || channel,
        color: 'primary' as const,
      };
    }) || [];

  // Додаємо тег джерела якщо є
  if (client.source) {
    const sourceLabels = {
      INSTAGRAM: 'Instagram',
      GOOGLE: 'Google',
      RECOMMENDATION: 'Рекомендації',
      OTHER: client.sourceDetails || 'Інше',
    };

    communicationTags.push({
      label: `Джерело: ${sourceLabels[client.source as keyof typeof sourceLabels] || client.source}`,
      color: 'secondary',
    });
  }

  // Дії для картки
  const actions = showActions ? (
    <>
      {onEdit && (
        <ActionButton variant="outlined" size="small" startIcon={<Edit />} onClick={onEdit}>
          Редагувати
        </ActionButton>
      )}
      {onClear && (
        <ActionButton
          variant="text"
          color="error"
          size="small"
          startIcon={<Clear />}
          onClick={onClear}
        >
          Очистити вибір
        </ActionButton>
      )}
      {onDelete && (
        <ActionButton
          variant="text"
          color="error"
          size="small"
          startIcon={<Delete />}
          onClick={onDelete}
        >
          Видалити
        </ActionButton>
      )}
    </>
  ) : undefined;

  return (
    <InfoCard
      title={`${client.firstName} ${client.lastName}`}
      subtitle="Вибраний клієнт"
      items={infoItems}
      actions={actions}
      tags={communicationTags}
      status="success"
      statusText="Вибрано"
      className={className}
      variant="outlined"
      compact={compact}
    />
  );
};
