import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { PriceRow, ModifierLine } from '@shared/ui/molecules';
import { PriceDisplay, StatusAlert } from '@shared/ui/atoms';
import { useOrderWizardCart, usePricingCalculationOperations } from '@features/order-wizard/hooks';

export const LivePricingCalculator: React.FC = () => {
  const { cart, getCartItems } = useOrderWizardCart();
  const { error, calculation, isCalculating } = usePricingCalculationOperations(cart);
  
  const items = getCartItems();
  
  // Use calculation data if available, fallback to cart data
  const calculatedItems = calculation?.items || [];
  const calculatedTotal = calculation?.totals?.total || 0;

  console.log('📊 LivePricingCalculator state:', {
    cart: cart?.items.length,
    calculation: calculatedItems.length,
    isCalculating,
    calculatedTotal
  });

  // Show error if pricing calculation failed
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
            <Box key={calculatedItem.priceListItemId} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {calculatedItem.itemName} ({calculatedItem.quantity} шт.)
              </Typography>
              
              <PriceRow 
                label="Базова ціна"
                amount={calculatedItem.calculations.baseAmount}
              />
              
              {calculatedItem.calculations.modifiers.map((modifier) => (
                <ModifierLine
                  key={modifier.code}
                  name={modifier.name}
                  amount={modifier.amount}
                />
              ))}
              
              {calculatedItem.calculations.urgencyModifier?.amount &&
                  calculatedItem.calculations.urgencyModifier.amount !== 0 && (
                <ModifierLine
                  name={calculatedItem.calculations.urgencyModifier.name}
                  amount={calculatedItem.calculations.urgencyModifier.amount}
                />
              )}
              
              {calculatedItem.calculations.discountModifier?.amount &&
                  calculatedItem.calculations.discountModifier.amount !== 0 && (
                <ModifierLine
                  name={calculatedItem.calculations.discountModifier.name}
                  amount={calculatedItem.calculations.discountModifier.amount}
                />
              )}
              
              <PriceRow 
                label="Підсумок"
                amount={calculatedItem.total}
                sx={{ fontWeight: 'bold' }}
              />
              
              <Divider sx={{ my: 1 }} />
            </Box>
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

          {/* Загальна сума */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom color="primary.main">
              Загальна сума
            </Typography>
            <PriceDisplay 
              amount={calculatedTotal}
              variant="h4"
              fontWeight="bold"
              color="primary.main"
            />
            
            {/* Детальна розбивка загальних підсумків */}
            {calculation?.totals && (
              <Box sx={{ mt: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
                <PriceRow label="Підсумок предметів" amount={calculation.totals.itemsSubtotal} />
                {calculation.totals.urgencyAmount > 0 && (
                  <PriceRow 
                    label={`Терміновість (${calculation.totals.urgencyPercentage || 0}%)`} 
                    amount={calculation.totals.urgencyAmount} 
                  />
                )}
                {calculation.totals.discountAmount > 0 && (
                  <PriceRow 
                    label={`Знижка (${calculation.totals.discountPercentage || 0}%)`} 
                    amount={-calculation.totals.discountAmount}
                  />
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};