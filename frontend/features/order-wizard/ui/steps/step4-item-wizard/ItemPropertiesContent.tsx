/**
 * Контент форми з характеристиками предмета замовлення (Підетап 2.2)
 * Містить фактичні поля форми для матеріалу, кольору, наповнювача, ступеня зносу
 */
import React, { FC, useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

// Імпорт типів
import { 
  ColorDto, 
  WearDegreeDto,
  MaterialDto,
  FillingDto 
} from '@/lib/api';

// Імпорт хуків та типів
import { UseItemPropertiesFormReturn } from '@/features/order-wizard/hooks/useItemPropertiesForm';

// Інтерфейс для пропсів компонента
interface ItemPropertiesContentProps {
  formProps: UseItemPropertiesFormReturn;
  colorsData: ColorDto[];
  wearDegreesData: WearDegreeDto[];
  materialsData: MaterialDto[];
  needsFilling: boolean;
  fillingsData: FillingDto[];
  onBack: () => void;
  isSubmitting: boolean;
}

/**
 * Компонент контенту форми характеристик предмета
 * Розбитий на логічні секції для кращого UX
 */
export const ItemPropertiesContent: FC<ItemPropertiesContentProps> = ({
  formProps,
  colorsData,
  wearDegreesData,
  materialsData,
  needsFilling,
  fillingsData,
  onBack,
  isSubmitting,
}) => {
  // Розпаковуємо пропси форми
  const {
    control,
    errors,
    handleFormSubmit,
    watch,
    setValue,
    trigger,
    getValues,
  } = formProps;

  // Отримуємо поточні значення для умовного рендерингу
  const colorValue = watch('color');
  const materialValue = watch('materialType');
  const fillingValue = watch('filling');
  const wearDegreeValue = watch('wearDegree');
  const showCustomColorField = colorValue === 'custom';
  
  // Стан валідності форми
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Оновлюємо стан валідності форми при зміні значень
  useEffect(() => {
    // Перевірка необхідних полів
    const hasMaterial = !!materialValue;
    const hasColor = !!colorValue;
    const hasCustomColor = colorValue === 'custom' ? !!watch('customColor') : true;
    const hasFilling = needsFilling ? !!fillingValue : true;
    const hasWearDegree = !!wearDegreeValue;
    
    // Для дебагу
    console.log('Валідаційний стан форми:', {
      hasMaterial,
      hasColor,
      hasCustomColor,
      hasFilling,
      hasWearDegree,
      isFormValid: hasMaterial && hasColor && hasCustomColor && hasFilling && hasWearDegree
    });
    
    // Встановлюємо стан валідності
    setIsFormValid(hasMaterial && hasColor && hasCustomColor && hasFilling && hasWearDegree);
    
    // Запускаємо валідацію полів
    trigger();
  }, [materialValue, colorValue, fillingValue, wearDegreeValue, watch, trigger, needsFilling]);

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Характеристики предмета
      </Typography>
      
      <form onSubmit={handleFormSubmit}>
        {/* Секція матеріалів */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Матеріал
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="materialType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.materialType}>
                      <InputLabel id="material-label">Тип матеріалу</InputLabel>
                      <Select
                        {...field}
                        labelId="material-label"
                        label="Тип матеріалу"
                        onChange={(e) => {
                          if (e.target.value) {
                            setValue('materialType', e.target.value, { 
                              shouldValidate: true, 
                              shouldDirty: true,
                              shouldTouch: true 
                            });
                            trigger();
                          }
                        }}
                      >
                        {materialsData.map((material) => (
                          <MenuItem key={material.id} value={material.id || ''}>
                            {material.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.materialType && (
                        <FormHelperText>{errors.materialType.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        {/* Секція кольорів */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Колір
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <FormControl component="fieldset" error={!!errors.color} fullWidth>
                      <RadioGroup
                        {...field}
                        aria-label="color"
                        sx={{ 
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: 'repeat(2, 1fr)',
                            sm: 'repeat(3, 1fr)',
                            md: 'repeat(4, 1fr)',
                          },
                          gap: 1,
                        }}
                        onChange={(e) => {
                          setValue('color', e.target.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true
                          });
                          
                          if (e.target.value !== 'custom') {
                            setValue('customColor', '', { shouldValidate: true });
                          }
                          
                          trigger();
                        }}
                      >
                        {colorsData.map((color) => (
                          <FormControlLabel
                            key={color.id}
                            value={color.id || ''}
                            control={
                              <Radio 
                                sx={{
                                  '& .MuiSvgIcon-root': {
                                    color: color.hex || '#CCCCCC',
                                    border: (!color.hex || color.hex === '#FFFFFF') ? '1px solid #ccc' : 'none',
                                  }
                                }}
                              />
                            }
                            label={color.name}
                          />
                        ))}
                        <FormControlLabel
                          value="custom"
                          control={<Radio />}
                          label="Інший (вказати)"
                        />
                      </RadioGroup>
                      {errors.color && (
                        <FormHelperText>{errors.color.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              
              {/* Додаткове поле для кастомного кольору */}
              {showCustomColorField && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="customColor"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Вкажіть колір"
                        fullWidth
                        error={!!errors.customColor}
                        helperText={errors.customColor?.message}
                        onChange={(e) => {
                          setValue('customColor', e.target.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true
                          });
                          trigger();
                        }}
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
        
        {/* Секція ступеня зносу */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Ступінь зносу
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="wearDegree"
                  control={control}
                  render={({ field }) => (
                    <FormControl component="fieldset" error={!!errors.wearDegree} fullWidth>
                      <RadioGroup
                        {...field}
                        aria-label="wearDegree"
                        value={field.value?.toString() || '10'}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          setValue('wearDegree', value, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true
                          });
                          trigger();
                        }}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(2, 1fr)',
                          },
                          gap: 1,
                        }}
                      >
                        {wearDegreesData.map((degree) => (
                          <FormControlLabel
                            key={degree.id}
                            value={degree.id?.toString() || ''}
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="body1">
                                  {degree.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {degree.description}
                                </Typography>
                              </Box>
                            }
                          />
                        ))}
                      </RadioGroup>
                      {errors.wearDegree && (
                        <FormHelperText>{errors.wearDegree.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        {/* Секція наповнювача (якщо потрібен) */}
        {needsFilling && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Наповнювач
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="filling"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.filling}>
                        <InputLabel id="filling-label">Тип наповнювача</InputLabel>
                        <Select
                          {...field}
                          labelId="filling-label"
                          label="Тип наповнювача"
                          onChange={(e) => {
                            if (e.target.value) {
                              setValue('filling', e.target.value, {
                                shouldValidate: true,
                                shouldDirty: true,
                                shouldTouch: true
                              });
                              trigger();
                            }
                          }}
                        >
                          {fillingsData.map((filling) => (
                            <MenuItem key={filling.id} value={filling.id || ''}>
                              {filling.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.filling && (
                          <FormHelperText>{errors.filling.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="isFillingFlattened"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value === true}
                            onChange={(e) => {
                              setValue('isFillingFlattened', e.target.checked);
                            }}
                          />
                        }
                        label="Збитий наповнювач"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {/* Дебаг-інформація */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {`Заповнено: ${isFormValid ? 'Так' : 'Ні'} | 
          Матеріал: ${materialValue || 'не вибрано'} | 
          Колір: ${colorValue || 'не вибрано'} | 
          Знос: ${wearDegreeValue || 'не вибрано'}`}
          {needsFilling ? ` | Наповнювач: ${fillingValue || 'не вибрано'}` : ''}
        </Typography>
        
        {/* Кнопки форми */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={onBack}
          >
            Назад
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormValid || isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              console.log('Відправка форми:', getValues());
              handleFormSubmit();
            }}
          >
            {isSubmitting ? 'Обробка...' : 'Продовжити'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};


