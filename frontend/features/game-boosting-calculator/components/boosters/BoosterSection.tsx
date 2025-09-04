'use client';

/**
 * Booster Section Component
 * Handles booster selection and display
 */

import { Box, Button, Typography } from '@mui/material';
import { useGameBoostingStore } from '@game-boosting-calculator/store';
import { BoosterSelector } from './BoosterSelector';

export const BoosterSection = () => {
  const { selectedGame, selectedBooster, setCurrentStep } = useGameBoostingStore();

  const handleNext = () => {
    if (selectedBooster) {
      setCurrentStep('calculator');
    }
  };

  const handleBack = () => {
    setCurrentStep('game-selection');
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Step 2: Booster Selection
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Choose a booster for {selectedGame?.name}
      </Typography>

      {/* Selected Game Info */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="subtitle1" fontWeight="medium">
          Selected Game: {selectedGame?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Category: {selectedGame?.category}
        </Typography>
      </Box>

      {/* Booster Selection */}
      <Box sx={{ mb: 3 }}>
        <BoosterSelector />
      </Box>

      {/* Selected Booster Display */}
      {selectedBooster && (
        <Box
          sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'primary.main', borderRadius: 1 }}
        >
          <Typography variant="h6" gutterBottom>
            Selected Booster:
          </Typography>
          <Typography variant="body1">{selectedBooster.displayName}</Typography>
          <Typography variant="body2" color="text.secondary">
            Rating: {selectedBooster.rating}/5.0 • Completed orders: {selectedBooster.totalOrders}
          </Typography>
        </Box>
      )}

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={handleBack}>
          Back
        </Button>

        <Button variant="contained" onClick={handleNext} disabled={!selectedBooster}>
          Next: Calculator
        </Button>
      </Box>
    </Box>
  );
};
