'use client';

import { Box, Typography, Paper, Alert } from '@mui/material';
import React from 'react';

import { useStage2Manager, useItemWizard } from '@/domains/wizard';

import { ItemManagerScreen } from '../components/stage2/ItemManagerScreen';
import { ItemWizard } from '../components/stage2/ItemWizard';

/**
 * Головний компонент для Stage 2 - Item Manager
 *
 * Відповідальність:
 * - Відображення стану завантаження та помилок
 * - Перемикання між головним екраном та підвізардом
 * - Координація роботи дочірніх компонентів
 */
interface Stage2ItemManagerProps {
  orderId: string;
  onComplete?: () => void;
  onBack?: () => void;
}

export const Stage2ItemManager: React.FC<Stage2ItemManagerProps> = ({
  orderId,
  onComplete,
  onBack,
}) => {
  // Доменні хуки
  const {
    manager,
    currentState,
    isLoading,
    error,
    totalAmount,
    itemCount,
    canProceedToNextStage,
    addedItems,
    initializeManager,
    clearError,
  } = useStage2Manager();

  const { isWizardActive, wizardMode } = useItemWizard();

  // Ініціалізація менеджера при монтуванні
  React.useEffect(() => {
    console.log('🔍 Stage2ItemManager useEffect:', { orderId, currentState });

    if (orderId && currentState === 'NOT_STARTED') {
      console.log('🚀 Calling initializeManager with orderId:', orderId);
      initializeManager(orderId);
    } else {
      console.log('⚠️ Not calling initializeManager:', {
        hasOrderId: !!orderId,
        currentState,
        shouldInitialize: orderId && currentState === 'NOT_STARTED',
      });
    }
  }, [orderId, currentState, initializeManager]);

  // Обробка завершення етапу
  const handleComplete = React.useCallback(() => {
    if (canProceedToNextStage && onComplete) {
      onComplete();
    }
  }, [canProceedToNextStage, onComplete]);

  // Рендер контенту залежно від стану
  const renderContent = () => {
    // Показуємо підвізард якщо він активний
    if (isWizardActive) {
      return (
        <ItemWizard
          mode={wizardMode}
          onComplete={() => {
            // Підвізард автоматично закриється через доменний хук
          }}
        />
      );
    }

    // Показуємо головний екран менеджера
    return (
      <ItemManagerScreen
        items={addedItems}
        totalAmount={totalAmount}
        itemCount={itemCount}
        canProceedToNextStage={canProceedToNextStage}
        onComplete={handleComplete}
        onBack={onBack}
      />
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Заголовок етапу */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Етап 2: Менеджер предметів
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Додайте предмети до замовлення та налаштуйте їх параметри
        </Typography>
      </Box>

      {/* Індикатор стану */}
      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 2, backgroundColor: 'background.default' }}>
          <Typography variant="body2" color="text.secondary">
            Стан: <strong>{getStateDisplayName(currentState)}</strong>
            {itemCount > 0 && (
              <>
                {' • '}
                Предметів: <strong>{itemCount}</strong>
                {' • '}
                Загальна сума: <strong>{formatPrice(totalAmount)}</strong>
              </>
            )}
          </Typography>
        </Paper>
      </Box>

      {/* Помилки */}
      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Індикатор завантаження */}
      {isLoading && currentState === 'INITIALIZING' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Ініціалізація менеджера предметів...
        </Alert>
      )}

      {/* Основний контент */}
      {renderContent()}
    </Box>
  );
};

// Допоміжні функції
function getStateDisplayName(state: string): string {
  const stateNames: Record<string, string> = {
    NOT_STARTED: 'Не розпочато',
    INITIALIZING: 'Ініціалізація',
    ITEMS_MANAGER_SCREEN: 'Екран менеджера',
    ITEM_WIZARD_ACTIVE: 'Активний візард',
    READY_TO_PROCEED: 'Готово до продовження',
    COMPLETED: 'Завершено',
    ERROR: 'Помилка',
  };

  return stateNames[state] || state;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 2,
  }).format(price);
}
