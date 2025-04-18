'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ClientSource, ClientStatus, LoyaltyLevel } from '../types';
import { useCreateClient } from '../hooks/useCreateClient';
import { useUpdateClient } from '../hooks/useUpdateClient';
import { ClientCreateRequest, ClientUpdateRequest } from '../api/clientsApi';
import { authTokens } from '@/features/auth/api/authApi';
import axios from '@/lib/axios';

// Схема валідації для форми
const clientFormSchema = z.object({
  fullName: z
    .string()
    .min(3, "Ім'я має містити не менше 3 символів")
    .max(100, "Ім'я не може перевищувати 100 символів"),
  phone: z
    .string()
    .regex(
      /^\+?[0-9]{10,15}$/,
      'Введіть правильний формат телефону (10-15 цифр)'
    ),
  additionalPhone: z
    .string()
    .regex(
      /^\+?[0-9]{10,15}$/,
      'Введіть правильний формат телефону (10-15 цифр)'
    )
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Введіть правильний формат email')
    .or(z.literal(''))
    .optional(),
  address: z
    .string()
    .max(200, 'Адреса не може перевищувати 200 символів')
    .optional(),
  notes: z
    .string()
    .max(1000, 'Примітки не можуть перевищувати 1000 символів')
    .optional(),
  status: z.nativeEnum(ClientStatus),
  loyaltyLevel: z.nativeEnum(LoyaltyLevel),
  source: z.nativeEnum(ClientSource).optional(),
  birthDate: z.any().optional(),
  tags: z.array(z.string()).optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  initialData?: Partial<ClientFormValues> & { id?: string };
  isEdit?: boolean;
}

export default function ClientForm({
  initialData,
  isEdit = false,
}: ClientFormProps) {
  const router = useRouter();
  const [tagInput, setTagInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<boolean>(false);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const isSubmitting = createClient.isPending || updateClient.isPending;

  // Перевірка автентифікації при завантаженні компонента
  useEffect(() => {
    const token = authTokens.getToken();
    if (!token) {
      setAuthError(true);
      const timer = setTimeout(() => {
        router.push('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      phone: initialData?.phone || '',
      additionalPhone: initialData?.additionalPhone || '',
      email: initialData?.email || '',
      address: initialData?.address || '',
      notes: initialData?.notes || '',
      status: initialData?.status || ClientStatus.ACTIVE,
      loyaltyLevel: initialData?.loyaltyLevel || LoyaltyLevel.STANDARD,
      source: initialData?.source || undefined,
      birthDate: initialData?.birthDate
        ? dayjs(initialData.birthDate)
        : undefined,
      tags: initialData?.tags || [],
    },
  });

  const tags = watch('tags') || [];

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setValue('tags', [...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const onSubmit = async (data: ClientFormValues) => {
    console.log('Submitting form with data:', data);
    setFormError(null);

    // Перевірка автентифікації перед відправкою
    const token = authTokens.getToken();
    if (!token) {
      setAuthError(true);
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    // Додавання токена до заголовка запиту
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const formattedData: ClientCreateRequest = {
      fullName: data.fullName,
      phone: data.phone,
      additionalPhone: data.additionalPhone,
      email: data.email,
      address: data.address,
      notes: data.notes,
      status: data.status,
      loyaltyLevel: data.loyaltyLevel,
      source: data.source,
      birthDate: data.birthDate
        ? dayjs(data.birthDate).format('YYYY-MM-DD')
        : undefined,
      tags: data.tags,
    };

    try {
      if (isEdit && initialData?.id) {
        console.log('Updating client with ID:', initialData.id);
        const updateData: ClientUpdateRequest = formattedData;
        await updateClient.mutateAsync({
          id: initialData.id,
          data: updateData,
        });
      } else {
        console.log('Creating new client');
        await createClient.mutateAsync(formattedData);
      }

      console.log('Operation successful, redirecting to clients list');
      router.push('/clients');
    } catch (error) {
      console.error('Помилка при збереженні клієнта:', error);

      // Перевірка помилки авторизації
      if (
        error instanceof Error &&
        (error.message.includes('403') || error.message.includes('401'))
      ) {
        setAuthError(true);
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      setFormError(
        error instanceof Error
          ? error.message
          : 'Виникла помилка при збереженні клієнта'
      );
    }
  };

  // Якщо не авторизований, показуємо повідомлення і перенаправляємо
  if (authError) {
    return (
      <Container>
        <Alert
          severity="error"
          sx={{ mt: 4 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => router.push('/login')}
            >
              Увійти
            </Button>
          }
        >
          Для створення клієнта необхідно авторизуватися. Перенаправлення на
          сторінку входу...
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {isEdit ? 'Редагування клієнта' : 'Створення нового клієнта'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {isEdit
              ? 'Оновлення інформації про існуючого клієнта'
              : 'Введіть інформацію для створення нового клієнта'}
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {formError}
            </Alert>
          )}

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Основна інформація
              </Typography>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Повне ім'я клієнта"
                    {...register('fullName')}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                    required
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Телефон"
                    {...register('phone')}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    required
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Додатковий телефон"
                    {...register('additionalPhone')}
                    error={!!errors.additionalPhone}
                    helperText={errors.additionalPhone?.message}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Адреса"
                    {...register('address')}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Grid>
                <Grid size={6}>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="uk"
                  >
                    <Controller
                      name="birthDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Дата народження"
                          value={field.value}
                          onChange={field.onChange}
                          sx={{ width: '100%' }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Джерело</InputLabel>
                    <Controller
                      name="source"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} label="Джерело">
                          <MenuItem value={ClientSource.REFERRAL}>
                            За рекомендацією
                          </MenuItem>
                          <MenuItem value={ClientSource.SOCIAL_MEDIA}>
                            Соціальні мережі
                          </MenuItem>
                          <MenuItem value={ClientSource.GOOGLE}>
                            Google
                          </MenuItem>
                          <MenuItem value={ClientSource.ADVERTISEMENT}>
                            Реклама
                          </MenuItem>
                          <MenuItem value={ClientSource.RETURNING}>
                            Повторний клієнт
                          </MenuItem>
                          <MenuItem value={ClientSource.WALK_IN}>
                            Випадковий прохід
                          </MenuItem>
                          <MenuItem value={ClientSource.OTHER}>Інше</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Статус та лояльність
              </Typography>
              <Grid container spacing={3}>
                <Grid size={6}>
                  <FormControl component="fieldset">
                    <Typography variant="subtitle2" gutterBottom>
                      Статус клієнта
                    </Typography>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup row {...field}>
                          <FormControlLabel
                            value={ClientStatus.ACTIVE}
                            control={<Radio />}
                            label="Активний"
                          />
                          <FormControlLabel
                            value={ClientStatus.INACTIVE}
                            control={<Radio />}
                            label="Неактивний"
                          />
                          <FormControlLabel
                            value={ClientStatus.BLOCKED}
                            control={<Radio />}
                            label="Заблокований"
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Рівень лояльності</InputLabel>
                    <Controller
                      name="loyaltyLevel"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} label="Рівень лояльності">
                          <MenuItem value={LoyaltyLevel.STANDARD}>
                            Стандарт
                          </MenuItem>
                          <MenuItem value={LoyaltyLevel.SILVER}>
                            Срібний
                          </MenuItem>
                          <MenuItem value={LoyaltyLevel.GOLD}>Золотий</MenuItem>
                          <MenuItem value={LoyaltyLevel.PLATINUM}>
                            Платиновий
                          </MenuItem>
                          <MenuItem value={LoyaltyLevel.VIP}>VIP</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Додаткова інформація
              </Typography>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Примітки"
                    multiline
                    rows={4}
                    {...register('notes')}
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                  />
                </Grid>
                <Grid size={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Теги
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Box
                    sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}
                  >
                    <TextField
                      label="Додати тег"
                      size="small"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddTag}
                      sx={{ mt: 0 }}
                    >
                      Додати
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => router.push('/clients')}
              disabled={isSubmitting}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting
                ? 'Збереження...'
                : isEdit
                ? 'Оновити клієнта'
                : 'Створити клієнта'}
            </Button>
          </Box>
        </Box>
      </form>
    </Container>
  );
}
