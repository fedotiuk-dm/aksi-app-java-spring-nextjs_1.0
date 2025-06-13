// 🔥 ЕТАП 2: ZUSTAND UI СТАН - wizard/main domain
// Тільки UI стан, НЕ API дані (це робить React Query)

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// 📋 UI стан (НЕ API дані - це робить React Query)
interface MainUIState {
  // Поточна сесія візарда
  sessionId: string | null;

  // UI флаги
  isInitializing: boolean;
  showDebugMode: boolean;
  isCompact: boolean;
}

// 🎯 UI дії
interface MainUIActions {
  // Сесія
  setSessionId: (sessionId: string | null) => void;

  // UI контроли
  setInitializing: (loading: boolean) => void;
  toggleDebugMode: () => void;
  toggleCompactMode: () => void;

  // Скидання
  reset: () => void;
}

// 🔍 Селектори для оптимізації
export const mainSelectors = {
  hasSession: (state: MainUIState & MainUIActions) => !!state.sessionId,
  isReady: (state: MainUIState & MainUIActions) => !!state.sessionId && !state.isInitializing,
};

// 🏪 Zustand store
export const useMainStore = create<MainUIState & MainUIActions>()(
  subscribeWithSelector((set) => ({
    // 📊 Початковий стан
    sessionId: null,
    isInitializing: false,
    showDebugMode: false,
    isCompact: false,

    // 🎬 Дії
    setSessionId: (sessionId) => set({ sessionId }),
    setInitializing: (isInitializing) => set({ isInitializing }),
    toggleDebugMode: () => set((state) => ({ showDebugMode: !state.showDebugMode })),
    toggleCompactMode: () => set((state) => ({ isCompact: !state.isCompact })),

    // 🧹 Скидання стану
    reset: () =>
      set({
        sessionId: null,
        isInitializing: false,
        showDebugMode: false,
        isCompact: false,
      }),
  }))
);
