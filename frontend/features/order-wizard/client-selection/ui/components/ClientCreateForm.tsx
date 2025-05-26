'use client';

import { Save, Cancel } from '@mui/icons-material';
import { Alert, Box } from '@mui/material';
import React from 'react';

import { StepContainer, ActionButton, FormSection } from '@/shared/ui';

import { ClientFormFields } from './ClientFormFields';

import type { ClientData } from '@/domain/wizard/services/stage-1-client-and-order-info';
import type { UseFormReturn } from 'react-hook-form';

interface ClientCreateFormProps {
  // Дані з useClientForm хука
  form: UseFormReturn<ClientData> & {
    isCreating: boolean;
    existingClient: boolean;
  };

  // Обробники подій (тільки UI події)
  onSubmit: (data: ClientData) => Promise<void>;
  onCancel: () => void;

  // Опції UI
  className?: string;
  title?: string;
  buttonSize?: 'small' | 'medium' | 'large';
  hideCancel?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

/**
 * Компонент форми створення нового клієнта (DDD архітектура)
 *
 * FSD принципи:
 * - Тільки UI логіка та відображення
 * - Отримує всі дані з useClientForm хука
 * - Не містить бізнес-логіки
 */
export const ClientCreateForm: React.FC<ClientCreateFormProps> = ({
  form,
  onSubmit,
  onCancel,
  className,
  title = 'Створити нового клієнта',
  buttonSize = 'medium',
  hideCancel = false,
  submitLabel = 'Створити клієнта',
  cancelLabel = 'Скасувати',
}) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    isCreating,
    existingClient,
  } = form;

  const handleFormSubmit = handleSubmit(async (data: ClientData) => {
    await onSubmit(data);
  });

  const handleFieldChange = (field: keyof ClientData, value: unknown) => {
    setValue(field, value as ClientData[typeof field]);
  };

  return (
    <StepContainer
      title={title}
      subtitle="Додайте нового клієнта до бази даних хімчистки"
      className={className}
    >
      {/* Відображення попереджень про існуючого клієнта */}
      {existingClient && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Box>
            <strong>Увага!</strong> Клієнт з такими даними вже може існувати в базі даних. Перевірте
            правильність введених даних.
          </Box>
        </Alert>
      )}

      <Box component="form" onSubmit={handleFormSubmit}>
        <FormSection title="Особисті дані" subtitle="Основна інформація про клієнта" required>
          <ClientFormFields
            formData={watch()}
            onChange={handleFieldChange}
            size="medium"
            showAllFields={true}
            errors={errors}
          />
        </FormSection>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {!hideCancel && (
            <ActionButton
              variant="outlined"
              onClick={onCancel}
              disabled={isCreating}
              startIcon={<Cancel />}
              size={buttonSize}
            >
              {cancelLabel}
            </ActionButton>
          )}

          <ActionButton
            type="submit"
            variant="contained"
            disabled={!isValid || isCreating}
            loading={isCreating}
            startIcon={<Save />}
            size={buttonSize}
            loadingText="Збереження..."
          >
            {submitLabel}
          </ActionButton>
        </Box>
      </Box>
    </StepContainer>
  );
};
