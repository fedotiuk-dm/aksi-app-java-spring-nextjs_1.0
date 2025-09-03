/**
 * Game Boosting Calculator Store
 * Zustand store for managing UI state of the game boosting calculator
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Game, Booster } from '@api/game';

export interface GameBoostingStore {
  // Selected game
  selectedGameId: string | null;
  selectedGame: Game | null;

  // Selected booster
  selectedBoosterId: string | null;
  selectedBooster: Booster | null;

  // Calculator state
  basePrice: number;
  selectedModifiers: string[];
  startLevel: number;
  targetLevel: number;
  serviceTypeCode: string;
  difficultyLevelCode: string;
  calculatedPrice: number | null;
  isCalculating: boolean;

  // UI state
  currentStep: 'game-selection' | 'booster-selection' | 'calculator' | 'summary';
  isGameSelectorOpen: boolean;
  isBoosterSelectorOpen: boolean;

  // Actions
  setSelectedGame: (gameId: string | null, game?: Game) => void;
  setSelectedBooster: (boosterId: string | null, booster?: Booster) => void;
  setBasePrice: (price: number) => void;
  setSelectedModifiers: (modifiers: string[]) => void;
  setStartLevel: (level: number) => void;
  setTargetLevel: (level: number) => void;
  setServiceTypeCode: (code: string) => void;
  setDifficultyLevelCode: (code: string) => void;
  setCalculatedPrice: (price: number | null) => void;
  setCalculating: (calculating: boolean) => void;
  setCurrentStep: (step: GameBoostingStore['currentStep']) => void;
  setGameSelectorOpen: (open: boolean) => void;
  setBoosterSelectorOpen: (open: boolean) => void;
  resetCalculator: () => void;
}

const GAME_SELECTION_STEP = 'game-selection';

export const useGameBoostingStore = create<GameBoostingStore>()(
  devtools(
    (set) => ({
      // Initial state
      selectedGameId: null,
      selectedGame: null,
      selectedBoosterId: null,
      selectedBooster: null,
      basePrice: 0,
      selectedModifiers: [],
      startLevel: 1,
      targetLevel: 100,
      serviceTypeCode: 'BOOSTING',
      difficultyLevelCode: 'STANDARD',
      calculatedPrice: null,
      isCalculating: false,
      currentStep: GAME_SELECTION_STEP,
      isGameSelectorOpen: false,
      isBoosterSelectorOpen: false,

      // Actions
      setSelectedGame: (gameId, game) => {
        set({
          selectedGameId: gameId,
          selectedGame: game,
          currentStep: gameId ? 'booster-selection' : GAME_SELECTION_STEP,
          // Reset dependent fields when game changes
          selectedBoosterId: null,
          selectedBooster: null,
          serviceTypeCode: '',
          difficultyLevelCode: '',
          selectedModifiers: [],
          basePrice: 0,
          calculatedPrice: null,
          startLevel: 1,
          targetLevel: 100,
        });
      },

      setSelectedBooster: (boosterId, booster) => {
        set({
          selectedBoosterId: boosterId,
          selectedBooster: booster,
          currentStep: boosterId ? 'calculator' : 'booster-selection',
          // Set default service type for boosting calculator
          serviceTypeCode: boosterId ? 'BOOSTING' : '',
          // Reset calculator state when booster changes
          selectedModifiers: [],
          calculatedPrice: null,
          basePrice: 0,
          startLevel: 1,
          targetLevel: 100,
        });
      },

      setBasePrice: (price) => set({ basePrice: price }),

      setSelectedModifiers: (modifiers) => set({ selectedModifiers: modifiers }),

      setStartLevel: (level) => set({ startLevel: level }),

      setTargetLevel: (level) => set({ targetLevel: level }),

      setServiceTypeCode: (code) => set({ serviceTypeCode: code }),

      setDifficultyLevelCode: (code) => set({ difficultyLevelCode: code }),

      setCalculatedPrice: (price) => set({ calculatedPrice: price }),

      setCalculating: (calculating) => set({ isCalculating: calculating }),

      setCurrentStep: (step) => set({ currentStep: step }),

      setGameSelectorOpen: (open) => set({ isGameSelectorOpen: open }),

      setBoosterSelectorOpen: (open) => set({ isBoosterSelectorOpen: open }),

      resetCalculator: () =>
        set({
          selectedGameId: null,
          selectedGame: null,
          selectedBoosterId: null,
          selectedBooster: null,
          basePrice: 0,
          selectedModifiers: [],
          startLevel: 1,
          targetLevel: 100,
          serviceTypeCode: 'BOOSTING',
          difficultyLevelCode: 'STANDARD',
          calculatedPrice: null,
          isCalculating: false,
          currentStep: GAME_SELECTION_STEP,
          isGameSelectorOpen: false,
          isBoosterSelectorOpen: false,
        }),
    }),
    {
      name: 'game-boosting-store',
    }
  )
);
