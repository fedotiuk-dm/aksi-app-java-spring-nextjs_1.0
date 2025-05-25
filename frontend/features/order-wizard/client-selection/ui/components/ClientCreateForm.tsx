'use client';

import { Save, Cancel } from '@mui/icons-material';
import { Alert, Box } from '@mui/material';
import React from 'react';

import { StepContainer, ActionButton, FormSection } from '@/shared/ui';

import { ClientFormFields } from './ClientFormFields';

import type { ClientSearchResult } from '@/domain/wizard';

interface ClientCreateFormProps {
  // Дані з useClientForm хука
  form: any; // React Hook Form instance
  isCreating: boolean;
  duplicateCheck: {
    hasDuplicates: boolean;
    duplicatesByPhone: ClientSearchResult[];
    duplicatesByEmail: ClientSearchResult[];
    duplicatesByFullName: ClientSearchResult[];
    recommendedAction: 'create' | 'merge' | 'review';
  } | null;
  showDuplicateWarning: boolean;

  // Обробники подій (тільки UI події)
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  onFieldChange: (field: string, value: any) => void;
  onDismissDuplicateWarning?: () => void;

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
  isCreating,
  duplicateCheck,
  showDuplicateWarning,
  onSubmit,
  onCancel,
  onFieldChange,
  onDismissDuplicateWarning,
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
  } = form;

  const handleFormSubmit = handleSubmit(async (data: any) => {
    await onSubmit(data);
  });

  return (
    <StepContainer
      title={title}
      subtitle="Додайте нового клієнта до бази даних хімчистки"
      className={className}
    >
      {/* Відображення попереджень про дублікати */}
      {showDuplicateWarning && duplicateCheck?.hasDuplicates && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={onDismissDuplicateWarning}>
          <Box>
            <strong>Знайдено схожих клієнтів:</strong>
            {duplicateCheck.duplicatesByPhone.map((duplicate: any, index: number) => (
              <div key={index}>
                {duplicate.firstName} {duplicate.lastName} - {duplicate.phone}
              </div>
            ))}
          </Box>
          {duplicateCheck.duplicatesByEmail.map((duplicate: any, index: number) => (
            <div key={index}>
              {duplicate.firstName} {duplicate.lastName} - {duplicate.email}
            </div>
          ))}
          {duplicateCheck.duplicatesByFullName.map((duplicate: any, index: number) => (
            <div key={index}>
              {duplicate.firstName} {duplicate.lastName} - {duplicate.phone}
            </div>
          ))}
        </Alert>
      )}

      {/* Індикатор перевірки дублікатів */}
      {duplicateCheck?.recommendedAction === 'review' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Перевірка на наявність дублікатів...
        </Alert>
      )}

      <Box component="form" onSubmit={handleFormSubmit}>
        <FormSection title="Особисті дані" subtitle="Основна інформація про клієнта" required>
          <ClientFormFields
            formData={form.watch()}
            onChange={onFieldChange}
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
