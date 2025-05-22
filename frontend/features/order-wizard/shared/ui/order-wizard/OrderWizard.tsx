'use client';

import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import { Box, Paper, Chip, Typography, Divider } from '@mui/material';
import { useEffect } from 'react';

import { ClientSelectionStep } from '@/features/order-wizard/client-selection/ui/ClientSelectionStep';
import { useWizardNavigation } from '@/features/order-wizard/wizard/hooks';
import { WizardStep } from '@/features/order-wizard/wizard/store/navigation';
import useHealthCheck from '@/features/system-status/hooks/useHealthCheck';

/**
 * Головний компонент OrderWizard, який керує відображенням різних кроків
 * та навігацією між ними
 */
export default function OrderWizard() {
  // Перевіряємо стан з'єднання з API
  const { data: apiHealth, isLoading: isApiCheckLoading } = useHealthCheck();

  // Використовуємо існуючий хук для навігації між кроками
  const { isCurrentStep } = useWizardNavigation();

  // Виводимо інформацію про API в консоль при запуску
  useEffect(() => {
    console.log('OrderWizard initialized');
  }, []);

  /**
   * Відображення статусу з'єднання з API
   */
  const renderApiStatus = () => {
    if (isApiCheckLoading) {
      return <Chip size="small" label="Перевірка з'єднання..." color="default" />;
    }

    if (apiHealth?.status === 'UP') {
      return (
        <Chip
          size="small"
          icon={<SignalWifiStatusbar4BarIcon />}
          label="API з'єднання активне"
          color="success"
        />
      );
    }

    return (
      <Chip size="small" icon={<SignalWifiOffIcon />} label="Немає з'єднання з API" color="error" />
    );
  };

  /**
   * Рендеринг поточного кроку візарда
   */
  const renderCurrentStep = () => {
    // Відображаємо крок вибору клієнта
    if (isCurrentStep(WizardStep.CLIENT_SELECTION)) {
      return <ClientSelectionStep />;
    }

    // Відображаємо крок вибору філії
    if (isCurrentStep(WizardStep.BRANCH_SELECTION)) {
      return <Box>Вибір філії (буде додано пізніше)</Box>;
    }

    // Відображаємо крок основної інформації
    if (isCurrentStep(WizardStep.BASIC_INFO)) {
      return <Box>Основна інформація (буде додано пізніше)</Box>;
    }

    // Відображаємо крок управління предметами
    if (isCurrentStep(WizardStep.ITEM_MANAGER)) {
      return <Box>Управління предметами (буде додано пізніше)</Box>;
    }

    // Відображаємо крок параметрів замовлення
    if (isCurrentStep(WizardStep.ORDER_PARAMETERS)) {
      return <Box>Параметри замовлення (буде додано пізніше)</Box>;
    }

    // Відображаємо крок підтвердження замовлення
    if (isCurrentStep(WizardStep.ORDER_CONFIRMATION)) {
      return <Box>Підтвердження замовлення (буде додано пізніше)</Box>;
    }

    // Якщо активний підвізард предметів, показуємо відповідний крок
    if (isCurrentStep(WizardStep.ITEM_BASIC_INFO)) {
      return <Box>Основна інформація про предмет (буде додано пізніше)</Box>;
    }

    if (isCurrentStep(WizardStep.ITEM_PROPERTIES)) {
      return <Box>Властивості предмету (буде додано пізніше)</Box>;
    }

    if (isCurrentStep(WizardStep.DEFECTS_STAINS)) {
      return <Box>Дефекти та плями (буде додано пізніше)</Box>;
    }

    if (isCurrentStep(WizardStep.PRICE_CALCULATOR)) {
      return <Box>Розрахунок ціни (буде додано пізніше)</Box>;
    }

    if (isCurrentStep(WizardStep.PHOTO_DOCUMENTATION)) {
      return <Box>Фотодокументація (буде додано пізніше)</Box>;
    }

    // Якщо крок не визначено, повертаємо null
    return null;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>{renderApiStatus()}</Box>

      {apiHealth?.status !== 'UP' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="error" gutterBottom>
            Немає з&apos;єднання з сервером API. Перевірте підключення до інтернету або зверніться
            до адміністратора.
          </Typography>
          <Divider sx={{ my: 1 }} />
        </Box>
      )}

      {renderCurrentStep()}
    </Paper>
  );
}
