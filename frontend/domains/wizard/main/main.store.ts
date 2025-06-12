// ЕТАП 2: Zustand стор для головного управління Order Wizard
// Тільки UI стан згідно з принципом - API дані керуються React Query

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// ========== ТИПИ СТАНУ ==========

interface OrderWizardMainUIState {
  // Основна сесія Order Wizard
  sessionId: string | null;
  currentStage: 1 | 2 | 3 | 4;

  // Навігація та стан етапів
  completedStages: number[];
  availableStages: number[];

  // UI стан
  isInitialized: boolean;
  isWizardStarted: boolean;

  // Загальні параметри
  lastActiveTime: Date | null;

  // Debug режим
  isDebugMode: boolean;
}

interface OrderWizardMainUIActions {
  // Ініціалізація та запуск
  initializeWizard: () => void;
  startWizard: (sessionId: string) => void;
  resetWizard: () => void;

  // Навігація між етапами
  setCurrentStage: (stage: 1 | 2 | 3 | 4) => void;
  completeStage: (stage: number) => void;
  unlockStage: (stage: number) => void;

  // Управління сесією
  updateSessionId: (sessionId: string | null) => void;
  updateLastActiveTime: () => void;

  // Debug утиліти
  toggleDebugMode: () => void;

  // Getters (computed values)
  canProceedToStage: (targetStage: number) => boolean;
  isStageCompleted: (stage: number) => boolean;
  isStageAvailable: (stage: number) => boolean;
}

type OrderWizardMainStore = OrderWizardMainUIState & OrderWizardMainUIActions;

// ========== СЕЛЕКТОРИ ДЛЯ ОПТИМІЗАЦІЇ ==========

export const selectSessionInfo = (state: OrderWizardMainStore) => ({
  sessionId: state.sessionId,
  currentStage: state.currentStage,
  isInitialized: state.isInitialized,
  isWizardStarted: state.isWizardStarted,
});

export const selectNavigationState = (state: OrderWizardMainStore) => ({
  currentStage: state.currentStage,
  completedStages: state.completedStages,
  availableStages: state.availableStages,
  canProceedToStage: state.canProceedToStage,
  isStageCompleted: state.isStageCompleted,
  isStageAvailable: state.isStageAvailable,
});

export const selectDebugInfo = (state: OrderWizardMainStore) => ({
  isDebugMode: state.isDebugMode,
  lastActiveTime: state.lastActiveTime,
  sessionId: state.sessionId,
  currentStage: state.currentStage,
  completedStages: state.completedStages,
});

// ========== STORE IMPLEMENTATION ==========

export const useOrderWizardMainStore = create<OrderWizardMainStore>()(
  subscribeWithSelector((set, get) => ({
    // ========== ПОЧАТКОВИЙ СТАН ==========
    sessionId: null,
    currentStage: 1,
    completedStages: [],
    availableStages: [1], // Спочатку доступний тільки перший етап
    isInitialized: false,
    isWizardStarted: false,
    lastActiveTime: null,
    isDebugMode: process.env.NODE_ENV === 'development',

    // ========== ДІЇ ==========

    // Ініціалізація візарда
    initializeWizard: () => {
      set({
        isInitialized: true,
        currentStage: 1,
        availableStages: [1],
        completedStages: [],
        lastActiveTime: new Date(),
      });
    },

    // Запуск візарда з sessionId
    startWizard: (sessionId: string) => {
      set({
        sessionId,
        isWizardStarted: true,
        currentStage: 1,
        availableStages: [1],
        completedStages: [],
        lastActiveTime: new Date(),
      });
    },

    // Скидання стану
    resetWizard: () => {
      set({
        sessionId: null,
        currentStage: 1,
        completedStages: [],
        availableStages: [1],
        isInitialized: false,
        isWizardStarted: false,
        lastActiveTime: null,
      });
    },

    // Навігація між етапами
    setCurrentStage: (stage: 1 | 2 | 3 | 4) => {
      const state = get();
      if (state.isStageAvailable(stage)) {
        set({
          currentStage: stage,
          lastActiveTime: new Date(),
        });
      }
    },

    // Завершення етапу
    completeStage: (stage: number) => {
      const state = get();
      const newCompletedStages = [...state.completedStages];

      if (!newCompletedStages.includes(stage)) {
        newCompletedStages.push(stage);
      }

      // Розблоковуємо наступний етап
      const newAvailableStages = [...state.availableStages];
      const nextStage = stage + 1;
      if (nextStage <= 4 && !newAvailableStages.includes(nextStage)) {
        newAvailableStages.push(nextStage);
      }

      set({
        completedStages: newCompletedStages,
        availableStages: newAvailableStages,
        lastActiveTime: new Date(),
      });
    },

    // Розблокування етапу
    unlockStage: (stage: number) => {
      const state = get();
      const newAvailableStages = [...state.availableStages];

      if (!newAvailableStages.includes(stage)) {
        newAvailableStages.push(stage);
        newAvailableStages.sort((a, b) => a - b);
      }

      set({
        availableStages: newAvailableStages,
        lastActiveTime: new Date(),
      });
    },

    // Оновлення sessionId
    updateSessionId: (sessionId: string | null) => {
      set({
        sessionId,
        lastActiveTime: new Date(),
      });
    },

    // Оновлення часу активності
    updateLastActiveTime: () => {
      set({
        lastActiveTime: new Date(),
      });
    },

    // Debug режим
    toggleDebugMode: () => {
      set((state) => ({
        isDebugMode: !state.isDebugMode,
      }));
    },

    // ========== COMPUTED VALUES (GETTERS) ==========

    // Перевірка чи можна перейти до етапу
    canProceedToStage: (targetStage: number): boolean => {
      const state = get();
      return state.availableStages.includes(targetStage);
    },

    // Перевірка чи етап завершений
    isStageCompleted: (stage: number): boolean => {
      const state = get();
      return state.completedStages.includes(stage);
    },

    // Перевірка чи етап доступний
    isStageAvailable: (stage: number): boolean => {
      const state = get();
      return state.availableStages.includes(stage);
    },
  }))
);
