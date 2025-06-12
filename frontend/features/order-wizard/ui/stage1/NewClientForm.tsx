'use client';

import {
  PersonAdd as PersonAddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Alert,
  CircularProgress,
} from '@mui/material';
import { FC } from 'react';

import { useClientCreation } from '@/domains/wizard/stage1/client-creation';

interface NewClientFormProps {
  onClientCreated?: (clientId: string) => void;
  onCancel?: () => void;
}

export const NewClientForm: FC<NewClientFormProps> = ({ onClientCreated, onCancel }) => {
  const { ui, data, loading, actions, forms } = useClientCreation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (forms.creation && forms.creation.formState.isValid) {
      try {
        const result = await actions.createClient();

        if (result && typeof result === 'object' && 'id' in result) {
          onClientCreated?.(result.id as string);
        }
      } catch (error) {
        console.error('Помилка створення клієнта:', error);
      }
    }
  };

  const handleCancel = () => {
    if (forms.creation) {
      forms.creation.reset();
    }
    onCancel?.();
  };

  // Перевіряємо чи форма доступна
  if (!forms.creation) {
    return <Alert severity="error">Форма створення клієнта недоступна</Alert>;
  }

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <PersonAddIcon />
          Створення нового клієнта
        </Typography>

        {/* Стан сесії */}
        {!ui.sessionId && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Для створення клієнта потрібно ініціалізувати Order Wizard
          </Alert>
        )}

        {/* Помилки */}
        {loading.isCreating === false && !data.createdClient && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Помилка створення клієнта
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
                label="Прізвище *"
                {...forms.creation.register('lastName')}
                error={!!forms.creation.formState.errors.lastName}
                helperText={forms.creation.formState.errors.lastName?.message}
                disabled={loading.isCreating}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Ім'я *"
                {...forms.creation.register('firstName')}
                error={!!forms.creation.formState.errors.firstName}
                helperText={forms.creation.formState.errors.firstName?.message}
                disabled={loading.isCreating}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Телефон *"
                {...forms.creation.register('phone')}
                error={!!forms.creation.formState.errors.phone}
                helperText={forms.creation.formState.errors.phone?.message}
                placeholder="+380XXXXXXXXX"
                disabled={loading.isCreating}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...forms.creation.register('email')}
                error={!!forms.creation.formState.errors.email}
                helperText={forms.creation.formState.errors.email?.message}
                disabled={loading.isCreating}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Адреса"
                {...forms.creation.register('address')}
                error={!!forms.creation.formState.errors.address}
                helperText={forms.creation.formState.errors.address?.message}
                disabled={loading.isCreating}
              />
            </Grid>

            {/* Способи зв'язку */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Способи зв&apos;язку
              </Typography>
              <FormControl component="fieldset">
                <FormLabel component="legend">Оберіть зручні способи зв&apos;язку</FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...forms.creation.register('communicationChannels')}
                        value="PHONE"
                        disabled={loading.isCreating}
                      />
                    }
                    label="Телефонний дзвінок"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...forms.creation.register('communicationChannels')}
                        value="SMS"
                        disabled={loading.isCreating}
                      />
                    }
                    label="SMS"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...forms.creation.register('communicationChannels')}
                        value="VIBER"
                        disabled={loading.isCreating}
                      />
                    }
                    label="Viber"
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            {/* Джерело інформації */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Джерело інформації про хімчистку
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup {...forms.creation.register('informationSource')} row>
                  <FormControlLabel
                    value="INSTAGRAM"
                    control={<Radio disabled={loading.isCreating} />}
                    label="Instagram"
                  />
                  <FormControlLabel
                    value="GOOGLE"
                    control={<Radio disabled={loading.isCreating} />}
                    label="Google"
                  />
                  <FormControlLabel
                    value="RECOMMENDATION"
                    control={<Radio disabled={loading.isCreating} />}
                    label="Рекомендації"
                  />
                  <FormControlLabel
                    value="OTHER"
                    control={<Radio disabled={loading.isCreating} />}
                    label="Інше"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Додаткове поле для "Інше" */}
            {forms.creation.watch('informationSource') === 'OTHER' && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Уточніть джерело інформації"
                  {...forms.creation.register('sourceDetails')}
                  error={!!forms.creation.formState.errors.sourceDetails}
                  helperText={forms.creation.formState.errors.sourceDetails?.message}
                  disabled={loading.isCreating}
                />
              </Grid>
            )}

            {/* Кнопки */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading.isCreating}
                  startIcon={<CancelIcon />}
                >
                  Скасувати
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading.isCreating || !ui.sessionId}
                  startIcon={loading.isCreating ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {loading.isCreating ? 'Створення...' : 'Створити клієнта'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Успішне створення */}
        {data.createdClient && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Клієнт успішно створений: {data.createdClient.firstName} {data.createdClient.lastName}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
