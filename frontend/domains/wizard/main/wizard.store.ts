// Zustand стор для Main Wizard - ТІЛЬКИ UI стан
// НЕ зберігаємо API дані (це робить React Query)

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type { MainWizardState } from './wizard.constants';

// =================== ТИПИ СТАНУ ===================
interface MainWizardUIState {
  // Основний стан
  sessionId: string | null;
  currentState: MainWizardState | null;

  // Навігація
  canGoBack: boolean;
  canGoForward: boolean;
  isNavigating: boolean;

  // Прогрес
  currentStage: number;
  completedStages: number[];
  totalStages: number;

  // Модальні вікна та UI стан
  showProgressModal: boolean;
  showConfirmationModal: boolean;
  showErrorModal: boolean;

  // Повідомлення
  lastMessage: string | null;
  lastError: string | null;

  // Налаштування
  autoSave: boolean;
  showHints: boolean;
  compactMode: boolean;

  // Сесії
  activeSessions: string[];
  lastSessionActivity: string | null;
}

interface MainWizardUIActions {
  // Основні дії
  setSessionId: (sessionId: string | null) => void;
  setCurrentState: (state: MainWizardState | null) => void;

  // Навігація
  setCanGoBack: (canGoBack: boolean) => void;
  setCanGoForward: (canGoForward: boolean) => void;
  setIsNavigating: (isNavigating: boolean) => void;

  // Прогрес
  setCurrentStage: (stage: number) => void;
  addCompletedStage: (stage: number) => void;
  removeCompletedStage: (stage: number) => void;
  resetProgress: () => void;

  // Модальні вікна
  setShowProgressModal: (show: boolean) => void;
  setShowConfirmationModal: (show: boolean) => void;
  setShowErrorModal: (show: boolean) => void;
  closeAllModals: () => void;

  // Повідомлення
  setLastMessage: (message: string | null) => void;
  setLastError: (error: string | null) => void;
  clearMessages: () => void;

  // Налаштування
  setAutoSave: (autoSave: boolean) => void;
  setShowHints: (showHints: boolean) => void;
  setCompactMode: (compactMode: boolean) => void;

  // Сесії
  addActiveSession: (sessionId: string) => void;
  removeActiveSession: (sessionId: string) => void;
  clearActiveSessions: () => void;
  setLastSessionActivity: (timestamp: string | null) => void;

  // Скидання стану
  resetWizardState: () => void;
}

// =================== ПОЧАТКОВИЙ СТАН ===================
const initialState: MainWizardUIState = {
  // Основний стан
  sessionId: null,
  currentState: null,

  // Навігація
  canGoBack: false,
  canGoForward: false,
  isNavigating: false,

  // Прогрес
  currentStage: 0,
  completedStages: [],
  totalStages: 5,

  // Модальні вікна та UI стан
  showProgressModal: false,
  showConfirmationModal: false,
  showErrorModal: false,

  // Повідомлення
  lastMessage: null,
  lastError: null,

  // Налаштування
  autoSave: true,
  showHints: true,
  compactMode: false,

  // Сесії
  activeSessions: [],
  lastSessionActivity: null,
};

// =================== ZUSTAND СТОР ===================
export const useMainWizardStore = create<MainWizardUIState & MainWizardUIActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // =================== ОСНОВНІ ДІЇ ===================
    setSessionId: (sessionId) => set({ sessionId }),
    setCurrentState: (currentState) => set({ currentState }),

    // =================== НАВІГАЦІЯ ===================
    setCanGoBack: (canGoBack) => set({ canGoBack }),
    setCanGoForward: (canGoForward) => set({ canGoForward }),
    setIsNavigating: (isNavigating) => set({ isNavigating }),

    // =================== ПРОГРЕС ===================
    setCurrentStage: (currentStage) => set({ currentStage }),

    addCompletedStage: (stage) => {
      const { completedStages } = get();
      if (!completedStages.includes(stage)) {
        set({ completedStages: [...completedStages, stage].sort() });
      }
    },

    removeCompletedStage: (stage) => {
      const { completedStages } = get();
      set({ completedStages: completedStages.filter((s) => s !== stage) });
    },

    resetProgress: () =>
      set({
        currentStage: 0,
        completedStages: [],
      }),

    // =================== МОДАЛЬНІ ВІКНА ===================
    setShowProgressModal: (showProgressModal) => set({ showProgressModal }),
    setShowConfirmationModal: (showConfirmationModal) => set({ showConfirmationModal }),
    setShowErrorModal: (showErrorModal) => set({ showErrorModal }),

    closeAllModals: () =>
      set({
        showProgressModal: false,
        showConfirmationModal: false,
        showErrorModal: false,
      }),

    // =================== ПОВІДОМЛЕННЯ ===================
    setLastMessage: (lastMessage) => set({ lastMessage }),
    setLastError: (lastError) => set({ lastError }),

    clearMessages: () =>
      set({
        lastMessage: null,
        lastError: null,
      }),

    // =================== НАЛАШТУВАННЯ ===================
    setAutoSave: (autoSave) => set({ autoSave }),
    setShowHints: (showHints) => set({ showHints }),
    setCompactMode: (compactMode) => set({ compactMode }),

    // =================== СЕСІЇ ===================
    addActiveSession: (sessionId) => {
      const { activeSessions } = get();
      if (!activeSessions.includes(sessionId)) {
        set({
          activeSessions: [...activeSessions, sessionId],
          lastSessionActivity: new Date().toISOString(),
        });
      }
    },

    removeActiveSession: (sessionId) => {
      const { activeSessions } = get();
      set({
        activeSessions: activeSessions.filter((id) => id !== sessionId),
        lastSessionActivity: new Date().toISOString(),
      });
    },

    clearActiveSessions: () =>
      set({
        activeSessions: [],
        lastSessionActivity: new Date().toISOString(),
      }),

    setLastSessionActivity: (lastSessionActivity) => set({ lastSessionActivity }),

    // =================== СКИДАННЯ СТАНУ ===================
    resetWizardState: () => set(initialState),
  }))
);

// =================== СЕЛЕКТОРИ ===================
export const useMainWizardSelectors = () => {
  const store = useMainWizardStore();

  return {
    // Обчислені значення
    progressPercentage: Math.round((store.completedStages.length / store.totalStages) * 100),
    hasActiveSessions: store.activeSessions.length > 0,
    hasMessages: !!(store.lastMessage || store.lastError),
    isModalOpen: store.showProgressModal || store.showConfirmationModal || store.showErrorModal,

    // Стан навігації
    navigationState: {
      canGoBack: store.canGoBack,
      canGoForward: store.canGoForward,
      isNavigating: store.isNavigating,
    },

    // Стан прогресу
    progressState: {
      currentStage: store.currentStage,
      completedStages: store.completedStages,
      totalStages: store.totalStages,
      percentage: Math.round((store.completedStages.length / store.totalStages) * 100),
    },

    // Стан модальних вікон
    modalState: {
      showProgressModal: store.showProgressModal,
      showConfirmationModal: store.showConfirmationModal,
      showErrorModal: store.showErrorModal,
      isAnyModalOpen:
        store.showProgressModal || store.showConfirmationModal || store.showErrorModal,
    },

    // Стан повідомлень
    messageState: {
      lastMessage: store.lastMessage,
      lastError: store.lastError,
      hasMessages: !!(store.lastMessage || store.lastError),
    },

    // Налаштування
    settingsState: {
      autoSave: store.autoSave,
      showHints: store.showHints,
      compactMode: store.compactMode,
    },

    // Стан сесій
    sessionState: {
      sessionId: store.sessionId,
      activeSessions: store.activeSessions,
      lastSessionActivity: store.lastSessionActivity,
      hasActiveSessions: store.activeSessions.length > 0,
    },
  };
};
