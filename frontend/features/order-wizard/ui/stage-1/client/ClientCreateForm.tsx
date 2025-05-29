'use client';

import { Person, Save } from '@mui/icons-material';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Paper,
} from '@mui/material';
import { useState } from 'react';

import { useClientManagement } from '@/domain/wizard';
import {
  type CreateClientRequest,
  type CreateClientRequestCommunicationChannelsItem,
  CreateClientRequestCommunicationChannelsItem as CommunicationChannelEnum,
} from '@/shared/api/generated/client';

// Додаємо enum для source, так як він поки не експортується з API
enum CreateClientRequestSource {
  INSTAGRAM = 'INSTAGRAM',
  GOOGLE = 'GOOGLE',
  RECOMMENDATION = 'RECOMMENDATION',
  OTHER = 'OTHER',
}

interface ClientCreateFormProps {
  isLoading: boolean;
  error: string | null;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  communicationChannels: CreateClientRequestCommunicationChannelsItem[];
  source: CreateClientRequestSource | '';
  sourceDetails: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  communicationChannels?: string; // Змінюємо тип на string для помилок
  source?: string;
  sourceDetails?: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  communicationChannels: ['PHONE'], // За замовчуванням телефон
  source: '',
  sourceDetails: '',
};

const communicationChannelLabels = {
  PHONE: 'Телефонні дзвінки',
  SMS: 'SMS повідомлення',
  VIBER: 'Viber',
} as const;

const sourceLabels = {
  INSTAGRAM: 'Instagram',
  GOOGLE: 'Google',
  RECOMMENDATION: 'Рекомендації',
  OTHER: 'Інше',
} as const;

/**
 * Форма створення нового клієнта
 * Включає всі необхідні поля згідно з API схемою
 */
export const ClientCreateForm = ({ isLoading, error }: ClientCreateFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { createClient } = useClientManagement();

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Валідація обов'язкових полів
    if (!formData.firstName.trim()) {
      errors.firstName = "Ім'я обов'язкове";
    } else if (formData.firstName.length < 2) {
      errors.firstName = "Ім'я повинно містити мінімум 2 символи";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Прізвище обов'язкове";
    } else if (formData.lastName.length < 2) {
      errors.lastName = 'Прізвище повинно містити мінімум 2 символи';
    }

    if (!formData.phone.trim()) {
      errors.phone = "Телефон обов'язковий";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      errors.phone = 'Некоректний формат телефону';
    }

    // Валідація email (якщо вказано)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Некоректний формат email';
    }

    // Валідація джерела
    if (!formData.source) {
      errors.source = 'Оберіть джерело інформації';
    }

    // Якщо джерело "Інше", то деталі обов'язкові
    if (formData.source === 'OTHER' && !formData.sourceDetails.trim()) {
      errors.sourceDetails = 'Уточніть джерело інформації';
    }

    // Каналів зв'язку повинен бути хоча б один
    if (formData.communicationChannels.length === 0) {
      errors.communicationChannels = "Оберіть хоча б один спосіб зв'язку";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange =
    (field: keyof FormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));

      // Очищуємо помилку для поля при зміні
      if (formErrors[field]) {
        setFormErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  const handleSelectChange = (field: keyof FormData) => (event: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));

    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleCommunicationChannelChange =
    (channel: CreateClientRequestCommunicationChannelsItem) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        communicationChannels: event.target.checked
          ? [...prev.communicationChannels, channel]
          : prev.communicationChannels.filter((c) => c !== channel),
      }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Підготовка даних для API
    const clientData: CreateClientRequest = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      address: formData.address.trim() || undefined,
      communicationChannels: formData.communicationChannels,
      source: formData.source as CreateClientRequestSource,
      sourceDetails: formData.sourceDetails.trim() || undefined,
    };

    await createClient(clientData);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setFormErrors({});
  };

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Person color="primary" />
        <Typography variant="h6">Створення нового клієнта</Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Основна інформація */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" gutterBottom>
              Основна інформація
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Ім'я *"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
              disabled={isLoading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Прізвище *"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
              disabled={isLoading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Телефон *"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              placeholder="+380123456789"
              disabled={isLoading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={isLoading}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Адреса"
              value={formData.address}
              onChange={handleInputChange('address')}
              error={!!formErrors.address}
              helperText={formErrors.address}
              disabled={isLoading}
              multiline
              rows={2}
            />
          </Grid>

          {/* Способи зв'язку */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Способи зв&apos;язку *
            </Typography>
            <FormGroup row>
              {Object.entries(communicationChannelLabels).map(([channel, label]) => (
                <FormControlLabel
                  key={channel}
                  control={
                    <Checkbox
                      checked={formData.communicationChannels.includes(
                        channel as CreateClientRequestCommunicationChannelsItem
                      )}
                      onChange={handleCommunicationChannelChange(
                        channel as CreateClientRequestCommunicationChannelsItem
                      )}
                      disabled={isLoading}
                    />
                  }
                  label={label}
                />
              ))}
            </FormGroup>
            {formErrors.communicationChannels && (
              <Typography variant="caption" color="error">
                {formErrors.communicationChannels}
              </Typography>
            )}
          </Grid>

          {/* Джерело інформації */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!formErrors.source}>
              <InputLabel>Джерело інформації *</InputLabel>
              <Select
                value={formData.source}
                label="Джерело інформації *"
                onChange={handleSelectChange('source')}
                disabled={isLoading}
              >
                {Object.entries(sourceLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.source && (
                <Typography variant="caption" color="error">
                  {formErrors.source}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {formData.source === 'OTHER' && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Уточніть джерело *"
                value={formData.sourceDetails}
                onChange={handleInputChange('sourceDetails')}
                error={!!formErrors.sourceDetails}
                helperText={formErrors.sourceDetails}
                disabled={isLoading}
              />
            </Grid>
          )}

          {/* Кнопки */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="outlined" onClick={handleReset} disabled={isLoading}>
                Очистити
              </Button>

              <Button type="submit" variant="contained" startIcon={<Save />} disabled={isLoading}>
                {isLoading ? 'Створення...' : 'Створити клієнта'}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Помилка */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </form>
    </Paper>
  );
};
