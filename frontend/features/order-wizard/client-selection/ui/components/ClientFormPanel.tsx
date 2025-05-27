'use client';

import { ArrowBack, Save } from '@mui/icons-material';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

import type { UseClientManagementReturn } from '@/domain/wizard/hooks';
import type { ClientData } from '@/domain/wizard/services/stage-1-client-and-order-info';

interface ClientFormPanelProps {
  formMethods: UseClientManagementReturn['formMethods'];
  isCreating: boolean;
  isUpdating: boolean;
  onSubmit: (data: ClientData) => Promise<void>;
  onBack: () => void;
  ContactMethod: UseClientManagementReturn['ContactMethod'];
  InformationSource: UseClientManagementReturn['InformationSource'];
  validateClientData: UseClientManagementReturn['validateClientData'];
  isEditing?: boolean;
}

/**
 * Панель форми для створення клієнта
 */
export const ClientFormPanel: React.FC<ClientFormPanelProps> = ({
  formMethods,
  isCreating,
  isUpdating,
  onSubmit,
  onBack,
  ContactMethod,
  InformationSource,
  validateClientData,
  isEditing = false,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = formMethods;
  const informationSource = watch('informationSource');

  const handleFormSubmit = handleSubmit(async (data) => {
    const validation = validateClientData(data as unknown as ClientData);
    if (validation.success) {
      await onSubmit(data as unknown as ClientData);
    }
  });

  const isLoading = isCreating || isUpdating;

  return (
    <Box>
      {/* Заголовок з кнопкою назад */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mr: 2 }}>
          Назад
        </Button>
        <Typography variant="h6">
          {isEditing ? 'Редагування клієнта' : 'Створення нового клієнта'}
        </Typography>
      </Box>

      {/* Форма */}
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={3}>
          {/* Основна інформація */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              Основна інформація
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Ім'я"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  required
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Прізвище"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  required
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Телефон"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  required
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="email"
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Адреса"
                  multiline
                  rows={2}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid>

          {/* Способи зв'язку */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Способи зв&apos;язку
            </Typography>
            <Controller
              name="contactMethods"
              control={control}
              render={({ field }) => (
                <FormGroup row>
                  {Object.values(ContactMethod).map((method) => (
                    <FormControlLabel
                      key={method}
                      control={
                        <Checkbox
                          checked={field.value?.includes(method) || false}
                          onChange={(e) => {
                            const currentMethods = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...currentMethods, method]);
                            } else {
                              field.onChange(currentMethods.filter((m: string) => m !== method));
                            }
                          }}
                        />
                      }
                      label={method}
                    />
                  ))}
                </FormGroup>
              )}
            />
          </Grid>

          {/* Джерело інформації */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Джерело інформації
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="informationSource"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Як дізналися про нас?</InputLabel>
                  <Select {...field} label="Як дізналися про нас?">
                    {Object.values(InformationSource).map((source) => (
                      <MenuItem key={source} value={source}>
                        {source}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          {informationSource === InformationSource.OTHER && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="informationSourceOther"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Уточніть джерело"
                    error={!!errors.informationSourceOther}
                    helperText={errors.informationSourceOther?.message}
                  />
                )}
              />
            </Grid>
          )}

          {/* Кнопки */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="outlined" onClick={onBack} disabled={isLoading}>
                Скасувати
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={16} /> : <Save />}
                disabled={isLoading}
              >
                {isLoading
                  ? isEditing
                    ? 'Збереження...'
                    : 'Створення...'
                  : isEditing
                    ? 'Зберегти зміни'
                    : 'Створити клієнта'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
