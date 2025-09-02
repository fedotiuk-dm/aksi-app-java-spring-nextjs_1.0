/**
 * Difficulty Level Management Store
 * Zustand store for managing UI state of difficulty level management
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DifficultyLevel, Game } from '@api/game';

export interface DifficultyLevelManagementStore {
  // Data state
  difficultyLevels: DifficultyLevel[];
  games: Game[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setDifficultyLevels: (difficultyLevels: DifficultyLevel[]) => void;
  setGames: (games: Game[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useDifficultyLevelManagementStore = create<DifficultyLevelManagementStore>()(
  devtools(
    (set) => ({
      // Initial state
      difficultyLevels: [],
      games: [],
      isLoading: false,
      error: null,

      // Actions
      setDifficultyLevels: (difficultyLevels) => set({ difficultyLevels }),

      setGames: (games) => set({ games }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) =>
        set({
          error,
          isLoading: false,
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'difficulty-level-management-store',
    }
  )
);
