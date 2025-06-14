'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  CircularProgress,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

// Готові Orval хуки та типи
import {
  useStage1GetClientFormData,
  useStage1UpdateClientData,
  useStage1CreateClient,
  useStage1CompleteClientCreation,
  type NewClientFormDTO,
  NewClientFormDTOCommunicationChannelsItem,
  NewClientFormDTOInformationSource,
} from '@/shared/api/generated/stage1';

interface ClientFormStepProps {
  sessionId: string;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Крок 2: Форма клієнта (новий або редагування існуючого)
 * Використовує готові Orval хуки БЕЗ дублювання логіки
 */
export const ClientFormStep = ({ sessionId, onNext, onBack }: ClientFormStepProps) => {
  // Стан форми відповідно до NewClientFormDTO
  const [formData, setFormData] = useState<NewClientFormDTO>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    communicationChannels: [],
    informationSource: undefined,
    sourceDetails: '',
  });

  // Готові Orval хуки
  const clientFormData = useStage1GetClientFormData(sessionId, {
    query: { enabled: !!sessionId },
  });
  const updateMutation = useStage1UpdateClientData();
  const createMutation = useStage1CreateClient();
  const completeMutation = useStage1CompleteClientCreation();

  // Завантаження існуючих даних клієнта (якщо редагування)
  useEffect(() => {
    if (clientFormData.data) {
      const data = clientFormData.data;
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        communicationChannels: data.communicationChannels || [],
        informationSource: data.informationSource,
        sourceDetails: data.sourceDetails || '',
      });
    }
  }, [clientFormData.data]);

  // Обробка зміни полів
  const handleFieldChange = (field: keyof NewClientFormDTO, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Обробка способів зв'язку (мультивибір)
  const handleCommunicationChannelChange = (
    channel: NewClientFormDTOCommunicationChannelsItem,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      communicationChannels: checked
        ? [...(prev.communicationChannels || []), channel]
        : (prev.communicationChannels || []).filter((c) => c !== channel),
    }));
  };

  // Збереження/Створення клієнта
  const handleSave = async () => {
    // Валідація обов'язкових полів
    if (!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.phone?.trim()) {
      alert("Заповніть обов'язкові поля: Ім&apos;я, Прізвище, Телефон");
      return;
    }

    try {
      const isEditing = !!clientFormData.data?.firstName; // Якщо є дані - це редагування

      if (isEditing) {
        // Оновлення існуючого клієнта
        await updateMutation.mutateAsync({
          sessionId,
          data: formData,
        });
      } else {
        // Створення нового клієнта
        await createMutation.mutateAsync({ sessionId });

        // Оновлення даних нового клієнта
        await updateMutation.mutateAsync({
          sessionId,
          data: formData,
        });

        // Завершення створення клієнта
        await completeMutation.mutateAsync({ sessionId });
      }

      onNext();
    } catch (error) {
      console.error('Помилка збереження клієнта:', error);
    }
  };

  const isLoading =
    updateMutation.isPending || createMutation.isPending || completeMutation.isPending;
  const isEditing = !!clientFormData.data?.firstName;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {isEditing ? 'Редагування клієнта' : 'Створення нового клієнта'}
      </Typography>

      {clientFormData.isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CircularProgress size={20} />
          <Typography>Завантаження даних клієнта...</Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Обов'язкові поля */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Обов&apos;язкові поля
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Ім'я"
            value={formData.firstName || ''}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Прізвище"
            value={formData.lastName || ''}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Телефон"
            value={formData.phone || ''}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
          />
        </Grid>

        {/* Додаткові поля */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" color="primary" gutterBottom sx={{ mt: 2 }}>
            Додаткова інформація
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Адреса"
            value={formData.address || ''}
            onChange={(e) => handleFieldChange('address', e.target.value)}
          />
        </Grid>

        {/* Способи зв'язку */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Способи зв&apos;язку</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={(formData.communicationChannels || []).includes(
                      NewClientFormDTOCommunicationChannelsItem.PHONE
                    )}
                    onChange={(e) =>
                      handleCommunicationChannelChange(
                        NewClientFormDTOCommunicationChannelsItem.PHONE,
                        e.target.checked
                      )
                    }
                  />
                }
                label="Номер телефону"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={(formData.communicationChannels || []).includes(
                      NewClientFormDTOCommunicationChannelsItem.SMS
                    )}
                    onChange={(e) =>
                      handleCommunicationChannelChange(
                        NewClientFormDTOCommunicationChannelsItem.SMS,
                        e.target.checked
                      )
                    }
                  />
                }
                label="SMS"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={(formData.communicationChannels || []).includes(
                      NewClientFormDTOCommunicationChannelsItem.VIBER
                    )}
                    onChange={(e) =>
                      handleCommunicationChannelChange(
                        NewClientFormDTOCommunicationChannelsItem.VIBER,
                        e.target.checked
                      )
                    }
                  />
                }
                label="Viber"
              />
            </FormGroup>
          </FormControl>
        </Grid>

        {/* Джерело інформації */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Джерело інформації про хімчистку</FormLabel>
            <RadioGroup
              value={formData.informationSource || ''}
              onChange={(e) =>
                handleFieldChange(
                  'informationSource',
                  e.target.value as NewClientFormDTOInformationSource
                )
              }
            >
              <FormControlLabel
                value={NewClientFormDTOInformationSource.INSTAGRAM}
                control={<Radio />}
                label="Інстаграм"
              />
              <FormControlLabel
                value={NewClientFormDTOInformationSource.GOOGLE}
                control={<Radio />}
                label="Google"
              />
              <FormControlLabel
                value={NewClientFormDTOInformationSource.RECOMMENDATION}
                control={<Radio />}
                label="Рекомендації"
              />
              <FormControlLabel
                value={NewClientFormDTOInformationSource.OTHER}
                control={<Radio />}
                label="Інше"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Поле для "Інше" */}
        {formData.informationSource === NewClientFormDTOInformationSource.OTHER && (
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Уточнення джерела інформації"
              value={formData.sourceDetails || ''}
              onChange={(e) => handleFieldChange('sourceDetails', e.target.value)}
            />
          </Grid>
        )}

        {/* Кнопки */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={onBack}>Назад</Button>

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
            >
              {isLoading ? 'Збереження...' : isEditing ? 'Оновити клієнта' : 'Створити клієнта'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Помилки */}
      {(updateMutation.error || createMutation.error || completeMutation.error) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Помилка збереження:{' '}
          {(updateMutation.error || createMutation.error || completeMutation.error)?.message}
        </Alert>
      )}
    </Box>
  );
};
