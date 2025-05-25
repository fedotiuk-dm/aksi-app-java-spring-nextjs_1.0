/**
 * OrderWizard - XState v5 тестовий компонент
 * Демонстрація принципу "DDD inside, FSD outside"
 *
 * UI компонент максимально "тонкий" - тільки відображає дані з доменного шару
 */

'use client';

import { Box, Paper, LinearProgress, Typography, Button, Chip } from '@mui/material';

import { useWizardMachine, WizardStep, ItemWizardStep } from '@/domain/wizard';

export const OrderWizardExample = () => {
  // === НОВА XState v5 МАШИНА ===
  const {
    currentStep,
    currentSubStep,
    canGoNext,
    canGoPrev,
    isInItemWizard,
    isInItemList,
    isCompleted,
    progress,
    itemProgress,
    goNext,
    goPrev,
    startItemWizard,
    completeItemWizard,
    cancelItemWizard,
    nextItemStep,
    prevItemStep,
    resetWizard,
  } = useWizardMachine();

  // === RENDER МЕТОДИ ===
  const renderCurrentStepContent = () => {
    // Якщо в item wizard, показуємо item кроки
    if (isInItemWizard && currentSubStep) {
      switch (currentSubStep) {
        case ItemWizardStep.BASIC_INFO:
          return (
            <Box>
              <Typography variant="h6">📝 Основна інформація предмета</Typography>
              <Typography variant="body2" color="text.secondary">
                Категорія, найменування, кількість
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2">🔹 Виберіть категорію послуги</Typography>
                <Typography variant="body2">🔹 Виберіть найменування виробу</Typography>
                <Typography variant="body2">🔹 Вкажіть кількість (шт/кг)</Typography>
              </Box>
            </Box>
          );

        case ItemWizardStep.PROPERTIES:
          return (
            <Box>
              <Typography variant="h6">🎨 Характеристики предмета</Typography>
              <Typography variant="body2" color="text.secondary">
                Матеріал, колір, наповнювач
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2">🔹 Матеріал (бавовна, шерсть, шовк, тощо)</Typography>
                <Typography variant="body2">🔹 Колір</Typography>
                <Typography variant="body2">🔹 Наповнювач (якщо є)</Typography>
                <Typography variant="body2">🔹 Ступінь зносу (10%, 30%, 50%, 75%)</Typography>
              </Box>
            </Box>
          );

        case ItemWizardStep.DEFECTS:
          return (
            <Box>
              <Typography variant="h6">⚠️ Дефекти та плями</Typography>
              <Typography variant="body2" color="text.secondary">
                Забруднення, дефекти та ризики
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2">🔹 Плями (жир, кров, вино, кава, тощо)</Typography>
                <Typography variant="body2">🔹 Дефекти (потертості, порване, фурнітура)</Typography>
                <Typography variant="body2">🔹 Ризики (зміна кольору, деформація)</Typography>
              </Box>
            </Box>
          );

        case ItemWizardStep.PRICING:
          return (
            <Box>
              <Typography variant="h6">💰 Розрахунок ціни</Typography>
              <Typography variant="body2" color="text.secondary">
                Калькулятор ціни з модифікаторами
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2">🔹 Базова ціна з прайсу</Typography>
                <Typography variant="body2">🔹 Коефіцієнти та модифікатори</Typography>
                <Typography variant="body2">🔹 Інтерактивний розрахунок з деталізацією</Typography>
              </Box>
            </Box>
          );

        case ItemWizardStep.PHOTOS:
          return (
            <Box>
              <Typography variant="h6">📷 Фотодокументація</Typography>
              <Typography variant="body2" color="text.secondary">
                Завантаження фото (до 5 фото, 5MB кожне)
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2">🔹 Зйомка з камери планшета</Typography>
                <Typography variant="body2">🔹 Завантаження з галереї</Typography>
                <Typography variant="body2">🔹 Попередній перегляд мініатюр</Typography>
              </Box>
            </Box>
          );

        default:
          return <Typography>Невідомий крок item wizard</Typography>;
      }
    }

    // Основні кроки wizard
    switch (currentStep) {
      case WizardStep.CLIENT_SELECTION:
        return (
          <Box>
            <Typography variant="h6">👤 1. Вибір клієнта</Typography>
            <Typography variant="body2" color="text.secondary">
              Знайдіть існуючого клієнта або створіть нового
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">🔹 Пошук за прізвищем, телефоном, email</Typography>
              <Typography variant="body2">🔹 Створення нового клієнта</Typography>
              <Typography variant="body2">🔹 Способи зв&apos;язку та джерело інформації</Typography>
            </Box>
          </Box>
        );

      case WizardStep.BRANCH_SELECTION:
        return (
          <Box>
            <Typography variant="h6">🏢 2. Базова інформація замовлення</Typography>
            <Typography variant="body2" color="text.secondary">
              Квитанція, мітка, філія
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">🔹 Номер квитанції (автоматично)</Typography>
              <Typography variant="body2">🔹 Унікальна мітка (вручну/скан)</Typography>
              <Typography variant="body2">🔹 Пункт прийому замовлення</Typography>
            </Box>
          </Box>
        );

      case WizardStep.ITEM_MANAGER:
        return (
          <Box>
            <Typography variant="h6">📦 3. Менеджер предметів</Typography>
            <Typography variant="body2" color="text.secondary">
              {isInItemList ? 'Додайте предмети до замовлення' : 'Редагування предметів'}
            </Typography>

            {isInItemList && (
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={startItemWizard} size="large" sx={{ mb: 2 }}>
                  ➕ Додати предмет
                </Button>

                <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2">📋 Тут буде таблиця доданих предметів</Typography>
                  <Typography variant="body2">💰 Лічильник загальної вартості</Typography>
                  <Typography variant="body2">🔄 Циклічне додавання предметів</Typography>
                </Box>
              </Box>
            )}
          </Box>
        );

      case WizardStep.ORDER_PARAMETERS:
        return (
          <Box>
            <Typography variant="h6">⚙️ 4. Параметри замовлення</Typography>
            <Typography variant="body2" color="text.secondary">
              Терміни, знижки, оплата
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">📅 Дата виконання та терміновість</Typography>
              <Typography variant="body2">💳 Знижки (Еверкард, соцмережі, ЗСУ)</Typography>
              <Typography variant="body2">💰 Спосіб оплати та передоплата</Typography>
            </Box>
          </Box>
        );

      case WizardStep.CONFIRMATION:
        return (
          <Box>
            <Typography variant="h6">✅ 5. Підтвердження замовлення</Typography>
            <Typography variant="body2" color="text.secondary">
              Перегляд, підпис та формування квитанції
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">📋 Повний підсумок з деталізацією</Typography>
              <Typography variant="body2">✍️ Цифровий підпис клієнта</Typography>
              <Typography variant="body2">🖨️ Автоматичне генерування квитанції</Typography>
            </Box>
          </Box>
        );

      default:
        return <Typography>Невідомий крок</Typography>;
    }
  };

  // Заголовок з статусом
  const getHeaderTitle = () => {
    if (isCompleted) return 'Order Wizard - Завершено! 🎉';
    if (isInItemWizard) return `Order Wizard - Додавання предмета (${currentSubStep})`;
    return `Order Wizard - ${currentStep}`;
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* HEADER */}
      <Typography variant="h4" gutterBottom>
        {getHeaderTitle()}
      </Typography>

      {/* STATUS CHIPS */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip label={`Етап: ${currentStep}`} color="primary" variant="outlined" />
        {isInItemWizard && currentSubStep && (
          <Chip label={`Підетап: ${currentSubStep}`} color="secondary" variant="outlined" />
        )}
        <Chip
          label={isCompleted ? 'Завершено' : 'В процесі'}
          color={isCompleted ? 'success' : 'default'}
        />
      </Box>

      {/* PROGRESS BAR - Основний */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Загальний прогрес: {Math.round(progress.percentComplete)}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress.percentComplete}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* PROGRESS BAR - Item Wizard */}
      {isInItemWizard && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Прогрес предмета: {Math.round(itemProgress.percentComplete)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={itemProgress.percentComplete}
            color="secondary"
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      )}

      {/* MAIN CONTENT */}
      <Paper sx={{ p: 3, mb: 3 }}>{renderCurrentStepContent()}</Paper>

      {/* NAVIGATION */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          {/* Back buttons */}
          {isInItemWizard ? (
            <>
              <Button
                onClick={prevItemStep}
                disabled={currentSubStep === ItemWizardStep.BASIC_INFO}
                sx={{ mr: 1 }}
              >
                ← Попередній підетап
              </Button>
              <Button onClick={cancelItemWizard} color="warning" variant="outlined" sx={{ mr: 1 }}>
                ❌ Скасувати предмет
              </Button>
            </>
          ) : (
            <Button onClick={goPrev} disabled={!canGoPrev} sx={{ mr: 1 }}>
              ← Назад
            </Button>
          )}
        </Box>

        <Box>
          {/* Forward buttons */}
          {isInItemWizard ? (
            <>
              {currentSubStep === ItemWizardStep.PHOTOS ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={completeItemWizard}
                  size="large"
                >
                  ✅ Завершити предмет
                </Button>
              ) : (
                <Button variant="contained" onClick={nextItemStep}>
                  Наступний підетап →
                </Button>
              )}
            </>
          ) : (
            <>
              {currentStep === WizardStep.CONFIRMATION ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => console.log('Complete wizard')}
                  size="large"
                >
                  🏁 Завершити замовлення
                </Button>
              ) : (
                <Button onClick={goNext} disabled={!canGoNext} variant="contained">
                  Далі →
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* DEBUG INFO */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: 'grey.50',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        <Typography variant="h6" gutterBottom>
          🔧 Debug Info (XState v5)
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 1,
          }}
        >
          <Typography variant="caption">
            Поточний крок: <strong>{currentStep}</strong>
          </Typography>
          <Typography variant="caption">
            Підкрок: <strong>{currentSubStep || 'Немає'}</strong>
          </Typography>
          <Typography variant="caption">
            В Item Wizard: <strong>{isInItemWizard ? 'Так' : 'Ні'}</strong>
          </Typography>
          <Typography variant="caption">
            В Item List: <strong>{isInItemList ? 'Так' : 'Ні'}</strong>
          </Typography>
          <Typography variant="caption">
            Можна йти вперед: <strong>{canGoNext ? 'Так' : 'Ні'}</strong>
          </Typography>
          <Typography variant="caption">
            Можна йти назад: <strong>{canGoPrev ? 'Так' : 'Ні'}</strong>
          </Typography>
          <Typography variant="caption">
            Завершено: <strong>{isCompleted ? 'Так' : 'Ні'}</strong>
          </Typography>
          <Typography variant="caption">
            Прогрес:{' '}
            <strong>
              {progress.currentStepIndex + 1}/{progress.totalSteps}
            </strong>
          </Typography>
        </Box>
      </Box>

      {/* RESET BUTTON */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button onClick={resetWizard} color="error" variant="outlined">
          🔄 Скинути Wizard
        </Button>
      </Box>
    </Box>
  );
};
