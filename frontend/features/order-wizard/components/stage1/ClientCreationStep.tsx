'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';

// Готові UI компоненти
import { StepContainer, ActionButton } from '@/shared/ui';

// Прямі Orval хуки та типи
import {
  useStage1InitializeNewClient,
  useStage1UpdateClientData,
  useStage1CreateClient,
  type NewClientFormDTOCommunicationChannelsItem as ContactMethod,
  type NewClientFormDTOInformationSource as InformationSource,
  type NewClientFormDTO,
  type ClientResponse,
} from '@/shared/api/generated/stage1';

// Стор
import { useStage1WizardStore } from '../../stores/stage1-wizard.store';

interface ClientCreationStepProps {
  sessionId: string;
  onNext: () => void;
  onBack: () => void;
}

interface ClientFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  communicationChannels: ContactMethod[];
  informationSource: InformationSource | undefined;
  sourceDetails: string;
}

export const ClientCreationStep = ({ sessionId, onNext, onBack }: ClientCreationStepProps) => {
  // ========== STATE ==========
  const { setSelectedClientId } = useStage1WizardStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    communicationChannels: [],
    informationSource: undefined,
    sourceDetails: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ========== ORVAL HOOKS ==========
  const initializeMutation = useStage1InitializeNewClient();
  const updateMutation = useStage1UpdateClientData();
  const createMutation = useStage1CreateClient();

  // ========== EFFECTS ==========
  // Ініціалізація форми при завантаженні
  useEffect(() => {
    if (sessionId && !isInitialized) {
      setIsInitialized(true);
      initializeMutation.mutate();
    }
  }, [sessionId, isInitialized, initializeMutation]);

  // Обробка успішного створення клієнта
  useEffect(() => {
    if (createMutation.isSuccess && createMutation.data) {
      const clientData = createMutation.data as ClientResponse;
      if (clientData.id) {
        setSelectedClientId(clientData.id);
        onNext();
      }
    }
  }, [createMutation.isSuccess, createMutation.data, setSelectedClientId, onNext]);

  // ========== VALIDATION ==========
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ім&apos;я обов&apos;язкове';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Прізвище обов&apos;язкове';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обов&apos;язковий';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Невірний формат email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========== EVENT HANDLERS ==========
  const handleFieldChange = (
    field: keyof ClientFormData,
    value: string | ContactMethod[] | InformationSource | undefined
  ) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Очищення помилки для поля
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }

    // Автоматичне оновлення через API
    if (isInitialized) {
      const updateData: NewClientFormDTO = {
        firstName: newFormData.firstName,
        lastName: newFormData.lastName,
        phone: newFormData.phone,
        email: newFormData.email,
        address: newFormData.address,
        communicationChannels: newFormData.communicationChannels,
        informationSource: newFormData.informationSource,
        sourceDetails: newFormData.sourceDetails,
      };

      updateMutation.mutate({
        sessionId,
        data: updateData,
      });
    }
  };

  const handleContactMethodToggle = (method: ContactMethod) => {
    const newMethods = formData.communicationChannels.includes(method)
      ? formData.communicationChannels.filter((m) => m !== method)
      : [...formData.communicationChannels, method];

    handleFieldChange('communicationChannels', newMethods);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createMutation.mutateAsync({
        sessionId,
      });
    } catch (error) {
      console.error('❌ Помилка створення клієнта:', error);
    }
  };

  // ========== COMPUTED VALUES ==========
  const isLoading =
    initializeMutation.isPending || updateMutation.isPending || createMutation.isPending;
  const canSubmit = formData.firstName && formData.lastName && formData.phone && !isLoading;

  const contactMethodOptions: ContactMethod[] = ['PHONE', 'SMS', 'VIBER'];
  const informationSourceOptions: InformationSource[] = [
    'INSTAGRAM',
    'GOOGLE',
    'RECOMMENDATION',
    'OTHER',
  ];

  return (
    <StepContainer title="Створення нового клієнта" subtitle="Заповніть інформацію про клієнта">
      {!isInitialized && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Ініціалізація форми...</Typography>
        </Box>
      )}

      {isInitialized && (
        <Grid container spacing={3}>
          {/* Основна інформація */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              Основна інформація
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Ім'я *"
              value={formData.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
              disabled={isLoading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Прізвище *"
              value={formData.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
              disabled={isLoading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Телефон *"
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              disabled={isLoading}
              placeholder="+380..."
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
              type="email"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Адреса"
              value={formData.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              disabled={isLoading}
              multiline
              rows={2}
            />
          </Grid>

          {/* Способи зв&apos;язку */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Способи зв&apos;язку
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {contactMethodOptions.map((method) => (
                <Chip
                  key={method}
                  label={method}
                  variant={formData.communicationChannels.includes(method) ? 'filled' : 'outlined'}
                  onClick={() => handleContactMethodToggle(method)}
                  disabled={isLoading}
                  color={formData.communicationChannels.includes(method) ? 'primary' : 'default'}
                />
              ))}
            </Stack>
          </Grid>

          {/* Джерело інформації */}
          <Grid size={{ xs: 12, sm: 8 }}>
            <FormControl fullWidth>
              <InputLabel>Джерело інформації про хімчистку</InputLabel>
              <Select
                value={formData.informationSource || ''}
                onChange={(e) => handleFieldChange('informationSource', e.target.value)}
                disabled={isLoading}
                label="Джерело інформації про хімчистку"
              >
                {informationSourceOptions.map((source) => (
                  <MenuItem key={source} value={source}>
                    {source === 'INSTAGRAM' && 'Instagram'}
                    {source === 'GOOGLE' && 'Google'}
                    {source === 'RECOMMENDATION' && 'Рекомендації'}
                    {source === 'OTHER' && 'Інше'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {formData.informationSource === 'OTHER' && (
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Уточнення"
                value={formData.sourceDetails}
                onChange={(e) => handleFieldChange('sourceDetails', e.target.value)}
                disabled={isLoading}
                placeholder="Вкажіть джерело..."
              />
            </Grid>
          )}

          {/* Помилки */}
          {(createMutation.isError || updateMutation.isError) && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error">
                Виникла помилка при збереженні даних. Спробуйте ще раз.
              </Alert>
            </Grid>
          )}

          {/* Кнопки */}
          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3 }}>
              <ActionButton
                variant="outlined"
                onClick={onBack}
                startIcon={<ArrowBackIcon />}
                disabled={isLoading}
              >
                Назад
              </ActionButton>

              <ActionButton
                variant="contained"
                onClick={handleSubmit}
                disabled={!canSubmit}
                startIcon={<PersonAddIcon />}
              >
                {createMutation.isPending ? 'Створення...' : 'Створити клієнта'}
              </ActionButton>
            </Stack>
          </Grid>
        </Grid>
      )}
    </StepContainer>
  );
};
