import React from 'react';
import { Box, Divider } from '@mui/material';
import { PriceRow, ModifierLine } from '@shared/ui';
import { QuantityIndicator, StatusAlert } from '../atoms';

type ModifierDetail = { code: string; name: string; amount: number };

type Item = {
  id: string;
  name?: string;
  quantity: number;
  basePrice?: number;
  subtotal?: number;
  total?: number;
  modifierDetails?: ModifierDetail[];
  categoryCode?: string;
};

type Props = {
  item: Item;
  discountType?: string;
  restrictedDiscountCategories?: Set<string>;
  variant?: 'body2' | 'body1' | 'caption' | 'subtitle2' | 'subtitle1' | 'h6';
  sx?: Record<string, unknown>;
};

export const ItemBreakdown: React.FC<Props> = ({
  item,
  discountType,
  restrictedDiscountCategories,
  variant = 'body2',
  sx,
}) => {
  const discountRestricted = item.categoryCode && restrictedDiscountCategories?.has(item.categoryCode);

  return (
    <Box sx={{ mb: 2, ...sx }}>
      <PriceRow
        label={item.name || 'Предмет'}
        amount={item.basePrice}
        variant={variant}
        sx={{ mb: 1 }}
      />

      <QuantityIndicator quantity={item.quantity} variant={variant} />
      
      {item.quantity > 1 && (
        <PriceRow
          label={`Кількість: ${item.quantity}`}
          amount={item.subtotal}
          variant={variant}
          sx={{ mb: 1 }}
        />
      )}

      {item.modifierDetails && item.modifierDetails.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {item.modifierDetails.map((modifier) => (
            <ModifierLine
              key={modifier.code}
              name={modifier.name}
              amount={modifier.amount}
              type="modifier"
            />
          ))}
        </Box>
      )}

      {discountType !== 'NONE' && discountRestricted && (
        <StatusAlert
          message={`Для категорії ${item.categoryCode} знижки не застосовуються (прасування/прання/фарбування).`}
          severity="info"
          sx={{ mt: 1 }}
        />
      )}

      <PriceRow
        label="Разом предмет:"
        amount={item.total}
        variant={variant}
        fontWeight="medium"
        sx={{ mt: 1 }}
      />

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};