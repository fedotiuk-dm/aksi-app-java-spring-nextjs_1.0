import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  ListItemText,
  Typography,
  Box,
  Divider,
  Chip,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { ServiceCategoryDTO } from '@/features/order-wizard/api/stages/stage2';
import { ItemBasicInfoFormValues } from '@/features/order-wizard/model/schema/item-basic-info.schema';

interface CategorySelectProps {
  categories: ServiceCategoryDTO[];
  control: Control<ItemBasicInfoFormValues>;
  errors: FieldErrors<ItemBasicInfoFormValues>;
  onChange: (categoryId: string) => void;
}

export const CategorySelect = ({
  categories,
  control,
  errors,
  onChange,
}: CategorySelectProps) => {
  // Розділяємо категорії на основні та інші
  const mainCategories = categories.filter((cat) =>
    ['CLOTHING', 'LAUNDRY', 'IRONING'].includes(cat.code || '')
  );

  const otherCategories = categories.filter(
    (cat) => !['CLOTHING', 'LAUNDRY', 'IRONING'].includes(cat.code || '')
  );

  // Створюємо масив всіх елементів меню, щоб уникнути фрагментів
  const menuItems: React.ReactNode[] = [];

  // Додаємо основні категорії
  mainCategories.forEach((category) => {
    menuItems.push(
      <MenuItem key={category.id} value={category.id}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <ListItemText
            primary={category.name}
            secondary={category.description || undefined}
          />
          {category.items && (
            <Chip
              label={`${category.items.length} товарів`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
      </MenuItem>
    );
  });

  // Додаємо розділювач і заголовок, якщо є обидва типи категорій
  if (mainCategories.length > 0 && otherCategories.length > 0) {
    menuItems.push(<Divider key="divider" />);
    menuItems.push(
      <Box key="other-header" sx={{ px: 2, py: 1 }}>
        <Typography variant="caption">Інші категорії</Typography>
      </Box>
    );
  }

  // Додаємо інші категорії
  otherCategories.forEach((category) => {
    menuItems.push(
      <MenuItem key={category.id} value={category.id}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <ListItemText
            primary={category.name}
            secondary={category.description || undefined}
          />
          {category.items && (
            <Chip
              label={`${category.items.length} товарів`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
      </MenuItem>
    );
  });

  return (
    <Controller
      name="categoryId"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors.categoryId}>
          <InputLabel id="category-select-label">Категорія послуги</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            label="Категорія послуги"
            {...field}
            onChange={(e) => {
              field.onChange(e);
              onChange(e.target.value as string);
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                },
              },
            }}
            renderValue={(selected) => {
              const category = categories.find((cat) => cat.id === selected);
              if (!category) return null;

              return <Typography variant="body1">{category.name}</Typography>;
            }}
          >
            {menuItems}
          </Select>
          {errors.categoryId && (
            <FormHelperText>{errors.categoryId.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

