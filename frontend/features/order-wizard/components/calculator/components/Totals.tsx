import React from 'react';
import { Box, Chip, Divider, Typography } from '@mui/material';

type Props = {
  itemsSubtotal?: number;
  urgencyAmount?: number;
  discountAmount?: number;
  formatPrice: (v?: number) => string;
  rowBetweenSx: Record<string, unknown>;
  body2Variant: 'body2' | 'body1' | 'caption' | 'subtitle2' | 'subtitle1' | 'h6';
};

export const Totals: React.FC<Props> = ({
  itemsSubtotal,
  urgencyAmount,
  discountAmount,
  formatPrice,
  rowBetweenSx,
  body2Variant,
}) => {
  const total = (itemsSubtotal || 0) + (urgencyAmount || 0) - (discountAmount || 0);

  return (
    <>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ ...rowBetweenSx, mb: 1 }}>
        <Typography variant={body2Variant}>Підсумок предметів:</Typography>
        <Typography variant={body2Variant}>{formatPrice(itemsSubtotal)}</Typography>
      </Box>

      {urgencyAmount && urgencyAmount > 0 && (
        <Box sx={{ ...rowBetweenSx, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant={body2Variant}>Терміновість:</Typography>
            <Chip label="+" size="small" color="warning" />
          </Box>
          <Typography variant={body2Variant}>+{formatPrice(urgencyAmount)}</Typography>
        </Box>
      )}

      {discountAmount && discountAmount > 0 && (
        <Box sx={{ ...rowBetweenSx, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant={body2Variant}>Знижка:</Typography>
            <Chip label="-" size="small" color="success" />
          </Box>
          <Typography variant={body2Variant}>-{formatPrice(discountAmount)}</Typography>
        </Box>
      )}

      <Divider sx={{ my: 1 }} />
      <Box sx={{ ...rowBetweenSx, alignItems: 'center' }}>
        <Typography variant="h6">Загальна вартість:</Typography>
        <Typography variant="h6" color="primary">
          {formatPrice(total)}
        </Typography>
      </Box>
    </>
  );
};
