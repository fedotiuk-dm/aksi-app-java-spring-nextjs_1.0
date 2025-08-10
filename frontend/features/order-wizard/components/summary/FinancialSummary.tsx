import React from 'react';
import { Box, Typography } from '@mui/material';
import { FormSection } from '@shared/ui/molecules';
import { PricingTotals } from '@shared/ui/organisms';
import { StatusAlert } from '@shared/ui/atoms';
import { useFinancialSummaryOperations } from '@features/order-wizard/hooks';

export const FinancialSummary: React.FC = () => {
  const {
    totals,
    hasItems,
    isCalculating,
    error
  } = useFinancialSummaryOperations();

  if (error) {
    return (
      <FormSection title="Фінансовий підсумок">
        <StatusAlert 
          severity="error" 
          message="Помилка розрахунку фінансового підсумку"
        />
      </FormSection>
    );
  }

  if (!hasItems) {
    return (
      <FormSection title="Фінансовий підсумок">
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          Додайте предмети для розрахунку
        </Typography>
      </FormSection>
    );
  }

  return (
    <FormSection title="Фінансовий підсумок">
      <Box>
        {isCalculating ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Розрахунок...
          </Typography>
        ) : totals ? (
          <PricingTotals
            itemsSubtotal={totals.itemsSubtotal}
            urgencyAmount={totals.urgencyAmount}
            discountAmount={totals.discountAmount}
            variant="body2"
          />
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Немає даних для розрахунку
          </Typography>
        )}
      </Box>
    </FormSection>
  );
};