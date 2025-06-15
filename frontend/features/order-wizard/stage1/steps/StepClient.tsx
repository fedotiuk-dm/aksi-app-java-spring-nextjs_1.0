'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useWizardForm } from '../WizardProvider';
import { useOrderWizardStore } from '../useOrderWizardStore';
import { type AutosaveData } from '../autosave';
import { type ClientResponse } from '@/shared/api/generated/stage1';

interface StepClientProps {
  autosaveData: AutosaveData;
}

export const StepClient: React.FC<StepClientProps> = ({ autosaveData }) => {
  const { form } = useWizardForm();
  const { goToNextStep } = useOrderWizardStore();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { control, watch, setValue } = form;
  const searchTerm = watch('clientData.searchTerm');
  const selectedClientId = watch('clientData.selectedClientId');

  // Обробник вибору клієнта зі списку
  const handleSelectClient = (client: ClientResponse) => {
    setValue('clientData.selectedClientId', client.id);
    setValue('clientData.firstName', client.firstName);
    setValue('clientData.lastName', client.lastName);
    setValue('clientData.phone', client.phone);
    setValue('clientData.email', client.email || '');
    setValue('clientData.address', client.address || '');
  };

  // Обробник створення нового клієнта
  const handleCreateClient = async () => {
    try {
      await autosaveData.createNewClient();
      setShowCreateForm(false);
      // Перехід до наступного кроку після успішного створення
      goToNextStep();
    } catch (error) {
      console.error('Помилка створення клієнта:', error);
    }
  };

  // Обробник переходу до наступного кроку
  const handleNext = () => {
    if (selectedClientId && selectedClientId.trim() !== '') {
      goToNextStep();
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Вибір клієнта
      </Typography>

      {/* Пошук клієнтів */}
      <Box sx={{ mb: 3 }}>
        <Controller
          name="clientData.searchTerm"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Пошук клієнта"
              placeholder="Введіть прізвище, ім'я, телефон або email"
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: autosaveData.isLoading && <CircularProgress size={20} />,
              }}
            />
          )}
        />
      </Box>

      {/* Результати пошуку */}
      {searchTerm && searchTerm.length >= 2 && (
        <Paper elevation={1} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Результати пошуку
          </Typography>
          <Divider />

          {autosaveData.searchResults.length > 0 ? (
            <List>
              {autosaveData.searchResults.map((client: ClientResponse) => (
                <ListItem key={client.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleSelectClient(client)}
                    selected={selectedClientId === client.id}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="body1" gutterBottom>
                        {`${client.lastName} ${client.firstName}`}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={client.phone}
                          size="small"
                          variant="outlined"
                          sx={{ pointerEvents: 'none' }}
                        />
                        {client.email && (
                          <Chip
                            label={client.email}
                            size="small"
                            variant="outlined"
                            sx={{ pointerEvents: 'none' }}
                          />
                        )}
                      </Stack>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2 }}>
              <Alert severity="info">
                Клієнтів не знайдено. Ви можете створити нового клієнта.
              </Alert>
            </Box>
          )}
        </Paper>
      )}

      {/* Форма створення нового клієнта */}
      {showCreateForm && (
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Створення нового клієнта
          </Typography>

          <Stack spacing={2}>
            <Controller
              name="clientData.firstName"
              control={control}
              rules={{ required: "Ім'я обов'язкове" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Ім'я *"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="clientData.lastName"
              control={control}
              rules={{ required: "Прізвище обов'язкове" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Прізвище *"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="clientData.phone"
              control={control}
              rules={{ required: "Телефон обов'язковий" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Телефон *"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="clientData.email"
              control={control}
              render={({ field }) => <TextField {...field} label="Email" type="email" fullWidth />}
            />

            <Controller
              name="clientData.address"
              control={control}
              render={({ field }) => <TextField {...field} label="Адреса" fullWidth />}
            />
          </Stack>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleCreateClient}
              disabled={autosaveData.isLoading}
            >
              Створити клієнта
            </Button>
            <Button variant="outlined" onClick={() => setShowCreateForm(false)}>
              Скасувати
            </Button>
          </Box>
        </Paper>
      )}

      {/* Кнопки дій */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => setShowCreateForm(true)}
          disabled={showCreateForm}
        >
          Створити нового клієнта
        </Button>

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!selectedClientId || selectedClientId.trim() === '' || autosaveData.isLoading}
        >
          Далі
        </Button>
      </Box>

      {/* Дебаг інформація */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption">
            Debug: SessionId: {autosaveData.sessionId}, Selected: {selectedClientId}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
