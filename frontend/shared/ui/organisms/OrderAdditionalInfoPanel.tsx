'use client';

import { Note, Person, Info, Warning } from '@mui/icons-material';
import { Box, Typography, TextField, Alert, Divider, Paper, Chip } from '@mui/material';
import React from 'react';

/**
 * Інтерфейс для додаткової інформації замовлення
 */
interface AdditionalInfo {
  orderNotes: string;
  clientRequirements: string;
}

/**
 * Інтерфейс для помилок валідації
 */
interface ValidationErrors {
  orderNotes?: string;
  clientRequirements?: string;
}

/**
 * Props для OrderAdditionalInfoPanel компонента
 */
interface OrderAdditionalInfoPanelProps {
  /**
   * Додаткова інформація замовлення
   */
  additionalInfo: AdditionalInfo;

  /**
   * Обробник зміни примітки до замовлення
   */
  onOrderNotesChange: (notes: string) => void;

  /**
   * Обробник зміни вимог клієнта
   */
  onClientRequirementsChange: (requirements: string) => void;

  /**
   * Помилки валідації
   */
  validationErrors?: ValidationErrors;

  /**
   * Чи компонент доступний для редагування
   */
  disabled?: boolean;

  /**
   * Чи показувати компактну версію
   */
  compact?: boolean;

  /**
   * Максимальна довжина примітки
   */
  maxNotesLength?: number;

  /**
   * Максимальна довжина вимог клієнта
   */
  maxRequirementsLength?: number;
}

/**
 * Універсальний компонент для додаткової інформації замовлення
 *
 * FSD принципи:
 * - Тільки UI логіка без domain-специфічних залежностей
 * - Отримує дані та обробники через пропси
 * - Може використовуватися в різних частинах додатка
 */
export const OrderAdditionalInfoPanel: React.FC<OrderAdditionalInfoPanelProps> = ({
  additionalInfo,
  onOrderNotesChange,
  onClientRequirementsChange,
  validationErrors = {},
  disabled = false,
  compact = false,
  maxNotesLength = 500,
  maxRequirementsLength = 300,
}) => {
  /**
   * Обробник зміни примітки до замовлення
   */
  const handleOrderNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onOrderNotesChange(event.target.value);
  };

  /**
   * Обробник зміни вимог клієнта
   */
  const handleClientRequirementsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onClientRequirementsChange(event.target.value);
  };

  /**
   * Підрахунок кількості символів
   */
  const getCharacterCount = (text: string, maxLength: number) => {
    return `${text.length}/${maxLength}`;
  };

  /**
   * Перевірка чи перевищує максимальну довжину
   */
  const isOverLimit = (text: string, maxLength: number) => {
    return text.length > maxLength;
  };

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
            <Note color="primary" />
            Додаткова інформація
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Внесіть примітки та особливі вимоги до замовлення
          </Typography>
        </Box>
      )}

      {/* Примітки до замовлення */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Note color="action" />
          Примітки до замовлення
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Загальні примітки"
          placeholder="Додайте будь-які важливі нотатки щодо замовлення..."
          value={additionalInfo.orderNotes}
          onChange={handleOrderNotesChange}
          disabled={disabled}
          helperText={
            validationErrors.orderNotes ||
            `${getCharacterCount(additionalInfo.orderNotes, maxNotesLength)} символів`
          }
          error={
            !!validationErrors.orderNotes || isOverLimit(additionalInfo.orderNotes, maxNotesLength)
          }
          inputProps={{
            maxLength: maxNotesLength,
          }}
        />

        {/* Підказки для примітки */}
        {!compact && (
          <Alert severity="info" sx={{ mt: 1 }} icon={<Info />}>
            <Typography variant="caption">
              <strong>Рекомендації для примітки:</strong>
              <br />
              • Особливості обробки предметів
              <br />
              • Інформація про стан або дефекти
              <br />
              • Термінові вказівки персоналу
              <br />• Контактна інформація для зв&apos;язку
            </Typography>
          </Alert>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Додаткові вимоги клієнта */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Person color="action" />
          Додаткові вимоги клієнта
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Спеціальні вимоги"
          placeholder="Специфічні побажання клієнта щодо обробки..."
          value={additionalInfo.clientRequirements}
          onChange={handleClientRequirementsChange}
          disabled={disabled}
          helperText={
            validationErrors.clientRequirements ||
            `${getCharacterCount(additionalInfo.clientRequirements, maxRequirementsLength)} символів`
          }
          error={
            !!validationErrors.clientRequirements ||
            isOverLimit(additionalInfo.clientRequirements, maxRequirementsLength)
          }
          inputProps={{
            maxLength: maxRequirementsLength,
          }}
        />

        {/* Підказки для вимог клієнта */}
        {!compact && (
          <Alert severity="info" sx={{ mt: 1 }} icon={<Info />}>
            <Typography variant="caption">
              <strong>Приклади вимог клієнта:</strong>
              <br />
              • Особливі методи чистки
              <br />
              • Бажаний час готовності
              <br />
              • Способи упакування
              <br />• Алергічні реакції на хімічні засоби
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Попередження про довжину тексту */}
      {(isOverLimit(additionalInfo.orderNotes, maxNotesLength) ||
        isOverLimit(additionalInfo.clientRequirements, maxRequirementsLength)) && (
        <Alert severity="warning" sx={{ mb: 2 }} icon={<Warning />}>
          <Typography variant="body2">
            <strong>Увага!</strong> Деякі поля перевищують максимально дозволену кількість символів.
            Зайвий текст буде обрізаний при збереженні.
          </Typography>
        </Alert>
      )}

      {/* Статус заповнення */}
      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Статус заповнення додаткової інформації:
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            label="Примітки"
            color={additionalInfo.orderNotes.trim() ? 'success' : 'default'}
            variant={additionalInfo.orderNotes.trim() ? 'filled' : 'outlined'}
            icon={additionalInfo.orderNotes.trim() ? undefined : <Note />}
          />

          <Chip
            size="small"
            label="Вимоги клієнта"
            color={additionalInfo.clientRequirements.trim() ? 'success' : 'default'}
            variant={additionalInfo.clientRequirements.trim() ? 'filled' : 'outlined'}
            icon={additionalInfo.clientRequirements.trim() ? undefined : <Person />}
          />
        </Box>

        {/* Загальний статус */}
        <Box sx={{ mt: 2 }}>
          {!additionalInfo.orderNotes.trim() && !additionalInfo.clientRequirements.trim() ? (
            <Typography variant="caption" color="text.secondary">
              Додаткова інформація не заповнена - можна продовжувати без неї
            </Typography>
          ) : (
            <Typography variant="caption" color="success.main">
              ✓ Додаткова інформація додана до замовлення
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Важлива інформація */}
      {!compact && (
        <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Важливо пам&apos;ятати:</strong>
          </Typography>
          <Typography variant="caption" component="div">
            • Примітки будуть видні всьому персоналу
            <br />
            • Вимоги клієнта будуть враховані при обробці
            <br />
            • Інформація може бути передана клієнту у квитанції
            <br />• Чітко вказуйте критично важливі моменти
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
