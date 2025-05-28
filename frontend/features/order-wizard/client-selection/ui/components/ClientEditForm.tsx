'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Cancel } from '@mui/icons-material';
import { Alert, Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

// Типи з доменного шару
import {
  clientFormSchema,
  type ClientFormData,
} from '@/domain/wizard/services/stage-1-client-and-order/client-management';
import { StepContainer, ActionButton, FormSection } from '@/shared/ui';

import { ClientFormFields } from './ClientFormFields';

import type { ClientResponse } from '@/shared/api/generated/client';

// Shared компоненти

// Компоненти

interface ClientEditFormProps {
  isLoading: boolean;
  error: string | null;
  originalClient: ClientResponse | null;
  onSave: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
  className?: string;
  title?: string;
  submitLabel?: string;
  cancelLabel?: string;
}

/**
 * Компонент форми редагування клієнта (DDD архітектура + Shared UI)
 */
export const ClientEditForm: React.FC<ClientEditFormProps> = ({
  isLoading,
  error,
  originalClient,
  onSave,
  onCancel,
  className,
  title,
  submitLabel = 'Зберегти зміни',
  cancelLabel = 'Скасувати',
}) => {
  // Форма з Zod валідацією
  const {
    control,
    handleSubmit,
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

  // Ініціалізація форми з даними клієнта
  useEffect(() => {
    if (originalClient) {
      reset({
        firstName: originalClient.firstName || '',
        lastName: originalClient.lastName || '',
        phone: originalClient.phone || '',
        email: originalClient.email || '',
        address: originalClient.address || '',
        communicationChannels: originalClient.communicationChannels || ['PHONE'],
        source: originalClient.source || 'OTHER',
        sourceDetails: originalClient.sourceDetails || '',
        informationSourceOther: originalClient.sourceDetails || '',
      });
    }
  }, [originalClient, reset]);

  const handleFormSubmit = handleSubmit(async (data: ClientFormData) => {
    await onSave(data);
  });

  if (!originalClient) {
    return (
      <StepContainer title="Помилка" className={className}>
        <Alert severity="error">Помилка: клієнт для редагування не знайдений</Alert>
      </StepContainer>
    );
  }

  const defaultTitle = `Редагувати клієнта: ${originalClient.firstName} ${originalClient.lastName}`;

  return (
    <StepContainer
      title={title || defaultTitle}
      subtitle="Внесіть зміни до інформації про клієнта"
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
        <FormSection
          title="Особисті дані"
          subtitle="Оновіть необхідну інформацію про клієнта"
          required
        >
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
            loadingText="Збереження..."
          >
            {submitLabel}
          </ActionButton>
        </Box>
      </Box>
    </StepContainer>
  );
};
