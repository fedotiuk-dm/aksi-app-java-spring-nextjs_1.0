'use client';

import { PersonAdd as PersonAddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import React, { useState } from 'react';

// Доменна логіка
import { useClientCreation } from '@/domains/wizard/stage1/client-creation';

// Загальні компоненти
import { ClientCreationForm } from './components';

interface ClientCreationStepProps {
  onClientCreated: (clientId: string) => void;
  onGoBack: () => void;
}

export const ClientCreationStep: React.FC<ClientCreationStepProps> = ({
  onClientCreated,
  onGoBack,
}) => {
  // ========== ДОМЕННА ЛОГІКА ==========
  const { ui, loading, mutations } = useClientCreation();

  // ========== ЛОКАЛЬНИЙ UI СТАН ==========
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [contactMethods, setContactMethods] = useState<string[]>([]);
  const [infoSource, setInfoSource] = useState('');
  const [sourceDetails, setSourceDetails] = useState('');

  // ========== EVENT HANDLERS ==========
  const handleCreateClient = async () => {
    if (!firstName || !lastName || !phone || !ui.sessionId) return;

    try {
      const result = await mutations.createClient.mutateAsync({
        sessionId: ui.sessionId,
      });

      if (result?.id) {
        onClientCreated(result.id);
      }
    } catch (error) {
      console.error('Помилка створення клієнта:', error);
    }
  };

  const handleContactMethodsChange = (methods: string[]) => {
    setContactMethods(methods);
  };

  // ========== RENDER ==========
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Заголовок */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onGoBack}
          variant="outlined"
          size="small"
          disabled={loading.isCreating}
        >
          Назад до пошуку
        </Button>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon color="primary" />
          Створення нового клієнта
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Заповніть інформацію про нового клієнта. Поля з * є обов&apos;язковими.
      </Typography>

      <Card>
        <CardContent>
          <ClientCreationForm
            // Основна інформація
            firstName={firstName}
            onFirstNameChange={setFirstName}
            lastName={lastName}
            onLastNameChange={setLastName}
            phone={phone}
            onPhoneChange={setPhone}
            email={email}
            onEmailChange={setEmail}
            address={address}
            onAddressChange={setAddress}
            // Способи зв'язку
            contactMethods={contactMethods}
            onContactMethodsChange={handleContactMethodsChange}
            // Джерело інформації
            infoSource={infoSource}
            onInfoSourceChange={setInfoSource}
            sourceDetails={sourceDetails}
            onSourceDetailsChange={setSourceDetails}
            // Стан
            isCreating={loading.isCreating}
          />

          {/* Кнопки дій */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleCreateClient}
              disabled={!firstName || !lastName || !phone || loading.isCreating}
              startIcon={loading.isCreating ? <CircularProgress size={20} /> : <PersonAddIcon />}
              fullWidth
            >
              {loading.isCreating ? 'Створення...' : 'Створити клієнта'}
            </Button>
          </Stack>

          {/* Помилки */}
          {mutations.createClient.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Помилка створення клієнта: {mutations.createClient.error.message}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
