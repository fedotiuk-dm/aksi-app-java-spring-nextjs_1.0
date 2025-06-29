'use client';

import { Box, Typography, Card, CardContent, Button, Stack, Chip, Alert } from '@mui/material';
import { Person, Edit, Phone, Email, LocationOn } from '@mui/icons-material';
import { useOrderOnepageStore } from '../store/order-onepage.store';
import { useStage1GetSelectedClient } from '@/shared/api/generated/stage1';

export const ClientSelectedInfo = () => {
  const { sessionId, selectedClientId, setSelectedClientId } = useOrderOnepageStore();

  const {
    data: client,
    isLoading,
    error,
  } = useStage1GetSelectedClient(sessionId || '', {
    query: { enabled: !!sessionId && !!selectedClientId },
  });

  const handleChangeClient = () => {
    setSelectedClientId(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography>Завантаження інформації про клієнта...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Помилка завантаження клієнта: {error.message}</Alert>;
  }

  if (!client) {
    return <Alert severity="warning">Інформація про клієнта недоступна</Alert>;
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Обраний клієнт
      </Typography>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            {/* Основна інформація */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person color="primary" />
              <Typography variant="h6">
                {client.lastName} {client.firstName}
              </Typography>
            </Box>

            {/* Контактна інформація */}
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" color="action" />
                <Typography variant="body2">{client.phone}</Typography>
              </Box>

              {client.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2">{client.email}</Typography>
                </Box>
              )}

              {client.address && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2">{client.address}</Typography>
                </Box>
              )}
            </Stack>

            {/* Способи зв'язку */}
            {client.communicationChannels && client.communicationChannels.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Способи зв&apos;язку:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {client.communicationChannels.map((method) => (
                    <Chip
                      key={method}
                      label={
                        method === 'PHONE'
                          ? 'Телефон'
                          : method === 'SMS'
                            ? 'SMS'
                            : method === 'VIBER'
                              ? 'Viber'
                              : method
                      }
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Джерело інформації */}
            {client.source && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Джерело:{' '}
                  {client.source === 'INSTAGRAM'
                    ? 'Instagram'
                    : client.source === 'GOOGLE'
                      ? 'Google'
                      : client.source === 'RECOMMENDATION'
                        ? 'Рекомендації'
                        : 'Інше'}
                  {client.sourceDetails && ` (${client.sourceDetails})`}
                </Typography>
              </Box>
            )}

            {/* Статистика замовлень */}
            {client.orderCount !== undefined && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Кількість замовлень: {client.orderCount}
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Кнопка зміни клієнта */}
      <Button variant="outlined" startIcon={<Edit />} onClick={handleChangeClient} fullWidth>
        Змінити клієнта
      </Button>
    </Box>
  );
};
