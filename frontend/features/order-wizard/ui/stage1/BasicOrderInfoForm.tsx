'use client';

import {
  Receipt as ReceiptIcon,
  QrCode as QrCodeIcon,
  CalendarToday as CalendarIcon,
  AutoAwesome as AutoIcon,
  LocationOn as LocationIcon,
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
import { FC, useEffect } from 'react';

import { useBasicOrderInfo } from '@/domains/wizard/stage1';

// Компонент для відображення номера квитанції
const ReceiptNumberDisplay: FC<{
  hasReceiptNumber: boolean;
  receiptNumber: string;
  isGenerating: boolean;
  isUpdating: boolean;
  onGenerate: () => void;
  errors?: string;
}> = ({ hasReceiptNumber, receiptNumber, isGenerating, isUpdating, onGenerate, errors }) => {
  if (hasReceiptNumber) {
    return (
      <Card variant="outlined" sx={{ p: 2, bgcolor: 'success.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ReceiptIcon color="success" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="success.main" fontWeight="bold">
              {receiptNumber}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Згенеровано автоматично
            </Typography>
            <Chip
              label="Готово"
              color="success"
              size="small"
              sx={{ mt: 1 }}
              icon={<ReceiptIcon />}
            />
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <TextField
        fullWidth
        placeholder="Буде згенеровано автоматично"
        disabled
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ReceiptIcon color="action" />
            </InputAdornment>
          ),
        }}
        error={!!errors}
        helperText={errors}
      />
      <Button
        variant="contained"
        onClick={onGenerate}
        disabled={isGenerating || isUpdating}
        startIcon={<AutoIcon />}
        sx={{ minWidth: 'auto', px: 2 }}
      >
        {isGenerating ? 'Генерація...' : 'Генерувати'}
      </Button>
    </Box>
  );
};

interface BasicOrderInfoFormProps {
  onDataUpdated?: () => void;
}

export const BasicOrderInfoForm: FC<BasicOrderInfoFormProps> = ({ onDataUpdated }) => {
  const basicOrderInfo = useBasicOrderInfo();

  // Автоматично завантажуємо дані при ініціалізації
  useEffect(() => {
    if (!basicOrderInfo.ui.isBasicOrderInfoMode) {
      basicOrderInfo.actions.startBasicOrderInfo();
    }
  }, [basicOrderInfo.ui.isBasicOrderInfoMode, basicOrderInfo.actions]);

  const handleGenerateReceiptNumber = async () => {
    if (!basicOrderInfo.computed.selectedBranch?.id) {
      console.error('ID філії не знайдено');
      return;
    }

    try {
      await basicOrderInfo.actions.generateReceiptNumber(basicOrderInfo.computed.selectedBranch.id);
      console.log(
        '✅ Номер квитанції згенеровано для філії:',
        basicOrderInfo.computed.selectedBranch.name
      );
      onDataUpdated?.();
    } catch (error) {
      console.error('❌ Помилка генерації номера квитанції:', error);
    }
  };

  const handleUniqueTagChange = async (value: string) => {
    // Оновлюємо форму миттєво для UX
    basicOrderInfo.form.setValue('uniqueTag', value);

    // Якщо значення не порожнє, відправляємо на сервер
    if (value.trim()) {
      try {
        await basicOrderInfo.actions.setUniqueTag(value.trim());
        console.log('✅ Унікальна мітка встановлена:', value.trim());
      } catch (error) {
        console.error('❌ Помилка встановлення унікальної мітки:', error);
      }
    }

    onDataUpdated?.();
  };

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

        <form onSubmit={basicOrderInfo.form.handleSubmit}>
          <Grid container spacing={3}>
            {/* Номер квитанції */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Номер квитанції
                </Typography>
                <ReceiptNumberDisplay
                  hasReceiptNumber={basicOrderInfo.computed.hasReceiptNumber}
                  receiptNumber={basicOrderInfo.form.watch('receiptNumber') || ''}
                  isGenerating={basicOrderInfo.loading.isGeneratingReceiptNumber}
                  isUpdating={basicOrderInfo.loading.isUpdating}
                  onGenerate={handleGenerateReceiptNumber}
                  errors={basicOrderInfo.form.formState.errors.receiptNumber?.message}
                />
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
                  {...basicOrderInfo.form.register('uniqueTag')}
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
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => {
                              // TODO: Реалізувати сканування QR-коду
                              console.log('🔍 Сканування QR-коду');
                            }}
                          >
                            <QrCodeIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                  error={!!basicOrderInfo.form.formState.errors.uniqueTag}
                  helperText={
                    basicOrderInfo.form.formState.errors.uniqueTag?.message ||
                    'Унікальна мітка для ідентифікації замовлення'
                  }
                />
              </Box>
            </Grid>

            {/* Дата створення замовлення */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Дата створення замовлення
                </Typography>
                <Card variant="outlined" sx={{ p: 2, bgcolor: 'success.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalendarIcon color="success" />
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {basicOrderInfo.data.basicOrderData?.creationDate
                          ? new Date(
                              basicOrderInfo.data.basicOrderData.creationDate
                            ).toLocaleDateString('uk-UA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : new Date().toLocaleDateString('uk-UA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {basicOrderInfo.data.basicOrderData?.creationDate
                          ? new Date(
                              basicOrderInfo.data.basicOrderData.creationDate
                            ).toLocaleTimeString('uk-UA', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : new Date().toLocaleTimeString('uk-UA', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                      </Typography>
                      <Chip label="Автоматично" color="success" size="small" sx={{ mt: 1 }} />
                    </Box>
                  </Box>
                </Card>
              </Box>
            </Grid>

            {/* Пункт прийому замовлення (обрана філія) */}
            <Grid size={{ xs: 12 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Пункт прийому замовлення
                </Typography>

                {basicOrderInfo.computed.selectedBranch ? (
                  // Показуємо інформацію про обрану філію
                  <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <LocationIcon color="primary" sx={{ mt: 0.5 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {basicOrderInfo.computed.selectedBranch.name}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          <strong>Адреса:</strong>{' '}
                          {basicOrderInfo.computed.selectedBranch.address || 'Адреса не вказана'}
                        </Typography>

                        {basicOrderInfo.computed.selectedBranch.phone && (
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            <strong>Телефон:</strong> {basicOrderInfo.computed.selectedBranch.phone}
                          </Typography>
                        )}

                        <Chip
                          label="Філія обрана"
                          color="success"
                          size="small"
                          sx={{ mt: 1 }}
                          icon={<LocationIcon />}
                        />
                      </Box>
                    </Box>
                  </Card>
                ) : (
                  // Показуємо компонент вибору філії
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Оберіть філію для продовження оформлення замовлення
                    </Typography>
                    {/* Тут можна додати BranchSelectionPanel або посилання на нього */}
                    <Typography variant="body2" color="textSecondary">
                      Поверніться до розділу вибору клієнта щоб обрати філію
                    </Typography>
                  </Alert>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Кнопки дій */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!basicOrderInfo.computed.canSubmit}
              startIcon={<ReceiptIcon />}
            >
              {basicOrderInfo.loading.isUpdating ? 'Збереження...' : 'Зберегти інформацію'}
            </Button>

            <Button
              variant="outlined"
              onClick={basicOrderInfo.actions.cancelBasicOrderInfo}
              disabled={basicOrderInfo.loading.isUpdating}
            >
              Скасувати
            </Button>
          </Box>
        </form>

        {/* Статус заповнення */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Статус заповнення
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={basicOrderInfo.computed.selectedBranch ? 'Філія обрана' : 'Філія не обрана'}
              color={basicOrderInfo.computed.selectedBranch ? 'success' : 'default'}
              size="small"
              icon={<LocationIcon />}
            />
            <Chip
              label={
                basicOrderInfo.computed.hasReceiptNumber
                  ? 'Номер згенеровано'
                  : 'Номер не згенеровано'
              }
              color={basicOrderInfo.computed.hasReceiptNumber ? 'success' : 'default'}
              size="small"
            />
            <Chip
              label={basicOrderInfo.computed.hasUniqueTag ? 'Мітка введена' : 'Мітка не введена'}
              color={basicOrderInfo.computed.hasUniqueTag ? 'success' : 'default'}
              size="small"
            />
            <Chip
              label={basicOrderInfo.computed.isFormValid ? 'Форма валідна' : 'Форма не валідна'}
              color={basicOrderInfo.computed.isFormValid ? 'success' : 'warning'}
              size="small"
            />
          </Box>
        </Box>

        {/* Debug інформація */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" component="div">
              Debug: Branch: {basicOrderInfo.computed.selectedBranch?.name}, Receipt:{' '}
              {basicOrderInfo.computed.hasReceiptNumber ? 'yes' : 'no'}, Tag:{' '}
              {basicOrderInfo.computed.hasUniqueTag ? 'yes' : 'no'}, Valid:{' '}
              {basicOrderInfo.computed.isFormValid ? 'yes' : 'no'}, Mode:{' '}
              {basicOrderInfo.ui.isBasicOrderInfoMode ? 'active' : 'inactive'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
