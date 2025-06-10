'use client';

import { Box, Grid, Typography, TextField, Button } from '@mui/material';
import React from 'react';

import type { CreateClientRequest } from '@/shared/api/generated/full';

interface NewClientFormProps {
  onCreateClient: (clientData: CreateClientRequest) => Promise<void>;
  onCancel: () => void;
  isCreating: boolean;
}

export const NewClientForm: React.FC<NewClientFormProps> = ({
  onCreateClient,
  onCancel,
  isCreating,
}) => {
  const [newClientData, setNewClientData] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
  });

  const handleCreateClient = async () => {
    await onCreateClient({
      ...newClientData,
      communicationChannels: ['PHONE'], // Default
      source: 'OTHER', // Default
    });

    // Очищуємо форму після успішного створення
    setNewClientData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Новий клієнт:
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Прізвище *"
            value={newClientData.lastName}
            onChange={(e) => setNewClientData((prev) => ({ ...prev, lastName: e.target.value }))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Ім'я *"
            value={newClientData.firstName}
            onChange={(e) => setNewClientData((prev) => ({ ...prev, firstName: e.target.value }))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Телефон *"
            value={newClientData.phone}
            onChange={(e) => setNewClientData((prev) => ({ ...prev, phone: e.target.value }))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newClientData.email}
            onChange={(e) => setNewClientData((prev) => ({ ...prev, email: e.target.value }))}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Адреса"
            value={newClientData.address}
            onChange={(e) => setNewClientData((prev) => ({ ...prev, address: e.target.value }))}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleCreateClient}
          disabled={
            isCreating ||
            !newClientData.firstName ||
            !newClientData.lastName ||
            !newClientData.phone
          }
        >
          {isCreating ? 'Створення...' : 'Створити клієнта'}
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={isCreating}>
          Скасувати
        </Button>
      </Box>
    </Box>
  );
};
