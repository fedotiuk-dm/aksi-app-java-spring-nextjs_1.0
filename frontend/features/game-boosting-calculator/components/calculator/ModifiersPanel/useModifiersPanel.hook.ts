import { useListGameModifiers, type GameModifierInfo } from '@api/game';
import { useGameBoostingStore } from '../../../store/game-boosting-store';

export const useModifiersPanel = () => {
  const { selectedModifiers, selectedGame, serviceTypeCode } = useGameBoostingStore();

  // Simple approach like admin - fetch all modifiers and filter on frontend
  const {
    data: modifiersResponse,
    isLoading,
    error,
  } = useListGameModifiers(
    undefined, // Get ALL modifiers without any filters like admin does
    {
      query: {
        enabled: !!selectedGame?.code,
        select: (data) => data?.modifiers || [],
      },
    }
  );

  const allModifiers = (modifiersResponse as unknown as GameModifierInfo[]) || [];

  // Filter modifiers on frontend like admin does

  const modifiers = allModifiers.filter((modifier: GameModifierInfo) => {
    // Filter by game code if available
    if (selectedGame?.code) {
      // Show modifiers that belong to the selected game
      const belongsToGame = modifier.gameCode === selectedGame.code;

      // Also show modifiers that are game-agnostic (empty gameCode)
      const isGameAgnostic = !modifier.gameCode || modifier.gameCode === '';

      // Filter by service type if specified
      let matchesServiceType = true;
      if (serviceTypeCode && modifier.serviceTypeCodes && modifier.serviceTypeCodes.length > 0) {
        matchesServiceType = modifier.serviceTypeCodes.includes(serviceTypeCode);
      } else if (
        serviceTypeCode &&
        (!modifier.serviceTypeCodes || modifier.serviceTypeCodes.length === 0)
      ) {
        // If modifier has no service type codes, show it for all service types
        matchesServiceType = true;
      }

      return (belongsToGame || isGameAgnostic) && matchesServiceType && modifier.active;
    }

    // If no game selected, show only active modifiers
    return modifier.active;
  });

  return {
    modifiers,
    isLoading,
    error,
    selectedModifiers,
    selectedGame,
    serviceTypeCode,
  };
};
