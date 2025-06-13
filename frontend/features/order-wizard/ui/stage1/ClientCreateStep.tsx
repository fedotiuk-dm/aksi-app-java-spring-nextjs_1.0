'use client';

import { FC, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

import { useClientCreate } from '@/domains/wizard/stage1';

interface ClientCreateStepProps {
  onClientCreated?: () => void;
  onCancel?: () => void;
}

const FORM_STEPS = [
  { label: 'Основна інформація', key: 'basic' },
  { label: 'Контактні дані', key: 'communication' },
  { label: 'Джерело інформації', key: 'source' },
];

const COMMUNICATION_CHANNELS_FIELD = 'communicationChannels';
const ACTION_ACTIVE_COLOR = 'action.active';

export const ClientCreateStep: FC<ClientCreateStepProps> = ({ onClientCreated, onCancel }) => {
  const { data, loading, actions, form, computed, constants } = useClientCreate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleSubmit = () => {
    actions.createClient();
    onClientCreated?.();
  };

  const handleCancel = () => {
    actions.cancelCreate();
    onCancel?.();
  };

  const currentStepIndex = currentStep;
  const isFormValid = computed.isFormValid;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          variant="outlined"
          sx={{ mr: 2 }}
        >
          Назад
        </Button>
        <Typography variant="h5" component="h2">
          Створення нового клієнта
        </Typography>
      </Box>

      {/* Покроковий індикатор */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={currentStepIndex} alternativeLabel>
            {FORM_STEPS.map((step, index) => (
              <Step key={step.key} completed={index < currentStepIndex}>
                <StepLabel onClick={() => handleStepChange(index)} sx={{ cursor: 'pointer' }}>
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Помилка завантаження */}
      {loading.isLoadingCreationState && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Завантаження...
        </Alert>
      )}

      {/* Крок 1: Основна інформація */}
      {currentStepIndex === 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <PersonIcon />
              Основна інформація
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  {...form.register('firstName')}
                  fullWidth
                  label="Ім'я *"
                  error={!!form.formState.errors.firstName}
                  helperText={form.formState.errors.firstName?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  {...form.register('lastName')}
                  fullWidth
                  label="Прізвище *"
                  error={!!form.formState.errors.lastName}
                  helperText={form.formState.errors.lastName?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  {...form.register('phone')}
                  fullWidth
                  label="Телефон *"
                  placeholder="+380xxxxxxxxx"
                  error={!!form.formState.errors.phone}
                  helperText={form.formState.errors.phone?.message}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: ACTION_ACTIVE_COLOR }} />,
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  {...form.register('email')}
                  fullWidth
                  label="Email"
                  type="email"
                  error={!!form.formState.errors.email}
                  helperText={form.formState.errors.email?.message}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: ACTION_ACTIVE_COLOR }} />,
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  {...form.register('address')}
                  fullWidth
                  label="Адреса"
                  multiline
                  rows={2}
                  error={!!form.formState.errors.address}
                  helperText={form.formState.errors.address?.message}
                  InputProps={{
                    startAdornment: (
                      <LocationIcon
                        sx={{ mr: 1, color: ACTION_ACTIVE_COLOR, alignSelf: 'flex-start', mt: 1 }}
                      />
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Крок 2: Контактні дані */}
      {currentStepIndex === 1 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Способи зв&apos;язку
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Оберіть зручні способи зв&apos;язку з клієнтом
            </Typography>

            <FormControl component="fieldset">
              <FormLabel component="legend">Способи зв&apos;язку (можна обрати декілька)</FormLabel>
              <FormGroup>
                {Object.entries(constants.contactMethods).map(([key, value]) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        {...form.register(COMMUNICATION_CHANNELS_FIELD)}
                        value={value}
                        checked={computed.selectedContactMethods.includes(value)}
                      />
                    }
                    label={constants.contactMethodNames[value] || value}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </CardContent>
        </Card>
      )}

      {/* Крок 3: Джерело інформації */}
      {currentStepIndex === 2 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Джерело інформації про хімчистню
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Як клієнт дізнався про наші послуги?
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                {...form.register('informationSource')}
                value={form.watch('informationSource')}
              >
                {Object.entries(constants.infoSources).map(([key, value]) => (
                  <FormControlLabel
                    key={key}
                    value={value}
                    control={<Radio />}
                    label={constants.infoSourceNames[value] || value}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {/* Поле для "Інше" */}
            {computed.needsInfoSourceOther && (
              <TextField
                {...form.register('sourceDetails')}
                fullWidth
                label="Уточніть джерело"
                placeholder="Вкажіть, як саме клієнт дізнався про нас..."
                sx={{ mt: 2 }}
                error={!!form.formState.errors.sourceDetails}
                helperText={form.formState.errors.sourceDetails?.message}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Попередній перегляд */}
      {currentStepIndex >= FORM_STEPS.length && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Перевірте дані клієнта
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Ім&apos;я та прізвище:
                </Typography>
                <Typography variant="body1">
                  {form.watch('firstName')} {form.watch('lastName')}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Телефон:
                </Typography>
                <Typography variant="body1">{form.watch('phone')}</Typography>
              </Grid>

              {form.watch('email') && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email:
                  </Typography>
                  <Typography variant="body1">{form.watch('email')}</Typography>
                </Grid>
              )}

              {form.watch('address') && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Адреса:
                  </Typography>
                  <Typography variant="body1">{form.watch('address')}</Typography>
                </Grid>
              )}

              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary">
                  Способи зв&apos;язку:
                </Typography>
                <Typography variant="body1">
                  {computed.selectedContactMethods
                    .map((method) => constants.contactMethodNames[method] || method)
                    .join(', ') || 'Не вказано'}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary">
                  Джерело інформації:
                </Typography>
                <Typography variant="body1">
                  {(() => {
                    const infoSource = form.watch('informationSource');
                    return (
                      (infoSource &&
                        constants.infoSourceNames[
                          infoSource as keyof typeof constants.infoSourceNames
                        ]) ||
                      infoSource ||
                      'Не вказано'
                    );
                  })()}
                  {form.watch('sourceDetails') && ` (${form.watch('sourceDetails')})`}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Навігація */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Назад
        </Button>

        <Typography variant="body2" color="text.secondary">
          Крок {currentStep + 1} з {FORM_STEPS.length}
        </Typography>

        {currentStep < FORM_STEPS.length - 1 ? (
          <Button variant="contained" onClick={() => setCurrentStep(currentStep + 1)}>
            Далі
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={!isFormValid || loading.isUpdatingData || loading.isCreating}
          >
            {loading.isUpdatingData || loading.isCreating ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Створення...
              </>
            ) : (
              'Створити клієнта'
            )}
          </Button>
        )}
      </Box>

      {/* Стан створення */}
      {data.creationState && (
        <Paper sx={{ p: 2, mt: 3, bgcolor: 'info.50' }}>
          <Typography variant="body2" color="info.main">
            Стан створення: {JSON.stringify(data.creationState, null, 2)}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
