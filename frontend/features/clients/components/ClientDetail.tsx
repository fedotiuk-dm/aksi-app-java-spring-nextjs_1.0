'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { Client } from '@/features/clients/types';
import {
  StatusChip,
  LoyaltyChip,
} from '@/features/clients/components/ClientsList';

export function ClientDetail() {
  const params = useParams();
  const clientId = params.clientId as string;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/clients/${clientId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setClient(data);
      } catch (err) {
        console.error('Помилка при отриманні даних клієнта:', err);
        setError('Не вдалося завантажити дані клієнта. Спробуйте пізніше.');
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  if (loading) {
    return (
      <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography>Завантаження інформації про клієнта...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!client) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="warning">Клієнта не знайдено</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              {client.firstName} {client.lastName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <StatusChip status={client.status} />
              <LoyaltyChip level={client.loyaltyLevel} />
            </Box>
          </Box>
          <Button variant="contained" color="primary">
            Редагувати
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" gutterBottom>
              {client.email}
            </Typography>

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              Телефон
            </Typography>
            <Typography variant="body1" gutterBottom>
              {client.phone}
            </Typography>

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              Адреса
            </Typography>
            <Typography variant="body1" gutterBottom>
              {client.address}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Дата реєстрації
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(client.createdAt).toLocaleDateString('uk-UA')}
            </Typography>

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              Примітки
            </Typography>
            <Typography variant="body1" gutterBottom>
              {client.notes || 'Немає приміток'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Історія замовлень
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Історія замовлень буде доступна в наступних версіях
        </Typography>
      </Paper>
    </Box>
  );
}
