import React, { useEffect } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import type { ItemCharacteristics } from '@/shared/api/generated/pricing/';
import { useLiveItemPricing } from '@/features/order-wizard/pricing/use-live-item-pricing';

type Props = {
  priceListItemId: string;
  quantity: number;
  characteristics?: ItemCharacteristics;
  modifierCodes?: string[];
  globalModifiers?: {
    urgencyType?: 'NORMAL' | 'EXPRESS_48H' | 'EXPRESS_24H';
    discountType?: 'NONE' | 'EVERCARD' | 'SOCIAL_MEDIA' | 'MILITARY' | 'OTHER';
    discountPercentage?: number;
  };
};

export const LiveItemPricePreview: React.FC<Props> = ({
  priceListItemId,
  quantity,
  characteristics,
  modifierCodes,
  globalModifiers,
}) => {
  const { calculateItem, state } = useLiveItemPricing();

  useEffect(() => {
    if (!priceListItemId || !quantity) return;
    // debounce could be added if needed
    void calculateItem({
      priceListItemId,
      quantity,
      characteristics,
      modifierCodes,
      globalModifiers,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceListItemId, quantity, characteristics, modifierCodes, globalModifiers]);

  const item = state.data?.items?.[0];

  if (state.isPending) {
    return (
      <Box sx={{ py: 1 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!item) return null;

  const format = (v?: number) => `${((v || 0) / 100).toFixed(2)} ₴`;

  return (
    <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1, p: 1.5 }}>
      <Typography variant="subtitle2" gutterBottom>
        Попередній розрахунок (онлайн)
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block">
        База × к-сть: {format(item.calculations.baseAmount)}
      </Typography>
      {item.calculations.modifiers?.map((m) => (
        <Typography key={m.code} variant="caption" color="text.secondary" display="block">
          {m.name}: {format(m.amount)}
        </Typography>
      ))}
      <Typography variant="caption" color="text.secondary" display="block">
        Підсумок: {format(item.calculations.subtotal)}
      </Typography>
      {item.calculations.urgencyModifier && (
        <Typography variant="caption" color="text.secondary" display="block">
          Терміновість: {format(item.calculations.urgencyModifier.amount)}
        </Typography>
      )}
      {item.calculations.discountModifier && (
        <Typography variant="caption" color="text.secondary" display="block">
          Знижка: -{format(item.calculations.discountModifier.amount)}
        </Typography>
      )}
      <Typography variant="body2" fontWeight="medium">
        Разом предмет: {format(item.total)}
      </Typography>
    </Box>
  );
};
