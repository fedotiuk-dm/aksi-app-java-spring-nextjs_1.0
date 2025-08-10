import React from 'react';
import { Box, Typography } from '@mui/material';
import { StatusAlert } from '@shared/ui/atoms';
import { ItemBreakdown, PricingTotals } from '@shared/ui/organisms';
import { useOrderWizardCart, usePricingCalculationOperations } from '@features/order-wizard/hooks';

export const LivePricingCalculator: React.FC = () => {
  const { cart, getCartItems } = useOrderWizardCart();
  const { error, calculation } = usePricingCalculationOperations(cart, false);
  
  const items = getCartItems();
  const calculatedItems = calculation?.items || [];

  if (error) {
    return (
      <StatusAlert 
        severity="error" 
        message="Помилка розрахунку ціни" 
      />
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Розрахунок ціни
      </Typography>

      {items.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          Додайте предмети для розрахунку
        </Typography>
      ) : (
        <Box>
          {/* Розбивка по предметах */}
          {calculatedItems.map((calculatedItem) => (
            <ItemBreakdown
              key={calculatedItem.priceListItemId}
              item={{
                id: calculatedItem.priceListItemId,
                name: calculatedItem.itemName,
                quantity: calculatedItem.quantity,
                basePrice: calculatedItem.calculations.baseAmount,
                total: calculatedItem.total,
                modifierDetails: [
                  ...calculatedItem.calculations.modifiers,
                  ...(calculatedItem.calculations.urgencyModifier?.amount !== 0 ? [calculatedItem.calculations.urgencyModifier] : []),
                  ...(calculatedItem.calculations.discountModifier?.amount !== 0 ? [calculatedItem.calculations.discountModifier] : [])
                ].filter(Boolean)
              }}
            />
          ))}

          {/* Показати попередження якщо є */}
          {calculation?.warnings && calculation.warnings.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {calculation.warnings.map((warning, index) => (
                <StatusAlert 
                  key={index}
                  severity="warning" 
                  message={warning}
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          )}

          {/* Загальні підсумки */}
          {calculation?.totals && (
            <PricingTotals
              itemsSubtotal={calculation.totals.itemsSubtotal}
              urgencyAmount={calculation.totals.urgencyAmount}
              discountAmount={calculation.totals.discountAmount}
              sx={{ mt: 2 }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};