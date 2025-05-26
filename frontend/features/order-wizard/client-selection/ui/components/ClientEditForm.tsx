'use client';

import { Save, Cancel } from '@mui/icons-material';
import { Alert, Box } from '@mui/material';
import React from 'react';

import { StepContainer, ActionButton, FormSection } from '@/shared/ui';

import { ClientFormFields } from './ClientFormFields';

import type { ClientData } from '@/domain/wizard/services/stage-1-client-and-order-info';

interface ClientEditFormProps {
  isLoading: boolean;
  error: string | null;
  formData: Partial<ClientData>;
  originalClient: ClientData | null;
  onSave: (data: ClientData) => Promise<void>;
  onCancel: () => void;
  className?: string;
  title?: string;
  buttonSize?: 'small' | 'medium' | 'large';
  hideCancel?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

/**
 * Компонент форми редагування клієнта
 * Використовує shared компоненти для консистентного стилю
 */
export const ClientEditForm: React.FC<ClientEditFormProps> = ({
  isLoading,
  error,
  formData,
  originalClient,
  onSave,
  onCancel,
  className,
  title,
  buttonSize = 'medium',
  hideCancel = false,
  submitLabel = 'Зберегти зміни',
  cancelLabel = 'Скасувати',
}) => {
  const [localFormData, setLocalFormData] = React.useState(formData);

  // Синхронізуємо локальні дані з зовнішніми
  React.useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleFieldChange = (field: keyof ClientData, value: unknown) => {
    setLocalFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log('📝 ClientEditForm.handleSubmit - дані форми:', {
      localFormData,
      allKeys: Object.keys(localFormData),
      isComplete: !!(localFormData.lastName && localFormData.firstName && localFormData.phone),
    });

    if (localFormData.lastName && localFormData.firstName && localFormData.phone) {
      console.log(
        '📝 ClientEditForm.handleSubmit - викликаємо onSave з даними:',
        localFormData as ClientData
      );
      await onSave(localFormData as ClientData);
    }
  };

  if (!originalClient) {
    return (
      <StepContainer title="Помилка" className={className}>
        <Alert severity="error">Помилка: клієнт для редагування не знайдений</Alert>
      </StepContainer>
    );
  }

  const defaultTitle = `Редагувати клієнта: ${originalClient.firstName} ${originalClient.lastName}`;
  const isFormValid = !!(localFormData.lastName && localFormData.firstName && localFormData.phone);

  return (
    <StepContainer
      title={title || defaultTitle}
      subtitle="Внесіть зміни до інформації про клієнта"
      className={className}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <FormSection
          title="Особисті дані"
          subtitle="Оновіть необхідну інформацію про клієнта"
          required
        >
          <ClientFormFields
            formData={localFormData}
            onChange={handleFieldChange}
            size="medium"
            showAllFields={true}
          />
        </FormSection>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {!hideCancel && (
            <ActionButton
              variant="outlined"
              onClick={onCancel}
              disabled={isLoading}
              startIcon={<Cancel />}
              size={buttonSize}
            >
              {cancelLabel}
            </ActionButton>
          )}

          <ActionButton
            type="submit"
            variant="contained"
            disabled={!isFormValid}
            loading={isLoading}
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
