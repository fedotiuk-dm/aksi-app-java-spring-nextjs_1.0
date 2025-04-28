import { 
  FormControl, 
  FormHelperText, 
  InputLabel, 
  MenuItem, 
  Select
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { PriceListItemDTO } from '@/features/order-wizard/api/stages/stage2';
import { ItemBasicInfoFormValues } from '@/features/order-wizard/model/schema/item-basic-info.schema';

interface ItemNameSelectProps {
  itemNames: PriceListItemDTO[];
  control: Control<ItemBasicInfoFormValues>;
  errors: FieldErrors<ItemBasicInfoFormValues>;
  disabled?: boolean;
  onChange: (itemId: string) => void;
}

export const ItemNameSelect = ({
  itemNames,
  control,
  errors,
  disabled = false,
  onChange
}: ItemNameSelectProps) => {
  return (
    <Controller
      name="itemNameId"
      control={control}
      render={({ field }) => (
        <FormControl 
          fullWidth 
          error={!!errors.itemNameId}
          disabled={disabled}
        >
          <InputLabel id="item-name-select-label">Найменування виробу</InputLabel>
          <Select
            labelId="item-name-select-label"
            id="item-name-select"
            label="Найменування виробу"
            {...field}
            onChange={(e) => {
              field.onChange(e);
              onChange(e.target.value as string);
            }}
          >
            {itemNames.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name} ({item.basePrice?.toFixed(2)} грн)
              </MenuItem>
            ))}
          </Select>
          {errors.itemNameId && (
            <FormHelperText>{errors.itemNameId.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
