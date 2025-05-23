'use client';

import { Save, Cancel } from '@mui/icons-material';
import { Alert, Box } from '@mui/material';
import React from 'react';

import { StepContainer, ActionButton, FormSection } from '@/features/order-wizard/shared/ui';

import { ClientFormFields } from './ClientFormFields';

import type { CreateClientFormData } from '@/domain/client';

interface ClientCreateFormProps {
  isLoading: boolean;
  error: string | null;
  formData: Partial<CreateClientFormData>;
  onSave: (data: CreateClientFormData) => Promise<void>;
  onCancel: () => void;
  className?: string;
  title?: string;
  buttonSize?: 'small' | 'medium' | 'large';
  hideCancel?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

/**
 * Компонент форми створення нового клієнта
 * Використовує shared компоненти для консистентного стилю
 */
export const ClientCreateForm: React.FC<ClientCreateFormProps> = ({
  isLoading,
  error,
  formData,
  onSave,
  onCancel,
  className,
  title = 'Створити нового клієнта',
  buttonSize = 'medium',
  hideCancel = false,
  submitLabel = 'Створити клієнта',
  cancelLabel = 'Скасувати',
}) => {
  const [localFormData, setLocalFormData] = React.useState(formData);

  // Синхронізуємо локальні дані з зовнішніми
  React.useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleFieldChange = (
    field: string,
    value: CreateClientFormData[keyof CreateClientFormData]
  ) => {
    setLocalFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (localFormData.lastName && localFormData.firstName && localFormData.phone) {
      await onSave(localFormData as CreateClientFormData);
    }
  };

  const isFormValid = !!(localFormData.lastName && localFormData.firstName && localFormData.phone);

  return (
    <StepContainer
      title={title}
      subtitle="Додайте нового клієнта до бази даних хімчистки"
      className={className}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <FormSection title="Особисті дані" subtitle="Основна інформація про клієнта" required>
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
