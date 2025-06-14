'use client';

import { Add as AddIcon } from '@mui/icons-material';
import { Box, Typography, Alert, Fab, Card, CardContent } from '@mui/material';
import React from 'react';

// Доменна логіка
import { useStage2ItemManager } from '@/domains/wizard/stage2/item-manager';

// Локальні компоненти
import {
  ItemManagerHeader,
  ItemManagerSearchForm,
  ItemManagerTable,
  ItemManagerEmptyState,
  ItemManagerNavigation,
} from './components';

interface ItemManagerStepProps {
  sessionId: string;
  onCompleteStage: () => void;
  onAddItem?: () => void;
}

export const ItemManagerStep: React.FC<ItemManagerStepProps> = ({
  sessionId,
  onCompleteStage,
  onAddItem,
}) => {
  // ========== ДОМЕННА ЛОГІКА ==========
  const { ui, data, loading, mutations, computed } = useStage2ItemManager();
  const { sessionId: currentSessionId, setSessionId } = ui;

  // ========== СИНХРОНІЗАЦІЯ SESSION ID ==========
  React.useEffect(() => {
    if (sessionId && sessionId !== currentSessionId) {
      console.log('🔄 Синхронізація sessionId в Item Manager:', sessionId);
      setSessionId(sessionId);
    }
  }, [sessionId, currentSessionId, setSessionId]);

  // ========== ОБРОБНИКИ ==========
  const handleAddItem = async () => {
    if (onAddItem) {
      // Використовуємо зовнішній обробник (для запуску підвізарда)
      onAddItem();
    } else {
      // Fallback - стандартна логіка
      try {
        await mutations.startNewWizard.mutateAsync({ sessionId });
        console.log('✅ Візард додавання предмета запущено');
      } catch (error) {
        console.error('❌ Помилка запуску візарда:', error);
      }
    }
  };

  const handleEditItem = async (itemId: string) => {
    try {
      await mutations.startEditWizard.mutateAsync({ sessionId, itemId });
      console.log('✅ Візард редагування предмета запущено');
    } catch (error) {
      console.error('❌ Помилка запуску візарда редагування:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await mutations.deleteItem.mutateAsync({ sessionId, itemId });
      console.log('✅ Предмет видалено');
    } catch (error) {
      console.error('❌ Помилка видалення предмета:', error);
    }
  };

  const handleSearchChange = (value: string) => {
    ui.setSearchTerm(value);
  };

  const handleProceedToNext = () => {
    onCompleteStage();
  };

  // ========== COMPUTED VALUES ==========
  const items = data.currentManager?.addedItems || [];
  const totalAmount = data.currentManager?.totalAmount || 0;

  // ========== RENDER ==========
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Заголовок */}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Менеджер предметів
      </Typography>

      {/* Індикатор ініціалізації */}
      {!computed.isReady && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Ініціалізація менеджера предметів...
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
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
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
    </Box>
  );
};
