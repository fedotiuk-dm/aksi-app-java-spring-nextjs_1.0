'use client';

import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Save as SaveIcon, QrCodeScanner as QrIcon } from '@mui/icons-material';

// Готові UI компоненти
import { StepContainer, ActionButton } from '@/shared/ui';

// Прямі Orval хуки
import {
  useStage1GetBranchesForSession,
  useStage1SelectBranch,
  useStage1SetUniqueTag,
  useStage1GenerateReceiptNumber,
  type BranchLocationDTO,
} from '@/shared/api/generated/stage1';

// Стор
import { useStage1WizardStore } from '../../stores/stage1-wizard.store';

interface BasicOrderInfoStepProps {
  sessionId: string;
  onComplete: () => void;
  onBack: () => void;
}

/**
 * Крок базової інформації замовлення
 * Використовує готові UI компоненти + прямі Orval хуки
 */
export const BasicOrderInfoStep = ({ sessionId, onComplete, onBack }: BasicOrderInfoStepProps) => {
  // ========== СТОР ==========
  const {
    selectedBranchId,
    setSelectedBranchId,
    receiptNumber,
    setReceiptNumber,
    uniqueTag,
    setUniqueTag,
  } = useStage1WizardStore();

  // ========== ЛОКАЛЬНИЙ СТАН ==========
  const [localUniqueTag, setLocalUniqueTag] = useState(uniqueTag);

  // ========== ORVAL ХУКИ ==========
  const branchesQuery = useStage1GetBranchesForSession(sessionId, {
    query: { enabled: !!sessionId },
  });

  const selectBranchMutation = useStage1SelectBranch({
    mutation: {
      onSuccess: (data) => {
        console.log('✅ Філія успішно обрана:', data);
      },
      onError: (error) => {
        console.error('❌ Помилка вибору філії:', error);
      },
    },
  });

  const setUniqueTagMutation = useStage1SetUniqueTag({
    mutation: {
      onSuccess: (data) => {
        console.log('✅ Унікальна мітка встановлена:', data);
        onComplete();
      },
      onError: (error) => {
        console.error('❌ Помилка встановлення мітки:', error);
      },
    },
  });

  const generateReceiptMutation = useStage1GenerateReceiptNumber({
    mutation: {
      onSuccess: (data) => {
        console.log('✅ Номер квитанції згенеровано:', data);
        setReceiptNumber(data || '');
      },
      onError: (error) => {
        console.error('❌ Помилка генерації номера:', error);
      },
    },
  });

  // ========== EFFECTS ==========
  useEffect(() => {
    setLocalUniqueTag(uniqueTag);
  }, [uniqueTag]);

  // ========== EVENT HANDLERS ==========
  const handleBranchSelect = async (branchId: string) => {
    setSelectedBranchId(branchId);

    try {
      await selectBranchMutation.mutateAsync({
        sessionId,
        params: { branchId },
      });

      // Автоматично генеруємо номер квитанції після вибору філії
      if (!receiptNumber) {
        const selectedBranchData = branchesQuery.data?.find(
          (b: BranchLocationDTO) => b.id === branchId
        );
        if (selectedBranchData?.code) {
          await generateReceiptMutation.mutateAsync({
            sessionId,
            params: { branchCode: selectedBranchData.code },
          });
        }
      }
    } catch (error) {
      console.error('❌ Помилка обробки вибору філії:', error);
    }
  };

  const handleUniqueTagChange = (value: string) => {
    setLocalUniqueTag(value);
    setUniqueTag(value);
  };

  const handleComplete = async () => {
    if (!localUniqueTag.trim()) {
      alert('Будь ласка, введіть унікальну мітку');
      return;
    }

    try {
      await setUniqueTagMutation.mutateAsync({
        sessionId,
        params: { uniqueTag: localUniqueTag.trim() },
      });
    } catch (error) {
      console.error('❌ Помилка завершення кроку:', error);
    }
  };

  // ========== COMPUTED VALUES ==========
  const branches = branchesQuery.data || [];
  const selectedBranch = branches.find((b: BranchLocationDTO) => b.id === selectedBranchId);
  const isLoading = selectBranchMutation.isPending || setUniqueTagMutation.isPending;
  const canComplete = selectedBranchId && receiptNumber && localUniqueTag.trim();

  return (
    <StepContainer
      title="Базова інформація замовлення"
      subtitle="Оберіть філію та введіть унікальну мітку"
    >
      <Grid container spacing={3}>
        {/* Вибір філії */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Пункт прийому (філія)</InputLabel>
            <Select
              value={selectedBranchId || ''}
              onChange={(e) => handleBranchSelect(e.target.value)}
              disabled={selectBranchMutation.isPending}
              label="Пункт прийому (філія)"
            >
              {branches.map((branch: BranchLocationDTO) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name} - {branch.address}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Номер квитанції */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Номер квитанції"
            value={receiptNumber || ''}
            disabled
            helperText="Генерується автоматично після вибору філії"
            InputProps={{
              endAdornment: generateReceiptMutation.isPending && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        {/* Унікальна мітка */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Унікальна мітка"
            value={localUniqueTag}
            onChange={(e) => handleUniqueTagChange(e.target.value)}
            placeholder="Введіть або відскануйте унікальну мітку"
            helperText="Унікальний ідентифікатор для відстеження замовлення"
            InputProps={{
              endAdornment: (
                <Button
                  size="small"
                  startIcon={<QrIcon />}
                  onClick={() => {
                    // TODO: Реалізувати сканування QR коду
                    console.log('Сканування QR коду');
                  }}
                >
                  Сканувати
                </Button>
              ),
            }}
          />
        </Grid>

        {/* Інформація про обрану філію */}
        {selectedBranch && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="info">
              <Typography variant="subtitle2">Обрана філія:</Typography>
              <Typography variant="body2">
                <strong>{selectedBranch.name}</strong>
              </Typography>
              <Typography variant="body2">📍 {selectedBranch.address}</Typography>
              {selectedBranch.phone && (
                <Typography variant="body2">📞 {selectedBranch.phone}</Typography>
              )}
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Кнопки дій */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>
          Назад
        </Button>

        <ActionButton
          variant="contained"
          onClick={handleComplete}
          disabled={!canComplete}
          loading={isLoading}
          loadingText="Збереження..."
          startIcon={<SaveIcon />}
        >
          Завершити етап 1
        </ActionButton>
      </Box>

      {/* Помилки */}
      {selectBranchMutation.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Помилка вибору філії: {selectBranchMutation.error.message}
        </Alert>
      )}

      {setUniqueTagMutation.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Помилка встановлення мітки: {setUniqueTagMutation.error.message}
        </Alert>
      )}

      {generateReceiptMutation.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Помилка генерації номера: {generateReceiptMutation.error.message}
        </Alert>
      )}
    </StepContainer>
  );
};
