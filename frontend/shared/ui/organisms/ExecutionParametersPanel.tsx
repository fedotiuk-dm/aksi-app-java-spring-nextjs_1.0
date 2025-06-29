'use client';

import { AccessTime } from '@mui/icons-material';
import { Box, Typography, Divider, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React from 'react';

import { UrgencyOptionSelector, UrgencyOption } from '../molecules';

interface ExecutionParametersPanelProps {
  // Urgency
  urgencyOptions: UrgencyOption[];
  selectedUrgency: string;
  onUrgencyChange: (value: string) => void;
  urgencyError?: string;

  // Execution date
  executionDate: Date | null;
  onExecutionDateChange: (date: Date | null) => void;
  calculatedDate?: Date;
  executionDateError?: string;

  // Custom deadline
  customDeadline?: Date | null;
  onCustomDeadlineChange?: (date: Date | null) => void;
  customDeadlineError?: string;

  // Configuration
  disabled?: boolean;
  compact?: boolean;
  title?: string;
  description?: string;
  showDatePicker?: boolean;
  showCustomDeadline?: boolean;
}

/**
 * Панель параметрів виконання замовлення
 */
export const ExecutionParametersPanel: React.FC<ExecutionParametersPanelProps> = ({
  urgencyOptions,
  selectedUrgency,
  onUrgencyChange,
  urgencyError,
  executionDate,
  onExecutionDateChange,
  calculatedDate,
  executionDateError,
  customDeadline,
  onCustomDeadlineChange,
  customDeadlineError,
  disabled = false,
  compact = false,
  title = 'Параметри виконання',
  description = 'Оберіть дату виконання та рівень терміновості замовлення',
  showDatePicker = true,
  showCustomDeadline = false,
}) => {
  return (
    <Box sx={{ p: compact ? 2 : 3 }}>
      {/* Заголовок секції */}
      {!compact && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <AccessTime color="primary" />
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      )}

      {/* Селектор терміновості */}
      <Box sx={{ mb: showDatePicker ? 3 : 0 }}>
        <UrgencyOptionSelector
          options={urgencyOptions}
          selectedValue={selectedUrgency}
          onChange={onUrgencyChange}
          disabled={disabled}
          error={urgencyError}
          title={compact ? 'Рівень терміновості' : undefined}
          description={compact ? 'Оберіть тип терміновості виконання' : undefined}
        />
      </Box>

      {/* Розділювач */}
      {showDatePicker && !compact && <Divider sx={{ my: 2 }} />}

      {/* Дата виконання */}
      {showDatePicker && (
        <Box sx={{ mb: showCustomDeadline ? 3 : 0 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            Дата виконання
          </Typography>

          <DatePicker
            label="Оберіть дату виконання"
            value={executionDate}
            onChange={onExecutionDateChange}
            disabled={disabled}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!executionDateError,
                helperText: executionDateError,
              },
            }}
          />

          {/* Інформація про розрахункову дату */}
          {calculatedDate && !executionDate && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Рекомендована дата виконання на основі обраних послуг:{' '}
                <strong>{calculatedDate.toLocaleDateString('uk-UA')}</strong>
              </Typography>
            </Alert>
          )}

          {/* Попередження про терміни */}
          {selectedUrgency === 'STANDARD' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Стандартний термін виконання: 48 годин для звичайних послуг, 14 днів для шкіряних
                виробів
              </Typography>
            </Alert>
          )}
        </Box>
      )}

      {/* Індивідуальний дедлайн */}
      {showCustomDeadline && onCustomDeadlineChange && (
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            Індивідуальний дедлайн
          </Typography>

          <DatePicker
            label="Особливий дедлайн клієнта"
            value={customDeadline}
            onChange={onCustomDeadlineChange}
            disabled={disabled}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!customDeadlineError,
                helperText: customDeadlineError || 'Особливі вимоги клієнта до термінів виконання',
              },
            }}
          />
        </Box>
      )}

      {/* Загальна помилка */}
      {(urgencyError || executionDateError || customDeadlineError) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Будь ласка, виправте помилки валідації перед продовженням
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
