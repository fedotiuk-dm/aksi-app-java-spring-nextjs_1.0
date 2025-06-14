// Тонка обгортка над Orval хуками для Stage2 Item Manager
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

// Orval хуки (готові з бекенду)
import {
  useStage2InitializeItemManager,
  useStage2UpdateItemInOrder,
  useStage2DeleteItemFromOrder,
  useStage2StartNewItemWizard,
  useStage2StartEditItemWizard,
  useStage2CloseWizard,
  useStage2SynchronizeManager,
  useStage2AddItemToOrder,
  useStage2CompleteStage,
  useStage2GetCurrentManager,
  useStage2ValidateCurrentState,
  useStage2GetCurrentState,
  useStage2CheckReadinessToProceed,
} from '@api/stage2';

// Локальні імпорти
import {
  ITEM_MANAGER_OPERATIONS,
  ITEM_MANAGER_UI_STATES,
  VIEW_MODES,
  TABLE_CONFIG,
  ITEM_MANAGER_VALIDATION_RULES,
} from './constants';
import {
  itemSearchFormSchema,
  tableDisplayFormSchema,
  deleteConfirmationFormSchema,
  proceedToNextStageFormSchema,
  type ItemManagerSearchFormData,
  type TableDisplayFormData,
  type DeleteConfirmationFormData,
  type ProceedToNextStageFormData,
} from './schemas';
import { useItemManagerStore, useItemManagerSelectors } from './store';

// =================== ТОНКА ОБГОРТКА ===================
export const useStage2ItemManager = () => {
  // UI стан з Zustand
  const uiState = useItemManagerStore();
  const selectors = useItemManagerSelectors();

  // Orval API хуки (без додаткової логіки)
  const initializeManagerMutation = useStage2InitializeItemManager();
  const updateItemMutation = useStage2UpdateItemInOrder();
  const deleteItemMutation = useStage2DeleteItemFromOrder();
  const startNewWizardMutation = useStage2StartNewItemWizard();
  const startEditWizardMutation = useStage2StartEditItemWizard();
  const closeWizardMutation = useStage2CloseWizard();
  const synchronizeManagerMutation = useStage2SynchronizeManager();
  const addItemMutation = useStage2AddItemToOrder();
  const completeStageMutation = useStage2CompleteStage();

  // Запити даних
  const currentManagerQuery = useStage2GetCurrentManager(uiState.sessionId || '', {
    query: {
      enabled: !!uiState.sessionId && uiState.currentUIState === ITEM_MANAGER_UI_STATES.READY,
    },
  });

  const validateCurrentStateQuery = useStage2ValidateCurrentState(uiState.sessionId || '', {
    query: {
      enabled: !!uiState.sessionId && uiState.currentUIState === ITEM_MANAGER_UI_STATES.READY,
    },
  });

  const getCurrentStateQuery = useStage2GetCurrentState(uiState.sessionId || '', {
    query: {
      enabled: !!uiState.sessionId && uiState.currentUIState === ITEM_MANAGER_UI_STATES.READY,
    },
  });

  const checkReadinessToProceedQuery = useStage2CheckReadinessToProceed(uiState.sessionId || '', {
    query: {
      enabled: !!uiState.sessionId && uiState.currentUIState === ITEM_MANAGER_UI_STATES.READY,
    },
  });

  // =================== ФОРМИ З ZOD ВАЛІДАЦІЄЮ ===================
  // Форма пошуку предметів
  const itemSearchForm = useForm<ItemManagerSearchFormData>({
    resolver: zodResolver(itemSearchFormSchema),
    defaultValues: {
      searchTerm: uiState.searchTerm,
    },
  });

  // Форма налаштувань таблиці
  const tableDisplayForm = useForm<TableDisplayFormData>({
    resolver: zodResolver(tableDisplayFormSchema),
    defaultValues: {
      itemsPerPage: uiState.itemsPerPage,
      sortBy: uiState.sortBy,
      sortOrder: uiState.sortOrder,
    },
    mode: 'onChange',
  });

  // Форма підтвердження видалення
  const deleteConfirmationForm = useForm<DeleteConfirmationFormData>({
    resolver: zodResolver(deleteConfirmationFormSchema),
    defaultValues: {
      confirmed: false,
      itemId: uiState.deletingItemId || '',
    },
  });

  // Форма переходу до наступного етапу
  const proceedToNextStageForm = useForm<ProceedToNextStageFormData>({
    resolver: zodResolver(proceedToNextStageFormSchema),
    defaultValues: {
      confirmed: false,
      itemsCount: uiState.totalItemsCount,
    },
  });

  // Стан завантаження (простий)
  const loading = useMemo(
    () => ({
      isInitializing: initializeManagerMutation.isPending,
      isUpdatingItem: updateItemMutation.isPending,
      isDeletingItem: deleteItemMutation.isPending,
      isStartingNewWizard: startNewWizardMutation.isPending,
      isStartingEditWizard: startEditWizardMutation.isPending,
      isClosingWizard: closeWizardMutation.isPending,
      isSynchronizing: synchronizeManagerMutation.isPending,
      isAddingItem: addItemMutation.isPending,
      isCompletingStage: completeStageMutation.isPending,
      isLoadingManager: currentManagerQuery.isLoading,
      isValidatingState: validateCurrentStateQuery.isLoading,
      isLoadingState: getCurrentStateQuery.isLoading,
      isCheckingReadiness: checkReadinessToProceedQuery.isLoading,
      isAnyLoading:
        initializeManagerMutation.isPending ||
        updateItemMutation.isPending ||
        deleteItemMutation.isPending ||
        startNewWizardMutation.isPending ||
        startEditWizardMutation.isPending ||
        closeWizardMutation.isPending ||
        synchronizeManagerMutation.isPending ||
        addItemMutation.isPending ||
        completeStageMutation.isPending ||
        currentManagerQuery.isLoading ||
        validateCurrentStateQuery.isLoading ||
        getCurrentStateQuery.isLoading ||
        checkReadinessToProceedQuery.isLoading,
    }),
    [
      initializeManagerMutation.isPending,
      updateItemMutation.isPending,
      deleteItemMutation.isPending,
      startNewWizardMutation.isPending,
      startEditWizardMutation.isPending,
      closeWizardMutation.isPending,
      synchronizeManagerMutation.isPending,
      addItemMutation.isPending,
      completeStageMutation.isPending,
      currentManagerQuery.isLoading,
      validateCurrentStateQuery.isLoading,
      getCurrentStateQuery.isLoading,
      checkReadinessToProceedQuery.isLoading,
    ]
  );

  // =================== ОБЧИСЛЕНІ ЗНАЧЕННЯ ===================
  const computed = useMemo(
    () => ({
      // Валідація з константами
      canInitialize: !!uiState.sessionId && !!uiState.orderId,
      canAddItem: ITEM_MANAGER_VALIDATION_RULES.canAddItem(uiState.sessionId),
      canEditItem: ITEM_MANAGER_VALIDATION_RULES.canEditItem(
        uiState.editingItemId,
        uiState.sessionId
      ),
      canDeleteItem: ITEM_MANAGER_VALIDATION_RULES.canDeleteItem(
        uiState.deletingItemId,
        uiState.sessionId
      ),
      canCompleteStage: ITEM_MANAGER_VALIDATION_RULES.canCompleteStage(uiState.totalItemsCount),
      canSynchronize: ITEM_MANAGER_VALIDATION_RULES.canSynchronize(uiState.sessionId),

      // Стан операцій
      isInitialized: uiState.currentUIState !== ITEM_MANAGER_UI_STATES.INITIALIZING,
      isReady: uiState.currentUIState === ITEM_MANAGER_UI_STATES.READY,
      isLoading: uiState.currentUIState === ITEM_MANAGER_UI_STATES.LOADING,
      isSaving: uiState.currentUIState === ITEM_MANAGER_UI_STATES.SAVING,
      hasError: uiState.currentUIState === ITEM_MANAGER_UI_STATES.ERROR,

      // Таблиця стан
      hasItems: uiState.totalItemsCount > 0,
      hasSelectedItems: uiState.selectedItemIds.length > 0,
      isMultipleSelection: uiState.selectedItemIds.length > 1,
      hasSearchFilter: uiState.searchTerm.length > 0,

      // Пагінація
      totalPages: Math.ceil(uiState.totalItemsCount / uiState.itemsPerPage),
      hasNextPage:
        uiState.currentPage < Math.ceil(uiState.totalItemsCount / uiState.itemsPerPage) - 1,
      hasPreviousPage: uiState.currentPage > 0,
      startIndex: uiState.currentPage * uiState.itemsPerPage,
      endIndex: Math.min((uiState.currentPage + 1) * uiState.itemsPerPage, uiState.totalItemsCount),

      // Workflow стан
      currentOperationLabel: (() => {
        switch (uiState.currentOperation) {
          case ITEM_MANAGER_OPERATIONS.INITIALIZE:
            return 'Ініціалізація';
          case ITEM_MANAGER_OPERATIONS.ADD_ITEM:
            return 'Додавання предмета';
          case ITEM_MANAGER_OPERATIONS.EDIT_ITEM:
            return 'Редагування предмета';
          case ITEM_MANAGER_OPERATIONS.DELETE_ITEM:
            return 'Видалення предмета';
          case ITEM_MANAGER_OPERATIONS.SYNCHRONIZE:
            return 'Синхронізація';
          case ITEM_MANAGER_OPERATIONS.COMPLETE_STAGE:
            return 'Завершення етапу';
          default:
            return 'Невідома операція';
        }
      })(),
    }),
    [
      uiState.sessionId,
      uiState.orderId,
      uiState.editingItemId,
      uiState.deletingItemId,
      uiState.totalItemsCount,
      uiState.currentUIState,
      uiState.selectedItemIds.length,
      uiState.searchTerm.length,
      uiState.currentPage,
      uiState.itemsPerPage,
      uiState.currentOperation,
    ]
  );

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (прямо з Zustand + селектори)
    ui: {
      ...uiState,
      ...selectors,
    },

    // API дані (прямо з Orval)
    data: {
      currentManager: currentManagerQuery.data,
      currentState: getCurrentStateQuery.data,
      validationResult: validateCurrentStateQuery.data,
      readinessCheck: checkReadinessToProceedQuery.data,
    },

    // Стан завантаження
    loading,

    // Мутації (прямо з Orval)
    mutations: {
      initializeManager: initializeManagerMutation,
      updateItem: updateItemMutation,
      deleteItem: deleteItemMutation,
      startNewWizard: startNewWizardMutation,
      startEditWizard: startEditWizardMutation,
      closeWizard: closeWizardMutation,
      synchronizeManager: synchronizeManagerMutation,
      addItem: addItemMutation,
      completeStage: completeStageMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      currentManager: currentManagerQuery,
      validateCurrentState: validateCurrentStateQuery,
      getCurrentState: getCurrentStateQuery,
      checkReadinessToProceed: checkReadinessToProceedQuery,
    },

    // Форми з валідацією
    forms: {
      itemSearch: itemSearchForm,
      tableDisplay: tableDisplayForm,
      deleteConfirmation: deleteConfirmationForm,
      proceedToNextStage: proceedToNextStageForm,
    },

    // Обчислені значення
    computed,

    // Константи (для UI компонентів)
    constants: {
      OPERATIONS: ITEM_MANAGER_OPERATIONS,
      UI_STATES: ITEM_MANAGER_UI_STATES,
      VIEW_MODES,
      TABLE_CONFIG,
      VALIDATION_RULES: ITEM_MANAGER_VALIDATION_RULES,
    },
  };
};

// =================== ТИПИ ===================
export type UseStage2ItemManagerReturn = ReturnType<typeof useStage2ItemManager>;
