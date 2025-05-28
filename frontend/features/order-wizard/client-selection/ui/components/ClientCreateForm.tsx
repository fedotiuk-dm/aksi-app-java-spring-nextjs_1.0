'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Cancel } from '@mui/icons-material';
import { Alert, Box } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';

import {
  clientFormSchema,
  type ClientFormData,
} from '@/domain/wizard/services/stage-1-client-and-order/client-management';
import { StepContainer, ActionButton, FormSection } from '@/shared/ui';

// Компоненти
import { ClientFormFields } from './ClientFormFields';

interface ClientCreateFormProps {
  // Стан операції створення
  isLoading: boolean;
  error?: string | null;

  // Обробники подій
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;

  // Опції UI
  className?: string;
  title?: string;
  submitLabel?: string;
  cancelLabel?: string;
}

/**
 * Компонент форми створення нового клієнта (DDD архітектура + Shared UI)
 */
export const ClientCreateForm: React.FC<ClientCreateFormProps> = ({
  isLoading,
  error,
  onSubmit,
  onCancel,
  className,
  title = 'Створити нового клієнта',
  submitLabel = 'Створити клієнта',
  cancelLabel = 'Скасувати',
}) => {
  // Форма з Zod валідацією
  const {
    control,
    handleSubmit,
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

  const handleFormSubmit = handleSubmit(async (data: ClientFormData) => {
    await onSubmit(data);
  });

  return (
    <StepContainer
      title={title}
      subtitle="Додайте нового клієнта до бази даних хімчистки"
      className={className}
    >
      {/* Помилки */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Форма */}
      <Box component="form" onSubmit={handleFormSubmit}>
        <FormSection title="Особисті дані" subtitle="Основна інформація про клієнта" required>
          <ClientFormFields control={control} errors={errors} showAllFields={true} />
        </FormSection>

        {/* Кнопки */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <ActionButton
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading}
            startIcon={<Cancel />}
            type="button"
          >
            {cancelLabel}
          </ActionButton>

          <ActionButton
            type="submit"
            variant="contained"
            disabled={!isValid}
            loading={isLoading}
            startIcon={<Save />}
            loadingText="Створення..."
          >
            {submitLabel}
          </ActionButton>
        </Box>
      </Box>
    </StepContainer>
  );
};
