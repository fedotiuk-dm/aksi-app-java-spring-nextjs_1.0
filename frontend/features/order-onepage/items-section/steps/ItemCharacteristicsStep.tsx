'use client';

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
  FormControlLabel,
  Checkbox,
  Slider,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useOrderOnepageStore } from '../../store/order-onepage.store';
import {
  useSubstep2SelectMaterial,
  useSubstep2SelectColor,
  useSubstep2SelectFiller,
  useSubstep2SelectWearLevel,
} from '@/shared/api/generated/substep2';
import { z } from 'zod';

// Local schema for validation
const materialSelectionSchema = z.object({
  material: z.string().min(1, "Матеріал обов'язковий"),
  color: z.string().min(1, "Колір обов'язковий"),
  customColor: z.string().optional(),
  filler: z.string().optional(),
  customFiller: z.string().optional(),
  isFillerCompressed: z.boolean().optional(),
  wearLevel: z.number().min(10).max(75),
});

interface ItemCharacteristicsStepProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const materials = [
  { value: 'cotton', label: 'Бавовна' },
  { value: 'wool', label: 'Шерсть' },
  { value: 'silk', label: 'Шовк' },
  { value: 'synthetic', label: 'Синтетика' },
  { value: 'leather', label: 'Гладка шкіра' },
  { value: 'nubuck', label: 'Нубук' },
  { value: 'suede', label: 'Замша' },
  { value: 'split', label: 'Спілок' },
];

const colors = [
  'Білий',
  'Чорний',
  'Сірий',
  'Коричневий',
  'Синій',
  'Червоний',
  'Зелений',
  'Жовтий',
  'Рожевий',
  'Фіолетовий',
  'Помаранчевий',
  'Бежевий',
];

const fillers = [
  { value: 'down', label: 'Пух' },
  { value: 'synthetic', label: 'Синтепон' },
  { value: 'other', label: 'Інше' },
];

export const ItemCharacteristicsStep = ({
  data,
  onDataChange,
  onNext,
  onBack,
}: ItemCharacteristicsStepProps) => {
  const { sessionId } = useOrderOnepageStore();

  const selectMaterial = useSubstep2SelectMaterial();
  const selectColor = useSubstep2SelectColor();
  const selectFiller = useSubstep2SelectFiller();
  const selectWearLevel = useSubstep2SelectWearLevel();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(materialSelectionSchema),
    defaultValues: {
      material: data.material || '',
      color: data.color || '',
      customColor: data.customColor || '',
      filler: data.filler || '',
      customFiller: data.customFiller || '',
      isFillerCompressed: data.isFillerCompressed || false,
      wearLevel: data.wearLevel || 10,
    },
    mode: 'onChange',
  });

  const watchedColor = watch('color');
  const watchedFiller = watch('filler');

  const onSubmit = async (formData: any) => {
    if (!sessionId) return;

    try {
      // Відправляємо матеріал
      await selectMaterial.mutateAsync({
        sessionId,
        params: { materialId: formData.material },
      });

      // Відправляємо колір
      const colorValue = formData.color === 'custom' ? formData.customColor : formData.color;
      await selectColor.mutateAsync({
        sessionId,
        params: { color: colorValue },
      });

      // Відправляємо наповнювач (якщо є)
      if (formData.filler) {
        const fillerValue = formData.filler === 'other' ? formData.customFiller : formData.filler;
        await selectFiller.mutateAsync({
          sessionId,
          params: {
            fillerType: fillerValue,
            isFillerDamaged: formData.isFillerCompressed,
          },
        });
      }

      // Відправляємо ступінь зносу
      await selectWearLevel.mutateAsync({
        sessionId,
        params: { wearPercentage: formData.wearLevel },
      });

      onDataChange(formData);
      onNext();
    } catch (error) {
      console.error('Помилка збереження характеристик:', error);
    }
  };

  const isLoading =
    selectMaterial.isPending ||
    selectColor.isPending ||
    selectFiller.isPending ||
    selectWearLevel.isPending;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Характеристики предмета
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {/* Матеріал */}
          <Controller
            name="material"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.material}>
                <InputLabel>Матеріал *</InputLabel>
                <Select {...field} label="Матеріал *">
                  {materials.map((material) => (
                    <MenuItem key={material.value} value={material.value}>
                      {material.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.material && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.material.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          {/* Колір */}
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.color}>
                <InputLabel>Колір *</InputLabel>
                <Select {...field} label="Колір *">
                  {colors.map((color) => (
                    <MenuItem key={color} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                  <MenuItem value="custom">Інший колір</MenuItem>
                </Select>
                {errors.color && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.color.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          {/* Власний колір */}
          {watchedColor === 'custom' && (
            <Controller
              name="customColor"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Вкажіть колір"
                  error={!!errors.customColor}
                  helperText={errors.customColor?.message}
                  fullWidth
                />
              )}
            />
          )}

          {/* Наповнювач */}
          <Controller
            name="filler"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Наповнювач (опційно)</InputLabel>
                <Select {...field} label="Наповнювач (опційно)">
                  <MenuItem value="">Без наповнювача</MenuItem>
                  {fillers.map((filler) => (
                    <MenuItem key={filler.value} value={filler.value}>
                      {filler.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* Власний наповнювач */}
          {watchedFiller === 'other' && (
            <Controller
              name="customFiller"
              control={control}
              render={({ field }) => <TextField {...field} label="Вкажіть наповнювач" fullWidth />}
            />
          )}

          {/* Збитий наповнювач */}
          {watchedFiller && watchedFiller !== '' && (
            <Controller
              name="isFillerCompressed"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Збитий наповнювач"
                />
              )}
            />
          )}

          {/* Ступінь зносу */}
          <Box>
            <Typography gutterBottom>Ступінь зносу</Typography>
            <Controller
              name="wearLevel"
              control={control}
              render={({ field }) => (
                <Box sx={{ px: 2 }}>
                  <Slider
                    {...field}
                    value={field.value}
                    onChange={(_, value) => field.onChange(value)}
                    min={10}
                    max={75}
                    step={5}
                    marks={[
                      { value: 10, label: '10%' },
                      { value: 30, label: '30%' },
                      { value: 50, label: '50%' },
                      { value: 75, label: '75%' },
                    ]}
                    valueLabelDisplay="on"
                    valueLabelFormat={(value) => `${value}%`}
                  />
                </Box>
              )}
            />
          </Box>

          {/* Кнопки навігації */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button onClick={onBack} startIcon={<ArrowBack />} variant="outlined" sx={{ flex: 1 }}>
              Назад
            </Button>
            <Button
              type="submit"
              variant="contained"
              endIcon={<ArrowForward />}
              disabled={!isValid || isLoading}
              sx={{ flex: 1 }}
            >
              {isLoading ? 'Збереження...' : 'Далі'}
            </Button>
          </Stack>

          {/* Помилки */}
          {(selectMaterial.error ||
            selectColor.error ||
            selectFiller.error ||
            selectWearLevel.error) && (
            <Alert severity="error">Помилка збереження характеристик</Alert>
          )}
        </Stack>
      </form>
    </Box>
  );
};
