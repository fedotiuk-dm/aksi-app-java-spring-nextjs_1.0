'use client';

import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Typography,
  Button,
  Divider,
  Alert,
  Paper,
} from '@mui/material';
import React, { useState } from 'react';
import { z } from 'zod';

import { ClientResponse } from '@/lib/api';

import { StepContainer, StepNavigation } from '../../shared/ui';
import { useWizardNavigation } from '../../wizard/hooks';
import { clientFormSchema } from '../schemas';
import { useClientStore } from '../store';
import ClientForm from './ClientForm';
import ClientList from './ClientList';
import ClientSearchForm from './ClientSearchForm';

/**
 * Компонент для першого кроку Order Wizard - вибір або створення клієнта
 */
export const ClientSelectionStep: React.FC = () => {
  // Хуки для взаємодії з API та стейт-менеджментом
  const clientStore = useClientStore();
  const { goForward } = useWizardNavigation();

  // Локальний стан компонента
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<ClientResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Дочірні компоненти самі використовують useTheme та useMediaQuery

  // Обробка вибору клієнта
  const handleClientSelect = (client: ClientResponse) => {
    // Зберігаємо вибраного клієнта в локальному стані
    clientStore.selectedClient = client;
    setClientToEdit(null);
    setShowCreateForm(false);
  };

  // Обробка редагування клієнта
  const handleClientEdit = (client: ClientResponse) => {
    setClientToEdit(client);
    setShowCreateForm(true);
  };

  // Імітація методів API для роботи з клієнтами
  const createClient = async (data: z.infer<typeof clientFormSchema>): Promise<ClientResponse> => {
    // Симуляція запиту на сервер
    return {
      id: `client-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      // Беремо перше значення з масиву джерел або 'OTHER' як значення за замовчуванням
      source: Array.isArray(data.source) && data.source.length > 0
        ? data.source[0] as unknown as ClientResponse.source
        : 'OTHER' as unknown as ClientResponse.source
    };
  };

  const updateClient = async (data: ClientResponse): Promise<ClientResponse> => {
    // Симуляція оновлення клієнта
    return data;
  };

  // Обробка створення/оновлення клієнта
  const handleSaveClient = async (clientData: z.infer<typeof clientFormSchema>) => {
    try {
      setError(null);

      if (clientToEdit?.id) {
        // Редагування існуючого клієнта
        const updatedClient = await updateClient({
          id: clientToEdit.id,
          ...clientData
        } as ClientResponse);
        handleClientSelect(updatedClient);
      } else {
        // Створення нового клієнта
        const newClient = await createClient(clientData);
        handleClientSelect(newClient);
      }

      setShowCreateForm(false);
      setClientToEdit(null);
    } catch (err) {
      setError('Помилка при збереженні даних клієнта. Спробуйте знову.');
      console.error('Помилка збереження клієнта:', err);
    }
  };

  // Перехід на наступний крок
  const handleNext = () => {
    if (clientStore.selectedClient) {
      goForward();
    }
  };

  // Визначення вмісту залежно від стану
  const renderContent = () => {
    if (showCreateForm) {
      return (
        <ClientForm
          initialClient={clientToEdit}
          onSave={handleSaveClient}
          onCancel={() => {
            setShowCreateForm(false);
            setClientToEdit(null);
          }}
          isEditing={!!clientToEdit}
        />
      );
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <ClientSearchForm />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setShowCreateForm(true);
                setClientToEdit(null);
              }}
            >
              Створити клієнта
            </Button>
          </Box>
        </Paper>

        <ClientList onClientSelect={handleClientSelect} onClientEdit={handleClientEdit} />

        {clientStore.selectedClient && (
          <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />} sx={{ mt: 2 }}>
            Клієнт {clientStore.selectedClient.lastName} {clientStore.selectedClient.firstName}{' '}
            обраний
          </Alert>
        )}
      </Box>
    );
  };

  return (
    <StepContainer title="Вибір клієнта">
      <Typography variant="body1" color="text.secondary" paragraph>
        Виберіть існуючого клієнта або створіть нового для цього замовлення
      </Typography>

      <Divider sx={{ my: 2 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {renderContent()}

      <StepNavigation
        nextLabel="Продовжити"
        onNext={handleNext}
        isNextDisabled={!clientStore.selectedClient}
        hideBackButton={true}
      />
    </StepContainer>
  );
};

export default ClientSelectionStep;
