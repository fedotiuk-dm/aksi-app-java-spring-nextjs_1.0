import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Alert,
  CircularProgress
} from '@mui/material';
import { useCreateClient, useUpdateClient } from '../api/clients';
import { ClientCreateRequest, ClientResponse, ClientUpdateRequest } from '@/lib/api';
import { ClientFormState } from '../model/types';

interface ClientFormProps {
  client?: ClientResponse | null;
  onSave: (client: ClientResponse) => void;
  onCancel: () => void;
}

export default function ClientForm({ client, onSave, onCancel }: ClientFormProps) {
  const initialFormState: ClientFormState = {
    isNew: !client,
    isSubmitting: false,
    errors: {},
  };

  const [formState, setFormState] = useState<ClientFormState>(initialFormState);
  const [formData, setFormData] = useState<Partial<ClientCreateRequest>>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    communicationChannels: ['PHONE'],
    source: ClientCreateRequest.source.OTHER,
    sourceDetails: '',
  });
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const { mutate: createClient } = useCreateClient();
  const { mutate: updateClient } = useUpdateClient();
  const isSubmitting = formState.isSubmitting;

  // Заповнюємо форму даними клієнта, якщо він вже існує
  useEffect(() => {
    if (client) {
      // ClientResponse не містить communicationChannels, тому використовуємо значення за замовчуванням
      setFormData({
        firstName: client.firstName || '',
        lastName: client.lastName || '',
        phone: client.phone || '',
        email: client.email || '',
        address: client.address || '',
        // За замовчуванням встановлюємо PHONE як канал зв'язку для існуючих клієнтів
        communicationChannels: ['PHONE'],
        source: client.source || ClientCreateRequest.source.OTHER,
        sourceDetails: client.sourceDetails || '',
      });
    }
  }, [client]);

  // Обробник змін для текстових полів
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Видаляємо помилку поля при редагуванні
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: ''
        }
      }));
    }
  };

  // Обробник змін був видалений, оскільки не використовується

  // Обробник змін для checkbox
  const handleChannelChange = (channel: 'PHONE' | 'SMS' | 'VIBER') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setFormData(prev => {
      const updatedChannels = prev.communicationChannels || [];
      
      if (checked) {
        // Додаємо канал, якщо його немає
        if (!updatedChannels.includes(channel)) {
          return { ...prev, communicationChannels: [...updatedChannels, channel] };
        }
      } else {
        // Видаляємо канал
        return { ...prev, communicationChannels: updatedChannels.filter(ch => ch !== channel) };
      }
      
      return prev;
    });
  };

  // Валідація форми
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.lastName) {
      errors.lastName = 'Прізвище обов\'язкове';
    }
    
    if (!formData.firstName) {
      errors.firstName = 'Ім\'я обов\'язкове';
    }
    
    if (!formData.phone) {
      errors.phone = 'Телефон обов\'язковий';
    } else if (!/^\+?[0-9]{10,12}$/.test(formData.phone)) {
      errors.phone = 'Введіть коректний номер телефону';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Введіть коректний email';
    }
    
    if (formData.source === ClientCreateRequest.source.OTHER && !formData.sourceDetails) {
      errors.sourceDetails = 'Вкажіть джерело інформації';
    }

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  // Обробник форми
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    if (formState.isNew) {
      // Створення нового клієнта
      createClient(formData as ClientCreateRequest, {
        onSuccess: (newClient) => {
          setFormState(prev => ({ ...prev, isSubmitting: false }));
          setApiErrorMessage(null);
          onSave(newClient);
        },
        onError: (error) => {
          setFormState(prev => ({ ...prev, isSubmitting: false }));
          // Обробка специфічних помилок
          if (error.message?.includes('409') || error.message?.includes('Conflict')) {
            setApiErrorMessage('Клієнт з таким телефоном вже існує');
          } else if (error.message?.includes('400')) {
            setApiErrorMessage('Некоректні дані клієнта. Перевірте формат полів.');
          } else {
            setApiErrorMessage('Помилка при створенні клієнта. Спробуйте ще раз.');
          }
        }
      });
    } else if (client && client.id) {
      // Оновлення існуючого клієнта
      updateClient(
        { 
          id: client.id, 
          client: formData as ClientUpdateRequest 
        }, 
        {
          onSuccess: (updatedClient) => {
            setFormState(prev => ({ ...prev, isSubmitting: false }));
            setApiErrorMessage(null);
            onSave(updatedClient);
          },
          onError: (error) => {
            setFormState(prev => ({ ...prev, isSubmitting: false }));
            // Обробка специфічних помилок
            if (error.message?.includes('404')) {
              setApiErrorMessage('Клієнт не знайдений. Можливо, він був видалений.');
            } else if (error.message?.includes('400')) {
              setApiErrorMessage('Некоректні дані клієнта. Перевірте формат полів.');
            } else {
              setApiErrorMessage('Помилка при оновленні клієнта. Спробуйте ще раз.');
            }
          }
        }
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {formState.isNew ? 'Створення нового клієнта' : 'Редагування даних клієнта'}
      </Typography>
      
      <Grid container spacing={2}>
        {/* Прізвище */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Прізвище"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={!!formState.errors.lastName}
            helperText={formState.errors.lastName}
            disabled={isSubmitting}
            margin="normal"
          />
        </Grid>
        
        {/* Ім'я */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Ім'я"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={!!formState.errors.firstName}
            helperText={formState.errors.firstName}
            disabled={isSubmitting}
            margin="normal"
          />
        </Grid>
        
        {/* Телефон */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Телефон"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!formState.errors.phone}
            helperText={formState.errors.phone || 'Наприклад: +380501234567'}
            disabled={isSubmitting}
            margin="normal"
          />
        </Grid>
        
        {/* Email */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!formState.errors.email}
            helperText={formState.errors.email}
            disabled={isSubmitting}
            margin="normal"
          />
        </Grid>
        
        {/* Адреса */}
        <Grid size={12}>
          <TextField
            fullWidth
            label="Адреса"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={isSubmitting}
            margin="normal"
          />
        </Grid>
        
        {/* Канали комунікації */}
        <Grid size={12}>
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Способи зв&apos;язку</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.communicationChannels?.includes('PHONE')}
                    onChange={handleChannelChange('PHONE')}
                    disabled={isSubmitting}
                  />
                }
                label="Номер телефону"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.communicationChannels?.includes('SMS')}
                    onChange={handleChannelChange('SMS')}
                    disabled={isSubmitting}
                  />
                }
                label="SMS"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.communicationChannels?.includes('VIBER')}
                    onChange={handleChannelChange('VIBER')}
                    disabled={isSubmitting}
                  />
                }
                label="Viber"
              />
            </FormGroup>
          </FormControl>
        </Grid>
        
        {/* Джерело інформації */}
        <Grid size={12}>
          <FormControl fullWidth margin="normal">
            <FormLabel id="source-label">Джерело інформації про хімчистку</FormLabel>
            <RadioGroup
              aria-labelledby="source-label"
              name="source"
              value={formData.source}
              onChange={handleChange}
            >
              <FormControlLabel 
                value={ClientCreateRequest.source.INSTAGRAM} 
                control={<Radio disabled={formState.isSubmitting} />} 
                label="Інстаграм" 
              />
              <FormControlLabel 
                value={ClientCreateRequest.source.GOOGLE} 
                control={<Radio disabled={formState.isSubmitting} />} 
                label="Google" 
              />
              <FormControlLabel 
                value={ClientCreateRequest.source.REFERRAL} 
                control={<Radio disabled={formState.isSubmitting} />} 
                label="Рекомендації" 
              />
              <FormControlLabel 
                value={ClientCreateRequest.source.OTHER} 
                control={<Radio disabled={formState.isSubmitting} />} 
                label="Інше" 
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        
        {/* Деталі джерела інформації */}
        {formData.source === ClientCreateRequest.source.OTHER && (
          <Grid size={12}>
            <TextField
              fullWidth
              label="Вкажіть джерело інформації"
              name="sourceDetails"
              value={formData.sourceDetails}
              onChange={handleChange}
              error={!!formState.errors.sourceDetails}
              helperText={formState.errors.sourceDetails}
              disabled={isSubmitting}
              margin="normal"
            />
          </Grid>
        )}
        
        {/* Повідомлення про помилки */}
        {apiErrorMessage && (
          <Grid size={12}>
            <Alert severity="error" sx={{ mt: 2 }}>
              {apiErrorMessage}
            </Alert>
          </Grid>
        )}
        
        {/* Кнопки */}
        <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Скасувати
          </Button>
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined}
          >
            {formState.isNew ? 'Створити' : 'Зберегти зміни'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
