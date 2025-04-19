'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  SelectChangeEvent,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { clientsApi, ClientCreateRequest } from '../api/clientsApi';
import {
  ClientSource,
  ClientStatus,
  LoyaltyLevel,
} from '../types/client.types';

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  [key: string]: string | undefined;
}

export default function ClientForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ClientCreateRequest>({
    fullName: '',
    phone: '',
    additionalPhone: '',
    email: '',
    address: '',
    notes: '',
    source: ClientSource.OTHER,
    status: ClientStatus.ACTIVE,
    loyaltyLevel: LoyaltyLevel.STANDARD,
    tags: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      birthDate: date ? date.format('YYYY-MM-DD') : undefined,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate fullName
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Ім'я клієнта є обов'язковим";
    } else if (formData.fullName.length < 2 || formData.fullName.length > 100) {
      newErrors.fullName = "Ім'я повинно бути від 2 до 100 символів";
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон є обов'язковим";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Некоректний формат телефону';
    }

    // Validate email if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некоректний формат email';
    }

    // Validate additionalPhone if provided
    if (
      formData.additionalPhone &&
      !/^\+?[0-9]{10,15}$/.test(formData.additionalPhone)
    ) {
      newErrors.additionalPhone = 'Некоректний формат телефону';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setAlertInfo(null);

    try {
      const newClient = await clientsApi.createClient(formData);
      setAlertInfo({
        type: 'success',
        message: `Клієнта "${newClient.fullName}" успішно створено!`,
      });

      // Redirect to client list after a short delay
      setTimeout(() => {
        router.push('/clients');
      }, 1500);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      let errorMessage = 'Помилка при створенні клієнта';

      // Handle specific API errors
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setAlertInfo({
        type: 'error',
        message: errorMessage,
      });

      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {alertInfo && (
        <Alert
          severity={alertInfo.type}
          sx={{ mb: 3 }}
          onClose={() => setAlertInfo(null)}
        >
          {alertInfo.message}
        </Alert>
      )}

      <Typography variant="h5" component="h2" gutterBottom>
        Новий клієнт
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              label="Повне ім'я"
              name="fullName"
              value={formData.fullName}
              onChange={handleTextChange}
              fullWidth
              required
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Основний телефон"
              name="phone"
              value={formData.phone}
              onChange={handleTextChange}
              fullWidth
              required
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder="+380XXXXXXXXX"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Додатковий телефон"
              name="additionalPhone"
              value={formData.additionalPhone}
              onChange={handleTextChange}
              fullWidth
              error={!!errors.additionalPhone}
              helperText={errors.additionalPhone}
              placeholder="+380XXXXXXXXX"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleTextChange}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
              <DatePicker
                label="Дата народження"
                value={formData.birthDate ? dayjs(formData.birthDate) : null}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={12}>
            <TextField
              label="Адреса"
              name="address"
              value={formData.address}
              onChange={handleTextChange}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Джерело</InputLabel>
              <Select
                name="source"
                value={formData.source}
                onChange={handleSelectChange}
                label="Джерело"
              >
                {Object.values(ClientSource).map((source) => (
                  <MenuItem key={source} value={source}>
                    {source === ClientSource.REFERRAL
                      ? 'Рекомендація'
                      : source === ClientSource.ADVERTISEMENT
                      ? 'Реклама'
                      : source === ClientSource.SOCIAL_MEDIA
                      ? 'Соціальні мережі'
                      : source === ClientSource.GOOGLE
                      ? 'Веб-сайт/Гугл'
                      : 'Інше'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleSelectChange}
                label="Статус"
              >
                {Object.values(ClientStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status === ClientStatus.ACTIVE
                      ? 'Активний'
                      : status === ClientStatus.INACTIVE
                      ? 'Неактивний'
                      : 'Заблокований'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Рівень лояльності</InputLabel>
              <Select
                name="loyaltyLevel"
                value={formData.loyaltyLevel}
                onChange={handleSelectChange}
                label="Рівень лояльності"
              >
                {Object.values(LoyaltyLevel).map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={12}>
            <TextField
              label="Примітки"
              name="notes"
              value={formData.notes}
              onChange={handleTextChange}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>

          <Grid size={12}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
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
                {isSubmitting ? 'Створення...' : 'Створити клієнта'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
