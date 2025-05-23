/**
 * Компонент параметрів знижок замовлення
 *
 * Відповідає розділу 3.2 з документації Order Wizard:
 * - Тип знижки (вибір один):
 *   • Без знижки
 *   • Еверкард (10%)
 *   • Соцмережі (5%)
 *   • ЗСУ (10%)
 *   • Інше (з полем для вводу відсотка)
 * - Важливе обмеження (система повинна перевіряти автоматично):
 *   • Знижки не діють на прасування, прання і фарбування текстилю
 *   • Відображення попередження якщо вибрана знижка не може бути застосована
 *   • Автоматичне виключення неприйнятних категорій зі знижки
 */

'use client';

import {
  Discount,
  Warning,
  Info,
  CardMembership,
  Share,
  Security,
  Settings,
  Block,
  Delete,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import React from 'react';

import { useOrderParameters, DiscountType } from '@/domain/order';

/**
 * Props для DiscountParameters компонента
 */
interface DiscountParametersProps {
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
 * Компонент параметрів знижок замовлення
 */
export const DiscountParameters: React.FC<DiscountParametersProps> = ({
  disabled = false,
  compact = false,
}) => {
  // Отримуємо всю функціональність з domain layer
  const {
    discountParams,
    discountTypes,
    isDiscountValidForItems,
    setDiscountType,
    setDiscountPercentage,
    addDiscountExclusion,
    removeDiscountExclusion,
    validationErrors,
  } = useOrderParameters();

  /**
   * Обробник зміни типу знижки
   */
  const handleDiscountTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.target.value as DiscountType;
    setDiscountType(type);
  };

  /**
   * Обробник зміни відсотка знижки (для типу CUSTOM)
   */
  const handleDiscountPercentageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = Number(event.target.value);
    setDiscountPercentage(percentage);
  };

  /**
   * Отримання іконки для типу знижки
   */
  const getDiscountIcon = (type: DiscountType) => {
    switch (type) {
      case DiscountType.EVERCARD:
        return <CardMembership />;
      case DiscountType.SOCIAL_MEDIA:
        return <Share />;
      case DiscountType.MILITARY:
        return <Security />;
      case DiscountType.CUSTOM:
        return <Settings />;
      default:
        return <Discount />;
    }
  };

  /**
   * Отримання кольору для типу знижки
   */
  const getDiscountColor = (type: DiscountType) => {
    switch (type) {
      case DiscountType.EVERCARD:
        return 'primary';
      case DiscountType.SOCIAL_MEDIA:
        return 'secondary';
      case DiscountType.MILITARY:
        return 'success';
      case DiscountType.CUSTOM:
        return 'warning';
      default:
        return 'default';
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
            <Discount color="primary" />
            Знижки на замовлення
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Оберіть тип знижки, що застосовується до всього замовлення
          </Typography>
        </Box>
      )}

      {/* Варіанти знижок */}
      <FormControl component="fieldset" sx={{ mb: 3 }} disabled={disabled} fullWidth>
        <FormLabel component="legend" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Тип знижки
          </Typography>
        </FormLabel>

        <RadioGroup
          value={discountParams.discountType}
          onChange={handleDiscountTypeChange}
          sx={{ gap: 1 }}
        >
          {discountTypes.map((type) => (
            <Box key={type.value} sx={{ mb: 1 }}>
              <FormControlLabel
                value={type.value}
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getDiscountIcon(type.value)}
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {type.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Box>

                    {/* Chip з відсотком знижки */}
                    {type.percentage > 0 && (
                      <Chip
                        size="small"
                        label={`${type.percentage}%`}
                        color={getDiscountColor(type.value) as any}
                        variant={type.isDefault ? 'filled' : 'outlined'}
                      />
                    )}

                    {type.value === DiscountType.NONE && (
                      <Chip size="small" label="Без знижки" color="default" variant="outlined" />
                    )}
                  </Box>
                }
                sx={{
                  m: 0,
                  p: 1.5,
                  border: '1px solid',
                  borderColor:
                    discountParams.discountType === type.value ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  backgroundColor:
                    discountParams.discountType === type.value ? 'action.selected' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  width: '100%',
                }}
              />
            </Box>
          ))}
        </RadioGroup>

        {/* Помилка валідації типу знижки */}
        {validationErrors.discountType && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {validationErrors.discountType}
          </Alert>
        )}
      </FormControl>

      {/* Поле для індивідуального відсотка (тільки для CUSTOM) */}
      {discountParams.discountType === DiscountType.CUSTOM && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            type="number"
            label="Відсоток знижки"
            value={discountParams.discountPercentage}
            onChange={handleDiscountPercentageChange}
            disabled={disabled}
            inputProps={{
              min: 0,
              max: 100,
              step: 1,
            }}
            InputProps={{
              endAdornment: '%',
            }}
            helperText={
              validationErrors.discountPercentage || 'Введіть відсоток знижки від 0 до 100'
            }
            error={!!validationErrors.discountPercentage}
            sx={{ maxWidth: 200 }}
          />
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Попередження про застосування знижки */}
      {discountParams.discountType !== DiscountType.NONE && (
        <Box sx={{ mb: 3 }}>
          {isDiscountValidForItems ? (
            <Alert severity="success" icon={<Info />}>
              <Typography variant="body2">
                <strong>Знижка може бути застосована</strong> до поточного замовлення
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Знижка {discountParams.discountPercentage}% буде застосована до всіх підходящих
                послуг
              </Typography>
            </Alert>
          ) : (
            <Alert severity="warning" icon={<Warning />}>
              <Typography variant="body2">
                <strong>Знижка може бути застосована не до всіх послуг</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Знижки не діють на прасування, прання і фарбування текстилю
              </Typography>
            </Alert>
          )}
        </Box>
      )}

      {/* Список виключень зі знижки */}
      {discountParams.discountExclusions.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Виключення зі знижки:
          </Typography>

          <List dense>
            {discountParams.discountExclusions.map((exclusion, index) => (
              <ListItem
                key={`${exclusion}-${index}`}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeDiscountExclusion(exclusion)}
                    disabled={disabled}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                }
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <Block color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary={exclusion}
                  secondary="На цю категорію знижка не поширюється"
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Інформаційна секція про правила знижок */}
      {!compact && discountParams.discountType !== DiscountType.NONE && (
        <Alert severity="info" variant="outlined">
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Правила застосування знижок:</strong>
          </Typography>
          <Typography variant="caption" component="div">
            • Знижки не поширюються на послуги прасування
            <br />
            • Знижки не поширюються на послуги прання
            <br />
            • Знижки не поширюються на фарбування текстилю
            <br />
            • Знижки застосовуються після розрахунку всіх надбавок
            <br />• Максимальна знижка не може перевищувати 100%
          </Typography>
        </Alert>
      )}

      {/* Розрахунок економії */}
      {discountParams.discountType !== DiscountType.NONE &&
        discountParams.discountPercentage > 0 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="body2" color="success.dark" sx={{ fontWeight: 600 }}>
              Економія з урахуванням знижки: {discountParams.discountPercentage}%
            </Typography>
            <Typography variant="caption" color="success.dark">
              Точна сума економії буде розрахована після додавання всіх предметів
            </Typography>
          </Box>
        )}
    </Box>
  );
};
