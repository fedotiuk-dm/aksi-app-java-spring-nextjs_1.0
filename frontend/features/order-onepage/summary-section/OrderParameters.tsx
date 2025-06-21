'use client';

import { useForm, Controller } from 'react-hook-form';
import {
  Paper,
  Typography,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Settings } from '@mui/icons-material';
import { useOrderOnepageStore } from '../store/order-onepage.store';
import {
  useStage3UpdateExecutionParams,
  useStage3UpdateDiscountConfig,
  useStage3GetSessionContext,
  ExecutionParamsDTOExpediteType,
  DiscountConfigurationDTODiscountType,
} from '@/shared/api/generated';

const urgencyOptions = [
  { value: ExecutionParamsDTOExpediteType.STANDARD, label: 'Звичайне', surcharge: 0 },
  { value: ExecutionParamsDTOExpediteType.EXPRESS_48H, label: '+50% за 48 год', surcharge: 50 },
  { value: ExecutionParamsDTOExpediteType.EXPRESS_24H, label: '+100% за 24 год', surcharge: 100 },
];

const discountOptions = [
  { value: DiscountConfigurationDTODiscountType.NO_DISCOUNT, label: 'Без знижки', percent: 0 },
  { value: DiscountConfigurationDTODiscountType.EVERCARD, label: 'Еверкард', percent: 10 },
  { value: DiscountConfigurationDTODiscountType.SOCIAL_MEDIA, label: 'Соцмережі', percent: 5 },
  { value: DiscountConfigurationDTODiscountType.MILITARY, label: 'ЗСУ', percent: 10 },
  { value: DiscountConfigurationDTODiscountType.CUSTOM, label: 'Інше', percent: 0 },
];

export const OrderParameters = () => {
  const { sessionId } = useOrderOnepageStore();

  const updateExecutionParams = useStage3UpdateExecutionParams();
  const updateDiscountConfig = useStage3UpdateDiscountConfig();
  const { data: sessionContext } = useStage3GetSessionContext(sessionId || '', {
    query: { enabled: !!sessionId },
  });

  const { control, watch, setValue } = useForm({
    defaultValues: {
      executionDate: dayjs().add(2, 'day'),
      urgency: ExecutionParamsDTOExpediteType.STANDARD,
      discount: DiscountConfigurationDTODiscountType.NO_DISCOUNT,
      customDiscountPercent: 0,
    },
  });

  const watchedUrgency = watch('urgency');
  const watchedDiscount = watch('discount');

  const handleExecutionDateChange = async (date: dayjs.Dayjs | null) => {
    if (!sessionId || !date) return;

    try {
      await updateExecutionParams.mutateAsync({
        sessionId,
        data: {
          expediteType: watchedUrgency,
          useManualDate: true,
          manualExecutionDate: date.toISOString(),
        },
      });
    } catch (error) {
      console.error('Помилка встановлення дати виконання:', error);
    }
  };

  const handleUrgencyChange = async (urgency: ExecutionParamsDTOExpediteType) => {
    if (!sessionId) return;

    try {
      await updateExecutionParams.mutateAsync({
        sessionId,
        data: {
          expediteType: urgency,
          useManualDate: false,
          manualExecutionDate: undefined,
        },
      });

      // Автоматично оновлюємо дату виконання
      const selectedOption = urgencyOptions.find((opt) => opt.value === urgency);
      if (selectedOption) {
        let newDate = dayjs();
        if (urgency === ExecutionParamsDTOExpediteType.EXPRESS_24H) {
          newDate = newDate.add(1, 'day');
        } else if (urgency === ExecutionParamsDTOExpediteType.EXPRESS_48H) {
          newDate = newDate.add(2, 'day');
        } else {
          newDate = newDate.add(2, 'day'); // Стандартний термін
        }
        setValue('executionDate', newDate);
        handleExecutionDateChange(newDate);
      }
    } catch (error) {
      console.error('Помилка встановлення терміновості:', error);
    }
  };

  const handleDiscountChange = async (discount: DiscountConfigurationDTODiscountType) => {
    if (!sessionId) return;

    try {
      const selectedOption = discountOptions.find((opt) => opt.value === discount);
      await updateDiscountConfig.mutateAsync({
        sessionId,
        data: {
          discountType: discount,
          discountPercentage: selectedOption?.percent || 0,
        },
      });
    } catch (error) {
      console.error('Помилка встановлення знижки:', error);
    }
  };

  const selectedUrgency = urgencyOptions.find((opt) => opt.value === watchedUrgency);
  const selectedDiscount = discountOptions.find((opt) => opt.value === watchedDiscount);

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Settings color="primary" />
        <Typography variant="h6">Параметри замовлення</Typography>
      </Box>

      <Stack spacing={2}>
        {/* Дата виконання */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="executionDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="Дата виконання"
                minDate={dayjs()}
                onChange={(date) => {
                  field.onChange(date);
                  handleExecutionDateChange(date);
                }}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>

        {/* Терміновість */}
        <Controller
          name="urgency"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <InputLabel>Терміновість</InputLabel>
              <Select
                {...field}
                label="Терміновість"
                onChange={(e) => {
                  field.onChange(e.target.value);
                  handleUrgencyChange(e.target.value as ExecutionParamsDTOExpediteType);
                }}
              >
                {urgencyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{option.label}</Typography>
                      {option.surcharge > 0 && (
                        <Chip
                          label={`+${option.surcharge}%`}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        {/* Знижка */}
        <Controller
          name="discount"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <InputLabel>Знижка</InputLabel>
              <Select
                {...field}
                label="Знижка"
                onChange={(e) => {
                  field.onChange(e.target.value);
                  handleDiscountChange(e.target.value as DiscountConfigurationDTODiscountType);
                }}
              >
                {discountOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{option.label}</Typography>
                      {option.percent > 0 && (
                        <Chip
                          label={`-${option.percent}%`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        {/* Попередження про знижки */}
        {selectedDiscount && selectedDiscount.percent > 0 && (
          <Alert severity="info" sx={{ fontSize: '0.75rem' }}>
            Знижки не діють на прання, прасування та фарбування
          </Alert>
        )}

        {/* Інформація про терміновість */}
        {selectedUrgency && selectedUrgency.surcharge > 0 && (
          <Box sx={{ p: 1, backgroundColor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="caption" color="warning.dark">
              Надбавка за терміновість: +{selectedUrgency.surcharge}%
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};
