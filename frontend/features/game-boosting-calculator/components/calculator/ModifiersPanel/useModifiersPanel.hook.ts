import { useListGameModifiers, type GameModifierInfo } from '@api/game';
import { useGameBoostingStore } from '@game-boosting-calculator/store';

export const useModifiersPanel = () => {
  const { selectedModifiers, selectedGame, serviceTypeCode } = useGameBoostingStore();

  // Let backend filter modifiers properly
  const {
    data: modifiersResponse,
    isLoading,
    error,
  } = useListGameModifiers(
    {
      active: true,
      gameCode: selectedGame?.code || undefined,
      serviceTypeCode: serviceTypeCode || undefined,
    },
    {
      query: {
        enabled: !!selectedGame?.code, // Only fetch when game is selected
        select: (data) => data?.modifiers || [],
      },
    }
  );

  const modifiers = (modifiersResponse as unknown as GameModifierInfo[]) || [];

  return {
    modifiers,
    isLoading,
    error,
    selectedModifiers,
    selectedGame,
    serviceTypeCode,
  };
};
