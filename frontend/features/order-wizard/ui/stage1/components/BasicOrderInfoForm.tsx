'use client';

import {
  Receipt as ReceiptIcon,
  QrCode as QrCodeIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import {
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import React from 'react';

interface Branch {
  id: string;
  name: string;
  address: string;
}

interface BasicOrderInfoFormProps {
  // Номер квитанції
  receiptNumber?: string;

  // Вибір філії
  selectedBranchId: string;
  onBranchChange: (branchId: string) => void;
  availableBranches: Branch[];
  onBranchConfirm: () => void;
  isBranchConfirmed: boolean;

  // Унікальна мітка
  uniqueTag: string;
  onUniqueTagChange: (tag: string) => void;
  onUniqueTagConfirm: () => void;
  onScanQrCode: () => void;
  isTagConfirmed: boolean;

  // Дата замовлення
  orderDate?: string;

  // Стан завантаження
  isUpdating: boolean;
  isGeneratingReceipt: boolean;

  // Помилки
  errors?: {
    branchId?: string;
    uniqueTag?: string;
  };
}

export const BasicOrderInfoForm: React.FC<BasicOrderInfoFormProps> = ({
  receiptNumber,
  selectedBranchId,
  onBranchChange,
  availableBranches,
  onBranchConfirm,
  isBranchConfirmed,
  uniqueTag,
  onUniqueTagChange,
  onUniqueTagConfirm,
  onScanQrCode,
  isTagConfirmed,
  orderDate,
  isUpdating,
  isGeneratingReceipt,
  errors = {},
}) => {
  return (
    <Stack spacing={3}>
      {/* КРОК 1: Вибір філії */}
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon color="primary" />
          Крок 1: Пункт прийому замовлення
        </Typography>

        <FormControl fullWidth error={!!errors.branchId}>
          <InputLabel>Оберіть філію *</InputLabel>
          <Select
            value={selectedBranchId}
            onChange={(e) => onBranchChange(e.target.value)}
            label="Оберіть філію *"
            disabled={isBranchConfirmed}
          >
            {availableBranches.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>
                <Stack>
                  <Typography variant="body1">{branch.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {branch.address}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
          {errors.branchId && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {errors.branchId}
            </Typography>
          )}
        </FormControl>

        {!isBranchConfirmed && (
          <Button
            variant="outlined"
            onClick={onBranchConfirm}
            disabled={isUpdating || !selectedBranchId}
            sx={{ alignSelf: 'flex-start' }}
          >
            {isUpdating ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Вибір філії...
              </>
            ) : (
              'Підтвердити філію'
            )}
          </Button>
        )}

        {isBranchConfirmed && (
          <Alert severity="success">
            <Typography variant="body2">
              <strong>Обрана філія:</strong>{' '}
              {availableBranches.find((b) => b.id === selectedBranchId)?.name}
            </Typography>
          </Alert>
        )}
      </Stack>

      {/* КРОК 2: Номер квитанції (тільки після вибору філії) */}
      {isBranchConfirmed && (
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon color="primary" />
            Крок 2: Номер квитанції
          </Typography>

          <Paper sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Автоматично згенерований номер квитанції:
            </Typography>
            <Typography variant="h4" color="primary.main" sx={{ fontFamily: 'monospace' }}>
              {receiptNumber || 'Генерується...'}
            </Typography>
            {isGeneratingReceipt && <CircularProgress size={20} sx={{ mt: 1 }} />}
          </Paper>
        </Stack>
      )}

      {/* КРОК 3: Унікальна мітка (тільки після генерації номера) */}
      {isBranchConfirmed && receiptNumber && (
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QrCodeIcon color="primary" />
            Крок 3: Унікальна мітка
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Введіть унікальну мітку вручну або скануйте QR-код
          </Typography>

          <TextField
            value={uniqueTag}
            onChange={(e) => onUniqueTagChange(e.target.value)}
            label="Унікальна мітка *"
            placeholder="Введіть або скануйте мітку"
            fullWidth
            disabled={isTagConfirmed}
            error={!!errors.uniqueTag}
            helperText={errors.uniqueTag}
            InputProps={{
              startAdornment: <QrCodeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />

          {!isTagConfirmed && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={onUniqueTagConfirm}
                disabled={isUpdating || !uniqueTag}
              >
                {isUpdating ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Встановлення...
                  </>
                ) : (
                  'Підтвердити мітку'
                )}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                disabled={isUpdating}
                onClick={onScanQrCode}
              >
                Сканувати QR-код
              </Button>
            </Stack>
          )}

          {isTagConfirmed && (
            <Alert severity="success">
              <Typography variant="body2">
                <strong>Унікальна мітка:</strong> {uniqueTag}
              </Typography>
            </Alert>
          )}
        </Stack>
      )}

      {/* Дата створення замовлення */}
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon color="primary" />
          Дата створення замовлення
        </Typography>

        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Автоматично встановлена дата:
          </Typography>
          <Typography variant="h6" color="primary.main">
            {orderDate ? new Date(orderDate).toLocaleString('uk-UA') : 'Встановлюється...'}
          </Typography>
        </Paper>
      </Stack>
    </Stack>
  );
};
