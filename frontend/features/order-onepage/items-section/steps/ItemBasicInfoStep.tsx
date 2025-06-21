'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useOrderOnepageStore } from '../../store/order-onepage.store';
import {
  useSubstep1GetServiceCategories,
  useSubstep1GetItemsForCategory,
  useSubstep1SelectServiceCategory,
  useSubstep1SelectPriceListItem,
  useSubstep1EnterQuantity,
} from '@/shared/api/generated/substep1';
import { z } from 'zod';

// Схема для валідації форми
const serviceCategorySelectionSchema = z.object({
  categoryId: z.string().min(1, 'Оберіть категорію послуги'),
  itemId: z.string().min(1, 'Оберіть найменування виробу'),
  quantity: z.number().min(0.1, 'Кількість повинна бути більше 0'),
  unit: z.string().min(1, 'Оберіть одиницю виміру'),
});

type ServiceCategorySelectionData = z.infer<typeof serviceCategorySelectionSchema>;

interface ItemBasicInfoStepProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
}

export const ItemBasicInfoStep = ({ data, onDataChange, onNext }: ItemBasicInfoStepProps) => {
  const { sessionId } = useOrderOnepageStore();

  // API хуки
  const { data: categoriesData } = useSubstep1GetServiceCategories({
    query: { enabled: !!sessionId },
  });

  const { data: itemsData } = useSubstep1GetItemsForCategory(data.categoryId || '', {
    query: { enabled: !!sessionId && !!data.categoryId },
  });

  const selectCategory = useSubstep1SelectServiceCategory();
  const selectItem = useSubstep1SelectPriceListItem();
  const enterQuantity = useSubstep1EnterQuantity();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<ServiceCategorySelectionData>({
    resolver: zodResolver(serviceCategorySelectionSchema),
    defaultValues: {
      categoryId: data.categoryId ?? '',
      itemId: data.itemId ?? '',
      quantity: data.quantity ?? 1,
      unit: data.unit ?? 'шт',
    },
    mode: 'onChange',
  });

  const watchedCategoryId = watch('categoryId');
  const watchedItemId = watch('itemId');

  // Вибір категорії
  useEffect(() => {
    if (watchedCategoryId && watchedCategoryId !== data.categoryId && sessionId) {
      selectCategory.mutate({
        sessionId,
        params: { categoryId: watchedCategoryId },
      });
      onDataChange({ categoryId: watchedCategoryId, itemId: '', quantity: 1 });
      setValue('itemId', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedCategoryId, sessionId, data.categoryId]);

  // Вибір предмета
  useEffect(() => {
    if (watchedItemId && watchedItemId !== data.itemId && sessionId) {
      const items = itemsData || [];
      const selectedItem = items.find((item) => item.id === watchedItemId);
      if (selectedItem) {
        selectItem.mutate({
          sessionId,
          params: { itemId: watchedItemId },
        });
        onDataChange({
          itemId: watchedItemId,
          itemName: selectedItem.name,
          basePrice: selectedItem.basePrice,
          unit: selectedItem.unitOfMeasure,
        });
        setValue('unit', selectedItem.unitOfMeasure || 'шт');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedItemId, sessionId, data.itemId, itemsData]);

  const onSubmit = async (formData: ServiceCategorySelectionData) => {
    if (!sessionId) return;

    try {
      // Відправляємо кількість
      await enterQuantity.mutateAsync({
        sessionId,
        params: {
          quantity: formData.quantity,
        },
      });

      onDataChange(formData);
      onNext();
    } catch (error) {
      console.error('Помилка збереження основної інформації:', error);
    }
  };

  const categories = categoriesData ?? [];
  const items = itemsData || [];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Основна інформація про предмет
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {/* Категорія послуги */}
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.categoryId}>
                <InputLabel>Категорія послуги *</InputLabel>
                <Select {...field} label="Категорія послуги *">
                  {categories.map(
                    (category) =>
                      category?.id && (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      )
                  )}
                </Select>
                {errors.categoryId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.categoryId.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          {/* Найменування виробу */}
          {watchedCategoryId && (
            <Controller
              name="itemId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.itemId}>
                  <InputLabel>Найменування виробу *</InputLabel>
                  <Select {...field} label="Найменування виробу *">
                    {items.map(
                      (item) =>
                        item?.id && (
                          <MenuItem key={item.id} value={item.id}>
                            <Box>
                              <Typography variant="body2">{item.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.basePrice} ₴ за {item.unitOfMeasure}
                              </Typography>
                            </Box>
                          </MenuItem>
                        )
                    )}
                  </Select>
                  {errors.itemId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {errors.itemId.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          )}

          {/* Кількість та одиниця виміру */}
          {watchedItemId && (
            <Stack direction="row" spacing={2}>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Кількість *"
                    type="number"
                    inputProps={{ min: 0.1, step: 0.1 }}
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                    sx={{ flex: 1 }}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />

              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Одиниця</InputLabel>
                    <Select {...field} label="Одиниця">
                      <MenuItem value="шт">шт</MenuItem>
                      <MenuItem value="кг">кг</MenuItem>
                      <MenuItem value="м²">м²</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Stack>
          )}

          {/* Кнопка далі */}
          <Button
            type="submit"
            variant="contained"
            endIcon={<ArrowForward />}
            disabled={
              !isValid ||
              selectCategory.isPending ||
              selectItem.isPending ||
              enterQuantity.isPending
            }
            fullWidth
            sx={{ mt: 3 }}
          >
            {enterQuantity.isPending ? 'Збереження...' : 'Далі'}
          </Button>

          {/* Помилки */}
          {(selectCategory.error || selectItem.error || enterQuantity.error) && (
            <Alert severity="error">
              Помилка:{' '}
              {selectCategory.error?.message ??
                selectItem.error?.message ??
                enterQuantity.error?.message}
            </Alert>
          )}
        </Stack>
      </form>
    </Box>
  );
};
