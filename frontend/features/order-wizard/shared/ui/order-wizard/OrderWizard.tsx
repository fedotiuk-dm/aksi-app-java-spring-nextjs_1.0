'use client';

import { Box, Paper } from '@mui/material';

import { ClientSelectionStep } from '@/features/order-wizard/client-selection/ui/ClientSelectionStep';
import { useWizardNavigation } from '@/features/order-wizard/wizard/hooks';
import { WizardStep } from '@/features/order-wizard/wizard/store/navigation';

/**
 * Головний компонент OrderWizard, який керує відображенням різних кроків
 * та навігацією між ними
 */
export default function OrderWizard() {
  // Використовуємо існуючий хук для навігації між кроками
  const { isCurrentStep } = useWizardNavigation();

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
        overflow: 'hidden'
      }}
    >
      {renderCurrentStep()}
    </Paper>
  );
}
