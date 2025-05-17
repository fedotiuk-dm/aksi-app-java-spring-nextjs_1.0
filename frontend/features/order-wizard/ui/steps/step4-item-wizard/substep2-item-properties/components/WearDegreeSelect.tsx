import React from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  Slider,
  Typography,
  Paper,
  Tooltip,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import {
  ItemPropertiesFormValues,
  WearDegree,
} from '@/features/order-wizard/model/schema/item-properties.schema';

interface WearDegreeSelectProps {
  control: Control<ItemPropertiesFormValues>;
  onWearDegreeChange: (degree: WearDegree) => void;
}

/**
 * Компонент для вибору ступеня зносу предмета
 */
export const WearDegreeSelect: React.FC<WearDegreeSelectProps> = ({
  control,
  onWearDegreeChange,
}) => {
  // Переклади для відображення в інтерфейсі
  const wearDegreeLabels: Record<WearDegree, string> = {
    [WearDegree.WEAR_10]: '10% - майже новий стан',
    [WearDegree.WEAR_30]: '30% - легкі ознаки зносу',
    [WearDegree.WEAR_50]: '50% - помірний знос',
    [WearDegree.WEAR_75]: '75% - значний знос',
  };

  // Детальніший опис для тултіпів
  const wearDegreeDescriptions: Record<WearDegree, string> = {
    [WearDegree.WEAR_10]:
      'Предмет майже як новий, без видимих ознак зносу. Незначні сліди використання.',
    [WearDegree.WEAR_30]:
      'Легкі ознаки зносу, невеликі потертості. Загальний стан добрий.',
    [WearDegree.WEAR_50]:
      'Помірний знос, помітні потертості та сліди використання. Стан задовільний.',
    [WearDegree.WEAR_75]:
      'Значний знос, видимі ділянки з пошкодженнями тканини або матеріалу. Стан нижче середнього.',
  };

  // Кольори для відображення ступеня зносу
  const wearDegreeColors: Record<WearDegree, string> = {
    [WearDegree.WEAR_10]: '#4caf50', // зелений
    [WearDegree.WEAR_30]: '#8bc34a', // салатовий
    [WearDegree.WEAR_50]: '#ffc107', // жовтий
    [WearDegree.WEAR_75]: '#f44336', // червоний
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="medium"
                    gutterBottom
                  >
                    Ступінь зносу:
                  </Typography>
                  <Tooltip
                    title={wearDegreeDescriptions[field.value]}
                    arrow
                    placement="top"
                  >
                    <Typography
                      variant="subtitle2"
                      component="span"
                      fontWeight="bold"
                      sx={{
                        ml: 1,
                        color: wearDegreeColors[field.value],
                        cursor: 'help',
                      }}
                    >
                      {wearDegreeLabels[field.value]}
                    </Typography>
                  </Tooltip>
                </Box>

                {/* Візуальний індикатор ступеня зносу */}
                <Box sx={{ display: 'flex', mb: 4, mt: 2 }}>
                  {Object.values(WearDegree).map((degree) => (
                    <Tooltip
                      key={degree}
                      title={wearDegreeDescriptions[degree]}
                      arrow
                    >
                      <Paper
                        elevation={field.value === degree ? 6 : 1}
                        sx={{
                          flexGrow: 1,
                          p: 1.5,
                          textAlign: 'center',
                          bgcolor: wearDegreeColors[degree],
                          color: 'white',
                          border:
                            field.value === degree ? '2px solid #333' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          opacity: field.value === degree ? 1 : 0.7,
                          fontSize: '0.9rem',
                          fontWeight:
                            field.value === degree ? 'bold' : 'normal',
                          '&:hover': {
                            opacity: 0.9,
                            transform: 'translateY(-2px)',
                          },
                        }}
                        onClick={() => {
                          field.onChange(degree);
                          onWearDegreeChange(degree);
                        }}
                      >
                        {degree === WearDegree.WEAR_10
                          ? '10%'
                          : degree === WearDegree.WEAR_30
                          ? '30%'
                          : degree === WearDegree.WEAR_50
                          ? '50%'
                          : '75%'}
                      </Paper>
                    </Tooltip>
                  ))}
                </Box>

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
                      fontSize: '0.875rem',
                    },
                    '& .MuiSlider-thumb': {
                      backgroundColor: wearDegreeColors[field.value],
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: wearDegreeColors[field.value],
                    },
                    mt: 2,
                    mb: 1,
                  }}
                />

                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {wearDegreeDescriptions[field.value]}
                  </Typography>
                </Box>
              </Box>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>
    </Grid>
  );
};
