/**
 * Summary Section Component
 * Displays final order summary and handles order placement
 */

import { Box, Button, Typography, Card, CardContent, Divider, Alert } from '@mui/material';
import { useGameBoostingStore } from '../../store/game-boosting-store';

export const SummarySection = () => {
  const {
    selectedGame,
    selectedBooster,
    basePrice,
    calculatedPrice,
    selectedModifiers,
    setCurrentStep,
    resetCalculator,
  } = useGameBoostingStore();

  const handleBack = () => {
    setCurrentStep('calculator');
  };

  const handlePlaceOrder = () => {
    // TODO: Implement order placement logic
    alert('Order placement functionality will be implemented');
  };

  const handleStartOver = () => {
    resetCalculator();
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Step 4: Order Summary
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Review your boosting order details and confirm
      </Typography>

      {/* Order Summary Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Game
            </Typography>
            <Typography variant="body1">
              {selectedGame?.name} ({selectedGame?.category})
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Booster
            </Typography>
            <Typography variant="body1">{selectedBooster?.displayName}</Typography>
            <Typography variant="body2" color="text.secondary">
              Rating: {selectedBooster?.rating}/5.0
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Base Price
            </Typography>
            <Typography variant="body1">${basePrice?.toFixed(2)}</Typography>
          </Box>

          {selectedModifiers.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Selected Modifiers
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedModifiers.length} modifier(s) selected
                </Typography>
              </Box>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Final Price
            </Typography>
            <Typography variant="h6" color="primary">
              ${calculatedPrice?.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Order Confirmation Alert */}
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Your order is ready! Click &quot;Place Order&quot; to proceed with the payment and start
          the boosting service.
        </Typography>
      </Alert>

      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={handleBack}>
          Back to Calculator
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="text" onClick={handleStartOver}>
            Start Over
          </Button>

          <Button variant="contained" onClick={handlePlaceOrder} size="large">
            Place Order
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
