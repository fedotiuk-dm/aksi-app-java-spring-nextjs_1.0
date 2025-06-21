'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Paper,
  Divider,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useOrderOnepageStore } from '../../store/order-onepage.store';
import {
  useSubstep3ProcessStainSelection,
  useSubstep3ProcessDefectSelection,
  useSubstep3ProcessDefectNotes,
} from '@/shared/api/generated/substep3';
import { z } from 'zod';

interface ItemStainsDefectsStepProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const stainTypes = [
  { value: 'grease', label: 'Жир' },
  { value: 'blood', label: 'Кров' },
  { value: 'protein', label: 'Білок' },
  { value: 'wine', label: 'Вино' },
  { value: 'coffee', label: 'Кава' },
  { value: 'grass', label: 'Трава' },
  { value: 'ink', label: 'Чорнило' },
  { value: 'cosmetics', label: 'Косметика' },
  { value: 'other', label: 'Інше' },
];

const defectTypes = [
  { value: 'wear', label: 'Потертості' },
  { value: 'torn', label: 'Порване' },
  { value: 'missing_hardware', label: 'Відсутність фурнітури' },
  { value: 'damaged_hardware', label: 'Пошкодження фурнітури' },
  { value: 'color_risk', label: 'Ризики зміни кольору' },
  { value: 'deformation_risk', label: 'Ризики деформації' },
  { value: 'no_guarantee', label: 'Без гарантій' },
];

// Локальна схема для валідації
const stainSelectionSchema = z.object({
  stains: z.array(z.string()),
  otherStain: z.string().optional(),
  defects: z.array(z.string()),
  defectNotes: z.string().optional(),
  noGuaranteeReason: z.string().optional(),
});

export const ItemStainsDefectsStep = ({
  data,
  onDataChange,
  onNext,
  onBack,
}: ItemStainsDefectsStepProps) => {
  const { sessionId } = useOrderOnepageStore();

  const processStains = useSubstep3ProcessStainSelection();
  const processDefects = useSubstep3ProcessDefectSelection();
  const processNotes = useSubstep3ProcessDefectNotes();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(stainSelectionSchema),
    defaultValues: {
      stains: data.stains || [],
      otherStain: data.otherStain || '',
      defects: data.defects || [],
      defectNotes: data.defectNotes || '',
      noGuaranteeReason: data.noGuaranteeReason || '',
    },
    mode: 'onChange',
  });

  const watchedStains = watch('stains');
  const watchedDefects = watch('defects');

  const onSubmit = async (formData: any) => {
    if (!sessionId) return;

    try {
      // Відправляємо плями
      let stainsToSend = [...formData.stains];
      if (formData.stains.includes('other') && formData.otherStain) {
        stainsToSend = stainsToSend.filter((s) => s !== 'other');
        stainsToSend.push(formData.otherStain);
      }

      await processStains.mutateAsync({
        sessionId,
        params: { selectedStains: stainsToSend.join(',') },
      });

      // Відправляємо дефекти
      await processDefects.mutateAsync({
        sessionId,
        params: {
          selectedDefects: formData.defects.join(','),
          noGuaranteeReason: formData.defects.includes('no_guarantee')
            ? formData.noGuaranteeReason
            : undefined,
        },
      });

      // Відправляємо примітки (якщо є)
      if (formData.defectNotes) {
        await processNotes.mutateAsync({
          sessionId,
          params: { defectNotes: formData.defectNotes },
        });
      }

      onDataChange(formData);
      onNext();
    } catch (error) {
      console.error('Помилка збереження забруднень та дефектів:', error);
    }
  };

  const isLoading = processStains.isPending || processDefects.isPending || processNotes.isPending;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Забруднення та дефекти
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {/* Плями */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Плями (мультивибір)
            </Typography>
            <Controller
              name="stains"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  {stainTypes.map((stain) => (
                    <FormControlLabel
                      key={stain.value}
                      control={
                        <Checkbox
                          checked={field.value.includes(stain.value)}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, stain.value]
                              : field.value.filter((v: string) => v !== stain.value);
                            field.onChange(newValue);
                          }}
                        />
                      }
                      label={stain.label}
                    />
                  ))}
                </FormGroup>
              )}
            />

            {/* Інша пляма */}
            {watchedStains.includes('other') && (
              <Controller
                name="otherStain"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Вкажіть тип плями" fullWidth sx={{ mt: 2 }} />
                )}
              />
            )}
          </Paper>

          <Divider />

          {/* Дефекти та ризики */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Дефекти та ризики (мультивибір)
            </Typography>
            <Controller
              name="defects"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  {defectTypes.map((defect) => (
                    <FormControlLabel
                      key={defect.value}
                      control={
                        <Checkbox
                          checked={field.value.includes(defect.value)}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, defect.value]
                              : field.value.filter((v: string) => v !== defect.value);
                            field.onChange(newValue);
                          }}
                        />
                      }
                      label={defect.label}
                    />
                  ))}
                </FormGroup>
              )}
            />
          </Paper>

          {/* Примітки щодо дефектів */}
          <Controller
            name="defectNotes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Примітки щодо дефектів"
                multiline
                rows={3}
                fullWidth
                placeholder="Опишіть додаткові деталі про стан предмета..."
              />
            )}
          />

          {/* Причина відсутності гарантій */}
          {watchedDefects.includes('no_guarantee') && (
            <Controller
              name="noGuaranteeReason"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Причина відсутності гарантій *"
                  multiline
                  rows={2}
                  fullWidth
                  required
                  error={!!errors.noGuaranteeReason}
                  helperText={errors.noGuaranteeReason?.message || "Обов'язково вкажіть причину"}
                  placeholder="Поясніть чому надається послуга без гарантій..."
                />
              )}
            />
          )}

          {/* Кнопки навігації */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button onClick={onBack} startIcon={<ArrowBack />} variant="outlined" sx={{ flex: 1 }}>
              Назад
            </Button>
            <Button
              type="submit"
              variant="contained"
              endIcon={<ArrowForward />}
              disabled={isLoading}
              sx={{ flex: 1 }}
            >
              {isLoading ? 'Збереження...' : 'Далі'}
            </Button>
          </Stack>

          {/* Помилки */}
          {(processStains.error || processDefects.error || processNotes.error) && (
            <Alert severity="error">Помилка збереження забруднень та дефектів</Alert>
          )}
        </Stack>
      </form>
    </Box>
  );
};
