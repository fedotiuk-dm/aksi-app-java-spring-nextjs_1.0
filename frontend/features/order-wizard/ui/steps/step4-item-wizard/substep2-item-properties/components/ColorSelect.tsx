import React from 'react';
import { 
  FormControl, 
  FormControlLabel, 
  Radio, 
  RadioGroup, 
  TextField, 
  Grid, 
  Typography,
  FormHelperText
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { BaseColor, ItemPropertiesFormValues } from '@/features/order-wizard/model/schema/item-properties.schema';

interface ColorSelectProps {
  control: Control<ItemPropertiesFormValues>;
  selectedColorType: BaseColor;
  onColorTypeChange: (colorType: BaseColor) => void;
  onCustomColorChange: (color: string) => void;
}

/**
 * Компонент для вибору кольору предмета
 */
export const ColorSelect: React.FC<ColorSelectProps> = ({ 
  control, 
  selectedColorType, 
  onColorTypeChange, 
  onCustomColorChange 
}) => {
  // Переклади для відображення в інтерфейсі
  const colorLabels: Record<BaseColor, string> = {
    [BaseColor.BLACK]: 'Чорний',
    [BaseColor.WHITE]: 'Білий',
    [BaseColor.GRAY]: 'Сірий',
    [BaseColor.BLUE]: 'Синій',
    [BaseColor.RED]: 'Червоний',
    [BaseColor.GREEN]: 'Зелений',
    [BaseColor.YELLOW]: 'Жовтий',
    [BaseColor.BROWN]: 'Коричневий',
    [BaseColor.BEIGE]: 'Бежевий',
    [BaseColor.PURPLE]: 'Фіолетовий',
    [BaseColor.CUSTOM]: 'Інший (вказати)',
  };

  // Кольори для відображення в інтерфейсі
  const colorHexMap: Record<BaseColor, string> = {
    [BaseColor.BLACK]: '#000000',
    [BaseColor.WHITE]: '#FFFFFF',
    [BaseColor.GRAY]: '#808080',
    [BaseColor.BLUE]: '#0000FF',
    [BaseColor.RED]: '#FF0000',
    [BaseColor.GREEN]: '#008000',
    [BaseColor.YELLOW]: '#FFFF00',
    [BaseColor.BROWN]: '#8B4513',
    [BaseColor.BEIGE]: '#F5F5DC',
    [BaseColor.PURPLE]: '#800080',
    [BaseColor.CUSTOM]: '#FFFFFF',
  };

  const handleColorTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorTypeChange(e.target.value as BaseColor);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onCustomColorChange(e.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="colorType"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl component="fieldset" fullWidth error={!!error}>
              <Typography variant="subtitle2" gutterBottom>
                Колір предмета
              </Typography>
              <RadioGroup 
                {...field} 
                value={selectedColorType} 
                onChange={handleColorTypeChange}
                row
                sx={{ display: 'flex', flexWrap: 'wrap' }}
              >
                {Object.values(BaseColor)
                  .filter(color => color !== BaseColor.CUSTOM)
                  .map((color) => (
                    <FormControlLabel
                      key={color}
                      value={color}
                      control={
                        <Radio 
                          sx={{
                            '& .MuiSvgIcon-root:first-of-type': {
                              bgcolor: colorHexMap[color],
                              border: color === BaseColor.WHITE ? '1px solid #ccc' : 'none',
                            },
                          }}
                        />
                      }
                      label={colorLabels[color]}
                      sx={{ width: 'auto', minWidth: '120px', mr: 2, mb: 1 }}
                    />
                  ))}
                <FormControlLabel
                  value={BaseColor.CUSTOM}
                  control={<Radio />}
                  label={colorLabels[BaseColor.CUSTOM]}
                  sx={{ width: 'auto', minWidth: '120px', mr: 2, mb: 1 }}
                />
              </RadioGroup>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>

      {selectedColorType === BaseColor.CUSTOM && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="customColor"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Власний колір"
                placeholder="Наприклад: колір морської хвилі"
                variant="outlined"
                fullWidth
                error={!!error}
                helperText={error?.message}
                onChange={(e) => {
                  field.onChange(e);
                  handleCustomColorChange(e);
                }}
              />
            )}
          />
        </Grid>
      )}
    </Grid>
  );
};