// ЕТАП 2: Zustand store для основного управління візардом
'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type { WizardSessionState, WizardSystemState } from '../schemas';

// ========== ІНТЕРФЕЙСИ СТАНУ ==========
interface WizardManagementState extends WizardSessionState, WizardSystemState {
  // Додаткові UI властивості
  isLoading: boolean;
  error: string | null;
  lastActionTimestamp: Date | null;
}

// ========== ІНТЕРФЕЙСИ ACTIONS ==========
interface WizardManagementActions {
  // Сесія
  setSessionId: (sessionId: string | null) => void;
  setCurrentStage: (stage: number) => void;
  setIsActive: (isActive: boolean) => void;

  // Система
  setIsHealthy: (isHealthy: boolean) => void;
  setSystemReady: (systemReady: boolean) => void;
  setLastHealthCheck: (date: Date | null) => void;

  // UI стан
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Комплексні дії
  resetSession: () => void;
  updateSessionInfo: (sessionId: string, stage: number) => void;
  markActionCompleted: () => void;
}

// ========== ПОЧАТКОВИЙ СТАН ==========
const initialState: WizardManagementState = {
  // Сесія
  sessionId: null,
  currentStage: 1,
  isActive: false,

  // Система
  isHealthy: false,
  systemReady: false,
  lastHealthCheck: null,

  // UI
  isLoading: false,
  error: null,
  lastActionTimestamp: null,
};

// ========== ZUSTAND STORE ==========
export const useWizardManagementStore = create<WizardManagementState & WizardManagementActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // ========== СЕСІЯ ACTIONS ==========
    setSessionId: (sessionId) =>
      set({
        sessionId,
        lastActionTimestamp: new Date(),
      }),

    setCurrentStage: (currentStage) =>
      set({
        currentStage,
        lastActionTimestamp: new Date(),
      }),

    setIsActive: (isActive) =>
      set({
        isActive,
        lastActionTimestamp: new Date(),
      }),

    // ========== СИСТЕМА ACTIONS ==========
    setIsHealthy: (isHealthy) => set({ isHealthy }),
    setSystemReady: (systemReady) => set({ systemReady }),
    setLastHealthCheck: (lastHealthCheck) => set({ lastHealthCheck }),

    // ========== UI ACTIONS ==========
    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // ========== КОМПЛЕКСНІ ACTIONS ==========
    resetSession: () =>
      set({
        sessionId: null,
        currentStage: 1,
        isActive: false,
        error: null,
        lastActionTimestamp: new Date(),
      }),

    updateSessionInfo: (sessionId, currentStage) =>
      set({
        sessionId,
        currentStage,
        isActive: true,
        lastActionTimestamp: new Date(),
      }),

    markActionCompleted: () =>
      set({
        lastActionTimestamp: new Date(),
      }),
  }))
);

// ========== СЕЛЕКТОРИ ДЛЯ ОПТИМІЗАЦІЇ ==========
export const selectSessionInfo = (state: WizardManagementState & WizardManagementActions) => ({
  sessionId: state.sessionId,
  currentStage: state.currentStage,
  isActive: state.isActive,
});

export const selectSystemState = (state: WizardManagementState & WizardManagementActions) => ({
  isHealthy: state.isHealthy,
  systemReady: state.systemReady,
  lastHealthCheck: state.lastHealthCheck,
});

export const selectLoadingState = (state: WizardManagementState & WizardManagementActions) => ({
  isLoading: state.isLoading,
  error: state.error,
});
