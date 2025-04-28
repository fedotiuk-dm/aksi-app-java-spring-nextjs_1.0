import { 
  FormControl, 
  FormHelperText, 
  InputLabel, 
  MenuItem, 
  Select
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
  onChange
}: CategorySelectProps) => {
  return (
    <Controller
      name="categoryId"
      control={control}
      render={({ field }) => (
        <FormControl 
          fullWidth 
          error={!!errors.categoryId}
        >
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
  );
};
