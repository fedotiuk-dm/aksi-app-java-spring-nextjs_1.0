import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  initializeItemManager,
  getCurrentManager,
  synchronizeManager,
  terminateSession,
  resetSession,
  addItemToOrder,
  updateItemInOrder,
  deleteItemFromOrder,
  startNewItemWizard,
  startEditItemWizard,
  closeWizard,
  completeStage2,
  validateCurrentState,
  checkReadinessToProceed,
  type ItemManagerDTO,
  type OrderItemDTO,
  type ValidationResult,
} from '@/shared/api/generated/full';

import { STAGE2_INITIAL_STATE } from '../types/stage2.types';

import type { Stage2Store, Stage2State, WizardMode } from '../types/stage2.types';

// Константи для повідомлень про помилки
const SESSION_NOT_INITIALIZED_ERROR = 'Сесія не ініціалізована';

/**
 * Zustand стор для управління Stage 2 - Item Manager
 *
 * Відповідальність:
 * - Управління станом менеджера предметів
 * - Взаємодія з API для CRUD операцій з предметами
 * - Управління підвізардом для додавання/редагування предметів
 * - Валідація та навігація до наступного етапу
 */
export const useStage2Store = create<Stage2Store>()(
  devtools(
    (set, get) => ({
      // ========== ПОЧАТКОВИЙ СТАН ==========
      ...STAGE2_INITIAL_STATE,

      // ========== ДЦІЇ ДЛЯ МЕНЕДЖЕРА ==========

      initializeManager: async (orderId: string) => {
        const { setLoading, clearError } = get();

        console.log('🚀 initializeManager: orderId =', orderId);

        try {
          setLoading(true);
          clearError();

          const manager = await initializeItemManager(orderId);

          console.log('✅ initializeManager: manager =', manager);
          console.log('✅ initializeManager: sessionId =', manager.sessionId);

          set({
            orderId,
            sessionId: manager.sessionId || null,
            manager,
            currentState: 'ITEMS_MANAGER_SCREEN',
            totalAmount: manager.totalAmount || 0,
            itemCount: manager.itemCount || 0,
            canProceedToNextStage: manager.canProceedToNextStage || false,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка ініціалізації менеджера',
            currentState: 'ERROR',
            isLoading: false,
          });
        }
      },

      refreshManager: async () => {
        const { sessionId, setLoading, clearError } = get();

        if (!sessionId) {
          set({ error: SESSION_NOT_INITIALIZED_ERROR });
          return;
        }

        try {
          setLoading(true);
          clearError();

          const manager = await getCurrentManager(sessionId);

          set({
            manager,
            totalAmount: manager.totalAmount || 0,
            itemCount: manager.itemCount || 0,
            canProceedToNextStage: manager.canProceedToNextStage || false,
            wizardMode: manager.wizardActive ? (manager.editMode ? 'edit' : 'create') : 'inactive',
            editingItemId: manager.editingItemId || null,
            activeWizardId: manager.activeWizardId || null,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка оновлення менеджера',
            isLoading: false,
          });
        }
      },

      synchronizeManager: async () => {
        const { sessionId, setLoading, clearError } = get();

        if (!sessionId) {
          set({ error: SESSION_NOT_INITIALIZED_ERROR });
          return;
        }

        try {
          setLoading(true);
          clearError();

          const manager = await synchronizeManager(sessionId);

          set({
            manager,
            totalAmount: manager.totalAmount || 0,
            itemCount: manager.itemCount || 0,
            canProceedToNextStage: manager.canProceedToNextStage || false,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка синхронізації',
            isLoading: false,
          });
        }
      },

      terminateSession: async () => {
        const { sessionId, setLoading, clearError } = get();

        if (!sessionId) return;

        try {
          setLoading(true);
          clearError();

          await terminateSession(sessionId);

          set({
            ...STAGE2_INITIAL_STATE,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка завершення сесії',
            isLoading: false,
          });
        }
      },

      resetSession: async () => {
        const { sessionId, setLoading, clearError } = get();

        if (!sessionId) return;

        try {
          setLoading(true);
          clearError();

          await resetSession(sessionId);

          set({
            manager: null,
            currentState: 'ITEMS_MANAGER_SCREEN',
            wizardMode: 'inactive',
            editingItemId: null,
            activeWizardId: null,
            totalAmount: 0,
            itemCount: 0,
            canProceedToNextStage: false,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка скидання сесії',
            isLoading: false,
          });
        }
      },

      // ========== ДІЇ ДЛЯ ПРЕДМЕТІВ ==========

      addItem: async (item: OrderItemDTO) => {
        const { sessionId, setLoading, clearError, refreshManager } = get();

        if (!sessionId) {
          set({ error: SESSION_NOT_INITIALIZED_ERROR });
          return;
        }

        try {
          setLoading(true);
          clearError();

          await addItemToOrder(sessionId, item);

          // Оновлюємо менеджер після додавання
          await refreshManager();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка додавання предмета',
            isLoading: false,
          });
        }
      },

      updateItem: async (itemId: string, item: OrderItemDTO) => {
        const { sessionId, setLoading, clearError, refreshManager } = get();

        if (!sessionId) {
          set({ error: SESSION_NOT_INITIALIZED_ERROR });
          return;
        }

        try {
          setLoading(true);
          clearError();

          await updateItemInOrder(sessionId, itemId, item);

          // Оновлюємо менеджер після оновлення
          await refreshManager();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка оновлення предмета',
            isLoading: false,
          });
        }
      },

      deleteItem: async (itemId: string) => {
        const { sessionId, setLoading, clearError, refreshManager } = get();

        if (!sessionId) {
          set({ error: SESSION_NOT_INITIALIZED_ERROR });
          return;
        }

        try {
          setLoading(true);
          clearError();

          await deleteItemFromOrder(sessionId, itemId);

          // Оновлюємо менеджер після видалення
          await refreshManager();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка видалення предмета',
            isLoading: false,
          });
        }
      },

      // ========== ДІЇ ДЛЯ ВІЗАРДА ==========

      startNewItemWizard: async () => {
        const { sessionId, setLoading, clearError } = get();

        console.log('🎯 startNewItemWizard: sessionId =', sessionId);

        if (!sessionId) {
          console.error('❌ startNewItemWizard: No sessionId found');
          set({ error: SESSION_NOT_INITIALIZED_ERROR });
          return;
        }

        try {
          setLoading(true);
          clearError();

          const manager = await startNewItemWizard(sessionId);

          set({
            manager,
            currentState: 'ITEM_WIZARD_ACTIVE',
            wizardMode: 'create',
            editingItemId: null,
            activeWizardId: manager.activeWizardId || null,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка запуску візарда',
            isLoading: false,
          });
        }
      },

      startEditItemWizard: async (itemId: string) => {
        const { sessionId, setLoading, clearError } = get();

        if (!sessionId) {
          set({ error: SESSION_NOT_INITIALIZED_ERROR });
          return;
        }

        try {
          setLoading(true);
          clearError();

          const manager = await startEditItemWizard(sessionId, itemId);

          set({
            manager,
            currentState: 'ITEM_WIZARD_ACTIVE',
            wizardMode: 'edit',
            editingItemId: itemId,
            activeWizardId: manager.activeWizardId || null,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка запуску редагування',
            isLoading: false,
          });
        }
      },

      closeWizard: async () => {
        const { sessionId, setLoading, clearError } = get();

        if (!sessionId) {
          set({ error: SESSION_NOT_INITIALIZED_ERROR });
          return;
        }

        try {
          setLoading(true);
          clearError();

          const manager = await closeWizard(sessionId);

          set({
            manager,
            currentState: 'ITEMS_MANAGER_SCREEN',
            wizardMode: 'inactive',
            editingItemId: null,
            activeWizardId: null,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка закриття візарда',
            isLoading: false,
          });
        }
      },

      // ========== ВАЛІДАЦІЯ ТА НАВІГАЦІЯ ==========

      validateCurrentState: async (): Promise<ValidationResult> => {
        const { sessionId, setLoading, clearError } = get();

        if (!sessionId) {
          const errorResult: ValidationResult = {
            valid: false,
            errors: [SESSION_NOT_INITIALIZED_ERROR],
          };
          set({ error: SESSION_NOT_INITIALIZED_ERROR });
          return errorResult;
        }

        try {
          setLoading(true);
          clearError();

          const result = await validateCurrentState(sessionId);

          set({ isLoading: false });
          return result;
        } catch (error) {
          const errorResult: ValidationResult = {
            valid: false,
            errors: [error instanceof Error ? error.message : 'Помилка валідації'],
          };

          set({
            error: error instanceof Error ? error.message : 'Помилка валідації',
            isLoading: false,
          });

          return errorResult;
        }
      },

      checkReadiness: async (): Promise<boolean> => {
        const { sessionId, setLoading, clearError } = get();

        if (!sessionId) {
          set({ error: SESSION_NOT_INITIALIZED_ERROR });
          return false;
        }

        try {
          setLoading(true);
          clearError();

          const isReady = await checkReadinessToProceed(sessionId);

          set({
            canProceedToNextStage: isReady,
            isLoading: false,
          });

          return isReady;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка перевірки готовності',
            isLoading: false,
          });
          return false;
        }
      },

      completeStage2: async () => {
        const { sessionId, setLoading, clearError } = get();

        if (!sessionId) {
          set({ error: SESSION_NOT_INITIALIZED_ERROR });
          return;
        }

        try {
          setLoading(true);
          clearError();

          const manager = await completeStage2(sessionId);

          set({
            manager,
            currentState: 'COMPLETED',
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Помилка завершення етапу',
            isLoading: false,
          });
        }
      },

      // ========== СЕРВІСНІ ДІЇ ==========

      clearError: () => set({ error: null }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'stage2-store',
      partialize: (state: Stage2Store) => ({
        sessionId: state.sessionId,
        orderId: state.orderId,
        currentState: state.currentState,
      }),
    }
  )
);
