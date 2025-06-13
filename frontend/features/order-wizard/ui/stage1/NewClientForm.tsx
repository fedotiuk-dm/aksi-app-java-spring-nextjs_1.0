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

import { useClientCreate } from '@/domains/wizard/stage1';

interface NewClientFormProps {
  onClientCreated?: (clientId: string) => void;
  onCancel?: () => void;
}

export const NewClientForm: FC<NewClientFormProps> = ({ onClientCreated, onCancel }) => {
  const clientCreate = useClientCreate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (clientCreate.computed.canSubmit) {
      try {
        // Спочатку оновлюємо дані клієнта
        await clientCreate.actions.updateClientData(clientCreate.form.getValues());

        // Потім створюємо клієнта
        await clientCreate.actions.createClient();

        // Завершуємо створення
        await clientCreate.actions.completeCreation();

        // Викликаємо callback з ID створеного клієнта (якщо доступний)
        onClientCreated?.('created-client-id'); // TODO: отримати реальний ID з API
      } catch (error) {
        console.error('Помилка створення клієнта:', error);
      }
    }
  };

  const handleCancel = () => {
    clientCreate.actions.cancelCreate();
    onCancel?.();
  };

  // Перевіряємо чи форма доступна
  if (!clientCreate.form) {
    return <Alert severity="error">Форма створення клієнта недоступна</Alert>;
  }

  const hasSession = !!clientCreate.ui.isCreateMode;

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
        {!hasSession && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Для створення клієнта потрібно ініціалізувати режим створення
          </Alert>
        )}

        {/* Помилки */}
        {clientCreate.computed.hasErrors && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Будь ласка, виправте помилки у формі
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
                {...clientCreate.form.register('lastName')}
                error={!!clientCreate.form.formState.errors.lastName}
                helperText={clientCreate.form.formState.errors.lastName?.message}
                disabled={clientCreate.loading.isCreating}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Ім'я *"
                {...clientCreate.form.register('firstName')}
                error={!!clientCreate.form.formState.errors.firstName}
                helperText={clientCreate.form.formState.errors.firstName?.message}
                disabled={clientCreate.loading.isCreating}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Телефон *"
                {...clientCreate.form.register('phone')}
                error={!!clientCreate.form.formState.errors.phone}
                helperText={clientCreate.form.formState.errors.phone?.message}
                placeholder="+380XXXXXXXXX"
                disabled={clientCreate.loading.isCreating}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...clientCreate.form.register('email')}
                error={!!clientCreate.form.formState.errors.email}
                helperText={clientCreate.form.formState.errors.email?.message}
                disabled={clientCreate.loading.isCreating}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Адреса"
                {...clientCreate.form.register('address')}
                error={!!clientCreate.form.formState.errors.address}
                helperText={clientCreate.form.formState.errors.address?.message}
                disabled={clientCreate.loading.isCreating}
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
                        {...clientCreate.form.register('communicationChannels')}
                        value="PHONE"
                        disabled={clientCreate.loading.isCreating}
                      />
                    }
                    label="Телефонний дзвінок"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...clientCreate.form.register('communicationChannels')}
                        value="SMS"
                        disabled={clientCreate.loading.isCreating}
                      />
                    }
                    label="SMS"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...clientCreate.form.register('communicationChannels')}
                        value="VIBER"
                        disabled={clientCreate.loading.isCreating}
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
                <RadioGroup {...clientCreate.form.register('informationSource')} row>
                  <FormControlLabel
                    value="INSTAGRAM"
                    control={<Radio disabled={clientCreate.loading.isCreating} />}
                    label="Instagram"
                  />
                  <FormControlLabel
                    value="GOOGLE"
                    control={<Radio disabled={clientCreate.loading.isCreating} />}
                    label="Google"
                  />
                  <FormControlLabel
                    value="RECOMMENDATION"
                    control={<Radio disabled={clientCreate.loading.isCreating} />}
                    label="Рекомендації"
                  />
                  <FormControlLabel
                    value="OTHER"
                    control={<Radio disabled={clientCreate.loading.isCreating} />}
                    label="Інше"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Додаткове поле для "Інше" */}
            {clientCreate.computed.needsInfoSourceOther && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Уточніть джерело інформації"
                  {...clientCreate.form.register('sourceDetails')}
                  error={!!clientCreate.form.formState.errors.sourceDetails}
                  helperText={clientCreate.form.formState.errors.sourceDetails?.message}
                  disabled={clientCreate.loading.isCreating}
                />
              </Grid>
            )}

            {/* Кнопки */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={clientCreate.loading.isCreating}
                  startIcon={<CancelIcon />}
                >
                  Скасувати
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!clientCreate.computed.canSubmit || clientCreate.loading.isCreating}
                  startIcon={
                    clientCreate.loading.isCreating ? <CircularProgress size={20} /> : <SaveIcon />
                  }
                >
                  {clientCreate.loading.isCreating ? 'Створення...' : 'Створити клієнта'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Успішне створення */}
        {clientCreate.data.creationState && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Клієнт успішно створений
          </Alert>
        )}

        {/* Debug інформація */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" component="div">
              Debug: Mode: {clientCreate.ui.isCreateMode ? 'create' : 'none'}, Valid:{' '}
              {clientCreate.computed.isFormValid ? 'true' : 'false'}, CanSubmit:{' '}
              {clientCreate.computed.canSubmit ? 'true' : 'false'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
