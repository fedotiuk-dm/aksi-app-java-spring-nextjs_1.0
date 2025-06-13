'use client';

import { FC } from 'react';
import { Box, Card, CardContent, Typography, Button, Alert, Fade } from '@mui/material';
import {
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

import { useClientSelection } from '@/domains/wizard/stage1';

import { ClientSearchStep } from './ClientSearchStep';
import { ClientCreateStep } from './ClientCreateStep';

interface ClientSelectionStepProps {
  onClientSelected?: () => void;
}

export const ClientSelectionStep: FC<ClientSelectionStepProps> = ({ onClientSelected }) => {
  const { mode, data, loading, actions, computed } = useClientSelection();

  const handleClientSelected = () => {
    const selectedClient = actions.onClientSelected();
    if (selectedClient) {
      onClientSelected?.();
    }
  };

  const handleClientCreated = () => {
    const createdClient = actions.onClientCreated();
    if (createdClient) {
      // Автоматично повертаємося до пошуку з новим клієнтом
      onClientSelected?.();
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Заголовок */}
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Вибір клієнта
      </Typography>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        {mode.isSearch
          ? 'Знайдіть існуючого клієнта або створіть нового'
          : 'Заповніть дані для створення нового клієнта'}
      </Typography>

      {/* Індикатор режиму */}
      <Card sx={{ mb: 3, bgcolor: mode.isCreate ? 'info.50' : 'background.paper' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {mode.isSearch ? <PersonIcon /> : <PersonAddIcon />}
            <Typography variant="h6">
              {mode.isSearch ? 'Пошук клієнта' : 'Створення нового клієнта'}
            </Typography>

            {mode.isCreate && (
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={mode.switchToSearch}
                variant="outlined"
                size="small"
              >
                Повернутися до пошуку
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Стан завантаження */}
      {loading.isAnyLoading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Виконання операції...
        </Alert>
      )}

      {/* Обраний клієнт */}
      {computed.hasSelectedClient && data.selectedClient && (
        <Fade in>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              ✅ Клієнт обраний
            </Typography>
            <Typography variant="body1">
              {data.selectedClient.firstName} {data.selectedClient.lastName}
            </Typography>
            {data.selectedClient.phone && (
              <Typography variant="body2" color="text.secondary">
                Телефон: {data.selectedClient.phone}
              </Typography>
            )}
          </Alert>
        </Fade>
      )}

      {/* Контент залежно від режиму */}
      {mode.isSearch ? (
        <ClientSearchStep
          onClientSelected={handleClientSelected}
          onCreateNewClient={mode.switchToCreate}
        />
      ) : (
        <ClientCreateStep onClientCreated={handleClientCreated} onCancel={mode.switchToSearch} />
      )}

      {/* Кнопка продовження */}
      {computed.canProceedToNextStep && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={onClientSelected}
            disabled={loading.isAnyLoading}
          >
            Продовжити до вибору філії
          </Button>
        </Box>
      )}
    </Box>
  );
};
