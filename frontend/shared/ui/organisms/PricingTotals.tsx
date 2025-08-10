import React from 'react';
import { Box, Divider } from '@mui/material';
import { PriceRow } from '@shared/ui';

type Props = {
  itemsSubtotal?: number;
  urgencyAmount?: number;
  discountAmount?: number;
  variant?: 'body2' | 'body1' | 'caption' | 'subtitle2' | 'subtitle1' | 'h6';
  sx?: Record<string, unknown>;
};

export const PricingTotals: React.FC<Props> = ({
  itemsSubtotal,
  urgencyAmount,
  discountAmount,
  variant = 'body2',
  sx,
}) => {
  const total = (itemsSubtotal || 0) + (urgencyAmount || 0) - (discountAmount || 0);

  return (
    <Box sx={sx}>
      <Divider sx={{ my: 2 }} />
      
      <PriceRow
        label="Підсумок предметів:"
        amount={itemsSubtotal}
        variant={variant}
        sx={{ mb: 1 }}
      />

      {(urgencyAmount ?? 0) > 0 && (
        <PriceRow
          label="Терміновість:"
          amount={urgencyAmount}
          variant={variant}
          pricePrefix="+"
          showBadge="increase"
          sx={{ mb: 1 }}
        />
      )}

      {(discountAmount ?? 0) > 0 && (
        <PriceRow
          label="Знижка:"
          amount={discountAmount}
          variant={variant}
          pricePrefix="-"
          showBadge="decrease"
          sx={{ mb: 1 }}
        />
      )}

      <Divider sx={{ my: 1 }} />
      
      <PriceRow
        label="Загальна вартість:"
        amount={total}
        variant="h6"
        fontWeight="medium"
        sx={{ alignItems: 'center' }}
      />
    </Box>
  );
};