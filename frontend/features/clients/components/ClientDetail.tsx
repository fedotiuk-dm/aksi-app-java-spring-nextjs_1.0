'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Client } from '@/features/clients/types/client.types';
import {
  StatusChip,
  LoyaltyChip,
} from '@/features/clients/components/ClientsList';
import { clientsApi } from '@/features/clients/api/clientsApi';

export function ClientDetail() {
  const params = useParams();
  const clientId = params.clientId as string;
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Функція для відкриття діалогу підтвердження видалення
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  // Функція для закриття діалогу підтвердження видалення
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // Функція для видалення клієнта
  const handleDeleteClient = async () => {
    try {
      setDeleteLoading(true);
      await clientsApi.deleteClient(clientId);
      // Закриваємо діалог
      setDeleteDialogOpen(false);
      // Перенаправляємо на сторінку зі списком клієнтів
      router.push('/clients');
    } catch (error: unknown) {
      console.error('Помилка при видаленні клієнта:', error);
      setError('Не вдалося видалити клієнта. Спробуйте пізніше.');
      setDeleteDialogOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await clientsApi.getClientById(clientId);
        setClient(data);
      } catch (error: unknown) {
        console.error('Помилка при отриманні даних клієнта:', error);
        const errorMessage = error instanceof Error ? error.message : 'Не вдалося завантажити дані клієнта. Спробуйте пізніше.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [clientId, router]);

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

      {/* Кнопка видалення клієнта */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleOpenDeleteDialog}
        >
          Видалити клієнта
        </Button>
      </Box>
      
      {/* Діалог підтвердження видалення */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Видалення клієнта
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ви дійсно хочете видалити клієнта {client?.firstName} {client?.lastName}? 
            Ця дія незворотна.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
            Скасувати
          </Button>
          <Button onClick={handleDeleteClient} color="error" autoFocus disabled={deleteLoading}>
            {deleteLoading ? 'Видалення...' : 'Видалити'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
