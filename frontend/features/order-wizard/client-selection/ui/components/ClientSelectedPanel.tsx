'use client';

import {
  CheckCircle,
  Edit,
  SwapHoriz,
  ArrowForward,
  Person,
  Phone,
  Info,
} from '@mui/icons-material';
import { Box, Grid, Divider, Typography } from '@mui/material';
import React from 'react';

import {
  InfoCard,
  StatusMessage,
  ActionButton,
  InfoChip,
  SectionHeader,
  InfoField,
} from '@/shared/ui';

// Типи з API
import type { ClientResponse } from '@/shared/api/generated/client';

interface ClientSelectedPanelProps {
  selectedClient: ClientResponse;
  clientInfo: {
    client: ClientResponse;
    isNew: boolean;
    formattedInfo: {
      fullName: string;
      phone: string;
      email: string;
      address: string;
    };
  } | null;
  isNewClient: boolean;
  onEdit: () => void;
  onBack: () => void;
  onContinue: () => void;
}

/**
 * Панель відображення вибраного клієнта (оптимізована з Shared UI)
 */
export const ClientSelectedPanel: React.FC<ClientSelectedPanelProps> = ({
  selectedClient,
  clientInfo,
  isNewClient,
  onEdit,
  onBack,
  onContinue,
}) => {
  const fullName =
    clientInfo?.formattedInfo.fullName ||
    `${selectedClient.firstName ?? ''} ${selectedClient.lastName ?? ''}`.trim() ||
    'Без імені';

  // Перевод каналів зв'язку на українську
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

  // Перевод джерел інформації на українську
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

  return (
    <Box>
      {/* Заголовок */}
      <SectionHeader
        icon={CheckCircle}
        title={isNewClient ? 'Новий клієнт створено' : 'Клієнт вибрано'}
        color="primary"
      />

      {/* Статус нового клієнта */}
      {isNewClient && (
        <StatusMessage
          severity="success"
          message="Новий клієнт успішно створений та автоматично вибраний для замовлення"
          show={true}
          sx={{ mb: 3 }}
        />
      )}

      {/* Картка клієнта */}
      <InfoCard title={fullName} icon={<Person />} status={isNewClient ? 'success' : 'info'}>
        {/* Статус клієнта */}
        <Box sx={{ mb: 3 }}>
          <InfoChip
            label={isNewClient ? 'Новий клієнт' : 'Існуючий клієнт'}
            color={isNewClient ? 'success' : 'primary'}
            variant={isNewClient ? 'filled' : 'outlined'}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Контактна інформація */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone />
                Контактна інформація
              </Typography>
            </Box>

            {selectedClient.phone && (
              <InfoField label="Телефон" value={selectedClient.phone} copyable={true} />
            )}

            {selectedClient.email && (
              <InfoField label="Email" value={selectedClient.email} copyable={true} />
            )}

            {selectedClient.address && (
              <InfoField label="Адреса" value={selectedClient.address} vertical={true} />
            )}

            {/* Способи зв'язку */}
            {selectedClient.communicationChannels &&
              selectedClient.communicationChannels.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Способи зв&apos;язку:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedClient.communicationChannels.map((channel) => (
                      <InfoChip
                        key={channel}
                        label={translateCommunicationChannel(channel)}
                        variant="outlined"
                        size="small"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              )}
          </Grid>

          {/* Додаткова інформація */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info />
                Додаткова інформація
              </Typography>
            </Box>

            {selectedClient.source && (
              <InfoField
                label="Джерело"
                value={`${translateSource(selectedClient.source)}${
                  selectedClient.sourceDetails ? ` (${selectedClient.sourceDetails})` : ''
                }`}
              />
            )}

            {selectedClient.orderCount !== undefined && (
              <InfoField
                label="Кількість замовлень"
                value={selectedClient.orderCount.toString()}
                important={selectedClient.orderCount > 0}
              />
            )}

            <InfoField label="ID клієнта" value={selectedClient.id} copyable={true} />

            {selectedClient.createdAt && (
              <InfoField
                label="Створено"
                value={new Date(selectedClient.createdAt).toLocaleDateString('uk-UA')}
              />
            )}
          </Grid>
        </Grid>
      </InfoCard>

      <Divider sx={{ my: 3 }} />

      {/* Дії */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {/* Кнопки зліва */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <ActionButton
            variant="outlined"
            startIcon={<Edit />}
            onClick={onEdit}
            size="small"
            fullWidth={false}
          >
            Редагувати
          </ActionButton>
          <ActionButton
            variant="outlined"
            startIcon={<SwapHoriz />}
            onClick={onBack}
            size="small"
            fullWidth={false}
          >
            Змінити клієнта
          </ActionButton>
        </Box>

        {/* Кнопка продовження справа */}
        <ActionButton
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          onClick={onContinue}
          fullWidth={false}
          color="primary"
        >
          Продовжити до наступного етапу
        </ActionButton>
      </Box>

      {/* Підказка */}
      <StatusMessage
        severity="info"
        message="💡 Підказка: Після підтвердження клієнта ви перейдете до етапу додавання предметів до замовлення. Ви завжди зможете повернутися і змінити клієнта."
        show={true}
        sx={{ mt: 3 }}
      />
    </Box>
  );
};
