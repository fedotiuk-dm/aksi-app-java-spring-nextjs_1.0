/**
 * Форма з базовою інформацією про предмет замовлення (Підетап 2.1)
 * Дозволяє вибрати категорію послуги, найменування виробу та одиницю виміру з кількістю
 */
import React, { FC, useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Button,
} from '@mui/material';

// Імпорт хуків
import { useBasicItemForm, BasicItemFormValues } from '@/features/order-wizard/hooks/useBasicItemForm';
import { useItemFormLogic } from '@/features/order-wizard/hooks/useItemFormLogic';

export interface BasicItemInfoFormProps {
  initialValues?: Partial<BasicItemFormValues>;
  onSubmit: (values: BasicItemFormValues) => void;
  isSubmitting?: boolean;
}

/**
 * Форма з базовою інформацією про предмет замовлення
 */
export const BasicItemInfoForm: FC<BasicItemInfoFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
}) => {
  // Додаємо стан для відслідковування валідності форми
  const [isFormValid, setIsFormValid] = useState(false);
  // Хук для роботи з формою
  const {
    control,
    setValue,
    errors,
    handleFormSubmit,
    watch,
    getValues,
    trigger
  } = useBasicItemForm({
    initialValues,
    onSubmit,
  });

  // Хук для роботи з елементами прайс-листа
  const {
    categories,
    priceListItems,
    categoriesLoading,
    itemsLoading,
    itemUnitOfMeasurement,
  } = useItemFormLogic({
    categoryId: watch('categoryId'),
    priceListItemId: watch('priceListItemId'),
    // Створюємо адаптер для setValue щоб узгодити типи
    setValue: (name, value) => {
      // @ts-ignore - розбіжність типів між React Hook Form і кастомним хуком
      setValue(name, value);
    },
  });

  // Спостерігаємо за зміною поля категорії та найменування
  const categoryId = watch('categoryId');
  const itemId = watch('priceListItemId');
  
  // Оновлюємо стан валідності форми при зміні основних полів
  useEffect(() => {
    // Перевіряємо два основних поля
    const hasCategory = !!categoryId;
    const hasItem = !!itemId;
    const hasQuantity = !!watch('quantity');
    const formValid = hasCategory && hasItem && hasQuantity;
    
    console.log('Form validation status:', { hasCategory, hasItem, hasQuantity, formValid });
    console.log('Current values:', { categoryId, itemId, quantity: watch('quantity') });
    
    // Оновлюємо стан валідності
    setIsFormValid(formValid);
    
    // Викликаємо валідацію форми для оновлення стану помилок
    trigger();
  }, [categoryId, itemId, watch, trigger]);

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Базова інформація про предмет
      </Typography>

      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={3}>
          {/* Категорія послуги */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.categoryId}>
                  <InputLabel id="category-label">Категорія</InputLabel>
                  <Select
                    {...field}
                    labelId="category-label"
                    label="Категорія"
                    disabled={categoriesLoading}
                    MenuProps={{
                      style: { maxHeight: 300 },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                    }}
                  >
                    {categoriesLoading ? (
                      <MenuItem disabled value="">
                        Завантаження категорій...
                      </MenuItem>
                    ) : categories.length === 0 ? (
                      <MenuItem disabled value="">
                        Немає доступних категорій
                      </MenuItem>
                    ) : (
                      categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {errors.categoryId && (
                    <FormHelperText>{errors.categoryId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Назва/найменування предмета */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="priceListItemId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.priceListItemId}>
                  <InputLabel id="item-name-label">Найменування</InputLabel>
                  <Select
                    {...field}
                    labelId="item-name-label"
                    label="Найменування"
                    disabled={!categoryId || itemsLoading}
                    MenuProps={{ 
                      // Налаштування для кращої роботи випадаючого списку
                      style: { maxHeight: 300 },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                    }}
                  >
                    {priceListItems.length === 0 ? (
                      <MenuItem disabled value="">
                        {itemsLoading ? 'Завантаження...' : 'Немає доступних предметів'}
                      </MenuItem>
                    ) : (
                      priceListItems.map((item) => (
                        <MenuItem 
                          key={item.id} 
                          value={item.id}
                          onClick={() => {
                            // Явно встановлюємо значення при кліку
                            if (item.id) {
                              setValue('priceListItemId', item.id, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                            }
                            // Запускаємо валідацію всіх полів
                            trigger();
                            console.log('Item selected:', item.id, item.name);
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <Typography variant="body1">{item.name}</Typography>
                            <Typography variant="body2" color="primary.main" fontWeight="bold">
                              {item.basePrice ? `${item.basePrice} ₴` : ''}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {errors.priceListItemId && (
                    <FormHelperText>{errors.priceListItemId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Кількість */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.quantity}>
                  <TextField
                    {...field}
                    label="Кількість"
                    type="number"
                    inputProps={{ min: 0.1, step: 0.1 }}
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                  />
                </FormControl>
              )}
            />
          </Grid>

          {/* Одиниця виміру */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, height: '100%' }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Одиниця виміру
              </Typography>
              <Typography variant="body1">
                {itemUnitOfMeasurement === 'PIECE' ? 'Штука' : 'Кілограм'}
              </Typography>
            </Box>
          </Grid>

          {/* Опис (необов'язковий) */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name="defectNotes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Опис або примітки"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.defectNotes}
                  helperText={errors.defectNotes?.message}
                />
              )}
            />
          </Grid>

          {/* Прихований input для імені */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />

          {/* Дебаг-інформація */}
          <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Стан форми: {isFormValid ? 'валідна' : 'невалідна'} | 
              Категорія: {categoryId || 'не вибрана'} | 
              Предмет: {itemId || 'не вибраний'}
            </Typography>
          </Grid>
          
          {/* Кнопка відправки форми */}
          <Grid size={{ xs: 12 }} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            {isFormValid ? (
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={isSubmitting}
                onClick={() => {
                  console.log('Submit button clicked with values:', getValues());
                  handleFormSubmit();
                }}
              >
                Продовжити (активна)
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                disabled
              >
                Продовжити (неактивна)
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
