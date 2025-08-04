'use client';

/**
 * @fileoverview Форма створення/редагування товару
 */

import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  FormHelperText,
  Paper,
  Divider,
} from '@mui/material';
import {
  useCreateItemForm,
  useUpdateItemForm,
  ITEM_CATEGORIES,
  ITEM_CATEGORY_NAMES,
  CATALOG_MESSAGES,
} from '@/features/catalog';
import type { ItemInfo } from '@/shared/api/generated/serviceItem';

interface ItemFormProps {
  item?: ItemInfo;
  onSuccess?: (item: ItemInfo) => void;
  onCancel?: () => void;
}

export const ItemForm = ({ item, onSuccess, onCancel }: ItemFormProps) => {
  const isEdit = !!item;
  
  if (isEdit && item) {
    return <ItemEditForm item={item} onSuccess={onSuccess} onCancel={onCancel} />;
  }
  
  return <ItemCreateForm onSuccess={onSuccess} onCancel={onCancel} />;
};

const ItemCreateForm = ({ onSuccess, onCancel }: { onSuccess?: (item: ItemInfo) => void; onCancel?: () => void }) => {
  const { form, onSubmit, isLoading } = useCreateItemForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      if (onSuccess) {
        // In real implementation, we would get the created/updated item from the response
        onSuccess(data as ItemInfo);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Створити товар
      </Typography>

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        {/* Базова інформація */}
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
          Базова інформація
        </Typography>

        <TextField
          {...register('code')}
          fullWidth
          label="Код товару"
          placeholder="SHIRT_COTTON"
          error={!!errors.code}
          helperText={errors.code?.message}
          sx={{ mb: 2 }}
          required
        />

        <TextField
          {...register('name')}
          fullWidth
          label="Назва товару"
          placeholder="Сорочка бавовняна"
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={{ mb: 2 }}
          required
        />

        <TextField
          {...register('pluralName')}
          fullWidth
          label="Назва у множині"
          placeholder="Сорочки бавовняні"
          error={!!errors.pluralName}
          helperText={errors.pluralName?.message}
          sx={{ mb: 2 }}
        />

        <TextField
          {...register('description')}
          fullWidth
          label="Опис товару"
          placeholder="Детальний опис товару..."
          multiline
          rows={3}
          error={!!errors.description}
          helperText={errors.description?.message}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.category}>
          <InputLabel required>Категорія</InputLabel>
          <Select
            {...register('category')}
            label="Категорія"
            defaultValue=""
          >
            {Object.entries(ITEM_CATEGORIES).map(([key, value]) => (
              <MenuItem key={value} value={value}>
                {ITEM_CATEGORY_NAMES[value]}
              </MenuItem>
            ))}
          </Select>
          {errors.category && (
            <FormHelperText>{errors.category.message}</FormHelperText>
          )}
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Каталожна інформація */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Каталожна інформація
        </Typography>

        <TextField
          {...register('icon')}
          fullWidth
          label="Іконка"
          placeholder="shirt"
          error={!!errors.icon}
          helperText={errors.icon?.message || "ID іконки для відображення"}
          sx={{ mb: 2 }}
        />


        <Divider sx={{ my: 3 }} />

        {/* Налаштування обробки */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Налаштування обробки
        </Typography>


        <TextField
          {...register('tags')}
          fullWidth
          label="Теги"
          placeholder="cotton, formal, business"
          error={!!errors.tags}
          helperText={errors.tags?.message || "Розділіть теги комами"}
          sx={{ mb: 2 }}
        />

        <TextField
          {...register('sortOrder', { valueAsNumber: true })}
          fullWidth
          type="number"
          label="Порядок сортування"
          placeholder="1"
          error={!!errors.sortOrder}
          helperText={errors.sortOrder?.message}
          sx={{ mb: 3 }}
        />

        {/* Дії */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isLoading}
            >
              Скасувати
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            {isLoading ? 'Створення...' : 'Створити'}
          </Button>
        </Box>

        {/* Повідомлення про помилки */}
        {form.formState.errors.root && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {form.formState.errors.root.message}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

const ItemEditForm = ({ item, onSuccess, onCancel }: { item: ItemInfo; onSuccess?: (item: ItemInfo) => void; onCancel?: () => void }) => {
  const { form, onSubmit, isLoading } = useUpdateItemForm(item);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      if (onSuccess) {
        // In real implementation, we would get the updated item from the response
        onSuccess(item);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Редагувати товар
      </Typography>

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        {/* Базова інформація */}
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
          Базова інформація
        </Typography>

        <TextField
          {...register('name')}
          fullWidth
          label="Назва товару"
          placeholder="Сорочка бавовняна"
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={{ mb: 2 }}
          required
        />

        <TextField
          {...register('pluralName')}
          fullWidth
          label="Назва у множині"
          placeholder="Сорочки бавовняні"
          error={!!errors.pluralName}
          helperText={errors.pluralName?.message}
          sx={{ mb: 2 }}
        />

        <TextField
          {...register('description')}
          fullWidth
          label="Опис товару"
          placeholder="Детальний опис товару..."
          multiline
          rows={3}
          error={!!errors.description}
          helperText={errors.description?.message}
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Каталожна інформація */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Каталожна інформація
        </Typography>

        <TextField
          {...register('icon')}
          fullWidth
          label="Іконка"
          placeholder="shirt"
          error={!!errors.icon}
          helperText={errors.icon?.message || "ID іконки для відображення"}
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Налаштування обробки */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Налаштування обробки
        </Typography>

        <TextField
          {...register('tags')}
          fullWidth
          label="Теги"
          placeholder="cotton, formal, business"
          error={!!errors.tags}
          helperText={errors.tags?.message || "Розділіть теги комами"}
          sx={{ mb: 2 }}
        />

        <TextField
          {...register('sortOrder', { valueAsNumber: true })}
          fullWidth
          type="number"
          label="Порядок сортування"
          placeholder="1"
          error={!!errors.sortOrder}
          helperText={errors.sortOrder?.message}
          sx={{ mb: 3 }}
        />

        {/* Дії */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isLoading}
            >
              Скасувати
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            {isLoading ? 'Оновлення...' : 'Оновити'}
          </Button>
        </Box>

        {/* Повідомлення про помилки */}
        {form.formState.errors.root && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {form.formState.errors.root.message}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};