'use client';

import {
  CheckCircle,
  Edit,
  SwapHoriz,
  ArrowForward,
  Person,
  Phone,
  Email,
  LocationOn,
  NewReleases,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  Grid,
} from '@mui/material';
import React from 'react';

import type { ClientSearchResult } from '@/domain/wizard/services/stage-1-client-and-order-info';

const ICON_SIZE = 20;
const ICON_STYLE = { mr: 1, color: 'text.secondary', fontSize: ICON_SIZE } as const;

interface ClientSelectedPanelProps {
  client: ClientSearchResult;
  isNewClient: boolean;
  formatPhone: (phone: string) => string;
  createClientSummary: (client: ClientSearchResult) => string;
  onEdit: () => void;
  onChangeClient: () => void;
  onProceed: () => void;
}

/**
 * Панель відображення вибраного клієнта
 */
export const ClientSelectedPanel: React.FC<ClientSelectedPanelProps> = ({
  client,
  isNewClient,
  formatPhone,
  createClientSummary,
  onEdit,
  onChangeClient,
  onProceed,
}) => {
  const fullName = client.fullName || `${client.firstName} ${client.lastName}`;

  return (
    <Box>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <CheckCircle sx={{ mr: 2, color: 'success.main' }} />
        <Typography variant="h6">
          {isNewClient ? 'Новий клієнт створено' : 'Клієнт вибрано'}
        </Typography>
      </Box>

      {/* Статус нового клієнта */}
      {isNewClient && (
        <Alert severity="success" sx={{ mb: 3 }} icon={<NewReleases />}>
          Новий клієнт успішно створений та автоматично вибраний для замовлення
        </Alert>
      )}

      {/* Картка клієнта */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Основна інформація */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" component="div">
                  {fullName}
                </Typography>
              </Box>
            </Grid>

            {/* Контактна інформація */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Контактна інформація
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={ICON_STYLE} />
                <Typography variant="body1">{formatPhone(client.phone)}</Typography>
              </Box>

              {client.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={ICON_STYLE} />
                  <Typography variant="body1">{client.email}</Typography>
                </Box>
              )}

              {client.address && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <LocationOn sx={{ ...ICON_STYLE, mt: 0.2 }} />
                  <Typography variant="body1">{client.address}</Typography>
                </Box>
              )}
            </Grid>

            {/* Додаткова інформація */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Додаткова інформація
              </Typography>

              {client.orderCount !== undefined && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Кількість замовлень: {client.orderCount}
                </Typography>
              )}

              {isNewClient && (
                <Chip label="Новий клієнт" color="primary" size="small" sx={{ mb: 1 }} />
              )}

              <Typography variant="body2" color="text.secondary">
                ID клієнта: {client.id}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Резюме клієнта */}
      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Резюме клієнта:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {createClientSummary(client)}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Дії */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {/* Кнопки зліва */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Edit />} onClick={onEdit} size="small">
            Редагувати
          </Button>
          <Button
            variant="outlined"
            startIcon={<SwapHoriz />}
            onClick={onChangeClient}
            size="small"
          >
            Змінити клієнта
          </Button>
        </Box>

        {/* Кнопка продовження справа */}
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          onClick={onProceed}
          sx={{ minWidth: 200 }}
        >
          Продовжити до наступного етапу
        </Button>
      </Box>

      {/* Підказка */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
        <Typography variant="caption" color="info.main">
          💡 Переконайтеся, що вся інформація про клієнта правильна перед продовженням. Ви зможете
          змінити клієнта пізніше, але це може вплинути на дані замовлення.
        </Typography>
      </Box>
    </Box>
  );
};
