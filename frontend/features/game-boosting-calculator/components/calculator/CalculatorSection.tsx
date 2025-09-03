'use client';

/**
 * Calculator Section Component
 * Handles price calculation with modifiers
 */

import { Box, Button, Typography, TextField, Alert } from '@mui/material';
import { useGameBoostingStore } from '../../store/game-boosting-store';
import { useCalculatorOperations } from '../../hooks/useCalculatorOperations';
import { ModifiersPanel } from './ModifiersPanel/ModifiersPanel';
import { PriceDisplay } from '@/shared/ui/atoms/PriceDisplay';

export const CalculatorSection = () => {
  const {
    selectedGame,
    selectedBooster,
    basePrice,
    calculatedPrice,
    setBasePrice,
    setCurrentStep,
    serviceTypeCode,
    startLevel,
    targetLevel,
    setStartLevel,
    setTargetLevel,
    difficultyLevelCode,
  } = useGameBoostingStore();

  // Our calculator operations hook with dynamic data
  const { calculatePrice, isCalculating, error, canCalculate, calculatorConfig, validationErrors } =
    useCalculatorOperations();

  const handleCalculate = async () => {
    if (!canCalculate) return;

    try {
      await calculatePrice();
    } catch (error) {
      console.error('Price calculation error:', error);
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

      {/* Dynamic Level Inputs */}
      {calculatorConfig.showStartLevel && calculatorConfig.showTargetLevel && (
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            label="Start Level"
            type="number"
            value={startLevel}
            onChange={(e) => setStartLevel(Number(e.target.value))}
            fullWidth
            inputProps={{
              min: calculatorConfig.levelRange.min,
              max: calculatorConfig.levelRange.max,
            }}
          />
          <TextField
            label="Target Level"
            type="number"
            value={targetLevel}
            onChange={(e) => setTargetLevel(Number(e.target.value))}
            fullWidth
            inputProps={{ min: startLevel + 1, max: calculatorConfig.levelRange.max }}
          />
        </Box>
      )}

      {/* Service Type Selection */}
      {calculatorConfig.showServiceType && (
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Service Type"
            value={serviceTypeCode}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            helperText="Service type is automatically selected based on your booster choice"
          />
        </Box>
      )}

      {/* Difficulty Level Selection */}
      {calculatorConfig.showDifficultyLevel && (
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Difficulty Level"
            value={difficultyLevelCode}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            helperText="Difficulty level is automatically determined"
          />
        </Box>
      )}

      {/* Modifiers Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Modifiers
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select additional services and modifiers to customize your boosting package
        </Typography>
        <ModifiersPanel />
      </Box>

      {/* Calculate Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleCalculate}
          disabled={isCalculating || !canCalculate}
          fullWidth
          size="large"
        >
          {isCalculating ? 'Calculating...' : 'Calculate Price'}
        </Button>
      </Box>

      {/* Calculation Result */}
      {calculatedPrice ? (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
          <Typography variant="h6" color="success.contrastText">
            Final Price:{' '}
            <PriceDisplay amount={calculatedPrice} currency="USD" inline={true} fontWeight="bold" />
          </Typography>
          <Typography variant="body2" color="success.contrastText" sx={{ opacity: 0.8 }}>
            Includes all selected modifiers and services
          </Typography>
        </Box>
      ) : null}

      {/* Validation Errors */}
      {validationErrors.length > 0 ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            Please fix the following issues:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {validationErrors.map((error, index) => (
              <li key={index}>
                <Typography variant="body2">{error}</Typography>
              </li>
            ))}
          </ul>
        </Alert>
      ) : null}

      {/* Error Display */}
      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">Calculation failed: {String(error)}</Typography>
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
