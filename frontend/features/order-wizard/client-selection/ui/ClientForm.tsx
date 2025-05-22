'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ClientResponse } from '@/lib/api';

import { clientSourceOptions } from '../model/client-sources';
import { clientFormSchema } from '../schemas';

// Інтерфейс для властивостей компонента
interface ClientFormProps {
  initialClient: ClientResponse | null;
  onSave: (clientData: z.infer<typeof clientFormSchema>) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

/**
 * Компонент форми для створення/редагування клієнта
 */
export const ClientForm: React.FC<ClientFormProps> = ({
  initialClient,
  onSave,
  onCancel,
  isEditing = false,
}) => {
  // Локальні стани
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Хук для форми клієнта - не використовуємо безпосередньо тут, бо логіка обробки форми в батьківському компоненті

  // Медіа-запити для адаптивного дизайну
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  // Використовуємо тип даних форми на основі Zod схеми
  type ClientFormData = z.infer<typeof clientFormSchema>;

  // Налаштування форми з валідацією
  const {
    control,
    handleSubmit,
    formState: { isValid, isDirty },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      firstName: initialClient?.firstName || '',
      lastName: initialClient?.lastName || '',
      phone: initialClient?.phone || '',
      email: initialClient?.email || '',
      address: initialClient?.address || '',
      // Конвертуємо source в масив, якщо воно існує, або пустий масив за замовчуванням
      source: initialClient?.source ? (Array.isArray(initialClient.source) ? initialClient.source : [initialClient.source]) : [],
    },
    mode: 'onChange',
  });

  // Обробник відправки форми
  const onSubmit = async (data: ClientFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSave(data);
      reset(data); // Скидаємо стан форми для уникнення повторної відправки
    } catch (err) {
      console.error('Помилка збереження клієнта:', err);
      setError('Помилка при збереженні даних клієнта. Спробуйте знову.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant={isTablet ? 'h5' : 'h6'} fontWeight={500}>
          {isEditing ? 'Редагування клієнта' : 'Створення нового клієнта'}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onCancel}
          size={isTablet ? 'medium' : 'small'}
          disabled={isSubmitting}
        >
          Назад
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Прізвище */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="lastName"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Прізвище *"
                  fullWidth
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSubmitting}
                  size={isTablet ? 'medium' : 'small'}
                />
              )}
            />
          </Grid>

          {/* Ім'я */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Ім'я *"
                  fullWidth
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSubmitting}
                  size={isTablet ? 'medium' : 'small'}
                />
              )}
            />
          </Grid>

          {/* Телефон */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Телефон"
                  fullWidth
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSubmitting}
                  size={isTablet ? 'medium' : 'small'}
                  placeholder="+380XXXXXXXXX"
                />
              )}
            />
          </Grid>

          {/* Email */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSubmitting}
                  size={isTablet ? 'medium' : 'small'}
                  type="email"
                />
              )}
            />
          </Grid>

          {/* Адреса */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Адреса"
                  fullWidth
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSubmitting}
                  size={isTablet ? 'medium' : 'small'}
                  multiline
                  rows={2}
                />
              )}
            />
          </Grid>

          {/* Джерело звернення */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="source"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Джерела звернення"
                  fullWidth
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || 'Можна вибрати декілька джерел'}
                  disabled={isSubmitting}
                  size={isTablet ? 'medium' : 'small'}
                  value={field.value || []}
                  SelectProps={{
                    multiple: true,
                    displayEmpty: true,
                    renderValue: (selected: string[]) => {
                      if (!selected || selected.length === 0) {
                        return <em>Виберіть одне або декілька джерел</em>;
                      }

                      const selectedOptions = clientSourceOptions.filter(
                        option => selected.includes(option.value)
                      );
                      return selectedOptions.map(option => option.label).join(', ');
                    },
                  }}
                >
                  {clientSourceOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Кнопки дій */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting || !isValid || !isDirty}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                size={isTablet ? 'large' : 'medium'}
              >
                {isSubmitting ? 'Збереження...' : 'Зберегти клієнта'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ClientForm;
