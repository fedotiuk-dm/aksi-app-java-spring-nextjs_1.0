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
  SelectChangeEvent,
  Paper,
  Chip,
  Stack,
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
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  [key: string]: string | undefined;
}

export default function ClientForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ClientCreateRequest>({
    firstName: '',
    lastName: '',
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

  const [newTag, setNewTag] = useState('');

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

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...(formData.tags ?? []), newTag]
      });
      setNewTag('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags ?? []).filter(tag => tag !== tagToDelete)
    });
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      birthDate: date ? date.format('YYYY-MM-DD') : undefined,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate lastName
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Прізвище клієнта є обов'язковим";
    } else if (formData.lastName.length < 2 || formData.lastName.length > 100) {
      newErrors.lastName = "Прізвище повинно бути від 2 до 100 символів";
    }
    
    // Validate firstName
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Ім'я клієнта є обов'язковим";
    } else if (formData.firstName.length < 2 || formData.firstName.length > 100) {
      newErrors.firstName = "Ім'я повинно бути від 2 до 100 символів";
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
        message: `Клієнта "${newClient.firstName} ${newClient.lastName}" успішно створено!`,
      });

      // Redirect to client detail page after a short delay
      setTimeout(() => {
        router.push(`/clients/${newClient.id}`);
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
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Прізвище"
              name="lastName"
              value={formData.lastName}
              onChange={handleTextChange}
              fullWidth
              required
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Ім'я"
              name="firstName"
              value={formData.firstName}
              onChange={handleTextChange}
              fullWidth
              required
              error={!!errors.firstName}
              helperText={errors.firstName}
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

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" gutterBottom>
              Теги
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {(formData.tags ?? []).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Stack>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Додати тег"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  sx={{ mr: 1 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleAddTag}
                  disabled={!newTag}
                >
                  Додати
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
              sx={{ py: 1.5 }}
            >
              {isSubmitting ? 'Збереження...' : 'Створити клієнта'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
