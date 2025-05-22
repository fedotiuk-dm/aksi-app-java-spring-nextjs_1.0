'use client';

import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';

import { ClientResponse } from '@/lib/api';

// Імпорти з відповідних шарів згідно FSD
import { useWizardNavigation } from '../../wizard/hooks';
import { useClientForm } from '../hooks';
import ClientForm from './ClientForm';
import ClientList from './ClientList';
import ClientSearchForm from './ClientSearchForm';
import { useClientStore } from '../model/store';

/**
 * Компонент для першого кроку Order Wizard - вибір або створення клієнта
 */
export const ClientSelectionStep: React.FC = () => {
  // Хуки для взаємодії з API та стейт-менеджментом
  const { selectedClient, selectClient } = useClientStore();
  const { goForward } = useWizardNavigation();

  // Локальний стан компонента (тільки для UI)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<ClientResponse | null>(null);

  // Хук для роботи з формою клієнта (model-шар)
  const {} = useClientForm({
    type: clientToEdit ? 'edit' : 'create',
    onSuccess: (client) => {
      handleClientSelect(client);
      setShowCreateForm(false);
      setClientToEdit(null);
    },
  });

  // Обробка вибору клієнта
  const handleClientSelect = (client: ClientResponse) => {
    // Зберігаємо вибраного клієнта
    selectClient(client);
    setClientToEdit(null);
    setShowCreateForm(false);
  };

  // Обробка редагування клієнта
  const handleClientEdit = (client: ClientResponse) => {
    setClientToEdit(client);
    setShowCreateForm(true);
  };

  // Перехід на наступний крок
  const handleNext = () => {
    if (selectedClient) {
      goForward();
    }
  };

  // Визначення вмісту залежно від стану
  const renderContent = () => {
    if (showCreateForm) {
      return (
        <ClientForm
          initialClient={clientToEdit}
          onSave={async () => {
            // onSubmit вже викликається всередині ClientForm
            // Повертаємо порожній Promise для сумісності типів
            return Promise.resolve();
          }}
          onCancel={() => {
            setShowCreateForm(false);
            setClientToEdit(null);
          }}
          isEditing={!!clientToEdit}
        />
      );
    }

    return (
      <>
        <ClientSearchForm />
        <Box sx={{ mt: 3, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setClientToEdit(null);
              setShowCreateForm(true);
            }}
          >
            Створити нового клієнта
          </Button>
        </Box>
        <ClientList onClientSelect={handleClientSelect} onClientEdit={handleClientEdit} />
      </>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Вибір клієнта
      </Typography>
      <Typography variant="body1" gutterBottom>
        Оберіть існуючого клієнта або створіть нового
      </Typography>

      {renderContent()}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleNext} disabled={!selectedClient}>
          Далі
        </Button>
      </Box>
    </Box>
  );
};

export default ClientSelectionStep;
