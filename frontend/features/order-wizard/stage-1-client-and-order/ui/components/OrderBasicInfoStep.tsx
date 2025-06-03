/**
 * @fileoverview Підетап 1.2: Базова інформація замовлення
 */

'use client';

import {
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  QrCodeScanner as QrScannerIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';

import { useBranchLocations } from '@/domain/wizard';

interface OrderBasicInfoStepProps {
  onOrderInfoCompleted: (branchId: string, uniqueTag?: string) => void;
  isLoading: boolean;
  sessionData?: any;
  wizardId?: string;
}

/**
 * 🎯 Підетап 1.2: Базова інформація замовлення
 *
 * Включає:
 * - Номер квитанції (генерується автоматично)
 * - Унікальна мітка (вводиться вручну або сканується)
 * - Пункт прийому замовлення (вибір філії)
 * - Дата створення замовлення (автоматично)
 */
export function OrderBasicInfoStep({
  onOrderInfoCompleted,
  isLoading,
  sessionData,
  wizardId,
}: OrderBasicInfoStepProps) {
  const [branchId, setBranchId] = useState('');
  const [uniqueTag, setUniqueTag] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [createdDate, setCreatedDate] = useState('');

  // Константа для іконок
  const ICON_COLOR = 'action.active';

  // Отримуємо філії через доменний хук з wizardId
  const {
    branches,
    isLoading: isBranchesLoading,
    error: branchesError,
    isWizardAvailable,
  } = useBranchLocations(wizardId);

  // Ініціалізація значень
  useEffect(() => {
    // Генеруємо номер квитанції
    if (!receiptNumber) {
      const timestamp = Date.now();
      const randomPart = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
      setReceiptNumber(`${timestamp}-${randomPart}`);
    }

    // Встановлюємо поточну дату
    if (!createdDate) {
      setCreatedDate(new Date().toLocaleString('uk-UA'));
    }
  }, [receiptNumber, createdDate]);

  const handleComplete = () => {
    if (!branchId) {
      alert('Оберіть пункт прийому замовлення');
      return;
    }

    onOrderInfoCompleted(branchId, uniqueTag || undefined);
  };

  const handleScanQR = () => {
    // TODO: Реалізувати сканування QR-код/штрих-код
    console.log('Сканування мітки');
    // Тимчасово встановлюємо тестове значення
    setUniqueTag(`QR-${Date.now()}`);
  };

  // Відображаємо повідомлення якщо wizard недоступний
  if (!isWizardAvailable) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            ⚠️ Wizard недоступний
          </Typography>
          <Typography variant="body2">
            Для отримання списку філій потрібен активний wizard. Спочатку створіть wizard.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Заголовок підетапу */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          1.2. Базова інформація замовлення
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Заповніть основні дані для створення замовлення
        </Typography>
      </Box>

      {/* Інформація про обраного клієнта */}
      {sessionData?.client && (
        <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircleIcon />}>
          <Typography variant="subtitle2" gutterBottom>
            ✅ Клієнт обрано
          </Typography>
          <Box>
            <Typography variant="body2">
              <strong>Ім&apos;я:</strong> {sessionData.client.firstName}{' '}
              {sessionData.client.lastName}
            </Typography>
            <Typography variant="body2">
              <strong>Телефон:</strong> {sessionData.client.phone}
            </Typography>
            {sessionData.client.email && (
              <Typography variant="body2">
                <strong>Email:</strong> {sessionData.client.email}
              </Typography>
            )}
          </Box>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Номер квитанції */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Номер квитанції"
            value={receiptNumber}
            InputProps={{
              readOnly: true,
              startAdornment: <AssignmentIcon sx={{ mr: 1, color: ICON_COLOR }} />,
            }}
            helperText="Генерується автоматично"
            variant="filled"
          />
        </Grid>

        {/* Дата створення */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Дата створення замовлення"
            value={createdDate}
            InputProps={{
              readOnly: true,
              startAdornment: <CalendarIcon sx={{ mr: 1, color: ICON_COLOR }} />,
            }}
            helperText="Встановлюється автоматично"
            variant="filled"
          />
        </Grid>

        {/* Пункт прийому замовлення */}
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth required>
            <InputLabel>Пункт прийому замовлення</InputLabel>
            <Select
              value={branchId}
              label="Пункт прийому замовлення"
              onChange={(e) => setBranchId(e.target.value)}
              startAdornment={<LocationIcon sx={{ mr: 1, color: ICON_COLOR }} />}
              disabled={isBranchesLoading || !branches.length}
            >
              <MenuItem value="">
                <em>
                  {isBranchesLoading
                    ? 'Завантаження філій з wizard...'
                    : branches.length === 0
                      ? 'Філії не знайдені в wizard data'
                      : 'Оберіть філію'}
                </em>
              </MenuItem>
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Індикатор завантаження */}
          {isBranchesLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Завантаження філій з wizard state...
              </Typography>
            </Box>
          )}

          {/* Повідомлення якщо філії не знайдені */}
          {!isBranchesLoading && branches.length === 0 && (
            <Alert severity="info" sx={{ mt: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                📍 Філії не знайдені
              </Typography>
              <Typography variant="body2">
                Філії повинні завантажуватися автоматично через wizard API. Можливо backend ще не
                додав філії до wizard data.
              </Typography>
            </Alert>
          )}

          {/* Помилка завантаження */}
          {branchesError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                ❌ Помилка завантаження філій
              </Typography>
              <Typography variant="body2">
                {branchesError.message || 'Не вдалося завантажити філії з wizard API'}
              </Typography>
            </Alert>
          )}

          {/* Адреса обраної філії */}
          {branchId && branches.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Адреса: {branches.find((b) => b.id === branchId)?.address}
            </Typography>
          )}
        </Grid>

        {/* Унікальна мітка */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Унікальна мітка"
            placeholder="Введіть або скануйте унікальну мітку"
            value={uniqueTag}
            onChange={(e) => setUniqueTag(e.target.value)}
            helperText="Необов'язково. Можна ввести вручну або скануйти QR-код/штрих-код"
            InputProps={{
              endAdornment: (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleScanQR}
                  startIcon={<QrScannerIcon />}
                  sx={{ ml: 1 }}
                >
                  Сканувати
                </Button>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Підсумкова інформація */}
      <Card sx={{ mt: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <AssignmentIcon sx={{ mr: 1 }} />
            📋 Підсумок
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Номер квитанції:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {receiptNumber}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Дата створення:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {createdDate}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Філія:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {branchId && branches.length > 0
                    ? branches.find((b) => b.id === branchId)?.name || 'Завантаження...'
                    : 'Не обрано'}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Унікальна мітка:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {uniqueTag || 'Не вказано'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Кнопка завершення */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleComplete}
          disabled={isLoading || !branchId}
          startIcon={<CheckCircleIcon />}
        >
          {isLoading ? 'Збереження...' : 'Завершити етап 1'}
        </Button>
      </Box>
    </Box>
  );
}
