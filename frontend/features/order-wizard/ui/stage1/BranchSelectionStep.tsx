'use client';

import { FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  Business as BusinessIcon,
  QrCode as QrCodeIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

import { useBranchSelection } from '@/domains/wizard/stage1';

// Константи для повторюваних рядків
const RECEIPT_GENERATION_SUCCESS_PREFIX = '✅ Номер квитанції: ';
const BRANCH_SELECTION_SUCCESS_PREFIX = '✅ Філія обрана: ';
const UNIQUE_TAG_SUCCESS_PREFIX = '✅ Унікальна мітка: ';
const RECEIPT_GENERATION_PENDING = '⏳ Номер квитанції буде згенеровано';
const RECEIPT_GENERATION_COMPLETED = '✅ Номер квитанції згенеровано';

// Константи для кольорів
const SUCCESS_COLOR = 'success.main';
const SECONDARY_COLOR = 'text.secondary';

// Константи для статусів
const BRANCH_SELECTED_TEXT = '✅ Філія обрана';
const BRANCH_PENDING_TEXT = '⏳ Оберіть філію';
const TAG_ENTERED_TEXT = '✅ Унікальна мітка введена';
const TAG_PENDING_TEXT = '⏳ Введіть унікальну мітку';

// Компонент підсумку готовності
const ReadinessSummary: FC<{
  computed: {
    canCreateOrder: boolean;
    hasBranchSelected: boolean;
    hasUniqueTag: boolean;
    hasReceiptNumber: boolean;
  };
}> = ({ computed }) => (
  <Card sx={{ mb: 3, bgcolor: computed.canCreateOrder ? 'success.50' : 'background.paper' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Готовність до створення замовлення
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label="Філія"
            color={computed.hasBranchSelected ? 'success' : 'default'}
            variant={computed.hasBranchSelected ? 'filled' : 'outlined'}
            size="small"
          />
          <Typography
            variant="body2"
            color={computed.hasBranchSelected ? SUCCESS_COLOR : SECONDARY_COLOR}
          >
            {computed.hasBranchSelected ? BRANCH_SELECTED_TEXT : BRANCH_PENDING_TEXT}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label="Мітка"
            color={computed.hasUniqueTag ? 'success' : 'default'}
            variant={computed.hasUniqueTag ? 'filled' : 'outlined'}
            size="small"
          />
          <Typography
            variant="body2"
            color={computed.hasUniqueTag ? SUCCESS_COLOR : SECONDARY_COLOR}
          >
            {computed.hasUniqueTag ? TAG_ENTERED_TEXT : TAG_PENDING_TEXT}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label="Квитанція"
            color={computed.hasReceiptNumber ? 'success' : 'default'}
            variant={computed.hasReceiptNumber ? 'filled' : 'outlined'}
            size="small"
          />
          <Typography
            variant="body2"
            color={computed.hasReceiptNumber ? SUCCESS_COLOR : SECONDARY_COLOR}
          >
            {computed.hasReceiptNumber ? RECEIPT_GENERATION_COMPLETED : RECEIPT_GENERATION_PENDING}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

interface BranchSelectionStepProps {
  onOrderCreated?: () => void;
  onGoBack?: () => void;
  selectedClientName?: string;
}

export const BranchSelectionStep: FC<BranchSelectionStepProps> = ({
  onOrderCreated,
  onGoBack,
  selectedClientName,
}) => {
  const { data, loading, actions, form, computed } = useBranchSelection();

  const handleCreateOrder = () => {
    actions.createOrder();
    onOrderCreated?.();
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onGoBack} variant="outlined" sx={{ mr: 2 }}>
          Назад
        </Button>
        <Typography variant="h5" component="h2">
          Вибір філії та створення замовлення
        </Typography>
      </Box>

      {/* Інформація про клієнта */}
      {selectedClientName && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Клієнт: <strong>{selectedClientName}</strong>
          </Typography>
        </Alert>
      )}

      {/* Індикатор завантаження */}
      {loading.isAnyLoading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Форма вибору філії */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <BusinessIcon />
            Оберіть філію
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth error={!!form.formState.errors.selectedBranchId}>
                <InputLabel>Філія *</InputLabel>
                <Select
                  {...form.register('selectedBranchId')}
                  value={form.watch('selectedBranchId') || ''}
                  label="Філія *"
                  onChange={(e) => actions.selectBranch(e.target.value)}
                >
                  {data.branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      <Box>
                        <Typography variant="body1">{branch.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
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

            {computed.hasBranchSelected && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="success">
                  <Typography variant="body2">
                    {BRANCH_SELECTION_SUCCESS_PREFIX}
                    {data.selectedBranch?.name}
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Форма унікальної мітки */}
      {computed.hasBranchSelected && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <QrCodeIcon />
              Унікальна мітка
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  {...form.register('uniqueTag')}
                  fullWidth
                  label="Унікальна мітка *"
                  placeholder="Введіть або відскануйте унікальну мітку"
                  error={!!form.formState.errors.uniqueTag}
                  helperText={form.formState.errors.uniqueTag?.message}
                  InputProps={{
                    startAdornment: <QrCodeIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ height: '56px' }}
                  startIcon={<QrCodeIcon />}
                >
                  Сканувати QR
                </Button>
              </Grid>

              {computed.hasUniqueTag && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="success">
                    <Typography variant="body2">
                      {UNIQUE_TAG_SUCCESS_PREFIX}
                      {data.uniqueTag}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Номер квитанції */}
      {computed.hasUniqueTag && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <ReceiptIcon />
              Номер квитанції
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  value={
                    loading.isGeneratingReceiptNumber
                      ? 'Генерується...'
                      : data.receiptNumber || RECEIPT_GENERATION_PENDING
                  }
                  fullWidth
                  label="Номер квитанції"
                  disabled
                  InputProps={{
                    startAdornment: <ReceiptIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>

              {/* Кнопка ручної генерації */}
              {!computed.hasReceiptNumber && !loading.isGeneratingReceiptNumber && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ height: '56px' }}
                    startIcon={<ReceiptIcon />}
                    onClick={() => {
                      if (data.selectedBranch) {
                        actions.generateReceiptNumber(data.selectedBranch.code || 'DEFAULT');
                      }
                    }}
                    disabled={!computed.hasBranchSelected}
                  >
                    Згенерувати
                  </Button>
                </Grid>
              )}

              {/* Індикатор завантаження */}
              {loading.isGeneratingReceiptNumber && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="info" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2">
                      Генерується номер квитанції для філії &ldquo;{data.selectedBranch?.name}
                      &rdquo;...
                    </Typography>
                  </Alert>
                </Grid>
              )}

              {/* Успішна генерація */}
              {computed.hasReceiptNumber && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="success">
                    <Typography variant="body2">
                      {RECEIPT_GENERATION_SUCCESS_PREFIX}
                      {data.receiptNumber}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Підсумок готовності */}
      <ReadinessSummary computed={computed} />

      {/* Кнопка створення замовлення */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={computed.canCreateOrder ? <CheckCircleIcon /> : <ReceiptIcon />}
          onClick={handleCreateOrder}
          disabled={!computed.canCreateOrder || loading.isCreatingOrder}
        >
          {loading.isCreatingOrder ? 'Створення замовлення...' : 'Створити замовлення'}
        </Button>
      </Box>
    </Box>
  );
};
