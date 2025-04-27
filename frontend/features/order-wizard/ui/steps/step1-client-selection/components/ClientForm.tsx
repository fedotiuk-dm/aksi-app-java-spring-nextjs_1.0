'use client';

import React from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Grid,
  Button,
  Paper,
  Collapse,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Client } from '@/features/order-wizard/model/types';
import { useClientForm } from '@/features/order-wizard/hooks/useClientForm';

interface ClientFormProps {
  initialClient?: Partial<Client>;
  onSave: (client: Omit<Client, 'id'>) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  className?: string;
}

/**
 * Компонент форми для створення/редагування клієнта
 * Використовує хук useClientForm для логіки та валідації з Zod
 */
export const ClientForm: React.FC<ClientFormProps> = ({
  initialClient,
  onSave,
  onCancel,
  isEditing = false,
  className
}) => {
  // Використовуємо хук для управління формою
  const {
    client,
    errors,
    isSubmitting,
    showOtherDetails,
    handleChange,
    handleChannelChange,
    handleSourceChange,
    validateAndSubmit
  } = useClientForm(initialClient);

  // Створюємо обробник подання форми
  const handleSubmit = validateAndSubmit(onSave);

  return (
    <Paper className={className} sx={{ p: 3, position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <IconButton
          color="default"
          size="small"
          onClick={onCancel}
          aria-label="закрити форму"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography variant="h6" gutterBottom>
        {isEditing ? 'Редагування клієнта' : 'Створення нового клієнта'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Основна інформація */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" gutterBottom>
              Основна інформація
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              name="lastName"
              label="Прізвище"
              value={client.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              disabled={isSubmitting}
              margin="normal"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              name="firstName"
              label="Ім'я"
              value={client.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              disabled={isSubmitting}
              margin="normal"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              name="phone"
              label="Телефон"
              value={client.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone || 'Формат: +380XXXXXXXXX'}
              disabled={isSubmitting}
              margin="normal"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={client.email || ''}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isSubmitting}
              margin="normal"
            />
          </Grid>

          {/* Адреса */}
          <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Адреса
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="address.city"
              label="Місто"
              value={client.address?.city || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              margin="normal"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="address.street"
              label="Вулиця, будинок, квартира"
              value={client.address?.street || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              margin="normal"
            />
          </Grid>

          {/* Канали комунікації */}
          <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Способи зв&apos;язку</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={client.communicationChannels.includes('PHONE')}
                      onChange={handleChannelChange}
                      value="PHONE"
                      disabled={isSubmitting}
                    />
                  }
                  label="Телефон"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={client.communicationChannels.includes('SMS')}
                      onChange={handleChannelChange}
                      value="SMS"
                      disabled={isSubmitting}
                    />
                  }
                  label="SMS"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={client.communicationChannels.includes('VIBER')}
                      onChange={handleChannelChange}
                      value="VIBER"
                      disabled={isSubmitting}
                    />
                  }
                  label="Viber"
                />
              </FormGroup>
            </FormControl>
          </Grid>

          {/* Джерело інформації */}
          <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                Як дізналися про хімчистку
              </FormLabel>
              <RadioGroup
                value={client.source?.source || 'RECOMMENDATION'}
                onChange={handleSourceChange}
                name="source"
              >
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  <FormControlLabel
                    value="INSTAGRAM"
                    control={<Radio disabled={isSubmitting} />}
                    label="Instagram"
                  />
                  <FormControlLabel
                    value="GOOGLE"
                    control={<Radio disabled={isSubmitting} />}
                    label="Google"
                  />
                  <FormControlLabel
                    value="RECOMMENDATION"
                    control={<Radio disabled={isSubmitting} />}
                    label="Рекомендації"
                  />
                  <FormControlLabel
                    value="OTHER"
                    control={<Radio disabled={isSubmitting} />}
                    label="Інше"
                  />
                </Box>
              </RadioGroup>
            </FormControl>

            <Collapse in={showOtherDetails}>
              <Box sx={{ mt: 1, ml: 3 }}>
                <TextField
                  fullWidth
                  name="source.details"
                  label="Вкажіть деталі"
                  value={client.source?.details || ''}
                  onChange={handleChange}
                  error={!!errors['source.details']}
                  helperText={errors['source.details']}
                  disabled={isSubmitting}
                  margin="normal"
                  size="small"
                />
              </Box>
            </Collapse>
          </Grid>

          {/* Кнопки дій */}
          <Grid
            size={{ xs: 12 }}
            sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isSubmitting}
              sx={{ mr: 1 }}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isEditing ? 'Зберегти зміни' : 'Створити клієнта'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ClientForm;
