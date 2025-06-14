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
  onStartItemWizard: () => void;
  onEditItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onCompleteStage: () => void;
}

export const ItemManagerStep: React.FC<ItemManagerStepProps> = ({
  onStartItemWizard,
  onEditItem,
  onDeleteItem,
  onCompleteStage,
}) => {
  // ========== ДОМЕННА ЛОГІКА ==========
  const { ui, data, loading, mutations, computed, forms } = useStage2ItemManager();

  // ========== ОБРОБНИКИ ПОДІЙ ==========
  const handleAddItem = () => {
    // Викликаємо проп для запуску візарда
    onStartItemWizard();
  };

  const handleEditClick = (itemId: string) => {
    // Встановлюємо ID предмета для редагування в UI стані
    ui.setEditingItemId(itemId);
    // Викликаємо проп для переходу до редагування
    onEditItem(itemId);
  };

  const handleDeleteClick = (itemId: string) => {
    ui.setDeletingItemId(itemId);
    ui.setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (ui.deletingItemId) {
      // Викликаємо проп для видалення
      await onDeleteItem(ui.deletingItemId);
      ui.setDeletingItemId(null);
      ui.setShowDeleteConfirmation(false);
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

      {/* Статистика та головна кнопка */}
      <ItemManagerHeader
        itemsCount={items.length}
        totalAmount={totalAmount}
        onAddItem={handleAddItem}
        loading={loading.isAnyLoading}
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
        disabled={loading.isAnyLoading}
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
