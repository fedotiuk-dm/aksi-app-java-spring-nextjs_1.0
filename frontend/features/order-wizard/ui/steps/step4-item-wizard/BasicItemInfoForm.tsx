/**
 * Форма з базовою інформацією про предмет замовлення (Підетап 2.1)
 * Дозволяє вибрати категорію послуги, найменування виробу та одиницю виміру з кількістю
 */
import React, { FC } from 'react';
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
  // Хук для роботи з формою
  const {
    control,
    setValue,
    errors,
    isValid,
    handleFormSubmit,
    categoryId,
    priceListItemId,
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
    categoryId,
    priceListItemId,
    // Створюємо адаптер для setValue щоб узгодити типи
    setValue: (name, value) => {
      // @ts-ignore - розбіжність типів між React Hook Form і кастомним хуком
      setValue(name, value);
    },
  });

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
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
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
                  >
                    {priceListItems.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
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

          {/* Кнопки дій */}
          <Grid size={{ xs: 12 }} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid || isSubmitting}
              sx={{ position: 'relative' }}
            >
              {isSubmitting ? 'Завантаження...' : 'Продовжити'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
