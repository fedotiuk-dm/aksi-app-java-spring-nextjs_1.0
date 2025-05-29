'use client';

import {
  Box,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
} from '@mui/material';

import { useClientManagement } from '@/domain/wizard';

import type { ClientResponse } from '@/shared/api/generated/client/aksiApi.schemas';

interface ClientSearchResultsProps {
  results: ClientResponse[];
  selectedClient: ClientResponse | null;
  isLoading: boolean;
}

/**
 * Компонент результатів пошуку клієнтів
 * Відображає список знайдених клієнтів з можливістю вибору
 */
export const ClientSearchResults = ({
  results,
  selectedClient,
  isLoading,
}: ClientSearchResultsProps) => {
  const { selectClient } = useClientManagement();

  // DEBUG: Що отримує компонент
  console.log('📋 ClientSearchResults ОТРИМАВ:', {
    results,
    resultsLength: results?.length,
    resultsArray: Array.isArray(results),
    isLoading,
    selectedClient: selectedClient?.id,
  });

  // Константи для уникнення дублювання
  const BORDER_RADIUS = 1;
  const PRIMARY_LIGHT_COLOR = 'primary.light';
  const PRIMARY_COLOR = 'primary.main';
  const BODY_VARIANT = 'body1';

  const formatContactMethods = (client: ClientResponse) => {
    const methods = [];
    if (client.phone) methods.push('Телефон');
    if (client.communicationChannels?.includes('VIBER')) methods.push('Viber');
    if (client.communicationChannels?.includes('SMS')) methods.push('SMS');
    if (client.email) methods.push('Email');
    return methods;
  };

  const getClientInitials = (client: ClientResponse) => {
    const firstName = client.firstName?.charAt(0) || '';
    const lastName = client.lastName?.charAt(0) || '';
    return `${firstName}${lastName}`.toUpperCase() || '??';
  };

  const getFullName = (client: ClientResponse) => {
    return `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Невідомий клієнт';
  };

  const getClientDisplayInfo = (client: ClientResponse) => {
    const info = [];
    if (client.phone) info.push(`📞 ${client.phone}`);
    if (client.email) info.push(`✉️ ${client.email}`);
    if (client.address) info.push(`📍 ${client.address}`);
    return info;
  };

  const isSelected = (client: ClientResponse) => selectedClient?.id === client.id;

  // Показуємо індикатор завантаження
  if (isLoading) {
    return (
      <Card sx={{ mt: 2, border: '3px solid blue', backgroundColor: 'lightblue' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            🔍 Пошук клієнтів
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography>Пошук клієнтів...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Якщо немає результатів
  if (!results || !Array.isArray(results) || results.length === 0) {
    return (
      <Card sx={{ mt: 2, border: '3px solid orange', backgroundColor: 'lightyellow' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            🔍 Результати пошуку
          </Typography>
          <Alert severity="info">
            <Typography>
              Клієнтів не знайдено. Спробуйте змінити критерії пошуку або створіть нового клієнта.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Показуємо результати
  return (
    <Card sx={{ mt: 2, border: '3px solid red', backgroundColor: 'yellow' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔍 Знайдені клієнти
        </Typography>

        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography>✅ Знайдено {results.length} клієнтів</Typography>
        </Alert>

        {results.map((client, index) => {
          const clientId = client.id || index.toString();
          const selected = isSelected(client);

          return (
            <Card
              key={clientId}
              variant="outlined"
              sx={{
                mb: 2,
                p: 2,
                cursor: 'pointer',
                border: selected ? '3px solid' : '1px solid',
                borderColor: selected ? 'success.main' : 'divider',
                bgcolor: selected ? 'success.light' : 'background.paper',
                '&:hover': {
                  borderColor: PRIMARY_COLOR,
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => selectClient(client)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: selected ? 'success.main' : PRIMARY_COLOR,
                    width: 60,
                    height: 60,
                  }}
                >
                  {getClientInitials(client)}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {getFullName(client)}
                    {selected && ' ✅ ВИБРАНО'}
                  </Typography>

                  {getClientDisplayInfo(client).map((info, idx) => (
                    <Typography key={idx} variant={BODY_VARIANT} sx={{ mb: 0.5 }}>
                      {info}
                    </Typography>
                  ))}

                  {formatContactMethods(client).length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {formatContactMethods(client).map((method) => (
                        <Chip key={method} label={method} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </Box>
                  )}
                </Box>

                <Button
                  variant={selected ? 'contained' : 'outlined'}
                  color={selected ? 'success' : 'primary'}
                  size="large"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectClient(client);
                  }}
                >
                  {selected ? 'ВИБРАНО ✅' : 'ВИБРАТИ'}
                </Button>
              </Box>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};
