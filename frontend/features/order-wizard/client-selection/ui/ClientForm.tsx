'use client';

import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

import { ClientResponse, CreateClientRequest } from '@/lib/api';

import { useClientForm } from '../hooks';
import { ClientFormData } from '../model/types';
import { formatValidationErrors } from '../utils';

import type { Control } from 'react-hook-form';

interface ClientFormProps {
  initialClient?: ClientResponse | null;
  onSave?: (data: ClientResponse) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

/**
 * Компонент форми для створення/редагування клієнта
 * Відповідає за відображення та взаємодію з користувачем
 * Всі бізнес-процеси винесені в хуки та модель
 */
const ClientForm: React.FC<ClientFormProps> = ({ onSave, onCancel, isEditing = false }) => {
  // Використовуємо хук для форми клієнта
  const { form, isSubmitting, error, showSourceDetails, handleSubmit } = useClientForm({
    type: isEditing ? 'edit' : 'create',
    onSuccess: (client) => {
      if (onSave) onSave(client);
    },
  });

  // Деструктуємо необхідні методи форми
  const {
    control,
    formState: { errors, isDirty, isValid },
  } = form;

  // Підготовка списку помилок валідації для відображення
  const validationErrors = formatValidationErrors({
    ...(errors as Record<string, { message?: string; type?: string }>),
  });

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      noValidate
    >
      <Typography variant="h6" gutterBottom>
        {isEditing ? 'Редагування клієнта' : 'Створення нового клієнта'}
      </Typography>

      {/* Відображення загальних помилок */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {validationErrors.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Форма містить помилки:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {validationErrors.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Прізвище */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="lastName"
            control={control as Control<ClientFormData>}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value === null ? '' : field.value}
                label="Прізвище *"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                variant="outlined"
              />
            )}
          />
        </Grid>

        {/* Ім'я */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="firstName"
            control={control as Control<ClientFormData>}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value === null ? '' : field.value}
                label="Ім'я *"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                variant="outlined"
              />
            )}
          />
        </Grid>

        {/* Телефон */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="phone"
            control={control as Control<ClientFormData>}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value === null ? '' : field.value}
                label="Телефон *"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message || 'Формат: +380XXXXXXXXX'}
                variant="outlined"
              />
            )}
          />
        </Grid>

        {/* Email */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="email"
            control={control as Control<ClientFormData>}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value === null ? '' : field.value}
                label="Email"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                variant="outlined"
              />
            )}
          />
        </Grid>

        {/* Адреса */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="address"
            control={control as Control<ClientFormData>}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value === null ? '' : field.value}
                label="Адреса"
                fullWidth
                multiline
                rows={2}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                variant="outlined"
              />
            )}
          />
        </Grid>

        {/* Канали комунікації */}
        <Grid size={{ xs: 12 }}>
          <FormControl component="fieldset">
            <Typography variant="subtitle2" gutterBottom>
              Канали комунікації
            </Typography>
            <Controller
              name="communicationChannels"
              control={control as Control<ClientFormData>}
              render={({ field }) => (
                <Stack direction="row" spacing={2}>
                  {/* Телефон */}
                  <FormControlLabel
                    control={
                      <Radio
                        checked={field.value?.includes('PHONE')}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...(field.value || []), 'PHONE']
                            : ((field.value || []) as Array<'PHONE' | 'SMS' | 'VIBER'>).filter(
                                (v) => v !== 'PHONE'
                              );
                          field.onChange(newValue);
                        }}
                      />
                    }
                    label="Телефон"
                  />
                  {/* SMS */}
                  <FormControlLabel
                    control={
                      <Radio
                        checked={field.value?.includes('SMS')}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...(field.value || []), 'SMS']
                            : ((field.value || []) as Array<'PHONE' | 'SMS' | 'VIBER'>).filter(
                                (v) => v !== 'SMS'
                              );
                          field.onChange(newValue);
                        }}
                      />
                    }
                    label="SMS"
                  />
                  {/* Viber */}
                  <FormControlLabel
                    control={
                      <Radio
                        checked={field.value?.includes('VIBER')}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...(field.value || []), 'VIBER']
                            : ((field.value || []) as Array<'PHONE' | 'SMS' | 'VIBER'>).filter(
                                (v) => v !== 'VIBER'
                              );
                          field.onChange(newValue);
                        }}
                      />
                    }
                    label="Viber"
                  />
                </Stack>
              )}
            />
          </FormControl>
        </Grid>

        {/* Джерело інформації */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="source"
            control={control as Control<ClientFormData>}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel>Джерело інформації</InputLabel>
                <Select
                  {...field}
                  value={field.value === null ? [] : field.value}
                  label="Джерело інформації"
                >
                  <MenuItem value={CreateClientRequest.source.INSTAGRAM}>Instagram</MenuItem>
                  <MenuItem value={CreateClientRequest.source.GOOGLE}>Google</MenuItem>
                  <MenuItem value={CreateClientRequest.source.RECOMMENDATION}>
                    Рекомендація
                  </MenuItem>
                  <MenuItem value="OTHER">Інше</MenuItem>
                </Select>
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </Grid>

        {/* Деталі джерела, відображаються умовно */}
        {showSourceDetails && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="sourceDetails"
              control={control as Control<ClientFormData>}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value === null ? '' : field.value}
                  label="Деталі джерела *"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  variant="outlined"
                />
              )}
            />
          </Grid>
        )}
      </Grid>

      {/* Кнопки дій */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button variant="outlined" color="secondary" onClick={onCancel} startIcon={<CancelIcon />}>
          Скасувати
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          disabled={isSubmitting || !isDirty || !isValid}
        >
          {isSubmitting ? 'Збереження...' : 'Зберегти'}
        </Button>
      </Box>
    </Box>
  );
};

export default ClientForm;
