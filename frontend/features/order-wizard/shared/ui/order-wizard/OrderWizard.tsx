'use client';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import { Box, Paper, Chip, Typography, Divider, Button } from '@mui/material';
import { useEffect, useState } from 'react';

import { useClientSelection } from '@/domain/client';
import { useWizard, WizardStep, WizardMode, WizardContext } from '@/domain/wizard';
import { BranchSelectionStep } from '@/features/order-wizard/branch-selection/ui/BranchSelectionStep';
import { ClientSelectionStep } from '@/features/order-wizard/client-selection/ui/ClientSelectionStep';
import { ItemManagerStep } from '@/features/order-wizard/item-manager';
import useHealthCheck from '@/features/system-status/hooks/useHealthCheck';

import { testApiConnection, initOrderWizardApi } from '../../api';

/**
 * Головний компонент OrderWizard, який керує відображенням різних кроків
 * та навігацією між ними
 *
 * SOLID принципи:
 * - Single Responsibility: тільки координація візарда
 * - Open/Closed: легко розширюється новими кроками
 * - Dependency Inversion: залежить від domain layer
 */
export default function OrderWizard() {
  // Перевіряємо стан з'єднання з API
  const { data: apiHealth, isLoading: isApiCheckLoading } = useHealthCheck();

  // Локальний стан для тестування Order Wizard API
  const [orderWizardApiStatus, setOrderWizardApiStatus] = useState<{
    tested: boolean;
    working: boolean;
    lastTest: Date | null;
  }>({
    tested: false,
    working: false,
    lastTest: null,
  });

  // Використовуємо головний wizard хук з domain layer
  const wizard = useWizard();
  const { initializeWizard } = wizard;

  // Додаємо client selection для синхронізації стану
  const clientSelection = useClientSelection();

  // Ініціалізуємо візард при першому завантаженні
  useEffect(() => {
    if (!wizard.isInitialized && !wizard.hasErrors) {
      const initialContext: WizardContext = {
        mode: WizardMode.CREATE,
        orderId: undefined,
        customerId: undefined,
        metadata: {
          startedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
        },
      };

      const result = initializeWizard(initialContext);

      if (result.success) {
        console.log('OrderWizard ініціалізовано успішно');
      } else {
        console.error('Помилка ініціалізації OrderWizard:', result.errors);
      }
    }
  }, [wizard.isInitialized, wizard.hasErrors, initializeWizard]);

  // Синхронізуємо стан клієнта з wizard availability після ініціалізації
  useEffect(() => {
    if (wizard.isInitialized && clientSelection.hasSelection) {
      console.log('Синхронізація: клієнт вибраний, оновлюємо availability для BRANCH_SELECTION');
      wizard.updateStepAvailability(WizardStep.BRANCH_SELECTION, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizard.isInitialized, clientSelection.hasSelection]);

  // Логування для діагностики (тимчасово)
  useEffect(() => {
    console.log('OrderWizard діагностика:', {
      'wizard.isInitialized': wizard.isInitialized,
      'clientSelection.hasSelection': clientSelection.hasSelection,
      'wizard.availability[BRANCH_SELECTION]': wizard.isStepAvailable(WizardStep.BRANCH_SELECTION),
      'wizard.currentStep': wizard.currentStep,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizard.isInitialized, clientSelection.hasSelection, wizard.currentStep]);

  // Автоматично тестуємо Order Wizard API при завантаженні (тільки в development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !orderWizardApiStatus.tested) {
      initOrderWizardApi();
      testOrderWizardApi();
    }
  }, [orderWizardApiStatus.tested]);

  /**
   * Тестування Order Wizard API
   */
  const testOrderWizardApi = async () => {
    try {
      const isWorking = await testApiConnection();
      setOrderWizardApiStatus({
        tested: true,
        working: isWorking,
        lastTest: new Date(),
      });
    } catch (error) {
      console.error('Помилка тестування Order Wizard API:', error);
      setOrderWizardApiStatus({
        tested: true,
        working: false,
        lastTest: new Date(),
      });
    }
  };

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
   * Відображення статусу Order Wizard API (для development)
   */
  const renderOrderWizardApiStatus = () => {
    if (process.env.NODE_ENV !== 'development') return null;

    const { tested, working, lastTest } = orderWizardApiStatus;

    if (!tested) {
      return <Chip size="small" label="OW API: тестується..." color="default" variant="outlined" />;
    }

    return (
      <Chip
        size="small"
        icon={working ? <CheckCircleIcon /> : <ErrorIcon />}
        label={`OW API: ${working ? 'працює' : 'недоступне'}`}
        color={working ? 'success' : 'error'}
        variant="outlined"
        onClick={() => testOrderWizardApi()}
        sx={{ cursor: 'pointer' }}
        title={`Остання перевірка: ${lastTest?.toLocaleTimeString() || 'невідомо'}. Клік для повторної перевірки.`}
      />
    );
  };

  /**
   * Відображення стану візарда (для debug)
   */
  const renderWizardStatus = () => {
    if (process.env.NODE_ENV !== 'development') return null;

    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Chip
          size="small"
          label={`Крок: ${wizard.currentStep}`}
          color="primary"
          variant="outlined"
        />
        <Chip
          size="small"
          label={`Прогрес: ${Math.round(wizard.progress * 100)}%`}
          color="info"
          variant="outlined"
        />
        {wizard.hasErrors && <Chip size="small" label="Помилка" color="error" />}
      </Box>
    );
  };

  /**
   * Перевірка поточного кроку
   */
  const isCurrentStep = (step: WizardStep): boolean => {
    return wizard.currentStep === step;
  };

  /**
   * Рендеринг поточного кроку візарда
   */
  const renderCurrentStep = () => {
    // Якщо візард не ініціалізовано, показуємо завантаження або кнопку ініціалізації
    if (!wizard.isInitialized) {
      if (wizard.hasErrors) {
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Помилка ініціалізації візарда
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {wizard.lastError}
            </Typography>
            <Button variant="contained" onClick={() => wizard.resetWizard()}>
              Спробувати знову
            </Button>
          </Box>
        );
      }

      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Ініціалізація візарда...
          </Typography>
        </Box>
      );
    }

    // Відображаємо крок вибору клієнта
    if (isCurrentStep(WizardStep.CLIENT_SELECTION)) {
      return <ClientSelectionStep />;
    }

    // Відображаємо крок вибору філії
    if (isCurrentStep(WizardStep.BRANCH_SELECTION)) {
      return <BranchSelectionStep />;
    }

    // Відображаємо крок основної інформації
    if (isCurrentStep(WizardStep.ITEM_MANAGER)) {
      return <ItemManagerStep />;
    }

    // Відображаємо крок параметрів замовлення
    if (isCurrentStep(WizardStep.ORDER_PARAMETERS)) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Параметри замовлення
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (буде додано пізніше)
          </Typography>
        </Box>
      );
    }

    // Відображаємо крок підтвердження замовлення
    if (isCurrentStep(WizardStep.ORDER_CONFIRMATION)) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Підтвердження замовлення
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (буде додано пізніше)
          </Typography>
        </Box>
      );
    }

    // Якщо активний підвізард предметів, показуємо відповідний крок
    if (isCurrentStep(WizardStep.ITEM_BASIC_INFO)) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Основна інформація про предмет
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (буде додано пізніше)
          </Typography>
        </Box>
      );
    }

    if (isCurrentStep(WizardStep.ITEM_PROPERTIES)) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Властивості предмету
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (буде додано пізніше)
          </Typography>
        </Box>
      );
    }

    if (isCurrentStep(WizardStep.DEFECTS_STAINS)) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Дефекти та плями
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (буде додано пізніше)
          </Typography>
        </Box>
      );
    }

    if (isCurrentStep(WizardStep.PRICE_CALCULATOR)) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Розрахунок ціни
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (буде додано пізніше)
          </Typography>
        </Box>
      );
    }

    if (isCurrentStep(WizardStep.PHOTO_DOCUMENTATION)) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Фотодокументація
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (буде додано пізніше)
          </Typography>
        </Box>
      );
    }

    // Якщо крок не визначено, показуємо помилку
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Невідомий крок візарда
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Поточний крок: {wizard.currentStep}
        </Typography>
        <Button
          variant="contained"
          onClick={() => wizard.navigateToStep(WizardStep.CLIENT_SELECTION)}
        >
          Повернутись до початку
        </Button>
      </Box>
    );
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {renderWizardStatus()}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {renderOrderWizardApiStatus()}
          {renderApiStatus()}
        </Box>
      </Box>

      {apiHealth?.status !== 'UP' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="error" gutterBottom>
            Немає з&apos;єднання з сервером API. Перевірте підключення до інтернету або зверніться
            до адміністратора.
          </Typography>
          <Divider sx={{ my: 1 }} />
        </Box>
      )}

      {wizard.hasErrors && wizard.lastError && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="error" gutterBottom>
            Помилка візарда: {wizard.lastError}
          </Typography>
          <Divider sx={{ my: 1 }} />
        </Box>
      )}

      {process.env.NODE_ENV === 'development' &&
        !orderWizardApiStatus.working &&
        orderWizardApiStatus.tested && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="warning.main" gutterBottom>
              ⚠️ Order Wizard API недоступне. Деякі функції можуть не працювати.
            </Typography>
            <Button size="small" variant="outlined" onClick={testOrderWizardApi} sx={{ mt: 1 }}>
              Перевірити знову
            </Button>
            <Divider sx={{ my: 1 }} />
          </Box>
        )}

      {renderCurrentStep()}
    </Paper>
  );
}
