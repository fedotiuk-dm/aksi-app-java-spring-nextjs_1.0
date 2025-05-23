/**
 * Компонент параметрів виконання замовлення
 *
 * Відповідає розділу 3.1 з документації Order Wizard:
 * - Дата виконання (календар з вибором дати)
 * - Автоматичний розрахунок на основі категорій доданих предметів
 * - Інформація про стандартні терміни (48 годин для звичайних/14 днів для шкіри)
 * - Термінове виконання (мультивибір):
 *   • Звичайне (без націнки)
 *   • +50% за 48 год
 *   • +100% за 24 год
 * - Автоматичний перерахунок дати виконання при зміні
 */

'use client';

import { AccessTime, Schedule, TrendingUp } from '@mui/icons-material';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React from 'react';

import { useOrderParameters } from '@/domain/order';

/**
 * Props для ExecutionParameters компонента
 */
interface ExecutionParametersProps {
  /**
   * Чи компонент доступний для редагування
   */
  disabled?: boolean;

  /**
   * Чи показувати компактну версію
   */
  compact?: boolean;
}

/**
 * Компонент параметрів виконання замовлення
 */
export const ExecutionParameters: React.FC<ExecutionParametersProps> = ({
  disabled = false,
  compact = false,
}) => {
  // Отримуємо всю функціональність з domain layer
  const {
    executionParams,
    urgencyOptions,
    calculatedExecutionDate,
    setExecutionDate,
    setUrgencyOption,
    setCustomDeadline,
    validationErrors,
  } = useOrderParameters();

  /**
   * Обробник зміни варіанту терміновості
   */
  const handleUrgencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const option = event.target.value as 'STANDARD' | 'URGENT_48H' | 'URGENT_24H' | 'CUSTOM';
    setUrgencyOption(option);
  };

  /**
   * Обробник зміни дати виконання
   */
  const handleExecutionDateChange = (date: Date | null) => {
    setExecutionDate(date);
  };

  /**
   * Обробник зміни індивідуального дедлайну
   */
  const handleCustomDeadlineChange = (date: Date | null) => {
    setCustomDeadline(date);
  };

  /**
   * Отримання кольору для варіанту терміновості
   */
  const getUrgencyColor = (option: string) => {
    switch (option) {
      case 'STANDARD':
        return 'success';
      case 'URGENT_48H':
        return 'warning';
      case 'URGENT_24H':
        return 'error';
      default:
        return 'info';
    }
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
            <AccessTime color="primary" />
            Параметри виконання
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Оберіть дату виконання та рівень терміновості замовлення
          </Typography>
        </Box>
      )}

      {/* Варіанти терміновості */}
      <FormControl component="fieldset" sx={{ mb: 3 }} disabled={disabled} fullWidth>
        <FormLabel component="legend" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Рівень терміновості
          </Typography>
        </FormLabel>

        <RadioGroup
          value={executionParams.urgencyOption}
          onChange={handleUrgencyChange}
          sx={{ gap: 1 }}
        >
          {urgencyOptions.map((option) => (
            <Box key={option.value} sx={{ mb: 1 }}>
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {option.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>

                    {/* Chip з інформацією про надбавку */}
                    {option.multiplier > 1 && (
                      <Chip
                        size="small"
                        icon={<TrendingUp />}
                        label={`+${Math.round((option.multiplier - 1) * 100)}%`}
                        color={getUrgencyColor(option.value) as any}
                        variant="outlined"
                      />
                    )}

                    {option.value === 'STANDARD' && (
                      <Chip size="small" label="Стандарт" color="success" variant="outlined" />
                    )}
                  </Box>
                }
                sx={{
                  m: 0,
                  p: 1.5,
                  border: '1px solid',
                  borderColor:
                    executionParams.urgencyOption === option.value ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  backgroundColor:
                    executionParams.urgencyOption === option.value
                      ? 'action.selected'
                      : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  width: '100%',
                }}
              />
            </Box>
          ))}
        </RadioGroup>

        {/* Помилка валідації терміновості */}
        {validationErrors.urgencyOption && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {validationErrors.urgencyOption}
          </Alert>
        )}
      </FormControl>

      <Divider sx={{ my: 2 }} />

      {/* Дата виконання */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Дата виконання замовлення
        </Typography>

        {/* Розрахована дата (для не-CUSTOM варіантів) */}
        {executionParams.urgencyOption !== 'CUSTOM' && (
          <Alert severity="info" icon={<Schedule />} sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Автоматично розрахована дата:</strong>{' '}
              {calculatedExecutionDate.toLocaleDateString('uk-UA', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              На основі стандартних термінів та обраної терміновості
            </Typography>
          </Alert>
        )}

        {/* Календар для індивідуального терміну */}
        {executionParams.urgencyOption === 'CUSTOM' ? (
          <DatePicker
            label="Індивідуальна дата виконання"
            value={executionParams.customDeadline}
            onChange={handleCustomDeadlineChange}
            disabled={disabled}
            minDate={new Date()}
            slotProps={{
              textField: {
                fullWidth: true,
                helperText:
                  validationErrors.executionDate || 'Оберіть бажану дату виконання замовлення',
                error: !!validationErrors.executionDate,
              },
            }}
          />
        ) : (
          <DatePicker
            label="Дата виконання (розрахована автоматично)"
            value={calculatedExecutionDate}
            onChange={handleExecutionDateChange}
            disabled={true}
            slotProps={{
              textField: {
                fullWidth: true,
                helperText: 'Дата розраховується автоматично на основі терміновості',
              },
            }}
          />
        )}

        {/* Помилка валідації дати */}
        {validationErrors.executionDate && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {validationErrors.executionDate}
          </Alert>
        )}
      </Box>

      {/* Інформаційна секція про терміни */}
      {!compact && (
        <Alert severity="info" variant="outlined">
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Стандартні терміни виконання:</strong>
          </Typography>
          <Typography variant="caption" component="div">
            • Звичайні послуги: 48 годин (2 дні)
            <br />
            • Шкіряні вироби: 14 днів
            <br />
            • Дублянки та хутро: до 21 дня
            <br />• Фарбування: до 10 днів
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default ExecutionParameters;
