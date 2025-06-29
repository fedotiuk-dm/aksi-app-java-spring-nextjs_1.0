'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  IconButton,
} from '@mui/material';
import { QrCodeScanner, Refresh } from '@mui/icons-material';
import { useOrderOnepageStore } from '../store/order-onepage.store';
import {
  useStage1InitializeBasicOrder,
  useStage1UpdateBasicOrder,
  useStage1GenerateReceiptNumber,
  useStage1GetBranchesForSession,
  useStage1GetBasicOrderData,
  type BasicOrderInfoDTO,
} from '@/shared/api/generated/stage1';
import { z } from 'zod';

// Схема для форми базової інформації замовлення
const basicOrderFormSchema = z.object({
  receiptNumber: z.string().optional(),
  uniqueTag: z.string().optional(),
  selectedBranchId: z.string().min(1, 'Оберіть філію'),
  creationDate: z.string().optional(),
});

type BasicOrderFormData = z.infer<typeof basicOrderFormSchema>;

export const OrderBasicInfoForm = () => {
  const { sessionId } = useOrderOnepageStore();

  // API хуки
  const initializeOrder = useStage1InitializeBasicOrder();
  const updateOrder = useStage1UpdateBasicOrder();
  const generateReceiptNumber = useStage1GenerateReceiptNumber();
  const { data: branches } = useStage1GetBranchesForSession(sessionId ?? '', {
    query: { enabled: !!sessionId },
  });
  const { data: orderData } = useStage1GetBasicOrderData(sessionId ?? '', {
    query: { enabled: !!sessionId },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BasicOrderFormData>({
    resolver: zodResolver(basicOrderFormSchema),
    defaultValues: {
      receiptNumber: '',
      uniqueTag: '',
      selectedBranchId: '',
      creationDate: new Date().toISOString().split('T')[0],
    },
  });

  // Ініціалізація замовлення при завантаженні
  useEffect(() => {
    if (sessionId && !orderData) {
      initializeOrder.mutate(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, orderData]);

  // Заповнення форми даними з API
  useEffect(() => {
    if (orderData) {
      setValue('receiptNumber', orderData.receiptNumber ?? '');
      setValue('uniqueTag', orderData.uniqueTag ?? '');
      setValue('selectedBranchId', orderData.selectedBranchId ?? '');
      // Перетворюємо LocalDateTime з бекенду в формат дати для input[type="date"]
      const dateValue = orderData.creationDate
        ? new Date(orderData.creationDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      setValue('creationDate', dateValue);
    }
  }, [orderData, setValue]);

  const onSubmit = async (data: BasicOrderFormData) => {
    if (!sessionId) return;

    try {
      // Перетворюємо дані форми в формат BasicOrderInfoDTO
      const orderInfo: BasicOrderInfoDTO = {
        receiptNumber: data.receiptNumber,
        uniqueTag: data.uniqueTag,
        selectedBranchId: data.selectedBranchId,
        // Перетворюємо дату в LocalDateTime формат (ISO з часом)
        creationDate: new Date(data.creationDate + 'T00:00:00').toISOString(),
      };

      await updateOrder.mutateAsync({
        sessionId,
        data: orderInfo,
      });
    } catch (error) {
      console.error('Помилка оновлення замовлення:', error);
    }
  };

  const handleGenerateReceiptNumber = async () => {
    if (!sessionId) return;

    try {
      // Отримуємо код поточної філії або використовуємо дефолтний
      const selectedBranch = branches?.find((branch) => branch.id === orderData?.selectedBranchId);
      const branchCode = selectedBranch?.code || branches?.[0]?.code || 'DEFAULT';

      // Використовуємо спеціальний API для генерації номера квитанції
      const newReceiptNumber = await generateReceiptNumber.mutateAsync({
        sessionId,
        params: { branchCode },
      });

      // Оновлюємо поле в формі
      setValue('receiptNumber', newReceiptNumber);
    } catch (error) {
      console.error('Помилка генерації номера квитанції:', error);
    }
  };

  const handleScanQRCode = () => {
    // Реалізація QR-сканера відкладена до інтеграції з мобільною камерою
    console.log('Сканування QR коду');
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Базова інформація замовлення
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* Номер квитанції */}
          <Controller
            name="receiptNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Номер квитанції"
                error={!!errors.receiptNumber}
                helperText={errors.receiptNumber?.message}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <IconButton
                        onClick={handleGenerateReceiptNumber}
                        size="small"
                        title="Згенерувати номер"
                      >
                        <Refresh />
                      </IconButton>
                    ),
                  },
                }}
              />
            )}
          />

          {/* Унікальна мітка */}
          <Controller
            name="uniqueTag"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Унікальна мітка"
                error={!!errors.uniqueTag}
                helperText={errors.uniqueTag?.message}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <IconButton onClick={handleScanQRCode} size="small" title="Сканувати QR код">
                        <QrCodeScanner />
                      </IconButton>
                    ),
                  },
                }}
              />
            )}
          />

          {/* Філія */}
          <Controller
            name="selectedBranchId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.selectedBranchId}>
                <InputLabel>Пункт прийому (філія) *</InputLabel>
                <Select {...field} label="Пункт прийому (філія) *">
                  {branches?.map((branch) => (
                    <MenuItem key={branch.id ?? branch.name} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.selectedBranchId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.selectedBranchId.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          {/* Дата створення */}
          <Controller
            name="creationDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Дата створення"
                type="date"
                error={!!errors.creationDate}
                helperText={errors.creationDate?.message}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            )}
          />

          {/* Кнопка збереження */}
          <Button type="submit" variant="contained" disabled={updateOrder.isPending} fullWidth>
            {updateOrder.isPending ? 'Збереження...' : 'Зберегти інформацію'}
          </Button>

          {/* Помилки */}
          {(initializeOrder.error || updateOrder.error) && (
            <Alert severity="error">
              Помилка: {initializeOrder.error?.message || updateOrder.error?.message}
            </Alert>
          )}
        </Stack>
      </form>
    </Box>
  );
};
