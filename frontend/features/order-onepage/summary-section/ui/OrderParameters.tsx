'use client';

import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useOrderOnepageStore } from '../../store/order-onepage.store';
import {
  useStage3UpdateExecutionParams,
  useStage3UpdateDiscountConfig,
  useStage3GetSessionContext,
  ExecutionParamsDTOExpediteType,
  DiscountConfigurationDTODiscountType,
} from '@/shared/api/generated';

export const OrderParameters: React.FC = () => {
  const { sessionId } = useOrderOnepageStore();

  // API hooks
  const updateExecutionParams = useStage3UpdateExecutionParams();
  const updateDiscountConfig = useStage3UpdateDiscountConfig();
  const { data: sessionContext, isLoading: isLoadingContext } = useStage3GetSessionContext(
    sessionId || '',
    {
      query: {
        enabled: !!sessionId,
      },
    }
  );

  // Local state for form values
  const [expediteType, setExpediteType] = React.useState<ExecutionParamsDTOExpediteType>(
    ExecutionParamsDTOExpediteType.STANDARD
  );
  const [useManualDate, setUseManualDate] = React.useState(false);
  const [manualExecutionDate, setManualExecutionDate] = React.useState<Dayjs | null>(null);
  const [discountType, setDiscountType] = React.useState<DiscountConfigurationDTODiscountType>(
    DiscountConfigurationDTODiscountType.NO_DISCOUNT
  );
  const [discountPercentage, setDiscountPercentage] = React.useState<number>(0);

  // Initialize form values from session context
  useEffect(() => {
    if (sessionContext?.executionParams) {
      const params = sessionContext.executionParams;
      if (params.expediteType) {
        setExpediteType(params.expediteType);
      }
      if (params.useManualDate !== undefined) {
        setUseManualDate(params.useManualDate);
      }
      if (params.manualExecutionDate) {
        setManualExecutionDate(dayjs(params.manualExecutionDate));
      }
    }

    if (sessionContext?.discountConfiguration) {
      const discount = sessionContext.discountConfiguration;
      if (discount.discountType) {
        setDiscountType(discount.discountType);
      }
      if (discount.discountPercentage !== undefined) {
        setDiscountPercentage(discount.discountPercentage);
      }
    }
  }, [sessionContext]);

  const handleExpediteTypeChange = async (newExpediteType: ExecutionParamsDTOExpediteType) => {
    if (!sessionId) return;

    setExpediteType(newExpediteType);

    try {
      await updateExecutionParams.mutateAsync({
        sessionId,
        data: {
          expediteType: newExpediteType,
          useManualDate,
          manualExecutionDate: manualExecutionDate?.toISOString(),
        },
      });
    } catch (error) {
      console.error('Failed to update execution params:', error);
    }
  };

  const handleManualDateToggle = async (checked: boolean) => {
    if (!sessionId) return;

    setUseManualDate(checked);

    try {
      await updateExecutionParams.mutateAsync({
        sessionId,
        data: {
          expediteType,
          useManualDate: checked,
          manualExecutionDate: checked ? manualExecutionDate?.toISOString() : undefined,
        },
      });
    } catch (error) {
      console.error('Failed to update execution params:', error);
    }
  };

  const handleManualDateChange = async (date: Dayjs | null) => {
    if (!sessionId) return;

    setManualExecutionDate(date);

    if (useManualDate) {
      try {
        await updateExecutionParams.mutateAsync({
          sessionId,
          data: {
            expediteType,
            useManualDate,
            manualExecutionDate: date?.toISOString(),
          },
        });
      } catch (error) {
        console.error('Failed to update execution params:', error);
      }
    }
  };

  const handleDiscountTypeChange = async (
    newDiscountType: DiscountConfigurationDTODiscountType
  ) => {
    if (!sessionId) return;

    setDiscountType(newDiscountType);

    // Reset percentage for NO_DISCOUNT
    const newPercentage =
      newDiscountType === DiscountConfigurationDTODiscountType.NO_DISCOUNT ? 0 : discountPercentage;
    setDiscountPercentage(newPercentage);

    try {
      await updateDiscountConfig.mutateAsync({
        sessionId,
        data: {
          discountType: newDiscountType,
          discountPercentage: newPercentage,
        },
      });
    } catch (error) {
      console.error('Failed to update discount config:', error);
    }
  };

  const handleDiscountPercentageChange = async (percentage: number) => {
    if (!sessionId) return;

    setDiscountPercentage(percentage);

    try {
      await updateDiscountConfig.mutateAsync({
        sessionId,
        data: {
          discountType,
          discountPercentage: percentage,
        },
      });
    } catch (error) {
      console.error('Failed to update discount config:', error);
    }
  };

  if (isLoadingContext) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (!sessionId) {
    return <Alert severity="error">Сесія не ініціалізована. Будь ласка, почніть спочатку.</Alert>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Параметри замовлення
        </Typography>

        <Grid container spacing={3}>
          {/* Execution Parameters */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Параметри виконання
                </Typography>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Тип виконання</InputLabel>
                  <Select
                    value={expediteType}
                    onChange={(e) =>
                      handleExpediteTypeChange(e.target.value as ExecutionParamsDTOExpediteType)
                    }
                    label="Тип виконання"
                  >
                    <MenuItem value={ExecutionParamsDTOExpediteType.STANDARD}>
                      Стандартне виконання
                    </MenuItem>
                    <MenuItem value={ExecutionParamsDTOExpediteType.EXPRESS_48H}>
                      Експрес 48 годин
                    </MenuItem>
                    <MenuItem value={ExecutionParamsDTOExpediteType.EXPRESS_24H}>
                      Експрес 24 години
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={useManualDate}
                      onChange={(e) => handleManualDateToggle(e.target.checked)}
                    />
                  }
                  label="Встановити дату вручну"
                />

                {useManualDate && (
                  <DatePicker
                    label="Дата виконання"
                    value={manualExecutionDate}
                    onChange={handleManualDateChange}
                    minDate={dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                      },
                    }}
                  />
                )}

                {sessionContext?.executionParams?.effectiveExecutionDate && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Очікувана дата виконання:{' '}
                    {dayjs(sessionContext.executionParams.effectiveExecutionDate).format(
                      'DD.MM.YYYY'
                    )}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Discount Configuration */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Конфігурація знижок
                </Typography>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Тип знижки</InputLabel>
                  <Select
                    value={discountType}
                    onChange={(e) =>
                      handleDiscountTypeChange(
                        e.target.value as DiscountConfigurationDTODiscountType
                      )
                    }
                    label="Тип знижки"
                  >
                    <MenuItem value={DiscountConfigurationDTODiscountType.NO_DISCOUNT}>
                      Без знижки
                    </MenuItem>
                    <MenuItem value={DiscountConfigurationDTODiscountType.EVERCARD}>
                      Evercard
                    </MenuItem>
                    <MenuItem value={DiscountConfigurationDTODiscountType.SOCIAL_MEDIA}>
                      Соціальні мережі
                    </MenuItem>
                    <MenuItem value={DiscountConfigurationDTODiscountType.MILITARY}>
                      Військова знижка
                    </MenuItem>
                    <MenuItem value={DiscountConfigurationDTODiscountType.CUSTOM}>
                      Індивідуальна знижка
                    </MenuItem>
                  </Select>
                </FormControl>

                {discountType !== DiscountConfigurationDTODiscountType.NO_DISCOUNT && (
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Відсоток знижки</InputLabel>
                    <Select
                      value={discountPercentage}
                      onChange={(e) => handleDiscountPercentageChange(Number(e.target.value))}
                      label="Відсоток знижки"
                    >
                      {[5, 10, 15, 20, 25, 30].map((percent) => (
                        <MenuItem key={percent} value={percent}>
                          {percent}%
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {sessionContext?.discountConfiguration && (
                  <Box sx={{ mt: 2 }}>
                    {sessionContext.discountConfiguration.originalAmount && (
                      <Typography variant="body2">
                        Початкова сума:{' '}
                        {sessionContext.discountConfiguration.originalAmount.toFixed(2)} грн
                      </Typography>
                    )}
                    {sessionContext.discountConfiguration.discountAmount && (
                      <Typography variant="body2">
                        Сума знижки:{' '}
                        {sessionContext.discountConfiguration.discountAmount.toFixed(2)} грн
                      </Typography>
                    )}
                    {sessionContext.discountConfiguration.finalAmount && (
                      <Typography variant="body2" fontWeight="bold">
                        Фінальна сума: {sessionContext.discountConfiguration.finalAmount.toFixed(2)}{' '}
                        грн
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Error Messages */}
        {updateExecutionParams.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Помилка оновлення параметрів виконання: {updateExecutionParams.error.message}
          </Alert>
        )}

        {updateDiscountConfig.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Помилка оновлення конфігурації знижок: {updateDiscountConfig.error.message}
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
};
