'use client';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import { Box, Paper, Chip, Typography, Divider, Button } from '@mui/material';
import { useEffect, useState } from 'react';

// import { useClientSelection } from '@/domain/client';
import {
  useWizardStore,
  useWizardNavigation,
  WizardStep,
  WizardMode,
  WizardContext,
} from '@/domain/wizard';
import { useWizardState } from '@/domain/wizard';
// import { BranchSelectionStep } from '@/features/order-wizard/branch-selection/BranchSelectionStep';
import { ClientSelectionStep } from '@/features/order-wizard/client-selection/ui/ClientSelectionStep';
// import { ItemManagerStep } from '@/features/order-wizard/item-manager';
// import { ItemWizardStep } from '@/features/order-wizard/item-wizard';
// import { OrderConfirmationStep } from '@/features/order-wizard/order-confirmation';
// import { OrderParametersStep } from '@/features/order-wizard/order-parameters';
import { testApiConnection, initOrderWizardApi } from '@/features/order-wizard/shared/api';
import useHealthCheck from '@/features/system-status/hooks/useHealthCheck';

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

  // Використовуємо wizard хуки з domain layer
  const wizardStore = useWizardStore();
  const wizardNavigation = useWizardNavigation();
  const wizardState = useWizardState();

  // Додаємо client selection для синхронізації стану
  // const clientSelection = useClientSelection();

  // === ІНІЦІАЛІЗАЦІЯ WIZARD ===
  useEffect(() => {
    // Ініціалізуємо wizard при першому завантаженні
    if (!wizardStore.isInitialized) {
      const initialContext: WizardContext = {
        mode: WizardMode.CREATE,
        orderId: undefined,
        customerId: undefined,
        metadata: {
          startedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
        },
      };

      console.log('OrderWizard: Ініціалізація з контекстом:', initialContext);

      const result = wizardStore.initialize(initialContext);

      if (result.success) {
        console.log('OrderWizard: Успішно ініціалізовано');
      } else {
        console.error('OrderWizard: Помилка ініціалізації:', result.errors);
      }
    }
  }, [wizardStore]);

  // Синхронізуємо стан клієнта з wizard
  useEffect(() => {
    // if (clientSelection.hasSelection) {
    //   console.log('OrderWizard: Клієнт вибраний, можна переходити до BRANCH_SELECTION');
    // }
  }, []); // [clientSelection.hasSelection]

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
          label={`Крок: ${wizardNavigation.currentStep}`}
          color="primary"
          variant="outlined"
        />
        {wizardState.hasErrors && <Chip size="small" label="Помилка" color="error" />}
      </Box>
    );
  };

  /**
   * Перевірка поточного кроку
   */
  const isCurrentStep = (step: WizardStep): boolean => {
    return wizardNavigation.currentStep === step;
  };

  /**
   * Рендеринг поточного кроку візарда
   */
  const renderCurrentStep = () => {
    // Відображаємо крок вибору клієнта
    if (isCurrentStep(WizardStep.CLIENT_SELECTION)) {
      return <ClientSelectionStep />;
    }

    // ТИМЧАСОВО ЗАКОМЕНТОВАНО ДЛЯ ТЕСТУВАННЯ
    // // Відображаємо крок вибору філії
    // if (isCurrentStep(WizardStep.BRANCH_SELECTION)) {
    //   return <BranchSelectionStep />;
    // }

    // // Відображаємо крок основної інформації
    // if (isCurrentStep(WizardStep.ITEM_MANAGER)) {
    //   return <ItemManagerStep />;
    // }

    // // Відображаємо крок параметрів замовлення
    // if (isCurrentStep(WizardStep.ORDER_PARAMETERS)) {
    //   return <OrderParametersStep />;
    // }

    // // Відображаємо крок підтвердження замовлення
    // if (isCurrentStep(WizardStep.CONFIRMATION)) {
    //   return <OrderConfirmationStep />;
    // }

    // // Якщо активний підвізард предметів, показуємо ItemWizardStep
    // if (wizardNavigation.isItemWizardActive) {
    //   return <ItemWizardStep />;
    // }

    // Якщо крок не визначено, показуємо повідомлення
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="warning.main" gutterBottom>
          Крок в розробці
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Поточний крок: {wizardNavigation.currentStep}
        </Typography>
        <Button
          variant="contained"
          onClick={() => wizardNavigation.goToStep(WizardStep.CLIENT_SELECTION)}
        >
          Повернутись до вибору клієнта
        </Button>
      </Box>
    );
  };

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

      {wizardState.hasErrors && wizardState.errors.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="error" gutterBottom>
            Помилка візарда: {wizardState.errors[0]}
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
