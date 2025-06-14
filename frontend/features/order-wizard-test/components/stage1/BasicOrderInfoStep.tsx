'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Save as SaveIcon, QrCodeScanner as QrIcon } from '@mui/icons-material';

// Готові Orval хуки та типи
import {
  useStage1GetBasicOrderData,
  useStage1UpdateBasicOrder,
  useStage1SelectBranch,
  useStage1SetUniqueTag,
  useStage1GenerateReceiptNumber,
  useStage1GetBranchesForSession,
  type BasicOrderInfoDTO,
  type BranchLocationDTO,
} from '@/shared/api/generated/stage1';

interface BasicOrderInfoStepProps {
  sessionId: string;
  onComplete: () => void;
  onBack: () => void;
}

/**
 * Крок 3: Базова інформація замовлення
 * Використовує готові Orval хуки БЕЗ дублювання логіки
 */
export const BasicOrderInfoStep = ({ sessionId, onComplete, onBack }: BasicOrderInfoStepProps) => {
  // Стан форми
  const [formData, setFormData] = useState({
    selectedBranchId: '',
    uniqueTag: '',
    receiptNumber: '',
  });

  // Готові Orval хуки
  const basicOrderData = useStage1GetBasicOrderData(sessionId, {
    query: { enabled: !!sessionId },
  });
  const branchesData = useStage1GetBranchesForSession(sessionId, {
    query: { enabled: !!sessionId },
  });
  const updateMutation = useStage1UpdateBasicOrder();
  const selectBranchMutation = useStage1SelectBranch();
  const setUniqueTagMutation = useStage1SetUniqueTag();
  const generateReceiptMutation = useStage1GenerateReceiptNumber();

  // Завантаження існуючих даних
  useEffect(() => {
    if (basicOrderData.data) {
      setFormData({
        selectedBranchId: basicOrderData.data.selectedBranchId || '',
        uniqueTag: basicOrderData.data.uniqueTag || '',
        receiptNumber: basicOrderData.data.receiptNumber || '',
      });
    }
  }, [basicOrderData.data]);

  // Вибір філії
  const handleBranchSelect = async (branchId: string) => {
    try {
      await selectBranchMutation.mutateAsync({
        sessionId,
        params: { branchId },
      });
      setFormData((prev) => ({ ...prev, selectedBranchId: branchId }));

      // Автоматично генеруємо номер квитанції після вибору філії
      const selectedBranch = branchesData.data?.find((b) => b.id === branchId);
      if (selectedBranch?.code) {
        handleGenerateReceipt(selectedBranch.code);
      }
    } catch (error) {
      console.error('Помилка вибору філії:', error);
    }
  };

  // Генерація номера квитанції
  const handleGenerateReceipt = async (branchCode?: string) => {
    if (!formData.selectedBranchId && !branchCode) {
      alert('Спочатку виберіть філію');
      return;
    }

    try {
      const selectedBranch = branchesData.data?.find((b) => b.id === formData.selectedBranchId);
      const codeToUse = branchCode || selectedBranch?.code;

      if (!codeToUse) {
        alert('Не вдалося знайти код філії');
        return;
      }

      const receiptNumber = await generateReceiptMutation.mutateAsync({
        sessionId,
        params: { branchCode: codeToUse },
      });

      setFormData((prev) => ({
        ...prev,
        receiptNumber: receiptNumber || '',
      }));
    } catch (error) {
      console.error('Помилка генерації номера квитанції:', error);
    }
  };

  // Встановлення унікальної мітки
  const handleSetUniqueTag = async (tag: string) => {
    if (!tag.trim()) return;

    try {
      await setUniqueTagMutation.mutateAsync({
        sessionId,
        params: { uniqueTag: tag },
      });
      setFormData((prev) => ({ ...prev, uniqueTag: tag }));
    } catch (error) {
      console.error('Помилка встановлення унікальної мітки:', error);
    }
  };

  // Збереження та завершення кроку
  const handleSave = async () => {
    if (!formData.selectedBranchId || !formData.receiptNumber || !formData.uniqueTag) {
      alert('Заповніть всі поля: філія, номер квитанції, унікальна мітка');
      return;
    }

    try {
      const selectedBranch = branchesData.data?.find((b) => b.id === formData.selectedBranchId);

      const updateData: BasicOrderInfoDTO = {
        selectedBranchId: formData.selectedBranchId,
        selectedBranch: selectedBranch,
        receiptNumber: formData.receiptNumber,
        uniqueTag: formData.uniqueTag,
        creationDate: new Date().toISOString(),
        receiptNumberGenerated: true,
        uniqueTagEntered: true,
        branchSelected: true,
        creationDateSet: true,
        complete: true,
      };

      await updateMutation.mutateAsync({
        sessionId,
        data: updateData,
      });
      onComplete();
    } catch (error) {
      console.error('Помилка збереження базової інформації:', error);
    }
  };

  const isLoading =
    updateMutation.isPending ||
    selectBranchMutation.isPending ||
    setUniqueTagMutation.isPending ||
    generateReceiptMutation.isPending;

  const selectedBranch = branchesData.data?.find((b) => b.id === formData.selectedBranchId);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Базова інформація замовлення
      </Typography>

      {(basicOrderData.isLoading || branchesData.isLoading) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CircularProgress size={20} />
          <Typography>Завантаження даних...</Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Вибір філії */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required>
            <InputLabel>Пункт прийому замовлення (філія)</InputLabel>
            <Select
              value={formData.selectedBranchId}
              onChange={(e) => handleBranchSelect(e.target.value)}
              disabled={selectBranchMutation.isPending}
            >
              {branchesData.data?.map((branch: BranchLocationDTO) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name} - {branch.address}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Номер квитанції */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              required
              label="Номер квитанції"
              value={formData.receiptNumber}
              disabled
              helperText="Генерується автоматично після вибору філії"
            />
            <Button
              variant="outlined"
              onClick={() => handleGenerateReceipt()}
              disabled={!formData.selectedBranchId || generateReceiptMutation.isPending}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              {generateReceiptMutation.isPending ? <CircularProgress size={20} /> : 'Генерувати'}
            </Button>
          </Box>
        </Grid>

        {/* Унікальна мітка */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              required
              label="Унікальна мітка"
              placeholder="Введіть або відскануйте"
              value={formData.uniqueTag}
              onChange={(e) => setFormData((prev) => ({ ...prev, uniqueTag: e.target.value }))}
              onBlur={(e) => e.target.value && handleSetUniqueTag(e.target.value)}
            />
            <Button
              variant="outlined"
              startIcon={<QrIcon />}
              sx={{ minWidth: 'auto', px: 2 }}
              onClick={() => alert('Функція сканування QR коду буде реалізована пізніше')}
            >
              Сканувати
            </Button>
          </Box>
        </Grid>

        {/* Дата створення (автоматично) */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Дата створення замовлення"
            value={new Date().toLocaleDateString('uk-UA')}
            disabled
            helperText="Встановлюється автоматично"
          />
        </Grid>

        {/* Підсумок */}
        {formData.selectedBranchId && formData.receiptNumber && formData.uniqueTag && (
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={1}
              sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Підсумок замовлення:
              </Typography>
              <Typography variant="body2">• Філія: {selectedBranch?.name}</Typography>
              <Typography variant="body2">• Номер квитанції: {formData.receiptNumber}</Typography>
              <Typography variant="body2">• Унікальна мітка: {formData.uniqueTag}</Typography>
              <Typography variant="body2">
                • Дата: {new Date().toLocaleDateString('uk-UA')}
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* Кнопки */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={onBack}>Назад</Button>

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={
                isLoading ||
                !formData.selectedBranchId ||
                !formData.receiptNumber ||
                !formData.uniqueTag
              }
              startIcon={isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
            >
              {isLoading ? 'Збереження...' : 'Завершити Stage1'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Помилки */}
      {(updateMutation.error ||
        selectBranchMutation.error ||
        setUniqueTagMutation.error ||
        generateReceiptMutation.error) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Помилка:{' '}
          {
            (
              updateMutation.error ||
              selectBranchMutation.error ||
              setUniqueTagMutation.error ||
              generateReceiptMutation.error
            )?.message
          }
        </Alert>
      )}
    </Box>
  );
};
