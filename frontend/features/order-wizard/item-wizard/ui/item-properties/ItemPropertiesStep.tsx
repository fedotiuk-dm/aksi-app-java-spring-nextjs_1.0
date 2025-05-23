'use client';

import { Palette, Texture, LinearScale, LocalLaundryService } from '@mui/icons-material';
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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import React from 'react';

import { useItemWizard, MaterialType } from '@/domain/order';

import { StepContainer } from '../../../shared/ui/step-container';
import { StepNavigation } from '../../../shared/ui/step-navigation';

/**
 * Підкрок 2.2: Характеристики предмета
 *
 * Згідно з документацією Order Wizard:
 * - Матеріал (вибір залежить від категорії)
 * - Колір
 * - Наповнювач (для відповідних категорій)
 * - Ступінь зносу
 */
export const ItemPropertiesStep: React.FC = () => {
  // Отримуємо функціональність Item Wizard з domain layer
  const { itemData, validation, canProceed, updateProperties, wizard } = useItemWizard();

  // Матеріали згідно з документацією (залежать від категорії)
  const getMaterialsByCategory = (category: string): MaterialType[] => {
    const materialsByCategory: Record<string, MaterialType[]> = {
      CLEANING_TEXTILES: [
        MaterialType.COTTON,
        MaterialType.WOOL,
        MaterialType.SILK,
        MaterialType.SYNTHETIC,
      ],
      LAUNDRY: [MaterialType.COTTON, MaterialType.SYNTHETIC],
      IRONING: [MaterialType.COTTON, MaterialType.WOOL, MaterialType.SILK, MaterialType.SYNTHETIC],
      LEATHER_CLEANING: [
        MaterialType.LEATHER,
        MaterialType.NUBUCK,
        MaterialType.SPLIT_LEATHER,
        MaterialType.SUEDE,
      ],
      SHEEPSKIN_CLEANING: [MaterialType.LEATHER, MaterialType.SUEDE],
      FUR_CLEANING: [], // Для хутра матеріал не вибирається
      TEXTILE_DYEING: [
        MaterialType.COTTON,
        MaterialType.WOOL,
        MaterialType.SILK,
        MaterialType.SYNTHETIC,
      ],
    };

    return materialsByCategory[category] || [];
  };

  // Локалізовані назви матеріалів
  const materialLabels: Record<MaterialType, string> = {
    [MaterialType.COTTON]: 'Бавовна',
    [MaterialType.WOOL]: 'Шерсть',
    [MaterialType.SILK]: 'Шовк',
    [MaterialType.SYNTHETIC]: 'Синтетика',
    [MaterialType.LEATHER]: 'Гладка шкіра',
    [MaterialType.NUBUCK]: 'Нубук',
    [MaterialType.SPLIT_LEATHER]: 'Спілок',
    [MaterialType.SUEDE]: 'Замша',
  };

  // Базові кольори для швидкого вибору
  const baseColors = [
    'Білий',
    'Чорний',
    'Сірий',
    'Коричневий',
    'Синій',
    'Темно-синій',
    'Зелений',
    'Червоний',
    'Жовтий',
    'Помаранчевий',
    'Рожевий',
    'Фіолетовий',
    'Бежевий',
    'Кремовий',
  ];

  // Типи наповнювача
  const fillerTypes = [
    { value: 'down', label: 'Пух' },
    { value: 'synthetic', label: 'Синтепон' },
    { value: 'other', label: 'Інше' },
  ];

  // Ступені зносу
  const wearDegrees = [
    { value: '10', label: '10%' },
    { value: '30', label: '30%' },
    { value: '50', label: '50%' },
    { value: '75', label: '75%' },
  ];

  // Доступні матеріали для поточної категорії
  const availableMaterials = getMaterialsByCategory(itemData.category);

  // Перевірка чи потрібен наповнювач для категорії
  const needsFiller = ['CLEANING_TEXTILES', 'SHEEPSKIN_CLEANING', 'FUR_CLEANING'].includes(
    itemData.category
  );

  /**
   * Обробник зміни матеріалу
   */
  const handleMaterialChange = (event: SelectChangeEvent<string>) => {
    updateProperties({ material: event.target.value as MaterialType });
  };

  /**
   * Обробник зміни кольору
   */
  const handleColorChange = (event: React.SyntheticEvent, value: string | null) => {
    updateProperties({ color: value || '' });
  };

  /**
   * Обробник зміни кольору через текстове поле
   */
  const handleColorTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateProperties({ color: event.target.value });
  };

  /**
   * Обробник зміни типу наповнювача
   */
  const handleFillerTypeChange = (event: SelectChangeEvent<string>) => {
    updateProperties({ fillerType: event.target.value });
  };

  /**
   * Обробник зміни стану наповнювача
   */
  const handleFillerCompressedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateProperties({ fillerCompressed: event.target.checked });
  };

  /**
   * Обробник зміни ступеня зносу
   */
  const handleWearDegreeChange = (event: SelectChangeEvent<string>) => {
    updateProperties({ wearDegree: event.target.value });
  };

  /**
   * Обробник переходу до наступного підкроку
   */
  const handleNext = () => {
    if (canProceed) {
      const result = wizard.navigateForward();
      if (result.success) {
        console.log('Перехід до дефектів та плям');
      } else {
        console.error('Помилка переходу:', result.errors);
      }
    }
  };

  /**
   * Обробник повернення до попереднього підкроку
   */
  const handleBack = () => {
    const result = wizard.navigateBack();
    if (result.success) {
      console.log('Повернення до основної інформації');
    } else {
      console.error('Помилка повернення:', result.errors);
    }
  };

  return (
    <StepContainer
      title="Характеристики предмета"
      subtitle="Вкажіть матеріал, колір та інші важливі характеристики предмета"
    >
      <Box sx={{ minHeight: '400px' }}>
        {/* Матеріал */}
        {availableMaterials.length > 0 && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Texture color="primary" />
              Матеріал
            </Typography>

            <FormControl fullWidth error={!!validation.properties.errors.material} sx={{ mb: 2 }}>
              <InputLabel>Оберіть матеріал</InputLabel>
              <Select
                value={itemData.material || ''}
                onChange={handleMaterialChange}
                label="Оберіть матеріал"
              >
                {availableMaterials.map((material) => (
                  <MenuItem key={material} value={material}>
                    {materialLabels[material]}
                  </MenuItem>
                ))}
              </Select>
              {validation.properties.errors.material && (
                <FormHelperText>{validation.properties.errors.material}</FormHelperText>
              )}
            </FormControl>

            {itemData.material && (
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Обраний матеріал:</strong> {materialLabels[itemData.material]}
                </Typography>
              </Alert>
            )}
          </Paper>
        )}

        {/* Колір */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Palette color="primary" />
            Колір
          </Typography>

          <Grid container spacing={3}>
            {/* Швидкий вибір кольору */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                options={baseColors}
                value={itemData.color}
                onChange={handleColorChange}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Колір предмета"
                    placeholder="Оберіть або введіть колір"
                    error={!!validation.properties.errors.color}
                    helperText={
                      validation.properties.errors.color ||
                      'Оберіть зі списку або введіть власний колір'
                    }
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Palette />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Текстове поле для кольору */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Або введіть колір вручну"
                placeholder="Наприклад: темно-зелений"
                value={itemData.color}
                onChange={handleColorTextChange}
                error={!!validation.properties.errors.color}
                helperText="Опишіть колір максимально точно"
              />
            </Grid>
          </Grid>

          {itemData.color && (
            <Box sx={{ mt: 2 }}>
              <Chip label={`Колір: ${itemData.color}`} color="primary" variant="outlined" />
            </Box>
          )}
        </Paper>

        {/* Наповнювач (якщо потрібен) */}
        {needsFiller && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalLaundryService color="primary" />
              Наповнювач
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Тип наповнювача</InputLabel>
                  <Select
                    value={itemData.fillerType || ''}
                    onChange={handleFillerTypeChange}
                    label="Тип наповнювача"
                  >
                    <MenuItem value="">
                      <em>Наповнювач відсутній</em>
                    </MenuItem>
                    {fillerTypes.map((filler) => (
                      <MenuItem key={filler.value} value={filler.value}>
                        {filler.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {itemData.fillerType && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={itemData.fillerCompressed}
                        onChange={handleFillerCompressedChange}
                      />
                    }
                    label="Збитий наповнювач"
                  />
                </Grid>
              )}
            </Grid>

            {itemData.fillerType && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Наповнювач:</strong>{' '}
                  {fillerTypes.find((f) => f.value === itemData.fillerType)?.label}
                  {itemData.fillerCompressed && ' (збитий)'}
                </Typography>
              </Alert>
            )}
          </Paper>
        )}

        {/* Ступінь зносу */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearScale color="primary" />
            Ступінь зносу
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Оберіть ступінь зносу</InputLabel>
            <Select
              value={itemData.wearDegree || ''}
              onChange={handleWearDegreeChange}
              label="Оберіть ступінь зносу"
            >
              <MenuItem value="">
                <em>Не вказано</em>
              </MenuItem>
              {wearDegrees.map((degree) => (
                <MenuItem key={degree.value} value={degree.value}>
                  {degree.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Виберіть приблизний відсоток зносу предмета</FormHelperText>
          </FormControl>

          {itemData.wearDegree && (
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Ступінь зносу:</strong> {itemData.wearDegree}%
              </Typography>
            </Alert>
          )}
        </Paper>

        {/* Підсумок характеристик */}
        {(itemData.material || itemData.color) && (
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Характеристики предмета:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {itemData.material && (
                <Chip
                  label={`Матеріал: ${materialLabels[itemData.material]}`}
                  variant="outlined"
                  size="small"
                />
              )}
              {itemData.color && (
                <Chip label={`Колір: ${itemData.color}`} variant="outlined" size="small" />
              )}
              {itemData.fillerType && (
                <Chip
                  label={`Наповнювач: ${
                    fillerTypes.find((f) => f.value === itemData.fillerType)?.label
                  }`}
                  variant="outlined"
                  size="small"
                />
              )}
              {itemData.wearDegree && (
                <Chip label={`Знос: ${itemData.wearDegree}%`} variant="outlined" size="small" />
              )}
            </Box>
          </Paper>
        )}
      </Box>

      <StepNavigation
        onNext={canProceed ? handleNext : undefined}
        onBack={handleBack}
        nextLabel="Продовжити до дефектів"
        backLabel="Назад до основної інформації"
        isNextDisabled={!canProceed}
      />
    </StepContainer>
  );
};

export default ItemPropertiesStep;
