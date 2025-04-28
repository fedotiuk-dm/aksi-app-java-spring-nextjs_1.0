import React from 'react';
import { 
  Box, 
  FormControl, 
  FormHelperText, 
  Grid, 
  Slider,
  Typography 
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { ItemPropertiesFormValues, WearDegree } from '@/features/order-wizard/model/schema/item-properties.schema';

interface WearDegreeSelectProps {
  control: Control<ItemPropertiesFormValues>;
  onWearDegreeChange: (degree: WearDegree) => void;
}

/**
 * Компонент для вибору ступеня зносу предмета
 */
export const WearDegreeSelect: React.FC<WearDegreeSelectProps> = ({ 
  control, 
  onWearDegreeChange 
}) => {
  // Переклади для відображення в інтерфейсі
  const wearDegreeLabels: Record<WearDegree, string> = {
    [WearDegree.WEAR_10]: '10% - майже новий стан',
    [WearDegree.WEAR_30]: '30% - легкі ознаки зносу',
    [WearDegree.WEAR_50]: '50% - помірний знос',
    [WearDegree.WEAR_75]: '75% - значний знос',
  };

  // Відображення ступеня зносу як числа для слайдера
  const wearDegreeValues: Record<WearDegree, number> = {
    [WearDegree.WEAR_10]: 10,
    [WearDegree.WEAR_30]: 30,
    [WearDegree.WEAR_50]: 50,
    [WearDegree.WEAR_75]: 75,
  };

  // Зворотнє відображення числа в enum
  const valueToWearDegree: Record<number, WearDegree> = {
    10: WearDegree.WEAR_10,
    30: WearDegree.WEAR_30,
    50: WearDegree.WEAR_50,
    75: WearDegree.WEAR_75,
  };

  // Мітки для слайдера
  const marks = [
    { value: 10, label: '10%' },
    { value: 30, label: '30%' },
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
  ];

  const handleSliderChange = (value: number) => {
    // Знаходимо найближче значення з допустимих
    const closestValue = marks.reduce((prev, curr) => 
      Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
    );
    
    onWearDegreeChange(valueToWearDegree[closestValue.value]);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="wearDegree"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth error={!!error}>
              <Box sx={{ px: 2, py: 1 }}>
                <Typography id="wear-degree-slider" gutterBottom>
                  Ступінь зносу: <strong>{wearDegreeLabels[field.value]}</strong>
                </Typography>
                <Slider
                  aria-labelledby="wear-degree-slider"
                  value={wearDegreeValues[field.value]}
                  step={null}
                  marks={marks}
                  min={0}
                  max={100}
                  onChange={(_, value) => {
                    const newValue = valueToWearDegree[value as number];
                    field.onChange(newValue);
                    handleSliderChange(value as number);
                  }}
                  sx={{ 
                    '& .MuiSlider-markLabel': { 
                      fontSize: '0.875rem' 
                    },
                    mt: 4,
                    mb: 2
                  }}
                />
              </Box>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>
    </Grid>
  );
};
