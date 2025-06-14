'use client';

import { Add as AddIcon } from '@mui/icons-material';
import { Box, Typography, Alert, Fab, Card, CardContent } from '@mui/material';
import React, { useEffect, useRef, useCallback } from 'react';

// Доменна логіка
import { useStage2ItemManager } from '@/domains/wizard/stage2/item-manager';
import { ITEM_MANAGER_UI_STATES } from '@/domains/wizard/stage2/item-manager/constants';
import { useStage2Workflow } from '@/domains/wizard/stage2/workflow';
import { useMainWizard } from '@/domains/wizard/main';

// Локальні компоненти
import {
  ItemManagerHeader,
  ItemManagerSearchForm,
  ItemManagerTable,
  ItemManagerEmptyState,
  ItemManagerNavigation,
} from './components';

// Підвізард компоненти
import { Substep1Container } from './substep1/Substep1Container';

// Загальні компоненти - створимо простий діалог підтвердження локально
const SimpleConfirmationDialog: React.FC<{
  open: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}> = ({ open, title, content, onConfirm, onCancel, loading = false }) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
      }}
    >
      <Card sx={{ maxWidth: 400, mx: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            {content}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <button onClick={onCancel} disabled={loading}>
              Скасувати
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
              }}
            >
              {loading ? 'Видалення...' : 'Видалити'}
            </button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

interface ItemManagerStepProps {
  onCompleteStage: () => void;
}

export const ItemManagerStep: React.FC<ItemManagerStepProps> = ({ onCompleteStage }) => {
  // ========== ДОМЕННА ЛОГІКА ==========
  const { ui, data, loading, mutations, computed, forms } = useStage2ItemManager();
  const stage2Workflow = useStage2Workflow();
  const mainWizard = useMainWizard();

  // Ref для відстеження стану ініціалізації
  const initializationAttempted = useRef(false);
  const lastMainSessionId = useRef<string | null>(null);

  // ========== ІНІЦІАЛІЗАЦІЯ ==========
  const initializeStage2 = useCallback(async () => {
    const currentMainSessionId = mainWizard.ui.sessionId;
    const currentStage2SessionId = ui.sessionId;
    const isCurrentlyInitializing = loading.isInitializing;
    const isAlreadyInitialized = computed.isInitialized;

    console.log('🔍 initializeStage2 викликано з параметрами:', {
      mainWizardSessionId: currentMainSessionId,
      isInitialized: isAlreadyInitialized,
      isInitializing: isCurrentlyInitializing,
      currentUIState: ui.currentUIState,
      initializationAttempted: initializationAttempted.current,
      stage2SessionId: currentStage2SessionId,
    });

    // Перевіряємо чи потрібна ініціалізація
    if (
      !currentMainSessionId ||
      isAlreadyInitialized ||
      isCurrentlyInitializing ||
      initializationAttempted.current
    ) {
      console.log('🚫 Ініціалізація пропущена через умови:', {
        noSessionId: !currentMainSessionId,
        isInitialized: isAlreadyInitialized,
        isInitializing: isCurrentlyInitializing,
        initializationAttempted: initializationAttempted.current,
      });
      return;
    }

    // Перевіряємо чи Stage2 sessionId вже встановлений і відрізняється від головного
    if (currentStage2SessionId && currentStage2SessionId !== currentMainSessionId) {
      console.log('✅ Stage2 вже ініціалізований з sessionId:', currentStage2SessionId);
      return;
    }

    // Позначаємо що спроба ініціалізації розпочата
    initializationAttempted.current = true;

    try {
      console.log('🔄 Ініціалізація Stage2 Item Manager для orderId:', currentMainSessionId);

      ui.setCurrentUIState(ITEM_MANAGER_UI_STATES.INITIALIZING);

      // Використовуємо sessionId як orderId (згідно з логікою бекенду)
      const response = await mutations.initializeManager.mutateAsync({
        orderId: currentMainSessionId,
      });

      console.log('✅ Stage2 Item Manager ініціалізовано:', response);

      // Встановлюємо sessionId з відповіді API (Stage2 має власний sessionId)
      if (response?.sessionId) {
        console.log('🔄 Встановлюємо Stage2 sessionId:', response.sessionId);

        ui.setSessionId(response.sessionId);
        stage2Workflow.ui.setSessionId(response.sessionId);
      }

      // Переходимо до ready стану
      ui.setCurrentUIState(ITEM_MANAGER_UI_STATES.READY);
    } catch (error) {
      console.error('❌ Помилка ініціалізації Stage2 Item Manager:', error);
      ui.setCurrentUIState(ITEM_MANAGER_UI_STATES.ERROR);
      // Скидаємо прапорець при помилці, щоб можна було спробувати знову
      initializationAttempted.current = false;
    }
  }, [
    mainWizard.ui.sessionId,
    ui,
    computed.isInitialized,
    loading.isInitializing,
    mutations.initializeManager,
    stage2Workflow.ui,
  ]);

  useEffect(() => {
    const currentMainSessionId = mainWizard.ui.sessionId;

    // Перевіряємо чи змінився головний sessionId
    if (currentMainSessionId && currentMainSessionId !== lastMainSessionId.current) {
      console.log('🔄 Зміна головного sessionId:', {
        old: lastMainSessionId.current,
        new: currentMainSessionId,
      });

      // Скидаємо прапорець ініціалізації
      initializationAttempted.current = false;
      lastMainSessionId.current = currentMainSessionId;

      // Скидаємо стан Stage2 якщо він був ініціалізований з іншим sessionId
      if (ui.sessionId !== null && ui.sessionId !== currentMainSessionId) {
        console.log('🔄 Скидання стану Stage2');
        ui.resetUIState();
      }

      // Запускаємо ініціалізацію
      initializeStage2();
    }
  }, [mainWizard.ui.sessionId, initializeStage2, ui]);

  // ========== ОБРОБНИКИ ПОДІЙ ==========
  const handleAddItem = async () => {
    try {
      console.log('🔄 Запуск візарда предметів...');

      // Перевіряємо стан ініціалізації
      if (!computed.isReady) {
        console.error('❌ Stage2 ще не готовий для роботи. Поточний стан:', ui.currentUIState);
        return;
      }

      // Перевіряємо наявність sessionId
      if (!ui.sessionId) {
        console.error('❌ Відсутній sessionId для запуску візарда. UI стан:', {
          sessionId: ui.sessionId,
          currentUIState: ui.currentUIState,
          isReady: computed.isReady,
          mainWizardSessionId: mainWizard.ui.sessionId,
        });
        return;
      }

      // Запускаємо новий візард предметів через API
      const response = await stage2Workflow.mutations.startNewWizard.mutateAsync({
        sessionId: ui.sessionId,
      });

      console.log('✅ Візард предметів запущено:', response);

      // Встановлюємо стан візарда
      stage2Workflow.ui.setCurrentSubstep('substep1');
      stage2Workflow.ui.setCurrentUIState('item-wizard-active');
      stage2Workflow.ui.setCurrentOperation('start-new-item');
      stage2Workflow.ui.setIsWizardActive(true);
      stage2Workflow.ui.setShowItemWizard(true);
    } catch (error) {
      console.error('❌ Помилка запуску візарда предметів:', error);
    }
  };

  const handleEditClick = async (itemId: string) => {
    try {
      console.log('🔄 Запуск редагування предмета:', itemId);

      // Перевіряємо наявність sessionId
      if (!ui.sessionId) {
        console.error('❌ Відсутній sessionId для редагування предмета');
        return;
      }

      // Запускаємо редагування предмета через API
      const response = await stage2Workflow.mutations.startEditWizard.mutateAsync({
        sessionId: ui.sessionId,
        itemId: itemId,
      });

      console.log('✅ Редагування предмета запущено:', response);

      // Встановлюємо стан візарда для редагування
      stage2Workflow.ui.setActiveItemId(itemId);
      stage2Workflow.ui.setCurrentSubstep('substep1');
      stage2Workflow.ui.setCurrentUIState('item-wizard-active');
      stage2Workflow.ui.setCurrentOperation('start-edit-item');
      stage2Workflow.ui.setIsWizardActive(true);
      stage2Workflow.ui.setShowItemWizard(true);
    } catch (error) {
      console.error('❌ Помилка запуску редагування предмета:', error);
    }
  };

  const handleDeleteClick = (itemId: string) => {
    ui.setDeletingItemId(itemId);
    ui.setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (ui.deletingItemId) {
      try {
        console.log('🔄 Видалення предмета:', ui.deletingItemId);

        // TODO: Додати API виклик для видалення предмета
        // Поки що тільки логування
        console.log('✅ Предмет видалено (заглушка)');

        ui.setDeletingItemId(null);
        ui.setShowDeleteConfirmation(false);
      } catch (error) {
        console.error('❌ Помилка видалення предмета:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    ui.setDeletingItemId(null);
    ui.setShowDeleteConfirmation(false);
  };

  const handleSearchChange = (value: string) => {
    ui.setSearchTerm(value);
  };

  const handleProceedToNext = () => {
    // Викликаємо проп для завершення етапу
    onCompleteStage();
  };

  // Обробники для підвізарда
  const handleCloseWizard = async () => {
    try {
      console.log('🔄 Закриття візарда предметів...');

      if (ui.sessionId) {
        await stage2Workflow.mutations.closeWizard.mutateAsync({
          sessionId: ui.sessionId,
        });
      }

      // Скидаємо стан візарда
      stage2Workflow.ui.setIsWizardActive(false);
      stage2Workflow.ui.setShowItemWizard(false);
      stage2Workflow.ui.setActiveItemId(null);
      stage2Workflow.ui.setCurrentSubstep('substep1');

      console.log('✅ Візард закрито');
    } catch (error) {
      console.error('❌ Помилка закриття візарда:', error);
    }
  };

  const handleWizardCompleted = async () => {
    try {
      console.log('🔄 Завершення візарда предметів...');

      // Закриваємо візард
      await handleCloseWizard();

      // Оновлюємо дані менеджера
      // TODO: Можливо потрібно буде додати рефреш даних

      console.log('✅ Візард завершено, предмет додано');
    } catch (error) {
      console.error('❌ Помилка завершення візарда:', error);
    }
  };

  // ========== COMPUTED VALUES ==========
  const items = data.currentManager?.addedItems || [];
  const totalAmount = data.currentManager?.totalAmount || 0;

  // ========== RENDER ==========

  // Якщо активний підвізард, показуємо його замість менеджера
  if (stage2Workflow.ui.showItemWizard && stage2Workflow.ui.isWizardActive) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Substep1Container
          sessionId={ui.sessionId}
          onNext={() => {
            // Перехід до наступного підетапу
            stage2Workflow.ui.goToNextSubstep();
          }}
          onPrevious={() => {
            // Повернення до попереднього підетапу або закриття візарда
            if (stage2Workflow.ui.currentSubstep === 'substep1') {
              handleCloseWizard();
            } else {
              stage2Workflow.ui.goToPreviousSubstep();
            }
          }}
          onComplete={handleWizardCompleted}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Заголовок */}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Менеджер предметів
      </Typography>

      {/* Індикатор ініціалізації */}
      {!computed.isReady && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Ініціалізація менеджера предметів... Поточний стан: {ui.currentUIState}
        </Alert>
      )}

      {/* Статистика та головна кнопка */}
      <ItemManagerHeader
        itemsCount={items.length}
        totalAmount={totalAmount}
        onAddItem={handleAddItem}
        loading={loading.isAnyLoading || !computed.isReady}
      />

      {/* Пошук (показуємо тільки якщо є предмети) */}
      {items.length > 0 && (
        <ItemManagerSearchForm searchTerm={ui.searchTerm} onSearchChange={handleSearchChange} />
      )}

      {/* Контент: таблиця або порожній стан */}
      {items.length === 0 ? (
        <ItemManagerEmptyState onAddItem={handleAddItem} />
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Список предметів ({items.length})
            </Typography>
            <ItemManagerTable
              items={items}
              searchTerm={ui.searchTerm}
              onEditItem={handleEditClick}
              onDeleteItem={handleDeleteClick}
              loading={loading.isAnyLoading}
            />
          </CardContent>
        </Card>
      )}

      {/* Навігація (показуємо тільки якщо є предмети) */}
      {items.length > 0 && (
        <ItemManagerNavigation
          itemsCount={items.length}
          onAddItem={handleAddItem}
          onProceedToNext={handleProceedToNext}
          loading={loading.isAnyLoading}
        />
      )}

      {/* Floating Action Button для швидкого додавання */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAddItem}
        disabled={loading.isAnyLoading || !computed.isReady}
      >
        <AddIcon />
      </Fab>

      {/* Діалог підтвердження видалення */}
      <SimpleConfirmationDialog
        open={ui.showDeleteConfirmation}
        title="Видалити предмет?"
        content="Ви впевнені, що хочете видалити цей предмет з замовлення? Цю дію неможливо скасувати."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={loading.isDeletingItem}
      />
    </Box>
  );
};
