'use client';

/**
 * Game Boosting Calculator - Main Component
 * Clean architecture implementation following order-wizard pattern
 */

import { Box, Container, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { useGameBoostingStore } from '@game-boosting-calculator/store';

// Import sections
import { GameSection } from './components/games/GameSection';
import { BoosterSection } from './components/boosters/BoosterSection';
import { CalculatorSection } from './components/calculator/CalculatorSection';
import { SummarySection } from './components/summary/SummarySection';

const steps = [
  { label: 'Game Selection', key: 'game-selection' },
  { label: 'Booster Selection', key: 'booster-selection' },
  { label: 'Calculator', key: 'calculator' },
  { label: 'Summary', key: 'summary' },
];

export const GameBoostingCalculator = () => {
  const { currentStep } = useGameBoostingStore();

  const activeStepIndex = steps.findIndex((step) => step.key === currentStep);

  const renderCurrentSection = () => {
    switch (currentStep) {
      case 'game-selection':
        return <GameSection />;
      case 'booster-selection':
        return <BoosterSection />;
      case 'calculator':
        return <CalculatorSection />;
      case 'summary':
        return <SummarySection />;
      default:
        return <GameSection />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Game Boosting Calculator
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Select a game, booster and calculate service costs
          </Typography>
        </Box>

        {/* Stepper */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStepIndex} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.key}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Current Section */}
        <Box sx={{ mt: 4 }}>{renderCurrentSection()}</Box>
      </Paper>
    </Container>
  );
};
