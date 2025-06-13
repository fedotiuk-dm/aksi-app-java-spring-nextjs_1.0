'use client';

import { FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  Chip,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  QrCode as QrCodeIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

import { useBasicOrderInfo } from '@/domains/wizard/stage1';

interface BasicOrderInfoStepProps {
  onCompleted?: () => void;
}

const ACTION_ACTIVE_COLOR = 'action.active';
const TEXT_PRIMARY_COLOR = 'text.primary';
const TEXT_SECONDARY_COLOR = 'text.secondary';
const SUCCESS_MAIN_COLOR = 'success.main';
const BODY2_VARIANT = 'body2';

export const BasicOrderInfoStep: FC<BasicOrderInfoStepProps> = ({ onCompleted }) => {
  const { data, loading, actions, form, computed } = useBasicOrderInfo();

  const handleSubmit = () => {
    const formData = form.getValues();
    actions.updateBasicOrder(formData);
    if (computed.canCompleteBasicOrder) {
      actions.completeBasicOrder();
      onCompleted?.();
    }
  };

  const handleBranchSelect = (branchId: string) => {
    actions.selectBranch(branchId);
  };

  const handleUniqueTagChange = (value: string) => {
    if (value) {
      actions.setUniqueTag(value);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('uk-UA');
    } catch {
      return dateString;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Заголовок */}
      <Typography variant="h5" component="h2" gutterBottom>
        Базова інформація замовлення
      </Typography>

      <Typography variant={BODY2_VARIANT} color={TEXT_SECONDARY_COLOR} sx={{ mb: 3 }}>
        Вкажіть основні дані для створення замовлення
      </Typography>

      {/* Помилка завантаження */}
      {loading.isLoadingBasicOrderData && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Завантаження даних замовлення...
        </Alert>
      )}

      {/* Основна форма */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Номер квитанції */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                value={data.basicOrderData?.receiptNumber || ''}
                fullWidth
                label="Номер квитанції"
                disabled
                helperText="Генерується автоматично"
                InputProps={{
                  startAdornment: <ReceiptIcon sx={{ mr: 1, color: ACTION_ACTIVE_COLOR }} />,
                }}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    color: TEXT_PRIMARY_COLOR,
                    WebkitTextFillColor: TEXT_PRIMARY_COLOR,
                  },
                }}
              />

              {!computed.hasReceiptNumber && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => actions.generateReceiptNumber()}
                  disabled={loading.isGeneratingReceiptNumber}
                  sx={{ mt: 1 }}
                >
                  {loading.isGeneratingReceiptNumber ? 'Генерування...' : 'Згенерувати номер'}
                </Button>
              )}
            </Grid>

            {/* Дата створення */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                value={formatDate(data.basicOrderData?.creationDate)}
                fullWidth
                label="Дата створення"
                disabled
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: ACTION_ACTIVE_COLOR }} />,
                }}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    color: TEXT_PRIMARY_COLOR,
                    WebkitTextFillColor: TEXT_PRIMARY_COLOR,
                  },
                }}
              />
            </Grid>

            {/* Унікальна мітка */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                {...form.register('uniqueTag')}
                value={form.watch('uniqueTag') || ''}
                onChange={(e) => handleUniqueTagChange(e.target.value)}
                fullWidth
                label="Унікальна мітка *"
                placeholder="Введіть або відскануйте мітку"
                error={!!form.formState.errors.uniqueTag}
                helperText={form.formState.errors.uniqueTag?.message}
                InputProps={{
                  startAdornment: <QrCodeIcon sx={{ mr: 1, color: ACTION_ACTIVE_COLOR }} />,
                }}
              />
            </Grid>

            {/* Пункт прийому (філія) */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth error={!!form.formState.errors.selectedBranchId}>
                <InputLabel>Пункт прийому *</InputLabel>
                <Select
                  value={computed.selectedBranchId || ''}
                  onChange={(e) => handleBranchSelect(e.target.value)}
                  label="Пункт прийому *"
                  startAdornment={<BusinessIcon sx={{ mr: 1, color: ACTION_ACTIVE_COLOR }} />}
                >
                  {data.branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      <Box>
                        <Typography variant="body1">{branch.name}</Typography>
                        <Typography variant="caption" color={TEXT_SECONDARY_COLOR}>
                          {branch.address}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {form.formState.errors.selectedBranchId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {form.formState.errors.selectedBranchId.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Вибрана філія */}
      {data.selectedBranch && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Обрана філія
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'primary.50' }}>
              <Typography variant="subtitle1" fontWeight="medium" color="primary.main">
                {data.selectedBranch.name}
              </Typography>
              <Typography variant={BODY2_VARIANT} color={TEXT_SECONDARY_COLOR}>
                {data.selectedBranch.address}
              </Typography>
              {data.selectedBranch.phone && (
                <Typography variant={BODY2_VARIANT} color={TEXT_SECONDARY_COLOR}>
                  Телефон: {data.selectedBranch.phone}
                </Typography>
              )}
            </Paper>
          </CardContent>
        </Card>
      )}

      {/* Індикатори готовності */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Стан заповнення
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label="Номер квитанції"
                color={computed.hasReceiptNumber ? 'success' : 'default'}
                variant={computed.hasReceiptNumber ? 'filled' : 'outlined'}
                size="small"
              />
              <Typography
                variant={BODY2_VARIANT}
                color={computed.hasReceiptNumber ? SUCCESS_MAIN_COLOR : TEXT_SECONDARY_COLOR}
              >
                {computed.hasReceiptNumber ? '✅ Згенеровано' : '⏳ Потрібно згенерувати'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label="Унікальна мітка"
                color={computed.hasUniqueTag ? 'success' : 'default'}
                variant={computed.hasUniqueTag ? 'filled' : 'outlined'}
                size="small"
              />
              <Typography
                variant={BODY2_VARIANT}
                color={computed.hasUniqueTag ? SUCCESS_MAIN_COLOR : TEXT_SECONDARY_COLOR}
              >
                {computed.hasUniqueTag ? '✅ Встановлено' : '⏳ Потрібно вказати'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label="Філія"
                color={computed.selectedBranch ? 'success' : 'default'}
                variant={computed.selectedBranch ? 'filled' : 'outlined'}
                size="small"
              />
              <Typography
                variant={BODY2_VARIANT}
                color={computed.selectedBranch ? SUCCESS_MAIN_COLOR : TEXT_SECONDARY_COLOR}
              >
                {computed.selectedBranch
                  ? `✅ ${computed.selectedBranch.name}`
                  : '⏳ Потрібно обрати'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Кнопки дій */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="outlined" onClick={() => actions.cancelBasicOrderInfo()}>
          Скасувати
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={!computed.canSubmit || loading.isUpdating || loading.isCompleting}
        >
          {loading.isUpdating || loading.isCompleting ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Збереження...
            </>
          ) : (
            'Зберегти та продовжити'
          )}
        </Button>
      </Box>

      {/* Debug інформація (тільки в dev режимі) */}
      {process.env.NODE_ENV === 'development' && (
        <Paper sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
          <Typography variant="caption" color={TEXT_SECONDARY_COLOR}>
            Debug:{' '}
            {JSON.stringify(
              {
                isFormValid: computed.isFormValid,
                canSubmit: computed.canSubmit,
                hasReceiptNumber: computed.hasReceiptNumber,
                hasUniqueTag: computed.hasUniqueTag,
                selectedBranchId: computed.selectedBranchId,
              },
              null,
              2
            )}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
