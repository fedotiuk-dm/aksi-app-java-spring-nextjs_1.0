'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowBack, Save } from '@mui/icons-material';
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Button,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import {
  clientFormSchema,
  type ClientFormData,
} from '@/domain/wizard/services/stage-1-client-and-order/client-management';
import {
  StepContainer,
  FormSection,
  FormField,
  ActionButton,
  MultiSelectCheckboxGroup,
  StatusMessage,
} from '@/shared/ui';

// Імпорти з доменного шару - Zod схема та типи

// Типи хуків та API
import type { ClientResponse } from '@/shared/api/generated/client';

interface ClientFormState {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}

interface ClientFormPanelProps {
  creationState: ClientFormState;
  selectedClient?: ClientResponse | null;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
  onValidate: (data: ClientFormData) => any;
  isEditMode?: boolean;
}

/**
 * Панель форми для створення/редагування клієнта (з Zod валідацією + Shared UI)
 */
export const ClientFormPanel: React.FC<ClientFormPanelProps> = ({
  creationState,
  selectedClient,
  onSubmit,
  onCancel,
  onValidate,
}) => {
  // React Hook Form з Zod валідацією
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      communicationChannels: ['PHONE'],
      source: 'OTHER',
      sourceDetails: '',
      informationSourceOther: '',
    },
  });

  // Ініціалізація форми з даними вибраного клієнта (для редагування)
  useEffect(() => {
    if (selectedClient) {
      reset({
        firstName: selectedClient.firstName || '',
        lastName: selectedClient.lastName || '',
        phone: selectedClient.phone || '',
        email: selectedClient.email || '',
        address: selectedClient.address || '',
        communicationChannels: selectedClient.communicationChannels || ['PHONE'],
        source: selectedClient.source || 'OTHER',
        sourceDetails: selectedClient.sourceDetails || '',
        informationSourceOther: selectedClient.sourceDetails || '',
      });
    }
  }, [selectedClient, reset]);

  const source = watch('source');
  const isEditing = !!selectedClient;

  const handleFormSubmit = handleSubmit(async (data) => {
    // Додаткова валідація через доменний сервіс
    const validation = onValidate(data);
    if (validation.isValid) {
      await onSubmit(data);
    }
  });

  // Варіанти способів зв'язку
  const contactMethodOptions = [
    { value: 'PHONE', label: 'Телефон' },
    { value: 'SMS', label: 'SMS' },
    { value: 'VIBER', label: 'Viber' },
  ];

  // Варіанти джерел інформації
  const informationSourceOptions = [
    { value: 'INSTAGRAM', label: 'Instagram' },
    { value: 'GOOGLE', label: 'Google' },
    { value: 'RECOMMENDATION', label: 'Рекомендації' },
    { value: 'OTHER', label: 'Інше' },
  ];

  return (
    <Box>
      {/* Заголовок з кнопкою назад */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={onCancel} sx={{ mr: 2 }}>
          Назад
        </Button>
        <StepContainer title={isEditing ? 'Редагування клієнта' : 'Створення нового клієнта'}>
          {/* Помилки створення */}
          {creationState.isError && creationState.errorMessage && (
            <StatusMessage severity="error" message={creationState.errorMessage} sx={{ mb: 3 }} />
          )}

          {/* Форма з Zod валідацією */}
          <form onSubmit={handleFormSubmit}>
            {/* Основна інформація */}
            <FormSection title="Основна інформація">
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        {...field}
                        type="text"
                        label="Ім'я"
                        error={errors.firstName?.message}
                        required
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        {...field}
                        type="text"
                        label="Прізвище"
                        error={errors.lastName?.message}
                        required
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        {...field}
                        type="tel"
                        label="Телефон"
                        error={errors.phone?.message}
                        required
                        fullWidth
                        placeholder="+380XXXXXXXXX"
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        {...field}
                        type="email"
                        label="Email"
                        error={errors.email?.message}
                        fullWidth
                        placeholder="example@domain.com"
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        {...field}
                        type="text"
                        label="Адреса"
                        error={errors.address?.message}
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Вулиця, будинок, квартира, місто"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Способи зв'язку */}
            <FormSection title="Способи зв'язку">
              <Controller
                name="communicationChannels"
                control={control}
                render={({ field }) => (
                  <MultiSelectCheckboxGroup
                    label="Оберіть зручні способи зв'язку"
                    options={contactMethodOptions}
                    selectedValues={field.value || []}
                    onChange={field.onChange}
                    orientation="row"
                    showSelectedTags={false}
                    error={errors.communicationChannels?.message}
                    helperText="Оберіть один або кілька способів для зв'язку з клієнтом"
                  />
                )}
              />
            </FormSection>

            {/* Джерело інформації */}
            <FormSection title="Джерело інформації">
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="source"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.source}>
                        <InputLabel>Звідки дізналися про нас?</InputLabel>
                        <Select {...field} label="Звідки дізналися про нас?">
                          {informationSourceOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.source && (
                          <FormHelperText error>{errors.source.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Поле "Інше" для джерела інформації */}
                {source === 'OTHER' && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="sourceDetails"
                      control={control}
                      render={({ field }) => (
                        <FormField
                          {...field}
                          type="text"
                          label="Уточніть джерело"
                          error={errors.sourceDetails?.message}
                          required={source === 'OTHER'}
                          fullWidth
                          placeholder="Опишіть як клієнт дізнався про хімчистку"
                        />
                      )}
                    />
                  </Grid>
                )}
              </Grid>
            </FormSection>

            {/* Кнопки дій */}
            <FormSection title="">
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <ActionButton
                  type="submit"
                  variant="contained"
                  startIcon={
                    creationState.isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Save />
                    )
                  }
                  disabled={creationState.isLoading || !isValid}
                  fullWidth={false}
                >
                  {isEditing ? 'Зберегти зміни' : 'Створити клієнта'}
                </ActionButton>

                <ActionButton
                  variant="outlined"
                  disabled={creationState.isLoading}
                  onClick={onCancel}
                  fullWidth={false}
                >
                  Скасувати
                </ActionButton>
              </Box>
            </FormSection>
          </form>
        </StepContainer>
      </Box>
    </Box>
  );
};
