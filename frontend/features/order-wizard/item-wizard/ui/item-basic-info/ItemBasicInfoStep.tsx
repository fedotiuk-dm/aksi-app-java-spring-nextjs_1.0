'use client';

import { Info, Category, ShoppingCart, Euro, Scale, LocalOffer } from '@mui/icons-material';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Paper,
  Alert,
  Chip,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import React from 'react';

import { useItemWizard } from '@/domain/order';

import { StepContainer } from '../../../shared/ui/step-container';
import { StepNavigation } from '../../../shared/ui/step-navigation';

/**
 * Підкрок 2.1: Основна інформація про предмет
 *
 * Згідно з документацією Order Wizard:
 * - Категорія послуги (вибір)
 * - Найменування виробу (динамічний список цін на основі вибраної категорії)
 * - Одиниця виміру і кількість
 */
export const ItemBasicInfoStep: React.FC = () => {
  // Отримуємо функціональність Item Wizard з domain layer
  const { itemData, validation, canProceed, updateBasicInfo, wizard } = useItemWizard();

  // Категорії послуг згідно з документацією
  const serviceCategories = [
    {
      value: 'CLEANING_TEXTILES',
      label: 'Чистка одягу та текстилю',
      unitOfMeasure: 'шт',
      description: 'Хімчистка одягу, костюмів, пальт та інших текстильних виробів',
    },
    {
      value: 'LAUNDRY',
      label: 'Прання білизни',
      unitOfMeasure: 'кг',
      description: 'Прання постільної білизни, рушників, спортивного одягу',
    },
    {
      value: 'IRONING',
      label: 'Прасування',
      unitOfMeasure: 'шт',
      description: 'Прасування сорочок, брюк, блузок та інших речей',
    },
    {
      value: 'LEATHER_CLEANING',
      label: 'Чистка та відновлення шкіряних виробів',
      unitOfMeasure: 'шт',
      description: 'Чистка шкіряних курток, сумок, взуття',
    },
    {
      value: 'SHEEPSKIN_CLEANING',
      label: 'Дублянки',
      unitOfMeasure: 'шт',
      description: 'Чистка та відновлення дублянок',
    },
    {
      value: 'FUR_CLEANING',
      label: 'Вироби із натурального хутра',
      unitOfMeasure: 'шт',
      description: 'Чистка хутряних виробів, шуб, комірів',
    },
    {
      value: 'TEXTILE_DYEING',
      label: 'Фарбування текстильних виробів',
      unitOfMeasure: 'шт',
      description: 'Фарбування одягу та текстильних виробів',
    },
  ];

  // Мок списку найменувань - TODO: замінити на реальні дані з API
  const getItemNames = (category: string) => {
    const itemsByCategory: Record<string, string[]> = {
      CLEANING_TEXTILES: [
        'Костюм чоловічий',
        'Костюм жіночий',
        'Пальто',
        'Куртка',
        'Плаття',
        'Спідниця',
        'Блузка',
        'Сорочка',
        'Краватка',
        'Піджак',
      ],
      LAUNDRY: [
        'Постільна білизна (комплект)',
        'Простирадло',
        'Подушка',
        'Ковдра',
        'Рушник',
        'Спортивний одяг',
        'Футболка',
        'Джинси',
      ],
      IRONING: ['Сорочка чоловіча', 'Блузка жіноча', 'Брюки', 'Спідниця', 'Плаття', 'Піджак'],
      LEATHER_CLEANING: [
        'Куртка шкіряна',
        'Пальто шкіряне',
        'Сумка',
        'Ремінь',
        'Рукавички',
        'Взуття',
      ],
      SHEEPSKIN_CLEANING: ['Дублянка', 'Жилет з дублянки', 'Куртка дублянка'],
      FUR_CLEANING: [
        'Шуба',
        'Жилет хутряний',
        'Комір хутряний',
        'Манжети хутряні',
        'Шапка хутряна',
      ],
      TEXTILE_DYEING: ['Сукня', 'Блузка', 'Сорочка', 'Футболка', 'Джинси', 'Спідниця'],
    };

    return itemsByCategory[category] || [];
  };

  /**
   * Обробник зміни категорії
   */
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const category = event.target.value;
    const selectedCategory = serviceCategories.find((cat) => cat.value === category);

    updateBasicInfo({
      category,
      unitOfMeasure: selectedCategory?.unitOfMeasure || 'шт',
      name: '', // Очищуємо назву при зміні категорії
      unitPrice: 0, // Очищуємо ціну
    });
  };

  /**
   * Обробник зміни найменування
   */
  const handleItemNameChange = (event: React.SyntheticEvent, value: string | null) => {
    updateBasicInfo({
      name: value || '',
      // TODO: Завантажити ціну з прайсу
      unitPrice: value ? 150 : 0, // Мок ціна
    });
  };

  /**
   * Обробник зміни кількості
   */
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = Number(event.target.value);
    updateBasicInfo({ quantity });
  };

  /**
   * Обробник зміни ціни
   */
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const unitPrice = Number(event.target.value);
    updateBasicInfo({ unitPrice });
  };

  /**
   * Обробник зміни опису
   */
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateBasicInfo({ description: event.target.value });
  };

  /**
   * Обробник переходу до наступного підкроку
   */
  const handleNext = () => {
    if (canProceed) {
      const result = wizard.navigateForward();
      if (result.success) {
        console.log('Перехід до характеристик предмета');
      } else {
        console.error('Помилка переходу:', result.errors);
      }
    }
  };

  /**
   * Обробник повернення до попереднього кроку/виходу з підвізарда
   */
  const handleBack = () => {
    // Для першого кроку Item Wizard виходимо з підвізарда
    const result = wizard.finishItemWizardFlow(false);
    if (result.success) {
      console.log('Вихід з Item Wizard без збереження');
    } else {
      console.error('Помилка виходу з підвізарда:', result.error);
    }
  };

  // Отримуємо список найменувань для обраної категорії
  const availableItemNames = itemData.category ? getItemNames(itemData.category) : [];

  // Обрана категорія
  const selectedCategory = serviceCategories.find((cat) => cat.value === itemData.category);

  return (
    <StepContainer
      title="Основна інформація про предмет"
      subtitle="Оберіть категорію послуги та вкажіть базові характеристики предмета"
    >
      <Box sx={{ minHeight: '400px' }}>
        {/* Категорія послуги */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Category color="primary" />
            Категорія послуги
          </Typography>

          <FormControl fullWidth error={!!validation.basicInfo.errors.category} sx={{ mb: 2 }}>
            <InputLabel>Оберіть категорію послуги</InputLabel>
            <Select
              value={itemData.category}
              onChange={handleCategoryChange}
              label="Оберіть категорію послуги"
            >
              {serviceCategories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  <Box>
                    <Typography variant="body1">{category.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {validation.basicInfo.errors.category && (
              <FormHelperText>{validation.basicInfo.errors.category}</FormHelperText>
            )}
          </FormControl>

          {/* Інформація про обрану категорію */}
          {selectedCategory && (
            <Alert severity="info" sx={{ mt: 1 }}>
              <Typography variant="body2">
                <strong>Обрана категорія:</strong> {selectedCategory.label}
              </Typography>
              <Typography variant="caption">
                Одиниця виміру: <Chip size="small" label={selectedCategory.unitOfMeasure} />
              </Typography>
            </Alert>
          )}
        </Paper>

        {/* Найменування та характеристики */}
        {itemData.category && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalOffer color="primary" />
              Найменування та параметри
            </Typography>

            <Grid container spacing={3}>
              {/* Найменування виробу */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  options={availableItemNames}
                  value={itemData.name}
                  onChange={handleItemNameChange}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Найменування виробу"
                      placeholder="Оберіть або введіть найменування"
                      error={!!validation.basicInfo.errors.name}
                      helperText={
                        validation.basicInfo.errors.name ||
                        'Оберіть зі списку або введіть власне найменування'
                      }
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <ShoppingCart />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Кількість */}
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Кількість"
                  value={itemData.quantity}
                  onChange={handleQuantityChange}
                  error={!!validation.basicInfo.errors.quantity}
                  helperText={validation.basicInfo.errors.quantity}
                  inputProps={{ min: 1, max: 999, step: itemData.unitOfMeasure === 'кг' ? 0.1 : 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Scale />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">{itemData.unitOfMeasure}</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Ціна за одиницю */}
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Ціна за одиницю"
                  value={itemData.unitPrice}
                  onChange={handlePriceChange}
                  error={!!validation.basicInfo.errors.unitPrice}
                  helperText={validation.basicInfo.errors.unitPrice || 'Базова ціна з прайсу'}
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Euro />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">грн</InputAdornment>,
                  }}
                />
              </Grid>

              {/* Опис (додатково) */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Додатковий опис (необов'язково)"
                  placeholder="Додайте специфічні деталі про предмет..."
                  value={itemData.description}
                  onChange={handleDescriptionChange}
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Info />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Підсумок */}
        {itemData.name && (
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Підсумок:
            </Typography>
            <Typography variant="body2">
              <strong>{itemData.name}</strong> • {itemData.quantity} {itemData.unitOfMeasure} •{' '}
              {itemData.unitPrice.toFixed(2)} грн/{itemData.unitOfMeasure}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Орієнтовна вартість: {(itemData.quantity * itemData.unitPrice).toFixed(2)} грн
            </Typography>
          </Paper>
        )}
      </Box>

      <StepNavigation
        onNext={canProceed ? handleNext : undefined}
        onBack={handleBack}
        nextLabel="Продовжити до характеристик"
        backLabel="Назад до менеджера"
        isNextDisabled={!canProceed}
      />
    </StepContainer>
  );
};

export default ItemBasicInfoStep;
