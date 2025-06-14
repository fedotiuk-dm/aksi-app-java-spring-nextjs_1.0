'use client';

import {
  Receipt as ReceiptIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import React from 'react';

// Доменна логіка
import { useBasicOrderInfo } from '@/domains/wizard/stage1/basic-order-info';

// Компоненти
import { BasicOrderInfoForm } from './components';

interface BasicOrderInfoStepProps {
  selectedClientId: string;
  onOrderInfoCompleted: () => void;
  onGoBack: () => void;
}

export const BasicOrderInfoStep: React.FC<BasicOrderInfoStepProps> = ({
  selectedClientId,
  onOrderInfoCompleted,
  onGoBack,
}) => {
  // ========== ДОМЕННА ЛОГІКА ==========
  const { ui, data, loading, mutations } = useBasicOrderInfo();

  // ========== ЛОКАЛЬНИЙ UI СТАН ==========
  const [errors, setErrors] = React.useState<{ branchId?: string; uniqueTag?: string }>({});

  // ========== ІНІЦІАЛІЗАЦІЯ ==========
  React.useEffect(() => {
    const initializeBasicOrder = async () => {
      if (ui.sessionId && !data.basicOrderData) {
        try {
          // Ініціалізуємо basic order workflow (без параметрів)
          await mutations.initializeBasicOrder.mutateAsync();
        } catch (error) {
          console.error('Помилка ініціалізації basic order:', error);
        }
      }
    };

    initializeBasicOrder();
  }, [ui.sessionId, data.basicOrderData, mutations.initializeBasicOrder]);

  // ========== EVENT HANDLERS ==========
  const handleBranchChange = (branchId: string) => {
    ui.setSelectedBranchId(branchId);
    setErrors((prev) => ({ ...prev, branchId: undefined }));
  };

  const handleBranchConfirm = async () => {
    if (!ui.selectedBranchId) {
      setErrors((prev) => ({ ...prev, branchId: 'Оберіть філію' }));
      return;
    }

    try {
      await mutations.selectBranch.mutateAsync({
        sessionId: ui.sessionId || '',
        params: { branchId: ui.selectedBranchId },
      });
      // Використовуємо складну дію з стору для переходу до наступного кроку
      ui.selectBranchAndProceed(ui.selectedBranchId);

      // Автоматично генеруємо номер квитанції після вибору філії
      await handleGenerateReceiptNumber();
    } catch (error) {
      console.error('Помилка вибору філії:', error);
      setErrors((prev) => ({ ...prev, branchId: 'Помилка вибору філії' }));
    }
  };

  const handleGenerateReceiptNumber = async () => {
    if (!ui.selectedBranchId || !data.branches) return;

    try {
      // Знаходимо код філії за ID
      const selectedBranch = data.branches.find((branch) => branch.id === ui.selectedBranchId);
      if (!selectedBranch?.code) {
        console.error('Не знайдено код філії для ID:', ui.selectedBranchId);
        return;
      }

      // Генеруємо номер квитанції через API
      const receiptNumber = await mutations.generateReceiptNumber.mutateAsync({
        sessionId: ui.sessionId || '',
        params: { branchCode: selectedBranch.code },
      });

      if (receiptNumber) {
        // Використовуємо складну дію з стору
        ui.generateReceiptNumberAndProceed(receiptNumber);
      }
    } catch (error) {
      console.error('Помилка генерації номера квитанції:', error);
    }
  };

  const handleUniqueTagChange = (tag: string) => {
    ui.setUniqueTag(tag);
    setErrors((prev) => ({ ...prev, uniqueTag: undefined }));
  };

  const handleUniqueTagConfirm = async () => {
    if (!ui.uniqueTag || ui.uniqueTag.length < 3) {
      setErrors((prev) => ({
        ...prev,
        uniqueTag: 'Унікальна мітка повинна містити мінімум 3 символи',
      }));
      return;
    }

    try {
      await mutations.updateBasicOrder.mutateAsync({
        sessionId: ui.sessionId || '',
        data: { uniqueTag: ui.uniqueTag },
      });
      // Використовуємо складну дію з стору
      ui.enterUniqueTagAndComplete(ui.uniqueTag);
    } catch (error) {
      console.error('Помилка встановлення унікальної мітки:', error);
      setErrors((prev) => ({ ...prev, uniqueTag: 'Помилка встановлення мітки' }));
    }
  };

  const handleScanQrCode = () => {
    // TODO: Додати логіку сканування QR-коду
    console.log('Сканування QR-коду...');
  };

  const handleCompleteOrderInfo = async () => {
    // Просто викликаємо callback, який передасть управління до Stage1Container
    // Stage1Container сам викличе правильний API для завершення всього етапу
    onOrderInfoCompleted();
  };

  // ========== RENDER ==========
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Заголовок */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onGoBack} variant="outlined" size="small">
          Назад
        </Button>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptIcon color="primary" />
          Базова інформація замовлення
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Заповніть базову інформацію для створення замовлення
      </Typography>

      <Stack spacing={3}>
        {/* Інформація про обраного клієнта */}
        <Card sx={{ bgcolor: 'success.50', borderColor: 'success.main', border: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <CheckCircleIcon color="success" />
              <Box>
                <Typography variant="h6" color="success.main">
                  Обраний клієнт
                </Typography>
                <Typography variant="body1">Клієнт ID: {String(selectedClientId)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Клієнт успішно обраний для замовлення
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Форма базової інформації замовлення */}
        <BasicOrderInfoForm
          receiptNumber={ui.receiptNumber || data.basicOrderData?.receiptNumber || ''}
          selectedBranchId={ui.selectedBranchId || ''}
          onBranchChange={handleBranchChange}
          availableBranches={
            data.branches?.map((branch) => ({
              id: branch.id || '',
              name: branch.name || '',
              address: branch.address || '',
            })) || []
          }
          onBranchConfirm={handleBranchConfirm}
          isBranchConfirmed={ui.isBranchSelected}
          uniqueTag={ui.uniqueTag}
          onUniqueTagChange={handleUniqueTagChange}
          onUniqueTagConfirm={handleUniqueTagConfirm}
          onScanQrCode={handleScanQrCode}
          isTagConfirmed={ui.isUniqueTagScanned}
          orderDate={new Date().toISOString()}
          isUpdating={loading.isUpdating}
          isGeneratingReceipt={loading.isLoadingData}
          errors={errors}
        />

        {/* Помилки валідації */}
        {data.validationResult?.errors &&
          Array.isArray(data.validationResult.errors) &&
          data.validationResult.errors.length > 0 && (
            <Alert severity="error">
              <Typography variant="body2" gutterBottom>
                Виправте наступні помилки:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {data.validationResult.errors.map((error: string, index: number) => (
                  <li key={index}>
                    <Typography variant="body2">{error}</Typography>
                  </li>
                ))}
              </ul>
            </Alert>
          )}

        {/* Кнопки дій */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button variant="outlined" onClick={onGoBack} disabled={loading.isUpdating}>
                Назад до клієнта
              </Button>

              <Button
                variant="contained"
                onClick={handleCompleteOrderInfo}
                disabled={
                  loading.isUpdating ||
                  !ui.isBranchSelected ||
                  !ui.isUniqueTagScanned ||
                  !ui.receiptNumber
                }
                size="large"
                sx={{ minWidth: 200 }}
              >
                {loading.isUpdating ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Завершення...
                  </>
                ) : (
                  'Завершити етап 1'
                )}
              </Button>
            </Stack>

            {/* Підказка про готовність */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Переконайтеся, що всі поля заповнені правильно перед переходом до наступного етапу
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};
