'use client';

/**
 * Calculator Section Component
 * Handles price calculation with modifiers
 */

import { Box, Button, Typography, TextField, Alert } from '@mui/material';
import { useGameBoostingStore } from '../../store/game-boosting-store';
import { useCalculatePrice } from '@api/game';

export const CalculatorSection = () => {
  const {
    selectedGame,
    selectedBooster,
    basePrice,
    selectedModifiers,
    calculatedPrice,
    setBasePrice,
    setCalculatedPrice,
    setCalculating,
    setCurrentStep,
  } = useGameBoostingStore();

  // Orval API hook for price calculation
  const calculateMutation = useCalculatePrice();

  const handleCalculate = async () => {
    if (!selectedGame || !selectedBooster || !basePrice) return;

    setCalculating(true);

    try {
      const result = await calculateMutation.mutateAsync({
        data: {
          gameCode: selectedGame.code || selectedGame.id,
          serviceTypeCode: 'BOOSTING', // Default service type
          difficultyLevelCode: 'STANDARD', // Default difficulty
          targetLevel: 100, // Example target level
          startLevel: 1, // Example start level
          modifiers: selectedModifiers,
        },
      });

      setCalculatedPrice(result.finalPrice);
    } catch (error) {
      console.error('Price calculation error:', error);
    } finally {
      setCalculating(false);
    }
  };

  const handleBack = () => {
    setCurrentStep('booster-selection');
  };

  const handleNext = () => {
    setCurrentStep('summary');
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Step 3: Price Calculator
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Configure your boosting service and calculate the final price
      </Typography>

      {/* Selected Items Summary */}
      <Box sx={{ mb: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Game:</strong> {selectedGame?.name} • <strong>Booster:</strong>{' '}
            {selectedBooster?.displayName}
          </Typography>
        </Alert>
      </Box>

      {/* Base Price Input */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Base Price ($)"
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
          fullWidth
          InputProps={{
            startAdornment: '$',
          }}
        />
      </Box>

      {/* Modifiers Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Modifiers
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select additional services and modifiers to customize your boosting package
        </Typography>
        {/* ModifiersPanel will be implemented next */}
      </Box>

      {/* Calculate Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleCalculate}
          disabled={calculateMutation.isPending || !basePrice}
          fullWidth
          size="large"
        >
          {calculateMutation.isPending ? 'Calculating...' : 'Calculate Price'}
        </Button>
      </Box>

      {/* Calculation Result */}
      {calculatedPrice ? (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
          <Typography variant="h6" color="success.contrastText">
            Final Price: ${calculatedPrice.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="success.contrastText" sx={{ opacity: 0.8 }}>
            Includes all selected modifiers and services
          </Typography>
        </Box>
      ) : null}

      {/* Error Display */}
      {calculateMutation.error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Calculation failed: {String(calculateMutation.error)}
          </Typography>
        </Alert>
      ) : null}

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={handleBack}>
          Back
        </Button>

        <Button variant="contained" onClick={handleNext} disabled={!calculatedPrice}>
          Next: Summary
        </Button>
      </Box>
    </Box>
  );
};
