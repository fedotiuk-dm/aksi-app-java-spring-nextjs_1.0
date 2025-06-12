'use client';

import {
  Receipt as ReceiptIcon,
  QrCode as QrCodeIcon,
  CalendarToday as CalendarIcon,
  AutoAwesome as AutoIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Chip,
  Grid,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import { FC, useState } from 'react';

import { useBasicOrderInfo } from '@/domains/wizard/stage1/basic-order-info';

interface BasicOrderInfoFormProps {
  onDataUpdated?: () => void;
}

export const BasicOrderInfoForm: FC<BasicOrderInfoFormProps> = ({ onDataUpdated }) => {
  const { ui, data, loading, actions } = useBasicOrderInfo();
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);

  const handleGenerateReceiptNumber = async () => {
    if (!ui.selectedBranch?.id) {
      console.error('ID філії не знайдено');
      return;
    }

    try {
      setIsGeneratingReceipt(true);
      await actions.generateReceiptNumberForBranch(ui.selectedBranch.id);
      console.log('✅ Номер квитанції згенеровано для філії:', ui.selectedBranch.name);
      onDataUpdated?.();
    } catch (error) {
      console.error('❌ Помилка генерації номера квитанції:', error);
    } finally {
      setIsGeneratingReceipt(false);
    }
  };

  const handleUniqueTagChange = async (value: string) => {
    // Оновлюємо локальний стан миттєво для UX
    actions.setOrderFormField('uniqueTag', value);

    // Якщо значення не порожнє, відправляємо на сервер
    if (value.trim()) {
      try {
        await actions.setUniqueTagForOrder(value.trim());
        console.log('✅ Унікальна мітка встановлена:', value.trim());
      } catch (error) {
        console.error('❌ Помилка встановлення унікальної мітки:', error);
      }
    }

    onDataUpdated?.();
  };

  // Показуємо форму тільки якщо філія обрана
  if (!ui.selectedBranch) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <ReceiptIcon />
          Основна інформація замовлення
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Заповніть основну інформацію для створення замовлення. Номер квитанції генерується
            автоматично на основі обраної філії.
          </Typography>
        </Alert>

        <Grid container spacing={3}>
          {/* Номер квитанції */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Номер квитанції
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  value={ui.orderFormData.receiptNumber || ''}
                  placeholder="Буде згенеровано автоматично"
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ReceiptIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleGenerateReceiptNumber}
                  disabled={
                    isGeneratingReceipt || loading.isUpdating || loading.isGeneratingReceiptNumber
                  }
                  startIcon={<AutoIcon />}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  {isGeneratingReceipt || loading.isGeneratingReceiptNumber
                    ? 'Генерація...'
                    : 'Генерувати'}
                </Button>
              </Box>
              {ui.orderFormData.receiptNumber && (
                <Chip label="Згенеровано" color="success" size="small" sx={{ mt: 1 }} />
              )}
            </Box>
          </Grid>

          {/* Унікальна мітка */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Унікальна мітка
              </Typography>
              <TextField
                fullWidth
                value={ui.orderFormData.uniqueTag || ''}
                onChange={(e) => handleUniqueTagChange(e.target.value)}
                placeholder="Введіть або скануйте мітку"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <QrCodeIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Сканувати QR-код">
                        <IconButton edge="end" size="small">
                          <QrCodeIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                helperText="Унікальна мітка для ідентифікації замовлення"
              />
            </Box>
          </Grid>

          {/* Дата створення */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Дата створення
              </Typography>
              <TextField
                fullWidth
                value={
                  data.basicOrderData?.creationDate
                    ? new Date(data.basicOrderData.creationDate).toLocaleString('uk-UA')
                    : new Date().toLocaleString('uk-UA')
                }
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                helperText="Встановлюється автоматично"
              />
            </Box>
          </Grid>

          {/* Опис замовлення */}
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Опис замовлення (опціонально)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={ui.orderFormData.description || ''}
                onChange={(e) => actions.setOrderFormField('description', e.target.value)}
                placeholder="Додаткові примітки до замовлення..."
                helperText="Додаткова інформація про замовлення"
              />
            </Box>
          </Grid>
        </Grid>

        {/* Статус заповнення */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Статус заповнення
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="Філія обрана" color="success" size="small" icon={<ReceiptIcon />} />
            <Chip
              label={ui.orderFormData.receiptNumber ? 'Номер згенеровано' : 'Номер не згенеровано'}
              color={ui.orderFormData.receiptNumber ? 'success' : 'default'}
              size="small"
            />
            <Chip
              label={ui.orderFormData.uniqueTag ? 'Мітка введена' : 'Мітка не введена'}
              color={ui.orderFormData.uniqueTag ? 'success' : 'default'}
              size="small"
            />
          </Box>
        </Box>

        {/* Debug інформація */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" component="div">
              Debug: Branch: {ui.selectedBranch?.name}, Receipt:{' '}
              {ui.orderFormData.receiptNumber || 'none'}, Tag:{' '}
              {ui.orderFormData.uniqueTag || 'none'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
