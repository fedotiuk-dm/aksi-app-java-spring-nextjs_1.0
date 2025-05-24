/**
 * OrderWizard - Приклад використання нового API
 * Демонстрація принципу "DDD inside, FSD outside"
 *
 * UI компонент максимально "тонкий" - тільки відображає дані з доменного шару
 */

'use client';

import { Box, Paper, LinearProgress, Typography, Button, Alert } from '@mui/material';

import { useOrderWizard, useWizardNavigation, useItemWizard, WizardStep } from '@/domain/wizard';

export const OrderWizardExample = () => {
  // === ДОМЕННА ЛОГІКА ЧЕРЕЗ ХУКИ ===
  const { currentStep, error, progress, initialize, reset, markStepCompleted, clearError } =
    useOrderWizard({ autoStart: true });

  const { canGoForward, canGoBack, goForward, goBack } = useWizardNavigation();

  const {
    isActive: isItemWizardActive,
    start: startItemWizard,
    complete: completeItemWizard,
    cancel: cancelItemWizard,
  } = useItemWizard();

  // === RENDER МЕТОДИ ===
  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case WizardStep.CLIENT_SELECTION:
        return (
          <Box>
            <Typography variant="h6">1. Вибір клієнта</Typography>
            <Typography variant="body2" color="text.secondary">
              Знайдіть існуючого клієнта або створіть нового
            </Typography>
            {/* Тут буде компонент ClientSelection */}
          </Box>
        );

      case WizardStep.BRANCH_SELECTION:
        return (
          <Box>
            <Typography variant="h6">2. Вибір філії</Typography>
            <Typography variant="body2" color="text.secondary">
              Базова інформація замовлення
            </Typography>
            {/* Тут буде компонент BranchSelection */}
          </Box>
        );

      case WizardStep.ITEM_MANAGER:
        return (
          <Box>
            <Typography variant="h6">3. Менеджер предметів</Typography>
            <Typography variant="body2" color="text.secondary">
              Додайте предмети до замовлення
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => startItemWizard()}
                disabled={isItemWizardActive}
              >
                Додати предмет
              </Button>
            </Box>
            {/* Тут буде таблиця доданих предметів */}
          </Box>
        );

      case WizardStep.ORDER_PARAMETERS:
        return (
          <Box>
            <Typography variant="h6">4. Параметри замовлення</Typography>
            <Typography variant="body2" color="text.secondary">
              Терміни, знижки, оплата
            </Typography>
            {/* Тут буде компонент OrderParameters */}
          </Box>
        );

      case WizardStep.ORDER_CONFIRMATION:
        return (
          <Box>
            <Typography variant="h6">5. Підтвердження</Typography>
            <Typography variant="body2" color="text.secondary">
              Перегляд та підпис замовлення
            </Typography>
            {/* Тут буде компонент OrderConfirmation */}
          </Box>
        );

      // === ITEM WIZARD КРОКИ ===
      case WizardStep.ITEM_BASIC_INFO:
        return (
          <Box>
            <Typography variant="h6">Основна інформація предмета</Typography>
            <Typography variant="body2" color="text.secondary">
              Категорія, найменування, кількість
            </Typography>
            {/* Тут буде компонент ItemBasicInfo */}
          </Box>
        );

      case WizardStep.ITEM_PROPERTIES:
        return (
          <Box>
            <Typography variant="h6">Характеристики предмета</Typography>
            <Typography variant="body2" color="text.secondary">
              Матеріал, колір, наповнювач
            </Typography>
            {/* Тут буде компонент ItemProperties */}
          </Box>
        );

      case WizardStep.DEFECTS_STAINS:
        return (
          <Box>
            <Typography variant="h6">Дефекти та плями</Typography>
            <Typography variant="body2" color="text.secondary">
              Забруднення, дефекти та ризики
            </Typography>
            {/* Тут буде компонент DefectsStains */}
          </Box>
        );

      case WizardStep.PRICE_CALCULATOR:
        return (
          <Box>
            <Typography variant="h6">Розрахунок ціни</Typography>
            <Typography variant="body2" color="text.secondary">
              Калькулятор ціни з модифікаторами
            </Typography>
            {/* Тут буде компонент PriceCalculator */}
          </Box>
        );

      case WizardStep.PHOTO_DOCUMENTATION:
        return (
          <Box>
            <Typography variant="h6">Фотодокументація</Typography>
            <Typography variant="body2" color="text.secondary">
              Завантаження фото (до 5 фото, 5MB кожне)
            </Typography>
            {/* Тут буде компонент PhotoDocumentation */}
          </Box>
        );

      default:
        return <Typography>Невідомий крок</Typography>;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* HEADER */}
      <Typography variant="h4" gutterBottom>
        Order Wizard {isItemWizardActive && '- Додавання предмета'}
      </Typography>

      {/* PROGRESS BAR */}
      <Box sx={{ mb: 3 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Прогрес: {Math.round(progress)}%
        </Typography>
      </Box>

      {/* ERROR DISPLAY */}
      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* MAIN CONTENT */}
      <Paper sx={{ p: 3, mb: 3 }}>{renderCurrentStepContent()}</Paper>

      {/* NAVIGATION */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Button onClick={goBack} disabled={!canGoBack} sx={{ mr: 1 }}>
            Назад
          </Button>

          {isItemWizardActive && (
            <Button onClick={cancelItemWizard} color="secondary" sx={{ mr: 1 }}>
              Скасувати предмет
            </Button>
          )}
        </Box>

        <Box>
          {isItemWizardActive ? (
            <Button variant="contained" onClick={completeItemWizard}>
              Завершити предмет
            </Button>
          ) : (
            <>
              <Button
                onClick={goForward}
                disabled={!canGoForward}
                variant="contained"
                sx={{ mr: 1 }}
              >
                Далі
              </Button>

              <Button
                onClick={() => markStepCompleted(currentStep)}
                color="secondary"
                sx={{ mr: 1 }}
              >
                Позначити виконаним
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* DEBUG INFO */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="caption" display="block">
          Поточний крок: {currentStep}
        </Typography>
        <Typography variant="caption" display="block">
          Item Wizard активний: {isItemWizardActive ? 'Так' : 'Ні'}
        </Typography>
        <Typography variant="caption" display="block">
          Можна йти вперед: {canGoForward ? 'Так' : 'Ні'}
        </Typography>
        <Typography variant="caption" display="block">
          Можна йти назад: {canGoBack ? 'Так' : 'Ні'}
        </Typography>
      </Box>

      {/* RESET BUTTON */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button onClick={reset} color="warning">
          Скинути
        </Button>
      </Box>
    </Box>
  );
};
