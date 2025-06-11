'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
} from '@mui/material';
import React from 'react';

import {
  useGetAllActiveCategories,
  useGetItemsByCategory,
} from '@/shared/api/generated/full/aksiApi';

import type { ServiceCategoryDTO, PriceListItemDTO } from '@/lib/api/generated';

/**
 * Підетап 2.1: Основна інформація про предмет
 *
 * Відповідальність:
 * - Вибір категорії послуги
 * - Вибір найменування виробу (залежить від категорії)
 * - Введення кількості та одиниці виміру
 */
interface BasicItemInfoData {
  categoryId: string;
  itemId: string;
  quantity: number;
  unitOfMeasure: string;
}

interface BasicItemInfoStepProps {
  data: BasicItemInfoData;
  onChange: (data: Partial<BasicItemInfoData>) => void;
  errors?: Record<string, string>;
}

export const BasicItemInfoStep: React.FC<BasicItemInfoStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  // Отримуємо список активних категорій
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useGetAllActiveCategories();

  // Отримуємо предмети для вибраної категорії
  const {
    data: items = [],
    isLoading: isLoadingItems,
    error: itemsError,
  } = useGetItemsByCategory(data.categoryId, {
    query: {
      enabled: !!data.categoryId,
    },
  });

  // Знаходимо вибрану категорію для отримання одиниці виміру
  const selectedCategory = (categories as ServiceCategoryDTO[]).find(
    (cat: ServiceCategoryDTO) => cat.id === data.categoryId
  );
  const selectedItem = (items as PriceListItemDTO[]).find(
    (item: PriceListItemDTO) => item.id === data.itemId
  );

  // Обробник зміни категорії
  const handleCategoryChange = (categoryId: string) => {
    onChange({
      categoryId,
      itemId: '', // Скидаємо вибраний предмет при зміні категорії
      unitOfMeasure: '', // Скидаємо одиницю виміру
    });
  };

  // Обробник зміни предмета
  const handleItemChange = (itemId: string) => {
    const item = (items as PriceListItemDTO[]).find((i: PriceListItemDTO) => i.id === itemId);
    onChange({
      itemId,
      unitOfMeasure: item?.unitOfMeasure || '',
    });
  };

  // Обробник зміни кількості
  const handleQuantityChange = (quantity: string) => {
    const numericValue = parseFloat(quantity);
    if (!isNaN(numericValue) && numericValue > 0) {
      onChange({ quantity: numericValue });
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Підетап 2.1: Основна інформація про предмет
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Оберіть категорію послуги, найменування виробу та вкажіть кількість
        </Typography>

        <Grid container spacing={3}>
          {/* Категорія послуги */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth error={!!errors.categoryId}>
              <InputLabel>Категорія послуги</InputLabel>
              <Select
                value={data.categoryId}
                label="Категорія послуги"
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={isLoadingCategories}
              >
                {isLoadingCategories && (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Завантаження категорій...
                  </MenuItem>
                )}
                {(categories as ServiceCategoryDTO[]).map((category: ServiceCategoryDTO) => (
                  <MenuItem key={category.id} value={category.id || ''}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
            </FormControl>

            {categoriesError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                Помилка завантаження категорій. Перевірте з&apos;єднання з інтернетом.
              </Alert>
            )}
          </Grid>

          {/* Найменування виробу */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth error={!!errors.itemId}>
              <InputLabel>Найменування виробу</InputLabel>
              <Select
                value={data.itemId}
                label="Найменування виробу"
                onChange={(e) => handleItemChange(e.target.value)}
                disabled={!data.categoryId || isLoadingItems}
              >
                {!data.categoryId && <MenuItem disabled>Спочатку оберіть категорію</MenuItem>}
                {isLoadingItems && (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Завантаження предметів...
                  </MenuItem>
                )}
                {(items as PriceListItemDTO[]).map((item: PriceListItemDTO) => (
                  <MenuItem key={item.id} value={item.id || ''}>
                    {item.name}
                    {item.basePrice && (
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        (від {item.basePrice} грн)
                      </Typography>
                    )}
                  </MenuItem>
                ))}
              </Select>
              {errors.itemId && <FormHelperText>{errors.itemId}</FormHelperText>}
            </FormControl>

            {itemsError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                Помилка завантаження предметів. Спробуйте оновити сторінку.
              </Alert>
            )}
          </Grid>

          {/* Кількість */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Кількість"
              value={data.quantity || ''}
              onChange={(e) => handleQuantityChange(e.target.value)}
              inputProps={{
                min: 0.1,
                step: data.unitOfMeasure === 'кг' ? 0.1 : 1,
              }}
              error={!!errors.quantity}
              helperText={errors.quantity}
            />
          </Grid>

          {/* Одиниця виміру */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Одиниця виміру"
              value={selectedItem?.unitOfMeasure || data.unitOfMeasure || ''}
              disabled
              helperText="Автоматично встановлюється на основі вибраного предмета"
            />
          </Grid>

          {/* Базова ціна (інформаційно) */}
          {selectedItem?.basePrice && (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="Базова ціна"
                value={`${selectedItem.basePrice} грн`}
                disabled
                helperText="Базова ціна за одиницю (до модифікаторів)"
              />
            </Grid>
          )}
        </Grid>

        {/* Додаткова інформація про вибрану категорію */}
        {selectedCategory && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Інформація про категорію
            </Typography>
            <Grid container spacing={2}>
              {selectedCategory.description && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    {selectedCategory.description}
                  </Typography>
                </Grid>
              )}
              {selectedCategory.standardProcessingDays && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    <strong>Стандартний термін:</strong> {selectedCategory.standardProcessingDays}{' '}
                    {selectedCategory.standardProcessingDays === 1
                      ? 'день'
                      : selectedCategory.standardProcessingDays < 5
                        ? 'дні'
                        : 'днів'}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
