'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Stack,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  Alert,
  Box,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useOrderOnepageStore } from '../store/order-onepage.store';
import {
  useStage1UpdateClientData,
  useStage1CreateClient,
  type NewClientFormDTO,
} from '@/shared/api/generated/stage1';
import { z } from 'zod';

// Схема для форми створення клієнта, що відповідає NewClientFormDTO
const clientCreationFormSchema = z.object({
  firstName: z.string().min(2, "Ім'я повинно містити мінімум 2 символи"),
  lastName: z.string().min(2, 'Прізвище повинно містити мінімум 2 символи'),
  phone: z.string().min(10, 'Телефон повинен містити мінімум 10 символів'),
  email: z.string().email('Введіть коректний email').optional().or(z.literal('')),
  address: z.string().optional(),
  communicationChannels: z.array(z.enum(['PHONE', 'SMS', 'VIBER'])),
  informationSource: z.enum(['INSTAGRAM', 'GOOGLE', 'RECOMMENDATION', 'OTHER']),
  sourceDetails: z.string().optional(),
});

type ClientCreationFormData = z.infer<typeof clientCreationFormSchema>;

export const ClientCreateForm = () => {
  const { sessionId, setSelectedClientId, setShowClientForm } = useOrderOnepageStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateClientData = useStage1UpdateClientData();
  const createClient = useStage1CreateClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<ClientCreationFormData>({
    resolver: zodResolver(clientCreationFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      communicationChannels: [],
      informationSource: 'OTHER',
      sourceDetails: '',
    },
    mode: 'onChange',
  });

  const informationSource = watch('informationSource');

  const handleCancel = () => {
    setShowClientForm(false);
    reset();
    setSubmitError(null);
  };

  const onSubmit = async (data: ClientCreationFormData) => {
    if (!sessionId) {
      setSubmitError('Сесія не ініціалізована');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Крок 1: Оновлюємо дані клієнта в сесії
      const clientFormData: NewClientFormDTO = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email || undefined,
        address: data.address || undefined,
        communicationChannels: data.communicationChannels,
        informationSource: data.informationSource,
        sourceDetails: data.sourceDetails || undefined,
      };

      await updateClientData.mutateAsync({
        sessionId,
        data: clientFormData,
      });

      // Крок 2: Створюємо клієнта
      const response = await createClient.mutateAsync({
        sessionId,
      });

      // Успішне створення - закриваємо форму
      setShowClientForm(false);
      reset();

      // Примітка: selectedClientId буде встановлено автоматично через API workflow
    } catch (error: any) {
      console.error('Помилка створення клієнта:', error);
      setSubmitError(
        error?.response?.data?.message || error?.message || 'Невідома помилка при створенні клієнта'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Новий клієнт
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* Основна інформація */}
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Прізвище *"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                fullWidth
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ім'я *"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                fullWidth
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Телефон *"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                fullWidth
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Адреса"
                error={!!errors.address}
                helperText={errors.address?.message}
                fullWidth
                multiline
                rows={2}
                disabled={isSubmitting}
              />
            )}
          />

          {/* Способи зв'язку */}
          <FormControl component="fieldset">
            <FormLabel component="legend">Способи зв&apos;язку</FormLabel>
            <FormGroup>
              <Controller
                name="communicationChannels"
                control={control}
                render={({ field }) => (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value.includes('PHONE')}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, 'PHONE']
                              : field.value.filter((method) => method !== 'PHONE');
                            field.onChange(newValue);
                          }}
                          disabled={isSubmitting}
                        />
                      }
                      label="Телефонний дзвінок"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value.includes('SMS')}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, 'SMS']
                              : field.value.filter((method) => method !== 'SMS');
                            field.onChange(newValue);
                          }}
                          disabled={isSubmitting}
                        />
                      }
                      label="SMS"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value.includes('VIBER')}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, 'VIBER']
                              : field.value.filter((method) => method !== 'VIBER');
                            field.onChange(newValue);
                          }}
                          disabled={isSubmitting}
                        />
                      }
                      label="Viber"
                    />
                  </>
                )}
              />
            </FormGroup>
          </FormControl>

          {/* Джерело інформації */}
          <Controller
            name="informationSource"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <FormLabel>Джерело інформації про хімчистку</FormLabel>
                <Select {...field} disabled={isSubmitting}>
                  <MenuItem value="INSTAGRAM">Instagram</MenuItem>
                  <MenuItem value="GOOGLE">Google</MenuItem>
                  <MenuItem value="RECOMMENDATION">Рекомендації</MenuItem>
                  <MenuItem value="OTHER">Інше</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          {/* Деталі джерела інформації */}
          {informationSource === 'OTHER' && (
            <Controller
              name="sourceDetails"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Деталі джерела інформації"
                  fullWidth
                  disabled={isSubmitting}
                />
              )}
            />
          )}

          {/* Кнопки */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={!isValid || isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'Створення...' : 'Створити клієнта'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Скасувати
            </Button>
          </Stack>

          {/* Помилки */}
          {submitError && <Alert severity="error">{submitError}</Alert>}
        </Stack>
      </form>
    </Box>
  );
};
