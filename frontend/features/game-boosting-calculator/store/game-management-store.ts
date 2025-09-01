/**
 * Game Management Store
 * Zustand store for managing CRUD operations for games
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Game } from '@api/game';

export interface GameManagementStore {
  // Data
  games: Game[];
  isLoading: boolean;
  error: string | null;

  // Actions - UI state management only
  setGames: (games: Game[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addGame: (game: Game) => void;
  updateGameInList: (gameId: string, gameData: Partial<Game>) => void;
  removeGame: (gameId: string) => void;
  clearError: () => void;
}

export const useGameManagementStore = create<GameManagementStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      games: [],
      isLoading: false,
      error: null,

      // Actions
      // UI state management actions
      setGames: (games: Game[]) => {
        set({ games });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      // Local state management (API calls should be in components)
      addGame: (game: Game) => {
        const currentGames = get().games;
        set({ games: [...currentGames, game] });
      },

      updateGameInList: (gameId: string, gameData: Partial<Game>) => {
        const currentGames = get().games;
        const updatedGames = currentGames.map((game) =>
          game.id === gameId ? { ...game, ...gameData } : game
        );
        set({ games: updatedGames });
      },

      removeGame: (gameId: string) => {
        const currentGames = get().games;
        const filteredGames = currentGames.filter((game) => game.id !== gameId);
        set({ games: filteredGames });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'game-management-store',
    }
  )
);
