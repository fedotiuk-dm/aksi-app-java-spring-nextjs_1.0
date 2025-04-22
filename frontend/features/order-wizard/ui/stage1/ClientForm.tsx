import React from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Checkbox, 
  FormControlLabel, 
  FormGroup, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  Radio, 
  Grid, 
  Alert,
  CircularProgress 
} from '@mui/material';
import { ClientFormValues } from '../../model/types';
import { COMMUNICATION_CHANNELS_OPTIONS, CLIENT_SOURCE_OPTIONS } from '../../model/constants';

interface ClientFormProps {
  values: ClientFormValues;
  isCreating: boolean;
  error?: unknown;
  onChange: (values: Partial<ClientFormValues>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  values,
  isCreating,
  error,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleCommunicationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const currentChannels = [...values.communicationChannels];
    const channelValue = value as 'PHONE' | 'SMS' | 'VIBER';
    
    if (checked) {
      if (!currentChannels.includes(channelValue)) {
        onChange({ communicationChannels: [...currentChannels, channelValue] });
      }
    } else {
      onChange({ 
        communicationChannels: currentChannels.filter(channel => channel !== channelValue) 
      });
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ source: e.target.value as ClientFormValues['source'] });
  };

  const isFormValid = () => {
    return values.firstName.trim() !== '' && 
           values.lastName.trim() !== '' && 
           values.phone.trim() !== '' &&
           values.communicationChannels.length > 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" mb={2}>
        Створення нового клієнта
      </Typography>

      {!!error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Помилка створення клієнта. Перевірте введені дані та спробуйте знову.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>Основна інформація</Typography>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="lastName"
            label="Прізвище"
            required
            fullWidth
            value={values.lastName}
            onChange={handleChange}
            margin="normal"
            error={values.lastName.trim() === ''}
            helperText={values.lastName.trim() === '' ? 'Прізвище обов\'язкове' : ''}
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="firstName"
            label="Ім&apos;я"
            required
            fullWidth
            value={values.firstName}
            onChange={handleChange}
            margin="normal"
            error={values.firstName.trim() === ''}
            helperText={values.firstName.trim() === '' ? 'Ім&apos;я обов&apos;язкове' : ''}
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="phone"
            label="Телефон"
            required
            fullWidth
            value={values.phone}
            onChange={handleChange}
            margin="normal"
            placeholder="+380XXXXXXXXX"
            error={values.phone.trim() === ''}
            helperText={values.phone.trim() === '' ? 'Телефон обов\'язковий' : ''}
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="email"
            label="Email"
            fullWidth
            value={values.email}
            onChange={handleChange}
            margin="normal"
            type="email"
          />
        </Grid>
        
        <Grid size={12}>
          <TextField
            name="address"
            label="Адреса"
            fullWidth
            value={values.address}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>
        
        <Grid size={12}>
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Способи зв&apos;язку</FormLabel>
            <FormGroup row>
              {COMMUNICATION_CHANNELS_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={values.communicationChannels.includes(option.value as 'PHONE' | 'SMS' | 'VIBER')}
                      onChange={handleCommunicationChange}
                      value={option.value}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>
        
        <Grid size={12}>
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Джерело інформації про хімчистку</FormLabel>
            <RadioGroup
              value={values.source}
              onChange={handleSourceChange}
            >
              {CLIENT_SOURCE_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
        
        {values.source === 'OTHER' && (
          <Grid size={12}>
            <TextField
              name="otherSourceDetails"
              label="Вкажіть інше джерело"
              fullWidth
              value={values.otherSourceDetails}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
        )}
      </Grid>

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isCreating}
        >
          Назад до пошуку
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isFormValid() || isCreating}
          startIcon={isCreating ? <CircularProgress size={20} /> : null}
        >
          {isCreating ? 'Створення...' : 'Створити клієнта'}
        </Button>
      </Box>
    </Box>
  );
};
