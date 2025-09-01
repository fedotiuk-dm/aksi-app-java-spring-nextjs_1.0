'use client';

/**
 * Game Section Component
 * Handles game selection and search functionality
 */

import { Box, Button, Typography } from '@mui/material';
import { useGameBoostingStore } from '../../store/game-boosting-store';
import { GameSearch } from './GameSearch';

export const GameSection = () => {
  const { selectedGame, setCurrentStep } = useGameBoostingStore();

  const handleNext = () => {
    if (selectedGame) {
      setCurrentStep('booster-selection');
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Step 1: Game Selection
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Select the game you want to boost
      </Typography>

      {/* Game Search */}
      <Box sx={{ mb: 3 }}>
        <GameSearch />
      </Box>

      {/* Selected Game Display */}
      {selectedGame && (
        <Box
          sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'primary.main', borderRadius: 1 }}
        >
          <Typography variant="h6" gutterBottom>
            Selected Game:
          </Typography>
          <Typography variant="body1">
            {selectedGame.name} ({selectedGame.category})
          </Typography>
        </Box>
      )}

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" disabled>
          Back
        </Button>

        <Button variant="contained" onClick={handleNext} disabled={!selectedGame}>
          Next: Select Booster
        </Button>
      </Box>
    </Box>
  );
};
